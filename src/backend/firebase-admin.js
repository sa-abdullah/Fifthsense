import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import path from 'path'
import { User } from '../backend/data-model.js'


const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || path.resolve('C:/Users/USER/Documents/My_software_development_journey/Projects/React/dataflow-firebase-admin.json')

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
}

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid authorization header format' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({error: 'Missing Token'})
    }

    try {
        const decoded = await admin.auth().verifyIdToken(token)
        req.user = decoded
        console.log('Decoded User Verified', decoded)

        await User.updateOne(
            { uid: decoded.uid }, 
            {
                $setOnInsert: {
                    uid: decoded.uid, 
                    email: decoded.email,
                    displayName: decoded.displayName, 
                    photoURL: decoded.photoURL, 
                    createdAt: Date.now()
                }
            }, 
            { upsert: true }
        )
        next()
    } catch(err) {
        console.error('Token verification failed', err.message)
        res.status(401).json({error: 'Unauthorized: Invalid token'})
    }
}

export default verifyToken
