(() => {
  const h = React.createElement;
  const { useEffect, useState } = React;

  const imagePath = (name) => `public/images/${name}`;
  const escapePhone = (phone = "") => phone.replaceAll(" ", "");
  const titleCase = (value) => {
    const acronyms = new Map([
      ["ai", "AI"],
      ["ml", "ML"],
      ["sql", "SQL"],
      ["cs", "CS"],
      ["iot", "IoT"],
      ["bff", "BFF"],
      ["api", "API"],
    ]);

    return value
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => acronyms.get(word.toLowerCase()) || word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  function SectionHeading({ eyebrow, title }) {
    return h("div", { className: "section-heading" }, h("span", null, eyebrow), h("h2", null, title));
  }

  function SocialButton({ href, icon, label }) {
    return h(
      "a",
      {
        href,
        className: "btn btn-ghost btn-lg",
        target: "_blank",
        rel: "noopener",
        "aria-label": label,
      },
      h("i", { className: icon }),
    );
  }

  function ProfileImage({ name }) {
    return h(
      "div",
      { className: "profile-frame" },
      h("img", {
        src: "public/profile/profile.jpg",
        alt: `${name} profile picture`,
        className: "profile-image",
        decoding: "async",
        fetchPriority: "high",
      }),
    );
  }

  function DateChip({ children }) {
    return h("span", { className: "date-chip" }, children);
  }

  function PillList({ items, keyPrefix = "pill" }) {
    return h(
      "div",
      { className: "pill-list" },
      items.map((item) => h("span", { className: "pill", key: `${keyPrefix}-${item}` }, item)),
    );
  }

  function SkillGroup({ category, values }) {
    const skills = values.split(",").map((skill) => skill.trim()).filter(Boolean);

    return h(
      "div",
      { className: "skill-group" },
      h("strong", null, titleCase(category)),
      h(PillList, { items: skills, keyPrefix: category }),
    );
  }

  function TimelineCard({ item, icon, title }) {
    return h(
      "article",
      { className: "timeline-card reveal" },
      h("h3", null, h("i", { className: `fa-solid ${icon}` }), " ", item.position || item.degree),
      h("div", { className: "meta" }, item.company || item.institution),
      h("p", null, item.description || item.details),
      h(DateChip, null, `${item.start_date} - ${item.end_date}`),
    );
  }

  function TimelineSection({ id, eyebrow, title, items, icon }) {
    return h(
      "section",
      { id, className: `section-pad ${id === "experience" ? "" : "section-soft"}` },
      h(
        "div",
        { className: "container" },
        h(SectionHeading, { eyebrow, title }),
        h(
          "div",
          { className: "timeline" },
          items.map((item, index) => h(TimelineCard, { item, icon, title, key: `${title}-${index}` })),
        ),
      ),
    );
  }

  function TechStack({ technologies = [], title }) {
    if (!technologies.length) return null;

    return h(
      "div",
      { className: "tech-stack" },
      technologies.map((tech) => h("span", { className: "mini-chip", key: `${title}-${tech}` }, tech)),
    );
  }

  function PortfolioCard({ item, variant = "project", numberKey, numberLabel }) {
    const imageAlt = variant === "project" ? `${item.title} screenshot` : `${item.title} visual`;
    const media = item.image_url
      ? h("img", {
          src: imagePath(item.image_url),
          alt: imageAlt,
          className: "portfolio-card-media",
          loading: "lazy",
          decoding: "async",
        })
      : h("div", { className: "portfolio-card-media portfolio-card-media-placeholder", "aria-hidden": "true" });

    return h(
      "div",
      { className: "col-md-6 col-xl-4" },
      h(
        "article",
        { className: "portfolio-card reveal" },
        media,
        h(
          "div",
          { className: "portfolio-card-body" },
          h("h3", null, item.title),
          variant === "project" ? h("span", { className: "badge-chip" }, item.project_category || "Project") : null,
          variant === "project" ? h("p", null, h("strong", null, "Type:"), ` ${item.project_type || "N/A"}`) : null,
          variant !== "project" && item.domain ? h("p", null, h("strong", null, "Domain:"), ` ${item.domain}`) : null,
          variant !== "project" && item[numberKey] ? h("p", null, h("strong", null, `${numberLabel}:`), ` ${item[numberKey]}`) : null,
          h("p", null, item.description),
          variant === "project" ? h(TechStack, { technologies: item.technologies, title: item.title }) : null,
          h(DateChip, null, item.date),
          item.link
            ? h("a", { href: item.link, className: "btn btn-ghost mt-2", target: "_blank", rel: "noopener" }, "View Project")
            : null,
        ),
      ),
    );
  }

  function InfoGrid({ id, eyebrow, title, items, numberKey, numberLabel }) {
    return h(
      "section",
      { id, className: `section-pad ${id === "research" ? "section-soft" : ""}` },
      h(
        "div",
        { className: "container" },
        h(SectionHeading, { eyebrow, title }),
        h(
          "div",
          { className: "row g-4" },
          items.map((item) =>
            h(PortfolioCard, {
              item,
              variant: "info",
              numberKey,
              numberLabel,
              key: item.title,
            }),
          ),
        ),
      ),
    );
  }

  function ContactLinks({ socialLinks }) {
    return h(
      "div",
      { className: "contact-links" },
      h("a", { href: `mailto:${socialLinks.email}` }, h("i", { className: "fa-solid fa-envelope" }), ` ${socialLinks.email}`),
      h("a", { href: `tel:${escapePhone(socialLinks.phone)}` }, h("i", { className: "fa-solid fa-phone" }), ` ${socialLinks.phone}`),
      h("a", { href: socialLinks.linkedin, target: "_blank", rel: "noopener" }, h("i", { className: "fab fa-linkedin" }), " LinkedIn"),
      h("a", { href: socialLinks.github, target: "_blank", rel: "noopener" }, h("i", { className: "fab fa-github" }), " GitHub"),
    );
  }

  function SocialLinks({ socialLinks, buttonClass = "" }) {
    const links = [
      [socialLinks.linkedin, "fab fa-linkedin", "LinkedIn"],
      [socialLinks.github, "fab fa-github", "GitHub"],
      [socialLinks.leetcode, "fa-solid fa-code", "LeetCode"],
    ];

    return links.map(([href, icon, label]) =>
      buttonClass
        ? h(SocialButton, { href, icon, label, key: label })
        : h("a", { href, target: "_blank", rel: "noopener", "aria-label": label, key: label }, h("i", { className: icon })),
    );
  }

  function ThemeToggle({ theme, onToggle }) {
    const isDark = theme === "dark";
    const icon = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    const label = isDark ? "Light" : "Dark";

    return h(
      "button",
      {
        className: "theme-toggle",
        type: "button",
        onClick: onToggle,
        "aria-label": `Switch to ${label.toLowerCase()} mode`,
        title: `Switch to ${label.toLowerCase()} mode`,
      },
      h("i", { className: icon }),
      h("span", null, label),
    );
  }

  function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const onScroll = () => setVisible(window.scrollY > 600);
      window.addEventListener("scroll", onScroll);
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return h(
      "button",
      {
        className: `back-to-top ${visible ? "show" : ""}`,
        type: "button",
        "aria-label": "Back to top",
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      },
      h("i", { className: "fa-solid fa-arrow-up" }),
    );
  }

  window.PortfolioComponents = {
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
  };
})();
