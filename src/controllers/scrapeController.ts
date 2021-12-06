import { scrapeAftonbladet } from '../scrapers/aftonbladetScraper'
import { NewsObject } from '../models/NewsObject'

const scrapeWebsite = async (browser: any, website: string) => {   
    console.log('scrape func')
    const no = await scrapeAftonbladet(browser)
    return no
}
    
export { scrapeWebsite }