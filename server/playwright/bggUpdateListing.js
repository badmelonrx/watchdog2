import { chromium } from 'playwright'; 
import { bggSignIn } from './bggSignIn.js';

const storageLocation = 'data/images';


async function getFilePath(photoId) {
  const filePath = path.join(config.storageLocation, photoId); // Use env-driven path
  try {
    await fs.access(filePath);
    return filePath;
  } catch (error) {
    console.error(`File not found for photoId: ${photoId}`);
    throw new Error(`File not found: ${photoId}`);
  }
}

export async function bggUpdateListing(item) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await bggSignIn(browser, context, page)
    // Navigate to the Item Listing page
    await page.goto(item.bgg.listingUrl);
    await page.waitForSelector(`a[has-text="${item.name}"]`);

    // Fill in the item details
    console.log(`Updating item: ${item.name}`);
    await page.fill('input[placeholder="Item Title"]', item.name);
    await page.click(`a:has-text("${item.name}")`);

    // Select version if provided
    if (item.versionName && item.versionName !== "") {
      await page.click('input[ng-click="clearVersion()"]');
      await page.click('button:has-text("Select Version")');
      await page.click(`label:has-text("${item.versionName}")`);
    }

    // Fill selling price and other details
    await page.fill('input[placeholder="Price"]', item.sellingPrice.toString());
    await page.selectOption('select[id="condition"]', item.bggCondition);

    // Handle description
    await page.fill('textarea[id="notes"]', item.bggNotes || "<3");

    // Submit the form
    await page.click('button:has-text("Submit")');

    // Verify the listing
    await page.waitForSelector('text=Listed', { timeout: 5000 });
    let urlString = page.url();
    console.log(`Successfully added: ${item.name}`);
    return urlString;
    
  } catch (error) {
    console.error(`Failed to add item: ${item.name}. Error: ${error}`);
    throw error; // Re-throw the error to be handled by the caller
  } finally {
    // Close the browser
    await browser.close();
  }
}

export default bggUpdateListing;
