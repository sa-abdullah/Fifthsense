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


const sessionSchema = new mongoose.Schema({
  userId: { type: String },
  title: { type: String, default: 'New Chat' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  role: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});


const Chat = mongoose.model('Chat', chatSchema)
const Session = mongoose.model('Session', sessionSchema)
const User = mongoose.model('User', userSchema)



export { User, Session, Chat }