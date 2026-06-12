const { useEffect, useMemo, useState } = React;
const {
  BackToTop,
  ContactLinks,
  InfoGrid,
  PillList,
  PortfolioCard,
  ProfileImage,
  SectionHeading,
  SkillGroup,
  SocialLinks,
  ThemeToggle,
  TimelineSection,
  escapePhone,
} = window.PortfolioComponents;

const NAV_LINKS = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Volunteering", "#voluntary"],
  ["Work Experience", "#experience"],
  ["Education", "#education"],
  ["Achievements", "#achievements"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Patents", "#patents"],
  ["Research", "#research"],
  ["Contacts", "#contact"],
];

const TIMELINE_SECTIONS = [
  ["voluntary", "Leadership", "Volunteering", "voluntary_works", "fa-users"],
  ["experience", "Career", "Work Experience", "work_experiences", "fa-briefcase"],
  ["education", "Academics", "Education", "education", "fa-graduation-cap"],
];

const COLLECTION_SECTIONS = [
  ["patents", "Innovation", "Patents", "patents", "patent_number", "Patent Number"],
  ["research", "Publications", "Research", "research_works", "research_work_number", "Publication"],
];

const SECTION_IDS = NAV_LINKS.map(([, href]) => href.replace("#", ""));
const THEME_KEY = "portfolio-theme";
const DEFAULT_THEME = "dark";

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function getStoredTheme() {
  let localTheme = "";
  try {
    localTheme = localStorage.getItem(THEME_KEY);
  } catch (error) {
    localTheme = "";
  }
  const cookieTheme = getCookie(THEME_KEY);
  const theme = localTheme || cookieTheme || DEFAULT_THEME;
  return theme === "light" ? "light" : "dark";
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // Cookie persistence below is the fallback.
  }
  try {
    document.cookie = `${THEME_KEY}=${theme}; max-age=31536000; path=/; SameSite=Lax`;
  } catch (error) {
    // Some file:// previews do not allow cookies.
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#0f766e" : "#08111f");
}

