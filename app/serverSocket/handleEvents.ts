import { Socket } from "socket.io";
import _ from 'lodash';
import { sessions } from "../serverSocket.ts";
import progressTime from "./handleEvents/progressTime.ts";
import setPriceInfo from "./handleEvents/setPriceInfo.ts";

export const SERVER_EVENTS = {
  STOCK_PICK: 'STOCK_PICK',
  BUY: 'BUY',
  SELL: 'SELL',
  TOGGLE_PLAY: 'TOGGLE_PLAY',
};


export const CLIENT_EVENTS = {
  PRICE_DATA: 'PRICE_DATA',
  BALANCE_UPDATE: 'BALANCE_UPDATE',
};

export default function handleEvents(socket: Socket){
  socket.on(SERVER_EVENTS.STOCK_PICK, async (data) => {
    console.log('STOCK_PICK');
    await setPriceInfo(socket, data);
    await progressTime(socket);
  });

  socket.on(SERVER_EVENTS.BUY, async () => {
    console.log('BUY');
    const session = _.get(sessions, `${socket.id}`);
    const curPrice = _.get(session, `prices[${_.get(session,'curIndex',0)}]`);
    const curBalance = _.get(session, 'balance', 10000);
    const shares = _.round(curBalance / curPrice, 2);
    _.set(sessions,`${socket.id}.buyIndex`, _.get(sessions, `${socket.id}.curIndex`, 0));
    _.set(sessions,`${socket.id}.balance`, 0);
    _.set(sessions,`${socket.id}.shares`, shares);
    socket.emit(CLIENT_EVENTS.BALANCE_UPDATE, {shares, balance: 0 });
  });

  socket.on(SERVER_EVENTS.SELL, async () => {
    console.log('SELL');
    const session = _.get(sessions, `${socket.id}`);
    const curPrice = _.get(session, `prices[${_.get(session,'curIndex',0)}]`);
    const curShares = _.get(session, 'shares', 0);
    const balance = _.round(curShares * curPrice, 2);
    _.set(sessions,`${socket.id}.sellIndex`, _.get(sessions, `${socket.id}.curIndex`, 0));
    _.set(sessions,`${socket.id}.shares`, 0);
    _.set(sessions,`${socket.id}.balance`, balance);
    socket.emit(CLIENT_EVENTS.BALANCE_UPDATE, {balance, shares: 0 });
  });

  socket.on(SERVER_EVENTS.TOGGLE_PLAY, async () => {
    console.log('TOGGLE_PLAY');
    _.set(sessions,`${socket.id}.shouldPlay`, !_.get(sessions, `${socket.id}.shouldPlay`));
    await progressTime(socket);
  });
}
