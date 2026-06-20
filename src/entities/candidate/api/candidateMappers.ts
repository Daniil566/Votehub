import type { Candidate, CandidateStatus, StoredCandidate, Vote } from "../model/types";

export const fromCandidateRow = (row: Record<string, unknown>): StoredCandidate => ({
  id: String(row.id),
  name: String(row.name),
  category: String(row.category),
  description: String(row.description ?? ""),
  createdBy: String(row.created_by ?? ""),
  status: row.status as CandidateStatus,
  createdAt: String(row.created_at),
});

export const fromVoteRow = (row: Record<string, unknown>): Vote => ({
  id: String(row.id),
  candidateId: String(row.candidate_id),
  userId: String(row.user_id),
  createdAt: String(row.created_at),
});

export const toCandidate = (
  candidate: StoredCandidate,
  votes: Vote[],
  currentUserId: string | undefined,
): Candidate => {
  const candidateVotes = votes.filter((vote) => vote.candidateId === candidate.id);
  return {
    ...candidate,
    voteCount: candidateVotes.length,
    votedByCurrentUser: Boolean(currentUserId && candidateVotes.some((vote) => vote.userId === currentUserId)),
  };
};
