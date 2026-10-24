
export const INITIAL_FINANCIAL_STATE = {
  cashBalance: 12450.00,
  portfolio: [
    { symbol: 'AAPL', shares: 10, avgPrice: 175.00 },
    { symbol: 'NVDA', shares: 5, avgPrice: 820.00 },
    { symbol: 'GOOGL', shares: 12, avgPrice: 145.00 },
  ],
  transactions: [],
};

function updatePortfolio(portfolio, { symbol, type, qty, price }) {
  const existingHolding = portfolio.find((holding) => holding.symbol === symbol);

  if (type === 'BUY') {
    if (!existingHolding) {
      return [...portfolio, { symbol, shares: qty, avgPrice: price }];
    }

    const newShares = existingHolding.shares + qty;
    const totalCost = qty * price;
    const newAveragePrice = (
      existingHolding.shares * existingHolding.avgPrice + totalCost
    ) / newShares;

    return portfolio.map((holding) => (
      holding.symbol === symbol
        ? { ...holding, shares: newShares, avgPrice: newAveragePrice }
        : holding
    ));
  }

  const remainingShares = existingHolding.shares - qty;
  if (remainingShares === 0) {
    return portfolio.filter((holding) => holding.symbol !== symbol);
  }

  return portfolio.map((holding) => (
    holding.symbol === symbol
      ? { ...holding, shares: remainingShares }
      : holding
  ));
}

export function financialReducer(state, action) {
  switch (action.type) {
    case 'RECORD_FUNDS_TRANSACTION': {
      const { mode, amount, transaction } = action.payload;
      const cashChange = mode === 'deposit' ? amount : -amount;

      return {
        ...state,
        cashBalance: state.cashBalance + cashChange,
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'EXECUTE_TRADE': {
      const { symbol, type, qty, price, transaction } = action.payload;
      const totalCost = qty * price;
      const cashChange = type === 'BUY' ? -totalCost : totalCost;

      return {
        ...state,
        cashBalance: state.cashBalance + cashChange,
        portfolio: updatePortfolio(state.portfolio, { symbol, type, qty, price }),
        transactions: [transaction, ...state.transactions],
      };
    }

    default:
      return state;
  }
}