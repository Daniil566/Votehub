import type { Candidate } from "../../../entities/candidate/model/types";
import { ProfilePanel } from "../../../entities/profile/ui/ProfilePanel";
import type { UserSession } from "../../../entities/session/model/types";

interface ProfilePageProps {
  session: UserSession | null;
  candidates: Candidate[];
  onGoToAuth: () => void;
}

export function ProfilePage({ session, candidates, onGoToAuth }: ProfilePageProps) {
  if (!session) {
    return (
      <section className="page-stack">
        <section className="page-card">
          <p className="section-label">Профиль</p>
          <h2>Профиль доступен после входа</h2>
          <p className="page-copy">Создайте аккаунт или войдите, чтобы увидеть роль, идеи и голоса.</p>
          <button type="button" onClick={onGoToAuth}>
            Перейти ко входу
          </button>
        </section>
      </section>
    );
  }

  const pendingIdeas = candidates.filter(
    (candidate) => candidate.createdBy === session.user.id && candidate.status === "pending",
  );

  return (
    <section className="page-stack profile-page">
      <ProfilePanel session={session} candidates={candidates} />
      <section className="page-card">
        <p className="section-label">Отправленные идеи</p>
        <h2>Ожидают одобрения</h2>
        {pendingIdeas.length > 0 ? (
          <ul className="idea-list">
            {pendingIdeas.map((candidate) => (
              <li key={candidate.id}>
                <strong>{candidate.name}</strong>
                <span>{candidate.category}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="hint">У вас нет идей на проверке.</p>
        )}
      </section>
    </section>
  );
}
