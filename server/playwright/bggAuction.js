import { chromium } from 'playwright'; // Playwright ESM import
import items from './data/inventory.json' assert { type: 'json' }; // Import the JSON file

(async () => {
  // Launch a browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the target URL
  await page.goto('https://boardgamegeek.com/geeklist/346730/novas-board-game-auction-ending-1121');

  // Log in
  console.log("Logging in...");
  await page.click('a[text="Log in"]'); // Adjust the selector based on the actual button
  await page.fill('input[name="username"]', 'badmelon');
  await page.fill('input[name="password"]', 'inuhanyou');

  // Perform login and wait for navigation
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForURL('https://boardgamegeek.com/geeklist/*') // Wait for navigation after login
  ]);

  console.log("Logged in successfully!");

  // Loop through items in the JSON file and upload each one
  for (const item of items) {
    console.log(`Adding item: ${item.name}`);

    // Navigate to the page or section for adding items (if required)
    // If already on the correct page, you can skip this step.

    // Select the game
    await page.click('button[text="Add Item"]');
    await page.fill('input[placeholder="Search or Paste a Link"]', item.name);
    await page.click(`span[text="${item.name}"]`);
    await page.click('button[text="Continue"]');

    // Fill out the form with item details
    await page.fill('input[placeholder="Write something great."]', `${item.condition} \nStarting Bid: ${item.cost} \nBIN:${item.price}`);

    // Submit the form
    await page.click('button[text="Save"]');
    // Wait for confirmation (e.g., check for item in the list or success message)
    await page.waitForSelector(`text="${item.name}"`); // Adjust based on the success indicator
    console.log(`Successfully added: ${item.name}`);
  }

  console.log("All items have been successfully added!");

  // Close browser 
  await browser.close();
})();
