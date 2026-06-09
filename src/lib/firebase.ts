import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDudAEpfyxFuTLcQYA8IUQQVxLrvPPfue4',
  authDomain: 'focus-time-tracker-2f797.firebaseapp.com',
  projectId: 'focus-time-tracker-2f797',
  storageBucket: 'focus-time-tracker-2f797.firebasestorage.app',
  messagingSenderId: '851762820816',
  appId: '1:851762820816:web:7b434bb84226caefb1d0d5',
  measurementId: 'G-1QH3F3JD9B',
}

// Prevent duplicate initialization in HMR / StrictMode
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export default app
