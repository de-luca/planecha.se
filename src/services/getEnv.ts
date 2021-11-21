export function getEnv(key: keyof ImportMetaEnv): string | boolean | undefined {
  return import.meta.env[key];
}
