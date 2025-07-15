import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../backend/data-model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use ENV path if provided (Render Secret File) or fallback to local dev path
const localPath = path.join(process.cwd(), 'dataflow-firebase-admin.json')

let serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH 

if (!serviceAccountPath || !existsSync(serviceAccountPath)) {
  serviceAccountPath = localPath
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
console.log('✅ Using service account path:', serviceAccountPath);


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('🪵 Incoming Authorization Header:', authHeader); 


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid authorization header format' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;

    console.log('✅ Decoded user verified:', decoded);
    console.log('🔍 decoded.aud:', decoded.aud);
    console.log('🔍 serviceAccount.project_id:', serviceAccount.project_id);


    await User.updateOne(
      { uid: decoded.uid },
      {
        $setOnInsert: {
          uid: decoded.uid,
          email: decoded.email,
          displayName: decoded.displayName,
          photoURL: decoded.photoURL,
          createdAt: Date.now(),
        },
      },
      { upsert: true }
    );

    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default verifyToken;
