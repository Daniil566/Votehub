import { assertSupabaseConfig, supabase } from "../../../shared/api/supabaseClient";
import type { AuthDraft, AuthResult, UserProfile, UserRole, UserSession } from "../model/types";

const sessionKey = "votehub-session";

const saveSession = (session: UserSession | null) => {
  if (!session) {
    localStorage.removeItem(sessionKey);
    return;
  }
  localStorage.setItem(sessionKey, JSON.stringify(session));
};

const validateDraft = (draft: AuthDraft) => {
  if (!draft.email.trim()) {
    throw new Error("Введите email.");
  }
  if (draft.password.length < 6) {
    throw new Error("Пароль должен содержать не меньше 6 символов.");
  }
};

const ensureProfile = async (session: UserSession): Promise<UserProfile> => {
  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  if (selectError) throw selectError;

  if (existingProfile) {
    return {
      id: String(existingProfile.id),
      email: String(existingProfile.email),
      role: existingProfile.role as UserRole,
    };
  }

  const { data: createdProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({ id: session.user.id, email: session.user.email, role: "participant" })
    .select("*")
    .single();

  if (insertError) throw insertError;

  return {
    id: String(createdProfile.id),
    email: String(createdProfile.email),
    role: createdProfile.role as UserRole,
  };
};

const toSession = async (
  accessToken: string,
  refreshToken: string,
  user: { id: string; email?: string },
): Promise<UserSession> => {
  const baseSession: UserSession = {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email ?? "", role: "participant" },
  };

  return { ...baseSession, user: await ensureProfile(baseSession) };
};

export const authRepository = {
  getSession(): UserSession | null {
    const raw = localStorage.getItem(sessionKey);
    return raw ? (JSON.parse(raw) as UserSession) : null;
  },

  async signIn(draft: AuthDraft) {
    assertSupabaseConfig();
    validateDraft(draft);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: draft.email.trim(),
      password: draft.password,
    });

    if (error) throw error;
    if (!data.session || !data.user) {
      throw new Error("Не удалось создать сессию авторизации.");
    }

    const session = await toSession(data.session.access_token, data.session.refresh_token, {
      id: data.user.id,
      email: data.user.email,
    });
    saveSession(session);
    return session;
  },

  async signUp(draft: AuthDraft): Promise<AuthResult> {
    assertSupabaseConfig();
    validateDraft(draft);

    const { data, error } = await supabase.auth.signUp({
      email: draft.email.trim(),
      password: draft.password,
    });

    if (error) throw error;

    if (!data.session || !data.user) {
      return {
        session: null,
        message: "Аккаунт создан. Если требуется подтверждение почты, подтвердите email и войдите.",
      };
    }

    const session = await toSession(data.session.access_token, data.session.refresh_token, {
      id: data.user.id,
      email: data.user.email,
    });
    saveSession(session);
    return { session, message: "Аккаунт создан. Вы вошли в систему." };
  },

  async signOut(session: UserSession | null) {
    if (session) await supabase.auth.signOut();
    saveSession(null);
  },
};
