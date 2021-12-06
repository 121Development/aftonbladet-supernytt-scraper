require('dotenv').config()
const https = require('https')
const querystring = require('querystring')
const postFields = {
    to:      '',
    from:    '',
    message: ''
  }
export default class SendSMS {

    static send: any = (number: string, from: string, message: string) => {


            postFields.to = number
            postFields.from = from
            postFields.message = message
            
            console.log('Current number sent to is: ' + number)
            console.log('Current from is: ' + from)
            console.log('Current message is: ' + message)

            const key = Buffer.from(process.env.USERNAME + ':' + process.env.PASSWORD).toString("base64");
            const postData = querystring.stringify(postFields)

            const options = {
            hostname: 'api.46elks.com',
            path:     '/a1/SMS',
            method:   'POST',
            headers:  {
                'Authorization': 'Basic ' + key
            }
            }

            const callback = (response: any) => {
            var str = ''
            response.on('data', (chunk: any) => {
                str += chunk
            })

            response.on('end', () => {
                console.log("Response from 46Elks:")
                console.log(str)
            })
            }

            var request = https.request(options, callback)
            request.write(postData)
            request.end()

        }
}