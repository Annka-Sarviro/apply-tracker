import {
  DataItem,
  PropsModalAddProperties,
} from "@/components/modal/components/profileModals/modalAddProperties.types";
import {
  notifyError,
  notifySuccess,
} from "@/components/Notifications/NotificationService";
import { useAppDispatch } from "@/store/hook";
import {
  useCreateCoverLetterMutation,
  useUpdateCoverLetterByIdMutation,
} from "@/store/querySlices/coverLettersQuerySlice";
import {
  useCreateSocialLinkMutation,
  useGetAllUserDataQuery,
  useUpdateSocialLinkMutation,
} from "@/store/querySlices/profileQuerySlice";
import {
  useCreateProjectMutation,
  useUpdateProjectByIdMutation,
} from "@/store/querySlices/projectQuerySlice";
import {
  useCreateResumeMutation,
  useUpdateResumeByIdMutation,
} from "@/store/querySlices/resumesQuerySlices";
import {
  closeModal,
  closeConfirmation,
  closeButton,
} from "@/store/slices/modalSlice/modalSlice";
import { useEffect, useMemo } from "react";
import { FieldErrors, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
  isUpdating: boolean;
  cardsType: PropsModalAddProperties["cardsType"];
  updateItem: { id: string };
  errors: FieldErrors;
};

