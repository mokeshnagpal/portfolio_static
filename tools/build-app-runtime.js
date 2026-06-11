const fs = require("fs");
const vm = require("vm");
const path = require("path");

const BABEL_URL = "https://unpkg.com/@babel/standalone/babel.min.js";
const SOURCE_PATH = "src/js/app.js";
const RUNTIME_PATH = "src/js/app.runtime.js";

function getPortfolioDataFromEnv() {
  if (process.env.PORTFOLIO_DATA) {
    return process.env.PORTFOLIO_DATA;
  }

  const envPath = path.resolve(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error("No .env file found at project root and PORTFOLIO_DATA is not set in process.env");
  }
  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    if (line.trim().startsWith("PORTFOLIO_DATA=")) {
      let value = line.substring(line.indexOf("=") + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      return value;
    }
  }
  throw new Error("PORTFOLIO_DATA not found in .env file or environment");
}

async function main() {
  const dataStr = getPortfolioDataFromEnv();
  let parsedData;
  try {
    parsedData = JSON.parse(dataStr);
  } catch (err) {
    throw new Error("PORTFOLIO_DATA in .env is not valid JSON: " + err.message);
  }

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

