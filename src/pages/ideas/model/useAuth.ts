import { FormEvent, useState } from "react";
import { authRepository } from "../../../entities/session/api/authRepository";
import { emptyAuthDraft } from "../../../entities/session/model/constants";
import type { AuthDraft, UserSession } from "../../../entities/session/model/types";
import { toUserMessage } from "../../../shared/lib/errors";

export const useAuth = (onAuthorized: (session: UserSession | null) => Promise<void>) => {
  const [session, setSession] = useState<UserSession | null>(() => authRepository.getSession());
  const [authDraft, setAuthDraft] = useState<AuthDraft>(emptyAuthDraft);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const clearAuthState = () => {
    setAuthError("");
    setAuthMessage("");
  };

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    clearAuthState();

    try {
      const nextSession = await authRepository.signIn(authDraft);
      setSession(nextSession);
      await onAuthorized(nextSession);
      return nextSession;
    } catch (error) {
      setAuthError(toUserMessage(error, "Не удалось войти."));
      return null;
    }
  };

  const signUp = async () => {
    clearAuthState();

    try {
      const result = await authRepository.signUp(authDraft);
      setAuthMessage(result.message);

      if (result.session) {
        setSession(result.session);
        await onAuthorized(result.session);
      }

      return result.session;
    } catch (error) {
      setAuthError(toUserMessage(error, "Не удалось создать аккаунт."));
      return null;
    }
  };

  const signOut = async () => {
    await authRepository.signOut(session);
    setSession(null);
    await onAuthorized(null);
  };

  return {
    session,
    authDraft,
    authError,
    authMessage,
    setAuthDraft,
    signIn,
    signUp,
    signOut,
  };
};
