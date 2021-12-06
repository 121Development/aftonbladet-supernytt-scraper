import mongoose from 'mongoose'
// https://www.youtube.com/watch?v=1NrHkjlWVhM

const opts = {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
}

const latestNewsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('LatestNews', latestNewsSchema, 'latestNews')