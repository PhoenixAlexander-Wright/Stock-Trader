
import { Server } from 'socket.io';
import handleEvents from './serverSocket/handleEvents.ts';
import _ from 'lodash';

export type Session = {
  id: string,
  prices: number[],
  priceTimes: number[],
  buyIndex: number,
  sellIndex: number,
  curIndex: number
  shouldPlay: boolean
  balance: number
  shares: number
};

type sessionMap = Record<string, Session>;
export const sessions: sessionMap = {};

export default function serverSocket(io: Server){
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    handleEvents(socket);

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      _.set(sessions,`${socket.id}`, undefined);
    });
  });
}