// ==================== CHART CONFIGURATIONS ====================

// Legend helpers to render line previews instead of boxes
const forecastLegendIconCache = new Map();
const defaultLegendLabelGenerator = (typeof Chart !== 'undefined' && Chart.defaults?.plugins?.legend?.labels?.generateLabels)
    ? Chart.defaults.plugins.legend.labels.generateLabels
    : () => [];

function getForecastLegendIcon(color) {
    const key = color || '#FFD700';
    if (forecastLegendIconCache.has(key)) {
        return forecastLegendIconCache.get(key);
    }

    const width = 48;
    const height = 14;
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = key;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const segments = 3;
    const interval = width / (segments * 2 + 1);
    let x = interval;
    const y = height / 2;

    for (let i = 0; i < segments; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + interval, y);
        ctx.stroke();
        x += interval * 2;
    }

    forecastLegendIconCache.set(key, canvas);
    return canvas;
}

// Common chart options
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#FFD700',
                font: { size: 16, weight: 'bold' },
                usePointStyle: true,
                boxWidth: 48,
                boxHeight: 12,
                pointStyleWidth: 48,
                padding: 16,
                generateLabels(chart) {
                    const labels = defaultLegendLabelGenerator.call(this, chart);
                    return labels.map(label => {
                        const dataset = chart.data.datasets?.[label.datasetIndex];
                        if (!dataset) {
                            return label;
                        }

                        const datasetType = dataset.type || chart.config.type;
                        if (datasetType === 'line') {
                            const borderColor = Array.isArray(dataset.borderColor)
                                ? dataset.borderColor[0]
                                : dataset.borderColor || '#FFFFFF';

                            label.fillStyle = 'rgba(0, 0, 0, 0)';
                            label.strokeStyle = borderColor;
                            label.lineWidth = dataset.borderWidth ?? 3;
                            label.lineDash = dataset.borderDash || [];
                            label.lineDashOffset = dataset.borderDashOffset || 0;

                            if (dataset.label && dataset.label.toLowerCase().includes('forecast')) {
                                label.pointStyle = getForecastLegendIcon(borderColor);
                                label.lineDash = [];
                                label.lineDashOffset = 0;
                            } else {
                                label.pointStyle = 'line';
                            }
                        }
                        return label;
                    });
                }
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
                    label: 'Gold',
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
                    label: 'S&P 500',
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
                    text: 'Growth of $100 Invested in the year 2000',
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

