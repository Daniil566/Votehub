import { FormEvent } from "react";
import { CandidateGrid } from "../../../entities/candidate/ui/CandidateGrid";
import { CandidateForm } from "../../../features/candidate-create/ui/CandidateForm";
import { CategoryFilter } from "../../../features/candidate-filter/ui/CategoryFilter";
import type { Candidate, CandidateDraft } from "../../../entities/candidate/model/types";
import type { UserSession } from "../../../entities/session/model/types";

interface IdeasPageProps {
  candidates: Candidate[];
  categories: string[];
  activeCategory: string;
  draft: CandidateDraft;
  session: UserSession | null;
  appError: string;
  onCategoryChange: (category: string) => void;
  onDraftChange: (draft: CandidateDraft) => void;
  onSubmitIdea: (event: FormEvent) => void;
  onVote: (candidate: Candidate) => void;
  onApprove: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
  onGoToAuth: () => void;
}

export function IdeasPage({
  candidates,
  categories,
  activeCategory,
  draft,
  session,
  appError,
  onCategoryChange,
  onDraftChange,
  onSubmitIdea,
  onVote,
  onApprove,
  onDelete,
  onGoToAuth,
}: IdeasPageProps) {
  return (
    <section className="page-stack">
      <section className="ideas-tools">
        <CandidateForm draft={draft} disabled={!session} onDraftChange={onDraftChange} onSubmit={onSubmitIdea} />
        {!session && (
          <section className="page-card">
            <p className="section-label">Участие</p>
            <h2>Войдите, чтобы предлагать идеи и голосовать</h2>
            <p className="page-copy">
              Гости могут смотреть одобренные идеи, но для голосования нужен аккаунт.
            </p>
            <button type="button" onClick={onGoToAuth}>
              Перейти ко входу
            </button>
          </section>
        )}
      </section>

      {appError && <p className="error-text">{appError}</p>}
      <CategoryFilter categories={categories} activeCategory={activeCategory} onChange={onCategoryChange} />
      <CandidateGrid
        candidates={candidates}
        canVote={Boolean(session)}
        isAdmin={session?.user.role === "admin"}
        onVote={onVote}
        onApprove={onApprove}
        onDelete={onDelete}
      />
    </section>
  );
}
