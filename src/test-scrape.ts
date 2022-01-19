import { locations, keywords, notKeywords } from "./lists/locationsAndKeywords";
import { filterString } from "./services/filterService";
import { startBrowser, stopBrowser } from "./browser/puppeteerBrowser";
import { scrapeAftonbladet } from "./scrapers/aftonbladetScraper";
//import { scrapeWebsite } from './controllers/scrapeController'
import { websites } from "./lists/listWebsites";
import { alertReceivingNumbers } from "./lists/alertReceivingNumbers";
import { connectDB } from "./services/dbConn";
import { NewsObject } from "./models/NewsObject";
import Utils from "./util/utils";
import SMSController from "./controllers/SMScontroller";
const ScrapedNews = require("./models/newsObjectSchema");
const LatestNews = require("./models/latestNewsSchema"); //import mongoose from 'mongoos :'
//const mongoose = require('mongoose')
import * as mongoose from "mongoose";
const express = require("express");
const app = express();

//! lägg till händelse för när något saknar titel

app.use(express.static("dist"));
// make server listen on some port
app.listen(4000, () => console.log("[i] Server listening on port 3000"));

let isok = "";

app.get("/", (req: any, res: { send: (arg0: string) => void }) => {
  res.send("[i] Server running\n" + isok);
});

// ! Deploy to Heroku, figure out mongo
// !

(async () => {
  console.log("[i] Starting test-scrape app");
  await connectDB();

  const browser = await startBrowser();

  for (const site in websites) {
    const timer = setInterval(async () => {
      try {
        let latestNewsObject: NewsObject = await waitForNewsObject(
          scrapeAftonbladet(browser)
        );

        if (await isNew(latestNewsObject.title)) {
          latestNewsObject = await filterAndPopulate(latestNewsObject);
          isok = "[i] All systems go, scraping";
        } else {
          console.log("already screened newsObject");
        }

        if (latestNewsObject.triggered === true) {
          await saveAndSMS(latestNewsObject);
        }
      } catch (err) {
        console.log(err);
      }
    }, 30000);
  }
})();

async function waitForNewsObject(latestNewsObject: any) {
  if (typeof latestNewsObject !== "undefined") {
    console.log("[!] NewsObject availble");
    return latestNewsObject;
  } else {
    setTimeout(waitForNewsObject, 250);
  }
}

async function filterAndPopulate(latestNewsObject: any) {
  // secondLatestNewsObject.title = latestNewsObject.title
  console.log("[!] New newsObject parsing");

  latestNewsObject.keywords = filterString(
    (
      latestNewsObject.title +
      latestNewsObject.body +
      latestNewsObject.tag
    ).toLowerCase(),
    keywords
  );

  latestNewsObject.locations = filterString(
    (
      latestNewsObject.title +
      latestNewsObject.body +
      latestNewsObject.tag
    ).toLowerCase(),
    locations
  );

  latestNewsObject.triggered = isTriggered(
    latestNewsObject.keywords,
    latestNewsObject.locations
  );

  console.log(
    latestNewsObject.triggered,
    latestNewsObject.keywords,
    latestNewsObject.locations
  );

  return latestNewsObject;
}

async function saveAndSMS(latestNewsObject: any) {
  //save to DB
  let latestNO = await ScrapedNews.create(
    {
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
      triggered: latestNewsObject.triggered,
    },
    function (err: any) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("New NewsObject added");
    }
  );

  SMSController.sendSMS(
    latestNewsObject.title,
    latestNewsObject.body,
    latestNewsObject.keywords[0],
    latestNewsObject.locations[0]
  );
}

async function isNew(latestNewsObjectTitle: any) {
  try {
    const entry = await LatestNews.findOne({ id: 1 }).exec();
    if (latestNewsObjectTitle !== entry.title) {
      LatestNews.updateOne(
        { id: 1 },
        { title: latestNewsObjectTitle },
        function (err: any, docs: any) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated entry: ", docs);
          }
        }
      );
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
  }
}

const isTriggered = (kw: string[], loc: string[]) => {
  if (kw?.length && loc?.length) {
    return true;
  }
  return false;
};