// ==================== CHART 5: GOLD SUPPLY & DISTRIBUTION ====================
function createGoldDistributionTreemap(yearData) {
    const container = document.getElementById('goldDistributionTreemap');
    
    if (!container) {
        return;
    }

    // Determine the dataset to use for this render cycle
    const appliedData = yearData || container.__treemapData || window.goldDistributionData;
    
    if (!appliedData) {
        return;
    }

    // Persist the dataset so resize handlers always have the latest state
    container.__treemapData = appliedData;

    const renderTreemap = () => {
        const dataToUse = container.__treemapData || window.goldDistributionData;
        if (!dataToUse) return;

        const width = container.clientWidth;
        const height = container.clientHeight || Math.max(340, Math.floor(width * 0.5)); // Adjusted for slider

        container.innerHTML = '';

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const root = d3.treemap()
            .size([width, height])
            .paddingInner(12)
            .round(true)(
                d3.hierarchy({
                    name: 'Gold Stock',
                    children: dataToUse.categories
                }).sum(d => d.percentage) // Use exact percentages for proportions
            );

        const cells = svg.selectAll('g')
            .data(root.leaves())
            .enter()
            .append('g')
            .attr('transform', d => `translate(${d.x0},${d.y0})`)
            .attr('class', 'treemap-cell')
            .style('cursor', 'pointer');

        // Add rectangles
        cells.append('rect')
            .attr('width', d => Math.max(0, d.x1 - d.x0))
            .attr('height', d => Math.max(0, d.y1 - d.y0))
            .attr('rx', 12)
            .attr('ry', 12)
            .attr('fill', d => d.data.color)
            .attr('stroke', 'rgba(255, 215, 0, 0.6)')
            .attr('stroke-width', 2)
            .attr('opacity', 0.9)
            .transition()
            .duration(800)
            .attr('opacity', 1);

        // Add text groups
        cells.each(function(d) {
            const group = d3.select(this);
            const cellWidth = d.x1 - d.x0;
            const cellHeight = d.y1 - d.y0;
            
            // Scale font sizes based on cell dimensions (both width and height)
            const baseSize = Math.min(cellWidth, cellHeight);
            const titleFont = Math.max(12, Math.min(24, baseSize / 10));
            const percentFont = Math.max(16, Math.min(32, baseSize / 8));
            const tonnesFont = Math.max(10, Math.min(18, baseSize / 12));
            
            const xCenter = cellWidth / 2;
            const yCenter = cellHeight / 2;

            // Title (category name) - Always visible
            const titleText = group.append('text')
                .attr('x', xCenter)
                .attr('y', yCenter - percentFont / 3)
                .attr('text-anchor', 'middle')
                .attr('fill', '#1a1a1a')
                .attr('font-size', `${titleFont}px`)
                .attr('font-weight', 700)
                .text(d.data.name);

            // Percentage - Always visible
            const percentText = group.append('text')
                .attr('x', xCenter)
                .attr('y', yCenter + percentFont / 2)
                .attr('text-anchor', 'middle')
                .attr('fill', '#1a1a1a')
                .attr('font-size', `${percentFont}px`)
                .attr('font-weight', 800)
                .text(`${d.data.percentage}%`);

            // Tonnes (hidden by default, shown on hover)
            const tonnesText = group.append('text')
                .attr('x', xCenter)
                .attr('y', yCenter + percentFont / 2)
                .attr('text-anchor', 'middle')
                .attr('fill', '#1a1a1a')
                .attr('font-size', `${tonnesFont}px`)
                .attr('font-weight', 600)
                .attr('opacity', 0)
                .text(`${d.data.tonnes.toLocaleString()} tonnes`);

            // Hover effects - Show tonnes instead of percentage
            group.on('mouseenter', function() {
                d3.select(this).select('rect')
                    .transition()
                    .duration(200)
                    .attr('opacity', 1)
                    .attr('stroke-width', 3);
                
                // Keep title visible, hide percentage, show tonnes
                percentText.transition().duration(200).attr('opacity', 0);
                tonnesText.transition().duration(200).attr('opacity', 1);
            });

            group.on('mouseleave', function() {
                d3.select(this).select('rect')
                    .transition()
                    .duration(200)
                    .attr('opacity', 1)
                    .attr('stroke-width', 2);
                
                // Show percentage, hide tonnes
                percentText.transition().duration(200).attr('opacity', 1);
                tonnesText.transition().duration(200).attr('opacity', 0);
            });
        });
    };

    // Expose the renderer so resize handlers can run the most recent version
    container.__renderTreemap = renderTreemap;

    renderTreemap();

    if (!container.dataset.resizeBound) {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (container.__renderTreemap) {
                    container.__renderTreemap();
                }
            }, 250);
        });
        container.dataset.resizeBound = 'true';
    }
}

