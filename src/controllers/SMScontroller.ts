import SendSMS from '../services/SendSMS'
import Utils from '../util/utils'

const utf8 = require('utf8');

export default class SMSController {
    
    static sendSMS: any = (title: string, body: string, keyword: string, location: string) => {

        try{
        let message = title + '\n\n'
            + "Keyword: " + Utils.properCase(keyword) + '\n\n'
            + "Location: " + Utils.properCase(location) + '\n\n'
            + body.substr(0,50)
        
            console.log(message)
            SendSMS.send('+46704545476', 'ScrapeAlert', message)
        } catch(e){
            console.error(e)

        }
     

    }
}