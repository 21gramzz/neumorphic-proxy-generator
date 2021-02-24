import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import randomstring from 'randomstring';

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },
  on: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.on(channel, listener);
  },
  removeListener: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, listener);
  },
  randomString: (): string => {
    return randomstring.generate(32);
  },
});
