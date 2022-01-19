const puppeteer = require('puppeteer');

const startBrowser = async () => {
    try {
    let browser = await puppeteer.launch()
    console.log("[i] Browser running");
    return browser
    } catch (e) {
        console.log("[!] Could not create a browser instance => : ", e);
    }
}

const stopBrowser = async (browser: { close: () => any; }) => { 
    await browser.close();                    
}

export { startBrowser, stopBrowser }