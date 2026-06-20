import type { CandidateDraft } from "./types";

export const ideaCategories = ["Фронтенд", "База данных", "DevOps", "Дизайн"];

export const emptyCandidateDraft: CandidateDraft = {
  name: "",
  category: ideaCategories[0],
  description: "",
};
