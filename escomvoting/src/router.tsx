import { type ReactNode } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { AdminLayout } from './components/admin/AdminLayout'
import { VoterLayout } from './components/voter/VoterLayout'
import { useAuth } from './contexts/AuthContext'

// ── Views ──────────────────────────────────────────────────────────────────
import { HomePage } from './views/home/HomePage'
import { LoginPage } from './views/auth/LoginPage'
import { DashboardPage } from './views/admin/DashboardPage'
import { ElectionsPage } from './views/admin/elections/ElectionsPage'
import { NewElectionPage } from './views/admin/elections/NewElectionPage'
import { EditElectionPage } from './views/admin/elections/EditElectionPage'
import { UsersPage } from './views/admin/users/UsersPage'
import { ImportUsersPage } from './views/admin/users/ImportUsersPage'
import { CreateUserPage } from './views/admin/users/CreateUserPage'
import { ElectionsListPage } from './views/voter/ElectionsListPage'
import { ElectionDetailPage } from './views/voter/ElectionDetailPage'
import { UrnPage } from './views/urn/UrnPage'
import { PastElectionsPage } from './views/public/PastElectionsPage'
import { ElectionResultsPage } from './views/public/ElectionResultsPage'

// ── Layout wrappers ────────────────────────────────────────────────────────

function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

// ── Route guards ───────────────────────────────────────────────────────────

function RequireAuth({ role, children }: { role?: string; children: ReactNode }) {
  const { isAuthenticated, session } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && session?.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}

function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth()
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/elections'} replace />
  return <>{children}</>
}

// ── Router ─────────────────────────────────────────────────────────────────

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public marketing + history pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/past-elections" element={<PastElectionsPage />} />
          <Route path="/elections/:id/results" element={<ElectionResultsPage />} />
        </Route>

        {/* Public urn — no auth, standalone layout */}
        <Route path="/elections/:id/urn" element={<UrnPage />} />

        {/* Auth — standalone (no Navbar/Footer) */}
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <LoginPage />
            </RedirectIfAuthed>
          }
        />

        {/* Voter — top-bar layout, any authenticated user */}
        <Route
          path="/elections"
          element={
            <RequireAuth>
              <VoterLayout />
            </RequireAuth>
          }
        >
          <Route index element={<ElectionsListPage />} />
          <Route path=":id" element={<ElectionDetailPage />} />
        </Route>

        {/* Admin — sidebar layout, role-protected */}
        <Route
          path="/admin"
          element={
            <RequireAuth role="PAAE">
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="elections" element={<ElectionsPage />} />
          <Route path="elections/new" element={<NewElectionPage />} />
          <Route path="elections/:id/edit" element={<EditElectionPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/import" element={<ImportUsersPage />} />
          <Route path="users/new" element={<CreateUserPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
