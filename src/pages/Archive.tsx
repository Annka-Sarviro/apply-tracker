import PageHeader from "../components/commonComponents/PageHeader";
import VacancyMain from "@/components/Vacancies/components/VacancyMain";

function Archive() {
  return (
    <div className="container pb-5 pt-4 sm:pb-6 sm:pt-4 md:pb-6 md:pt-6 xl:pb-8 xl:pt-10">
      <div className="m-auto flex w-full flex-col">
        <PageHeader />
        <VacancyMain />
      </div>
    </div>
  );
}

export default Archive;
