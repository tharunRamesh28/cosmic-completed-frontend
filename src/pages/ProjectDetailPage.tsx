import React, { useEffect } from 'react';
import { useRouter, Link } from '../router';
import { PROJECTS_DATA, Project } from '../data/projectsData';
import { CursorGrid } from '../components/CursorGrid';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Wrench,
  Activity,
  Terminal,
  FileText,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface ProjectDetailPageProps {
  slug?: string;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug: propSlug }) => {
  const { path, navigate } = useRouter();

  // Extract slug from prop or current pathname
  const currentSlug = propSlug || path.replace(/^\/works\/?/, '').replace(/\/$/, '');
  const project: Project | undefined = PROJECTS_DATA.find(
    (p) => p.slug.toLowerCase() === currentSlug.toLowerCase()
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentSlug]);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest mb-4">
          404 // PROJECT NOT FOUND
        </div>
        <h1 className="font-display-tech text-3xl sm:text-4xl font-extrabold text-[#000000] mb-6">
          THE SPECIFIED ENGINEERING WORK DOES NOT EXIST.
        </h1>
        <Link
          to="/works"
          className="inline-flex items-center gap-2 bg-[#000000] text-[#c8f179] font-mono-tech font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#191c1b] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ENGINEERING WORKS</span>
        </Link>
      </div>
    );
  }

  // Find next and previous projects for quick navigation
  const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === project.id);
  const prevProject = PROJECTS_DATA[(currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length];
  const nextProject = PROJECTS_DATA[(currentIndex + 1) % PROJECTS_DATA.length];

  return (
    <div className="w-full relative text-[#191c1b] selection:bg-[#c8f179] selection:text-[#000000] overflow-x-hidden">
      {/* Background Tech Grid & Cursor Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="tech-grid absolute inset-0 opacity-30 pointer-events-none -z-10" />
        <CursorGrid color="0, 0, 0" maxOpacity={0.2} />
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 pt-8 sm:pt-12 pb-24">
        {/* Top Breadcrumb Navigation */}
        <div className="font-mono-tech text-xs text-[#476800] font-bold mb-8 flex items-center flex-wrap gap-2">
          <Link to="/" className="text-[#444748] hover:text-black transition-colors">
            HOME
          </Link>
          <span>#</span>
          <Link to="/works" className="text-[#444748] hover:text-black transition-colors">
            01 # OUR WORKS
          </Link>
          <span>#</span>
          <span className="text-[#000000] uppercase font-extrabold">
            {project.number} # {project.title}
          </span>
        </div>

        {/* Hero Section */}
        <ScrollReveal>
          <div className="border-b border-[#c4c7c7]/60 pb-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-tech text-xl sm:text-2xl font-black text-[#000000] tracking-tight bg-black text-[#c8f179] px-3.5 py-1 rounded-lg">
                {project.number}
              </span>
              <span className="font-mono-tech text-xs sm:text-sm font-bold uppercase tracking-wider text-[#476800] bg-[#c8f179]/25 px-3 py-1 rounded border border-[#c8f179]/50">
                {project.category}
              </span>
            </div>

            <h1 className="font-display-tech text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#000000] tracking-tight leading-[1.05] mb-6">
              {project.title}
            </h1>

            <p className="font-display-tech text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-[#444748] max-w-4xl">
              {project.shortDescription}
            </p>
          </div>
        </ScrollReveal>

        {/* Large High-Res Real Project Image Stage */}
        <ScrollReveal delay={100}>
          <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-white border border-[#e2e4de]/40 mb-16 group flex items-center justify-center p-6 sm:p-12">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-contain max-h-[600px] transition-transform duration-700 group-hover:scale-[1.02]"
              loading="eager"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.opacity = '0.7';
              }}
            />

            {/* Engineering Badge */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#e2e4de] text-[#476800] font-mono-tech text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#476800] animate-pulse" />
              <span>ZEN TECH SOLUTIONS // REAL PROTOTYPE HARDWARE</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Detailed Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-16">
            {/* 01 — OVERVIEW */}
            <ScrollReveal>
              <section className="bg-white border border-[#c4c7c7]/60 rounded-2xl p-7 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-[#c4c7c7]/40 pb-4">
                  <FileText className="w-6 h-6 text-[#476800]" />
                  <h2 className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest">
                    01 — OVERVIEW
                  </h2>
                </div>
                <div className="font-display-tech text-base sm:text-lg text-[#191c1b] leading-relaxed whitespace-pre-line space-y-4">
                  {project.overview}
                </div>
              </section>
            </ScrollReveal>

            {/* 02 — THE PROBLEM */}
            {project.problem && (
              <ScrollReveal>
                <section className="bg-[#fff9f8] border border-[#f5c6cb]/60 rounded-2xl p-7 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#f5c6cb]/40 pb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <h2 className="font-mono-tech text-xs text-amber-700 font-bold uppercase tracking-widest">
                      02 — THE PROBLEM
                    </h2>
                  </div>
                  <div className="font-display-tech text-base sm:text-lg text-[#2c1d1d] leading-relaxed whitespace-pre-line">
                    {project.problem}
                  </div>
                </section>
              </ScrollReveal>
            )}

            {/* 03 — THE SOLUTION */}
            {project.solution && (
              <ScrollReveal>
                <section className="bg-[#f7fcf0] border border-[#c8f179]/60 rounded-2xl p-7 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#c8f179]/50 pb-4">
                    <Lightbulb className="w-6 h-6 text-[#476800]" />
                    <h2 className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest">
                      03 — THE SOLUTION
                    </h2>
                  </div>
                  <div className="font-display-tech text-base sm:text-lg text-[#191c1b] leading-relaxed whitespace-pre-line">
                    {project.solution}
                  </div>
                </section>
              </ScrollReveal>
            )}

            {/* 04 — KEY FEATURES */}
            {project.features && project.features.length > 0 && (
              <ScrollReveal>
                <section className="bg-white border border-[#c4c7c7]/60 rounded-2xl p-7 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-8 border-b border-[#c4c7c7]/40 pb-4">
                    <Zap className="w-6 h-6 text-[#476800]" />
                    <h2 className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest">
                      04 — KEY FEATURES
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="bg-[#f9faf7] border border-[#c4c7c7]/40 rounded-xl p-4 flex items-start gap-3 hover:border-[#476800] transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#476800] shrink-0 mt-0.5" />
                        <span className="font-display-tech text-sm sm:text-base font-semibold text-[#000000]">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            )}

            {/* 05 — SYSTEM OPERATION */}
            {project.operation && project.operation.length > 0 && (
              <ScrollReveal>
                <section className="bg-white border border-[#c4c7c7]/60 rounded-2xl p-7 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-8 border-b border-[#c4c7c7]/40 pb-4">
                    <Activity className="w-6 h-6 text-[#476800]" />
                    <h2 className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest">
                      05 — HOW IT WORKS
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {project.operation.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-xl bg-[#f9faf7] border border-[#c4c7c7]/40"
                      >
                        <div className="font-mono-tech text-xs font-black bg-black text-[#c8f179] w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <p className="font-display-tech text-sm sm:text-base text-[#191c1b] leading-relaxed pt-0.5">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            )}

            {/* 07 — APPLICATIONS */}
            {project.applications && project.applications.length > 0 && (
              <ScrollReveal>
                <section className="bg-white border border-[#c4c7c7]/60 rounded-2xl p-7 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-8 border-b border-[#c4c7c7]/40 pb-4">
                    <Layers className="w-6 h-6 text-[#476800]" />
                    <h2 className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest">
                      07 — REAL-WORLD APPLICATIONS
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f3f4f1] border border-[#c4c7c7]/30 text-xs sm:text-sm font-bold font-mono-tech text-[#191c1b]"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#476800]" />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            )}

            {/* 08 — ENGINEERING OUTCOME */}
            {project.outcome && (
              <ScrollReveal>
                <section className="bg-white border border-[#c4c7c7]/60 rounded-2xl p-7 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#c4c7c7]/40 pb-4">
                    <ShieldCheck className="w-6 h-6 text-[#476800]" />
                    <h2 className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest">
                      08 — ENGINEERING OUTCOME
                    </h2>
                  </div>
                  <div className="font-display-tech text-base sm:text-lg text-[#191c1b] leading-relaxed whitespace-pre-line">
                    {project.outcome}
                  </div>
                </section>
              </ScrollReveal>
            )}

            {/* 09 — PROJECT HIGHLIGHTS */}
            {project.highlights && project.highlights.length > 0 && (
              <ScrollReveal>
                <section className="bg-[#090909] text-white rounded-2xl p-7 sm:p-10 border border-neutral-800 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-8 border-b border-neutral-800 pb-4">
                    <Terminal className="w-6 h-6 text-[#c8f179]" />
                    <h2 className="font-mono-tech text-xs text-[#c8f179] font-bold uppercase tracking-widest">
                      09 — PROJECT HIGHLIGHTS
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    {project.highlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex items-start gap-3"
                      >
                        <span className="font-mono-tech text-xs text-[#c8f179] font-bold shrink-0 mt-0.5">
                          #{idx + 1}
                        </span>
                        <span className="font-display-tech text-xs sm:text-sm text-neutral-300 leading-relaxed">
                          {hl}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            )}
          </div>

          {/* Right Column: Technical Sidebar Specs (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Sticky Sidebar Box */}
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* 06 — TECHNOLOGIES USED */}
              <ScrollReveal delay={150}>
                <div className="bg-white border border-[#c4c7c7]/60 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-6 border-b border-[#c4c7c7]/40 pb-3">
                    <Cpu className="w-5 h-5 text-[#476800]" />
                    <h3 className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest">
                      06 — TECHNOLOGIES USED
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono-tech text-xs font-bold text-[#000000] bg-[#c8f179]/30 border border-[#c8f179]/60 px-3 py-1.5 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Hardware Quick Summary Card */}
              <ScrollReveal delay={200}>
                <div className="bg-white border border-[#c4c7c7]/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
                  <h3 className="font-mono-tech text-xs text-[#191c1b] font-bold uppercase tracking-widest border-b border-[#c4c7c7]/40 pb-3">
                    SYSTEM SPECIFICATIONS
                  </h3>

                  <div className="space-y-4 font-mono-tech text-xs">
                    <div className="flex items-center justify-between border-b border-[#c4c7c7]/20 pb-2">
                      <span className="text-[#444748]">REF CODE</span>
                      <span className="font-bold text-[#000000]">ENG_REF_{project.number}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#c4c7c7]/20 pb-2">
                      <span className="text-[#444748]">BUILD TYPE</span>
                      <span className="font-bold text-[#476800]">REAL PROTOTYPE</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#c4c7c7]/20 pb-2">
                      <span className="text-[#444748]">STATUS</span>
                      <span className="font-bold text-[#000000]">VERIFIED / SHIPPED</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#444748]">COMPLIANCE</span>
                      <span className="font-bold text-[#000000]">READY FOR PRODUCTION</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Start a Similar Project CTA Card */}
              <ScrollReveal delay={250}>
                <div className="bg-[#000000] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-neutral-800 relative overflow-hidden">
                  <div className="relative z-10 space-y-5">
                    <span className="font-mono-tech text-xs text-[#c8f179] font-bold uppercase tracking-widest block">
                      BUILD WITH COSMIC
                    </span>
                    <h3 className="font-display-tech text-xl font-extrabold leading-tight">
                      NEED A SIMILAR SYSTEM ENGINEERED?
                    </h3>
                    <p className="font-display-tech text-xs text-neutral-400 leading-relaxed">
                      We design custom electronics, hardware, embedded firmware and complete connected products.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/order')}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#c8f179] text-black font-mono-tech font-bold text-xs px-5 py-3 rounded-xl hover:bg-[#b9e86a] transition-all cursor-pointer"
                    >
                      <span>START A PROJECT</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Controls */}
        <ScrollReveal>
          <div className="mt-20 pt-10 border-t border-[#c4c7c7]/60 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              to="/works"
              className="inline-flex items-center gap-3 bg-black text-[#c8f179] font-mono-tech font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl hover:bg-[#191c1b] transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← BACK TO ENGINEERING WORKS</span>
            </Link>

            {/* Next / Previous Project Pagination */}
            <div className="flex items-center gap-3 font-mono-tech text-xs font-bold">
              <Link
                to={`/works/${prevProject.slug}`}
                className="inline-flex items-center gap-1.5 text-[#444748] hover:text-black bg-white border border-[#c4c7c7]/60 px-4 py-2.5 rounded-xl transition-all"
              >
                <span>← PREV ({prevProject.number})</span>
              </Link>

              <Link
                to={`/works/${nextProject.slug}`}
                className="inline-flex items-center gap-1.5 text-black hover:text-[#476800] bg-white border border-[#c4c7c7]/60 px-4 py-2.5 rounded-xl transition-all"
              >
                <span>NEXT ({nextProject.number}) →</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
