// ==================== CHART CONFIGURATIONS ====================

// Common chart options
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#FFD700',
                font: { size: 16, weight: 'bold' }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            titleColor: '#FFD700',
            bodyColor: '#ffffff',
            borderColor: '#FFD700',
            borderWidth: 2,
            padding: 12,
            titleFont: { size: 16, weight: 'bold' },
            bodyFont: { size: 14 }
        }
    },
    scales: {
        x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { 
                color: '#cccccc',
                font: { size: 14 }
            }
        },
        y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { 
                color: '#cccccc',
                font: { size: 14 }
            }
        }
    }
};

// ==================== CHART 1: GOLD TREND WITH CRISIS MARKERS ====================
function createGoldTrendChart() {
    const ctx = document.getElementById('goldTrendChart').getContext('2d');
    
    // Split data into historical and forecast
    const historicalData = goldData.prices.filter(d => !d.isForecast);
    const forecastData = goldData.prices.filter(d => d.isForecast);
    
    // Add last historical point to forecast for continuity
    if (historicalData.length > 0 && forecastData.length > 0) {
        forecastData.unshift(historicalData[historicalData.length - 1]);
    }
    
    // Create crisis event markers with dented arrows (elbow connectors) and labels on top left
    const annotations = {};
    const labelOffsets = [1000, 1500, 900, 1400, -1500, 950]; // Different vertical offsets to avoid overlap
    const horizontalOffset = 0; // Horizontal offset for the dent (pointing left)
    
    crisisEvents.forEach((event, index) => {
        const eventPrice = goldData.prices.find(d => d.date === event.date)?.price || 
                          goldData.prices[Math.floor(goldData.prices.length * (index / crisisEvents.length))].price;
        
        const labelY = eventPrice + labelOffsets[index % labelOffsets.length];
        
        // Calculate the elbow point (where horizontal meets vertical)
        const eventDate = new Date(event.date);
        const elbowDate = new Date(eventDate.getTime() - (horizontalOffset * 24 * 60 * 60 * 1000)); // Offset in days
        
        // Marker point on the line
        annotations[`marker${index}`] = {
            type: 'point',
            xValue: event.date,
            yValue: eventPrice,
            backgroundColor: 'rgba(255, 68, 68, 0.95)',
            borderColor: '#ffffff',
            borderWidth: 3,
            radius: 10
        };
        
        // Vertical line from marker up to elbow point
        annotations[`arrowVertical${index}`] = {
            type: 'line',
            xMin: event.date,
            xMax: event.date,
            yMin: eventPrice + 15,
            yMax: labelY - 30,
            borderColor: 'rgba(255, 68, 68, 0.8)',
            borderWidth: 2.5
        };
        
        // Horizontal line from elbow point to the left (creating the dent)
        annotations[`arrowHorizontal${index}`] = {
            type: 'line',
            xMin: elbowDate,
            xMax: event.date,
            yMin: labelY - 30,
            yMax: labelY - 30,
            borderColor: 'rgba(255, 68, 68, 0.8)',
            borderWidth: 2.5
        };
        
        // Label box at the top left (positioned to the left of the horizontal line)
        annotations[`label${index}`] = {
            type: 'label',
            xValue: elbowDate,
            yValue: labelY,
            backgroundColor: 'rgba(255, 68, 68, 0.95)',
            content: event.title,
            color: 'white',
            font: { size: 11, weight: 'bold' },
            padding: 8,
            borderRadius: 4,
            position: 'center'
        };
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Gold Price (USD/oz)',
                    data: historicalData.map(d => ({ x: d.date, y: d.price })),
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#FFD700',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                },
                {
                    label: 'Forecast to 2027',
                    data: forecastData.map(d => ({ x: d.date, y: d.price })),
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                    borderWidth: 3,
                    borderDash: [10, 5], // Dotted line
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#FFD700',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                annotation: { annotations },
                title: {
                    display: true,
                    text: 'Gold Price Journey: 2000-2027 (with Forecast) and Major Events',
                    color: '#FFD700',
                    font: { size: 18, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'year' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { 
                        color: '#cccccc',
                        font: { size: 14 }
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#cccccc',
                        font: { size: 14 },
                        callback: value => '$' + value.toLocaleString()
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// ==================== CHART 2: GOLD VS S&P 500 ====================
function createGoldVsStocksChart() {
    const ctx = document.getElementById('goldVsStocksChart').getContext('2d');
    
    // Filter out forecast data for this comparison chart
    const historicalGold = goldData.prices.filter(d => !d.isForecast);
    
    // Calculate $100 investment growth from 2000
    const goldBase = historicalGold[0].price;
    const sp500Base = sp500Data.prices[0].price;
    
    // Create a map of S&P 500 prices by date
    const sp500Map = new Map();
    sp500Data.prices.forEach(item => {
        sp500Map.set(item.date, item.price);
    });
    
    // Map S&P 500 to gold's timeline
    let lastKnownSP500Price = sp500Base;
    const sp500MappedData = historicalGold.map(goldItem => {
        if (sp500Map.has(goldItem.date)) {
            lastKnownSP500Price = sp500Map.get(goldItem.date);
        }
        return (lastKnownSP500Price / sp500Base) * 100;
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalGold.map(d => d.date),
            datasets: [
                {
                    label: '$100 in Gold (2000)',
                    data: historicalGold.map(d => (d.price / goldBase) * 100),
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y',
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#FFD700',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                },
                {
                    label: '$100 in S&P 500 (2000)',
                    data: sp500MappedData,
                    borderColor: '#4169E1',
                    backgroundColor: 'rgba(65, 105, 225, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y',
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#4169E1',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Growth of $100 Invested in 2000',
                    color: '#FFD700',
                    font: { size: 18 }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'year' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#cccccc' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#cccccc',
                        callback: value => '$' + value.toFixed(0)
                    },
                    title: {
                        display: true,
                        text: 'Portfolio Value',
                        color: '#FFD700'
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// ==================== CHART 3: GOLD VS INFLATION ====================
function createGoldInflationChart() {
    const ctx = document.getElementById('goldInflationChart').getContext('2d');
    
    // Filter out forecast data
    const historicalGold = goldData.prices.filter(d => !d.isForecast);
    
    // Create aligned datasets
    const alignedData = inflationData.data.map(inf => {
        const goldPoint = historicalGold.find(g => g.date === inf.date);
        return {
            date: inf.date,
            inflation: inf.rate,
            gold: goldPoint ? goldPoint.price : null
        };
    }).filter(d => d.gold !== null);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: alignedData.map(d => d.date),
            datasets: [
                {
                    label: 'Gold Price (USD/oz)',
                    data: alignedData.map(d => d.gold),
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 3,
                    yAxisID: 'y',
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#FFD700',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                },
                {
                    label: 'Inflation Rate (%)',
                    data: alignedData.map(d => d.inflation),
                    borderColor: '#FF4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    borderWidth: 3,
                    yAxisID: 'y1',
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#FF4444',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Gold Price vs Inflation Rate',
                    color: '#FFD700',
                    font: { size: 18 }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'year' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#cccccc' }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#FFD700',
                        callback: value => '$' + value
                    },
                    title: {
                        display: true,
                        text: 'Gold Price',
                        color: '#FFD700'
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    grid: { display: false },
                    ticks: {
                        color: '#FF4444',
                        callback: value => value + '%'
                    },
                    title: {
                        display: true,
                        text: 'Inflation Rate',
                        color: '#FF4444'
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// ==================== CHART 4: VOLATILITY COMPARISON ====================
function createVolatilityChart() {
    const ctx = document.getElementById('volatilityChart').getContext('2d');
    
    // Use all data points to highlight major events (no sampling)
    const sampledGold = volatilityData.gold;
    const sampledSP500 = volatilityData.sp500;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampledGold.map(d => d.date),
            datasets: [
                {
                    label: 'Gold Volatility',
                    data: sampledGold.map(d => d.volatility),
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderColor: '#FFD700',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.2, // Reduced tension for sharper peaks
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#FFD700',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                },
                {
                    label: 'S&P 500 Volatility',
                    data: sampledSP500.map(d => d.volatility),
                    backgroundColor: 'rgba(65, 105, 225, 0.1)',
                    borderColor: '#4169E1',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.2, // Reduced tension for sharper peaks
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#4169E1',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Market Volatility Comparison - Major Crisis Events Highlighted',
                    color: '#FFD700',
                    font: { size: 18 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'year' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#cccccc' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#cccccc',
                        callback: value => value + '%'
                    },
                    title: {
                        display: true,
                        text: 'Volatility (%)',
                        color: '#FFD700'
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// ==================== CHART 5: INTERACTIVE TIMELINE ====================
let interactiveChart;
let currentDataIndex = 0;

// Calculate performance after each event with custom periods
function calculateEventPerformance(eventDate, historicalData, eventTitle) {
    const eventIndex = historicalData.findIndex(d => d.date === eventDate);
    if (eventIndex === -1) return null;
    
    // Determine the period based on event type
    let monthsAfter = 12; // Default 1 year
    
    if (eventTitle.includes('Lehman Brothers')) {
        monthsAfter = 24; // 2 years
    } else if (eventTitle.includes('COVID-19') || eventTitle.includes('Pandemic')) {
        monthsAfter = 6; // 6 months
    } else if (eventTitle.includes('Russia-Ukraine') || eventTitle.includes('Ukraine')) {
        monthsAfter = 36; // 5 months
    } else if (eventTitle.includes('Black Monday')) {
        monthsAfter = 1;
    } else if (eventTitle.includes('Trump') || eventTitle.includes('Tariffs')) {
        // Calculate months from event to last data point (Oct 27, 2025)
        monthsAfter = historicalData.length - eventIndex - 1;
    }
    
    const laterIndex = Math.min(eventIndex + monthsAfter, historicalData.length - 1);
    const eventPrice = historicalData[eventIndex].price;
    const laterPrice = historicalData[laterIndex].price;
    
    const performance = ((laterPrice - eventPrice) / eventPrice) * 100;
    
    return {
        eventIndex,
        oneYearLaterIndex: laterIndex, // Keep same property name for compatibility
        performance,
        isPositive: performance >= 0,
        periodMonths: monthsAfter
    };
}

function createInteractiveChart() {
    const ctx = document.getElementById('interactiveChart').getContext('2d');
    
    // Use only historical data for interactive timeline
    const historicalData = goldData.prices.filter(d => !d.isForecast);
    const sp500Historical = sp500Data.prices;
    
    interactiveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [historicalData[0].date],
            datasets: [
                {
                    label: 'Gold Price',
                    data: [historicalData[0].price],
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#FFD700',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3,
                    yAxisID: 'y',
                    segment: {
                        backgroundColor: (ctx) => {
                            // This will be dynamically updated
                            return 'rgba(255, 215, 0, 0.2)';
                        },
                        borderColor: '#FFD700'
                    }
                },
                {
                    label: 'S&P 500',
                    data: [sp500Historical[0].price],
                    borderColor: '#4169E1',
                    backgroundColor: 'rgba(65, 105, 225, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#4169E1',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3,
                    yAxisID: 'y1',
                    segment: {
                        backgroundColor: (ctx) => {
                            // This will be dynamically updated
                            return 'rgba(65, 105, 225, 0.2)';
                        },
                        borderColor: '#4169E1'
                    }
                }
            ]
        },
        options: {
            ...commonOptions,
            animation: {
                duration: 500
            },
            plugins: {
                ...commonOptions.plugins
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'year' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#cccccc' }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: false,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#FFD700',
                        callback: value => '$' + value
                    },
                    title: {
                        display: true,
                        text: 'Gold Price',
                        color: '#FFD700'
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: false,
                    grid: { display: false },
                    ticks: {
                        color: '#4169E1',
                        callback: value => '$' + value
                    },
                    title: {
                        display: true,
                        text: 'S&P 500',
                        color: '#4169E1'
                    }
                }
            }
        }
    });
}

function updateInteractiveChart(index) {
    // Use only historical data
    const historicalData = goldData.prices.filter(d => !d.isForecast);
    const sp500Historical = sp500Data.prices;
    const dataSlice = historicalData.slice(0, index + 1);
    
    // Match S&P 500 data to gold's date range
    const startDate = new Date(historicalData[0].date);
    const endDate = new Date(historicalData[index].date);
    const sp500Slice = sp500Historical.filter(d => {
        const date = new Date(d.date);
        return date >= startDate && date <= endDate;
    });
    
    // Calculate dynamic Y-axis range for gold
    const prices = dataSlice.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
    const padding = range * 0.15; // 15% padding
    
    // Calculate appropriate step size for uniform ticks
    const rawRange = range + (padding * 2);
    let stepSize;
    if (rawRange < 100) stepSize = 10;
    else if (rawRange < 500) stepSize = 50;
    else if (rawRange < 1000) stepSize = 100;
    else if (rawRange < 2000) stepSize = 200;
    else if (rawRange < 5000) stepSize = 500;
    else stepSize = 1000;
    
    // Round to step boundaries for uniform ticks
    const roundedMin = Math.floor((minPrice - padding) / stepSize) * stepSize;
    const roundedMax = Math.ceil((maxPrice + padding) / stepSize) * stepSize;
    
    // Calculate dynamic Y-axis range for S&P 500
    const sp500Prices = sp500Slice.map(d => d.price);
    const minSP500 = Math.min(...sp500Prices);
    const maxSP500 = Math.max(...sp500Prices);
    const sp500Range = maxSP500 - minSP500;
    const sp500Padding = sp500Range * 0.15;
    
    const sp500RoundedMin = Math.floor((minSP500 - sp500Padding) / 100) * 100;
    const sp500RoundedMax = Math.ceil((maxSP500 + sp500Padding) / 100) * 100;
    
    // Create arrays to track background colors for each data point
    const goldBackgroundColors = new Array(dataSlice.length).fill('rgba(255, 215, 0, 0.2)');
    
    // Check for active events within the current timeline and color the segments
    crisisEvents.forEach((event) => {
        const eventIndex = historicalData.findIndex(d => d.date === event.date);
        if (eventIndex !== -1 && eventIndex <= index) {
            const performance = calculateEventPerformance(event.date, historicalData, event.title);
            if (performance) {
                // Show highlight from event start, up to current slider position or end of tracking period
                const endIndex = Math.min(performance.oneYearLaterIndex, index);
                
                // Color the segments during the event period for gold only
                const goldColor = performance.isPositive 
                    ? 'rgba(0, 255, 0, 0.3)'  // Green for positive gold performance
                    : 'rgba(255, 0, 0, 0.3)';  // Red for negative gold performance
                
                for (let i = eventIndex; i <= endIndex && i < dataSlice.length; i++) {
                    goldBackgroundColors[i] = goldColor;
                }
            }
        }
    });
    
    // Create a map of S&P 500 prices by date for easy lookup
    const sp500Map = new Map();
    sp500Slice.forEach(item => {
        sp500Map.set(item.date, item.price);
    });
    
    // Map S&P 500 data to match gold's timeline
    // For dates without S&P 500 data, use the most recent available price
    let lastKnownSP500Price = sp500Slice[0]?.price || 0;
    const sp500MappedData = dataSlice.map(goldItem => {
        if (sp500Map.has(goldItem.date)) {
            lastKnownSP500Price = sp500Map.get(goldItem.date);
            return lastKnownSP500Price;
        }
        // Use last known price for dates without S&P 500 data
        return lastKnownSP500Price;
    });
    
    interactiveChart.data.labels = dataSlice.map(d => d.date);
    interactiveChart.data.datasets[0].data = dataSlice.map(d => d.price);
    interactiveChart.data.datasets[1].data = sp500MappedData;
    
    // Update the datasets with segment-specific colors
    interactiveChart.data.datasets[0].segment = {
        backgroundColor: (ctx) => {
            const index = ctx.p0DataIndex;
            return goldBackgroundColors[index] || 'rgba(255, 215, 0, 0.2)';
        },
        borderColor: '#FFD700'
    };
    
    // S&P 500 keeps consistent styling without event highlighting
    interactiveChart.data.datasets[1].segment = {
        backgroundColor: 'rgba(65, 105, 225, 0.2)',
        borderColor: '#4169E1'
    };
    
    // Update Y-axis ranges dynamically with uniform steps
    interactiveChart.options.scales.y.min = Math.max(0, roundedMin);
    interactiveChart.options.scales.y.max = roundedMax;
    interactiveChart.options.scales.y.ticks.stepSize = stepSize;
    
    interactiveChart.options.scales.y1.min = Math.max(0, sp500RoundedMin);
    interactiveChart.options.scales.y1.max = sp500RoundedMax;
    
    interactiveChart.update('none');
    
    // Update event info
    const currentPrice = historicalData[index];
    const currentDate = new Date(currentPrice.date);
    
    // Find the closest S&P 500 price for the current date
    let currentSP500 = sp500Slice[sp500Slice.length - 1]; // Default to last available
    const startPrice = historicalData[0];
    const change = ((currentPrice.price - startPrice.price) / startPrice.price * 100).toFixed(1);
    
    document.getElementById('currentDate').textContent = new Date(currentPrice.date).getFullYear();
    document.getElementById('goldPrice').textContent = '$' + currentPrice.price.toLocaleString();
    document.getElementById('priceChange').textContent = (change > 0 ? '+' : '') + change + '%';
    
    // Check if we're within any crisis event period
    let activeEvent = null;
    for (const event of crisisEvents) {
        const eventIndex = historicalData.findIndex(d => d.date === event.date);
        if (eventIndex !== -1) {
            const performance = calculateEventPerformance(event.date, historicalData, event.title);
            if (performance && index >= eventIndex && index <= performance.oneYearLaterIndex) {
                // We're within this event's tracking period
                activeEvent = event;
                break;
            }
        }
    }
    
    if (activeEvent) {
        document.getElementById('eventTitle').textContent = activeEvent.title;
        document.getElementById('eventDescription').textContent = activeEvent.description;
    } else {
        document.getElementById('eventTitle').textContent = 'Market Activity';
        document.getElementById('eventDescription').textContent = 'Gold: $' + currentPrice.price + ' | S&P 500: $' + currentSP500.price.toFixed(2);
    }
}

// ==================== GLOBE VISUALIZATION (D3.js) ====================
function createGlobeVisualization() {
    const container = document.getElementById('globe-container');
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    const svg = d3.select('#globe-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Create animated gold particles
    const particles = d3.range(50).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    }));
    
    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        });
        
        svg.selectAll('circle')
            .data(particles)
            .join('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.radius)
            .attr('fill', '#FFD700')
            .attr('opacity', 0.6);
    }
    
    setInterval(updateParticles, 50);
}

// ==================== INITIALIZE ALL CHARTS ====================
function initializeVisualizations() {
    // Data is now embedded, no need to check for loading
    console.log('✅ Initializing visualizations with embedded data');
    console.log('Gold data points:', window.goldData.prices.length);
    console.log('S&P 500 data points:', window.sp500Data.prices.length);
    console.log('Inflation data points:', window.inflationData.data.length);
    
    createGoldTrendChart();
    createGoldVsStocksChart();
    createGoldInflationChart();
    createVolatilityChart();
    createInteractiveChart();
    createGlobeVisualization();
    
    // Setup interactive timeline slider
    const slider = document.getElementById('timeSlider');
    if (slider) {
        const historicalData = goldData.prices.filter(d => !d.isForecast);
        if (historicalData.length > 0) {
            slider.max = historicalData.length - 1;
            
            // Create event markers on the slider (excluding Trump Tariffs)
            const markerContainer = document.getElementById('eventMarkers');
            if (markerContainer) {
                crisisEvents.forEach(event => {
                    // Skip Trump Tariffs event
                    if (event.title.includes('Trump') || event.title.includes('Tariff')) {
                        return;
                    }
                    
                    const eventIndex = historicalData.findIndex(d => d.date === event.date);
                    if (eventIndex !== -1) {
                        const performance = calculateEventPerformance(event.date, historicalData, event.title);
                        if (performance) {
                            const marker = document.createElement('div');
                            marker.className = 'event-marker'; // Remove color-based classes
                            marker.style.left = `${(eventIndex / (historicalData.length - 1)) * 100}%`;
                            marker.title = `${event.title}: ${performance.performance.toFixed(1)}% over ${performance.periodMonths} months`;
                            markerContainer.appendChild(marker);
                        }
                    }
                });
            }
            
            slider.addEventListener('input', (e) => {
                const index = parseInt(e.target.value);
                updateInteractiveChart(index);
            });
        }
    }
}

// Initialize when DOM is ready (data is immediately available from data.js)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVisualizations);
} else {
    initializeVisualizations();
}
