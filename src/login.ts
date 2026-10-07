import { chromium } from "@playwright/test";
import "dotenv/config";

const pdiUrl = process.env.PDI_URL;
const username = process.env.PDI_USERNAME;
const password = process.env.PDI_PASSWORD;
const pageWaitMs = Number(process.env.PAGE_WAIT_MS ?? 2000);

// PDI_URL=https://dev181786.service-now.com/
if (!pdiUrl || !username || !password) {
  throw new Error("Missing PDI environment variables");
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`Opening ${pdiUrl}`);

    const pidLoginUrl = `${pdiUrl}/login.do?user_name=${username}&sys_action=sysverb_login&user_password=${password}`

    await page.goto(pidLoginUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });


    await page.waitForLoadState("domcontentloaded");

    console.log("Login completed.");
    console.log(`Current URL: ${page.url()}`);

    await page.waitForTimeout(pageWaitMs);

    const pagesToOpen = [
      'incident_list.do',
      'problem_list.do',
      'change_request_list.do',
      'sc_req_item_list.do',
    ];

    for (const path of pagesToOpen) {
      const page = await context.newPage();

      try {
        const url = new URL(path, pdiUrl).toString();

        console.log(`Opening: ${url}`);

        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60_000,
        });

        console.log(`Loaded: ${path}`);

        await page.waitForTimeout(pageWaitMs);

      } finally {
        await page.close();
        console.log(`Closed: ${path}`);
      }
    }
    
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});