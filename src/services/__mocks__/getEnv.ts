export function getEnv(key: keyof ImportMetaEnv): string | boolean | undefined {
  return {
    VITE_BEACON_URL: 'ws://localhost:3030',
    VITE_TURN_URL: 'turn:domai.ne:1234',
    VITE_TURN_USER: 'fake_user',
    VITE_TURN_CRED: 'fake_cred',
  }[key];
}
