import { chromium } from 'playwright'; // Playwright CommonJS import
import { bggSignIn } from './bggSignIn.js';

export async function bggDeleteListing(listingUrl) {

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Navigate to the login page
        await bggSignIn(browser, context, page)

        // Navigate to the listing page
        await page.goto(listingUrl);

        // Click the delete button
        console.log(`Deleting listing: ${listingUrl}`);
        await page.click('button:has-text("Delete")');

        // Confirm deletion
        await page.click('button:has-text("Ok")');
        await page.waitForURL('https://boardgamegeek.com/market/account/inventory?pageid=1'),

        console.log("Listing deleted successfully.");
    } catch (error) {
        console.error("Error during listing deletion:", error);
        throw error;
    } finally {
        await browser.close();
    }
}

export default bggDeleteListing;
