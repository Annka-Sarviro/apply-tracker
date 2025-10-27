import { SubmitHandler, useForm } from "react-hook-form";
import { AddVacancySchema } from "@/schemas/AddVacancySchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useArchiveVacancyByIdMutation,
  useCreateStatusVacancyByIdMutation,
  useUpdateVacancyByIdMutation,
  useDeleteStatusVacancyByIdMutation,
  useUpdateSpecificStatusVacancyByIdMutation,
} from "@/store/querySlices/vacanciesQuerySlice";
import { useGetAllUserDataQuery } from "@/store/querySlices/profileQuerySlice";
import {
  notifyError,
  notifySuccess,
} from "../../../Notifications/NotificationService";
import {
  closeConfirmation,
  closeModal,
} from "@/store/slices/modalSlice/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  StatusName,
  RejectReason,
  RequiredFieldsProps,
} from "@/types/vacancies.types";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteVacancyByIdMutation } from "@/store/querySlices/vacanciesQuerySlice";
import { useNavigate } from "react-router-dom";

const useEditVacancy = () => {
  const { t } = useTranslation();
  const { refetch } = useGetAllUserDataQuery();
  const [updateVacancyById] = useUpdateVacancyByIdMutation();

  const [createStatusVacancyById] = useCreateStatusVacancyByIdMutation();
  const [deleteStatusVacancyById] = useDeleteStatusVacancyByIdMutation();
  const [updateSpecificStatusVacancyById] =
    useUpdateSpecificStatusVacancyByIdMutation();

  const [archiveVacancyById] = useArchiveVacancyByIdMutation();
  const dispatch = useAppDispatch();
  const { previousStatuses, newStatuses } = useAppSelector(
    (state) => state.statusVacancy
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { vacancyData } = useAppSelector((state) => state.modal);

  const {
    register,
    resetField,
    reset,
    handleSubmit,
    getValues,
    setValue,
    watch,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof AddVacancySchema>>({
    defaultValues: {
      company: "",
      vacancy: "",
      link: "",
      communication: "",
      location: "",
      note: "",
      work_type: "office",
      isArchived: false,

      resume: false,
      reject: false,
      resumeDropdown: "",
      rejectDropdown: "",
    },
    resolver: zodResolver(AddVacancySchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (vacancyData) {
      const findStatusId = (
        statusName: string,
        key: "resumeId" | "rejectReason"
      ) =>
        vacancyData.statuses.find((item) => item.name === statusName)?.[key] ||
        "";

      reset({
        company: vacancyData.company,
        vacancy: vacancyData.vacancy,
        link: vacancyData.link,
        communication: vacancyData.communication,
        location: vacancyData.location,
        note: vacancyData.note,
        work_type: vacancyData.work_type,
        isArchived: vacancyData.isArchived,
        resumeDropdown: findStatusId("resume", "resumeId"),
        rejectDropdown: findStatusId("reject", "rejectReason"),
      });
    }
  }, [vacancyData, reset, dispatch]);

  const watchedValues = watch();
  const isFormChanged = useMemo(() => {
    if (!vacancyData) return false;
    return (
      watchedValues.company !== vacancyData.company ||
      watchedValues.vacancy !== vacancyData.vacancy ||
      watchedValues.link !== vacancyData.link ||
      watchedValues.communication !== vacancyData.communication ||
      watchedValues.location !== vacancyData.location ||
      watchedValues.note !== vacancyData.note ||
      watchedValues.work_type !== vacancyData.work_type ||
      JSON.stringify(previousStatuses) !== JSON.stringify(newStatuses)
    );
  }, [watchedValues, vacancyData, previousStatuses, newStatuses]);

  // deleteVacancy
  const [deleteVacancyById] = useDeleteVacancyByIdMutation();

  const deleteVacancy = async () => {
    try {
      setIsLoading(true);
      await deleteVacancyById({ id: vacancyData?.id as string }).unwrap();
      refetch();
      reset();
      notifySuccess(t("notification.vacancyDelete"));
    } catch (err) {
      console.log(err);
      notifyError(t("notification.vacancyDeleteError"));
    }
    setIsLoading(false);
    dispatch(closeConfirmation());
    dispatch(closeModal());
  };

  //-----------------------------------------------------
  const navigate = useNavigate();

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

      // 1 - запит на збереження вакансії - пропускаємо

      // 2 - id вакансії для подальших запитів
      const idVacancy = vacancyData?.id || "";

      // 3 - запит на збереження вакансії після редагування
      await updateVacancyById({
        id: idVacancy,
        company,
        vacancy,
        link,
        communication,
        location,
        note,
        work_type,
      }).unwrap();

      // 3 - архівуємо
      if (vacancyData?.isArchived !== isArchived) {
        await archiveVacancyById({
          id: idVacancy,
        }).unwrap();
        navigate(isArchived ? "/archive" : "/vacancies");
      }

      // 4 - зберігаємо статуси

      for (let i: number = 0; i <= newStatuses.length; i++) {
        const prevDate = previousStatuses[i]?.date || "";
        const newDate = newStatuses[i]?.date || "";

        if (prevDate !== newDate) {
          // створити статус
          if (prevDate === "1970-01-01T00:00:00.000Z") {
            await createStatusVacancyById({
              vacancyId: idVacancy,
              name: newStatuses[i].name as StatusName,
              date: newStatuses[i].date || "",
              resumeId: newStatuses[i].resumeId,
              rejectReason: newStatuses[i].rejectReason as RejectReason,
            }).unwrap();
          }

          // створити додатковий етап
          if (!prevDate && newDate !== "1970-01-01T00:00:00.000Z") {
            await createStatusVacancyById({
              vacancyId: idVacancy,
              name: newStatuses[i].name as StatusName,
              date: newStatuses[i].date || "",
              resumeId: newStatuses[i].resumeId,
              rejectReason: newStatuses[i].rejectReason as RejectReason,
            }).unwrap();
            continue;
          }

          // видалити статус
          if (prevDate && newDate === "1970-01-01T00:00:00.000Z") {
            await deleteStatusVacancyById({
              vacancyId: idVacancy,
              id: newStatuses[i].id,
            }).unwrap();
          }

          // редагувати статус
          if (
            prevDate !== "1970-01-01T00:00:00.000Z" &&
            newDate !== "1970-01-01T00:00:00.000Z"
          ) {
            await updateSpecificStatusVacancyById({
              vacancyId: idVacancy,
              statusId: newStatuses[i].id,
              name: newStatuses[i].name as StatusName,
              date: newStatuses[i].date || "",
              resumeId: newStatuses[i].resumeId,
              rejectReason: newStatuses[i].rejectReason as RejectReason,
            }).unwrap();
          }
        }
      }

      refetch();
      reset();
      notifySuccess(t("notification.vacancyEdit"));
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
    vacancyData,
    deleteVacancy,
    isFormChanged,
    watch,
    trigger,
    isButtonDisabled,
    clearErrors,
  };
};

export default useEditVacancy;
