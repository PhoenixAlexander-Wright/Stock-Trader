"use client";
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { CLIENT_EVENTS } from './serverSocket/handleEvents';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend
);

type Point = { x: number | string; y: number };

interface SocketComponentProps {
  socketRef: React.RefObject<Socket | null>;
  socketReady: boolean
}

export default function LiveChart({socketRef}: SocketComponentProps) {
  const [dataPoints, setDataPoints] = useState<Point[]>([]);
  useEffect(() => {
    if (!socketRef.current) {
      return;
    }
    socketRef.current.on(CLIENT_EVENTS.PRICE_DATA, (payload: { price: number; timestamp: number }) => {
      const date = new Date(payload.timestamp * 1000);
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      setDataPoints(prev => {
        const next = [
          ...prev,
          {
            x: dateStr,
            y: payload.price,
          },
        ];
        return next;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef.current]);

  const chartData = {
    datasets: [
      {
        label: "Price",
        data: dataPoints,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    animation: false,
    responsive: true,
    scales: {
      x: {
        type: "category",
        ticks: {
          color: "white",
          autoSkip: true,
          maxTicksLimit: 10
        },
      },
      y: {
        beginAtZero: false,
        ticks: { color: 'white' }
      },
    },
    plugins: { legend: { display: false }, },
  };

  return (
    <div className='w-full h-100 overflow-hidden'>
      <div className="relative w-full h-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