// ==================== GOLD DISTRIBUTION TIMELINE SLIDER ====================
function setupGoldTimelineSlider() {
    const slider = document.getElementById('goldYearSlider');
    const currentYearDisplay = document.getElementById('currentGoldYear');
    const stockInfo = document.getElementById('goldStockInfo');
    
    if (!slider || !window.goldDistributionTimeline) return;
    
    const updateVisualizationsForYear = (yearIndex) => {
        const yearData = window.goldDistributionTimeline[yearIndex];
        
        if (currentYearDisplay) {
            currentYearDisplay.textContent = yearData.year;
        }
        
        if (stockInfo) {
            stockInfo.textContent = `Total: ${yearData.totalGold.toLocaleString()} tonnes`;
        }
        
        createGoldDistributionTreemap(yearData);
    };
    
    slider.value = window.goldDistributionTimeline.length - 1;
    updateVisualizationsForYear(slider.value);
    
    slider.addEventListener('input', (e) => {
        updateVisualizationsForYear(parseInt(e.target.value, 10));
    });
}

// ==================== 3D GOLD CUBE VISUALIZATION =====================
function createGoldCube3D() {
    const container = document.getElementById('goldCube3D');
    
    if (!container || !window.goldDistributionData) {
        return;
    }
    let hasAnimated = false;

    const render3DCube = (animate = false) => {
        const width = container.clientWidth;
        const height = container.clientHeight || Math.max(400, Math.floor(width * 0.7));

        container.innerHTML = '';

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('background', 'transparent');

        // Isometric projection parameters
        const cubeSize = Math.min(width, height) * 0.3;
        const centerX = width / 2.5 - 40; // Moved cube left to make room for human
        const centerY = height / 2 + 30;

        // Human figure for scale (average height 1.7m compared to cube edge length)
        const humanHeight = (1.7 / goldDistributionData.cubeSize) * cubeSize;
        const humanWidth = humanHeight * 0.3;
        // Position human to the right of the cube for better visualization
        const humanX = centerX + cubeSize * -0.3; 
        const humanY = centerY + cubeSize * 0.4 - humanHeight;

        const human = svg.append('g')
            .attr('class', 'human-figure');

        human.append('circle')
            .attr('cx', humanX)
            .attr('cy', humanY)
            .attr('r', humanHeight * 0.12)
            .attr('fill', '#FFD700')
            .attr('stroke', '#B8860B')
            .attr('stroke-width', 2);

        human.append('rect')
            .attr('x', humanX - humanWidth / 2)
            .attr('y', humanY + humanHeight * 0.12)
            .attr('width', humanWidth)
            .attr('height', humanHeight * 0.5)
            .attr('rx', 3)
            .attr('fill', '#FFA500')
            .attr('stroke', '#B8860B')
            .attr('stroke-width', 2);

        human.append('rect')
            .attr('x', humanX - humanWidth / 2)
            .attr('y', humanY + humanHeight * 0.62)
            .attr('width', humanWidth * 0.45)
            .attr('height', humanHeight * 0.38)
            .attr('rx', 2)
            .attr('fill', '#FF8C00')
            .attr('stroke', '#B8860B')
            .attr('stroke-width', 1.5);

        human.append('rect')
            .attr('x', humanX + humanWidth * 0.05)
            .attr('y', humanY + humanHeight * 0.62)
            .attr('width', humanWidth * 0.45)
            .attr('height', humanHeight * 0.38)
            .attr('rx', 2)
            .attr('fill', '#FF8C00')
            .attr('stroke', '#B8860B')
            .attr('stroke-width', 1.5);

        const humanLabel = svg.append('text')
            .attr('x', humanX)
            .attr('y', humanY + humanHeight + 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '13px')
            .attr('font-weight', 600)
            .attr('opacity', animate ? 0 : 1)
            .text('Human (1.7m)');

        if (animate) {
            humanLabel.transition()
                .duration(600)
                .delay(800)
                .attr('opacity', 1);
        }

        // Draw 3D cube using isometric projection
        const iso = (x, y, z) => {
            // Isometric projection formulas
            const isoX = (x - z) * Math.cos(Math.PI / 6);
            const isoY = y + (x + z) * Math.sin(Math.PI / 6);
            return [centerX + isoX, centerY + isoY];
        };

        const s = cubeSize;

        // Define cube vertices
        const vertices = {
            A: iso(0, 0, 0),      // bottom-front-left
            B: iso(s, 0, 0),      // bottom-front-right
            C: iso(s, 0, -s),     // bottom-back-right
            D: iso(0, 0, -s),     // bottom-back-left
            E: iso(0, -s, 0),     // top-front-left
            F: iso(s, -s, 0),     // top-front-right
            G: iso(s, -s, -s),    // top-back-right
            H: iso(0, -s, -s)     // top-back-left
        };

        // Cube faces (in order for proper 3D effect - back to front)
        const faces = [
            // Back face (darkest - drawn first)
            {
                points: [vertices.D, vertices.C, vertices.G, vertices.H],
                fill: 'url(#goldGradient4)',
                opacity: 0.7
            },
            // Left face (dark)
            {
                points: [vertices.A, vertices.D, vertices.H, vertices.E],
                fill: 'url(#goldGradient1)',
                opacity: 0.85
            },
            // Right face (medium)
            {
                points: [vertices.B, vertices.C, vertices.G, vertices.F],
                fill: 'url(#goldGradient2)',
                opacity: 0.95
            },
            // Front face (visible - light)
            {
                points: [vertices.A, vertices.B, vertices.F, vertices.E],
                fill: 'url(#goldGradient5)',
                opacity: 0.98
            },
            // Top face (lightest - drawn last)
            {
                points: [vertices.E, vertices.F, vertices.G, vertices.H],
                fill: 'url(#goldGradient3)',
                opacity: 1
            }
        ];

        // Define gradients
        const defs = svg.append('defs');

        const gradient1 = defs.append('linearGradient')
            .attr('id', 'goldGradient1')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
        gradient1.append('stop').attr('offset', '0%').attr('stop-color', '#B8860B');
        gradient1.append('stop').attr('offset', '100%').attr('stop-color', '#8B6914');

        const gradient2 = defs.append('linearGradient')
            .attr('id', 'goldGradient2')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
        gradient2.append('stop').attr('offset', '0%').attr('stop-color', '#DAA520');
        gradient2.append('stop').attr('offset', '100%').attr('stop-color', '#B8860B');

        const gradient3 = defs.append('linearGradient')
            .attr('id', 'goldGradient3')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');
        gradient3.append('stop').attr('offset', '0%').attr('stop-color', '#FFD700');
        gradient3.append('stop').attr('offset', '50%').attr('stop-color', '#FFA500');
        gradient3.append('stop').attr('offset', '100%').attr('stop-color', '#DAA520');

        // Back face gradient (darkest)
        const gradient4 = defs.append('linearGradient')
            .attr('id', 'goldGradient4')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
        gradient4.append('stop').attr('offset', '0%').attr('stop-color', '#8B6914');
        gradient4.append('stop').attr('offset', '100%').attr('stop-color', '#6B5310');

        // Front face gradient (bright)
        const gradient5 = defs.append('linearGradient')
            .attr('id', 'goldGradient5')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
        gradient5.append('stop').attr('offset', '0%').attr('stop-color', '#F4C430');
        gradient5.append('stop').attr('offset', '100%').attr('stop-color', '#DAA520');

        // Add glow filter
        const filter = defs.append('filter')
            .attr('id', 'glow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');
        
        filter.append('feGaussianBlur')
            .attr('stdDeviation', '4')
            .attr('result', 'coloredBlur');
        
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Draw faces
        const cubeGroup = svg.append('g')
            .attr('class', 'gold-cube')
            .attr('filter', 'url(#glow)');

        faces.forEach((face, i) => {
            const pathData = `M ${face.points.map(p => p.join(',')).join(' L ')} Z`;
            
            const facePath = cubeGroup.append('path')
                .attr('d', pathData)
                .attr('fill', face.fill)
                .attr('stroke', '#8B6914')
                .attr('stroke-width', 2)
                .attr('stroke-linejoin', 'round')
                .attr('opacity', animate ? 0 : face.opacity);

            if (animate) {
                facePath.transition()
                    .duration(800)
                    .delay(i * 200)
                    .attr('opacity', face.opacity);
            }
        });

        // Add dimension labels
        const labelStyle = {
            fill: '#FFD700',
            fontSize: '14px',
            fontWeight: 600,
            textAnchor: 'middle'
        };

        // Width label (bottom front edge) - use dynamic cube size from data
        const widthMidX = (vertices.A[0] + vertices.B[0]) / 2;
        const widthMidY = (vertices.A[1] + vertices.B[1]) / 2;
        const widthLabel = svg.append('text')
            .attr('x', widthMidX)
            .attr('y', widthMidY + 25)
            .attr('fill', labelStyle.fill)
            .attr('font-size', labelStyle.fontSize)
            .attr('font-weight', labelStyle.fontWeight)
            .attr('text-anchor', labelStyle.textAnchor)
            .attr('opacity', animate ? 0 : 1)
            .text(`${goldDistributionData.cubeSize}m`);

        if (animate) {
            widthLabel.transition()
                .duration(600)
                .delay(1000)
                .attr('opacity', 1);
        }

        // Height label (left front edge)
        const heightMidX = (vertices.A[0] + vertices.E[0]) / 2 - 25;
        const heightMidY = (vertices.A[1] + vertices.E[1]) / 2;
        const heightLabel = svg.append('text')
            .attr('x', heightMidX)
            .attr('y', heightMidY)
            .attr('fill', labelStyle.fill)
            .attr('font-size', labelStyle.fontSize)
            .attr('font-weight', labelStyle.fontWeight)
            .attr('text-anchor', 'middle')
            .attr('opacity', animate ? 0 : 1)
            .text(`${goldDistributionData.cubeSize}m`);

        if (animate) {
            heightLabel.transition()
                .duration(600)
                .delay(1200)
                .attr('opacity', 1);
        }

        // Depth label (right back edge) - moved further right and down to avoid overlap
        const depthMidX = (vertices.B[0] + vertices.C[0]) / 2 + 40;
        const depthMidY = (vertices.B[1] + vertices.C[1]) / 2 + 10;
        const depthLabel = svg.append('text')
            .attr('x', depthMidX)
            .attr('y', depthMidY)
            .attr('fill', labelStyle.fill)
            .attr('font-size', labelStyle.fontSize)
            .attr('font-weight', labelStyle.fontWeight)
            .attr('text-anchor', 'middle')
            .attr('opacity', animate ? 0 : 1)
            .text(`${goldDistributionData.cubeSize}m`);

        if (animate) {
            depthLabel.transition()
                .duration(600)
                .delay(1400)
                .attr('opacity', 1);
        }

        // Main title - positioned at the bottom to not block the cube
        const mainTitle = svg.append('text')
            .attr('x', centerX + 100)
            .attr('y', height - 40) // Fixed position from bottom
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '15px')
            .attr('font-weight', 700)
            .attr('opacity', animate ? 0 : 1)
            .text('All Gold Ever Mined');

        if (animate) {
            mainTitle.transition()
                .duration(600)
                .delay(1600)
                .attr('opacity', 1);
        }


        const subtitle = svg.append('text')
            .attr('x', centerX + 100)
            .attr('y', height - 22) // Subtitle sits just below title
            .attr('text-anchor', 'middle')
            .attr('fill', '#cccccc')
            .attr('font-size', '12px')
            .attr('font-weight', 500)
            .attr('opacity', animate ? 0 : 1)
            .text('216,265 tonnes in one 22m x 22m x 22m cube');

        if (animate) {
            subtitle.transition()
                .duration(600)
                .delay(1800)
                .attr('opacity', 1);
        }
    };

    const startAnimation = () => {
        if (!hasAnimated) {
            hasAnimated = true;
            render3DCube(true);
        }
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAnimation();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.45 });
        
        observer.observe(container);
    } else {
        startAnimation();
    }

    if (!container.dataset.resizeBound) {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (hasAnimated) {
                    render3DCube(false);
                }
            }, 250);
        });
        container.dataset.resizeBound = 'true';
    }
}

