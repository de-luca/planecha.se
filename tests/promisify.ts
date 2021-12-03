export function promisify<T>(
  target: EventTarget,
  resolveEvent: string,
  errorEvent?: string,
): Promise<void | T> {
  return new Promise<void | T>(
    (resolve, reject) => {
      target.addEventListener(resolveEvent, ((event: Event | CustomEvent<T>) => {
        event instanceof CustomEvent ? resolve(event.detail) : resolve();
      }) as EventListener);

      if (errorEvent) {
        target.addEventListener(errorEvent, ((event: Event | CustomEvent<T>) => {
          event instanceof CustomEvent ? reject(event.detail) : reject();
        }) as EventListener);
      }
    }
  );
}
