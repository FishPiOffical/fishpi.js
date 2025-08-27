import { IMetal, Metal } from './';
import ws from 'ws';
import FormData from 'form-data';

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

function toMetal(sysMetal: string): IMetal[] {
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

export { request, domain, toMetal, analyzeMetalAttr, isBrowse, setDomain, clientToVia, WebSocket };
