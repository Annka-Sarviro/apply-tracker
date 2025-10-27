import { Input } from "../../../inputs/Input/Input";
import { Button } from "../../../buttons/Button/Button";
import { Textarea } from "../../../Textarea/Textarea";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../../../store/hook";
import {
  closeButton,
  closeModal,
  openConfirmation,
} from "../../../../store/slices/modalSlice/modalSlice";
// import { useGetAllUserDataQuery } from "@/store/querySlices/profileQuerySlice";
import { useCallback, useEffect } from "react";
import useContactUs from "./useContactUs";
import { TypesModal } from "../../ModalMain.types";

const ContactUs = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const { data: dataUser } = useGetAllUserDataQuery();
  const {
    register,
    resetField,
    handleSubmit,
    errors,
    getValues,
    setValue,
    // isButtonDisabled,
    watch,
    // clearErrors,
    isSupportChanged,
    trigger,
  } = useContactUs("addSupport");

  const handleOpenConfirmation = useCallback(
    (typeConfirmation: TypesModal) => {
      const data = getValues();
      dispatch(
        openConfirmation({
          typeConfirmation,
          dataConfirmation: data,
        })
      );
    },
    [dispatch, getValues]
  );

  useEffect(() => {
    dispatch(
      closeButton({
        isButtonOpen: isSupportChanged,
        resetForm: () => {
          trigger().then((isValidOnClose) => {
            if (isValidOnClose && isSupportChanged) {
              handleOpenConfirmation("closeModalSaveContactUs");
            } else if (isSupportChanged) {
              dispatch(
                openConfirmation({
                  typeConfirmation: "closeDiscardModal",
                })
              );
            } else {
              dispatch(closeModal());
            }
          });
        },
      })
    );
  }, [dispatch, handleOpenConfirmation, trigger, isSupportChanged]);

  const onSubmit = () => {
    handleSubmit((data) => {
      dispatch(
        openConfirmation({
          typeConfirmation: "saveContactUs",
          dataConfirmation: data,
        })
      );
    })();
  };

  // -------------------------------------------------------------
  const handleCancel = (): void => {
    dispatch(closeModal());
  };
  const error = !!Object.keys(errors).length;
  const isCleanInputsForm =
    error || !watch("name") || !watch("email") || !watch("requestText");

  // const focusFields: string[] = [
  //   ...vacancyFields.map((f) => f.id),
  //   ...workTypeOptions.map((f) => f.id),
  //   ...statusVacancy.map((f) => f.id),
  //   "addVacancyStage",
  //   "note",
  // ];

  // const { setFocusedId, handleFormKeyNavigation, assignInputRef } =
  //   useKeyBoardNavigation({ focusFields });

  return (
    <div className="my-2 w-[449px] text-left xl:my-12">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 md:gap-4">
          <Input
            register={register}
            resetField={resetField}
            key="name"
            name="name"
            placeholder={t("contactUs.namePlaceholder")}
            type="text"
            className=""
            label={t("contactUs.name")}
            errors={errors}
            setValue={setValue}
          />
          <Input
            register={register}
            resetField={resetField}
            key="email"
            name="email"
            placeholder={t("register.enterEmail")}
            type="text"
            className=""
            label={t("register.email")}
            errors={errors}
            setValue={setValue}
          />
          <Textarea
            register={register}
            resetField={resetField}
            key="requestText"
            name="requestText"
            placeholder={t("contactUs.textPlaceholder")}
            className=""
            label={t("contactUs.text")}
            errors={errors}
            watch={watch}
          />

          <div className="flex flex-col justify-center gap-2 md:flex-row xl:mt-4">
            <Button
              type="button"
              className="md:mx-0 md:w-auto"
              disabled={isCleanInputsForm}
              variant="ghost"
              size="small"
              onClick={() => handleCancel()}
            >
              {t("infoModal.button.cancel")}
            </Button>
            <Button
              type="submit"
              className="w-full md:mx-0 md:w-auto"
              disabled={isCleanInputsForm}
              variant="accent"
              size="big"
            >
              {t("contactUs.send")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