function Navbar({ activeSection, cv, onNavigate, theme, onThemeToggle }) {
  const closeMenu = () => {
    const nav = document.getElementById("siteNav");
    if (nav?.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-xl fixed-top" aria-label="Primary navigation">
      <div className="container">
        <a className="navbar-brand" href="#home">{cv.full_name}</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNav" aria-controls="siteNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="siteNav">
          <ul className="navbar-nav ms-auto">
            {NAV_LINKS.map(([label, href]) => (
              <li className="nav-item" key={href}>
                <a
                  className={`nav-link ${activeSection === href.replace("#", "") ? "active" : ""}`}
                  href={href}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(href.replace("#", ""));
                    closeMenu();
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Hero({ cv, onNavigate }) {
  const heroIntro = cv.hero_intro || "";
  const hasCv = cv.assets?.resume_pdf;

  return (
    <section id="home" className="hero-section section-pad">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-4 text-center">
            <ProfileImage name={cv.full_name} />
          </div>
          <div className="col-lg-8">
            <h1>{cv.full_name}</h1>
            {cv.headline ? <p className="hero-headline">{cv.headline}</p> : null}
            <p className="hero-summary">{heroIntro}</p>
            <div className="hero-actions">
              {hasCv ? (
                <a href={cv.resume_url || ""} className="btn btn-primary btn-lg" target="_blank" rel="noreferrer">
                  <i className="fa-solid fa-file-pdf"></i> Resume
                </a>
              ) : null}
              <a
                href={cv.social_links?.linkedin || "#contact"}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-lg"
              >
                <i className="fa-brands fa-linkedin"></i> Let's connect on LinkedIn
              </a>
              <a
                href="#projects"
                className="btn btn-ghost btn-lg"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate("projects");
                }}
              >
                <i className="fa-solid fa-arrow-right"></i> View Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About({ cv }) {
  const facts = [
    ["Email", cv.social_links.email, `mailto:${cv.social_links.email}`],
    ["Phone", cv.social_links.phone, `tel:${escapePhone(cv.social_links.phone)}`],
    ["LinkedIn", cv.social_links.linkedin, cv.social_links.linkedin],
    ["GitHub", cv.social_links.github, cv.social_links.github],
  ];

  return (
    <section id="about" className="section-pad">
      <div className="container">
        <SectionHeading eyebrow="Profile" title="About Me" />
        <div className="about-panel reveal">
          {cv.about_title ? <h3>{cv.about_title}</h3> : null}
          <p>{cv.professional_summary}</p>
          {cv.about_highlights?.length ? (
            <ul className="about-highlights">
              {cv.about_highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          ) : null}
          <div className="contact-facts">
            {facts.map(([label, value, href]) => (
              <div className="fact-card" key={label}>
                <strong>{label}</strong>
                <a href={href} target={label === "Email" || label === "Phone" ? "_self" : "_blank"} rel="noopener">{value}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills({ cv }) {
  return (
    <section id="skills" className="section-pad">
      <div className="container">
        <SectionHeading eyebrow="Capabilities" title="Skills" />
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="surface-panel h-100 reveal">
              <h3>Technical Skills</h3>
              <div className="skill-grid">
                {Object.entries(cv.technical_skills).map(([category, values]) => (
                  <SkillGroup category={category} values={values} key={category} />
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="surface-panel h-100 reveal">
              <h3>Interpersonal Skills</h3>
              <PillList items={cv.interpersonal_skills} keyPrefix="interpersonal" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Achievements({ achievements }) {
  return (
    <section id="achievements" className="section-pad">
      <div className="container">
        <SectionHeading eyebrow="Recognition" title="Achievements" />
        <div className="row g-4">
          {achievements.map((achievement) => (
            <div className="col-md-6 col-xl-4" key={achievement.title}>
              <article className="achievement-card reveal">
                <h3>
                  <i className="fa-solid fa-award"></i> {achievement.title}
                </h3>
                <div className="meta">{achievement.organization}</div>
                <p>
                  <strong>{achievement.category}</strong> | {achievement.description}
                </p>
                <span className="date-chip">{achievement.date}</span>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ projects }) {
  const [mode, setMode] = useState("all");
  const [category, setCategory] = useState("");
  const [stream, setStream] = useState("");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => [...new Set(projects.map((project) => project.project_category).filter(Boolean))].sort(), [projects]);
  const streams = useMemo(() => [...new Set(projects.map((project) => project.stream).filter(Boolean))].sort(), [projects]);

  const filteredProjects = useMemo(() => {
    let next = [...projects];
    if (mode === "top") next = next.filter((project) => project.show === "Yes").slice(0, 6);
    if (category) next = next.filter((project) => project.project_category === category);
    if (stream) next = next.filter((project) => project.stream === stream);
    if (search.trim()) {
      const query = search.toLowerCase();
      next = next.filter((project) =>
        [project.title, project.description, project.project_type, project.project_category, project.stream, ...(project.technologies || [])]
          .join(" ")
          .toLowerCase()
          .includes(query),
      );
    }
    return next;
  }, [projects, mode, category, stream, search]);

  useEffect(() => revealVisible(), [filteredProjects]);

  return (
    <section id="projects" className="section-pad section-soft">
      <div className="container">
        <SectionHeading eyebrow="Builds" title="Projects" />
        <div className="project-toolbar">
          <button className={`filter-btn ${mode === "all" ? "active" : ""}`} type="button" onClick={() => setMode("all")}>All Projects</button>
          <button className={`filter-btn ${mode === "top" ? "active" : ""}`} type="button" onClick={() => setMode("top")}>Top 6</button>
          <select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter projects by category">
            <option value="">All Categories</option>
            {categories.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
          <select className="form-select" value={stream} onChange={(event) => setStream(event.target.value)} aria-label="Filter projects by stream">
            <option value="">All Streams</option>
            {streams.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
          <input className="form-control" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects..." aria-label="Search projects" />
        </div>
        <div className="row g-4">
          {filteredProjects.length ? filteredProjects.map((project) => <PortfolioCard item={project} key={project.title} />) : (
            <div className="col-12"><div className="surface-panel text-center">No projects match this filter.</div></div>
          )}
        </div>
      </div>
    </section>
  );
}

function Contact({ cv }) {
  return (
    <section id="contact" className="section-pad">
      <div className="container">
        <SectionHeading eyebrow="Connect" title="Contacts" />
        <div className="contact-panel contact-panel-simple reveal">
          <div>
            <h3>Let us build something useful.</h3>
            <p>Reach out directly through email, phone, LinkedIn, or GitHub.</p>
            <ContactLinks socialLinks={cv.social_links} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ cv }) {
  const year = new Date().getFullYear();
  const footerLinks = [
    ["About", "#about"],
    ["Projects", "#projects"],
    ["Research", "#research"],
    ["Contacts", "#contact"],
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-brand">
          <strong>{cv.full_name}</strong>
          <span>{cv.headline}</span>
          <p>Copyright {year} {cv.full_name}. Built with React, Bootstrap, and static-first performance.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map(([label, href]) => (
            <a href={href} key={href}>{label}</a>
          ))}
        </nav>
        <div className="footer-socials" aria-label="Social links">
          <SocialLinks socialLinks={cv.social_links} />
        </div>
      </div>
    </footer>
  );
}

function revealVisible() {
  if (!("IntersectionObserver" in window)) return;

  const items = Array.from(document.querySelectorAll(".reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate(
            [
              { opacity: 0, transform: "translateY(18px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 420, easing: "ease", fill: "both" },
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  items.forEach((item) => observer.observe(item));
}

function registerServiceWorker() {
  const canRegister =
    "serviceWorker" in navigator &&
    ["http:", "https:"].includes(window.location.protocol);

  if (!canRegister) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

function safeParseJson(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    try {
      return JSON.parse(str + "}");
    } catch (err2) {
      try {
        return JSON.parse(str + "]}");
      } catch (err3) {
        throw new Error(`Failed to parse JSON: ${err.message}`);
      }
    }
  }
}

async function loadPortfolioData() {
  if (window.PORTFOLIO_DATA) return window.PORTFOLIO_DATA;

  const env = window.__ENV__;

  if (!env) {
    throw new Error(
      "Portfolio environment was not injected during build."
    );
  }

  let parsedData = {};
  if (env.PORTFOLIO_DATA) {
    try {
      parsedData = JSON.parse(env.PORTFOLIO_DATA);
    } catch (err) {
      // Fallback if PORTFOLIO_DATA is not valid JSON
    }
  }

  const mergedData = {};

  if (env.PORTFOLIO_PROFILE) {
    const profile = safeParseJson(env.PORTFOLIO_PROFILE);
    Object.assign(mergedData, profile);
  }

  if (env.PORTFOLIO_WORK) {
    mergedData.work_experiences = safeParseJson(env.PORTFOLIO_WORK);
  }

  if (env.PORTFOLIO_EDUCATION) {
    mergedData.education = safeParseJson(env.PORTFOLIO_EDUCATION);
  }

  if (env.PORTFOLIO_ACHIEVEMENTS) {
    mergedData.achievements = safeParseJson(env.PORTFOLIO_ACHIEVEMENTS);
  }

  if (env.PORTFOLIO_VOLUNTEER) {
    mergedData.voluntary_works = safeParseJson(env.PORTFOLIO_VOLUNTEER);
  }

  if (env.PORTFOLIO_SKILLS) {
    const skills = safeParseJson(env.PORTFOLIO_SKILLS);
    Object.assign(mergedData, skills);
  }

  const projects = [];
  let pIdx = 1;
  while (env[`PORTFOLIO_PROJECTS_${pIdx}`]) {
    const projPart = safeParseJson(env[`PORTFOLIO_PROJECTS_${pIdx}`]);
    if (Array.isArray(projPart)) {
      projects.push(...projPart);
    }
    pIdx++;
  }
  if (projects.length > 0) {
    mergedData.projects = projects;
  }

  if (env.PORTFOLIO_PATENTS) {
    mergedData.patents = safeParseJson(env.PORTFOLIO_PATENTS);
  }

  if (env.PORTFOLIO_RESEARCH_WORKS) {
    mergedData.research_works = safeParseJson(env.PORTFOLIO_RESEARCH_WORKS);
  }

  if (env.PORTFOLIO_SOCIAL_LINKS) {
    mergedData.social_links = safeParseJson(env.PORTFOLIO_SOCIAL_LINKS);
  }

  const finalData = { ...parsedData, ...mergedData };

  if (Object.keys(finalData).length === 0) {
    throw new Error("No portfolio data found in environment or .env file");
  }

  window.PORTFOLIO_DATA = finalData;
  return finalData;
}

function getInitialSection() {
  const section = window.location.hash.replace("#", "");
  return SECTION_IDS.includes(section) ? section : "home";
}

function App() {
  const [cv, setCv] = useState(null);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(getStoredTheme);
  const [activeSection, setActiveSection] = useState(getInitialSection);

  useEffect(() => {
    loadPortfolioData().then(setCv).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!cv) return;
    revealVisible();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection, cv]);

  useEffect(() => {
    const onHashChange = () => setActiveSection(getInitialSection());
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, []);

  const navigateTo = (sectionId) => {
    const safeSection = SECTION_IDS.includes(sectionId) ? sectionId : "home";
    setActiveSection(safeSection);
    history.pushState(null, "", `#${safeSection}`);
  };

  const renderActiveSection = () => {
    if (activeSection === "home") return <Hero cv={cv} onNavigate={navigateTo} />;
    if (activeSection === "about") return <About cv={cv} />;
    if (activeSection === "achievements") return <Achievements achievements={cv.achievements || []} />;
    if (activeSection === "skills") return <Skills cv={cv} />;
    if (activeSection === "projects") return <Projects projects={cv.projects} />;
    if (activeSection === "contact") return <Contact cv={cv} />;

    const timelineSection = TIMELINE_SECTIONS.find(([id]) => id === activeSection);
    if (timelineSection) {
      const [id, eyebrow, title, key, icon] = timelineSection;
      return <TimelineSection id={id} eyebrow={eyebrow} title={title} items={cv[key]} icon={icon} />;
    }

    const collectionSection = COLLECTION_SECTIONS.find(([id]) => id === activeSection);
    if (collectionSection) {
      const [id, eyebrow, title, key, numberKey, numberLabel] = collectionSection;
      return <InfoGrid id={id} eyebrow={eyebrow} title={title} items={cv[key]} numberKey={numberKey} numberLabel={numberLabel} />;
    }

    return <Hero cv={cv} onNavigate={navigateTo} />;
  };

  if (error) {
    return (
      <main className="container section-pad">
        <div className="surface-panel">
          <h1>Portfolio could not load</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!cv) {
    return (
      <main className="container section-pad">
        <div className="surface-panel">Loading portfolio...</div>
      </main>
    );
  }

  return (
    <>
      <Navbar
        activeSection={activeSection}
        cv={cv}
        onNavigate={navigateTo}
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />
      <main className="single-section-view">
        {renderActiveSection()}
      </main>
      <Footer cv={cv} />
      <BackToTop />
    </>
  );
}

registerServiceWorker();
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
