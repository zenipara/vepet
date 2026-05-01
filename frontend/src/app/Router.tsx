import { createBrowserRouter } from 'react-router-dom'
import { RoleGuard } from '@/utils/roleGuard'

// Layouts
import { PublicLayout } from './layouts/PublicLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { ClinicLayout } from './layouts/ClinicLayout'
import { AdminLayout } from './layouts/AdminLayout'

// Pages - Public
import { HomePage } from '@/pages/public/HomePage'
import { EmergencyPage } from '@/pages/public/EmergencyPage'

// Pages - Auth
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'

// Pages - Dashboard (Customer)
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PetsPage } from '@/pages/dashboard/PetsPage'
import { BookingPage } from '@/pages/dashboard/BookingPage'
import { RecoveryPage } from '@/pages/dashboard/RecoveryPage'

// Pages - Clinic (Staff/Doctor)
import { ClinicPage } from '@/pages/clinic/ClinicPage'
import { AppointmentsPage } from '@/pages/clinic/AppointmentsPage'
import { PatientsPage } from '@/pages/clinic/PatientsPage'
import { EMRPage } from '@/pages/clinic/EMRPage'

// Pages - Admin
import { AdminPage } from '@/pages/admin/AdminPage'
import { UsersPage } from '@/pages/admin/UsersPage'
import { CMSPage } from '@/pages/admin/CMSPage'

// Error pages
import { NotFoundPage } from '@/pages/NotFoundPage'
import { UnauthorizedPage } from '@/pages/UnauthorizedPage'

export const router = createBrowserRouter(
  [
    {
      element: <PublicLayout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/emergency', element: <EmergencyPage /> },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        { path: '/login', element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <RoleGuard allowedRoles={['customer']}>
          <DashboardLayout />
        </RoleGuard>
      ),
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'pets', element: <PetsPage /> },
        { path: 'booking', element: <BookingPage /> },
        { path: 'recovery/:caseId', element: <RecoveryPage /> },
      ],
    },
    {
      path: '/clinic',
      element: (
        <RoleGuard allowedRoles={['staff', 'doctor']}>
          <ClinicLayout />
        </RoleGuard>
      ),
      children: [
        { index: true, element: <ClinicPage /> },
        { path: 'appointments', element: <AppointmentsPage /> },
        { path: 'patients', element: <PatientsPage /> },
        { path: 'emr/:petId', element: <EMRPage /> },
      ],
    },
    {
      path: '/admin',
      element: (
        <RoleGuard allowedRoles={['admin']}>
          <AdminLayout />
        </RoleGuard>
      ),
      children: [
        { index: true, element: <AdminPage /> },
        { path: 'users', element: <UsersPage /> },
        { path: 'cms', element: <CMSPage /> },
      ],
    },
    {
      path: '/unauthorized',
      element: <UnauthorizedPage />,
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
