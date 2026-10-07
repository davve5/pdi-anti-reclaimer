import { chromium } from "@playwright/test";
import "dotenv/config";

const pdiUrl = process.env.PDI_URL;
const username = process.env.PDI_USERNAME;
const password = process.env.PDI_PASSWORD;
const pageWaitMs = Number(process.env.PAGE_WAIT_MS ?? 2000);

if (!pdiUrl || !username || !password) {
  throw new Error("Missing PDI environment variables");
}

function log(message: string) {
  const now = new Date();

  console.log(
    `[${now.toISOString()}] ${message}`
  );
}

async function main() {
  log("=== PDI automation started ===");

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    log(`Opening ${pdiUrl}`);

    const pidLoginUrl =
      `${pdiUrl}/login.do?user_name=${username}&sys_action=sysverb_login&user_password=${password}`;

    await page.goto(pidLoginUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });

    await page.waitForLoadState("domcontentloaded");

    log("Login completed.");
    log(`Current URL: ${page.url()}`);

    await page.waitForTimeout(pageWaitMs);

    const pagesToOpen = [
      "incident_list.do",
      "problem_list.do",
      "change_request_list.do",
      "sc_req_item_list.do",
    ];

    for (const path of pagesToOpen) {
      const page = await context.newPage();

      try {
        const url = new URL(path, pdiUrl).toString();

        log(`Opening: ${url}`);

        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60_000,
        });

        log(`Loaded: ${path}`);

        await page.waitForTimeout(pageWaitMs);

      } catch (error) {
        log(`ERROR while processing ${path}`);
        console.error(error);

      } finally {
        await page.close();
        log(`Closed: ${path}`);
      }
    }

    log("All pages processed successfully.");

  } catch (error) {
    log("ERROR: PDI automation failed.");
    console.error(error);

    throw error;

  } finally {
    await browser.close();
    log("Browser closed.");
    log("=== PDI automation finished ===");
  }
}

main().catch((error) => {
  log("FATAL ERROR: process terminated.");
  console.error(error);

  process.exit(1);
});