# Cribly

Cribly is a React + Vite stock-market dashboard with a futuristic
trading-terminal interface. It combines external market-data/news
integrations with a simulated portfolio and wallet.

## Features

-   Stock market overview with search and sector filtering.
-   Market quotes retrieved from Finnhub when configured, with demo
    fallback data where necessary.
-   Historical chart experience with provider/fallback behavior
    depending on data availability.
-   Stock-related news headlines from an external provider.
-   Simulated buy/sell trades, portfolio holdings, cash balance, and
    transaction history.
-   Simulated wallet deposits and withdrawals.
-   Currency selection and currency formatting across the interface.
-   Watchlist, dashboard market-breadth sentiment, and dark/light
    themes.
-   React Router navigation and reusable UI components.

> **Important:** Market data and news may be delayed, limited, or
> unavailable depending on the provider, API plan, symbol coverage, and
> rate limits. Demo fallback values are not real market quotes. Trading
> and wallet actions are simulations; the app does not connect to a bank
> or brokerage, place real orders, or transfer real money.

## Requirements

-   Node.js and npm
-   A Finnhub API token for Finnhub-backed quote/news features

## Run locally

1.  Open a terminal in the project root (the directory containing
    `package.json`).

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Create your local environment file by copying the example:

    ``` bash
    cp .env.example .env
    ```

    On Windows PowerShell, use:

    ``` powershell
    Copy-Item .env.example .env
    ```

4.  Open `.env` and set your API token:

    ``` env
    VITE_FINNHUB_API_KEY=your_finnhub_api_token
    ```

5.  Start the development server:

    ``` bash
    npm run dev
    ```

6.  Open the local address printed by Vite in your terminal.

After changing `.env`, restart the Vite development server.

## Available scripts

``` bash
npm run dev      # Start the Vite development server
npm run lint     # Run ESLint
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```

## Environment variables and API-key safety

-   `.env` is for your local machine and must not be committed to Git.

-   `.gitignore` excludes `.env` and other `.env.*` files while
    explicitly allowing `.env.example`.

-   Keep only a placeholder in `.env.example`, for example:

    ``` env
    VITE_FINNHUB_API_KEY=your_finnhub_api_token
    ```

-   Never put your real API token in `README.md`, source files,
    screenshots, or commits.

-   **Vite exposes variables prefixed with `VITE_` in the browser
    bundle.** That means a `VITE_FINNHUB_API_KEY` is visible to people
    who can inspect the client application. This setup is suitable for a
    coursework/demo project, not for protecting a secret in production.
    A production deployment should keep provider credentials on a server
    and proxy API requests through a backend.

If a real token has already been committed to a public repository, treat
it as exposed: regenerate/revoke it with the provider and remove it from
the repository history as appropriate.

## Project structure

``` text
src/
├── components/
│   ├── CurrencyContext.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── StockModal.jsx
│   ├── TickerBar.jsx
│   └── TradeModal.jsx
├── data/
│   └── initialStocks.js
├── pages/
│   ├── Dashboard.jsx
│   ├── History.jsx
│   ├── Login.jsx
│   ├── Market.jsx
│   ├── Portfolio.jsx
│   ├── Settings.jsx
│   └── Watchlist.jsx
├── reducers/
│   └── financialReducer.js
├── services/
│   └── marketApi.js
├── utils/
│   └── transactions.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

### Main responsibilities

-   `src/main.jsx`: React application entry point.
-   `src/App.jsx`: Application-level state, routes, and coordination
    between major features.
-   `src/reducers/financialReducer.js`: Groups related simulated
    financial-state transitions.
-   `src/services/marketApi.js`: External market quote, candle, and news
    requests.
-   `src/data/initialStocks.js`: Tracked stock metadata and demo
    fallback values.
-   `src/components/CurrencyContext.jsx`: Shared currency selection and
    formatting.
-   `src/components/StockModal.jsx`: Stock chart and trading interface.
-   `src/pages/`: Route-level screens.
-   `src/App.css` and `src/index.css`: Application and global styling,
    including theme styles.

## CE-2 coursework scope

The project is intended to demonstrate the React and API topics from the
CE-2 portion of the Front End Engineering-II syllabus, including form
handling, validation, reusable UI, modals/dropdowns, search and
filtering, REST API integration, loading/error handling, third-party API
usage, and data-management workflows. Verify each syllabus item against
the current code before claiming it is fully implemented; features may
be partial or require additional work.

## Troubleshooting

-   **Quotes/news do not load:** Check that `.env` contains a valid
    token, restart Vite, and check the browser console/network tab for
    provider errors or rate limits.
-   **Demo values appear:** The API may be unconfigured, unavailable,
    restricted for the requested symbol/endpoint, or over its request
    limit.
-   **Dependencies or Vite fail to start:** Run `npm install` from the
    project root using a supported Node.js version, then retry
    `npm run dev`.
-   **Changes to `.env` do not take effect:** Stop and restart the
    development server.
