/**
 * Firebase Admin SDK for server-side operations
 * Used in API routes and server components
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let app: App
let adminDb: Firestore

function initAdmin() {
  if (getApps().length === 0) {
    // Initialize with service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      app = initializeApp({
        credential: cert(serviceAccount),
      })
    } else {
      // Fallback for Netlify/Vercel with environment variables
      app = initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    }
    adminDb = getFirestore(app)
  } else {
    app = getApps()[0]
    adminDb = getFirestore(app)
  }
  
  return adminDb
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    return initAdmin()
  }
  return adminDb
}

