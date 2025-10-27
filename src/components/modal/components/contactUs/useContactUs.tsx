import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateSupportMutation,
  // useDeleteSupportByIdMutation,
  useUpdateSupportByIdMutation,
} from "@/store/querySlices/supportsQuerySlice";
import { ContactUsSchema } from "@/schemas/ContactUsSchema";

function useContactUs(type: "addSupport" | "updateSupport") {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // RTK Query мутації
  const [createSupport, createSupportState] = useCreateSupportMutation();
  const [updateSupportById, updateSupportState] =
    useUpdateSupportByIdMutation();
  const { data: dataUser } = useGetAllUserDataQuery();
  const { refetch: refetchSupport } = useGetAllUserDataQuery();
  const { supportData } = useAppSelector((state) => state.modal);

  const {
    register,
    resetField,
    handleSubmit,
    reset,
    watch,
    getValues,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof ContactUsSchema>>({
    defaultValues: {
      name: "",
      requestText: "",
      email: "",
    },
    resolver: zodResolver(ContactUsSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (type === "updateSupport") {
      reset({
        name: supportData?.name,
        requestText: supportData?.text,
        email: supportData?.email,
      });
    } else {
      reset({
        name: dataUser?.username || "",
        email: dataUser?.email || "",
        requestText: "",
      });
    }
  }, [type, reset, dataUser, supportData]);

  const watchedValues = watch();
  const isSupportChanged = useMemo(() => {
    if (type === "addSupport") {
      const nameChanged =
        watchedValues?.name?.length > 0 &&
        watchedValues?.name !== dataUser?.username;

      const emailChanged = watchedValues?.email !== dataUser?.email;

      const textFilled = watchedValues?.requestText?.length > 0;

      return nameChanged || emailChanged || textFilled;
    }

    if (!supportData) return false;

    return (
      watchedValues?.name !== supportData.name ||
      watchedValues?.requestText !== supportData.text
    );
  }, [watchedValues, supportData, type, dataUser]);

  const onSubmit: SubmitHandler<z.infer<typeof ContactUsSchema>> = async (
    data
  ) => {
    try {
      const { name, requestText, email } = data;

      if (type === "addSupport") {
        await createSupport({ name, text: requestText, email }).unwrap();
      } else if (type === "updateSupport") {
        await updateSupportById({
          id: supportData?.id || "",
          name,
          text: requestText,
          email,
        }).unwrap();
      }

      refetchSupport();
      notifySuccess(t("notification.supportSent"));
      dispatch(closeModal());
    } catch (error) {
      notifyError(t("notification.supportSentError"));
      console.error(error);
    }
    dispatch(closeConfirmation());
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
    watch,
    isSupportChanged,
    trigger,
    // використовуємо RTK Query стан мутації для глобального лоадінгу
    isLoading: createSupportState.isLoading || updateSupportState.isLoading,
  };
}

export default useContactUs;
