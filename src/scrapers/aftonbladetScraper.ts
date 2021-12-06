import { date } from '../services/date'
import { NewsObject } from '../models/NewsObject'
import { createPage } from '../controllers/pageController'

// these variables will be cast to string, look below at fn.toString()

const scrapeAftonbladet = async (browser: any) => {

    console.log("scraping Aftonbladet")

    const urlAftonbladet = 'https://live.aftonbladet.se/supernytt'
    const page = await createPage(browser, urlAftonbladet)

    const aftonbladetPaths = {
        titleEle: '.news-flow section article h2',
        bodyEle: '.news-flow section article div',
        linkEle: '.news-flow section article:nth-child(1) div time > a',
        timeEle: '.news-flow section article div time[itemprop="datePublished"]',
        authorEle: '.news-flow section article div span',
        tagEle: '//*[@id="root"]/div/div/section/div/div/section/article[1]/ul/li/a'
    }

    function encode_utf8(s: string | number | boolean) {
        return unescape(encodeURIComponent(s));
      }

    function decode_utf8(s: string) {
        return decodeURIComponent(escape(s));
      }
    //******        ---------------        *********************' */
    try{

        let title = await page.$eval(aftonbladetPaths.titleEle, (uiElement: any) => uiElement.innerText )   
        let body = await page.$eval(aftonbladetPaths.bodyEle, (uiElement: any) => uiElement.nextElementSibling.nextElementSibling.textContent) 
        let pUrl = page.url()
        let source = pUrl.split('//').pop().split('/')[0]
        let link = await page.$eval(aftonbladetPaths.linkEle, (uiElement: any) => 'https://live.aftonbladet.se'+uiElement.getAttribute('href'))
        let time = await page.$eval(aftonbladetPaths.timeEle, (uiElement: any) => uiElement.textContent.slice(0,5))
        let author = await page.$eval(aftonbladetPaths.authorEle, (uiElement: any) => uiElement.innerText)

        let [locX] = await page.$x(aftonbladetPaths.tagEle)
        let locAtr = await locX.getProperty('href')
        //let locFull = await locAtr.jsonValue().decode()
        let locFull = await locAtr.jsonValue()
        let tag = decode_utf8(locFull.split('/').pop())
        
        let keywords = undefined
        let locations = undefined

        let no = new NewsObject(title, body, source, link, time, date, author, tag, keywords, locations) 
        
        console.log(no)
        await page.close()
        return no
    } catch (e) {
        console.log('error in evaluating page ' + e)
    }
}
export { scrapeAftonbladet }


// function locationGather(){
//     let [locX] = await page.$x(aftonbladetPaths.tagEle)
//     let locAtr = await locX.getProperty('href')
//     let locFull = await locAtr.jsonValue()
//     return locFull
// }
// let no = new NewsObject( = () => {
//     await page.$eval(aftonbladetPaths.titleEle, (uiElement: any) => uiElement.innerText ), 
//     await page.$eval(aftonbladetPaths.bodyEle, (uiElement: any) => uiElement.nextElementSibling.nextElementSibling.textContent), 
//     await page.url().pUrl.split('//').pop().split('/')[0], 
//     await page.$eval(aftonbladetPaths.linkEle, (uiElement: any) => 'https://live.aftonbladet.se'+uiElement.getAttribute('href')), 
//     await page.$eval(aftonbladetPaths.timeEle, (uiElement: any) => uiElement.textContent.slice(0,5)), 
//     date, 
//     await page.$eval(aftonbladetPaths.authorEle, (uiElement: any) => uiElement.innerText), 
//     locationGather()
// })





    
// let uHtml = await page.$eval(locationEle2, (uiElement: any) => {
//     uiElement
// })
// console.log(uHtml)


    // let details = await page.$eval(
    //     "#root",
    //     (nodes: any[]) =>
    //       nodes.map(async n => {
    //         let title = await n.$eval(".news-flow section article h2", (nn: { innerText: any; }) => nn.innerText);
    //         //let amount = await n.$eval(".a-text-right span", nn => nn.innerText);
    //         console.log(title)
    //         return { title: title };
    //     }))

    // let title2 = await page.$eval(titleEle, (el: { innerText: any; }) => el.innerText)
    // console.log(title2)

    //<let title3 = await page.evaluate(titleEle, (el: { innerText: any; }) => el.innerText)
    //console.log(title3)


// const updatedAt = await page.evaluate(
//     ([selector, util]) => {
//       let { pipe, map, pluck } = util
//       pipe = new Function(`return ${pipe}`)()
//       map = new Function(`return ${map}`)()
//       pluck = new Function(`return ${pluck}`)()
  
//       return pipe(
//           (        s: any) => document.querySelector(s),
//         pluck('textContent'),
//         map((text: string) => text.trim())
//         //map((date: string) => Date.parse(date)),
//         //map((timeStamp: any) => Promise.resolve(timeStamp))
//       )(selector)
//     },
//     [
//       '#table-announcements tbody td:nth-child(2) .d-none',
//       { pipe: pipe.toString(), map: map.toString(), pluck: pluck.toString() },
//     ]
//   )

//     updatedAt(websites, )


// // util functions
// const pipe = (...fns: any[]) => (initialVal: any) => fns.reduce((acc, fn) => fn(acc), initialVal)
// const pluck = (key: string | number) => (obj: { [x: string]: any }) => obj[key] || null
// const map = (fn: (arg0: any) => any) => (item: any) => fn(item)
