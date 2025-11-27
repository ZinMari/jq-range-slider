export default function updateFunction<TEvents extends Record<string, unknown>>(
  handlersGetter: () => { [K in keyof TEvents]: (data: TEvents[K]) => void },
) {
  return <K extends keyof TEvents>(typeEvent: K, data: TEvents[K]): void => {
    const handler = handlersGetter()[typeEvent];
    handler(data);
  };
}
