import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTML_FILE = path.join(__dirname, "app.html");
const OUTPUT = path.join(__dirname, "meteomedia_10471.png");

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Feste Größe für reproduzierbares PNG
  await page.setViewport({
    width: 820,
    height: 640,
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
      x: 0,
      y: 0,
      width: 820,
      height: 640
    }
  });

  await browser.close();
  console.log("PNG erzeugt:", OUTPUT);
})();
