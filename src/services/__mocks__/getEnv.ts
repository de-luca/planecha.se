import { vi } from 'vitest';

export const getEnv = vi.fn((key: keyof ImportMetaEnv): string | boolean | undefined => {
  return {
    VITE_BEACON_URL: 'ws://beacon:7878',
    VITE_TURN_URL: 'turn:domai.ne:1234',
    VITE_TURN_USER: 'fake_user',
    VITE_TURN_CRED: 'fake_cred',
  }[key];
});
