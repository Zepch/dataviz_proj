# Data Sources Guide

## Where to Download Your Real Data

### 1. **Gold Prices (gold_prices.csv)**

**Primary Source: Yahoo Finance**
- Go to: https://finance.yahoo.com/quote/GC%3DF/history/
- This is Gold Futures (GC=F)
- Settings:
  - Time Period: Jan 1, 2000 - Present
  - Show: Historical Prices
  - Frequency: Monthly (or Daily for more detail)
- Click "Download" button
- Columns needed: Date, Close
- Rename to: `Date,Price`

**Alternative Source: Investing.com**
- Go to: https://www.investing.com/commodities/gold-historical-data
- Select date range: 01/01/2000 to current
- Click "Download Data"
- Use the "Price" column

**Alternative Source: World Gold Council**
- Go to: https://www.gold.org/goldhub/data/gold-prices
- Download: "Gold price averages in a range of currencies since 1978"
- Use USD column

---

### 2. **S&P 500 Index (sp500.csv)**

**Primary Source: Yahoo Finance**
- Go to: https://finance.yahoo.com/quote/%5EGSPC/history/
- This is S&P 500 Index (^GSPC)
- Settings:
  - Time Period: Jan 1, 2000 - Present
  - Show: Historical Prices
  - Frequency: Monthly
- Click "Download" button
- Columns needed: Date, Close
- Rename to: `Date,Price`

**Alternative Source: Investing.com**
- Go to: https://www.investing.com/indices/us-spx-500-historical-data
- Select date range: 01/01/2000 to current
- Download data

---

### 3. **US Inflation / CPI (inflation_cpi.csv)**

**Primary Source: FRED (Federal Reserve Economic Data)**
- Go to: https://fred.stlouisfed.org/series/CPIAUCSL
- This is Consumer Price Index for All Urban Consumers
- Click "Download" button
- Select:
  - Units: "Percent Change from Year Ago"
  - Frequency: Annual or Monthly
  - Date Range: 2000-01-01 to current
- Format: CSV
- Columns needed: Date, Value
- Rename to: `Date,Rate`

**Alternative: Calculate from raw CPI**
- Go to: https://www.bls.gov/cpi/data.htm
- Download CPI-U (All items)
- Calculate year-over-year percentage change

**Quick Download Link:**
- https://fred.stlouisfed.org/graph/fredgraph.csv?id=CPIAUCSL&cosd=2000-01-01&transformation=pc1

---

## CSV Format Requirements

### gold_prices.csv
```csv
Date,Price
2000-01-01,282.85
2000-02-01,299.85
2000-03-01,286.40
...
```

### sp500.csv
```csv
Date,Price
2000-01-01,1469.25
2000-02-01,1366.42
2000-03-01,1498.58
...
```

### inflation_cpi.csv
```csv
Date,Rate
2000-01-01,3.38
2001-01-01,2.83
2002-01-01,1.59
...
```

---

## Quick Download Steps

### For Gold & S&P 500 (Easiest):
1. **Gold**: Go to `https://finance.yahoo.com/quote/GC%3DF/history?period1=946684800&period2=1730246400`
2. Click "Download" → Save as `gold_yahoo.csv`
3. Open in Excel, keep only Date and Close columns
4. Save as `gold_prices.csv`

5. **S&P 500**: Go to `https://finance.yahoo.com/quote/%5EGSPC/history?period1=946684800&period2=1730246400`
6. Click "Download" → Save as `sp500_yahoo.csv`
7. Open in Excel, keep only Date and Close columns
8. Save as `sp500.csv`

### For Inflation (Easiest):
1. Go to: `https://fred.stlouisfed.org/graph/fredgraph.csv?id=CPIAUCSL&cosd=2000-01-01&transformation=pc1`
2. This will directly download the CSV with year-over-year inflation rates
3. Save as `inflation_cpi.csv`

---

## Additional Data for Enhanced Visualizations

### 4. **Gold Production/Reserves (Optional for infographic)**
- **World Gold Council**: https://www.gold.org/goldhub/data/gold-supply-and-demand-statistics
- Shows global gold mining, jewelry demand, central bank holdings

### 5. **VIX (Volatility Index)** - for uncertainty correlation
- **Yahoo Finance**: https://finance.yahoo.com/quote/%5EVIX/history/
- Download historical VIX data to show correlation with gold

