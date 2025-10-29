// ==================== CSV LOADER UTILITY ====================
// Loads CSV files and parses them into usable data structures

class CSVLoader {
    static async loadCSV(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
            }
            const text = await response.text();
            return this.parseCSV(text);
        } catch (error) {
            console.error(`Error loading CSV from ${filePath}:`, error);
            return null;
        }
    }

    static parseCSV(text) {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            data.push(row);
        }

        return data;
    }

    static async loadAllData() {
        console.log('Loading data from CSV files...');
        
        // Load all CSV files
        const [goldCSV, sp500CSV, inflationCSV] = await Promise.all([
            this.loadCSV('data/gold_prices.csv'),
            this.loadCSV('data/sp500.csv'),
            this.loadCSV('data/inflation_cpi.csv')
        ]);

        // Transform to expected format
        const goldData = {
            prices: goldCSV ? goldCSV.map(row => ({
                date: row.Date,
                price: parseFloat(row.Price)
            })) : []
        };

        const sp500Data = {
            prices: sp500CSV ? sp500CSV.map(row => ({
                date: row.Date,
                price: parseFloat(row.Price)
            })) : []
        };

        const inflationData = {
            data: inflationCSV ? inflationCSV.map(row => ({
                date: row.Date,
                rate: parseFloat(row.Rate)
            })) : []
        };

        // Calculate volatility from price data
        const volatilityData = this.calculateVolatility(goldData.prices, sp500Data.prices);

        // Define crisis events
        const crisisEvents = [
            {
                date: '2008-09-15',
                title: 'Lehman Brothers Collapse',
                description: '2008 Financial Crisis - Stock market crashed, gold surged as safe haven',
                color: 'rgba(255, 68, 68, 0.3)'
            },
            {
                date: '2020-03-15',
                title: 'COVID-19 Pandemic',
                description: 'Global pandemic causes market turmoil and flight to safety',
                color: 'rgba(255, 68, 68, 0.3)'
            },
            {
                date: '2020-08-06',
                title: 'Gold Reaches Record High',
                description: 'Unprecedented monetary stimulus drives gold to all-time highs',
                color: 'rgba(68, 255, 68, 0.3)'
            },
            {
                date: '2022-03-08',
                title: 'Russia-Ukraine War',
                description: 'Geopolitical tensions spike, gold rises as uncertainty hedge',
                color: 'rgba(255, 68, 68, 0.3)'
            },
            {
                date: '2024-10-21',
                title: '2024-25 Trade Uncertainty',
                description: 'Tariff concerns and trade tensions boost gold to new highs',
                color: 'rgba(255, 165, 0, 0.3)'
            }
        ];

        console.log('Data loaded successfully!');
        console.log('Gold data points:', goldData.prices.length);
        console.log('S&P 500 data points:', sp500Data.prices.length);
        console.log('Inflation data points:', inflationData.data.length);

        return {
            goldData,
            sp500Data,
            inflationData,
            crisisEvents,
            volatilityData
        };
    }

    static calculateVolatility(goldPrices, sp500Prices) {
        // Calculate rolling 30-day volatility (simplified)
        const goldVolatility = [];
        const sp500Volatility = [];

        const windowSize = 12; // 12 months for annual data

        for (let i = windowSize; i < goldPrices.length; i++) {
            const goldWindow = goldPrices.slice(i - windowSize, i);
            const sp500Window = sp500Prices.slice(i - windowSize, i);

            goldVolatility.push({
                date: goldPrices[i].date,
                volatility: this.calculateStdDev(goldWindow.map(d => d.price))
            });

            sp500Volatility.push({
                date: sp500Prices[i].date,
                volatility: this.calculateStdDev(sp500Window.map(d => d.price))
            });
        }

        return { gold: goldVolatility, sp500: sp500Volatility };
    }

    static calculateStdDev(values) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }
}

// Initialize data on page load
let dataLoaded = false;
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await CSVLoader.loadAllData();
        
        // Make data globally available
        window.goldData = data.goldData;
        window.sp500Data = data.sp500Data;
        window.inflationData = data.inflationData;
        window.crisisEvents = data.crisisEvents;
        window.volatilityData = data.volatilityData;
        
        dataLoaded = true;
        
        // Dispatch event to notify visualizations that data is ready
        window.dispatchEvent(new Event('dataLoaded'));
        
    } catch (error) {
        console.error('Failed to load data:', error);
        alert('Failed to load data files. Please ensure CSV files are in the data/ folder.');
    }
});
