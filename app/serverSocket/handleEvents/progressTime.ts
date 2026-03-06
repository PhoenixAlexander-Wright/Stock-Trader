import { Socket } from "socket.io";
import _ from 'lodash';
import { sessions } from "../../serverSocket.ts";
import { CLIENT_EVENTS } from "../handleEvents.ts";

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export default async function progressTime(socket: Socket){
  const session = _.get(sessions, socket.id);
  if(!session?.prices){
    return;
  }

  let i = _.defaultTo(session.curIndex, 0);
  while(i < session.prices.length && session.shouldPlay && socket.connected){
    socket.emit(CLIENT_EVENTS.PRICE_DATA, {price: session.prices[i], timestamp: session.priceTimes[i]});
    console.log('emitted price', session.prices[i]);
    i++;
    _.set(sessions, `${socket.id}.curIndex`, i);
    await sleep(1000);
  }
}
