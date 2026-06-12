const fs = require("fs");
const vm = require("vm");
const path = require("path");

const BABEL_URL = "https://unpkg.com/@babel/standalone/babel.min.js";
const SOURCE_PATH = "src/js/app.js";
const RUNTIME_PATH = "src/js/app.runtime.js";

function loadEnv() {
  const env = { ...process.env };
  const envPath = path.resolve(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.substring(0, eqIdx).trim();
      let val = trimmed.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (env[key] === undefined) {
        env[key] = val;
      }
    }
  }
  return env;
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

function getPortfolioData() {
  const env = loadEnv();
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

  return finalData;
}

async function main() {
  const parsedData = getPortfolioData();
  const dataHeader = `window.PORTFOLIO_DATA = ${JSON.stringify(parsedData, null, 2)};\n\n`;

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

  fs.writeFileSync(RUNTIME_PATH, `${dataHeader}${runtime}\n`, "utf8");
  console.log(`Built ${RUNTIME_PATH} with injected PORTFOLIO_DATA`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

