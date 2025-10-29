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
    
    // Create crisis event markers with simple arrows and non-overlapping labels
    const annotations = {};
    const labelOffsets = [500, 1500, 600, 400, 550]; // Different vertical offsets to avoid overlap
    
    crisisEvents.forEach((event, index) => {
        const eventPrice = goldData.prices.find(d => d.date === event.date)?.price || 
                          goldData.prices[Math.floor(goldData.prices.length * (index / crisisEvents.length))].price;
        
        const labelY = eventPrice + labelOffsets[index % labelOffsets.length];
        
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
        
        // Arrow line from label pointing down to marker
        annotations[`arrow${index}`] = {
            type: 'line',
            xMin: event.date,
            xMax: event.date,
            yMin: labelY - 30,
            yMax: eventPrice + 15,
            borderColor: 'rgba(255, 68, 68, 0.8)',
            borderWidth: 2.5
        };
        
        // Label box above
        annotations[`label${index}`] = {
            type: 'label',
            xValue: event.date,
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
            labels: goldData.prices.map(d => d.date),
            datasets: [{
                label: 'Gold Price (USD/oz)',
                data: goldData.prices.map(d => d.price),
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
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                annotation: { annotations },
                title: {
                    display: true,
                    text: 'Gold Price Journey: 2000-2025 with Major Events',
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
            }
        }
    });
}

// ==================== CHART 2: GOLD VS S&P 500 ====================
function createGoldVsStocksChart() {
    const ctx = document.getElementById('goldVsStocksChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: goldData.prices.map(d => d.date),
            datasets: [
                {
                    label: 'Gold (Normalized)',
                    data: goldData.prices.map(d => (d.price / 280) * 100),
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'S&P 500',
                    data: sp500Data.prices.map(d => d.price),
                    borderColor: '#4169E1',
                    backgroundColor: 'rgba(65, 105, 225, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Indexed Performance: Gold vs S&P 500 (2000 = 100)',
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
                        callback: value => value
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
    
    // Create aligned datasets
    const alignedData = inflationData.data.map(inf => {
        const goldPoint = goldData.prices.find(g => g.date === inf.date);
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
                    tension: 0.4
                },
                {
                    label: 'Inflation Rate (%)',
                    data: alignedData.map(d => d.inflation),
                    borderColor: '#FF4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    borderWidth: 3,
                    yAxisID: 'y1',
                    tension: 0.4
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
            }
        }
    });
}

// ==================== CHART 4: VOLATILITY COMPARISON ====================
function createVolatilityChart() {
    const ctx = document.getElementById('volatilityChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: volatilityData.gold.map(d => d.date),
            datasets: [
                {
                    label: 'Gold Volatility',
                    data: volatilityData.gold.map(d => d.volatility),
                    backgroundColor: 'rgba(255, 215, 0, 0.7)',
                    borderColor: '#FFD700',
                    borderWidth: 1
                },
                {
                    label: 'S&P 500 Volatility',
                    data: volatilityData.sp500.map(d => d.volatility),
                    backgroundColor: 'rgba(65, 105, 225, 0.7)',
                    borderColor: '#4169E1',
                    borderWidth: 1
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: '30-Day Rolling Volatility Comparison',
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
                        callback: value => value + '%'
                    },
                    title: {
                        display: true,
                        text: 'Volatility (%)',
                        color: '#FFD700'
                    }
                }
            }
        }
    });
}

// ==================== CHART 5: INTERACTIVE TIMELINE ====================
let interactiveChart;
let currentDataIndex = 0;

function createInteractiveChart() {
    const ctx = document.getElementById('interactiveChart').getContext('2d');
    
    interactiveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [goldData.prices[0].date],
            datasets: [{
                label: 'Gold Price Over Time',
                data: [goldData.prices[0].price],
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#FFD700'
            }]
        },
        options: {
            ...commonOptions,
            animation: {
                duration: 500
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'year' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#cccccc' }
                },
                y: {
                    beginAtZero: false,
                    min: 200,
                    max: 3000,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#cccccc',
                        callback: value => '$' + value
                    }
                }
            }
        }
    });
}

function updateInteractiveChart(index) {
    const dataSlice = goldData.prices.slice(0, index + 1);
    
    interactiveChart.data.labels = dataSlice.map(d => d.date);
    interactiveChart.data.datasets[0].data = dataSlice.map(d => d.price);
    interactiveChart.update('none');
    
    // Update event info
    const currentPrice = goldData.prices[index];
    const startPrice = goldData.prices[0];
    const change = ((currentPrice.price - startPrice.price) / startPrice.price * 100).toFixed(1);
    
    document.getElementById('currentDate').textContent = new Date(currentPrice.date).getFullYear();
    document.getElementById('goldPrice').textContent = '$' + currentPrice.price;
    document.getElementById('priceChange').textContent = (change > 0 ? '+' : '') + change + '%';
    
    // Check if there's a crisis event near this date
    const nearbyEvent = crisisEvents.find(e => e.date === currentPrice.date);
    if (nearbyEvent) {
        document.getElementById('eventTitle').textContent = nearbyEvent.title;
        document.getElementById('eventDescription').textContent = nearbyEvent.description;
    } else {
        document.getElementById('eventTitle').textContent = 'Market Activity';
        document.getElementById('eventDescription').textContent = 'Gold price: $' + currentPrice.price;
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
    if (slider && goldData.prices.length > 0) {
        slider.max = goldData.prices.length - 1;
        slider.addEventListener('input', (e) => {
            const index = parseInt(e.target.value);
            updateInteractiveChart(index);
        });
    }
}

// Initialize when DOM is ready (data is immediately available from data.js)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVisualizations);
} else {
    initializeVisualizations();
}
