import { lazy, Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";

const OverviewPage = lazy(() =>
  import("./features/overview/OverviewPage").then(({ OverviewPage }) => ({
    default: OverviewPage,
  })),
);
const RadarPage = lazy(() =>
  import("./features/radar/RadarPage").then(({ RadarPage }) => ({
    default: RadarPage,
  })),
);
const LeadsPage = lazy(() =>
  import("./features/leads/LeadsPage").then(({ LeadsPage }) => ({
    default: LeadsPage,
  })),
);
const LeadIntelligencePage = lazy(() =>
  import("./features/lead-intelligence/LeadIntelligencePage").then(
    ({ LeadIntelligencePage }) => ({ default: LeadIntelligencePage }),
  ),
);
const PipelinePage = lazy(() =>
  import("./features/pipeline/PipelinePage").then(({ PipelinePage }) => ({
    default: PipelinePage,
  })),
);
const DemosPage = lazy(() =>
  import("./features/demos/DemosPage").then(({ DemosPage }) => ({
    default: DemosPage,
  })),
);
const InsightsPage = lazy(() =>
  import("./features/insights/InsightsPage").then(({ InsightsPage }) => ({
    default: InsightsPage,
  })),
);

function PageFallback() {
  return (
    <div
      className="rounded-2xl border border-line bg-panel/70 p-8 text-sm text-muted"
      role="status"
      aria-live="polite"
    >
      Carregando painel…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <AppShell>
                  <Outlet />
                </AppShell>
              }
            >
              <Route path="/" element={<OverviewPage />} />
              <Route path="/radar" element={<RadarPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/:id" element={<LeadIntelligencePage />} />
              <Route path="/pipeline" element={<PipelinePage />} />
              <Route path="/demos" element={<DemosPage />} />
              <Route path="/insights" element={<InsightsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