function useMutationProfileData({
  isUpdating,
  cardsType,
  updateItem,
  errors,
}: Props) {
  const { refetch: refetchProfile } = useGetAllUserDataQuery();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [
    updateSocialLinkMutation,
    {
      isLoading: isLoadingUpdateSocialLink,
      isSuccess: isSuccessUpdateSocialLink,
      isError: isErrorUpdateSocialLink,
    },
  ] = useUpdateSocialLinkMutation();

  const [
    createSocialLinkMutation,
    {
      isLoading: isLoadingCreateSocialLink,
      isSuccess: isSuccessCreateSocialLink,
      isError: isErrorCreateSocialLink,
    },
  ] = useCreateSocialLinkMutation();

  const mutationSocialLink = isUpdating
    ? updateSocialLinkMutation
    : createSocialLinkMutation;

  const isLoadingSocialLink = isUpdating
    ? isLoadingUpdateSocialLink
    : isLoadingCreateSocialLink;

  const isSuccessSocialLink = isUpdating
    ? isSuccessUpdateSocialLink
    : isSuccessCreateSocialLink;

  const isErrorSocialLink = isUpdating
    ? isErrorUpdateSocialLink
    : isErrorCreateSocialLink;

  const [
    updateCoverLetterMutation,
    {
      isLoading: isLoadingUpdateCoverLetter,
      isSuccess: isSuccessUpdateCoverLetter,
      isError: isErrorUpdateCoverLetter,
    },
  ] = useUpdateCoverLetterByIdMutation();

  const [
    createCoverLetterMutation,
    {
      isLoading: isLoadingCreateCoverLetter,
      isSuccess: isSuccessCreateCoverLetter,
      isError: isErrorCreateCoverLetter,
    },
  ] = useCreateCoverLetterMutation();

  const mutationCoverLetter = isUpdating
    ? updateCoverLetterMutation
    : createCoverLetterMutation;

  const isLoadingCoverLetter = isUpdating
    ? isLoadingUpdateCoverLetter
    : isLoadingCreateCoverLetter;

  const isSuccessCoverLetter = isUpdating
    ? isSuccessUpdateCoverLetter
    : isSuccessCreateCoverLetter;

  const isErrorCoverLetter = isUpdating
    ? isErrorUpdateCoverLetter
    : isErrorCreateCoverLetter;

  const [
    updateProjectMutation,
    {
      isLoading: isLoadingUpdateProject,
      isSuccess: isSuccessUpdateProject,
      isError: isErrorUpdateProject,
    },
  ] = useUpdateProjectByIdMutation();

  const [
    createProjectMutation,
    {
      isLoading: isLoadingCreateProject,
      isSuccess: isSuccessCreateProject,
      isError: isErrorCreateProject,
    },
  ] = useCreateProjectMutation();

  const mutationProject = isUpdating
    ? updateProjectMutation
    : createProjectMutation;

  const isLoadingProject = isUpdating
    ? isLoadingUpdateProject
    : isLoadingCreateProject;

  const isSuccessProject = isUpdating
    ? isSuccessUpdateProject
    : isSuccessCreateProject;

  const isErrorProject = isUpdating
    ? isErrorUpdateProject
    : isErrorCreateProject;

  const [
    updateResumeMutation,
    {
      isLoading: isLoadingUpdateResume,
      isSuccess: isSuccessUpdateResume,
      isError: isErrorUpdateResume,
    },
  ] = useUpdateResumeByIdMutation();

  const [
    createResumeMutation,
    {
      isLoading: isLoadingCreateResume,
      isSuccess: isSuccessCreateResume,
      isError: isErrorCreateResume,
    },
  ] = useCreateResumeMutation();

  const mutationResume = isUpdating
    ? updateResumeMutation
    : createResumeMutation;

  const isLoadingResume = isUpdating
    ? isLoadingUpdateResume
    : isLoadingCreateResume;

  const isSuccessResume = isUpdating
    ? isSuccessUpdateResume
    : isSuccessCreateResume;

  const isErrorResume = isUpdating ? isErrorUpdateResume : isErrorCreateResume;

  const onSubmit: SubmitHandler<
    Pick<DataItem, "text" | "link" | "name" | "technologies">
  > = async (data) => {
    switch (cardsType) {
      case "addPersonalProperties":
        await mutationSocialLink({
          name: data.name,
          link: data.link as string,
          idSocialLink: updateItem?.id,
        });
        break;

      case "addCoverLetters":
        await mutationCoverLetter({
          name: data.name,
          text: data.text as string,
          id: updateItem?.id,
        });
        break;

      case "addProjects":
        await mutationProject({
          id: updateItem?.id,
          name: data.name,
          technologies: data.technologies as string,
          link: data.link as string,
          description: data.text as string,
        });
        break;

      case "addResumes":
        await mutationResume({
          name: data.name,
          link: data.link as string,
          id: updateItem?.id,
        });
        break;

      default:
        break;
    }
  };

  const isSubmitDisabled =
    isLoadingCoverLetter ||
    isLoadingProject ||
    isLoadingResume ||
    isLoadingSocialLink ||
    Object.keys(errors).length > 0;

  const messageCreate = useMemo<
    Record<PropsModalAddProperties["cardsType"], string>
  >(
    () => ({
      addPersonalProperties: t("notification.fieldAdded"),
      addCoverLetters: t("notification.letterAdded"),
      addProjects: t("notification.projectAdded"),
      addResumes: t("notification.resumeAdded"),
    }),
    [t]
  );
  useEffect(() => {
    if (
      isSuccessCoverLetter ||
      isSuccessProject ||
      isSuccessResume ||
      isSuccessSocialLink
    ) {
      notifySuccess(
        isUpdating
          ? t("notification.updatedSuccess")
          : t(messageCreate[cardsType])
      );
      refetchProfile();
      dispatch(closeConfirmation());
      dispatch(closeModal());
      dispatch(closeButton({ isButtonOpen: false, resetForm: undefined }));
    }
  }, [
    cardsType,
    dispatch,
    isSuccessCoverLetter,
    isSuccessProject,
    isSuccessResume,
    isSuccessSocialLink,
    isUpdating,
    messageCreate,
    refetchProfile,
    t,
  ]);

  useEffect(() => {
    if (
      isErrorCoverLetter ||
      isErrorProject ||
      isErrorResume ||
      isErrorSocialLink
    ) {
      notifyError(
        isUpdating
          ? t("notification.updatedError")
          : t("notification.addedError")
      );
    }
  }, [
    isErrorCoverLetter,
    isErrorProject,
    isErrorResume,
    isErrorSocialLink,
    isUpdating,
    t,
  ]);

  return { onSubmit, isSubmitDisabled };
}

export default useMutationProfileData;
