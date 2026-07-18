import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { NgoHub } from './pages/NgoHub'
import { CompanyHub } from './pages/CompanyHub'
import { BulkEmail } from './pages/BulkEmail'
import { NgoEvents } from './pages/NgoEvents'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ngo-hub" element={<NgoHub />} />
        <Route path="/company-hub" element={<CompanyHub />} />
        <Route path="/bulk-email" element={<BulkEmail />} />
        <Route path="/ngo-events" element={<NgoEvents />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
