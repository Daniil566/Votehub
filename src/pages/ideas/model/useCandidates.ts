import { FormEvent, useEffect, useMemo, useState } from "react";
import { candidateRepository } from "../../../entities/candidate/api/candidateRepository";
import { emptyCandidateDraft } from "../../../entities/candidate/model/constants";
import type { Candidate, CandidateDraft } from "../../../entities/candidate/model/types";
import type { UserSession } from "../../../entities/session/model/types";
import { toUserMessage } from "../../../shared/lib/errors";

export const useCandidates = () => {
  const [items, setItems] = useState<Candidate[]>([]);
  const [category, setCategory] = useState("all");
  const [draft, setDraft] = useState<CandidateDraft>(emptyCandidateDraft);
  const [appError, setAppError] = useState("");

  const loadCandidates = async (session: UserSession | null) => {
    const candidates = await candidateRepository.list(session);
    setItems(candidates);
  };

  useEffect(() => {
    loadCandidates(null).catch((error) => setAppError(toUserMessage(error, "Не удалось загрузить идеи.")));
  }, []);

  const categories = useMemo(() => ["all", ...Array.from(new Set(items.map((item) => item.category)))], [items]);

  const visibleCandidates = useMemo(
    () =>
      items
        .filter((item) => category === "all" || item.category === category)
        .sort((first, second) => second.voteCount - first.voteCount),
    [category, items],
  );

  const addCandidate = async (event: FormEvent, session: UserSession | null) => {
    event.preventDefault();
    if (!session || !draft.name.trim()) return;

    const created = await candidateRepository.create(draft, session);
    setItems((current) => [created, ...current]);
    setDraft(emptyCandidateDraft);
    setAppError(created.status === "pending" ? "Идея отправлена и ожидает одобрения администратора." : "");
  };

  const vote = async (candidate: Candidate, session: UserSession | null) => {
    if (!session) {
      setAppError("Войдите в аккаунт перед голосованием.");
      return false;
    }

    setAppError("");
    try {
      await candidateRepository.vote(candidate, session);
      await loadCandidates(session);
      return true;
    } catch (error) {
      setAppError(toUserMessage(error, "Не удалось сохранить голос."));
      return false;
    }
  };

  const approveCandidate = async (candidate: Candidate, session: UserSession | null) => {
    if (!session) return;

    setAppError("");
    try {
      await candidateRepository.approve(candidate.id, session);
      await loadCandidates(session);
    } catch (error) {
      setAppError(toUserMessage(error, "Не удалось одобрить идею."));
    }
  };

  const deleteCandidate = async (candidate: Candidate, session: UserSession | null) => {
    if (!session) return;

    setAppError("");
    try {
      await candidateRepository.remove(candidate.id, session);
      await loadCandidates(session);
    } catch (error) {
      setAppError(toUserMessage(error, "Не удалось удалить идею."));
    }
  };

  return {
    items,
    categories,
    visibleCandidates,
    category,
    draft,
    appError,
    setCategory,
    setDraft,
    loadCandidates,
    addCandidate,
    vote,
    approveCandidate,
    deleteCandidate,
  };
};