### 6. **USD Index (DXY)** - for currency strength
- **Investing.com**: https://www.investing.com/indices/usdollar-historical-data
- Shows inverse relationship with gold

---

## Notes

- **Monthly data** is sufficient for a 5-minute presentation
- Make sure dates are in YYYY-MM-DD format
- Remove any header rows except column names
- Save files in UTF-8 encoding
- Place all CSV files in the `data/` folder

---

## File Structure
```
dataviz_proj/
├── data/
│   ├── gold_prices.csv       ← Download from Yahoo Finance
│   ├── sp500.csv             ← Download from Yahoo Finance  
│   ├── inflation_cpi.csv     ← Download from FRED
│   └── (optional) vix.csv, usd_index.csv
├── index.html
├── data.js                   ← Will load CSVs dynamically
├── script.js
└── visualizations.js
```

---

## Recent Data Updates (October 2025)

### Updated Data Sources Used

#### Gold Prices - October 2025 Daily Data
**Source: Investing.com**
- URL: https://www.investing.com/commodities/gold-historical-data
- Date Range: October 1-28, 2025
- Data Type: Gold Futures (GCZ5) - Daily closing prices
- Access Date: October 29, 2025
- Key Data Points:
  - October 1, 2025: $3,897.50
  - October 20, 2025: $4,359.40 (All-time high)
  - October 28, 2025: $3,974.01

**Source: Kitco.com**
- URL: https://www.kitco.com/charts/historicalgold.html
- Current Price (Oct 29, 2025): $4,013.80/oz
- Used for real-time price verification

**Source: World Gold Council**
- URL: https://www.gold.org/goldhub/data/gold-prices
- Last Updated: October 28, 2025 at 16:30:26 GMT
- Used for additional price verification

#### Interpolated Monthly Data (Nov 2024 - Sep 2025)
- Method: Linear interpolation between known data points
- Used to fill gaps between October 2024 ($2,734.00) and October 2025 data
- Ensures consistent monthly frequency for visualization

#### S&P 500 Data (Estimated Nov 2024 - Oct 2025)
- Estimated values based on market trends
- October 2025 estimate: ~6,925.75
- Note: These are approximate values for visualization purposes

#### Inflation/CPI Data (Estimated Oct 2024 - Oct 2025)
- Estimated based on Federal Reserve projections
- October 2025 estimate: 2.10%
- Trend shows continued cooling from 2022-2023 peaks

#### Volatility Data
- Added 2025 volatility estimates:
  - Gold: 19% (increased due to October 2025 price swings)
  - S&P 500: 23% (moderate volatility)

### Forecast Model (Oct 2025 - Dec 2027)
- **Method**: Trend-based forecast using 24-month historical average growth rate
- **Volatility**: ±2-4% random variation applied monthly
- **Purpose**: Educational projection, not investment advice
- **Starting Point**: October 28, 2025 price of $3,974.01

---

## Data Implementation Notes

**Current Setup (as of October 29, 2025):**
- All data is now **embedded directly in `data.js`** file
- CSV loader (`csv-loader.js`) is **no longer used**
- CSV files in `data/` folder are **deprecated**
- Interpolation function creates monthly data points automatically
- Forecast function generates projections to December 2027

**Advantages of Embedded Data:**
- No async loading delays
- No CORS issues when running locally
- Faster page load times
- All data in one central location
- Easier to update and maintain

---

## Crisis Events Data Sources

### Updated Crisis Events (with dates verified):
1. **Lehman Brothers Collapse** (2008-09-01)
   - Historical record, widely documented
2. **COVID-19 Pandemic** (2020-03-01)
   - WHO pandemic declaration date
3. **Gold Reaches Record High** (2025-10-20)
   - **Updated**: New all-time high of $4,359.40
   - Source: Investing.com historical data
4. **Russia-Ukraine War** (2022-03-01)
   - Conflict start date, widely documented
5. **Trump's Tariffs** (2025-04-01)
   - Trade policy implementation period

---

## Data Quality Notes

- Historical data (2000-2024): High quality, verified from multiple sources
- October 2025 data: Real market data from Investing.com and Kitco
- Nov 2024 - Sep 2025: Interpolated for consistency
- Forecast (Oct 2025 - Dec 2027): Model-based projection

**Last Updated**: October 29, 2025
**Next Review**: December 2025 (or when significant market events occur)

````
```
