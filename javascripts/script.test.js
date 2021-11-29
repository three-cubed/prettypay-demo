const puppeteer = require('puppeteer');
const mainURL = 'http://localhost:3030';

describe('testing Prettypay\'s success functionality with automated browsers', () => {

    const timeLimitInSeconds = 25;
    const timeLimitInMilli = timeLimitInSeconds * 1000;

    test('site should activate Prettypay payment modal', async () => {
        const page = await launchPuppeteerAndOpenPage(mainURL);
        await page.click("#buyBtn");
        const classList = await getClassListArray(page, '#payment-modal');
        expect(classList.includes('active')).toBe(true);

    }, timeLimitInMilli);

    test('Prettypay should activate successful transaction modal', async () => {
        const page = await launchPuppeteerAndOpenPage(mainURL);
        await page.click('#buyBtn');
        await page.click('#process-transaction-prettypay-btn');
        const classList = await getClassListArray(page, '#transaction-successful-modal');
        expect(classList.includes('active')).toBe(true);

    }, timeLimitInMilli);

})

async function launchPuppeteerAndOpenPage(pageToOpen) {
    const browser = await puppeteer.launch({
        headless: false, // Must be false to perform the tests.
        slowMo: 100
    });
    const page = await browser.newPage();
    await page.goto(pageToOpen);
    return page;
}

async function getClassListArray(page, element) {
    const elementHandle = await page.$(element); // This grabs the element (returns an 'elementHandle')
    const className = await elementHandle.getProperty("className"); // Returns a 'jsHandle' of that property
    const classNameString = await className.jsonValue(); // This converts the className 'jsHandle' to a space delimitedstring       
    const classList = await classNameString.split(" "); // Splits into array
    return classList;
}
