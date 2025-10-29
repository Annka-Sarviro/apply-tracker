import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import type { SingleValue } from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "../../../store/hook.ts";
import {
  openConfirmation,
  closeButton,
  closeModal,
} from "../../../store/slices/modalSlice/modalSlice.ts";
import { getEventSchema } from "../../../schemas/eventModalSchema.ts";
import { useCreateEventMutation } from "../../../store/querySlices/eventsQuerySlice.ts";
import { TypesModal } from "../../modal/ModalMain.types.ts";

type FormValues = {
  soonEventName: string;
  soonEventNotes: string;
  hours: number | undefined;
  minutes: number | undefined;
  date: string;
};

interface OptionType {
  value: number;
  label: string;
}

const useAddEventModal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, { isLoading }] = useCreateEventMutation();
  const [menuOpenHours, setMenuOpenHours] = useState(false);
  const [menuOpenMinutes, setMenuOpenMinutes] = useState(false);
  const [inputChanged, setInputChanged] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    reset,
    watch,
    trigger,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getEventSchema()),
    defaultValues: {
      soonEventName: "",
      soonEventNotes: "",
      hours: undefined,
      minutes: undefined,
      date: "",
    },
  });

  useEffect(() => {
    setValue("hours", undefined);
    setValue("minutes", undefined);
  }, [setValue]);

  const handleConfirmation = useCallback(
    (typeConfirmation: TypesModal, data?: FormValues) => {
      dispatch(
        openConfirmation({
          typeConfirmation,
          dataConfirmation: data
            ? {
                ...data,
                time: `${String(data.hours !== undefined ? data.hours : "00").padStart(2, "0")}:${String(
                  data.minutes !== undefined ? data.minutes : "00"
                ).padStart(2, "0")}`,
              }
            : undefined,
          resetForm: reset,
        })
      );
    },
    [dispatch, reset]
  );

  const confirmSave = handleSubmit(async (data) => {
    handleConfirmation("saveAddEvent", data);
  });

  useEffect(() => {
    dispatch(
      closeButton({
        isButtonOpen: inputChanged,
        resetForm: () => {
          trigger().then((isValidOnClose) => {
            const currentFormData = watch();

            const formDataWithDefaultMinutes = {
              ...currentFormData,
              minutes:
                currentFormData.minutes !== undefined
                  ? currentFormData.minutes
                  : +"00",
            };
            if (isValidOnClose && inputChanged) {
              handleConfirmation(
                "closeModalSaveAddEvent",
                formDataWithDefaultMinutes
              );
            } else if (inputChanged) {
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
  }, [inputChanged, dispatch, handleConfirmation, trigger, watch, reset]);

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  }));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  }));

  useEffect(() => {
    register("hours", { required: false });
    register("minutes", { required: false });
  }, [register]);

  const handleInputClick = (type: "hours" | "minutes") => {
    const isHours = type === "hours";
    const isOpen = isHours ? menuOpenHours : menuOpenMinutes;
    const setMenu = isHours ? setMenuOpenHours : setMenuOpenMinutes;
    setMenu(!isOpen);
  };

  const handleInputChange = () => {
    setInputChanged(true);
  };

  const handleHourInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleInputChange();
    let value = e.currentTarget.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2);
    if (+value > 23) return;
    setValue("hours", Number(value), { shouldValidate: true });
  };

  const handleMinuteInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleInputChange();
    let value = e.currentTarget.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2);
    if (+value > 59) return;
    setValue("minutes", Number(value), { shouldValidate: true });
  };

  const handleHourSelectChange = (selectedOption: SingleValue<OptionType>) => {
    handleInputChange();
    setMenuOpenHours(false);
    setValue("hours", selectedOption ? selectedOption.value : undefined, {
      shouldValidate: true,
    });
    trigger("hours");
  };

  const handleMinuteSelectChange = (
    selectedOption: SingleValue<OptionType>
  ) => {
    handleInputChange();
    setMenuOpenMinutes(false);
    setValue("minutes", selectedOption ? selectedOption.value : undefined, {
      shouldValidate: true,
    });
    trigger("minutes");
  };

  const handleDateChange = (date: string) => {
    setValue("date", date);
    trigger("date");
    handleInputChange();
  };

  return {
    t,
    register,
    handleSubmit: confirmSave,
    setValue,
    resetField,
    reset,
    watch,
    trigger,
    errors,
    confirmSave,
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
    control,
  };
};

export default useAddEventModal;
