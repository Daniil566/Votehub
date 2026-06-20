import { NavLink } from "react-router-dom";
import type { UserSession } from "../../../entities/session/model/types";

interface AppNavigationProps {
  session: UserSession | null;
  onSignOut: () => void;
}

export function AppNavigation({ session, onSignOut }: AppNavigationProps) {
  const roleLabel = session?.user.role === "admin" ? "администратор" : session ? "участник" : "гость";

  return (
    <nav className="app-nav">
      <div className="nav-title">
        <span>Рабочая область</span>
        <strong>{roleLabel}</strong>
      </div>
      <NavLink to="/" end>
        Идеи
      </NavLink>
      {session ? (
        <>
          <NavLink to="/profile">Профиль</NavLink>
          <button className="muted-action" type="button" onClick={onSignOut}>
            Выйти
          </button>
        </>
      ) : (
        <NavLink to="/auth">Вход</NavLink>
      )}
    </nav>
  );
}
