

async function createPage(browser: { newPage: () => any; }, url: any) {
    
    const preparePageForTests = async (page: { setUserAgent: (arg0: string) => any; }) => {
        
        // Pass the User-Agent Test.
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
          'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
        await page.setUserAgent(userAgent);
        }

    let page = await browser.newPage()
    await preparePageForTests(page);
    await page.goto(url, { waitUntil: 'networkidle2'})
    await page.waitForSelector('.news-flow')
    console.log('[i] Page created')
    return page
    }

export { createPage }