import type { Candidate } from "../../candidate/model/types";
import type { UserSession } from "../../session/model/types";

interface ProfilePanelProps {
  session: UserSession | null;
  candidates: Candidate[];
}

export function ProfilePanel({ session, candidates }: ProfilePanelProps) {
  if (!session) {
    return (
      <section className="profile-panel">
        <p className="section-label">Профиль</p>
        <strong>Гость</strong>
        <p className="hint">Войдите, чтобы увидеть роль, отправленные идеи и голоса.</p>
      </section>
    );
  }

  const myVotes = candidates.filter((candidate) => candidate.votedByCurrentUser);
  const myIdeas = candidates.filter((candidate) => candidate.createdBy === session.user.id);
  const roleLabel = session.user.role === "admin" ? "администратор" : "участник";

  return (
    <section className="profile-panel">
      <div>
        <p className="section-label">Профиль</p>
        <strong>{session.user.email}</strong>
      </div>
      <div className="profile-stats">
        <span>Роль: {roleLabel}</span>
        <span>Мои идеи: {myIdeas.length}</span>
        <span>Мои голоса: {myVotes.length}</span>
      </div>
      <div className="my-votes">
        <strong>Мои голоса</strong>
        {myVotes.length > 0 ? (
          <ul>
            {myVotes.map((candidate) => (
              <li key={candidate.id}>{candidate.name}</li>
            ))}
          </ul>
        ) : (
          <p className="hint">Вы пока не голосовали.</p>
        )}
      </div>
    </section>
  );
}
