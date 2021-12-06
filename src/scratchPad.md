import { locations, keywords, notKeywords } from './lists/locationsAndKeywords'
import { readFile } from './services/readExcel'
import { filterString } from './services/filterService'
import { startBrowser, stopBrowser } from './browser/puppeteerBrowser'
import { scrapeAftonbladet } from './scrapers/aftonbladetScraper'
import { scrapeWebsite } from './controllers/scrapeController'
import { websites } from './lists/listWebsites'
import { connectDB } from './services/dbConn'
import { NewsObject } from './models/NewsObject'
import { isTriggered } from './services/isTriggered'
import SMSController from './controllers/SMSController'
const ScrapedNews = require('./models/newsObjectSchema')
const LatestNews = require('./models/latestNewsSchema')//import mongoose from 'mongoose'
const mongoose = require('mongoose')

connectDB()

let Latest = new LatestNews({
id: 1,
title: "test title2",
body: "test body2"
})
//Latest.save()

const replaceLatest = (Latest: any) => {
const firstId = { "id": "1" }
Latest.replaceOne(firstId, Latest.title)

}
//replaceLatest(Latest)

// let firstRun = 0
const isNew = (newTitle: any, oldTitle: any) => {
if(newTitle !== oldTitle){ return true }
}

(async () => {
console.log('starting test-scrape')  
 //const document = await Latest.find({ id: 1}).exec()
//console.log(document)

    const browser = await startBrowser()
    let secondLatestNewsObject = new NewsObject(
        "", "", "", "", "", "", "", "", [], []
    )

    websites.forEach((website) => {
        const timer = setInterval(async () =>{

            let latestNewsObject = await scrapeAftonbladet(browser)

            waitForNewsObject()
            function waitForNewsObject(){
                if(typeof latestNewsObject !== "undefined"){
                    console.log('NewsObject avalible')

                    if(isNew(secondLatestNewsObject.title, latestNewsObject.title)){




                        if(latestNewsObject.triggered === true) { saveAndSMS(latestNewsObject) }


                        } else { console.log('already screened newsObject') }
                } else { setTimeout(waitForNewsObject, 250) }
            }
        }, 10000)
    })

})();

async function filterAndPopulate (latestNewsObject: { title: any; keywords: string[]; body: any; tag: any; locations: string[]; triggered: boolean }, secondLatestNewsObject: { title: any }) {

    secondLatestNewsObject.title = latestNewsObject.title
                        console.log('new newsObject')

    latestNewsObject.keywords = filterString(
        (latestNewsObject.title + latestNewsObject.body + latestNewsObject.tag).toLowerCase(), keywords)

    latestNewsObject.locations = filterString(
        (latestNewsObject.title + latestNewsObject.body + latestNewsObject.tag).toLowerCase(), locations)

    latestNewsObject.triggered = isTriggered(latestNewsObject.keywords, latestNewsObject.locations)

    console.log(latestNewsObject.triggered, latestNewsObject.keywords, latestNewsObject.locations)

    return latestNewsObject

}

async function saveAndSMS (latestNewsObject: NewsObject) {
//save to DB
let latestNO = await LatestNews.create({
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
})

    //await latestNO.save()


    //send SMS message
    SMSController.sendSMS(latestNewsObject.title, latestNewsObject.body, latestNewsObject.keywords[0], latestNewsObject.locations[0])

}

const compareNewsObjects = (latestNO: NewsObject, secondLatestNO: NewsObject) => { return (latestNO.title === secondLatestNO.title) }
//function checkIfTriggered(latestNewsObject.keywords, latestNewsObject.locations)

            // latestNewsObject.locations = filterString(mergedNO, await readFile('locations'))

            //compareNewsObjects()


            //no.locations: string[] = await filterForLocations(mergedNO, locations)




                // scrape
                // compare to latest NO
                // if new filter for words
                // if words, add to NO
                // check if kw and loc are present if yes then send SMS
                // store the NO
