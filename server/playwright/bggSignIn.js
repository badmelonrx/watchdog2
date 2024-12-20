import { chromium } from 'playwright'; // Playwright ESM import

const username = process.env.BGG_USERNAME
const password = process.env.BGG_PASSWORD


export async function bggSignIn(browser, context, page) {
    // Navigate to the login page
    await page.goto('https://boardgamegeek.com/market?pageid=1');
    console.log("Logging in...");
    await page.click('a:has-text("Sign In")');
    await page.fill('input[name="username"]', username); 
    await page.fill('input[name="password"]', password); 
    
    // Perform login and wait for navigation
    await Promise.all([
        page.click('button:has-text("Sign In")'),
        page.waitForURL('https://boardgamegeek.com/market*'),
    ]);

    console.log("Logged in successfully!");
}

export default bggSignIn;
