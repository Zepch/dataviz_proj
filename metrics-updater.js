// ==================== METRICS UPDATER ====================
// Updates HTML elements with calculated values from data.js

function updateMetricsInHTML() {
    // Wait for calculatedMetrics to be available
    if (typeof calculatedMetrics === 'undefined') {
        console.log('Waiting for metrics to be calculated...');
        setTimeout(updateMetricsInHTML, 100);
        return;
    }
    
    console.log('📊 Updating HTML with calculated metrics...');
    
    // Section 2: Key Insight - Gold total return
    const totalReturnElement = document.querySelector('#slide-1 .insight-box .highlight');
    if (totalReturnElement) {
        totalReturnElement.textContent = '~' + Math.round(calculatedMetrics.goldTotalReturn / 100) * 100 + '%';
    }
    
    // Get the last forecast value (2027-12-31)
    const forecastPrices = goldData.prices.filter(d => d.isForecast);
    const lastForecastPrice = forecastPrices.length > 0 ? forecastPrices[forecastPrices.length - 1].price : 0;
    
    // Update the detailed text with forecast
    const insightText = document.querySelector('#slide-1 .insight-box p');
    if (insightText) {
        insightText.innerHTML = `Gold has increased by <span class="highlight">~${Math.round(calculatedMetrics.goldTotalReturn / 100) * 100}%</span> since 2000, reaching record highs above $4,300 in 2025. Using Exponential Triple Smoothing, gold is projected to reach <span class="highlight">$${lastForecastPrice.toLocaleString()}</span> by the end of <span class="highlight">2027</span>.`;
    }
    
    // Also update the forecast price element if it exists separately
    const forecastPriceElement = document.getElementById('forecast-price');
    if (forecastPriceElement) {
        forecastPriceElement.textContent = '$' + lastForecastPrice.toLocaleString();
    }
    
    // Section 3: Crisis Performance Stats
    const goldCrisisStat = document.querySelector('#slide-2 .stat-card:nth-child(1) .stat-number');
    const sp500CrisisStat = document.querySelector('#slide-2 .stat-card:nth-child(2) .stat-number');
    
    if (goldCrisisStat) {
        const value = calculatedMetrics.goldCrisisPerformance;
        goldCrisisStat.textContent = (value >= 0 ? '+' : '') + value.toFixed(0) + '%';
    }
    
    if (sp500CrisisStat) {
        const value = calculatedMetrics.sp500CrisisPerformance;
        sp500CrisisStat.textContent = (value >= 0 ? '+' : '') + value.toFixed(0) + '%';
    }
    
    // Section 4: Correlation value
    const correlationElement = document.querySelector('#slide-3 .insight-box .highlight');
    if (correlationElement) {
        correlationElement.textContent = calculatedMetrics.goldInflationCorrelation.toFixed(2);
    }
    
    // Section 5: Volatility Stats
    const goldVolStat = document.querySelector('#slide-4 .stat-card:nth-child(1) .stat-number');
    const sp500VolStat = document.querySelector('#slide-4 .stat-card:nth-child(2) .stat-number');
    
    if (goldVolStat) {
        goldVolStat.textContent = calculatedMetrics.goldAvgVolatility.toFixed(0) + '%';
    }
    
    if (sp500VolStat) {
        sp500VolStat.textContent = calculatedMetrics.sp500AvgVolatility.toFixed(0) + '%';
    }
    
    // Section 7: CAGR value
    const cagrElement = document.querySelector('#slide-6 .perf-item:nth-child(1) .perf-value');
    if (cagrElement) {
        cagrElement.textContent = calculatedMetrics.goldCAGR.toFixed(1) + '%';
    }
    
    console.log('✅ All metrics updated successfully!');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateMetricsInHTML);
} else {
    updateMetricsInHTML();
}
