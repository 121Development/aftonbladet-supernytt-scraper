import Utils from '../util/utils'

const filterString = (string: string, filterKeywords: string[]) => {
    let matches: string[] = []
    for (const kw of filterKeywords) { 
        if(string.search(kw.toLowerCase()) !== -1) 
        { matches.push(kw) } }
    return matches
}



// const filterString = async (string: string, filterKeywords: string[]) => {
//     let matches = await Promise.allSettled(filterKeywords.map(async (kw) => 
//         checkFilter(string, kw)))
//     return matches
// }

// const filterString = async (string: string, filterKeywords: string[]) => {
//         let matches: string[] = []
//         for (const kw of keywords) {
//             if(string.search(kw) !== -1)
//             { matches.push(kw)}
//         }
//         return matches
// }

const checkFilter = (string: string, kw:string) => {
    if(string.search(kw) !== -1)
    {return kw }
}


export { filterString }

