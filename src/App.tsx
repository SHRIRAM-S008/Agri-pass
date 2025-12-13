import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Verify from "./pages/Verify";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import OfflineVerification from "./pages/OfflineVerification";

// Exporter pages
import ExporterDashboard from "./pages/exporter/ExporterDashboard";
import SubmitBatch from "./pages/exporter/SubmitBatch";
import BatchList from "./pages/exporter/BatchList";
import BatchDetails from "./pages/exporter/BatchDetails";
import ExporterCertificates from "./pages/exporter/Certificates";
import ExporterCertificate from "./pages/exporter/Certificate";

// QA Agency pages
import QADashboard from "./pages/qa/QADashboard";
import InspectionRequests from "./pages/qa/InspectionRequests";
import InspectionForm from "./pages/qa/InspectionForm";
import InspectionDetails from "./pages/qa/InspectionDetails";
import IssueCertificate from "./pages/qa/IssueCertificate";
import QACertificates from "./pages/qa/Certificates";
import QACertificateDetails from "./pages/qa/CertificateDetails";

// Importer pages
import ImporterDashboard from "./pages/importer/ImporterDashboard";
import ScanQR from "./pages/importer/ScanQR";
import VerificationResult from "./pages/importer/VerificationResult";
import VerificationHistory from "./pages/importer/History";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import AdminBatches from "./pages/admin/Batches";
import AdminBatchDetails from "./pages/admin/BatchDetails";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminCertificateDetails from "./pages/admin/CertificateDetails";
import Revocations from "./pages/admin/Revocations";
import AuditLogs from "./pages/admin/AuditLogs";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/verify/:id" element={<Verify />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/offline-verify" element={<OfflineVerification />} />

              {/* Exporter Routes */}
              <Route path="/exporter" element={<ExporterDashboard />} />
              <Route path="/exporter/submit" element={<SubmitBatch />} />
              <Route path="/exporter/batches" element={<BatchList />} />
              <Route path="/exporter/batches/:id" element={<BatchDetails />} />
              <Route path="/exporter/certificates" element={<ExporterCertificates />} />
              <Route path="/exporter/certificate/:id" element={<ExporterCertificate />} />

              {/* QA Agency Routes */}
              <Route path="/qa" element={<QADashboard />} />
              <Route path="/qa/requests" element={<InspectionRequests />} />
              <Route path="/qa/inspect/:batchId" element={<InspectionForm />} />
              <Route path="/qa/inspection/:id" element={<InspectionDetails />} />
              <Route path="/qa/issue/:id" element={<IssueCertificate />} />
              <Route path="/qa/certificates" element={<QACertificates />} />
              <Route path="/qa/certificate/:id" element={<QACertificateDetails />} />

              {/* Importer Routes */}
              <Route path="/importer" element={<ImporterDashboard />} />
              <Route path="/importer/scan" element={<ScanQR />} />
              <Route path="/importer/result/:id" element={<VerificationResult />} />
              <Route path="/importer/history" element={<VerificationHistory />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/batches" element={<AdminBatches />} />
              <Route path="/admin/batches/:id" element={<AdminBatchDetails />} />
              <Route path="/admin/certificates" element={<AdminCertificates />} />
              <Route path="/admin/certificate/:id" element={<AdminCertificateDetails />} />
              <Route path="/admin/revocations" element={<Revocations />} />
              <Route path="/admin/audit" element={<AuditLogs />} />
              <Route path="/admin/settings" element={<Settings />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
