import React, { useState } from 'react';
import { CursorGrid } from '../components/CursorGrid';
import { ArrowRight, Eye, ChevronRight, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useRouter } from '../router';
import { HeroParallax, HeroParallaxProduct } from '../components/HeroParallax';
import { ScrollReveal } from '../components/ScrollReveal';
import { PROJECTS_DATA, Project } from '../data/projectsData';

export const WorksPage: React.FC = () => {
  const { navigate } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAllProjects, setShowAllProjects] = useState<boolean>(false);

  const categories = [
    'ALL',
    'AUTOMATION',
    'EMBEDDED',
    'IoT',
    'SAFETY',
    'HEALTHCARE',
    'ENVIRONMENT',
    'ROBOTICS',
    'ENERGY',
    'AGRICULTURE',
    'MOBILITY',
    'COMPUTER VISION',
    'FOOD & SUPPLY CHAIN',
  ];

  // 17 real project images formatted for top 3D Hero Parallax
  const parallaxProducts: HeroParallaxProduct[] = PROJECTS_DATA.map((proj) => ({
    title: proj.title,
    link: `/works/${proj.slug}`,
    thumbnail: proj.image,
  }));

  // Filter projects dynamically
  const filteredProjects = PROJECTS_DATA.filter((project) => {
    if (selectedCategory === 'ALL') return true;
    return (
      project.categories.some(
        (cat) => cat.toUpperCase() === selectedCategory.toUpperCase()
      ) || project.category.toUpperCase().includes(selectedCategory.toUpperCase())
    );
  });

  const handleStartProject = () => {
    navigate('/order');
  };

  const handleProjectClick = (slug: string) => {
    navigate(`/works/${slug}`);
  };

  // Locked Top 5 Featured projects (01 to 05) when 'ALL' is selected
  const featuredProjects = PROJECTS_DATA.slice(0, 5);
  const remainingProjects = PROJECTS_DATA.slice(5);

  // Parallax Hero Header Component
  const parallaxHeader = (
    <div className="max-w-[1440px] mx-auto px-6 md:px-16 pt-8 sm:pt-12 pb-12 sm:pb-16 w-full">
      {/* Eyebrow */}
      <div className="font-mono-tech text-xs text-[#476800] font-bold mb-6 flex items-center gap-2">
        <Link to="/" className="text-[#444748] hover:text-black transition-colors">
          HOME
        </Link>
        <span>#</span>
        <span>01 # OUR WORKS</span>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <span className="font-mono-tech text-xs md:text-sm text-[#476800] font-bold tracking-widest uppercase block">
          ENGINEERING WORKS
        </span>

        {/* Heading & Strong Introduction */}
        <h1 className="font-display-tech text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#000000] tracking-tight leading-[1.05] max-w-5xl uppercase">
          FROM SENSOR TO SYSTEM.
          <br />
          FROM PROTOTYPE TO <span className="text-[#476800]">PRODUCT.</span>
        </h1>

        {/* Concise Supporting Introduction */}
        <p className="font-display-tech text-base sm:text-lg md:text-xl font-medium leading-relaxed text-[#444748] max-w-3xl">
          We design and build embedded systems, automation solutions, connected products and intelligent engineering systems for real-world applications.
        </p>

        {/* Technical Badges */}
        <div className="pt-2 flex flex-wrap items-center gap-2 font-mono-tech text-xs font-bold text-[#191c1b]">
          <span className="w-2 h-2 rounded-full bg-[#476800] inline-block shrink-0"></span>
          <span className="text-[#444748]">
            EMBEDDED <span className="text-[#476800]">×</span> IoT <span className="text-[#476800]">×</span> ROBOTICS <span className="text-[#476800]">×</span> AUTOMATION <span className="text-[#476800]">×</span> HARDWARE <span className="text-[#476800]">×</span> COMPUTER VISION
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full relative text-[#191c1b] selection:bg-[#c8f179] selection:text-[#000000] overflow-x-hidden">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="tech-grid absolute inset-0 opacity-25 pointer-events-none -z-10" />
        <CursorGrid color="0, 0, 0" maxOpacity={0.2} />
      </div>

      {/* ==================================================
          1. 3D HERO PARALLAX SHOWCASE
          ================================================== */}
      <HeroParallax products={parallaxProducts} header={parallaxHeader} />

      {/* ==================================================
          2. PORTFOLIO SHOWCASE SECTION
          ================================================== */}
      <section
        id="projects-editorial"
        className="px-6 md:px-16 pt-12 md:pt-16 pb-24 max-w-[1440px] mx-auto"
      >
        {/* Section Title & Clean Category Filter Bar */}
        <ScrollReveal>
          <div className="border-b border-[#e2e4de] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest block mb-2">
                SHIPPED PORTFOLIO ({PROJECTS_DATA.length} PROJECTS)
              </span>
              <h2 className="font-display-tech text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000000] tracking-tight">
                ENGINEERING WORKS
              </h2>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-1.5 pt-2 max-w-2xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-mono-tech text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-black text-[#c8f179] border-black shadow-sm'
                      : 'bg-white text-[#444748] border-[#e2e4de] hover:border-black hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ==================================================
            2A. FEATURED PROJECTS (01 TO 05) - ALTERNATING LAYOUT
            (Slightly reduced card height per user request)
            ================================================== */}
        {selectedCategory === 'ALL' && (
          <div className="space-y-10 mb-16">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#476800]" />
                <h3 className="font-mono-tech text-xs font-bold text-[#476800] uppercase tracking-widest">
                  FEATURED ENGINEERING SYSTEMS
                </h3>
              </div>
            </ScrollReveal>

            {featuredProjects.map((project, idx) => {
              const isEven = idx % 2 === 0; // Alternating layout
              return (
                <ScrollReveal key={project.id} delay={idx * 80}>
                  <div
                    onClick={() => handleProjectClick(project.slug)}
                    className="bg-white border border-[#e2e4de] rounded-2xl p-5 sm:p-7 hover:border-[#476800]/70 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  >
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center ${
                        isEven ? '' : 'lg:flex-row-reverse'
                      }`}
                    >
                      {/* Project Photograph Stage */}
                      <div
                        className={`lg:col-span-7 w-full flex items-center justify-center p-3.5 sm:p-5 bg-white rounded-xl min-h-[250px] sm:min-h-[310px] max-h-[380px] ${
                          isEven ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-contain max-h-[350px] group-hover:scale-[1.02] transition-transform duration-500"
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.opacity = '0.7';
                          }}
                        />
                      </div>

                      {/* Content Details */}
                      <div
                        className={`lg:col-span-5 space-y-4 flex flex-col justify-between ${
                          isEven ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <div>
                          {/* Category Pill */}
                          <div className="flex items-center justify-start border-b border-[#e2e4de]/60 pb-3 mb-4">
                            <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#476800] bg-[#c8f179]/20 px-2.5 py-0.5 rounded border border-[#c8f179]/40">
                              {project.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-display-tech text-xl sm:text-2xl lg:text-3xl font-black text-[#000000] tracking-tight leading-snug mb-3 group-hover:text-[#476800] transition-colors uppercase">
                            {project.title}
                          </h3>

                          {/* Short Description */}
                          <p className="font-display-tech text-xs sm:text-sm text-[#444748] leading-relaxed mb-4 line-clamp-3">
                            {project.shortDescription}
                          </p>
                        </div>

                        {/* Technologies & View Project Link */}
                        <div className="space-y-4 pt-3 border-t border-[#e2e4de]/60">
                          <div>
                            <div className="font-mono-tech text-[10px] text-[#191c1b] font-bold uppercase tracking-wider mb-1.5">
                              TECHNOLOGIES:
                            </div>
                            <div className="flex flex-wrap gap-1.5 font-mono-tech text-[10px] sm:text-[11px] text-[#444748]">
                              {project.technologies.slice(0, 5).map((tech, i) => (
                                <span key={tech} className="inline-flex items-center">
                                  <span className="text-[#000000] font-semibold">{tech}</span>
                                  {i < Math.min(project.technologies.length, 5) - 1 && (
                                    <span className="mx-1.5 text-[#476800] font-bold">·</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Editorial View Project Link */}
                          <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-[#000000] group-hover:text-[#476800] transition-colors pt-1">
                            <span className="tracking-wider uppercase">VIEW PROJECT</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-[#476800]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* View More Button */}
        {selectedCategory === 'ALL' && !showAllProjects && (
          <div className="flex justify-center pt-2 pb-6">
            <button
              type="button"
              onClick={() => setShowAllProjects(true)}
              className="group inline-flex items-center gap-3 bg-black text-[#c8f179] font-mono-tech font-bold text-xs sm:text-sm px-8 py-4 rounded-xl border border-black hover:bg-[#191c1b] hover:border-[#476800] transition-all duration-300 cursor-pointer shadow-md"
            >
              <Eye className="w-4 h-4 text-[#c8f179]" />
              <span className="tracking-wider uppercase">VIEW MORE PROJECTS</span>
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5 text-[#c8f179]" />
            </button>
          </div>
        )}

        {/* ==================================================
            2B. MORE ENGINEERING WORKS (REFINED 2-COLUMN GRID)
            ================================================== */}
        {(selectedCategory !== 'ALL' || showAllProjects) && (
          <div className="space-y-8">
            {selectedCategory === 'ALL' && (
              <ScrollReveal>
                <div className="pt-6 border-t border-[#e2e4de] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#476800]" />
                    <h3 className="font-mono-tech text-xs font-bold text-[#476800] uppercase tracking-widest">
                      MORE ENGINEERING WORKS
                    </h3>
                  </div>
                </div>
              </ScrollReveal>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(selectedCategory === 'ALL' ? remainingProjects : filteredProjects).map(
                (project, idx) => (
                <ScrollReveal key={project.id} delay={(idx % 2) * 80}>
                  <div
                    onClick={() => handleProjectClick(project.slug)}
                    className="bg-white border border-[#e2e4de] rounded-2xl p-5 sm:p-6 hover:border-[#476800]/70 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between group h-full cursor-pointer relative overflow-hidden"
                  >
                    <div>
                      {/* Category */}
                      <div className="flex items-center justify-start border-b border-[#e2e4de]/60 pb-3 mb-4">
                        <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#476800] bg-[#c8f179]/20 px-2.5 py-0.5 rounded border border-[#c8f179]/40">
                          {project.category}
                        </span>
                      </div>

                      {/* Natural Clean Photograph Stage */}
                      <div className="h-48 sm:h-56 w-full rounded-xl overflow-hidden mb-4 bg-white flex items-center justify-center p-3">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-contain group-hover:scale-[1.025] transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.opacity = '0.7';
                          }}
                        />
                      </div>

                      {/* Title */}
                      <h3 className="font-display-tech text-lg sm:text-xl font-black text-[#000000] mb-2 tracking-tight group-hover:text-[#476800] transition-colors leading-snug uppercase">
                        {project.title}
                      </h3>

                      {/* Short Description */}
                      <p className="font-display-tech text-xs sm:text-sm text-[#444748] leading-relaxed mb-4 line-clamp-3">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Technologies & Link */}
                    <div>
                      <div className="pt-3 border-t border-[#e2e4de]/60 mb-4">
                        <div className="font-mono-tech text-[10px] text-[#191c1b] font-bold uppercase tracking-wider mb-1">
                          TECHNOLOGIES:
                        </div>
                        <div className="flex flex-wrap gap-1.5 font-mono-tech text-[10px] sm:text-[11px] text-[#444748]">
                          {project.technologies.slice(0, 4).map((tech, i) => (
                            <span key={tech} className="inline-flex items-center">
                              <span className="text-[#000000] font-semibold">{tech}</span>
                              {i < Math.min(project.technologies.length, 4) - 1 && (
                                <span className="mx-1.5 text-[#476800] font-bold">·</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* View Link */}
                      <div className="flex items-center justify-between font-mono-tech text-xs font-bold text-[#000000] group-hover:text-[#476800] transition-colors pt-1">
                        <span className="tracking-wider uppercase">VIEW PROJECT</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-[#476800]" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )
            )}
            {selectedCategory !== 'ALL' && filteredProjects.length === 0 && (
              <div className="text-center py-16 px-4 bg-white border border-[#e2e4de] rounded-2xl col-span-full">
                <div className="font-mono-tech text-xs text-[#476800] uppercase tracking-wider mb-2 font-bold">
                  NO MATCHING WORKS
                </div>
                <p className="text-sm text-[#444748] mb-4">
                  No verified projects found under category &ldquo;{selectedCategory}&rdquo;.
                </p>
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className="font-mono-tech text-xs text-black underline underline-offset-4 font-bold hover:text-[#476800]"
                >
                  View All 17 Projects
                </button>
              </div>
            )}
          </div>

          {/* View Less Toggle Button */}
          {selectedCategory === 'ALL' && showAllProjects && (
            <div className="flex justify-center pt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllProjects(false);
                    const el = document.getElementById('projects-editorial');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-2.5 bg-white text-black border border-[#e2e4de] hover:border-black font-mono-tech font-bold text-xs px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow"
                >
                  <span className="tracking-wider uppercase">SHOW LESS (FEATURED ONLY)</span>
                  <ChevronUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 text-[#476800]" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ==================================================
          3. BOTTOM BUSINESS CTA (HAVE AN ENGINEERING PROBLEM?)
          ================================================== */}
      <section className="px-6 md:px-16 pt-4 pb-20 max-w-[1440px] mx-auto">
        <ScrollReveal>
          <div className="bg-white border border-[#e2e4de] rounded-2xl md:rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl relative z-10">
              <span className="font-mono-tech text-xs text-[#476800] font-bold uppercase tracking-widest block">
                LET'S BUILD TOGETHER
              </span>
              <h2 className="font-display-tech text-3xl sm:text-4xl md:text-5xl font-black text-[#000000] tracking-tight uppercase leading-tight">
                HAVE AN ENGINEERING <span className="text-[#476800]">PROBLEM?</span>
              </h2>
              <p className="font-display-tech text-base sm:text-lg text-[#444748] leading-relaxed">
                Let's turn it into a working system. We engineer complete technology systems — hardware, embedded firmware, automation and software tailored for real-world applications.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <button
                type="button"
                onClick={handleStartProject}
                className="inline-flex items-center gap-3 bg-black text-[#c8f179] font-mono-tech font-bold text-xs sm:text-sm px-7 py-4 rounded-xl hover:bg-[#191c1b] transition-all duration-300 group cursor-pointer shadow-md"
              >
                <span>START A PROJECT</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-[#c8f179]" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
