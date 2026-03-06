"use client";
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { io } from "socket.io-client";
import LiveChart from './live-chart';
import { CLIENT_EVENTS, SERVER_EVENTS } from './serverSocket/handleEvents.ts';

export const socket = io();

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const [socketReady, setSocketReady] = useState(false);
  const [stock, setStock] = useState('');
  const [stockPicked, setStockPicked] = useState(false);
  const [bought, setBought] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState({balance: 10000, shares: 0});

  useEffect(() => {
    socketRef.current = socket;
    socketRef.current.on('connect', () => {
      setSocketReady(true);
      console.log('Connected to server');
    });

    socketRef.current.on(CLIENT_EVENTS.BALANCE_UPDATE, (payload) => {
      setBalanceInfo(payload);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendEvent = (type:string, content: unknown = {}) => {
    if (socketRef.current) {
      socketRef.current.emit(type, content);
    }
  };

  return (
    <div className="p-8 mx-auto ">
      <div className="grid grid-cols-12 gap-4">
        <h1 className="text-2xl font-bold mb-4 col-span-3">Stock Trader</h1>
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-2 w-full mb-2 col-span-3"
          placeholder="Enter stock symbol (ex: APPL, GOOG, NVDA, AMD)"
          disabled={stockPicked}
        />
        <button
          onClick={() => {
            sendEvent(SERVER_EVENTS.STOCK_PICK,stock);
            setStockPicked(true);
            setPlaying(true);
          }}
          disabled={stockPicked}
          className="bg-blue-500 text-white px-2 py-2 rounded w-full col-span-2"
        >
          Select
        </button>
      </div>
      <LiveChart socketRef={socketRef} socketReady={socketReady}/>
      <div className="grid grid-cols-12 gap-4">
        <p className='col-span-2 font-bold text-xl '>
          <span className="block">Balance:</span>
          <span className="block">${balanceInfo.balance}</span>
        </p>
        <p className='col-span-2 font-bold text-xl '>
          <span className="block">Shares:</span>
          <span className="block">{balanceInfo.shares}</span>
        </p>
        <button
          onClick={() => {
            sendEvent(bought ? SERVER_EVENTS.SELL : SERVER_EVENTS.BUY);
            setBought(!bought);
          }}
          disabled={!stockPicked}
          className={`${bought ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded w-full col-span-2`}
        >
          {bought ? 'SELL' : 'BUY'}
        </button>
        <button
          onClick={() => {
            sendEvent(SERVER_EVENTS.TOGGLE_PLAY);
            setPlaying(!playing);
          }}
          disabled={!stockPicked}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full col-span-2"
        >
          {playing ? 'Pause' : 'Resume'}
        </button>
      </div>
    </div>
  );
}
