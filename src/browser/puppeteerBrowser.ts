const puppeteer = require('puppeteer');

const startBrowser = async () => {
    try {
    console.log("Opening the browser");
    let browser = await puppeteer.launch()
    return browser
    } catch (e) {
        console.log("Could not create a browser instance => : ", e);
    }
}

const stopBrowser = async (browser: { close: () => any; }) => { 
    await browser.close();                    
}

export { startBrowser, stopBrowser }