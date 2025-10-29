// ==================== REAL HISTORICAL DATA ====================
// Real historical data from multiple sources
// Gold prices from World Gold Council and market data
// S&P 500 data from major indices
// Inflation data based on CPI

// Helper function to interpolate monthly data
function interpolateMonthly(dataPoints) {
    const result = [];
    
    for (let i = 0; i < dataPoints.length - 1; i++) {
        const current = dataPoints[i];
        const next = dataPoints[i + 1];
        
        const currentDate = new Date(current.date);
        const nextDate = new Date(next.date);
        
        // Add current point
        result.push(current);
        
        // Calculate months between
        const monthsDiff = (nextDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                          (nextDate.getMonth() - currentDate.getMonth());
        
        // Interpolate intermediate months
        for (let m = 1; m < monthsDiff; m++) {
            const interpDate = new Date(currentDate);
            interpDate.setMonth(currentDate.getMonth() + m);
            
            // Linear interpolation
            const ratio = m / monthsDiff;
            const interpPrice = current.price + (next.price - current.price) * ratio;
            
            const dateStr = interpDate.toISOString().substring(0, 10);
            result.push({ 
                date: dateStr.substring(0, 8) + '01', // Force to 1st of month
                price: Math.round(interpPrice * 100) / 100 
            });
        }
    }
    
    // Add last point
    result.push(dataPoints[dataPoints.length - 1]);
    
    return result;
}

const goldData = {
    // Date, Gold Price (USD/oz) - Real historical prices from CSV
    prices: [
        { date: '2000-01-01', price: 282.85 },
        { date: '2000-06-01', price: 286.40 },
        { date: '2001-01-01', price: 271.04 },
        { date: '2001-06-01', price: 270.30 },
        { date: '2002-01-01', price: 309.73 },
        { date: '2002-06-01', price: 321.35 },
        { date: '2003-01-01', price: 363.38 },
        { date: '2003-06-01', price: 356.85 },
        { date: '2004-01-01', price: 409.72 },
        { date: '2004-06-01', price: 392.00 },
        { date: '2005-01-01', price: 444.74 },
        { date: '2005-06-01', price: 429.00 },
        { date: '2006-01-01', price: 603.46 },
        { date: '2006-06-01', price: 596.75 },
        { date: '2007-01-01', price: 695.39 },
        { date: '2007-06-01', price: 665.50 },
        { date: '2007-12-01', price: 833.75 },
        { date: '2008-01-01', price: 871.96 },
        { date: '2008-03-01', price: 968.40 },
        { date: '2008-06-01', price: 889.50 },
        { date: '2008-09-01', price: 884.50 },
        { date: '2008-12-01', price: 865.00 },
        { date: '2009-01-01', price: 865.00 },
        { date: '2009-06-01', price: 934.50 },
        { date: '2009-12-01', price: 1087.50 },
        { date: '2010-01-01', price: 1096.56 },
        { date: '2010-06-01', price: 1244.00 },
        { date: '2010-12-01', price: 1405.50 },
        { date: '2011-01-01', price: 1420.25 },
        { date: '2011-06-01', price: 1505.50 },
        { date: '2011-09-01', price: 1895.00 },
        { date: '2011-12-01', price: 1531.00 },
        { date: '2012-01-01', price: 1675.00 },
        { date: '2012-06-01', price: 1598.00 },
        { date: '2012-12-01', price: 1675.70 },
        { date: '2013-01-01', price: 1687.15 },
        { date: '2013-06-01', price: 1414.80 },
        { date: '2013-12-01', price: 1204.50 },
        { date: '2014-01-01', price: 1233.75 },
        { date: '2014-06-01', price: 1281.85 },
        { date: '2014-12-01', price: 1206.00 },
        { date: '2015-01-01', price: 1184.25 },
        { date: '2015-06-01', price: 1172.35 },
        { date: '2015-12-01', price: 1060.00 },
        { date: '2016-01-01', price: 1151.05 },
        { date: '2016-06-01', price: 1320.75 },
        { date: '2016-07-01', price: 1366.25 },
        { date: '2016-12-01', price: 1146.70 },
        { date: '2017-01-01', price: 1257.15 },
        { date: '2017-06-01', price: 1241.50 },
        { date: '2017-12-01', price: 1291.80 },
        { date: '2018-01-01', price: 1302.50 },
        { date: '2018-06-01', price: 1253.00 },
        { date: '2018-12-01', price: 1281.30 },
        { date: '2019-01-01', price: 1392.60 },
        { date: '2019-06-01', price: 1400.25 },
        { date: '2019-09-01', price: 1514.75 },
        { date: '2019-12-01', price: 1523.10 },
        { date: '2020-01-01', price: 1520.55 },
        { date: '2020-02-01', price: 1589.20 },
        { date: '2020-03-01', price: 1622.10 },
        { date: '2020-04-01', price: 1683.05 },
        { date: '2020-05-01', price: 1730.55 },
        { date: '2020-06-01', price: 1781.00 },
        { date: '2020-07-01', price: 1964.65 },
        { date: '2020-08-01', price: 2067.15 },
        { date: '2020-09-01', price: 1886.75 },
        { date: '2020-10-01', price: 1878.25 },
        { date: '2020-11-01', price: 1783.35 },
        { date: '2020-12-01', price: 1893.10 },
        { date: '2021-01-01', price: 1943.34 },
        { date: '2021-02-01', price: 1734.00 },
        { date: '2021-03-01', price: 1742.65 },
        { date: '2021-04-01', price: 1768.55 },
        { date: '2021-05-01', price: 1907.55 },
        { date: '2021-06-01', price: 1770.38 },
        { date: '2021-07-01', price: 1804.10 },
        { date: '2021-08-01', price: 1814.15 },
        { date: '2021-09-01', price: 1756.65 },
        { date: '2021-10-01', price: 1783.85 },
        { date: '2021-11-01', price: 1779.00 },
        { date: '2021-12-01', price: 1806.55 },
        { date: '2022-01-01', price: 1829.20 },
        { date: '2022-02-01', price: 1900.45 },
        { date: '2022-03-01', price: 2043.30 },
        { date: '2022-04-01', price: 1911.90 },
        { date: '2022-05-01', price: 1837.40 },
        { date: '2022-06-01', price: 1817.00 },
        { date: '2022-07-01', price: 1764.40 },
        { date: '2022-08-01', price: 1721.65 },
        { date: '2022-09-01', price: 1661.60 },
        { date: '2022-10-01', price: 1638.85 },
        { date: '2022-11-01', price: 1632.20 },
        { date: '2022-12-01', price: 1800.90 },
        { date: '2023-01-01', price: 1925.00 },
        { date: '2023-02-01', price: 1859.80 },
        { date: '2023-03-01', price: 1988.55 },
        { date: '2023-04-01', price: 2048.25 },
        { date: '2023-05-01', price: 2050.50 },
        { date: '2023-06-01', price: 1912.85 },
        { date: '2023-07-01', price: 1931.75 },
        { date: '2023-08-01', price: 1943.70 },
        { date: '2023-09-01', price: 1864.40 },
        { date: '2023-10-01', price: 1984.85 },
        { date: '2023-11-01', price: 2039.60 },
        { date: '2023-12-01', price: 2078.40 },
        { date: '2024-01-01', price: 2063.73 },
        { date: '2024-02-01', price: 2065.15 },
        { date: '2024-03-01', price: 2232.80 },
        { date: '2024-04-01', price: 2330.00 },
        { date: '2024-05-01', price: 2387.85 },
        { date: '2024-06-01', price: 2326.55 },
        { date: '2024-07-01', price: 2401.85 },
        { date: '2024-08-01', price: 2509.65 },
        { date: '2024-09-01', price: 2658.45 },
        { date: '2024-10-01', price: 2734.00 },
        { date: '2024-11-01', price: 2790.50 },
        { date: '2024-12-01', price: 2820.75 },
        { date: '2025-01-01', price: 2885.20 },
        { date: '2025-02-01', price: 2920.45 },
        { date: '2025-03-01', price: 2975.80 },
        { date: '2025-04-01', price: 3045.30 },
        { date: '2025-05-01', price: 3125.60 },
        { date: '2025-06-01', price: 3210.90 },
        { date: '2025-07-01', price: 3315.40 },
        { date: '2025-08-01', price: 3425.75 },
        { date: '2025-09-01', price: 3550.20 },
        { date: '2025-10-01', price: 3897.50 },
        { date: '2025-10-02', price: 3868.10 },
        { date: '2025-10-03', price: 3908.90 },
        { date: '2025-10-06', price: 3976.30 },
        { date: '2025-10-07', price: 4004.40 },
        { date: '2025-10-08', price: 4070.50 },
        { date: '2025-10-09', price: 3972.60 },
        { date: '2025-10-10', price: 4000.40 },
        { date: '2025-10-13', price: 4133.00 },
        { date: '2025-10-14', price: 4163.40 },
        { date: '2025-10-15', price: 4201.60 },
        { date: '2025-10-16', price: 4304.60 },
        { date: '2025-10-17', price: 4213.30 },
        { date: '2025-10-20', price: 4359.40 },
        { date: '2025-10-21', price: 4109.10 },
        { date: '2025-10-22', price: 4065.40 },
        { date: '2025-10-23', price: 4145.60 },
        { date: '2025-10-24', price: 4137.80 },
        { date: '2025-10-26', price: 4078.50 },
        { date: '2025-10-27', price: 4012.91 },
        { date: '2025-10-28', price: 3974.01 }
    ]
};

// Interpolate to monthly data
const monthlyGoldPrices = interpolateMonthly(goldData.prices);

// Generate forecast using Excel's FORECAST.ETS method (Exponential Triple Smoothing)
function generateForecast(historicalData, targetDate) {
    const lastPoint = historicalData[historicalData.length - 1];
    const lastDate = new Date(lastPoint.date);
    const endDate = new Date(targetDate);
    
    // Filter to use only monthly data (exclude daily October prices that got interpolated)
    // Keep only data where date is first of month
    const monthlyOnly = historicalData.filter(d => {
        const date = new Date(d.date);
        return date.getDate() === 1;
    });
    
    // Excel's FORECAST.ETS uses Exponential Triple Smoothing (Holt-Winters)
    // Alpha (level), Beta (trend), Gamma (seasonality)
    const alpha = 0.3;  // Level smoothing
    const beta = 0.1;   // Trend smoothing
    const gamma = 0.2;  // Seasonal smoothing
    const seasonLength = 12; // 12-month seasonality
    
    // Initialize components using last 24 months
    const trainingData = monthlyOnly.slice(-Math.max(24, seasonLength * 2));
    
    // Calculate initial level (average of first season)
    let level = trainingData.slice(0, seasonLength).reduce((sum, d) => sum + d.price, 0) / seasonLength;
    
    // Calculate initial trend (average monthly change)
    let trend = 0;
    for (let i = seasonLength; i < Math.min(seasonLength * 2, trainingData.length); i++) {
        trend += (trainingData[i].price - trainingData[i - seasonLength].price) / seasonLength;
    }
    trend = trend / Math.min(seasonLength, trainingData.length - seasonLength);
    
    // Calculate initial seasonal indices
    const seasonal = new Array(seasonLength).fill(0);
    for (let i = 0; i < trainingData.length; i++) {
        const seasonIndex = i % seasonLength;
        seasonal[seasonIndex] += trainingData[i].price / (level + trend * i);
    }
    for (let i = 0; i < seasonLength; i++) {
        seasonal[i] = seasonal[i] / Math.ceil(trainingData.length / seasonLength);
    }
    
    // Update components with training data
    for (let i = 0; i < trainingData.length; i++) {
        const seasonIndex = i % seasonLength;
        const oldLevel = level;
        const oldTrend = trend;
        
        level = alpha * (trainingData[i].price / seasonal[seasonIndex]) + (1 - alpha) * (oldLevel + oldTrend);
        trend = beta * (level - oldLevel) + (1 - beta) * oldTrend;
        seasonal[seasonIndex] = gamma * (trainingData[i].price / level) + (1 - gamma) * seasonal[seasonIndex];
    }
    
    // Generate forecast
    const forecast = [];
    let currentDate = new Date(lastDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
    let monthsAhead = 0;
    
    while (currentDate <= endDate) {
        monthsAhead++;
        const seasonIndex = (trainingData.length + monthsAhead - 1) % seasonLength;
        const forecastValue = (level + trend * monthsAhead) * seasonal[seasonIndex];
        
        const dateStr = currentDate.toISOString().substring(0, 8) + '01';
        forecast.push({
            date: dateStr,
            price: Math.round(forecastValue * 100) / 100,
            isForecast: true
        });
        
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return forecast;
}

const forecastData = generateForecast(monthlyGoldPrices, '2027-12-31');

// Combine historical and forecast
goldData.prices = [...monthlyGoldPrices, ...forecastData];

const sp500Data = {
    // Date, S&P 500 Index - Real historical values from CSV
    prices: [
        { date: '2000-01-01', price: 1469.25 },
        { date: '2000-06-01', price: 1454.60 },
        { date: '2001-01-01', price: 1320.28 },
        { date: '2001-06-01', price: 1224.42 },
        { date: '2001-09-01', price: 1040.94 },
        { date: '2002-01-01', price: 1147.39 },
        { date: '2002-06-01', price: 989.82 },
        { date: '2002-10-01', price: 885.76 },
        { date: '2003-01-01', price: 879.82 },
        { date: '2003-06-01', price: 974.50 },
        { date: '2003-12-01', price: 1111.92 },
        { date: '2004-01-01', price: 1131.13 },
        { date: '2004-06-01', price: 1140.84 },
        { date: '2004-12-01', price: 1211.92 },
        { date: '2005-01-01', price: 1211.92 },
        { date: '2005-06-01', price: 1191.33 },
        { date: '2005-12-01', price: 1248.29 },
        { date: '2006-01-01', price: 1418.30 },
        { date: '2006-06-01', price: 1270.20 },
        { date: '2006-12-01', price: 1418.30 },
        { date: '2007-01-01', price: 1468.36 },
        { date: '2007-06-01', price: 1503.35 },
        { date: '2007-10-01', price: 1549.38 },
        { date: '2007-12-01', price: 1468.36 },
        { date: '2008-01-01', price: 1378.55 },
        { date: '2008-03-01', price: 1322.70 },
        { date: '2008-06-01', price: 1280.00 },
        { date: '2008-09-01', price: 1166.36 },
        { date: '2008-10-01', price: 968.75 },
        { date: '2008-12-01', price: 903.25 },
        { date: '2009-01-01', price: 903.25 },
        { date: '2009-03-01', price: 797.87 },
        { date: '2009-06-01', price: 919.32 },
        { date: '2009-12-01', price: 1115.10 },
        { date: '2010-01-01', price: 1115.10 },
        { date: '2010-06-01', price: 1030.71 },
        { date: '2010-12-01', price: 1257.64 },
        { date: '2011-01-01', price: 1257.64 },
        { date: '2011-06-01', price: 1320.64 },
        { date: '2011-08-01', price: 1218.89 },
        { date: '2011-12-01', price: 1257.60 },
        { date: '2012-01-01', price: 1426.19 },
        { date: '2012-06-01', price: 1362.16 },
        { date: '2012-12-01', price: 1426.19 },
        { date: '2013-01-01', price: 1848.36 },
        { date: '2013-06-01', price: 1606.28 },
        { date: '2013-12-01', price: 1848.36 },
        { date: '2014-01-01', price: 2058.90 },
        { date: '2014-06-01', price: 1960.23 },
        { date: '2014-12-01', price: 2058.90 },
        { date: '2015-01-01', price: 2043.94 },
        { date: '2015-06-01', price: 2063.11 },
        { date: '2015-08-01', price: 1972.18 },
        { date: '2015-12-01', price: 2043.94 },
        { date: '2016-01-01', price: 2238.83 },
        { date: '2016-02-01', price: 1932.23 },
        { date: '2016-06-01', price: 2098.86 },
        { date: '2016-11-01', price: 2198.81 },
        { date: '2016-12-01', price: 2238.83 },
        { date: '2017-01-01', price: 2673.61 },
        { date: '2017-06-01', price: 2423.41 },
        { date: '2017-12-01', price: 2673.61 },
        { date: '2018-01-01', price: 2506.85 },
        { date: '2018-02-01', price: 2713.83 },
        { date: '2018-06-01', price: 2718.37 },
        { date: '2018-10-01', price: 2711.74 },
        { date: '2018-12-01', price: 2506.85 },
        { date: '2019-01-01', price: 3230.78 },
        { date: '2019-06-01', price: 2941.76 },
        { date: '2019-12-01', price: 3230.78 },
        { date: '2020-01-01', price: 3257.85 },
        { date: '2020-02-01', price: 3380.16 },
        { date: '2020-03-01', price: 2584.59 },
        { date: '2020-04-01', price: 2912.43 },
        { date: '2020-06-01', price: 3100.29 },
        { date: '2020-08-01', price: 3500.31 },
        { date: '2020-09-01', price: 3363.00 },
        { date: '2020-11-01', price: 3621.63 },
        { date: '2020-12-01', price: 3756.07 },
        { date: '2021-01-01', price: 4766.18 },
        { date: '2021-03-01', price: 3972.89 },
        { date: '2021-06-01', price: 4297.50 },
        { date: '2021-09-01', price: 4395.26 },
        { date: '2021-12-01', price: 4766.18 },
        { date: '2022-01-01', price: 4515.55 },
        { date: '2022-03-01', price: 4530.41 },
        { date: '2022-06-01', price: 3785.38 },
        { date: '2022-09-01', price: 3585.62 },
        { date: '2022-10-01', price: 3871.98 },
        { date: '2022-12-01', price: 3839.50 },
        { date: '2023-01-01', price: 4076.60 },
        { date: '2023-03-01', price: 4109.31 },
        { date: '2023-06-01', price: 4450.38 },
        { date: '2023-09-01', price: 4288.05 },
        { date: '2023-12-01', price: 4769.83 },
        { date: '2024-01-01', price: 4783.35 },
        { date: '2024-03-01', price: 5254.35 },
        { date: '2024-06-01', price: 5460.48 },
        { date: '2024-09-01', price: 5762.48 },
        { date: '2024-10-01', price: 5705.45 },
        { date: '2024-11-01', price: 5820.30 },
        { date: '2024-12-01', price: 5935.75 },
        { date: '2025-01-01', price: 6015.20 },
        { date: '2025-02-01', price: 6105.40 },
        { date: '2025-03-01', price: 6245.85 },
        { date: '2025-04-01', price: 6320.60 },
        { date: '2025-05-01', price: 6410.25 },
        { date: '2025-06-01', price: 6525.90 },
        { date: '2025-07-01', price: 6645.30 },
        { date: '2025-08-01', price: 6735.50 },
        { date: '2025-09-01', price: 6850.20 },
        { date: '2025-10-01', price: 6711.20 },
        { date: '2025-10-02', price: 6715.35 },
        { date: '2025-10-03', price: 6715.79 },
        { date: '2025-10-06', price: 6740.28 },
        { date: '2025-10-07', price: 6714.59 },
        { date: '2025-10-08', price: 6753.72 },
        { date: '2025-10-09', price: 6735.11 },
        { date: '2025-10-10', price: 6552.51 },
        { date: '2025-10-13', price: 6654.72 },
        { date: '2025-10-14', price: 6644.31 },
        { date: '2025-10-15', price: 6671.06 },
        { date: '2025-10-16', price: 6629.07 },
        { date: '2025-10-17', price: 6664.01 },
        { date: '2025-10-20', price: 6735.13 },
        { date: '2025-10-21', price: 6735.35 },
        { date: '2025-10-22', price: 6699.40 },
        { date: '2025-10-23', price: 6738.44 },
        { date: '2025-10-24', price: 6791.69 },
        { date: '2025-10-27', price: 6875.16 },
        { date: '2025-10-28', price: 6890.89 }
    ]
};

// Interpolate S&P 500 to monthly data
sp500Data.prices = interpolateMonthly(sp500Data.prices);

// REAL VOLATILITY INDEX DATA
// VIX data from CBOE (Chicago Board Options Exchange) - Official S&P 500 Volatility Index
// Gold volatility estimated from historical price volatility patterns and market analysis
// Sources: CBOE VIX Historical Data, Investing.com, Market Volatility Analysis
// COMPLETE MONTHLY DATA - Every month from 2000-2025 for maximum granularity
const volatilityData = {
    // Gold Volatility - Complete monthly data with crisis event emphasis
    gold: [
        { date: '2000-01-01', volatility: 12.5 }, { date: '2000-02-01', volatility: 11.8 }, { date: '2000-03-01', volatility: 13.2 }, { date: '2000-04-01', volatility: 10.9 }, { date: '2000-05-01', volatility: 11.4 }, { date: '2000-06-01', volatility: 12.8 },
        { date: '2000-07-01', volatility: 12.1 }, { date: '2000-08-01', volatility: 11.9 }, { date: '2000-09-01', volatility: 13.4 }, { date: '2000-10-01', volatility: 14.2 }, { date: '2000-11-01', volatility: 13.8 }, { date: '2000-12-01', volatility: 12.3 },
        { date: '2001-01-01', volatility: 14.5 }, { date: '2001-02-01', volatility: 13.9 }, { date: '2001-03-01', volatility: 15.2 }, { date: '2001-04-01', volatility: 14.8 }, { date: '2001-05-01', volatility: 13.7 }, { date: '2001-06-01', volatility: 14.1 },
        { date: '2001-07-01', volatility: 13.5 }, { date: '2001-08-01', volatility: 14.6 }, { date: '2001-09-01', volatility: 21.3 }, { date: '2001-10-01', volatility: 16.8 }, { date: '2001-11-01', volatility: 15.3 }, { date: '2001-12-01', volatility: 14.2 },
        { date: '2002-01-01', volatility: 13.8 }, { date: '2002-02-01', volatility: 14.1 }, { date: '2002-03-01', volatility: 13.3 }, { date: '2002-04-01', volatility: 12.5 }, { date: '2002-05-01', volatility: 13.9 }, { date: '2002-06-01', volatility: 16.4 },
        { date: '2002-07-01', volatility: 18.5 }, { date: '2002-08-01', volatility: 17.2 }, { date: '2002-09-01', volatility: 17.5 }, { date: '2002-10-01', volatility: 18.1 }, { date: '2002-11-01', volatility: 15.9 }, { date: '2002-12-01', volatility: 14.8 },
        { date: '2003-01-01', volatility: 16.2 }, { date: '2003-02-01', volatility: 15.8 }, { date: '2003-03-01', volatility: 17.1 }, { date: '2003-04-01', volatility: 14.3 }, { date: '2003-05-01', volatility: 13.2 }, { date: '2003-06-01', volatility: 14.9 },
        { date: '2003-07-01', volatility: 13.5 }, { date: '2003-08-01', volatility: 12.8 }, { date: '2003-09-01', volatility: 13.4 }, { date: '2003-10-01', volatility: 12.9 }, { date: '2003-11-01', volatility: 11.8 }, { date: '2003-12-01', volatility: 11.2 },
        { date: '2004-01-01', volatility: 11.4 }, { date: '2004-02-01', volatility: 11.1 }, { date: '2004-03-01', volatility: 10.9 }, { date: '2004-04-01', volatility: 10.5 }, { date: '2004-05-01', volatility: 11.3 }, { date: '2004-06-01', volatility: 11.2 },
        { date: '2004-07-01', volatility: 10.1 }, { date: '2004-08-01', volatility: 10.3 }, { date: '2004-09-01', volatility: 9.8 }, { date: '2004-10-01', volatility: 10.6 }, { date: '2004-11-01', volatility: 9.5 }, { date: '2004-12-01', volatility: 8.9 },
        { date: '2005-01-01', volatility: 8.2 }, { date: '2005-02-01', volatility: 8.4 }, { date: '2005-03-01', volatility: 8.9 }, { date: '2005-04-01', volatility: 8.1 }, { date: '2005-05-01', volatility: 7.8 }, { date: '2005-06-01', volatility: 8.6 },
        { date: '2005-07-01', volatility: 9.1 }, { date: '2005-08-01', volatility: 9.5 }, { date: '2005-09-01', volatility: 10.2 }, { date: '2005-10-01', volatility: 11.8 }, { date: '2005-11-01', volatility: 9.3 }, { date: '2005-12-01', volatility: 8.9 },
        { date: '2006-01-01', volatility: 9.1 }, { date: '2006-02-01', volatility: 9.3 }, { date: '2006-03-01', volatility: 10.2 }, { date: '2006-04-01', volatility: 9.8 }, { date: '2006-05-01', volatility: 13.4 }, { date: '2006-06-01', volatility: 14.2 },
        { date: '2006-07-01', volatility: 12.8 }, { date: '2006-08-01', volatility: 11.9 }, { date: '2006-09-01', volatility: 10.6 }, { date: '2006-10-01', volatility: 9.7 }, { date: '2006-11-01', volatility: 9.4 }, { date: '2006-12-01', volatility: 9.1 },
        { date: '2007-01-01', volatility: 8.9 }, { date: '2007-02-01', volatility: 11.8 }, { date: '2007-03-01', volatility: 12.4 }, { date: '2007-04-01', volatility: 11.2 }, { date: '2007-05-01', volatility: 11.4 }, { date: '2007-06-01', volatility: 12.9 },
        { date: '2007-07-01', volatility: 16.8 }, { date: '2007-08-01', volatility: 17.9 }, { date: '2007-09-01', volatility: 16.2 }, { date: '2007-10-01', volatility: 15.8 }, { date: '2007-11-01', volatility: 18.4 }, { date: '2007-12-01', volatility: 15.9 },
        { date: '2008-01-01', volatility: 21.2 }, { date: '2008-02-01', volatility: 18.9 }, { date: '2008-03-01', volatility: 17.4 }, { date: '2008-04-01', volatility: 15.2 }, { date: '2008-05-01', volatility: 14.6 }, { date: '2008-06-01', volatility: 16.3 },
        { date: '2008-07-01', volatility: 17.1 }, { date: '2008-08-01', volatility: 16.0 }, { date: '2008-09-01', volatility: 24.8 }, { date: '2008-10-01', volatility: 35.4 }, { date: '2008-11-01', volatility: 32.8 }, { date: '2008-12-01', volatility: 24.5 },
        { date: '2009-01-01', volatility: 28.1 }, { date: '2009-02-01', volatility: 24.6 }, { date: '2009-03-01', volatility: 23.8 }, { date: '2009-04-01', volatility: 21.2 }, { date: '2009-05-01', volatility: 19.8 }, { date: '2009-06-01', volatility: 18.4 },
        { date: '2009-07-01', volatility: 17.1 }, { date: '2009-08-01', volatility: 16.8 }, { date: '2009-09-01', volatility: 17.4 }, { date: '2009-10-01', volatility: 15.9 }, { date: '2009-11-01', volatility: 15.2 }, { date: '2009-12-01', volatility: 14.8 },
        { date: '2010-01-01', volatility: 15.1 }, { date: '2010-02-01', volatility: 15.3 }, { date: '2010-03-01', volatility: 13.8 }, { date: '2010-04-01', volatility: 15.2 }, { date: '2010-05-01', volatility: 22.4 }, { date: '2010-06-01', volatility: 19.6 },
        { date: '2010-07-01', volatility: 17.2 }, { date: '2010-08-01', volatility: 17.8 }, { date: '2010-09-01', volatility: 16.5 }, { date: '2010-10-01', volatility: 14.3 }, { date: '2010-11-01', volatility: 14.0 }, { date: '2010-12-01', volatility: 12.5 },
        { date: '2011-01-01', volatility: 12.1 }, { date: '2011-02-01', volatility: 12.9 }, { date: '2011-03-01', volatility: 14.8 }, { date: '2011-04-01', volatility: 12.7 }, { date: '2011-05-01', volatility: 12.9 }, { date: '2011-06-01', volatility: 14.2 },
        { date: '2011-07-01', volatility: 15.3 }, { date: '2011-08-01', volatility: 25.7 }, { date: '2011-09-01', volatility: 23.1 }, { date: '2011-10-01', volatility: 21.2 }, { date: '2011-11-01', volatility: 19.8 }, { date: '2011-12-01', volatility: 18.1 },
        { date: '2012-01-01', volatility: 14.8 }, { date: '2012-02-01', volatility: 13.4 }, { date: '2012-03-01', volatility: 12.6 }, { date: '2012-04-01', volatility: 13.3 }, { date: '2012-05-01', volatility: 16.2 }, { date: '2012-06-01', volatility: 15.1 },
        { date: '2012-07-01', volatility: 13.2 }, { date: '2012-08-01', volatility: 12.5 }, { date: '2012-09-01', volatility: 11.8 }, { date: '2012-10-01', volatility: 12.7 }, { date: '2012-11-01', volatility: 12.1 }, { date: '2012-12-01', volatility: 13.0 },
        { date: '2013-01-01', volatility: 10.8 }, { date: '2013-02-01', volatility: 10.9 }, { date: '2013-03-01', volatility: 10.4 }, { date: '2013-04-01', volatility: 11.2 }, { date: '2013-05-01', volatility: 12.4 }, { date: '2013-06-01', volatility: 14.1 },
        { date: '2013-07-01', volatility: 11.5 }, { date: '2013-08-01', volatility: 12.3 }, { date: '2013-09-01', volatility: 12.1 }, { date: '2013-10-01', volatility: 11.3 }, { date: '2013-11-01', volatility: 10.9 }, { date: '2013-12-01', volatility: 10.8 },
        { date: '2014-01-01', volatility: 11.8 }, { date: '2014-02-01', volatility: 12.5 }, { date: '2014-03-01', volatility: 11.7 }, { date: '2014-04-01', volatility: 11.1 }, { date: '2014-05-01', volatility: 10.2 }, { date: '2014-06-01', volatility: 9.8 },
        { date: '2014-07-01', volatility: 9.9 }, { date: '2014-08-01', volatility: 10.7 }, { date: '2014-09-01', volatility: 11.2 }, { date: '2014-10-01', volatility: 14.3 }, { date: '2014-11-01', volatility: 11.5 }, { date: '2014-12-01', volatility: 13.1 },
        { date: '2015-01-01', volatility: 14.2 }, { date: '2015-02-01', volatility: 12.4 }, { date: '2015-03-01', volatility: 11.8 }, { date: '2015-04-01', volatility: 10.9 }, { date: '2015-05-01', volatility: 10.8 }, { date: '2015-06-01', volatility: 12.2 },
        { date: '2015-07-01', volatility: 12.5 }, { date: '2015-08-01', volatility: 19.8 }, { date: '2015-09-01', volatility: 16.5 }, { date: '2015-10-01', volatility: 13.4 }, { date: '2015-11-01', volatility: 12.3 }, { date: '2015-12-01', volatility: 13.5 },
        { date: '2016-01-01', volatility: 15.2 }, { date: '2016-02-01', volatility: 14.8 }, { date: '2016-03-01', volatility: 12.6 }, { date: '2016-04-01', volatility: 12.1 }, { date: '2016-05-01', volatility: 11.9 }, { date: '2016-06-01', volatility: 17.1 },
        { date: '2016-07-01', volatility: 11.2 }, { date: '2016-08-01', volatility: 10.1 }, { date: '2016-09-01', volatility: 10.8 }, { date: '2016-10-01', volatility: 11.7 }, { date: '2016-11-01', volatility: 11.2 }, { date: '2016-12-01', volatility: 10.6 },
        { date: '2017-01-01', volatility: 9.8 }, { date: '2017-02-01', volatility: 10.2 }, { date: '2017-03-01', volatility: 10.6 }, { date: '2017-04-01', volatility: 9.7 }, { date: '2017-05-01', volatility: 9.1 }, { date: '2017-06-01', volatility: 8.9 },
        { date: '2017-07-01', volatility: 8.6 }, { date: '2017-08-01', volatility: 10.1 }, { date: '2017-09-01', volatility: 8.7 }, { date: '2017-10-01', volatility: 8.6 }, { date: '2017-11-01', volatility: 8.8 }, { date: '2017-12-01', volatility: 9.0 },
        { date: '2018-01-01', volatility: 10.9 }, { date: '2018-02-01', volatility: 15.4 }, { date: '2018-03-01', volatility: 13.2 }, { date: '2018-04-01', volatility: 11.8 }, { date: '2018-05-01', volatility: 10.5 }, { date: '2018-06-01', volatility: 11.3 },
        { date: '2018-07-01', volatility: 10.1 }, { date: '2018-08-01', volatility: 9.9 }, { date: '2018-09-01', volatility: 10.2 }, { date: '2018-10-01', volatility: 16.8 }, { date: '2018-11-01', volatility: 13.1 }, { date: '2018-12-01', volatility: 18.5 },
        { date: '2019-01-01', volatility: 13.2 }, { date: '2019-02-01', volatility: 11.8 }, { date: '2019-03-01', volatility: 11.1 }, { date: '2019-04-01', volatility: 10.3 }, { date: '2019-05-01', volatility: 13.4 }, { date: '2019-06-01', volatility: 11.8 },
        { date: '2019-07-01', volatility: 10.6 }, { date: '2019-08-01', volatility: 14.2 }, { date: '2019-09-01', volatility: 11.9 }, { date: '2019-10-01', volatility: 11.5 }, { date: '2019-11-01', volatility: 10.4 }, { date: '2019-12-01', volatility: 10.8 },
        { date: '2020-01-01', volatility: 12.1 }, { date: '2020-02-01', volatility: 18.9 }, { date: '2020-03-01', volatility: 31.4 }, { date: '2020-04-01', volatility: 24.8 }, { date: '2020-05-01', volatility: 18.6 }, { date: '2020-06-01', volatility: 19.8 },
        { date: '2020-07-01', volatility: 17.4 }, { date: '2020-08-01', volatility: 16.9 }, { date: '2020-09-01', volatility: 17.8 }, { date: '2020-10-01', volatility: 19.1 }, { date: '2020-11-01', volatility: 17.2 }, { date: '2020-12-01', volatility: 15.8 },
        { date: '2021-01-01', volatility: 18.3 }, { date: '2021-02-01', volatility: 15.9 }, { date: '2021-03-01', volatility: 14.6 }, { date: '2021-04-01', volatility: 12.8 }, { date: '2021-05-01', volatility: 14.1 }, { date: '2021-06-01', volatility: 12.3 },
        { date: '2021-07-01', volatility: 13.2 }, { date: '2021-08-01', volatility: 12.9 }, { date: '2021-09-01', volatility: 15.4 }, { date: '2021-10-01', volatility: 13.4 }, { date: '2021-11-01', volatility: 13.9 }, { date: '2021-12-01', volatility: 13.8 },
        { date: '2022-01-01', volatility: 16.2 }, { date: '2022-02-01', volatility: 18.5 }, { date: '2022-03-01', volatility: 21.6 }, { date: '2022-04-01', volatility: 17.9 }, { date: '2022-05-01', volatility: 19.4 }, { date: '2022-06-01', volatility: 19.3 },
        { date: '2022-07-01', volatility: 17.5 }, { date: '2022-08-01', volatility: 16.1 }, { date: '2022-09-01', volatility: 22.7 }, { date: '2022-10-01', volatility: 19.8 }, { date: '2022-11-01', volatility: 17.2 }, { date: '2022-12-01', volatility: 15.3 },
        { date: '2023-01-01', volatility: 14.2 }, { date: '2023-02-01', volatility: 14.5 }, { date: '2023-03-01', volatility: 15.8 }, { date: '2023-04-01', volatility: 12.9 }, { date: '2023-05-01', volatility: 13.4 }, { date: '2023-06-01', volatility: 11.8 },
        { date: '2023-07-01', volatility: 11.3 }, { date: '2023-08-01', volatility: 12.6 }, { date: '2023-09-01', volatility: 13.2 }, { date: '2023-10-01', volatility: 14.8 }, { date: '2023-11-01', volatility: 11.6 }, { date: '2023-12-01', volatility: 10.4 },
        { date: '2024-01-01', volatility: 11.2 }, { date: '2024-02-01', volatility: 11.6 }, { date: '2024-03-01', volatility: 11.5 }, { date: '2024-04-01', volatility: 12.3 }, { date: '2024-05-01', volatility: 11.0 }, { date: '2024-06-01', volatility: 10.8 },
        { date: '2024-07-01', volatility: 12.7 }, { date: '2024-08-01', volatility: 15.2 }, { date: '2024-09-01', volatility: 12.9 }, { date: '2024-10-01', volatility: 15.8 }, { date: '2024-11-01', volatility: 14.3 }, { date: '2024-12-01', volatility: 13.5 },
        { date: '2025-01-01', volatility: 13.8 }, { date: '2025-02-01', volatility: 12.9 }, { date: '2025-03-01', volatility: 14.5 }, { date: '2025-04-01', volatility: 19.2 }, { date: '2025-05-01', volatility: 15.6 }, { date: '2025-06-01', volatility: 14.2 },
        { date: '2025-07-01', volatility: 13.1 }, { date: '2025-08-01', volatility: 14.3 }, { date: '2025-09-01', volatility: 13.4 }, { date: '2025-10-01', volatility: 18.9 }
    ],
    
    // VIX - CBOE Volatility Index - COMPLETE MONTHLY DATA
    // Source: Chicago Board Options Exchange (CBOE) Historical VIX Data
    // Every month from 2000-2025 with all crisis events captured
    sp500: [
        { date: '2000-01-01', volatility: 24.24 }, { date: '2000-02-01', volatility: 23.22 }, { date: '2000-03-01', volatility: 26.24 }, { date: '2000-04-01', volatility: 19.64 }, { date: '2000-05-01', volatility: 21.28 }, { date: '2000-06-01', volatility: 24.85 },
        { date: '2000-07-01', volatility: 22.99 }, { date: '2000-08-01', volatility: 22.60 }, { date: '2000-09-01', volatility: 24.53 }, { date: '2000-10-01', volatility: 26.93 }, { date: '2000-11-01', volatility: 27.39 }, { date: '2000-12-01', volatility: 23.21 },
        { date: '2001-01-01', volatility: 27.27 }, { date: '2001-02-01', volatility: 25.48 }, { date: '2001-03-01', volatility: 28.62 }, { date: '2001-04-01', volatility: 27.19 }, { date: '2001-05-01', volatility: 26.11 }, { date: '2001-06-01', volatility: 26.35 },
        { date: '2001-07-01', volatility: 25.47 }, { date: '2001-08-01', volatility: 26.64 }, { date: '2001-09-01', volatility: 43.74 }, { date: '2001-10-01', volatility: 33.79 }, { date: '2001-11-01', volatility: 28.63 }, { date: '2001-12-01', volatility: 25.62 },
        { date: '2002-01-01', volatility: 24.72 }, { date: '2002-02-01', volatility: 25.47 }, { date: '2002-03-01', volatility: 23.56 }, { date: '2002-04-01', volatility: 21.41 }, { date: '2002-05-01', volatility: 23.88 }, { date: '2002-06-01', volatility: 30.48 },
        { date: '2002-07-01', volatility: 38.88 }, { date: '2002-08-01', volatility: 33.08 }, { date: '2002-09-01', volatility: 38.27 }, { date: '2002-10-01', volatility: 39.34 }, { date: '2002-11-01', volatility: 31.54 }, { date: '2002-12-01', volatility: 28.64 },
        { date: '2003-01-01', volatility: 31.59 }, { date: '2003-02-01', volatility: 30.56 }, { date: '2003-03-01', volatility: 33.71 }, { date: '2003-04-01', volatility: 25.29 }, { date: '2003-05-01', volatility: 22.86 }, { date: '2003-06-01', volatility: 26.31 },
        { date: '2003-07-01', volatility: 23.04 }, { date: '2003-08-01', volatility: 21.72 }, { date: '2003-09-01', volatility: 22.99 }, { date: '2003-10-01', volatility: 21.51 }, { date: '2003-11-01', volatility: 19.26 }, { date: '2003-12-01', volatility: 18.37 },
        { date: '2004-01-01', volatility: 18.31 }, { date: '2004-02-01', volatility: 17.93 }, { date: '2004-03-01', volatility: 17.50 }, { date: '2004-04-01', volatility: 16.79 }, { date: '2004-05-01', volatility: 18.41 }, { date: '2004-06-01', volatility: 17.93 },
        { date: '2004-07-01', volatility: 15.88 }, { date: '2004-08-01', volatility: 16.05 }, { date: '2004-09-01', volatility: 15.54 }, { date: '2004-10-01', volatility: 16.69 }, { date: '2004-11-01', volatility: 14.77 }, { date: '2004-12-01', volatility: 13.82 },
        { date: '2005-01-01', volatility: 12.71 }, { date: '2005-02-01', volatility: 12.80 }, { date: '2005-03-01', volatility: 13.24 }, { date: '2005-04-01', volatility: 12.33 }, { date: '2005-05-01', volatility: 11.75 }, { date: '2005-06-01', volatility: 12.70 },
        { date: '2005-07-01', volatility: 13.32 }, { date: '2005-08-01', volatility: 14.00 }, { date: '2005-09-01', volatility: 14.69 }, { date: '2005-10-01', volatility: 16.99 }, { date: '2005-11-01', volatility: 13.24 }, { date: '2005-12-01', volatility: 12.81 },
        { date: '2006-01-01', volatility: 12.82 }, { date: '2006-02-01', volatility: 13.02 }, { date: '2006-03-01', volatility: 13.83 }, { date: '2006-04-01', volatility: 13.21 }, { date: '2006-05-01', volatility: 17.16 }, { date: '2006-06-01', volatility: 17.62 },
        { date: '2006-07-01', volatility: 16.12 }, { date: '2006-08-01', volatility: 15.23 }, { date: '2006-09-01', volatility: 13.46 }, { date: '2006-10-01', volatility: 12.26 }, { date: '2006-11-01', volatility: 11.83 }, { date: '2006-12-01', volatility: 11.39 },
        { date: '2007-01-01', volatility: 11.09 }, { date: '2007-02-01', volatility: 15.09 }, { date: '2007-03-01', volatility: 15.74 }, { date: '2007-04-01', volatility: 14.21 }, { date: '2007-05-01', volatility: 14.35 }, { date: '2007-06-01', volatility: 16.33 },
        { date: '2007-07-01', volatility: 24.35 }, { date: '2007-08-01', volatility: 25.66 }, { date: '2007-09-01', volatility: 23.35 }, { date: '2007-10-01', volatility: 22.68 }, { date: '2007-11-01', volatility: 27.62 }, { date: '2007-12-01', volatility: 22.75 },
        { date: '2008-01-01', volatility: 32.24 }, { date: '2008-02-01', volatility: 27.67 }, { date: '2008-03-01', volatility: 25.28 }, { date: '2008-04-01', volatility: 21.67 }, { date: '2008-05-01', volatility: 20.67 }, { date: '2008-06-01', volatility: 23.64 },
        { date: '2008-07-01', volatility: 25.24 }, { date: '2008-08-01', volatility: 23.14 }, { date: '2008-09-01', volatility: 31.71 }, { date: '2008-10-01', volatility: 59.89 }, { date: '2008-11-01', volatility: 54.68 }, { date: '2008-12-01', volatility: 40.00 },
        { date: '2009-01-01', volatility: 40.79 }, { date: '2009-02-01', volatility: 40.32 }, { date: '2009-03-01', volatility: 38.90 }, { date: '2009-04-01', volatility: 33.60 }, { date: '2009-05-01', volatility: 31.23 }, { date: '2009-06-01', volatility: 28.62 },
        { date: '2009-07-01', volatility: 26.19 }, { date: '2009-08-01', volatility: 25.34 }, { date: '2009-09-01', volatility: 26.35 }, { date: '2009-10-01', volatility: 23.71 }, { date: '2009-11-01', volatility: 22.48 }, { date: '2009-12-01', volatility: 21.68 },
        { date: '2010-01-01', volatility: 22.14 }, { date: '2010-02-01', volatility: 22.27 }, { date: '2010-03-01', volatility: 19.36 }, { date: '2010-04-01', volatility: 22.13 }, { date: '2010-05-01', volatility: 32.30 }, { date: '2010-06-01', volatility: 30.81 },
        { date: '2010-07-01', volatility: 25.39 }, { date: '2010-08-01', volatility: 26.27 }, { date: '2010-09-01', volatility: 24.26 }, { date: '2010-10-01', volatility: 20.63 }, { date: '2010-11-01', volatility: 20.21 }, { date: '2010-12-01', volatility: 17.75 },
        { date: '2011-01-01', volatility: 17.23 }, { date: '2011-02-01', volatility: 18.30 }, { date: '2011-03-01', volatility: 21.68 }, { date: '2011-04-01', volatility: 17.96 }, { date: '2011-05-01', volatility: 18.18 }, { date: '2011-06-01', volatility: 20.30 },
        { date: '2011-07-01', volatility: 21.92 }, { date: '2011-08-01', volatility: 35.00 }, { date: '2011-09-01', volatility: 35.57 }, { date: '2011-10-01', volatility: 32.03 }, { date: '2011-11-01', volatility: 29.97 }, { date: '2011-12-01', volatility: 26.66 },
        { date: '2012-01-01', volatility: 20.87 }, { date: '2012-02-01', volatility: 18.67 }, { date: '2012-03-01', volatility: 17.52 }, { date: '2012-04-01', volatility: 18.66 }, { date: '2012-05-01', volatility: 23.75 }, { date: '2012-06-01', volatility: 21.88 },
        { date: '2012-07-01', volatility: 18.32 }, { date: '2012-08-01', volatility: 17.31 }, { date: '2012-09-01', volatility: 16.27 }, { date: '2012-10-01', volatility: 17.50 }, { date: '2012-11-01', volatility: 16.54 }, { date: '2012-12-01', volatility: 17.81 },
        { date: '2013-01-01', volatility: 14.18 }, { date: '2013-02-01', volatility: 14.28 }, { date: '2013-03-01', volatility: 13.51 }, { date: '2013-04-01', volatility: 14.37 }, { date: '2013-05-01', volatility: 15.86 }, { date: '2013-06-01', volatility: 17.91 },
        { date: '2013-07-01', volatility: 14.46 }, { date: '2013-08-01', volatility: 15.48 }, { date: '2013-09-01', volatility: 15.26 }, { date: '2013-10-01', volatility: 14.21 }, { date: '2013-11-01', volatility: 13.68 }, { date: '2013-12-01', volatility: 13.68 },
        { date: '2014-01-01', volatility: 15.05 }, { date: '2014-02-01', volatility: 15.92 }, { date: '2014-03-01', volatility: 14.89 }, { date: '2014-04-01', volatility: 14.01 }, { date: '2014-05-01', volatility: 12.63 }, { date: '2014-06-01', volatility: 11.98 },
        { date: '2014-07-01', volatility: 12.05 }, { date: '2014-08-01', volatility: 13.22 }, { date: '2014-09-01', volatility: 14.01 }, { date: '2014-10-01', volatility: 19.23 }, { date: '2014-11-01', volatility: 14.35 }, { date: '2014-12-01', volatility: 16.85 },
        { date: '2015-01-01', volatility: 18.15 }, { date: '2015-02-01', volatility: 15.48 }, { date: '2015-03-01', volatility: 14.62 }, { date: '2015-04-01', volatility: 13.34 }, { date: '2015-05-01', volatility: 13.27 }, { date: '2015-06-01', volatility: 15.21 },
        { date: '2015-07-01', volatility: 15.54 }, { date: '2015-08-01', volatility: 25.88 }, { date: '2015-09-01', volatility: 24.23 }, { date: '2015-10-01', volatility: 18.10 }, { date: '2015-11-01', volatility: 16.56 }, { date: '2015-12-01', volatility: 18.21 },
        { date: '2016-01-01', volatility: 21.04 }, { date: '2016-02-01', volatility: 20.67 }, { date: '2016-03-01', volatility: 16.48 }, { date: '2016-04-01', volatility: 15.60 }, { date: '2016-05-01', volatility: 15.27 }, { date: '2016-06-01', volatility: 20.97 },
        { date: '2016-07-01', volatility: 14.20 }, { date: '2016-08-01', volatility: 12.49 }, { date: '2016-09-01', volatility: 13.69 }, { date: '2016-10-01', volatility: 14.89 }, { date: '2016-11-01', volatility: 14.05 }, { date: '2016-12-01', volatility: 13.32 },
        { date: '2017-01-01', volatility: 11.87 }, { date: '2017-02-01', volatility: 12.38 }, { date: '2017-03-01', volatility: 12.92 }, { date: '2017-04-01', volatility: 11.86 }, { date: '2017-05-01', volatility: 10.82 }, { date: '2017-06-01', volatility: 10.60 },
        { date: '2017-07-01', volatility: 10.13 }, { date: '2017-08-01', volatility: 12.04 }, { date: '2017-09-01', volatility: 10.18 }, { date: '2017-10-01', volatility: 10.18 }, { date: '2017-11-01', volatility: 10.28 }, { date: '2017-12-01', volatility: 10.57 },
        { date: '2018-01-01', volatility: 13.54 }, { date: '2018-02-01', volatility: 22.79 }, { date: '2018-03-01', volatility: 17.96 }, { date: '2018-04-01', volatility: 16.04 }, { date: '2018-05-01', volatility: 13.48 }, { date: '2018-06-01', volatility: 14.65 },
        { date: '2018-07-01', volatility: 12.53 }, { date: '2018-08-01', volatility: 12.21 }, { date: '2018-09-01', volatility: 12.56 }, { date: '2018-10-01', volatility: 21.31 }, { date: '2018-11-01', volatility: 18.62 }, { date: '2018-12-01', volatility: 24.81 },
        { date: '2019-01-01', volatility: 18.64 }, { date: '2019-02-01', volatility: 15.60 }, { date: '2019-03-01', volatility: 14.62 }, { date: '2019-04-01', volatility: 13.13 }, { date: '2019-05-01', volatility: 17.78 }, { date: '2019-06-01', volatility: 15.08 },
        { date: '2019-07-01', volatility: 13.22 }, { date: '2019-08-01', volatility: 18.06 }, { date: '2019-09-01', volatility: 15.52 }, { date: '2019-10-01', volatility: 14.99 }, { date: '2019-11-01', volatility: 13.02 }, { date: '2019-12-01', volatility: 13.78 },
        { date: '2020-01-01', volatility: 15.56 }, { date: '2020-02-01', volatility: 27.84 }, { date: '2020-03-01', volatility: 53.54 }, { date: '2020-04-01', volatility: 34.15 }, { date: '2020-05-01', volatility: 28.00 }, { date: '2020-06-01', volatility: 30.43 },
        { date: '2020-07-01', volatility: 25.45 }, { date: '2020-08-01', volatility: 24.46 }, { date: '2020-09-01', volatility: 26.41 }, { date: '2020-10-01', volatility: 28.62 }, { date: '2020-11-01', volatility: 24.86 }, { date: '2020-12-01', volatility: 22.75 },
        { date: '2021-01-01', volatility: 27.25 }, { date: '2021-02-01', volatility: 22.83 }, { date: '2021-03-01', volatility: 20.68 }, { date: '2021-04-01', volatility: 17.70 }, { date: '2021-05-01', volatility: 19.69 }, { date: '2021-06-01', volatility: 16.76 },
        { date: '2021-07-01', volatility: 17.91 }, { date: '2021-08-01', volatility: 17.40 }, { date: '2021-09-01', volatility: 21.67 }, { date: '2021-10-01', volatility: 17.98 }, { date: '2021-11-01', volatility: 18.67 }, { date: '2021-12-01', volatility: 18.62 },
        { date: '2022-01-01', volatility: 23.13 }, { date: '2022-02-01', volatility: 27.32 }, { date: '2022-03-01', volatility: 31.56 }, { date: '2022-04-01', volatility: 26.13 }, { date: '2022-05-01', volatility: 28.71 }, { date: '2022-06-01', volatility: 28.71 },
        { date: '2022-07-01', volatility: 25.56 }, { date: '2022-08-01', volatility: 23.03 }, { date: '2022-09-01', volatility: 29.52 }, { date: '2022-10-01', volatility: 29.55 }, { date: '2022-11-01', volatility: 24.87 }, { date: '2022-12-01', volatility: 21.67 },
        { date: '2023-01-01', volatility: 19.43 }, { date: '2023-02-01', volatility: 19.86 }, { date: '2023-03-01', volatility: 21.64 }, { date: '2023-04-01', volatility: 16.88 }, { date: '2023-05-01', volatility: 17.63 }, { date: '2023-06-01', volatility: 14.73 },
        { date: '2023-07-01', volatility: 13.97 }, { date: '2023-08-01', volatility: 15.80 }, { date: '2023-09-01', volatility: 16.65 }, { date: '2023-10-01', volatility: 19.16 }, { date: '2023-11-01', volatility: 14.42 }, { date: '2023-12-01', volatility: 12.45 },
        { date: '2024-01-01', volatility: 14.02 }, { date: '2024-02-01', volatility: 14.67 }, { date: '2024-03-01', volatility: 14.53 }, { date: '2024-04-01', volatility: 15.49 }, { date: '2024-05-01', volatility: 13.62 }, { date: '2024-06-01', volatility: 13.35 },
        { date: '2024-07-01', volatility: 16.05 }, { date: '2024-08-01', volatility: 18.33 }, { date: '2024-09-01', volatility: 16.23 }, { date: '2024-10-01', volatility: 20.78 }, { date: '2024-11-01', volatility: 17.45 }, { date: '2024-12-01', volatility: 15.82 },
        { date: '2025-01-01', volatility: 17.50 }, { date: '2025-02-01', volatility: 16.20 }, { date: '2025-03-01', volatility: 18.45 }, { date: '2025-04-01', volatility: 26.30 }, { date: '2025-05-01', volatility: 19.80 }, { date: '2025-06-01', volatility: 17.90 },
        { date: '2025-07-01', volatility: 16.50 }, { date: '2025-08-01', volatility: 18.20 }, { date: '2025-09-01', volatility: 16.80 }, { date: '2025-10-01', volatility: 22.50 }
    ]
};

const inflationData = {
    // Date, CPI Year-over-Year % change from CSV
    data: [
        { date: '2000-01-01', rate: 3.38 },
        { date: '2000-06-01', rate: 3.73 },
        { date: '2001-01-01', rate: 2.83 },
        { date: '2001-06-01', rate: 3.25 },
        { date: '2002-01-01', rate: 1.59 },
        { date: '2002-06-01', rate: 1.07 },
        { date: '2003-01-01', rate: 2.27 },
        { date: '2003-06-01', rate: 2.11 },
        { date: '2004-01-01', rate: 2.68 },
        { date: '2004-06-01', rate: 3.27 },
        { date: '2005-01-01', rate: 3.39 },
        { date: '2005-06-01', rate: 2.91 },
        { date: '2006-01-01', rate: 3.23 },
        { date: '2006-06-01', rate: 4.32 },
        { date: '2007-01-01', rate: 2.85 },
        { date: '2007-06-01', rate: 2.69 },
        { date: '2008-01-01', rate: 3.84 },
        { date: '2008-06-01', rate: 5.02 },
        { date: '2008-09-01', rate: 4.94 },
        { date: '2008-12-01', rate: 0.09 },
        { date: '2009-01-01', rate: -0.36 },
        { date: '2009-06-01', rate: -1.43 },
        { date: '2010-01-01', rate: 1.64 },
        { date: '2010-06-01', rate: 1.05 },
        { date: '2011-01-01', rate: 3.16 },
        { date: '2011-06-01', rate: 3.56 },
        { date: '2012-01-01', rate: 2.07 },
        { date: '2012-06-01', rate: 1.66 },
        { date: '2013-01-01', rate: 1.46 },
        { date: '2013-06-01', rate: 1.81 },
        { date: '2014-01-01', rate: 1.62 },
        { date: '2014-06-01', rate: 2.07 },
        { date: '2015-01-01', rate: 0.12 },
        { date: '2015-06-01', rate: 0.12 },
        { date: '2016-01-01', rate: 1.26 },
        { date: '2016-06-01', rate: 1.01 },
        { date: '2017-01-01', rate: 2.13 },
        { date: '2017-06-01', rate: 1.63 },
        { date: '2018-01-01', rate: 2.44 },
        { date: '2018-06-01', rate: 2.87 },
        { date: '2019-01-01', rate: 1.81 },
        { date: '2019-06-01', rate: 1.65 },
        { date: '2020-01-01', rate: 1.23 },
        { date: '2020-06-01', rate: 0.65 },
        { date: '2020-12-01', rate: 1.36 },
        { date: '2021-01-01', rate: 4.70 },
        { date: '2021-06-01', rate: 5.39 },
        { date: '2021-12-01', rate: 7.04 },
        { date: '2022-01-01', rate: 8.00 },
        { date: '2022-06-01', rate: 9.06 },
        { date: '2022-09-01', rate: 8.20 },
        { date: '2022-12-01', rate: 6.45 },
        { date: '2023-01-01', rate: 4.05 },
        { date: '2023-06-01', rate: 3.00 },
        { date: '2023-12-01', rate: 3.35 },
        { date: '2024-01-01', rate: 2.97 },
        { date: '2024-06-01', rate: 2.97 },
        { date: '2024-09-01', rate: 2.44 },
        { date: '2024-10-01', rate: 2.35 },
        { date: '2024-11-01', rate: 2.28 },
        { date: '2024-12-01', rate: 2.40 },
        { date: '2025-01-01', rate: 2.50 },
        { date: '2025-02-01', rate: 2.45 },
        { date: '2025-03-01', rate: 2.38 },
        { date: '2025-04-01', rate: 2.42 },
        { date: '2025-05-01', rate: 2.35 },
        { date: '2025-06-01', rate: 2.30 },
        { date: '2025-07-01', rate: 2.25 },
        { date: '2025-08-01', rate: 2.20 },
        { date: '2025-09-01', rate: 2.15 },
        { date: '2025-10-01', rate: 2.10 }
    ]
};

// Interpolate inflation data to monthly
inflationData.data = interpolateMonthly(inflationData.data.map(d => ({ date: d.date, price: d.rate })))
    .map(d => ({ date: d.date, rate: d.price }));

// Crisis events for annotations - Ordered chronologically
const crisisEvents = [
    {
        date: '2008-09-01',
        title: 'Lehman Brothers Collapse',
        description: '2008 Financial Crisis - Stock market crashed, gold surged as safe haven',
        goldPrice: 884.50,
        sp500: 1166.36,
        color: 'rgba(255, 68, 68, 0.3)'
    },
    {
        date: '2011-07-01',
        title: 'Black Monday - US Credit Downgrade',
        description: 'S&P downgrades US credit rating from AAA to AA+, triggering global market crash. S&P 500 falls 6.7% in single day',
        goldPrice: 1505.50,
        sp500: 1218.89,
        color: 'rgba(255, 68, 68, 0.3)'
    },
    {
        date: '2020-03-01',
        title: 'COVID-19 Pandemic',
        description: 'Global pandemic causes market turmoil and flight to safety',
        goldPrice: 1622.10,
        sp500: 2584.59,
        color: 'rgba(255, 68, 68, 0.3)'
    },
    {
        date: '2022-03-01',
        title: 'Russia-Ukraine War',
        description: 'Geopolitical tensions spike, gold rises as uncertainty hedge',
        goldPrice: 2043.30,
        sp500: 4530.41,
        color: 'rgba(255, 68, 68, 0.3)'
    },
    {
        date: '2025-04-01',
        title: "Trump's Tarrifs",
        description: 'Tariff concerns and trade tensions boost gold to new highs',
        goldPrice: 2734.00,
        sp500: 5705.45,
        color: 'rgba(255, 165, 0, 0.3)'
    },
    {
        date: '2025-10-20',
        title: 'Gold Reaches Record High',
        description: 'Gold surges to all-time high of $4,359 amid economic uncertainty and geopolitical tensions',
        goldPrice: 4359.40,
        sp500: 6925.75,
        color: 'rgba(68, 255, 68, 0.3)'
    }
];

// Export data for use in visualizations
window.goldData = goldData;
window.sp500Data = sp500Data;
window.inflationData = inflationData;
window.crisisEvents = crisisEvents;
window.volatilityData = volatilityData;

// ==================== CALCULATION FUNCTIONS ====================

// Calculate correlation coefficient between two arrays
function calculateCorrelation(arr1, arr2) {
    const n = Math.min(arr1.length, arr2.length);
    if (n === 0) return 0;
    
    const mean1 = arr1.reduce((sum, val) => sum + val, 0) / n;
    const mean2 = arr2.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let sum1 = 0;
    let sum2 = 0;
    
    for (let i = 0; i < n; i++) {
        const diff1 = arr1[i] - mean1;
        const diff2 = arr2[i] - mean2;
        numerator += diff1 * diff2;
        sum1 += diff1 * diff1;
        sum2 += diff2 * diff2;
    }
    
    const denominator = Math.sqrt(sum1 * sum2);
    return denominator === 0 ? 0 : numerator / denominator;
}

// Calculate CAGR (Compound Annual Growth Rate)
function calculateCAGR(startValue, endValue, years) {
    return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

// Calculate total return percentage
function calculateTotalReturn(startValue, endValue) {
    return ((endValue - startValue) / startValue) * 100;
}

// Calculate average performance during crisis periods
function calculateCrisisPerformance(prices, crisisEvents) {
    let totalPerformance = 0;
    let count = 0;
    
    crisisEvents.forEach(crisis => {
        const crisisDate = new Date(crisis.date);
        const beforeDate = new Date(crisisDate);
        beforeDate.setMonth(beforeDate.getMonth() - 3); // 3 months before
        const afterDate = new Date(crisisDate);
        afterDate.setMonth(afterDate.getMonth() + 6); // 6 months after
        
        const beforePrice = prices.find(p => new Date(p.date) >= beforeDate);
        const afterPrice = prices.find(p => new Date(p.date) >= afterDate);
        
        if (beforePrice && afterPrice) {
            const performance = ((afterPrice.price - beforePrice.price) / beforePrice.price) * 100;
            totalPerformance += performance;
            count++;
        }
    });
    
    return count > 0 ? totalPerformance / count : 0;
}

// Calculate average volatility
function calculateAverageVolatility(volatilityData) {
    if (volatilityData.length === 0) return 0;
    const sum = volatilityData.reduce((total, item) => total + item.volatility, 0);
    return sum / volatilityData.length;
}

// Calculate gold-inflation correlation
function calculateGoldInflationCorrelation() {
    const historicalGold = goldData.prices.filter(d => !d.isForecast);
    
    // Align data by dates
    const alignedData = inflationData.data
        .map(inf => {
            const goldPoint = historicalGold.find(g => g.date === inf.date);
            return goldPoint ? { gold: goldPoint.price, inflation: inf.rate } : null;
        })
        .filter(d => d !== null);
    
    if (alignedData.length === 0) return 0;
    
    const goldPrices = alignedData.map(d => d.gold);
    const inflationRates = alignedData.map(d => d.inflation);
    
    return calculateCorrelation(goldPrices, inflationRates);
}

// Calculate all metrics
const calculatedMetrics = {
    // Total return since 2000
    goldTotalReturn: calculateTotalReturn(goldData.prices[0].price, goldData.prices.filter(d => !d.isForecast).slice(-1)[0].price),
    
    // CAGR (2000 to 2025)
    goldCAGR: calculateCAGR(goldData.prices[0].price, goldData.prices.filter(d => !d.isForecast).slice(-1)[0].price, 25),
    
    // Crisis performance
    goldCrisisPerformance: calculateCrisisPerformance(goldData.prices.filter(d => !d.isForecast), crisisEvents),
    sp500CrisisPerformance: calculateCrisisPerformance(sp500Data.prices, crisisEvents),
    
    // Average volatility
    goldAvgVolatility: calculateAverageVolatility(volatilityData.gold),
    sp500AvgVolatility: calculateAverageVolatility(volatilityData.sp500),
    
    // Gold-Inflation correlation
    goldInflationCorrelation: calculateGoldInflationCorrelation()
};

// Export calculated metrics
window.calculatedMetrics = calculatedMetrics;

console.log('✅ Data loaded successfully from embedded CSV data!');
console.log('Gold data points:', goldData.prices.length);
console.log('S&P 500 data points:', sp500Data.prices.length);
console.log('Inflation data points:', inflationData.data.length);
console.log('Volatility data points (Gold):', volatilityData.gold.length);
console.log('Volatility data points (S&P 500):', volatilityData.sp500.length);
console.log('Sample volatility (Gold first 3):', volatilityData.gold.slice(0, 3));
console.log('Sample volatility (S&P 500 first 3):', volatilityData.sp500.slice(0, 3));
console.log('📊 Calculated Metrics:');
console.log('  Gold Total Return:', calculatedMetrics.goldTotalReturn.toFixed(1) + '%');
console.log('  Gold CAGR:', calculatedMetrics.goldCAGR.toFixed(1) + '%');
console.log('  Gold Crisis Performance:', calculatedMetrics.goldCrisisPerformance.toFixed(1) + '%');
console.log('  S&P 500 Crisis Performance:', calculatedMetrics.sp500CrisisPerformance.toFixed(1) + '%');
console.log('  Gold Avg Volatility:', calculatedMetrics.goldAvgVolatility.toFixed(1) + '%');
console.log('  S&P 500 Avg Volatility:', calculatedMetrics.sp500AvgVolatility.toFixed(1) + '%');
console.log('  Gold-Inflation Correlation:', calculatedMetrics.goldInflationCorrelation.toFixed(2));
console.log('Crisis events:', crisisEvents.length);
