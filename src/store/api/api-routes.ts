export const BACKEND_ENDPOINTS = {
  JOB_TRACKER_BACKEND: "https://apply-tracker-backend.vercel.app/api",
};

type ApiRouts = {
  USER: { PROFILE: string; CHANGE_PASSWORD: string; SOCIALS: string };
  AUTH: {
    REGISTER: string;
    LOGIN: string;
    LOGOUT: string;
    REFRESH: string;
    FORGOT_PASSWORD: string;
    RESET_PASSWORD: string;
  };
  COVER_LETTER: string;
  EVENTS: string;
  NOTES: string;
  PREDICTIONS: string;
  PROJECTS: string;
  RESUMES: string;
  VACANCIES: string;
};

export const API_ROUTES: ApiRouts = {
  USER: {
    PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
    SOCIALS: "/user/socials",
  },
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    RESET_PASSWORD: "/auth/reset-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  COVER_LETTER: "/cover-letter",
  EVENTS: "/events",
  NOTES: "/notes",
  PREDICTIONS: "/predictions",
  PROJECTS: "/projects",
  RESUMES: "/resumes",
  VACANCIES: "/vacancies",
};
