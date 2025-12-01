import { describe, expect, it } from 'vitest';
import { arrayPrecision, getKlines, runNSFunctionWithArgs } from '../../utils';

import { Context, PineTS, Provider } from 'index';

async function runTAFunctionWithArgs(taFunction: string, ...args) {
    // Use the same dataset as the original tests for consistency
    const klines = await getKlines('BTCUSDT', '1h', 500, 0, 1736071200000 - 1);

    const result = await runNSFunctionWithArgs(klines, 'ta', taFunction, ...args);

    return result;
}

describe('Technical Analysis - Oscillators & Momentum', () => {
    it('CHANGE - Price Change', async () => {
        const result = await runTAFunctionWithArgs('change', 'close', 14);

        const part = result.values.reverse().slice(0, 10);
        const expected = [-514.06, -100.52, 252.51, 746.87, 701.04, 322.42, 214.91, 339.36, 234.14, 424.11];
        console.log(' CHANGE ', part);

        expect(part).toEqual(arrayPrecision(expected));
    });

    it('RSI - Relative Strength Index', async () => {
        const result = await runTAFunctionWithArgs('rsi', 'close', 14);

        const part = result.values.reverse().slice(0, 10);
        const expected = [
            40.42051518, 44.4602605765, 54.2984140824, 59.8046908557, 57.7926804941, 57.7604149786, 54.1294122804, 55.1559185358, 52.9779441078,
            55.1281063588,
        ];
        console.log(' RSI ', part);

        expect(part).toEqual(arrayPrecision(expected));
    });

    it('MOM - Momentum', async () => {
        const result = await runTAFunctionWithArgs('mom', 'close', 14);

        const part = result.values.reverse().slice(0, 10);
        const expected = [-514.06, -100.52, 252.51, 746.87, 701.04, 322.42, 214.91, 339.36, 234.14, 424.11];
        console.log(' MOM ', part);
        expect(part).toEqual(arrayPrecision(expected));
    });

    it('ROC - Rate of Change', async () => {
        const result = await runTAFunctionWithArgs('roc', 'close', 14);

        const part = result.values.reverse().slice(0, 10);
        const expected = [
            -0.5236626108, -0.1026116775, 0.2576205213, 0.7644164144, 0.7178525371, 0.3288824078, 0.2193562413, 0.3466814972, 0.2391883329,
            0.4336976676,
        ];
        console.log(' ROC ', part);
        expect(part).toEqual(arrayPrecision(expected));
    });

    it('MACD - Moving Average Convergence Divergence', async () => {
        const pineTS = new PineTS(Provider.Mock, 'BTCUSDC', 'W', null, new Date('2018-12-10').getTime(), new Date('2020-01-27').getTime());

        const sourceCode = (context) => {
            const { close, volume } = context.data;
            const { ta, plotchar } = context.pine;

            const [macdLine, signalLine, histLine] = ta.macd(close, 12, 26, 9);
            plotchar(macdLine, 'macdLine');
            plotchar(signalLine, 'signalLine');
            plotchar(histLine, 'histLine');

            return { macdLine, signalLine, histLine };
        };

        const { result, plots } = await pineTS.run(sourceCode);

        let macdLine_plotdata = plots['macdLine']?.data;
        let signalLine_plotdata = plots['signalLine']?.data;
        let histLine_plotdata = plots['histLine']?.data;
        const startDate = new Date('2019-05-20').getTime();
        const endDate = new Date('2019-09-16').getTime();
        //macdLine_plotdata = macdLine_plotdata.filter((e) => e.time >= startDate && e.time <= endDate);
        //signalLine_plotdata = signalLine_plotdata.filter((e) => e.time >= startDate && e.time <= endDate);
        //histLine_plotdata = histLine_plotdata.filter((e) => e.time >= startDate && e.time <= endDate);

        let plotdata_str = '';
        for (let i = 0; i < macdLine_plotdata.length; i++) {
            const time = macdLine_plotdata[i].time;
            if (time < startDate || time > endDate) {
                continue;
            }

            const str_time = new Date(time).toISOString().slice(0, -1) + '-00:00';
            const macdLine = macdLine_plotdata[i].value;
            const signalLine = signalLine_plotdata[i]?.value;
            const histLine = histLine_plotdata[i]?.value;
            plotdata_str += `[${str_time}]: ${macdLine} ${signalLine} ${histLine}\n`;
        }

        const expected_plot = `[2019-05-20T00:00:00.000-00:00]: NaN NaN NaN
[2019-05-27T00:00:00.000-00:00]: NaN NaN NaN
[2019-06-03T00:00:00.000-00:00]: 1752.0169161203 NaN NaN
[2019-06-10T00:00:00.000-00:00]: 1811.3480940478 NaN NaN
[2019-06-17T00:00:00.000-00:00]: 1985.5011469079 NaN NaN
[2019-06-24T00:00:00.000-00:00]: 2091.4758618621 NaN NaN
[2019-07-01T00:00:00.000-00:00]: 2209.0504007935 NaN NaN
[2019-07-08T00:00:00.000-00:00]: 2172.2277130526 NaN NaN
[2019-07-15T00:00:00.000-00:00]: 2151.2756048449 NaN NaN
[2019-07-22T00:00:00.000-00:00]: 2026.2380772765 NaN NaN
[2019-07-29T00:00:00.000-00:00]: 2019.987956506 2024.3468634902 -4.3589069842
[2019-08-05T00:00:00.000-00:00]: 2037.1625005576 2026.9099909037 10.2525096539
[2019-08-12T00:00:00.000-00:00]: 1929.8543228139 2007.4988572857 -77.6445344718
[2019-08-19T00:00:00.000-00:00]: 1809.4157867148 1967.8822431715 -158.4664564567
[2019-08-26T00:00:00.000-00:00]: 1664.2955001788 1907.164894573 -242.8693943942
[2019-09-02T00:00:00.000-00:00]: 1582.6611389307 1842.2641434445 -259.6030045138
[2019-09-09T00:00:00.000-00:00]: 1494.0231506146 1772.6159448785 -278.5927942639
[2019-09-16T00:00:00.000-00:00]: 1384.4838361149 1694.9895231258 -310.5056870109`;

        console.log('expected_plot', expected_plot);
        console.log('plotdata_str', plotdata_str);
        expect(plotdata_str.trim()).toEqual(expected_plot.trim());
    });
});
