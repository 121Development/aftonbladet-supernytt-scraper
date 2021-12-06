import { locations, keywords, notKeywords } from './lists/locationsAndKeywords'
import { filterString } from './services/filterService'
import { startBrowser, stopBrowser } from './browser/puppeteerBrowser'
import { scrapeAftonbladet } from './scrapers/aftonbladetScraper'
//import { scrapeWebsite } from './controllers/scrapeController'
import { websites } from './lists/listWebsites'
import { alertReceivingNumbers } from './lists/alertReceivingNumbers'
import { connectDB } from './services/dbConn'
import { NewsObject } from './models/NewsObject'
import Utils from './util/utils'
import SMSController from './controllers/SMSController'
const ScrapedNews = require('./models/newsObjectSchema')
const LatestNews = require('./models/latestNewsSchema')//import mongoose from 'mongoose'
//const mongoose = require('mongoose')
import * as mongoose from 'mongoose';

(async () => {
    console.log('starting test-scrape')  
    await connectDB()
    
    const browser = await startBrowser()

    for (const site in websites) {
        const timer = setInterval(async () =>{
            
            let latestNewsObject: NewsObject = await waitForNewsObject(scrapeAftonbladet(browser))

            if(await isNew(latestNewsObject.title)){
                latestNewsObject = await filterAndPopulate(latestNewsObject)
            } else { console.log('already screened newsObject') }
                                    
            if(latestNewsObject.triggered === true) { 
                await saveAndSMS(latestNewsObject) }
        }, 10000)     
    }  
})();

async function waitForNewsObject(latestNewsObject: any){
    if(typeof latestNewsObject !== "undefined"){
        console.log('NewsObject avalible')
        return latestNewsObject           
    } else { setTimeout(waitForNewsObject, 250) }
} 

async function filterAndPopulate (latestNewsObject: any) {

   // secondLatestNewsObject.title = latestNewsObject.title       
    console.log('new newsObject')

    latestNewsObject.keywords = filterString(
        (latestNewsObject.title + latestNewsObject.body + latestNewsObject.tag).toLowerCase(), keywords)

    latestNewsObject.locations = filterString(
        (latestNewsObject.title + latestNewsObject.body + latestNewsObject.tag).toLowerCase(), locations)

    latestNewsObject.triggered = isTriggered(latestNewsObject.keywords, latestNewsObject.locations)

    console.log(latestNewsObject.triggered, latestNewsObject.keywords, latestNewsObject.locations)

    return latestNewsObject

}

async function saveAndSMS (latestNewsObject: any) {
    //save to DB
    let latestNO = await ScrapedNews.create({
        title: latestNewsObject.title,
        body: latestNewsObject.body, 
        source: latestNewsObject.source,
        link: latestNewsObject.link,
        time: latestNewsObject.time,
        date: latestNewsObject.date,
        author: latestNewsObject.author,
        tag: latestNewsObject.tag,
        keywords: latestNewsObject.keywords, 
        locations: latestNewsObject.locations,
        triggered: latestNewsObject.triggered
    },function(err: any){
        if (err) {
          console.log(err);
          return;
        }
        console.log("New NewsObject added"); 
      })

    SMSController.sendSMS(latestNewsObject.title, latestNewsObject.body, latestNewsObject.keywords[0], latestNewsObject.locations[0])
}

async function isNew (latestNewsObjectTitle: any){
    const entry = await LatestNews.findOne({ id: 1}).exec()
    if(latestNewsObjectTitle !== entry.title){ 
        LatestNews.updateOne({id: 1}, {title: latestNewsObjectTitle}, function(err: any, docs: any) {
            if (err) { console.log(err)} else { console.log('Updated entry: ', docs)}
        })
        return true }
    return false
}

const isTriggered = (kw: string[], loc: string[]) => {
    if( kw?.length && kw?.length) { return true }
    return false
}