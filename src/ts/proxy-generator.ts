/* eslint-disable require-jsdoc */
import { EventEmitter } from 'events';
import { Config, NodeSSH } from 'node-ssh';
import path from 'path';

export interface SSHClientOptions {
  id: string;
  server: string;
  host: string;
  port: number;
  user: string;
  password: string;
  privateKey: string;
  proxyPort: number;
  proxyUser: string;
  proxyPassword: string;
}

export class SSHClient extends EventEmitter {
  server: string;
  id: string;
  host: string;
  port: number;
  user: string;
  password: string;
  privateKey: string;
  proxyUser: string;
  proxyPort: number;
  proxyPassword: string;
  stopped: boolean;
  client: NodeSSH;
  sudo: string;
  constructor(task: SSHClientOptions) {
    super();
    this.id = task.id;
    this.server = task.server;
    this.host = task.host;
    this.port = task.port;
    this.user = task.user;
    this.password = task.password;
    this.privateKey = task.privateKey;
    this.proxyPort = task.proxyPort;
    this.proxyUser = task.proxyUser;
    this.proxyPassword = task.proxyPassword;
    this.client = new NodeSSH();
    this.sudo = this.server === 'indigo' ? 'sudo ' : '';
    this.stopped = true;
  }

  stop(): void {
    this.updateStatus('Inactive');
    this.stopped = true;
  }

  updateStatus(newStatus: string): void {
    if (this.stopped) return;
    this.emit('updateStatus', newStatus);
  }

  async startTask(): Promise<void> {
    if (!this.stopped) return;
    else this.stopped = false;
    this.updateStatus('In Progress');
    try {
      await this.createSession();
      await this.installPackage();
      await this.putConfigFile();
      await this.createUser();
      await this.startSquid();
    } catch (err) {
      this.updateStatus('Failed');
      this.emit('error', err);
    }
    await this.closeSession();
  }

  async createSession(): Promise<void> {
    if (this.stopped) return;
    const options: Config = {
      host: this.host,
      port: this.port,
      username: this.user,
    };

    if (this.privateKey !== '') options.privateKey = this.privateKey;
    if (this.password !== '') options.password = this.password;
    await this.client.connect(options);
  }

  async closeSession(): Promise<void> {
    this.client.dispose();
  }

  async putConfigFile(): Promise<void> {
    if (this.stopped) return;
    let res = await this.client.execCommand(
      `${this.sudo}chown ${this.user} /etc/squid/squid.conf`,
    );
    await this.client.putFile(
      path
        .join(__dirname, '../../squid/squid.conf')
        .replace('app.asar', 'app.asar.unpacked'),
      '/etc/squid/squid.conf',
    );
    res = await this.client.execCommand(
      `${this.sudo}sed -i -e "/^ *http_port 3128/c\  http_port ${this.proxyPort}" /etc/squid/squid.conf`,
    );
    if (res.stderr !== '') {
      throw new Error('Failed to write the configuration file');
    }
  }

  async installPackage(): Promise<void> {
    if (this.stopped) return;
    const res = await this.client.execCommand(
      `${this.sudo}yum -y install squid httpd`,
    );
    if (res.stderr !== '' && !res.stderr.includes('Warning')) {
      throw new Error('Installation failed');
    }
  }

  async createUser(): Promise<void> {
    if (this.stopped) return;
    const res = await this.client.execCommand(
      `${this.sudo}htpasswd -c /etc/squid/.htpasswd ${this.proxyUser}`,
      {
        stdin: this.proxyPassword + '\n' + this.proxyPassword + '\n',
      },
    );
    if (res.stderr !== '' && !res.stderr.includes('Adding password for user')) {
      throw new Error('Failed to create user');
    }
  }

  async startSquid(): Promise<void> {
    if (this.stopped) return;
    await this.client.execCommand(`${this.sudo}systemctl stop firewalld`);
    await this.client.execCommand(`${this.sudo}chkconfig squid on`);
    const res = await this.client.execCommand(
      `${this.sudo}systemctl start squid`,
    );
    if (res.stderr !== '') {
      throw new Error('Failed to start Squid');
    } else {
      this.updateStatus('Completed');
    }
  }
}
