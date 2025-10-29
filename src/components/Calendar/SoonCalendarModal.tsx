import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Icon from "../Icon/Icon";
import { useAppSelector } from "../../store/hook.ts";
import { selectEventData } from "../../store/slices/modalSlice/selectors.ts";
import clsx from "clsx";

type SoonCalendarModalProps = {
  onSelectDate?: (date: string) => void;
  onChange?: () => void;
};

export const SoonCalendarModal: React.FC<SoonCalendarModalProps> = ({
  onSelectDate,
  onChange,
}) => {
  const { i18n } = useTranslation();
  const eventData = useAppSelector(selectEventData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (eventData?.date) {
      const parsedDate = new Date(eventData.date);
      setSelectedDate(parsedDate);
    }
  }, [eventData]);

  const handleDateChange = (selectedDate: Date) => {
    setSelectedDate(selectedDate);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    if (onSelectDate) {
      onSelectDate(formattedDate);
    }
  };

  return (
    <div
      className={clsx(
        "statistics-calendar soon-calendar-modal text-textBlack",
        "box-border rounded-[20px] bg-backgroundTertiary p-2 3xl:px-6 3xl:py-4",
        "h-auto w-full md:h-[270px] md:w-[264px] xl:h-[385px] xl:w-[356px] 3xl:h-[514px] 3xl:w-[468px]"
      )}
    >
      <Calendar
        view="month"
        locale={i18n.language}
        onChange={(date) => {
          handleDateChange(date as Date);
          onChange?.();
        }}
        value={selectedDate}
        className="statistics-calendar__day"
        nextLabel={
          <Icon
            id={"arrow-right"}
            className="size-6 fill-textBlack hover:fill-iconHover active:fill-iconHover dark:hover:fill-iconHover"
          />
        }
        prevLabel={
          <Icon
            id={"arrow-left"}
            className="size-6 fill-textBlack hover:fill-iconHover active:fill-iconHover dark:hover:fill-iconHover"
          />
        }
        formatMonthYear={(locale, date) =>
          `${date.toLocaleDateString(locale, { month: "long" })} ${date.getFullYear()}`
        }
        minDate={new Date()}
        calendarType={i18n.language === "uk" ? "iso8601" : "gregory"}
      />
    </div>
  );
};

export default SoonCalendarModal;
