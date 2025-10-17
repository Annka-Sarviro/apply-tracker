import { useEffect, useRef } from "react";
import SoonCalendarModal from "../../Calendar/SoonCalendarModal.tsx";
import { Input } from "../../inputs/Input/Input.tsx";
import { Textarea } from "../../Textarea/Textarea.tsx";
import { Button } from "../../buttons/Button/Button.tsx";
import Icon from "../../Icon/Icon.tsx";
import Select from "react-select";
import clsx from "clsx";
import useAddEventModal from "./useAddEventModal";

interface OptionType {
  value: number;
  label: string;
}

const AddEventModal = () => {
  const {
    t,
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    errors,
    hourOptions,
    minuteOptions,
    menuOpenHours,
    setMenuOpenHours,
    menuOpenMinutes,
    setMenuOpenMinutes,
    inputChanged,
    handleInputClick,
    handleHourInputChange,
    handleMinuteInputChange,
    handleHourSelectChange,
    handleMinuteSelectChange,
    handleDateChange,
    handleInputChange,
    isLoading,
  } = useAddEventModal();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectHoursRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectMinutesRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectWrapperRef.current &&
        !selectWrapperRef.current.contains(event.target as Node)
      ) {
        setMenuOpenHours(false);
        setMenuOpenMinutes(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMenuOpenHours, setMenuOpenMinutes]);

  return (
    <form
      noValidate
      onSubmit={handleSubmit} // Використовуємо handleSubmit, який повертає useForm
      className="mt-4 flex w-full flex-col gap-3 align-middle md:gap-4 xl:mt-10 3xl:mt-14 3xl:gap-6"
    >
      <div className="flex w-full flex-col gap-4 md:flex-row xl:gap-6">
        <div>
          <SoonCalendarModal onSelectDate={handleDateChange} />
          {errors.date?.message && (
            <p className="px-2 text-redColor">
              {t(String(errors.date.message))}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col font-medium md:w-[350px] xl:w-[445px]">
          <label
            htmlFor="soonEventName"
            className="text-base text-textBlack xl:text-xl 3xl:text-2xl"
          >
            {t("soonSection.soonName")}
          </label>
          <Input
            name="soonEventName"
            placeholder={t("soonSection.soonModalNamePlaceholder")}
            register={register}
            errors={errors}
            resetField={resetField}
            setValue={setValue}
            isRequired={true}
            isCheckButtons={true}
            classNameInputCustom="rounded-lg"
            onChange={handleInputChange}
            autoComplete="off"
          />

          <label
            htmlFor="soonEventNotes"
            className="mt-3 block text-base text-textBlack xl:mt-4 xl:text-xl 3xl:text-2xl"
          >
            {t("soonSection.soonNotes")}
          </label>
          {/* <Input
            name="soonEventNotes"
            placeholder={t("soonSection.soonModalNotesPlaceholder")}
            register={register}
            errors={errors}
            resetField={resetField}
            setValue={setValue}
            isRequired={false}
            type="textarea"
            rows={4}
            isCheckButtons={false}
            classNameInputCustom="resize-none textarea-event-lg textarea-event"
            onChange={handleInputChange}
            autoComplete="off"
          /> */}
          <Textarea
            name="soonEventNotes"
            placeholder={t("soonSection.soonModalNotesPlaceholder")}
            register={register}
            errors={errors}
            resetField={resetField}
            isRequired={false}
            rows={4}
            classNameInputCustom="resize-none textarea-event-lg textarea-event"
            onChange={handleInputChange}
            watch={watch}
          />

          <div className="flex w-full flex-col items-center md:items-start">
            <p className="mt-3 text-base text-textBlack xl:mt-4 xl:text-xl 3xl:text-2xl">
              {t("soonSection.setTime")}
            </p>
            <div className="time-content grid auto-cols-max auto-rows-max gap-x-2 gap-y-1">
              <div className="container-hours relative flex h-[54px] w-20 xl:h-[60px]">
                <Input
                  name="hours"
                  placeholder="00"
                  type="text"
                  register={register}
                  errors={errors}
                  resetField={resetField}
                  setValue={setValue}
                  isRequired={false}
                  isCheckButtons={false}
                  autoComplete="off"
                  maxLength={2}
                  className={clsx(
                    "pointer-events-auto z-[8] bg-textMediumWhite text-textBlack",
                    "h-full w-full rounded-lg border-2 border-transparent px-4 py-2 text-center xl:py-[9px]",
                    "focus-within:border-color1 hover:border-color1 focus:border-color1 active:border-color1"
                  )}
                  classNameInputCustom={clsx(
                    "border-0 bg-textMediumWhite p-0 text-center text-[28px] font-medium text-textBlack",
                    "sm:h-auto sm:p-0 sm:text-[24px]",
                    "md:h-auto md:p-0 md:text-[24px]",
                    "xl:text-[32px] xl:font-normal",
                    "2xl:text-[32px]"
                  )}
                  onChange={handleHourInputChange}
                  onClick={() => handleInputClick("hours")}
                  ref={inputRef}
                  onInput={() => setMenuOpenHours(false)}
                />
                <div ref={selectWrapperRef}>
                  <Select<OptionType>
                    ref={selectHoursRef}
                    options={hourOptions}
                    value={hourOptions.find(
                      (option) =>
                        option.value === Number(watch("hours")) || null
                    )}
                    onChange={handleHourSelectChange}
                    placeholder="00"
                    className={clsx(
                      "select__event-modal",
                      "z-1 left-0 top-0 cursor-pointer",
                      "h-full w-full rounded-lg border-2 border-transparent bg-backgroundTertiary px-3 py-[9px]",
                      "focus-within:border-color1 hover:border-color1 focus:border-color1 active:border-color1"
                    )}
                    classNamePrefix="react-select"
                    isSearchable={false}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    menuIsOpen={menuOpenHours}
                    onMenuOpen={() => setMenuOpenHours(true)}
                    onMenuClose={() => setMenuOpenHours(false)}
                  />
                </div>
              </div>

              <div className="flex h-[60px] w-6 items-center justify-center">
                <span className="box-border text-[44px] font-normal leading-[44px] text-textBlack md:pb-[3px] md:text-[57px] md:leading-[57px]">
                  :
                </span>
              </div>

              <div className="container-minutes relative flex h-[54px] w-20 xl:h-[60px]">
                <Input
                  name="minutes"
                  placeholder="00"
                  type="text"
                  register={register}
                  errors={errors}
                  resetField={resetField}
                  setValue={setValue}
                  isRequired={false}
                  isCheckButtons={false}
                  autoComplete="off"
                  maxLength={2}
                  className={clsx(
                    "pointer-events-auto z-10 bg-textMediumWhite",
                    "h-full w-full rounded-lg border-2 border-transparent px-4 py-[9px] text-center",
                    "focus-within:border-color1 hover:border-color1 focus:border-color1 active:border-color1"
                  )}
                  classNameInputCustom={clsx(
                    "border-0 bg-textMediumWhite p-0 text-center text-[28px] font-medium text-textBlack",
                    "sm:h-auto sm:p-0 sm:text-[24px]",
                    "md:h-auto md:p-0 md:text-[24px]",
                    "xl:text-[32px] xl:font-normal",
                    "2xl:text-[32px]"
                  )}
                  onChange={handleMinuteInputChange}
                  onClick={() => handleInputClick("minutes")}
                  ref={inputRef}
                  onInput={() => setMenuOpenMinutes(false)}
                />
                <div ref={selectWrapperRef}>
                  <Select<OptionType>
                    ref={selectMinutesRef}
                    options={minuteOptions}
                    value={minuteOptions.find(
                      (option) =>
                        option.value === Number(watch("minutes")) || null
                    )}
                    onChange={handleMinuteSelectChange}
                    placeholder="00"
                    className={clsx(
                      "select__event-modal",
                      "z-1 left-0 top-0 cursor-pointer",
                      "h-full w-full rounded-lg border-2 border-transparent bg-backgroundTertiary px-4 py-[9px]",
                      "focus-within:border-color1 hover:border-color1 focus:border-color1 active:border-color1"
                    )}
                    classNamePrefix="react-select"
                    isSearchable={false}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    menuIsOpen={menuOpenMinutes}
                    onMenuOpen={() => setMenuOpenMinutes(true)}
                    onMenuClose={() => setMenuOpenMinutes(false)}
                  />
                </div>
              </div>

              <p className="col-span-2 row-start-2 pr-6 text-center text-sm text-textBlack xl:text-base 3xl:text-xl">
                {t("soonSection.soonModalTimeHours")}
              </p>
              <p className="col-span-1 row-start-2 text-center text-sm text-textBlack xl:text-base 3xl:text-xl">
                {t("soonSection.soonModalTimeMinutes")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="mx-auto"
        variant="accent"
        size="big"
        disabled={isLoading || inputChanged === false}
      >
        {isLoading ? t("loading") : t("soonSection.save")}
        <Icon
          id={`${inputChanged ? "check-box" : "check-box-gray"}`}
          className="ml-3 h-6 w-6"
        />
      </Button>
    </form>
  );
};

export default AddEventModal;
