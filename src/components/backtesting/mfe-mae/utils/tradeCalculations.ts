
import { Trade } from "@/types/trade";

export const calculateMaeRelativeToSl = (
  entryPrice: number,
  stopLoss: number,
  highestPrice: number,
  lowestPrice: number,
  isLong: boolean
): number => {
  const maeRelativeToSl = isLong 
    ? ((lowestPrice - entryPrice) / (stopLoss - entryPrice)) * 100
    : ((highestPrice - entryPrice) / (stopLoss - entryPrice)) * 100;
  
  return -Math.abs(maeRelativeToSl);
};

export const calculateMfeRelativeToTp = (
  entryPrice: number,
  takeProfit: number,
  highestPrice: number,
  lowestPrice: number,
  isLongForTp: boolean
): number => {
  return isLongForTp 
    ? ((highestPrice - entryPrice) / (takeProfit - entryPrice)) * 100
    : ((entryPrice - lowestPrice) / (entryPrice - takeProfit)) * 100;
};

export const calculateRMultiple = (
  entryPrice: number,
  takeProfit: number,
  stopLoss: number
): number => {
  return Math.abs(entryPrice - takeProfit) / Math.abs(entryPrice - stopLoss);
};

export const processTrade = (trade: Trade) => {
  if (
    !trade.highestPrice ||
    !trade.lowestPrice ||
    !trade.entryPrice ||
    !trade.takeProfit ||
    !trade.stopLoss ||
    !trade.id
  ) {
    return null;
  }

  const entryPrice = Number(trade.entryPrice);
  const highestPrice = Number(trade.highestPrice);
  const lowestPrice = Number(trade.lowestPrice);
  const takeProfit = Number(trade.takeProfit);
  const stopLoss = Number(trade.stopLoss);
  
  const isLong = stopLoss < entryPrice;
  const isLongForTp = takeProfit > entryPrice;

  const maeRelativeToSl = calculateMaeRelativeToSl(
    entryPrice,
    stopLoss,
    highestPrice,
    lowestPrice,
    isLong
  );

  const mfeRelativeToTp = calculateMfeRelativeToTp(
    entryPrice,
    takeProfit,
    highestPrice,
    lowestPrice,
    isLongForTp
  );

  const rMultiple = calculateRMultiple(entryPrice, takeProfit, stopLoss);

  return {
    id: trade.id,
    mfeRelativeToTp,
    maeRelativeToSl,
    instrument: trade.instrument,
    rMultiple
  };
};
