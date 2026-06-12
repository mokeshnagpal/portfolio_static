const {
  useEffect,
  useMemo,
  useState
} = React;
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
  escapePhone
} = window.PortfolioComponents;
const NAV_LINKS = [["Home", "#home"], ["About", "#about"], ["Volunteering", "#voluntary"], ["Work Experience", "#experience"], ["Education", "#education"], ["Achievements", "#achievements"], ["Skills", "#skills"], ["Projects", "#projects"], ["Patents", "#patents"], ["Research", "#research"], ["Contacts", "#contact"]];
const TIMELINE_SECTIONS = [["voluntary", "Leadership", "Volunteering", "voluntary_works", "fa-users"], ["experience", "Career", "Work Experience", "work_experiences", "fa-briefcase"], ["education", "Academics", "Education", "education", "fa-graduation-cap"]];
const COLLECTION_SECTIONS = [["patents", "Innovation", "Patents", "patents", "patent_number", "Patent Number"], ["research", "Publications", "Research", "research_works", "research_work_number", "Publication"]];
const SECTION_IDS = NAV_LINKS.map(([, href]) => href.replace("#", ""));
const THEME_KEY = "portfolio-theme";
const DEFAULT_THEME = "dark";
function getCookie(name) {
  return document.cookie.split("; ").find(row => row.startsWith(`${name}=`))?.split("=")[1];
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
  } catch (error) {}
  try {
    document.cookie = `${THEME_KEY}=${theme}; max-age=31536000; path=/; SameSite=Lax`;
  } catch (error) {}
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#0f766e" : "#08111f");
}
function Navbar({
  activeSection,
  cv,
  onNavigate,
  theme,
  onThemeToggle
}) {
  const closeMenu = () => {
    const nav = document.getElementById("siteNav");
    if (nav?.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  };
  return React.createElement("nav", {
    className: "navbar navbar-expand-xl fixed-top",
    "aria-label": "Primary navigation"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("a", {
    className: "navbar-brand",
    href: "#home"
  }, cv.full_name), React.createElement("button", {
    className: "navbar-toggler",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#siteNav",
    "aria-controls": "siteNav",
    "aria-expanded": "false",
    "aria-label": "Toggle navigation"
  }, React.createElement("span", {
    className: "navbar-toggler-icon"
  })), React.createElement("div", {
    className: "collapse navbar-collapse",
    id: "siteNav"
  }, React.createElement("ul", {
    className: "navbar-nav ms-auto"
  }, NAV_LINKS.map(([label, href]) => React.createElement("li", {
    className: "nav-item",
    key: href
  }, React.createElement("a", {
    className: `nav-link ${activeSection === href.replace("#", "") ? "active" : ""}`,
    href: href,
    onClick: event => {
      event.preventDefault();
      onNavigate(href.replace("#", ""));
      closeMenu();
    }
  }, label))), React.createElement("li", {
    className: "nav-item ms-lg-2 mt-2 mt-lg-0"
  }, React.createElement(ThemeToggle, {
    theme: theme,
    onToggle: onThemeToggle
  }))))));
}
function Hero({
  cv,
  onNavigate
}) {
  const heroIntro = cv.hero_intro || "";
  const hasCv = cv.assets?.resume_pdf;
  return React.createElement("section", {
    id: "home",
    className: "hero-section section-pad"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "row align-items-center g-5"
  }, React.createElement("div", {
    className: "col-lg-4 text-center"
  }, React.createElement(ProfileImage, {
    name: cv.full_name
  })), React.createElement("div", {
    className: "col-lg-8"
  }, React.createElement("h1", null, cv.full_name), cv.headline ? React.createElement("p", {
    className: "hero-headline"
  }, cv.headline) : null, React.createElement("p", {
    className: "hero-summary"
  }, heroIntro), React.createElement("div", {
    className: "hero-actions"
  }, hasCv ? React.createElement("a", {
    href: cv.resume_url || "",
    className: "btn btn-primary btn-lg",
    target: "_blank",
    rel: "noreferrer"
  }, React.createElement("i", {
    className: "fa-solid fa-file-pdf"
  }), " Resume") : null, React.createElement("a", {
    href: cv.social_links?.linkedin || "#contact",
    target: "_blank",
    rel: "noreferrer",
    className: "btn btn-ghost btn-lg"
  }, React.createElement("i", {
    className: "fa-brands fa-linkedin"
  }), " Let's connect on LinkedIn"), React.createElement("a", {
    href: "#projects",
    className: "btn btn-ghost btn-lg",
    onClick: event => {
      event.preventDefault();
      onNavigate("projects");
    }
  }, React.createElement("i", {
    className: "fa-solid fa-arrow-right"
  }), " View Projects"))))));
}
function About({
  cv
}) {
  const facts = [["Email", cv.social_links.email, `mailto:${cv.social_links.email}`], ["Phone", cv.social_links.phone, `tel:${escapePhone(cv.social_links.phone)}`], ["LinkedIn", cv.social_links.linkedin, cv.social_links.linkedin], ["GitHub", cv.social_links.github, cv.social_links.github]];
  return React.createElement("section", {
    id: "about",
    className: "section-pad"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement(SectionHeading, {
    eyebrow: "Profile",
    title: "About Me"
  }), React.createElement("div", {
    className: "about-panel reveal"
  }, cv.about_title ? React.createElement("h3", null, cv.about_title) : null, React.createElement("p", null, cv.professional_summary), cv.about_highlights?.length ? React.createElement("ul", {
    className: "about-highlights"
  }, cv.about_highlights.map(highlight => React.createElement("li", {
    key: highlight
  }, highlight))) : null, React.createElement("div", {
    className: "contact-facts"
  }, facts.map(([label, value, href]) => React.createElement("div", {
    className: "fact-card",
    key: label
  }, React.createElement("strong", null, label), React.createElement("a", {
    href: href,
    target: label === "Email" || label === "Phone" ? "_self" : "_blank",
    rel: "noopener"
  }, value)))))));
}
function Skills({
  cv
}) {
  return React.createElement("section", {
    id: "skills",
    className: "section-pad"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement(SectionHeading, {
    eyebrow: "Capabilities",
    title: "Skills"
  }), React.createElement("div", {
    className: "row g-4"
  }, React.createElement("div", {
    className: "col-lg-7"
  }, React.createElement("div", {
    className: "surface-panel h-100 reveal"
  }, React.createElement("h3", null, "Technical Skills"), React.createElement("div", {
    className: "skill-grid"
  }, Object.entries(cv.technical_skills).map(([category, values]) => React.createElement(SkillGroup, {
    category: category,
    values: values,
    key: category
  }))))), React.createElement("div", {
    className: "col-lg-5"
  }, React.createElement("div", {
    className: "surface-panel h-100 reveal"
  }, React.createElement("h3", null, "Interpersonal Skills"), React.createElement(PillList, {
    items: cv.interpersonal_skills,
    keyPrefix: "interpersonal"
  }))))));
}
function Achievements({
  achievements
}) {
  return React.createElement("section", {
    id: "achievements",
    className: "section-pad"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement(SectionHeading, {
    eyebrow: "Recognition",
    title: "Achievements"
  }), React.createElement("div", {
    className: "row g-4"
  }, achievements.map(achievement => React.createElement("div", {
    className: "col-md-6 col-xl-4",
    key: achievement.title
  }, React.createElement("article", {
    className: "achievement-card reveal"
  }, React.createElement("h3", null, React.createElement("i", {
    className: "fa-solid fa-award"
  }), " ", achievement.title), React.createElement("div", {
    className: "meta"
  }, achievement.organization), React.createElement("p", null, React.createElement("strong", null, achievement.category), " | ", achievement.description), React.createElement("span", {
    className: "date-chip"
  }, achievement.date)))))));
}
function Projects({
  projects
}) {
  const [mode, setMode] = useState("all");
  const [category, setCategory] = useState("");
  const [stream, setStream] = useState("");
  const [search, setSearch] = useState("");
  const categories = useMemo(() => [...new Set(projects.map(project => project.project_category).filter(Boolean))].sort(), [projects]);
  const streams = useMemo(() => [...new Set(projects.map(project => project.stream).filter(Boolean))].sort(), [projects]);
  const filteredProjects = useMemo(() => {
    let next = [...projects];
    if (mode === "top") next = next.filter(project => project.show === "Yes").slice(0, 6);
    if (category) next = next.filter(project => project.project_category === category);
    if (stream) next = next.filter(project => project.stream === stream);
    if (search.trim()) {
      const query = search.toLowerCase();
      next = next.filter(project => [project.title, project.description, project.project_type, project.project_category, project.stream, ...(project.technologies || [])].join(" ").toLowerCase().includes(query));
    }
    return next;
  }, [projects, mode, category, stream, search]);
  useEffect(() => revealVisible(), [filteredProjects]);
  return React.createElement("section", {
    id: "projects",
    className: "section-pad section-soft"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement(SectionHeading, {
    eyebrow: "Builds",
    title: "Projects"
  }), React.createElement("div", {
    className: "project-toolbar"
  }, React.createElement("button", {
    className: `filter-btn ${mode === "all" ? "active" : ""}`,
    type: "button",
    onClick: () => setMode("all")
  }, "All Projects"), React.createElement("button", {
    className: `filter-btn ${mode === "top" ? "active" : ""}`,
    type: "button",
    onClick: () => setMode("top")
  }, "Top 6"), React.createElement("select", {
    className: "form-select",
    value: category,
    onChange: event => setCategory(event.target.value),
    "aria-label": "Filter projects by category"
  }, React.createElement("option", {
    value: ""
  }, "All Categories"), categories.map(item => React.createElement("option", {
    value: item,
    key: item
  }, item))), React.createElement("select", {
    className: "form-select",
    value: stream,
    onChange: event => setStream(event.target.value),
    "aria-label": "Filter projects by stream"
  }, React.createElement("option", {
    value: ""
  }, "All Streams"), streams.map(item => React.createElement("option", {
    value: item,
    key: item
  }, item))), React.createElement("input", {
    className: "form-control",
    type: "search",
    value: search,
    onChange: event => setSearch(event.target.value),
    placeholder: "Search projects...",
    "aria-label": "Search projects"
  })), React.createElement("div", {
    className: "row g-4"
  }, filteredProjects.length ? filteredProjects.map(project => React.createElement(PortfolioCard, {
    item: project,
    key: project.title
  })) : React.createElement("div", {
    className: "col-12"
  }, React.createElement("div", {
    className: "surface-panel text-center"
  }, "No projects match this filter.")))));
}
function Contact({
  cv
}) {
  return React.createElement("section", {
    id: "contact",
    className: "section-pad"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement(SectionHeading, {
    eyebrow: "Connect",
    title: "Contacts"
  }), React.createElement("div", {
    className: "contact-panel contact-panel-simple reveal"
  }, React.createElement("div", null, React.createElement("h3", null, "Let us build something useful."), React.createElement("p", null, "Reach out directly through email, phone, LinkedIn, or GitHub."), React.createElement(ContactLinks, {
    socialLinks: cv.social_links
  })))));
}
function Footer({
  cv
}) {
  const year = new Date().getFullYear();
  const footerLinks = [["About", "#about"], ["Projects", "#projects"], ["Research", "#research"], ["Contacts", "#contact"]];
  return React.createElement("footer", {
    className: "site-footer"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "footer-brand"
  }, React.createElement("strong", null, cv.full_name), React.createElement("span", null, cv.headline), React.createElement("p", null, "Copyright ", year, " ", cv.full_name, ". Built with React, Bootstrap, and static-first performance.")), React.createElement("nav", {
    className: "footer-links",
    "aria-label": "Footer navigation"
  }, footerLinks.map(([label, href]) => React.createElement("a", {
    href: href,
    key: href
  }, label))), React.createElement("div", {
    className: "footer-socials",
    "aria-label": "Social links"
  }, React.createElement(SocialLinks, {
    socialLinks: cv.social_links
  }))));
}
function revealVisible() {
  if (!("IntersectionObserver" in window)) return;
  const items = Array.from(document.querySelectorAll(".reveal"));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.animate([{
          opacity: 0,
          transform: "translateY(18px)"
        }, {
          opacity: 1,
          transform: "translateY(0)"
        }], {
          duration: 420,
          easing: "ease",
          fill: "both"
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  items.forEach(item => observer.observe(item));
}
function registerServiceWorker() {
  const canRegister = "serviceWorker" in navigator && ["http:", "https:"].includes(window.location.protocol);
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
  const response = await fetch("env");
  if (!response.ok) {
    throw new Error("Unable to load .env file.");
  }
  const content = await response.text();
  const env = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx).trim();
    let val = trimmed.substring(eqIdx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
      val = val.substring(1, val.length - 1);
    }
    env[key] = val;
  }
  let parsedData = {};
  if (env.PORTFOLIO_DATA) {
    try {
      parsedData = JSON.parse(env.PORTFOLIO_DATA);
    } catch (err) {}
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
  const finalData = {
    ...parsedData,
    ...mergedData
  };
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
    loadPortfolioData().then(setCv).catch(err => setError(err.message));
  }, []);
  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);
  useEffect(() => {
    if (!cv) return;
    revealVisible();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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
  const navigateTo = sectionId => {
    const safeSection = SECTION_IDS.includes(sectionId) ? sectionId : "home";
    setActiveSection(safeSection);
    history.pushState(null, "", `#${safeSection}`);
  };
  const renderActiveSection = () => {
    if (activeSection === "home") return React.createElement(Hero, {
      cv: cv,
      onNavigate: navigateTo
    });
    if (activeSection === "about") return React.createElement(About, {
      cv: cv
    });
    if (activeSection === "achievements") return React.createElement(Achievements, {
      achievements: cv.achievements || []
    });
    if (activeSection === "skills") return React.createElement(Skills, {
      cv: cv
    });
    if (activeSection === "projects") return React.createElement(Projects, {
      projects: cv.projects
    });
    if (activeSection === "contact") return React.createElement(Contact, {
      cv: cv
    });
    const timelineSection = TIMELINE_SECTIONS.find(([id]) => id === activeSection);
    if (timelineSection) {
      const [id, eyebrow, title, key, icon] = timelineSection;
      return React.createElement(TimelineSection, {
        id: id,
        eyebrow: eyebrow,
        title: title,
        items: cv[key],
        icon: icon
      });
    }
    const collectionSection = COLLECTION_SECTIONS.find(([id]) => id === activeSection);
    if (collectionSection) {
      const [id, eyebrow, title, key, numberKey, numberLabel] = collectionSection;
      return React.createElement(InfoGrid, {
        id: id,
        eyebrow: eyebrow,
        title: title,
        items: cv[key],
        numberKey: numberKey,
        numberLabel: numberLabel
      });
    }
    return React.createElement(Hero, {
      cv: cv,
      onNavigate: navigateTo
    });
  };
  if (error) {
    return React.createElement("main", {
      className: "container section-pad"
    }, React.createElement("div", {
      className: "surface-panel"
    }, React.createElement("h1", null, "Portfolio could not load"), React.createElement("p", null, error)));
  }
  if (!cv) {
    return React.createElement("main", {
      className: "container section-pad"
    }, React.createElement("div", {
      className: "surface-panel"
    }, "Loading portfolio..."));
  }
  return React.createElement(React.Fragment, null, React.createElement(Navbar, {
    activeSection: activeSection,
    cv: cv,
    onNavigate: navigateTo,
    theme: theme,
    onThemeToggle: () => setTheme(current => current === "dark" ? "light" : "dark")
  }), React.createElement("main", {
    className: "single-section-view"
  }, renderActiveSection()), React.createElement(Footer, {
    cv: cv
  }), React.createElement(BackToTop, null));
}
registerServiceWorker();
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
