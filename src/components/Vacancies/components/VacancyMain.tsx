import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAppDispatch,
  useAppSelector,
  useFilteredVacancies,
} from "../../../store/hook.ts";
import { setFilteredVacancies } from "../../../store/slices/filteredVacanciesSlice/filteredVacanciesSlice.ts";
import { selectFilteredVacancies } from "../../../store/slices/filteredVacanciesSlice/filteredVacanciesSelector.ts";
import { useGetAllUserDataQuery } from "../../../store/querySlices/profileQuerySlice.ts";
import { selectTheme } from "../../../store/slices/themeSlice/themeSelector.ts";

import VacancySection from "./VacancySection.tsx";
import VacancySectionBox from "./VacancySectionBox.tsx";
import VacancyCard from "./VacancyCard.tsx";
import VacancyCardFirst from "./VacancyCardFirst.tsx";
import VacancySectionSkeleton from "./VacancySectionSkeleton.tsx";

import {
  getLocalizedSectionConfig,
  getVacanciesByStatus,
  SectionConfig,
} from "./VacancyMainConfig.ts";
import { openModal } from "../../../store/slices/modalSlice/modalSlice.ts";
import { fetchUpdatedStatuses } from "@/store/slices/statusVacancy/vacancyStatusOperation.ts";
import { Vacancy } from "@/types/vacancies.types.ts";
import { useLocation } from "react-router-dom";
import Icon from "@/components/Icon/Icon.tsx";
import { cn } from "@/utils/utils.ts";

