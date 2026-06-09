/**
 * Per-user onboarding completion tracking.
 * Stored in localStorage so it survives page reloads without needing IndexedDB.
 */
const KEY_PREFIX = 'ftt-ob-'

/** Returns true if the given user has already completed (or skipped) onboarding. */
export function hasCompletedOnboarding(uid: string): boolean {
  return localStorage.getItem(KEY_PREFIX + uid) === 'done'
}

/** Marks onboarding as completed for the given user. */
export function markOnboardingComplete(uid: string): void {
  localStorage.setItem(KEY_PREFIX + uid, 'done')
}
