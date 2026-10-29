import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter, Link } from './router';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PhaseSequence } from './components/PhaseSequence';
import { CapabilitiesCore } from './components/CapabilitiesCore';
import { SmartDripShowcase } from './components/SmartDripShowcase';
import { PricingSection } from './components/PricingSection';
import { ProofOfScaleSection } from './components/ProofOfScaleSection';
import { ScrollReveal } from './components/ScrollReveal';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ShaderBackground } from './components/ShaderBackground';
import ClickSpark from './components/ClickSpark';

// Route-level code-splitting for performance
const WorksPage = React.lazy(() => import('./pages/WorksPage').then(m => ({ default: m.WorksPage })));
const ProjectDetailPage = React.lazy(() => import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const PricingPage = React.lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const OrderPage = React.lazy(() => import('./pages/OrderPage').then(m => ({ default: m.OrderPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AuthCallbackPage = React.lazy(() => import('./pages/AuthCallbackPage').then(m => ({ default: m.AuthCallbackPage })));
const MyRequestsPage = React.lazy(() => import('./pages/MyRequestsPage').then(m => ({ default: m.MyRequestsPage })));

const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center font-mono-tech text-xs text-[#476800]">
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 border-2 border-[#476800]/30 border-t-[#476800] rounded-full animate-spin" />
      <span>LOADING VIEW...</span>
    </div>
  </div>
);

function AppContent() {
  const { path, navigate } = useRouter();
  const { user, loading, isAdmin } = useAuth();

  const [isCircuitShaderActive, setIsCircuitShaderActive] = useState<boolean>(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [modalInitialService, setModalInitialService] = useState<string | undefined>(undefined);
  const [modalInitialTier, setModalInitialTier] = useState<string | undefined>(undefined);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const normalizedPath = path.replace(/\/$/, '') || '/';
  const isAuthRoute =
    normalizedPath === '/login' ||
    normalizedPath === '/admin-login' ||
    normalizedPath === '/signup' ||
    normalizedPath === '/forgot-password';

  // Route handling:
  // /admin requires admin privileges.
  if (normalizedPath === '/admin' || normalizedPath.startsWith('/admin/')) {
    if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center font-mono-tech text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            <span>VERIFYING ACCESS...</span>
          </div>
        </div>
      );
    }
    if (!user) {
      return (
        <React.Suspense fallback={<RouteLoadingFallback />}>
          <LoginPage />
        </React.Suspense>
      );
    }
    if (user.id !== '9163b26d-c7b1-4a13-8688-62ca34233fd9') {
      // Authenticated user but not admin -> redirect to normal home page
      window.location.replace('/');
      return null;
    }
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <AdminDashboardPage />
      </React.Suspense>
    );
  }

  // Route: /auth/callback for Google OAuth redirect
  if (normalizedPath === '/auth/callback') {
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <AuthCallbackPage />
      </React.Suspense>
    );
  }

  // If someone explicitly navigates to /login, show LoginPage
  if (normalizedPath === '/login' || normalizedPath === '/admin-login') {
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <LoginPage />
      </React.Suspense>
    );
  }
  if (normalizedPath === '/signup') {
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <SignupPage />
      </React.Suspense>
    );
  }
  if (normalizedPath === '/forgot-password') {
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <ForgotPasswordPage />
      </React.Suspense>
    );
  }

  // 4. Render Main Website (For authenticated users OR visitors with user permission)
  const handleStartProject = (serviceName?: string, tierName?: string) => {
    navigate('/order', { initialService: serviceName, selectedSpeed: tierName });
  };

  const handleExploreWork = () => {
    navigate('/works');
  };

  const isHome = normalizedPath === '/' || normalizedPath === '' || normalizedPath === '/home';

  return (
    <div
      className={`min-h-screen transition-colors duration-500 relative selection:bg-[#c8f179] selection:text-[#000000] ${
        isCircuitShaderActive ? 'bg-[#0a0a0a] text-white' : 'bg-[#f9faf7] text-[#191c1b]'
      }`}
    >
      <ClickSpark
        sparkColor="#c8f179"
        sparkSize={10}
        sparkRadius={20}
        sparkCount={8}
        duration={400}
      >
        {/* Interactive WebGL Circuit Shader Background (Toggleable) */}
        <ShaderBackground
          opacity={isCircuitShaderActive ? 0.92 : 0}
          className="transition-opacity duration-700 pointer-events-none"
        />

        {/* Main Header / Navigation (Shared across all pages) */}
        <Header isCircuitShaderActive={isCircuitShaderActive} />

        {/* Main Content Sections */}
        <main className="relative z-10 pt-[58px] sm:pt-[68px] md:pt-[84px]">
          <React.Suspense fallback={<RouteLoadingFallback />}>
            <div key={path} className="page-enter min-h-[70vh]">
              {/* Route: /works */}
              {normalizedPath === '/works' && <WorksPage />}

              {/* Route: /works/:slug */}
              {normalizedPath.startsWith('/works/') && normalizedPath !== '/works/' && (
                <ProjectDetailPage slug={normalizedPath.replace(/^\/works\//, '')} />
              )}

              {/* Route: /services */}
              {normalizedPath === '/services' && <ServicesPage />}

              {/* Route: /about */}
              {normalizedPath === '/about' && <AboutPage />}

              {/* Route: /pricing */}
              {normalizedPath === '/pricing' && <PricingPage />}

              {/* Route: /order or /start-a-project */}
              {(normalizedPath === '/order' || normalizedPath === '/start-a-project') && <OrderPage />}

              {/* Route: /my-requests */}
              {normalizedPath === '/my-requests' && <MyRequestsPage />}

              {/* 404 Not Found Fallback */}
              {!isHome &&
                normalizedPath !== '/works' &&
                !normalizedPath.startsWith('/works/') &&
                normalizedPath !== '/services' &&
                normalizedPath !== '/about' &&
                normalizedPath !== '/pricing' &&
                normalizedPath !== '/order' &&
                normalizedPath !== '/start-a-project' &&
                normalizedPath !== '/my-requests' && (
                  <div className="py-24 px-6 text-center max-w-xl mx-auto flex flex-col items-center justify-center">
                    <div className="inline-flex items-center gap-2 border border-[#c4c7c7] px-3.5 py-1 rounded-full bg-white mb-4 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#476800]" />
                      <span className="font-mono-tech text-xs text-[#476800] uppercase font-bold tracking-wider">
                        404 // NOT FOUND
                      </span>
                    </div>
                    <h1 className="font-display-tech text-3xl sm:text-4xl font-extrabold text-[#000000] tracking-tight mb-3">
                      PAGE NOT FOUND
                    </h1>
                    <p className="font-display-tech text-sm sm:text-base text-[#444748] mb-8 leading-relaxed max-w-md">
                      The requested engineering document or route does not exist. Please check the URL or return to our portfolio.
                    </p>
                    <Link
                      to="/"
                      className="cosmic-project-btn inline-flex items-center gap-2"
                    >
                      <span>Return to Homepage</span>
                    </Link>
                  </div>
                )}

              {/* Default Route: Exact Full Original Home Page */}
              {isHome && (
                <>
                  {/* Hero Section */}
                  <Hero
                    onStartProject={() => handleStartProject()}
                    onExploreWork={handleExploreWork}
                    isDarkTheme={isCircuitShaderActive}
                  />

                  {/* Section 1: Phase Sequence (From Idea to Product) */}
                  <PhaseSequence />

                  {/* Section 2: Capabilities Core (What We Build) */}
                  <CapabilitiesCore
                    onStartProjectForService={(service) => handleStartProject(service)}
                  />

                  {/* Section 3: SmartDrip+ Product Showcase */}
                  <ScrollReveal>
                    <SmartDripShowcase onStartProject={handleStartProject} />
                  </ScrollReveal>

                  {/* Section 5: Transparent Engagement Models */}
                  <ScrollReveal>
                    <PricingSection
                      onSelectTier={(tier) => handleStartProject(undefined, tier)}
                    />
                  </ScrollReveal>

                  {/* Section 6: Proof of Scale & Final CTA */}
                  <ScrollReveal>
                    <ProofOfScaleSection onStartProject={() => handleStartProject()} />
                  </ScrollReveal>
                </>
              )}
            </div>
          </React.Suspense>
        </main>

        {/* Footer (Shared across all pages) */}
        <Footer />

        {/* Interactive Project Brief & Estimator Modal */}
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
            setModalInitialService(undefined);
            setModalInitialTier(undefined);
          }}
          initialService={modalInitialService}
          initialTier={modalInitialTier}
        />
      </ClickSpark>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}
