
const xlsxFile = require('read-excel-file/node');

async function readFile (fileName: string) {

        let filePath = '../services/'+ fileName + '.xlsx'
        console.log(filePath)
        const list: string[] = xlsxFile(filePath).then((rows: any) => {
            let localList: string[] = [];
            rows.forEach((col: any) => {
                col.forEach((data: string) => { 
                    localList.push(data);
                    })
            })               
            return localList    
        })  
        return list
    }    


export { readFile }

