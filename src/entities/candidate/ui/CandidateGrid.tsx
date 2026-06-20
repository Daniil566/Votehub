import type { Candidate } from "../model/types";
import { CandidateCard } from "./CandidateCard";

interface CandidateGridProps {
  candidates: Candidate[];
  canVote: boolean;
  isAdmin: boolean;
  onVote: (candidate: Candidate) => void;
  onApprove: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
}

export function CandidateGrid({ candidates, canVote, isAdmin, onVote, onApprove, onDelete }: CandidateGridProps) {
  const maxVotes = Math.max(1, ...candidates.map((item) => item.voteCount));

  if (candidates.length === 0) {
    return (
      <section className="page-card">
        <p className="section-label">Идеи</p>
        <h2>Пока нет проектов для голосования</h2>
        <p className="page-copy">
          Добавьте первую идею или дождитесь одобрения заявок администратором.
        </p>
      </section>
    );
  }

  return (
    <section className="grid">
      {candidates.map((candidate, index) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          maxVotes={maxVotes}
          rank={index + 1}
          canVote={canVote}
          isAdmin={isAdmin}
          onVote={onVote}
          onApprove={onApprove}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
