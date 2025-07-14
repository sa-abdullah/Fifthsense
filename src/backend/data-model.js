import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    uid: {
        type: String, 
        required: true, 
        unique: true
    }, 
    email: {
        type: String,
        required: true, 
        unique: true,
    }, 
    displayName: {
        type: String
    }, 
    photoURL: {
        type: String 
    }, 
    createdAt: {
        type: Date, 
        default: Date.now()
    }
})

const User = mongoose.model('User', userSchema)

export { User }