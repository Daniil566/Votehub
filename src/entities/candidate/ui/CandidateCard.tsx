import type { Candidate } from "../model/types";

interface CandidateCardProps {
  candidate: Candidate;
  maxVotes: number;
  rank: number;
  canVote: boolean;
  isAdmin: boolean;
  onVote: (candidate: Candidate) => void;
  onApprove: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
}

export function CandidateCard({
  candidate,
  maxVotes,
  rank,
  canVote,
  isAdmin,
  onVote,
  onApprove,
  onDelete,
}: CandidateCardProps) {
  const disabled = !canVote || candidate.votedByCurrentUser || candidate.status !== "approved";
  const statusLabel = candidate.status === "approved" ? "одобрено" : "на проверке";
  const voteLabel = candidate.voteCount === 1 ? "голос" : "голосов";

  return (
    <article className="candidate">
      <div className="rank">{rank}</div>
      <div>
        <h2>{candidate.name}</h2>
        <p>{candidate.description || "Описание не добавлено."}</p>
        <div className="candidate-meta">
          <small>{candidate.category}</small>
          <span className={`status-pill ${candidate.status}`}>{statusLabel}</span>
        </div>
      </div>
      <div className="meter">
        <span style={{ width: `${(candidate.voteCount / maxVotes) * 100}%` }} />
      </div>
      <footer>
        <strong>
          {candidate.voteCount} {voteLabel}
        </strong>
        <button disabled={disabled} onClick={() => onVote(candidate)}>
          {candidate.votedByCurrentUser ? "Вы голосовали" : "Голосовать"}
        </button>
      </footer>
      {isAdmin && (
        <div className="admin-actions">
          {candidate.status === "pending" && (
            <button type="button" onClick={() => onApprove(candidate)}>
              Одобрить
            </button>
          )}
          <button type="button" onClick={() => onDelete(candidate)}>
            Удалить
          </button>
        </div>
      )}
    </article>
  );
}
