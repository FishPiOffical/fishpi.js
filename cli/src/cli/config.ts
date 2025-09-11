import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const cfgPath = resolve(__dirname, 'config.json');
interface IConfig {
  token?: string;
  username?: string;
}

export class Config {
  static data: IConfig;
  static load() {
    console.log(cfgPath);
    if (existsSync(cfgPath)) {
      this.data = JSON.parse(readFileSync(cfgPath, 'utf-8'));
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
    writeFileSync(cfgPath, JSON.stringify(this.data, null, 2), 'utf-8');
  }
}
