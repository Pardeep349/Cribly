import { INITIAL_STOCKS } from '../data/initialStocks';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY?.trim();
const BASE_URL = 'https://finnhub.io/api/v1';


export async function fetchMarketStocks() {
  if (!API_KEY) {
    return {
      stocks: INITIAL_STOCKS,
      source: 'demo',
      message: 'Demo prices are shown. Add a Finnhub API key to load market quotes.',
    };
  }

  const results = await Promise.allSettled(
    INITIAL_STOCKS.map(async (stock) => {
      const response = await fetch(
        `${BASE_URL}/quote?symbol=${encodeURIComponent(stock.symbol)}&token=${encodeURIComponent(API_KEY)}`,
        { headers: { Accept: 'application/json' } },
      );

      if (!response.ok) {
        throw new Error(`Quote request failed for ${stock.symbol} (${response.status}).`);
      }

      const quote = await response.json();
      // Finnhub returns c=current, d=absolute change, dp=percent change,
      // pc=previous close. A zero current price usually means no quote.
      if (!Number.isFinite(quote.c) || quote.c <= 0) {
        throw new Error(`No quote is available for ${stock.symbol}.`);
      }

      return {
        ...stock,
        price: quote.c,
        change: Number.isFinite(quote.dp) ? Number(quote.dp.toFixed(2)) : stock.change,
        previousClose: Number.isFinite(quote.pc) ? quote.pc : undefined,
        quoteTimestamp: Number.isFinite(quote.t) ? quote.t * 1000 : Date.now(),
      };
    }),
  );

  const successfulStocks = results.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  );

  // Do not replace the whole market with demo data when only one quote fails.
  // Keep the last known/static quote for symbols that could not be fetched.
  const stockBySymbol = new Map(successfulStocks.map((stock) => [stock.symbol, stock]));
  const stocks = INITIAL_STOCKS.map((stock) => stockBySymbol.get(stock.symbol) ?? stock);
  const failedCount = results.length - successfulStocks.length;

  if (successfulStocks.length === 0) {
    throw new Error('No live quotes could be loaded. Check your API key, network, or provider limits.');
  }

  return {
    stocks,
    source: failedCount > 0 ? 'partial' : 'live',
    message: failedCount > 0
      ? `Live quotes loaded for ${successfulStocks.length} of ${INITIAL_STOCKS.length} symbols. Remaining symbols use fallback prices.`
      : 'Market quotes loaded from Finnhub.',
  };
}

/**
 * Fetch historical OHLCV candles. Yahoo Finance chart data is tried first because
 * Finnhub may restrict historical candles on some free accounts. Finnhub is the
 * fallback. These are market-data snapshots, not a WebSocket streaming feed.
 */
export async function fetchStockCandles(symbol, timeframe = '5D') {
  const nowMs = Date.now();
  const nowSeconds = Math.floor(nowMs / 1000);
  const ranges = {
    '1D': { yahooRange: '1d', interval: '5m', resolution: '5', seconds: 24 * 60 * 60 },
    '3D': { yahooRange: '5d', interval: '15m', resolution: '15', seconds: 3 * 24 * 60 * 60 },
    '5D': { yahooRange: '5d', interval: '15m', resolution: '15', seconds: 5 * 24 * 60 * 60 },
    '1M': { yahooRange: '1mo', interval: '60m', resolution: '60', seconds: 30 * 24 * 60 * 60 },
    '1Y': { yahooRange: '1y', interval: '1d', resolution: 'D', seconds: 365 * 24 * 60 * 60 },
    ALL: { yahooRange: '5y', interval: '1wk', resolution: 'W', seconds: 5 * 365 * 24 * 60 * 60 },
  };
  const range = ranges[timeframe] ?? ranges['5D'];
  let chartFailureReason = 'Chart data provider unavailable.';

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range.yahooRange}&interval=${range.interval}&includePrePost=false`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Yahoo chart request failed (${response.status}).`);
    const payload = await response.json();
    const result = payload?.chart?.result?.[0];
    const timestamps = result?.timestamp ?? [];
    const quote = result?.indicators?.quote?.[0];
    if (!quote || !timestamps.length) throw new Error('Yahoo returned no candle data for this symbol.');
    const candles = timestamps.map((time, index) => ({
      time: time * 1000,
      open: quote.open?.[index],
      high: quote.high?.[index],
      low: quote.low?.[index],
      close: quote.close?.[index],
      volume: quote.volume?.[index] ?? 0,
    })).filter((candle) => [candle.open, candle.high, candle.low, candle.close].every(Number.isFinite));
    if (!candles.length) throw new Error('Yahoo returned no usable candles.');
    return candles;
  } catch (error) {
    chartFailureReason = error instanceof Error ? error.message : chartFailureReason;
  }

  if (API_KEY) {
    const from = nowSeconds - range.seconds;
    const url = `${BASE_URL}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${range.resolution}&from=${from}&to=${nowSeconds}&token=${encodeURIComponent(API_KEY)}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (response.ok) {
      const payload = await response.json();
      if (payload.s === 'ok' && Array.isArray(payload.c) && payload.c.length) {
        return payload.c.map((close, index) => ({
          time: payload.t[index] * 1000,
          open: payload.o[index], high: payload.h[index], low: payload.l[index], close,
          volume: payload.v?.[index] ?? 0,
        })).filter((candle) => [candle.open, candle.high, candle.low, candle.close].every(Number.isFinite));
      }
    }
  }

  throw new Error(`${chartFailureReason} Finnhub historical candles may also be restricted by your plan or rate limits.`);
}

/** Fetch company-specific news for tracked stocks, never generic politics headlines. */
export async function fetchMarketNews(stocks = []) {
  if (!API_KEY) {
    return { articles: [], source: 'unavailable', message: 'Add your Finnhub API key to load stock-related news.' };
  }

  const knownStocks = stocks.length ? stocks : INITIAL_STOCKS;
  // Keep this list small to respect free-tier limits; the articles are still
  // company-specific and are labelled with the stock symbols they concern.
  const prioritySymbols = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'TSLA'];
  const symbols = prioritySymbols.filter((symbol) => knownStocks.some((stock) => stock.symbol === symbol)).slice(0, 6);
  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  const fromDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const from = fromDate.toISOString().slice(0, 10);
  const settled = await Promise.allSettled(symbols.map(async (symbol) => {
    const response = await fetch(`${BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${encodeURIComponent(API_KEY)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Company news request failed for ${symbol} (${response.status}).`);
    const payload = await response.json();
    if (!Array.isArray(payload)) return [];
    return payload.filter((item) => item.headline && item.url).map((item) => ({
      id: item.id ?? `${symbol}-${item.datetime}-${item.headline}`,
      headline: item.headline,
      summary: item.summary ?? '',
      source: item.source ?? 'Company news',
      url: item.url,
      image: item.image ?? '',
      datetime: Number(item.datetime) ? Number(item.datetime) * 1000 : null,
      related: symbol,
    }));
  }));

  const articles = settled.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
  const unique = [...new Map(articles.map((article) => [article.url, article])).values()]
    .sort((a, b) => (b.datetime ?? 0) - (a.datetime ?? 0))
    .slice(0, 12);

  if (!unique.length) {
    return { articles: [], source: 'unavailable', message: 'No stock-specific headlines are available from the provider right now.' };
  }
  return { articles: unique, source: 'live', message: 'Company-specific headlines for tracked stocks.', symbols };
}