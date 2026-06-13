const fs = require("fs");
const vm = require("vm");
const path = require("path");

const BABEL_URL = "https://unpkg.com/@babel/standalone/babel.min.js";
const SOURCE_PATH = "src/js/app.js";
const RUNTIME_PATH = "src/js/app.runtime.js";

function generateEnvIfMissing() {
  const envPath = path.resolve(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) return;

  const envKeys = [
    "PORTFOLIO_PROFILE",
    "PORTFOLIO_WORK",
    "PORTFOLIO_EDUCATION",
    "PORTFOLIO_ACHIEVEMENTS",
    "PORTFOLIO_VOLUNTEER",
    "PORTFOLIO_SKILLS",
    "PORTFOLIO_PATENTS",
    "PORTFOLIO_RESEARCH_WORKS",
    "PORTFOLIO_SOCIAL_LINKS",
    "PORTFOLIO_DATA",
  ];

  for (let i = 1; i <= 10; i++) {
    envKeys.push(`PORTFOLIO_PROJECTS_${i}`);
  }

  let content = "";
  for (const key of envKeys) {
    if (process.env[key]) {
      content += `${key}=${process.env[key]}\n`;
    }
  }

  if (content) {
    fs.writeFileSync(envPath, content, "utf8");
    console.log("Generated .env file from system environment variables");
  }
}

function loadEnvFile() {
  const envPath = path.resolve(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.substring(0, eqIdx).trim();
    let value = trimmed.substring(eqIdx + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  generateEnvIfMissing();
  loadEnvFile();

  const source = fs.readFileSync(SOURCE_PATH, "utf8");
  const babelSource = await fetch(BABEL_URL).then((response) => {
    if (!response.ok) throw new Error(`Unable to download Babel: ${response.status}`);
    return response.text();
  });

  const context = { window: {}, self: {}, console };
  vm.createContext(context);
  vm.runInContext(babelSource, context);

  const runtime = context.Babel.transform(source, {
    presets: ["react"],
    comments: false,
    compact: false,
  }).code;

  const injectedData = {
    PORTFOLIO_DATA: process.env.PORTFOLIO_DATA || null,
    PORTFOLIO_PROFILE: process.env.PORTFOLIO_PROFILE || null,
    PORTFOLIO_WORK: process.env.PORTFOLIO_WORK || null,
    PORTFOLIO_EDUCATION: process.env.PORTFOLIO_EDUCATION || null,
    PORTFOLIO_ACHIEVEMENTS: process.env.PORTFOLIO_ACHIEVEMENTS || null,
    PORTFOLIO_VOLUNTEER: process.env.PORTFOLIO_VOLUNTEER || null,
    PORTFOLIO_SKILLS: process.env.PORTFOLIO_SKILLS || null,
    PORTFOLIO_PATENTS: process.env.PORTFOLIO_PATENTS || null,
    PORTFOLIO_RESEARCH_WORKS: process.env.PORTFOLIO_RESEARCH_WORKS || null,
    PORTFOLIO_SOCIAL_LINKS: process.env.PORTFOLIO_SOCIAL_LINKS || null,
  };

  for (let i = 1; i <= 10; i++) {
    injectedData[`PORTFOLIO_PROJECTS_${i}`] = process.env[`PORTFOLIO_PROJECTS_${i}`] || null;
  }

  fs.writeFileSync(
    RUNTIME_PATH,
    `
window.__ENV__ = ${JSON.stringify(injectedData)};
${runtime}
`,
    "utf8",
  );

  console.log(`Built ${RUNTIME_PATH}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
