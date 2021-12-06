const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(('mongodb://localhost:27017/scraper'), {
            useUnifiedTopology: true,
            useNewUrlParser: true
            })
    } catch(e){
        console.error(e)
    }
}

mongoose.connection.on('connected', () => {
    console.log('connected to mongodb');
  });
  
mongoose.connection.on('disconnected', () => {
    console.log('connection disconnected');
  });

export { connectDB }