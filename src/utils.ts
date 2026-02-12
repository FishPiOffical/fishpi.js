import { IMetal, Metal } from './';
import ws from 'ws';
import FormData from 'form-data';
import { EventEmitter as NodeEventEmitter } from 'events';

let domain = 'fishpi.cn';

function setDomain(d: string) {
  domain = d;
}

async function request(opt: any) {
  let { url, method = 'get', headers = {}, data } = opt;

  if (!isBrowse) {
    headers['User-Agent'] =
      `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36`;
    headers['Referer'] = `https://${domain}/`;
  }

  let body = undefined;

  if (data instanceof FormData) {
    body = data;
  } else {
    body = JSON.stringify(data);
  }

  let options: any = {
    method,
    headers,
    body,
  };

  let rsp: any;
  try {
    rsp = fetch(`https://${domain}/${url}`, options)
      .then((res: Response) => res.text())
      .then((res: string) => {
        try {
          return JSON.parse(res);
        } catch (err) {
          return res;
        }
      });
    return rsp;
  } catch (err) {
    if ((err as any).response.status === 401) {
      return (err as any).response;
    }
    throw err;
  }
}

function analyzeMetalAttr(m: any): Metal {
  if (!m) return m;
  if (typeof m.attr != 'string') return m;
  let attr = m.attr.split('&');
  let src = m.attr;
  m.attr = { src };
  attr.forEach((a: string) => (m.attr[a.split('=')[0]] = a.split('=')[1]));
  m.url = `https://${domain}/gen?txt=${m.description}&url=${m.attr.src}`;
  m.icon = `https://${domain}/gen?txt=&${m.attr.src}`;
  return m;
}

function toMetal(sysMetal: string): Metal[] {
  try {
    let metal: { list: Array<any> } = JSON.parse(sysMetal);
    metal.list.forEach((m, i, list) => {
      list[i] = analyzeMetalAttr(m);
    });
    return metal.list;
  } catch (error) {
    return [];
  }
}

function clientToVia(client: string) {
  if (!client) return;
  const via = client.split('/');
  return { client: via[0], version: via[1] };
}

const isBrowse = typeof window !== 'undefined';

const WebSocket = isBrowse ? window.WebSocket : ws.WebSocket;

// 浏览器兼容的 EventEmitter
class BrowserEventEmitter {
  public listeners: Map<string, Function[]> = new Map();

  on(event: string, listener: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
    return this;
  }

  off(event: string, listener: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  once(event: string, listener: Function) {
    const onceListener = (...args: any[]) => {
      this.off(event, onceListener);
      listener(...args);
    };
    this.on(event, onceListener);
    return this;
  }

  emit(event: string, ...args: any[]) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(...args));
    }
    return this;
  }

  removeAllListeners(event?: string) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    return this;
  }
}

const EventEmitter = isBrowse ? BrowserEventEmitter : NodeEventEmitter;

export {
  request,
  domain,
  toMetal,
  analyzeMetalAttr,
  isBrowse,
  setDomain,
  clientToVia,
  WebSocket,
  EventEmitter,
};
