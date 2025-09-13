import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import os from 'os';

interface IConfig {
  token?: string;
  username?: string;
}

export class Config {
  static data: IConfig;
  static load() {
    if (existsSync(this.cfgPath)) {
      this.data = JSON.parse(readFileSync(this.cfgPath, 'utf-8'));
    } else {
      this.data = {};
    }
  }
  static set(key: keyof IConfig, value: string) {
    this.data[key] = value;
    this.save();
  }
  static get(key: keyof IConfig) {
    if (!this.data) this.load();
    return this.data[key];
  }
  static save() {
    writeFileSync(this.cfgPath, JSON.stringify(this.data, null, 2), 'utf-8');
  }
  static get cfgPath() {
    if (os.platform() === 'win32') {
      return resolve(process.env.APPDATA || '', 'fishpi', 'config.json');
    } else {
      return resolve(os.homedir(), '.config', 'fishpi', 'config.json');
    }
  }
}
