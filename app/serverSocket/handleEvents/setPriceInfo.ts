import { Socket } from "socket.io";
import sample from './setPriceInfo/sample.json' with { type: 'json' };
import _ from 'lodash';
import { sessions } from "../../serverSocket.ts";

export default async function setPriceInfo(socket: Socket, stockTicker: string){
  try {
    const now = new Date();
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const formatDate = (date: Date) =>
      date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');

    const response = await fetch(
      `https://api.marketdata.app/v1/stocks/candles/D/${stockTicker}?from=${
        formatDate(yearAgo)}&to=${formatDate(now)}&token=${process.env['MARKET_DATA_TOKEN']}`
    );

    const data = await response.json();

    _.set(sessions, `${socket.id}.prices`, _.get(data, 'c', sample.c));
    _.set(sessions, `${socket.id}.priceTimes`, _.get(data, 't', sample.t));
    _.set(sessions, `${socket.id}.shouldPlay`, true);
  } catch(e){
    _.set(sessions, `${socket.id}.prices`, sample.c);
    _.set(sessions, `${socket.id}.priceTimes`, sample.t);
    _.set(sessions, `${socket.id}.shouldPlay`, true);
  }
}
