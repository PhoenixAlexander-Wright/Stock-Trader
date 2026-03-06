# Stock Trader
This is a basic application utilizing [Next.js](https://nextjs.org), [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) (via [Socket.IO](https://socket.io)), and the [MarketData.app API](https://www.marketdata.app/docs/) to gamble with fake money using a stock’s past year of daily price movement. Simply enter a stock’s ticker symbol and start buying and selling to make (or lose) money.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
1. Optionally acquire a marketdata.app API token. If you don’t, it will use sample data.
1. Install dependencies via `pnpm i`
1. run the dev server with API token passed placed in .env file or in the run command like so: `MARKET_DATA_TOKEN=TOKEN_GOES_HERE pnpm dev`
1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Known Limitations
1. The server keeps track of progress via the socket ID, so disconnections lose state. An easy fix would be to create an ID and store it on the client so it can resync.
1. Session state is stored as an in‑memory object with no persistence, so progress is lost when the server shuts down. Adding a database or similar storage would resolve this.

## Furture Improvements
1.  Showing your current profit and loss before selling
1. Displaying a list of all your previous trades
1. Adding speed controls for slowing down or speeding up the chart
1. Implementing a better chart that displays full candlesticks instead of just closing prices
1. Add statistics like your best and worst trade
1. A pretter and more robust UI

