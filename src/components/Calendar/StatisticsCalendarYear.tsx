import { useState } from "react";
import Calendar from "react-calendar";
import Icon from "../Icon/Icon";
import clsx from "clsx";
import i18n from "@/utils/i18n/i18n";

type StatisticsCalendarYearProps = {
  onYearChange: (year: number) => void;
};

export const StatisticsCalendarYear: React.FC<StatisticsCalendarYearProps> = ({
  onYearChange,
}) => {
  const [selectedYear, setSelectedYear] = useState<Date | null>(null);

  return (
    <div
      className={clsx(
        "statistics-calendar box-border rounded-[20px] bg-backgroundTertiary text-textBlack",
        "w-[276px] smPlus:w-[356px] md:w-[356px] 3xl:w-[468px]",
        "h-[332px] md:h-[398px] 3xl:h-[514px]", //h-[318px]
        "p-4 md:px-4 md:pb-6 md:pt-4 3xl:px-8 3xl:py-6"
      )}
    >
      <Calendar
        view="decade"
        calendarType={i18n.language === "uk" ? "iso8601" : "gregory"}
        onClickYear={(date) => {
          const year = (date as Date).getFullYear();
          const selectedYearDate = new Date(year, 0, 1);

          setSelectedYear(selectedYearDate);
          onYearChange(year);
        }}
        value={selectedYear}
        className="statistics-calendar__years"
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
        tileClassName={({ date, view }) =>
          `${
            view === "decade" &&
            selectedYear?.getFullYear() === date.getFullYear()
              ? "react-calendar__tile--active"
              : ""
          } w-[54px] h-[54px] md:w-[66px] md:h-[60px] 3xl:w-[80px] 3xl:h-[80px] font-Nunito text-textBlack bg-backgroundMain box-border`
        }
      />
    </div>
  );
};

export default StatisticsCalendarYear;
