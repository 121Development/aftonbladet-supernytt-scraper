class NewsObject{
    title: string;
    body: string;
    source: string;
    link: string;
    time: string;
    date: string;
    author: string|undefined;
    tag: string|undefined;
    locations: string[]|undefined;
    keywords: string[]|undefined;
    triggered: boolean|undefined;

    constructor(title: string, body: string, source: string, link: string, 
                time: string, date: string, author?: string, tag?: string, 
                keywords?: string[], locations?: string[], triggered?: boolean,) {
        this.title = title;
        this.body = body;
        this.source = source;
        this.link = link;
        this.time = time;
        this.date = date;
        this.author = author;
        this.tag = tag;
        this.keywords = keywords
        this.locations = locations
        this.triggered = triggered;
    }
}

export { NewsObject }

//module.exports.NewsObject = 'NewsObject'

// let newsObject = {
//     title: "rån",
//     time: "12:00",
//     author: "Åsa",
//     body: "stort rån",
//     source: "aftonbladet",
//     link: "http"
// };