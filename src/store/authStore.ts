import { create } from 'zustand'
import { subscribeToAuthState, signInWithGoogle, signOutUser } from '../services/auth'
import { setDbUserId } from '../services/db'

export interface AuthUser {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  isAnonymous: boolean
}

// ─── Local-guest persistence ──────────────────────────────────────────────────
const GUEST_UID_KEY = 'ftt-guest-uid'
const GUEST_MODE_KEY = 'ftt-auth-mode'

function getOrCreateGuestUid(): string {
  let uid = localStorage.getItem(GUEST_UID_KEY)
  if (!uid) {
    uid = 'guest-' + (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2))
    localStorage.setItem(GUEST_UID_KEY, uid)
  }
  return uid
}

function persistGuestSession(user: AuthUser) {
  localStorage.setItem(GUEST_MODE_KEY, 'guest')
  localStorage.setItem(GUEST_UID_KEY, user.uid)
}

function clearGuestSession() {
  localStorage.removeItem(GUEST_MODE_KEY)
}

function restoreGuestSession(): AuthUser | null {
  if (localStorage.getItem(GUEST_MODE_KEY) !== 'guest') return null
  const uid = localStorage.getItem(GUEST_UID_KEY)
  if (!uid) return null
  return { uid, displayName: 'Guest', email: null, photoURL: null, isAnonymous: true }
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: AuthUser | null
  initialized: boolean
  loading: boolean
  error: string | null

  signInWithGoogle: () => Promise<void>
  signInAsGuest: () => void
  signOut: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  initialized: false,
  loading: false,
  error: null,

  signInWithGoogle: async () => {
    set({ loading: true, error: null })
    try {
      await signInWithGoogle()
      // onAuthStateChanged in initAuthListener will update user
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed'
      set({ error: msg, loading: false })
    }
  },

  /** Pure local guest — no Firebase anonymous auth required */
  signInAsGuest: () => {
    const uid = getOrCreateGuestUid()
    const user: AuthUser = {
      uid,
      displayName: 'Guest',
      email: null,
      photoURL: null,
      isAnonymous: true,
    }
    persistGuestSession(user)
    setDbUserId(uid)
    set({ user, loading: false, error: null })
  },

  signOut: async () => {
    set({ loading: true, error: null })
    try {
      clearGuestSession()
      await signOutUser()           // no-op if no Firebase session
      setDbUserId('guest')
      set({ user: null, loading: false })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign-out failed'
      set({ error: msg, loading: false })
    }
  },

  clearError: () => set({ error: null }),
}))

// ─── Bootstrap ────────────────────────────────────────────────────────────────
/**
 * Call once at app startup.
 * 1. Immediately restore a persisted guest session (sync, no flicker).
 * 2. Then listen to Firebase for Google sign-ins (async).
 */
export function initAuthListener(): () => void {
  // Restore local guest session before the first Firebase round-trip
  const guest = restoreGuestSession()
  if (guest) {
    setDbUserId(guest.uid)
    useAuthStore.setState({ user: guest, initialized: true })
  }

  return subscribeToAuthState((firebaseUser) => {
    if (firebaseUser && !firebaseUser.isAnonymous) {
      // Signed in with Google (or other provider)
      const user: AuthUser = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        isAnonymous: false,
      }
      clearGuestSession()
      setDbUserId(firebaseUser.uid)
      useAuthStore.setState({ user, initialized: true, loading: false })
    } else if (!firebaseUser) {
      // Firebase has no session — only clear if we don't have a local guest
      const currentUser = useAuthStore.getState().user
      if (!currentUser?.isAnonymous) {
        setDbUserId('guest')
        useAuthStore.setState({ user: null, initialized: true, loading: false })
      } else {
        // Already showing guest — just mark initialized
        useAuthStore.setState({ initialized: true })
      }
    }
  })
}
