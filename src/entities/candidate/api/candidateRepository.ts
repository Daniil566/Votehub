import { assertSupabaseConfig, supabase } from "../../../shared/api/supabaseClient";
import type { UserSession } from "../../session/model/types";
import type { Candidate, CandidateDraft, StoredCandidate } from "../model/types";
import { fromCandidateRow, fromVoteRow, toCandidate } from "./candidateMappers";

const isVisibleForSession = (candidate: StoredCandidate, session: UserSession | null) =>
  candidate.status === "approved" ||
  session?.user.role === "admin" ||
  candidate.createdBy === session?.user.id;

const requireAdmin = (session: UserSession) => {
  if (session.user.role !== "admin") {
    throw new Error("Это действие доступно только администратору.");
  }
};

export const candidateRepository = {
  async list(session: UserSession | null) {
    assertSupabaseConfig();

    const [{ data: candidateRows, error: candidateError }, { data: voteRows, error: voteError }] =
      await Promise.all([
        supabase.from("candidates").select("*").order("created_at", { ascending: false }),
        supabase.from("votes").select("*"),
      ]);

    if (candidateError) throw candidateError;
    if (voteError) throw voteError;

    const votes = (voteRows ?? []).map((row: Record<string, unknown>) => fromVoteRow(row));
    return (candidateRows ?? [])
      .map((row: Record<string, unknown>) => fromCandidateRow(row))
      .filter((candidate: StoredCandidate) => isVisibleForSession(candidate, session))
      .map((candidate: StoredCandidate) => toCandidate(candidate, votes, session?.user.id));
  },

  async create(draft: CandidateDraft, session: UserSession) {
    assertSupabaseConfig();

    const candidate = {
      id: crypto.randomUUID(),
      ...draft,
      createdBy: session.user.id,
      status: session.user.role === "admin" ? "approved" : "pending",
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("candidates")
      .insert({
        id: candidate.id,
        name: candidate.name,
        category: candidate.category,
        description: candidate.description,
        created_by: candidate.createdBy,
        status: candidate.status,
        created_at: candidate.createdAt,
      })
      .select("*")
      .single();

    if (error) throw error;

    return toCandidate(fromCandidateRow(data), [], session.user.id);
  },

  async vote(candidate: Candidate, session: UserSession) {
    assertSupabaseConfig();

    if (candidate.status !== "approved") {
      throw new Error("Голосовать можно только за одобренные идеи.");
    }
    if (candidate.votedByCurrentUser) {
      throw new Error("Вы уже голосовали за эту идею.");
    }

    const { error } = await supabase.from("votes").insert({
      candidate_id: candidate.id,
      user_id: session.user.id,
    });

    if (error) throw error;
  },

  async approve(candidateId: string, session: UserSession) {
    assertSupabaseConfig();
    requireAdmin(session);

    const { error } = await supabase.from("candidates").update({ status: "approved" }).eq("id", candidateId);
    if (error) throw error;
  },

  async remove(candidateId: string, session: UserSession) {
    assertSupabaseConfig();
    requireAdmin(session);

    const { error } = await supabase.from("candidates").delete().eq("id", candidateId);
    if (error) throw error;
  },
};
