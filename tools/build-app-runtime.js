const fs = require("fs");
const vm = require("vm");
const path = require("path");

const BABEL_URL = "https://unpkg.com/@babel/standalone/babel.min.js";
const SOURCE_PATH = "src/js/app.js";
const RUNTIME_PATH = "src/js/app.runtime.js";

// Generate .env file from process.env if it doesn't exist (useful for CI/CD like Vercel)
function generateEnvIfMissing() {
  const envPath = path.resolve(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
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
      "PORTFOLIO_DATA"
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
}

async function main() {
  generateEnvIfMissing();

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

  fs.writeFileSync(RUNTIME_PATH, `${runtime}\n`, "utf8");
  console.log(`Built ${RUNTIME_PATH}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
