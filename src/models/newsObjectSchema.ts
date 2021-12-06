import mongoose from 'mongoose'
// https://www.youtube.com/watch?v=1NrHkjlWVhM

const newsObjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    source:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: false
    },
    tag:{
        type: String,
        required: true
    },
    keywords:{
        type: [String],
        required: true
    },
    locations:{
        type: [String],
        required: true
    },
    triggered:{
        type: Boolean,
        required: false
    }
}, { timestamps: true })

module.exports = mongoose.model('ScrapedNews', newsObjectSchema, 'scrapedNews')