const VacancyMain: FC = () => {
  const { sortType, searchQuery } = useAppSelector(selectFilteredVacancies);
  const dispatch = useAppDispatch();
  const darkTheme = useAppSelector(selectTheme);
  const { t } = useTranslation();
  const location = useLocation();
  const localizedSections = getLocalizedSectionConfig(darkTheme);

  const { data, isLoading, isError } = useGetAllUserDataQuery();

  const vacancies = data?.vacancies || [];
  const filteredVacancies = useFilteredVacancies(
    vacancies,
    searchQuery,
    sortType
  );

  const isStatus = [
    "saved",
    "resume",
    "hr",
    "test",
    "tech",
    "reject",
    "offer",
  ].includes(sortType);

  const isArchive = location.pathname.replace(/^\/+/, "") === "archive";

  const isSorting = isStatus || isArchive;
  const renderedVacancies = useMemo(() => {
    const base = isArchive
      ? filteredVacancies.filter((v) => v.isArchived)
      : filteredVacancies.filter((v) => !v.isArchived);
    return base;
  }, [filteredVacancies, isArchive]);

  const prevVacanciesRef = useRef<Vacancy[]>([]);
  useEffect(() => {
    if (!isEqual(prevVacanciesRef.current, renderedVacancies)) {
      dispatch(setFilteredVacancies(renderedVacancies));
      prevVacanciesRef.current = renderedVacancies;
    }
  }, [dispatch, renderedVacancies]);

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 575.9px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 575.9px)");

    const handleResize = () => setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    // console.log("isMobile changed:", isMobile);
  }, [isMobile]);

  const handleVacancyCard = (
    vacancy: Vacancy,
    section?: SectionConfig
  ): void => {
    dispatch(
      openModal({
        typeModal: "editVacancy",
        borderColorModal: section?.borderColor,
        backgroundColorModal: section?.backgroundColor,
        vacancyData: vacancy,
      })
    );
    dispatch(fetchUpdatedStatuses(vacancy));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Показ скелетону під час завантаження */}
      {isLoading && <VacancySectionSkeleton />}
      {isError && <h2 className="text-textBlack">Error...</h2>}

      {/* Заглушка "картка Створіть вашу першу вакансію", якщо взагалі вакансій немає, секція "Збережені" */}
      {!isLoading &&
        // vacancies.length === 0 &&
        renderedVacancies.length === 0 &&
        !isArchive &&
        (!isMobile ? (
          <VacancySection
            titleSection={t("sortDropdown.saved")}
            colorSectionBorder="border-color5"
            colorSectionBG="bg-color5"
          >
            <VacancyCardFirst
              colorSectionBG="bg-color5-transparent dark:bg-color5"
              colorHoverBG="hover:bg-color5 dark:hover:bg-color5-transparent"
              typeModal="addVacancy"
            />
          </VacancySection>
        ) : (
          <VacancySectionBox
            titleSection={t("sortDropdown.saved")}
            colorSectionBG="bg-color5"
            colorSectionBorder="border-color5"
          >
            <VacancyCardFirst
              colorSectionBG="bg-color5-transparent dark:bg-color5"
              colorHoverBG="hover:bg-color5 dark:hover:bg-color5-transparent"
              typeModal="addVacancy"
            />
          </VacancySectionBox>
        ))}

      {/* Архівні вакансії */}
      {isArchive && renderedVacancies.length === 0 && (
        <div className="mt-4 flex flex-col items-center gap-3 md:mt-8 md:gap-4 xl:mt-[60px] xl:gap-6 2xl:mt-10 2xl:gap-4 3xl:mt-[60px] 3xl:gap-8">
          <Icon
            id="girl-and-dashboard"
            className={cn(
              "mt-2 size-[209px] fill-iconFill hover:fill-iconFill dark:fill-iconFill dark:hover:fill-iconFill md:mt-2 xl:mt-9 2xl:mt-0 3xl:mt-0 3xl:size-[256px]"
            )}
          />
          <p className="mt-4 font-nunito text-xl text-textBlack">
            {t("vacanciesHeader.emptySection")}
          </p>
        </div>
      )}

      {isArchive && renderedVacancies.length > 0 && (
        <VacancySectionBox
          titleSection={t("vacanciesHeader.archive")}
          colorSectionBorder="border-color9"
          colorSectionBG="bg-color9"
        >
          {renderedVacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              colorSectionBG="bg-color9-transparent dark:bg-color9"
              colorHoverBG="hover:bg-color9 dark:hover:bg-color9-transparent"
              titleVacancy={vacancy.vacancy}
              company={vacancy.company}
              workType={vacancy.work_type}
              location={vacancy.location}
              onClick={() => {
                handleVacancyCard(vacancy);
              }}
            />
          ))}
        </VacancySectionBox>
      )}

      {/* В цій секції не має вакансій... - під час сортування*/}
      {!isLoading && renderedVacancies.length === 0 && !isArchive && (
        <p className="mt-4 font-nunito text-xl text-textBlack">
          {t("vacanciesHeader.emptySection")}
        </p>
      )}

      {/* Секції активних вакансій */}
      {!isArchive &&
        localizedSections.map(
          (section) =>
            getVacanciesByStatus(renderedVacancies, section.sectionName)
              .length > 0 &&
            (!isSorting && !isMobile ? (
              <VacancySection
                key={section.sectionName}
                titleSection={section.title}
                colorSectionBorder={section.borderColor}
                colorSectionBG={section.backgroundColor}
              >
                {getVacanciesByStatus(
                  renderedVacancies,
                  section.sectionName
                ).map((vacancy) => (
                  <VacancyCard
                    key={vacancy.id}
                    colorSectionBG={section.backgroundTransparent}
                    colorHoverBG={section.hoverColor}
                    titleVacancy={vacancy.vacancy}
                    company={vacancy.company}
                    workType={vacancy.work_type}
                    location={vacancy.location}
                    onClick={() => handleVacancyCard(vacancy, section)}
                  />
                ))}
              </VacancySection>
            ) : (
              <VacancySectionBox
                key={section.sectionName}
                titleSection={section.title}
                colorSectionBorder={section.borderColor}
                colorSectionBG={section.backgroundColor}
                isSorted={isSorting}
                isArchived={isArchive}
              >
                {getVacanciesByStatus(
                  renderedVacancies,
                  section.sectionName
                ).map((vacancy) => (
                  <VacancyCard
                    key={vacancy.id}
                    colorSectionBG={section.backgroundTransparent}
                    colorHoverBG={section.hoverColor}
                    titleVacancy={vacancy.vacancy}
                    company={vacancy.company}
                    workType={vacancy.work_type}
                    location={vacancy.location}
                    onClick={() => handleVacancyCard(vacancy, section)}
                  />
                ))}
              </VacancySectionBox>
            ))
        )}
    </div>
  );
};

export default VacancyMain;
function isEqual(current: Vacancy[], renderedVacancies: Vacancy[]) {
  if (current.length !== renderedVacancies.length) return false;
  for (let i = 0; i < current.length; i++) {
    if (current[i].id !== renderedVacancies[i].id) return false;
    // Optionally, compare more fields if needed:
    // if (JSON.stringify(current[i]) !== JSON.stringify(renderedVacancies[i])) return false;
  }
  return true;
}
