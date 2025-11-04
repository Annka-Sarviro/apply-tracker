import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useNotes from "./useNotes";

import { Input } from "@/components/inputs/Input/Input";
import { Textarea } from "@/components/Textarea/Textarea";
import { Button } from "@/components/buttons/Button/Button";
import Icon from "@/components/Icon/Icon";

import { useAppDispatch } from "@/store/hook";
import {
  openConfirmation,
  closeButton,
  closeModal,
} from "@/store/slices/modalSlice/modalSlice";

import { TypesModal } from "../../ModalMain.types";
import { NoteType } from "@/types/notes.types";
import { cn } from "@/utils/utils";

const NotesModal = ({ type }: NoteType) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isAddNote = type === "addNote";

  const {
    register,
    resetField,
    handleSubmit,
    errors,
    isNoteChanged,
    watch,
    isLoading,
    justCreated,
    setJustCreated,
  } = useNotes(type);

  const hasNoteName = Boolean(watch("noteName"));
  const hasNoteText = Boolean(watch("noteText"));
  const hasErrors = Object.keys(errors).length > 0;
  const isDisabledButton =
    !isNoteChanged || hasErrors || !hasNoteName || !hasNoteText || isLoading;

  const handleConfirmation = useCallback(
    (typeConfirmation: TypesModal) => {
      const hasPartialData = hasNoteName || hasNoteText;
      if (hasErrors || !hasPartialData) {
        dispatch(openConfirmation({ typeConfirmation: "closeDiscardModal" }));
        setJustCreated(false);
      } else {
        handleSubmit((data) => {
          dispatch(
            openConfirmation({
              typeConfirmation,
              dataConfirmation: data,
            })
          );
        })();
        setJustCreated(true);
      }
    },
    [
      dispatch,
      hasErrors,
      hasNoteName,
      hasNoteText,
      handleSubmit,
      setJustCreated,
    ]
  );

  const saveNote = () => handleConfirmation("saveNote");
  const deleteNote = () => handleConfirmation("deleteNote");
  useEffect(() => {
    const hasFilledFields = hasNoteName || hasNoteText;
    const isPartial = hasFilledFields && !(hasNoteName && hasNoteText);

    const resetFormHandler = () => {
      if (hasErrors && hasFilledFields) {
        dispatch(openConfirmation({ typeConfirmation: "closeDiscardModal" }));
        setJustCreated(false);
        return;
      }

      if (isPartial) {
        dispatch(openConfirmation({ typeConfirmation: "closeDiscardModal" }));
        setJustCreated(false);
        return;
      }

      if (isNoteChanged) {
        handleConfirmation("closeModalSaveNote");
        setJustCreated(true);
        return;
      }

      dispatch(closeModal());
      setJustCreated(false);
    };

    const isButtonOpen =
      type === "updateNote" ? isNoteChanged : hasFilledFields;

    dispatch(
      closeButton({
        isButtonOpen,
        resetForm: resetFormHandler,
      })
    );
  }, [
    isNoteChanged,
    hasNoteName,
    hasNoteText,
    hasErrors,
    type,
    dispatch,
    handleConfirmation,
    justCreated,
  ]);

  return (
    <div className="mb-4 mt-10 w-full text-left xl:my-12 xl:mb-4 xl:mt-10">
      <form>
        <div className="flex flex-col gap-3 md:gap-4">
          <Input
            register={register}
            resetField={resetField}
            name="noteName"
            placeholder={t("notesHeader.noteName")}
            type="text"
            className=""
            errors={errors}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          />
          <Textarea
            register={register}
            resetField={resetField}
            name="noteText"
            placeholder={t("notesHeader.noteText")}
            className=""
            errors={errors}
            watch={watch}
          />

          <div className="flex flex-col justify-center gap-2 md:flex-row xl:mt-4">
            {isAddNote ? (
              <Button
                type="button"
                className="group w-full md:mx-0 md:w-auto"
                variant="accent"
                size="big"
                disabled={isDisabledButton}
                onClick={saveNote}
              >
                {t("notesHeader.createNote")}
                <Icon
                  id={`${isDisabledButton ? "plus-gray" : "plus"}`}
                  className="ml-3 h-6 w-6"
                />
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  className="w-full md:mx-0 md:w-auto"
                  variant="ghost"
                  size="small"
                  onClick={deleteNote}
                  disabled={isLoading}
                >
                  {t("addVacancy.form.delete")}
                  <Icon
                    id={"delete"}
                    className={cn("ml-3 h-6 w-6", isLoading && "fill-color6")}
                  />
                </Button>
                <Button
                  type="button"
                  className="w-full md:mx-0 md:w-auto"
                  variant="accent"
                  size="big"
                  disabled={isDisabledButton}
                  onClick={saveNote}
                >
                  {t("addVacancy.form.save")}
                  <Icon
                    id={`${isDisabledButton ? "check-box-gray" : "check-box"}`}
                    className="ml-3 h-6 w-6"
                  />
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default NotesModal;
