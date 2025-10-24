import { SubmitHandler, useForm } from "react-hook-form";
import { AddVacancySchema } from "../../../../schemas/AddVacancySchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateVacancyMutation,
  useArchiveVacancyByIdMutation,
  useCreateStatusVacancyByIdMutation,
} from "../../../../store/querySlices/vacanciesQuerySlice";
import { useGetAllUserDataQuery } from "../../../../store/querySlices/profileQuerySlice";
import {
  notifyError,
  notifySuccess,
} from "../../../Notifications/NotificationService";
import {
  closeConfirmation,
  closeModal,
} from "../../../../store/slices/modalSlice/modalSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  StatusName,
  RejectReason,
  RequiredFieldsProps,
} from "../../../../types/vacancies.types";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const useVacancy = () => {
  const { t } = useTranslation();
  const { refetch } = useGetAllUserDataQuery();
  const [createVacancy] = useCreateVacancyMutation();
  const [archiveVacancyById] = useArchiveVacancyByIdMutation();
  const [createStatusVacancyById] = useCreateStatusVacancyByIdMutation();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.statusVacancy.newStatuses);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const defaultValues: z.infer<typeof AddVacancySchema> = useMemo(
    () => ({
      company: "",
      vacancy: "",
      link: "",
      communication: "",
      location: "",
      note: "",
      work_type: "office" as const, // літерал union
      isArchived: false,
      resume: false, // обов'язково
      reject: false, // обов'язково
      resumeDropdown: "",
      rejectDropdown: "",
    }),
    []
  );
  const {
    register,
    resetField,
    reset,
    handleSubmit,
    getValues,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof AddVacancySchema>>({
    defaultValues,
    resolver: zodResolver(AddVacancySchema),
    mode: "onBlur",
  });

  const watchedValues = watch();

  const isFormChanged = useMemo(() => {
    return Object.keys(defaultValues).some((key) => {
      const k = key as keyof typeof defaultValues;
      return watchedValues[k] !== defaultValues[k];
    });
  }, [watchedValues, defaultValues]);

  const isButtonDisabled = useCallback(() => {
    const requiredFields: RequiredFieldsProps[] = [
      "company",
      "vacancy",
      "link",
      "location",
    ];
    const hasEmptyRequiredFields = requiredFields.some(
      (field: RequiredFieldsProps) => {
        const value = watch(field);
        return !value;
      }
    );
    const hasValidationErrors = !!Object.keys(errors).length;
    return hasEmptyRequiredFields || hasValidationErrors;
  }, [watch, errors]);

  const onSubmit: SubmitHandler<z.infer<typeof AddVacancySchema>> = async (
    data
  ) => {
    try {
      const {
        company,
        vacancy,
        link,
        communication,
        location,
        note,
        work_type,
        isArchived,
      } = data;
      setIsLoading(true);

      // 1 - запит на збереження вакансії
      const response = await createVacancy({
        company,
        vacancy,
        link,
        communication,
        location,
        note,
        work_type,
      }).unwrap();

      // 2 - id вакансії для подальших запитів
      const idVacancy = response.id;

      // 3 - архівуємо
      if (isArchived) {
        await archiveVacancyById({
          id: idVacancy,
        }).unwrap();
      }

      // 4 - зберігаємо статуси
      for (const elem of status) {
        if (elem.date !== "1970-01-01T00:00:00.000Z") {
          await createStatusVacancyById({
            vacancyId: idVacancy,
            name: elem.name as StatusName,
            date: elem.date || "",
            resumeId: elem.resumeId,
            rejectReason: elem.rejectReason as RejectReason,
          }).unwrap();
        }
      }
      refetch();
      reset();
      notifySuccess(t("notification.vacancyAdded"));
    } catch (error) {
      notifyError(t("notification.vacancyError"));
      console.error(error);
    }
    setIsLoading(false);
    dispatch(closeConfirmation());
    dispatch(closeModal());
  };

  return {
    register,
    resetField,
    reset,
    handleSubmit,
    getValues,
    setValue,
    errors,
    onSubmit,
    isLoading,
    isButtonDisabled,
    watch,
    clearErrors,
    isFormChanged,
  };
};

export default useVacancy;
