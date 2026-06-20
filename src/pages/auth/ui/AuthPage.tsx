import { FormEvent } from "react";
import type { AuthDraft, UserSession } from "../../../entities/session/model/types";
import { AuthPanel } from "../../../features/auth/ui/AuthPanel";

interface AuthPageProps {
  draft: AuthDraft;
  session: UserSession | null;
  error: string;
  message: string;
  onDraftChange: (draft: AuthDraft) => void;
  onSignIn: (event: FormEvent) => void;
  onSignUp: () => void;
  onSignOut: () => void;
}

export function AuthPage(props: AuthPageProps) {
  return (
    <section className="page-stack auth-page">
      <section className="page-card intro-card">
        <p className="section-label">Авторизация</p>
        <h2>Доступ к аккаунту</h2>
        <p className="page-copy">
          Войдите, чтобы предлагать проектные идеи, голосовать и смотреть профиль.
        </p>
      </section>
      <AuthPanel {...props} />
    </section>
  );
}
