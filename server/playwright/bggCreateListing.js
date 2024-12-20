import { chromium } from 'playwright'; 
import { bggSignIn } from './bggSignIn.js';


export async function bggCreateListing(item) {
  if (!item.name || typeof item.sellingPrice !== 'number' || item.bggCondition === undefined) {
    throw new Error(`Invalid item: ${JSON.stringify(item)}`);
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
  await bggSignIn(browser, context, page)

    // Navigate to the Sell page
    await page.click('a[href="/market/sell"]');
    await page.waitForSelector('input[placeholder="Item Title"]');

    // Fill in the item details
    console.log(`Adding item: ${item.name}`);
    await page.fill('input[placeholder="Item Title"]', item.name);
    await page.click(`a:has-text("${item.name}")`);

    // Select version if provided
    if (item.versionName && item.versionName !== "") {
      await page.click('button:has-text("Select Version")');
      await page.click(`label:has-text("${item.versionName}")`);
    }

    // Fill selling price and other details
    await page.fill('input[placeholder="Price"]', item.sellingPrice.toString());
    await page.selectOption('select[id="condition"]', item.bggCondition);

    // Handle description
    await page.fill('textarea[id="notes"]', item.bggNotes || "<3");

    // Select item location
    await page.selectOption('#itemlocation', 'United States');

    // Submit the form
    await page.click('button:has-text("Submit")');

    // Verify the listing
    await page.waitForSelector('text=Listed', { timeout: 5000 });


    // Upload photos
    if (item.photos && item.photos.length > 0) {
      const photoPaths = item.photos.map((photo) => photo.path); // Extract file paths
      await page.setInputFiles('input[type="file"]', photoPaths);
    }
    //NEED TO ADD UPLOAD VERIFICATION HERE 
    
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

export default bggCreateListing;
