import { FormEvent } from "react";
import type { AuthDraft, UserSession } from "../../../entities/session/model/types";

interface AuthPanelProps {
  draft: AuthDraft;
  session: UserSession | null;
  error: string;
  message: string;
  onDraftChange: (draft: AuthDraft) => void;
  onSignIn: (event: FormEvent) => void;
  onSignUp: () => void;
  onSignOut: () => void;
}

export function AuthPanel({
  draft,
  session,
  error,
  message,
  onDraftChange,
  onSignIn,
  onSignUp,
  onSignOut,
}: AuthPanelProps) {
  if (session) {
    return (
      <section className="auth-panel">
        <div>
          <p className="section-label">Вы вошли</p>
          <strong>{session.user.email}</strong>
        </div>
        <button type="button" onClick={onSignOut}>
          Выйти
        </button>
      </section>
    );
  }

  return (
    <form className="auth-panel" onSubmit={onSignIn}>
      <div>
        <p className="section-label">Аккаунт</p>
        <strong>Войдите, чтобы голосовать</strong>
      </div>
      <input
        type="email"
        placeholder="email@example.com"
        value={draft.email}
        onChange={(event) => onDraftChange({ ...draft, email: event.target.value })}
      />
      <input
        type="password"
        placeholder="пароль"
        value={draft.password}
        onChange={(event) => onDraftChange({ ...draft, password: event.target.value })}
      />
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      <div className="auth-actions">
        <button type="submit">Войти</button>
        <button type="button" onClick={onSignUp}>
          Создать аккаунт
        </button>
      </div>
    </form>
  );
}
