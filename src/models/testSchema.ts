import mongoose from 'mongoose'
// https://www.youtube.com/watch?v=1NrHkjlWVhM

const opts = {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
}

const testSchema = new mongoose.Schema(
    {
    id: String,
    age: String },
    
    { timestamps:true }
)

module.exports = mongoose.model('TestSchema', testSchema, 'testSchema')