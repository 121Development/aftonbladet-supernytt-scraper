const mongoose = require('mongoose')

const url = `mongodb+srv://eel:socsoc11dbfunc@scraper.bh7ey.mongodb.net/scraperdb?retryWrites=true&w=majority`;


const connectDB = async () => {
    try{
        //await mongoose.connect(('mongodb://localhost:27017/scraper'), {
        await mongoose.connect((url), {
            useUnifiedTopology: true,
            useNewUrlParser: true
            })
    } catch(e){
        console.error(e)
    }
}

mongoose.connection.on('connected', () => {
    console.log('[i] Connected to mongodb');
  });
  
mongoose.connection.on('disconnected', () => {
    console.log('[!] Connection disconnected');
  });

export { connectDB }