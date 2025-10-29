import { useTranslation } from "react-i18next";
import Calendar from "react-calendar";
import Icon from "../Icon/Icon";
import classNames from "classnames";
import { JobCalendarProps } from "./JobCalendarProps";

export const JobCalendar = ({ changeDate, dateState }: JobCalendarProps) => {
  const { i18n } = useTranslation();

  return (
    <Calendar
      locale={i18n.language}
      calendarType={i18n.language === "uk" ? "iso8601" : "gregory"}
      className={classNames(
        "custom-size statistics-calendar__day job-cal z-10 w-full rounded-[12px] border-[1px] border-iconHover bg-backgroundMain py-3 text-textBlack"
      )}
      nextLabel={
        <Icon
          id={"arrow-right"}
          className="h-6 w-6 fill-textBlack hover:fill-iconHover active:fill-iconHover dark:hover:fill-iconHover"
        />
      }
      prevLabel={
        <Icon
          id={"arrow-left"}
          className="h-6 w-6 fill-textBlack hover:fill-iconHover active:fill-iconHover dark:hover:fill-iconHover"
        />
      }
      formatMonthYear={(locale, date) =>
        `${date.toLocaleDateString(locale, { month: "long" })} ${date.getFullYear()}`
      }
      onChange={changeDate}
      value={dateState}
    />
  );
};
