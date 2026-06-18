'use client';

import { useMemo } from 'react';
import { Candle, IndicatorsState } from '../types';
import { calculateRSI } from '../lib/indicators/rsi';
import { calculateMACD } from '../lib/indicators/macd';
import { calculateEMA } from '../lib/indicators/ema';
import { calculateBollingerBands } from '../lib/indicators/bollinger';
import { calculateStochastic } from '../lib/indicators/stochastic';
import { calculateATR } from '../lib/indicators/atr';
import { calculateVWAP } from '../lib/indicators/vwap';
import { calculateADX } from '../lib/indicators/adx';
import { calculateChoppiness } from '../lib/indicators/choppiness';

/**
 * Hook that computes standard technical indicator lines over candlelight arrays.
 */
export function useTechnicalAnalysis(candles: Candle[]): IndicatorsState {
  return useMemo(() => {
    const length = candles.length;
    if (length === 0) {
      return {
        rsi: [],
        macd: [],
        ema20: [],
        ema50: [],
        ema200: [],
        bb: [],
        stoch: [],
        atr: [],
        vwap: [],
        adx: [],
        choppiness: [],
      };
    }

    const closes = candles.map(c => c.close);
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const volumes = candles.map(c => c.volume);

    const rsi = calculateRSI(closes, 14);
    const macd = calculateMACD(closes, 12, 26, 9);
    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    const ema200 = calculateEMA(closes, 200);
    const bb = calculateBollingerBands(closes, 20, 2);
    const stoch = calculateStochastic(highs, lows, closes, 14, 3, 3);
    const atr = calculateATR(highs, lows, closes, 14);
    const vwap = calculateVWAP(highs, lows, closes, volumes);
    const adx = calculateADX(highs, lows, closes, 14);
    const choppiness = calculateChoppiness(highs, lows, closes, 14);

    return {
      rsi,
      macd,
      ema20,
      ema50,
      ema200,
      bb,
      stoch,
      atr,
      vwap,
      adx,
      choppiness,
    };
  }, [candles]);
}
