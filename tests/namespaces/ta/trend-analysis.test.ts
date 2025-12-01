import { describe, expect, it } from 'vitest';
import { arrayPrecision, getKlines, runNSFunctionWithArgs } from '../../utils';

import { Context, PineTS, Provider } from 'index';

async function runTAFunctionWithArgs(taFunction: string, ...args) {
    // Use the same dataset as the original tests for consistency
    const klines = await getKlines('BTCUSDT', '1h', 500, 0, 1736071200000 - 1);

    const result = await runNSFunctionWithArgs(klines, 'ta', taFunction, ...args);

    return result;
}

describe('Technical Analysis - Trend Analysis', () => {
    it('SUPERTREND - Supertrend Indicator', async () => {
        const result = await runTAFunctionWithArgs('supertrend', 3, 14);

        const part = result.values.reverse().slice(0, 10);
        // Supertrend returns tuple [value, direction]
        const expected = [
            [97485.7776916368, 1],
            [97485.7776916368, 1],
            [97485.7776916368, 1],
            [97485.7776916368, 1],
            [97440.2890525319, 1],
            [97420.5262056875, 1],
            [97420.5262056875, 1],
            [97420.5262056875, 1],
            [97420.5262056875, 1],
            [97420.5262056875, 1],
        ];
        console.log(' SUPERTREND ', part);
        expect(part.length).toBe(10);
        expect(part.every((v, i) => Array.isArray(v) && v.length === 2 && Math.abs(v[0] - expected[i][0]) < 0.01 && v[1] === expected[i][1])).toBe(
            true
        );
    });

    it('CROSSOVER - Crossover Detection', async () => {
        // Crossover returns a boolean per bar, need to collect it over time
        //const klines = await getKlines('BTCUSDT', '1d', 50, 0, 1761350400000 - 1);
        //const pineTS = new PineTS(klines);
        const pineTS = new PineTS(Provider.Binance, 'BTCUSDT', 'D', null, new Date('2025-10-29').getTime(), new Date('2025-11-20').getTime());

        const sourceCode = (context: Context) => {
            const { close, open } = context.data;
            const ta = context.ta;
            const { plot, plotchar } = context.core;
            const ema9 = ta.ema(close, 9);
            const ema18 = ta.ema(close, 18);

            const crossover = ta.crossover(close, open);
            plotchar(crossover, 'crossover');
            return { crossover };
        };

        const { result, plots } = await pineTS.run(sourceCode);

        const plotdata = plots['crossover'].data;

        plotdata.forEach((e) => {
            e.time = new Date(e.time).toISOString().slice(0, -1) + '-00:00';

            delete e.options;
        });
        const plotdata_str = plotdata.map((e) => `[${e.time}]: ${e.value}`).join('\n');

        const expected_plot = `[2025-10-29T00:00:00.000-00:00]: false
[2025-10-30T00:00:00.000-00:00]: false
[2025-10-31T00:00:00.000-00:00]: true
[2025-11-01T00:00:00.000-00:00]: false
[2025-11-02T00:00:00.000-00:00]: false
[2025-11-03T00:00:00.000-00:00]: false
[2025-11-04T00:00:00.000-00:00]: false
[2025-11-05T00:00:00.000-00:00]: true
[2025-11-06T00:00:00.000-00:00]: false
[2025-11-07T00:00:00.000-00:00]: true
[2025-11-08T00:00:00.000-00:00]: false
[2025-11-09T00:00:00.000-00:00]: true
[2025-11-10T00:00:00.000-00:00]: false
[2025-11-11T00:00:00.000-00:00]: false
[2025-11-12T00:00:00.000-00:00]: false
[2025-11-13T00:00:00.000-00:00]: false
[2025-11-14T00:00:00.000-00:00]: false
[2025-11-15T00:00:00.000-00:00]: true
[2025-11-16T00:00:00.000-00:00]: false
[2025-11-17T00:00:00.000-00:00]: false
[2025-11-18T00:00:00.000-00:00]: true
[2025-11-19T00:00:00.000-00:00]: false
[2025-11-20T00:00:00.000-00:00]: false`;

        expect(plotdata_str.trim()).toEqual(expected_plot.trim());
        //const part = result.crossover ? result.crossover.reverse() : [];

        //console.log(' CROSSOVER ', part);
        //expect(part).toBeDefined();
        //expect(part.length).toBe(50);
        //expect(part.every((v) => typeof v === 'boolean')).toBe(true);
    });

    it('CROSSUNDER - Crossunder Detection', async () => {
        // Crossunder returns a boolean per bar, need to collect it over time

        const pineTS = new PineTS(Provider.Binance, 'BTCUSDT', 'D', null, new Date('2025-10-29').getTime(), new Date('2025-11-20').getTime());

        const sourceCode = (context) => {
            const { close, open } = context.data;
            const ta = context.ta;
            const { plotchar } = context.core;
            const crossunder = ta.crossunder(close, open);
            plotchar(crossunder, 'crossunder');

            return { crossunder };
        };

        const { result, plots } = await pineTS.run(sourceCode);

        const plotdata = plots['crossunder']?.data;

        plotdata.forEach((e) => {
            e.time = new Date(e.time).toISOString().slice(0, -1) + '-00:00';

            delete e.options;
        });
        const plotdata_str = plotdata.map((e) => `[${e.time}]: ${e.value}`).join('\n');

        const expected_plot = `[2025-10-29T00:00:00.000-00:00]: false
[2025-10-30T00:00:00.000-00:00]: false
[2025-10-31T00:00:00.000-00:00]: false
[2025-11-01T00:00:00.000-00:00]: false
[2025-11-02T00:00:00.000-00:00]: false
[2025-11-03T00:00:00.000-00:00]: true
[2025-11-04T00:00:00.000-00:00]: false
[2025-11-05T00:00:00.000-00:00]: false
[2025-11-06T00:00:00.000-00:00]: true
[2025-11-07T00:00:00.000-00:00]: false
[2025-11-08T00:00:00.000-00:00]: true
[2025-11-09T00:00:00.000-00:00]: false
[2025-11-10T00:00:00.000-00:00]: false
[2025-11-11T00:00:00.000-00:00]: true
[2025-11-12T00:00:00.000-00:00]: false
[2025-11-13T00:00:00.000-00:00]: false
[2025-11-14T00:00:00.000-00:00]: false
[2025-11-15T00:00:00.000-00:00]: false
[2025-11-16T00:00:00.000-00:00]: true
[2025-11-17T00:00:00.000-00:00]: false
[2025-11-18T00:00:00.000-00:00]: false
[2025-11-19T00:00:00.000-00:00]: true
[2025-11-20T00:00:00.000-00:00]: false`;

        expect(plotdata_str.trim()).toEqual(expected_plot.trim());
    });
});

