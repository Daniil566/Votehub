export type UserRole = "admin" | "participant";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface AuthDraft {
  email: string;
  password: string;
}

export interface AuthResult {
  session: UserSession | null;
  message: string;
}
