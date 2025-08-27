import { existsSync, readFileSync, writeFileSync } from 'fs';

interface IConfig {
  token?: string;
  username?: string;
}

export class Config {
  static data: IConfig;
  static load() {
    if (existsSync('./config.json')) {
      this.data = JSON.parse(readFileSync('./config.json', 'utf-8'));
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
    writeFileSync('./config.json', JSON.stringify(this.data, null, 2), 'utf-8');
  }
}
