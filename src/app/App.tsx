import type { FormEvent } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppNavigation } from "../widgets/navigation/ui/AppNavigation";
import { PageHeader } from "../widgets/page-header/ui/PageHeader";
import { AuthPage } from "../pages/auth/ui/AuthPage";
import { useAuth } from "../pages/ideas/model/useAuth";
import { useCandidates } from "../pages/ideas/model/useCandidates";
import { IdeasPage } from "../pages/ideas/ui/IdeasPage";
import { ProfilePage } from "../pages/profile/ui/ProfilePage";

export default function App() {
  const navigate = useNavigate();
  const candidates = useCandidates();
  const auth = useAuth(candidates.loadCandidates);

  const handleSignIn = async (event: FormEvent) => {
    const session = await auth.signIn(event);
    if (session) navigate("/");
  };

  const handleSignUp = async () => {
    const session = await auth.signUp();
    if (session) navigate("/");
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/auth");
  };

  return (
    <main className="shell">
      <PageHeader />
      <AppNavigation session={auth.session} onSignOut={handleSignOut} />

      <Routes>
        <Route
          path="/"
          element={
            <IdeasPage
              candidates={candidates.visibleCandidates}
              categories={candidates.categories}
              activeCategory={candidates.category}
              draft={candidates.draft}
              session={auth.session}
              appError={candidates.appError}
              onCategoryChange={candidates.setCategory}
              onDraftChange={candidates.setDraft}
              onSubmitIdea={(event) => candidates.addCandidate(event, auth.session)}
              onVote={async (candidate) => {
                const voted = await candidates.vote(candidate, auth.session);
                if (!voted && !auth.session) navigate("/auth");
              }}
              onApprove={(candidate) => candidates.approveCandidate(candidate, auth.session)}
              onDelete={(candidate) => candidates.deleteCandidate(candidate, auth.session)}
              onGoToAuth={() => navigate("/auth")}
            />
          }
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              draft={auth.authDraft}
              session={auth.session}
              error={auth.authError}
              message={auth.authMessage}
              onDraftChange={auth.setAuthDraft}
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
              onSignOut={handleSignOut}
            />
          }
        />
        <Route
          path="/profile"
          element={
            auth.session ? (
              <ProfilePage session={auth.session} candidates={candidates.items} onGoToAuth={() => navigate("/auth")} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}
