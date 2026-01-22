import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
if (!fs.existsSync("output")) fs.mkdirSync("output");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTML_FILE = path.join(__dirname, "app.html");
const OUTPUT = path.join(__dirname, "output", "meteomedia_10471.png");

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Feste Größe für reproduzierbares PNG
  await page.setViewport({
    width: 820,
    height: 550,
    deviceScaleFactor: 2   // scharf!
  });

  // Lokale HTML laden
  await page.goto("file://" + HTML_FILE, {
    waitUntil: "networkidle0"
  });

  // Warten bis alle Charts da sind
  await page.waitForFunction(() => window.__RENDER_DONE__ === true);


  // Screenshot
  await page.screenshot({
    path: OUTPUT,
    clip: {
      x: 1,
      y: 1,
      width: 818,
      height: 518
    }
  });

  await browser.close();
  console.log("PNG erzeugt:", OUTPUT);
})();