let goldStockDonutChart;

function createGoldStockDonut() {
    const canvas = document.getElementById('goldStockDonut');
    if (!canvas || !window.goldSupplyComposition) return;

    if (goldStockDonutChart) {
        goldStockDonutChart.destroy();
    }

    const { stockComparison, stockTotals } = goldSupplyComposition;
    const ctx = canvas.getContext('2d');

    const chartOptions = {
        ...commonOptions,
        scales: {},
        layout: {
            padding: {
                top: 24,
                bottom: 24
            }
        },
        plugins: {
            ...commonOptions.plugins,
            legend: {
                ...commonOptions.plugins.legend,
                position: 'bottom',
                labels: {
                    ...commonOptions.plugins.legend.labels,
                    padding: 20,
                    font: { size: 16, weight: '600' }
                }
            },
            title: {
                display: true,
                text: `How Small is Gold Mine Production? (${stockTotals.year})`,
                color: '#FFD700',
                font: { size: 20, weight: 'bold' },
                padding: { bottom: 18 }
            },
            tooltip: {
                ...commonOptions.plugins.tooltip,
                callbacks: {
                    label: (context) => {
                        const value = context.parsed;
                        const percentage = ((value / stockTotals.totalAboveGroundStockTonnes) * 100).toFixed(2);
                        return `${context.label}: ${value.toLocaleString()} tonnes (${percentage}%)`;
                    }
                }
            }
        }
    };

    const centerTextPlugin = {
        id: 'centerText',
        afterDraw(chart) {
            const meta = chart.getDatasetMeta(0);
            if (!meta || !meta.data.length) return;
            const { ctx: chartCtx } = chart;
            const center = meta.data[0].getCenterPoint();

            chartCtx.save();
            chartCtx.fillStyle = '#FFD700';
            chartCtx.textAlign = 'center';
            chartCtx.font = '700 28px "Segoe UI", sans-serif';
            chartCtx.fillText(`${stockTotals.mineProductionShare}%`, center.x, center.y - 10);

            chartCtx.font = '500 14px "Segoe UI", sans-serif';
            chartCtx.fillStyle = '#f0e1a0';
            chartCtx.fillText('of above-ground', center.x, center.y + 18);
            chartCtx.fillText('gold mined in 2023', center.x, center.y + 36);
            chartCtx.restore();
        }
    };

    goldStockDonutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: stockComparison.map(item => item.label),
            datasets: [
                {
                    data: stockComparison.map(item => item.value),
                    backgroundColor: ['#FFD700', 'rgba(255, 215, 0, 0.15)'],
                    borderColor: ['#FFB800', '#C18F00'],
                    borderWidth: 3,
                    hoverOffset: 18,
                    cutout: '64%'
                }
            ]
        },
        options: chartOptions,
        plugins: [centerTextPlugin]
    });
}

// ==================== CHART 6: INTERACTIVE TIMELINE ====================
let interactiveChart;
let currentDataIndex = 0;
const INTERACTIVE_TIMELINE_EXCLUSIONS = new Set(['Gold Reaches Record High']);
const interactiveTimelineEvents = crisisEvents.filter(event => !INTERACTIVE_TIMELINE_EXCLUSIONS.has(event.title));

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
                    label: 'S&P 500 Price',
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
    interactiveTimelineEvents.forEach((event) => {
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
    for (const event of interactiveTimelineEvents) {
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
    createGoldDistributionTreemap();
    createGoldCube3D();
    setupGoldTimelineSlider(); // Setup the gold distribution timeline slider
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
                interactiveTimelineEvents.forEach(event => {
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





