import { SSHClient, SSHClientOptions } from './ts/proxy-generator';
import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron';
import path from 'path';
import log from 'electron-log';
import { promises as fs } from 'fs';

let mainWindow: BrowserWindow;
let taskQue: SSHClient[] = [];

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    backgroundColor: '#eef0f4',
    useContentSize: true,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, './preload.js'),
    },
  });
  mainWindow.loadFile(path.join(__dirname, './index.html'));
  // mainWindow.webContents.openDevTools();
  // windowが完全にロードされてから表示する
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    app.quit();
  });
};

// 各タスクのイベントを登録して起動
const initTask = (task: SSHClient) => {
  task.on('updateStatus', (newStatus: string) => {
    // レンダラープロセス(React)側にイベントを伝搬する
    mainWindow.webContents.send('updateStatus' + task.id, newStatus);
  });
  task.on('error', (err: Error) => {
    // https://github.com/megahertz/electron-log#readme
    log.error(err);
  });
  task.startTask();
};

// ipc event listener

ipcMain.on(
  'exportTask',
  async (event: IpcMainEvent, tasks: SSHClientOptions[]) => {
    const currentWindow = BrowserWindow.getFocusedWindow();
    if (currentWindow && 0 < tasks.length) {
      const data = await dialog.showSaveDialog(currentWindow, {
        title: 'Export Task',
        filters: [{ name: 'Text File', extensions: ['txt'] }],
      });
      if (!data.canceled && data.filePath) {
        let taskText = '';
        tasks.forEach(task => {
          taskText += `${task.host}:${task.proxyPort}:${task.proxyUser}:${task.proxyPassword}\n`;
        });
        await fs.writeFile(data.filePath, taskText);
      }
    }
  },
);

ipcMain.on('startAll', (event: IpcMainEvent, tasks: SSHClientOptions[]) => {
  tasks.forEach(task => {
    const target = taskQue.find(t => t.id === task.id);
    if (target === undefined) {
      taskQue.push(new SSHClient(task));
    }
  });
  taskQue.forEach(task => {
    initTask(task);
  });
});

ipcMain.on('stopAll', () => {
  taskQue.forEach(task => {
    task.stop();
  });
  taskQue = [];
});

ipcMain.on('start', (event: IpcMainEvent, task: SSHClientOptions) => {
  const target = taskQue.find(t => t.id === task.id);
  if (target === undefined) {
    taskQue.push(new SSHClient(task));
  }
  taskQue.forEach(task => {
    initTask(task);
  });
});

ipcMain.on('stop', (event: IpcMainEvent, id: string) => {
  if (taskQue.length > 0) {
    taskQue.forEach((t, i) => {
      if (t.id === id) {
        t.stop();
        taskQue.splice(i, 1);
      }
    });
  }
});

ipcMain.on('maximizeWindow', () => {
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

ipcMain.on('minimizeWindow', () => {
  mainWindow.minimize();
});

ipcMain.on('closeWindow', () => {
  mainWindow.close();
});

app.on('ready', () => {
  createMainWindow();
});
