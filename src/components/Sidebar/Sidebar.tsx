import { useTranslation } from "react-i18next";
import cn from "clsx";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../store/hook.ts";
import { selectSidebar } from "../../store/slices/sidebarSlice/sidebarSelector.ts";
import {
  closeSidebar,
  openSidebar,
} from "../../store/slices/sidebarSlice/sidebarSlice.ts";
import { openModal } from "../../store/slices/modalSlice/modalSlice.ts";

import { ICON } from "../Icon/icons.ts";
import SidebarNavItem from "./components/SidebarNavItem.tsx";
import LanguageToggle from "./components/LanguageToggle.tsx";
import ThemeToggle from "./components/ThemeToggle.tsx";
import SidebarActionItem from "./components/SidebarActionItem.tsx";
import NavList from "./components/NavList.tsx";
import OpenSidebarBtn from "./components/OpenSidebarBtn.tsx";
import CloseSidebarBtn from "./components/CloseSidebarBtn.tsx";

function Sidebar() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isOpenSidebar = useAppSelector(selectSidebar);

  const isDesktop = useMediaQuery({ minWidth: 1280 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    if (!isDesktop && isOpenSidebar) {
      dispatch(closeSidebar());
    }
  }, [isMobile, dispatch, isDesktop, isOpenSidebar]);

  const handleLogOut = (): void => {
    dispatch(
      openModal({
        typeModal: "logOut",
      })
    );
  };

  const handleSupportModal = (): void => {
    dispatch(
      openModal({
        typeModal: "contactUs",
      })
    );
  };

  const handleOpenSidebar = () => {
    dispatch(openSidebar());
  };

  const handleCloseSidebar = () => {
    dispatch(closeSidebar());
  };

  const { t } = useTranslation();
  const isArchiveBtnRender =
    isMobile && location.pathname.includes("vacancies");

  const navListForRender = isArchiveBtnRender
    ? NavList()
    : NavList().slice(0, -1);

  return (
    <aside
      className={cn(
        "custom-size fixed right-0 top-0 z-20 flex h-fit max-h-dvh flex-col justify-between bg-backgroundSecondary px-5 py-4 font-nunito text-base font-medium leading-[135%] dark:bg-backgroundTertiary md:h-[780px] md:p-6 md:text-xl xl:left-0 xl:h-dvh xl:rounded-r-[20px] 3xl:py-8 smOnly:overflow-y-scroll mdOnly:overflow-y-scroll mdOnly:rounded-l-[20px]",
        isOpenSidebar
          ? "w-full md:w-[256px]"
          : "w-[92px] translate-x-[92px] xl:transform-none xl:px-3 3xl:px-3"
      )}
    >
      <div className={cn("flex flex-col")}>
        <div
          className={cn(
            "custom-size flex items-center justify-between",
            !isOpenSidebar ? "pl-[7px]" : "pl-0"
          )}
        >
          <OpenSidebarBtn
            handleOpenSidebar={handleOpenSidebar}
            icon={ICON.LOGO}
          />
          <CloseSidebarBtn
            handleOpenSidebar={handleCloseSidebar}
            isOpenSidebar={isOpenSidebar}
          />
        </div>

        <nav
          className={cn(
            "mt-6 flex flex-col gap-4 border-b-[1px] border-color9 pb-5 dark:border-textBlack",
            !isOpenSidebar && "items-center"
          )}
        >
          {navListForRender.map((item, index) => {
            return (
              <SidebarNavItem
                key={index}
                icon={item.icon}
                link={item.link}
                title={item.title}
                isOpen={isOpenSidebar}
                onClick={handleCloseSidebar}
              />
            );
          })}
        </nav>
      </div>
      <div className={cn("flex flex-col", !isOpenSidebar && "")}>
        <div className="flex flex-col gap-4 py-6">
          <LanguageToggle isOpen={isOpenSidebar} />
          <ThemeToggle isOpen={isOpenSidebar} />
        </div>

        <div
          className={cn(
            "flex flex-col gap-4 border-t-[1px] border-color9 pt-6 dark:border-textBlack",
            !isOpenSidebar && "items-center"
          )}
        >
          <SidebarActionItem
            icon="support"
            title={t("navigation.support")}
            isOpen={isOpenSidebar}
            donateIcon={false}
            className={cn(
              "box-border border-2 border-transparent active:border-iconHover",
              "active:bg-whiteColor dark:hover:bg-backgroundSecondary dark:active:bg-transparent"
            )}
            action={handleSupportModal}
          />
          <SidebarActionItem
            icon="donate"
            title={t("donate")}
            isOpen={isOpenSidebar}
            donateIcon={true}
            className={cn(
              "group border-textBlack bg-button px-3 hover:border-iconHover hover:bg-backgroundSecondary active:border-iconHover active:bg-iconHover"
              // "hover:fill-textBlack hover:text-textBlack active:fill-whiteColor active:text-whiteColor dark:group-hover:fill-blackColor dark:group-active:text-whiteColor"
            )}
          />
          <SidebarActionItem
            icon="log-out"
            title={t("navigation.logOut")}
            isOpen={isOpenSidebar}
            donateIcon={false}
            className={cn(
              "box-border border-2 border-transparent active:border-iconHover",
              "active:bg-whiteColor dark:hover:bg-backgroundSecondary dark:active:bg-transparent"
            )}
            action={handleLogOut}
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
