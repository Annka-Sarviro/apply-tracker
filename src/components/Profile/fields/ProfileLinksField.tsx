import { Input } from "@/components/inputs/Input/Input";
import { notifyError } from "@/components/Notifications/NotificationService";
import { notifySuccess } from "@/components/Notifications/NotificationService";
import { userDataSchema } from "@/schemas/profile/userDataSchem";
import {
  useGetAllUserDataQuery,
  useUpdateUserProfileMutation,
} from "@/store/querySlices/profileQuerySlice";
import { Profile, ProfileKeys } from "@/types/profile.types";
import { copyInputValue } from "@/utils/copyInputValue";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const userData: ProfileLinkProps[] = ["username", "email", "phone"];
type ProfileLinkProps = "username" | "email" | "phone";

function ProfileLinksField() {
  const {
    register,
    resetField,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<Pick<Profile, "username" | "email" | "phone">>({
    resolver: zodResolver(userDataSchema),
    mode: "all",
  });

  const [isInputLoading, setIsInputLoading] = useState<string>("");
  const initialValues = useRef<Record<string, string>>({});

  const [updateUserProfile] = useUpdateUserProfileMutation();
  const { t } = useTranslation();
  const { data: profile } = useGetAllUserDataQuery();

  useEffect(() => {
    if (!profile) return;

    const sanitizeValue = (value?: string) => {
      if (!value) return "";
      return value.replace(/\bundefined\b|null/gi, "").trim();
    };

    userData.forEach((key) => {
      const rawValue = profile[key] ?? "";
      const value = sanitizeValue(rawValue);

      setValue(key, value);
      initialValues.current[key] = value;
    });
  }, [profile, setValue]);
  const handleUpdateUserData = async (name: ProfileKeys, event: string) => {
    if (initialValues.current[name] === event) {
      return;
    }

    if (event !== "" && name === "phone") {
      const valueNumber = Number(event);

      if (!valueNumber && event.length <= 2) {
        clearErrors(name);
        setValue(name, initialValues.current[name]);
        return;
      }
      const isValid = await trigger(name);
      if (!isValid) {
        clearErrors(name);
        setValue(name, initialValues.current[name]);
        return;
      }
    }

    try {
      setIsInputLoading(name);
      await updateUserProfile({
        [name]: event,
      }).unwrap();

      if (name === "phone")
        notifySuccess(t("notification.updatedPhoneSuccess"));

      if (name === "username")
        notifySuccess(t("notification.updatedUserNameSuccess"));
    } catch {
      if (name === "phone") notifyError(t("notification.updatedPhone"));
      if (name === "username") notifyError(t("notification.updatedUserName"));
      setValue(name as ProfileLinkProps, initialValues.current[name]);
    } finally {
      setIsInputLoading("");
    }
  };

  return (
    <ul className="flex flex-col gap-4">
      {userData.map((item, index) => {
        const label =
          item === "email"
            ? "Email"
            : item === "phone"
              ? t("phone")
              : t("name");
        return (
          <li key={index}>
            <Input
              onBlur={(e) => {
                if (item === "email") return;

                handleUpdateUserData(item, e.currentTarget.value);
              }}
              disabled={
                item === "email" || isInputLoading === item ? true : false
              }
              label={label}
              type="vacancy"
              name={item}
              placeholder={
                item === "username"
                  ? "User123"
                  : item === "phone"
                    ? "+380123456789"
                    : ""
              }
              register={register}
              errors={errors}
              resetField={resetField}
              isCheckButtons={false}
              isButtonCopy={true}
              handleClickButtonCopyInput={() =>
                copyInputValue({
                  valueToCopy: watch(item as ProfileLinkProps) as string,
                  text:
                    item === "username"
                      ? t("notification.userNameCopied")
                      : item === "email"
                        ? t("notification.emailCopied")
                        : t("notification.phoneCopied"),
                })
              }
            />
            {index === userData.length - 1 && (
              <div className="mt-4 h-px w-full bg-borderLight" />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default ProfileLinksField;
