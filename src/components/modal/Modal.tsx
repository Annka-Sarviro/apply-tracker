import { FC, useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  closeConfirmation,
  closeModal,
} from "../../store/slices/modalSlice/modalSlice";

import { contentMap } from "./modalMappings";

import ModalMain from "./ModalMain.tsx";
import classNames from "classnames";

const Modal: FC = () => {
  const dispatch = useAppDispatch();
  const {
    isModalOpen,
    typeModal,
    isConfirmationOpen,
    typeConfirmation,
    isButtonOpen,
    resetForm,
  } = useAppSelector((state) => state.modal);

  const modalData = contentMap[typeModal || "close"];
  const confirmationData = contentMap[typeConfirmation || "close"];

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isConfirmationOpen) {
          return dispatch(closeConfirmation());
        }
        return isButtonOpen ? resetForm?.() : dispatch(closeModal());
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // відключення скролу background
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.body.style.overflow = "unset"; // включення скролу
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [dispatch, isModalOpen, isConfirmationOpen, isButtonOpen, resetForm]);

  const handleCloseModal = () => {
    if (isConfirmationOpen) {
      return;
    }
    return isButtonOpen ? resetForm?.() : dispatch(closeModal());
  };

  // alex Авто скрол до вікна підтвердження
  const modalRef = useRef<HTMLDivElement>(null);
  const modalHeightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isConfirmationOpen]);
  //

  if (!isModalOpen) return null;

  return (
    <div
      ref={modalHeightRef}
      className={classNames(
        "fixed right-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-black bg-opacity-50 font-nunito backdrop-blur-sm"
      )}
      onClick={() => handleCloseModal()}
    >
      <div className="flex">
        <ModalMain
          className={classNames(
            "scrollbar-transparent absolute left-2/4 top-10 mt-[10px] -translate-x-2/4"
          )}
          modalData={modalData}
          btnFunc={() => {
            return isButtonOpen ? resetForm?.() : dispatch(closeModal());
          }}
        />
      </div>
      {isConfirmationOpen ? (
        <div
          className={classNames(
            "fixed right-0 top-0 z-50 flex w-full items-center justify-center bg-[#C2C2C2] bg-opacity-50"
          )}
          style={{ height: modalHeightRef.current?.scrollHeight }}
        >
          <ModalMain
            ref={modalRef}
            className="sticky mb-[210px] mt-auto md:mb-[145px] xl:mb-auto"
            modalData={confirmationData}
            btnFunc={() => dispatch(closeConfirmation())}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Modal;
