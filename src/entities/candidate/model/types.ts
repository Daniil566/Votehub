export type CandidateStatus = "pending" | "approved";

export interface Candidate {
  id: string;
  name: string;
  category: string;
  description: string;
  voteCount: number;
  votedByCurrentUser: boolean;
  createdBy: string;
  status: CandidateStatus;
  createdAt: string;
}

export interface StoredCandidate {
  id: string;
  name: string;
  category: string;
  description: string;
  createdBy: string;
  status: CandidateStatus;
  createdAt: string;
}

export interface CandidateDraft {
  name: string;
  category: string;
  description: string;
}

export interface Vote {
  id: string;
  candidateId: string;
  userId: string;
  createdAt: string;
}
