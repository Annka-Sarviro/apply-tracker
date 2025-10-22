import { Input } from "@/components/inputs/Input/Input";
import { Button } from "../../../buttons/Button/Button";
import { Textarea } from "../../../Textarea/Textarea";
import { t } from "i18next";
import Icon from "../../../Icon/Icon";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  closeButton,
  openConfirmation,
} from "../../../../store/slices/modalSlice/modalSlice";
// component
import AddVacancyStage from "./AddStage";
import { CheckboxWithCalendar } from "./CheckboxWithCalendar";
import { InputRadio } from "../../../inputs/InputRadio/InputRadio";
import AddVacancyInfo from "./AddVacancyInfo";
// props
import { VacancyInputProps } from "./AddVacancy.props";
//hook
import useVacancy from "./useVacancy";
import { useKeyBoardNavigation } from "./useKeyBoardNavigation";
import { useCallback, useEffect } from "react";
import { TypesModal } from "../../ModalMain.types";

const AddVacancy = () => {
  const dispatch = useAppDispatch();

  const { vacancyFields, workTypeOptions } = AddVacancyInfo();
  const statusVacancy = useAppSelector(
    (state) => state.statusVacancy.newStatuses
  );
  const {
    register,
    resetField,
    handleSubmit,
    errors,
    getValues,
    setValue,
    isButtonDisabled,
    watch,
    clearErrors,
    isFormChanged,
  } = useVacancy();

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
        isButtonOpen: isFormChanged,
        resetForm: () => handleOpenConfirmation("closeModalSaveAddVacancies"),
      })
    );
  }, [dispatch, handleOpenConfirmation, isFormChanged]);

  const saveVacancy = () => {
    handleSubmit((data) => {
      dispatch(
        openConfirmation({
          typeConfirmation: "saveAddVacancies",
          dataConfirmation: data,
        })
      );
    })();
  };

  const handleSubmitArchive = () => {
    setValue("isArchived", true);
    saveVacancy();
  };

  // keyBoardNavigation
  const focusFields: string[] = [
    ...vacancyFields.map((f) => f.id),
    ...workTypeOptions.map((f) => f.id),
    ...statusVacancy.map((f) => f.id),
    "addVacancyStage",
    "note",
  ];

  const { setFocusedId, handleFormKeyNavigation, assignInputRef } =
    useKeyBoardNavigation({ focusFields });

  return (
    <div className="w-full pt-[50px] xl:pt-[44px]">
      <form onKeyDown={handleFormKeyNavigation}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:gap-6">
            <div className="flex flex-col justify-start gap-3">
              {/* TODO: Компаня, Позиція, Лінк на вакансію, Канал зв'яку, Локація*/}
              <div className="flex flex-col gap-3 xl:w-[393px] 2xl:w-[445px]">
                {vacancyFields.map((input: VacancyInputProps) => (
                  <Input
                    register={register}
                    resetField={resetField}
                    key={input.id}
                    name={input.name}
                    placeholder={input.placeholder || ""}
                    label={input.label}
                    errors={errors}
                    isRequired={input.name !== "communication" ? true : false}
                    type="vacancy"
                    ref={(el) => assignInputRef(input.id, el)}
                    onFocus={() => setFocusedId(input.id)}
                  />
                ))}
              </div>

              {/* TODO:Формат: Дистанційно - Офіс - Змішаний*/}
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                {workTypeOptions.map((inputRadio: VacancyInputProps) => (
                  <InputRadio
                    key={inputRadio.id}
                    name={inputRadio.name}
                    id={inputRadio.id}
                    className="addVacancy"
                    label={inputRadio.label}
                    register={register}
                    errors={errors}
                    value={inputRadio.value}
                    ref={(el) => assignInputRef(inputRadio.id, el)}
                    onFocus={() => setFocusedId(inputRadio.id)}
                  />
                ))}
              </div>
            </div>

            {/* TODO:Cтатус: Відправлене резюме, Тестове завдання ... Оффер*/}
            <div className="relative flex flex-col gap-3 text-textBlack md:gap-4 2xl:pt-2">
              <label>{t("addVacancy.form.status")}</label>
              <div className="flex flex-col gap-3 md:gap-4 xl:w-[274px] 2xl:w-[342px]">
                {statusVacancy.map((checkboxCalendar: VacancyInputProps) => (
                  <CheckboxWithCalendar
                    key={checkboxCalendar.id}
                    name={checkboxCalendar.name}
                    id={checkboxCalendar.id}
                    label={`addVacancy.form.${checkboxCalendar.name}`}
                    register={register}
                    errors={errors}
                    date={checkboxCalendar.date}
                    getValues={getValues}
                    setValue={setValue}
                    ref={(el) => assignInputRef(checkboxCalendar.id, el)}
                    onFocus={() => setFocusedId(checkboxCalendar.id)}
                    clearErrors={clearErrors}
                  />
                ))}
              </div>
              <AddVacancyStage
                register={register}
                getValues={getValues}
                setValue={setValue}
                ref={(el) => assignInputRef("addVacancyStage", el)}
              />
            </div>

            {/* TODO:Формат: Нотатки*/}
            <div className="xl:w-[390px] 2xl:w-[418px]">
              <Textarea
                register={register}
                resetField={resetField}
                key="note"
                name="note"
                placeholder={t("addVacancy.placeholders.notes")}
                className=""
                label={t("addVacancy.form.notes")}
                errors={errors}
                ref={(el) => assignInputRef("note", el)}
                onFocus={() => setFocusedId("note")}
                watch={watch}
              />
            </div>
          </div>

          <div className="flex w-full flex-col justify-center gap-3 md:flex-row xl:mt-6">
            <Button
              type="button"
              className="group w-full md:mx-auto xl:mx-0 xl:w-auto"
              variant="ghost"
              size="small"
              disabled={isButtonDisabled()}
              onClick={handleSubmitArchive}
            >
              {t("addVacancy.form.archive")}
              <Icon
                id={`${isButtonDisabled() ? "send-gray" : "send"}`}
                className="ml-3 h-6 w-6"
              />
            </Button>
            <Button
              type="button"
              className="group w-full md:mx-auto xl:mx-0 xl:w-auto"
              variant="accent"
              size="big"
              disabled={isButtonDisabled()}
              onClick={saveVacancy}
            >
              {t("addVacancy.form.save")}
              <Icon
                id={`${isButtonDisabled() ? "check-box-gray" : "check-box"}`}
                className="ml-3 h-6 w-6"
              />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVacancy;
