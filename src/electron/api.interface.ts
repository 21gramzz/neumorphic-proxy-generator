import { IpcRendererEvent } from 'electron';

declare global {
  interface Window {
    api: API;
  }
}

export default interface API {
  send: (channel: string, ...args: any[]) => void;
  on: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => void;
  removeListener: (channel: string, listener: (...args: any[]) => void) => void;
  removeAllListeners: (channel: string) => void;
  randomString: () => string;
}
