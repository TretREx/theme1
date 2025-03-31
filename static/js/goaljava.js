// scripts.js
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll(".content-section");

    // Initialize chart when analysis section is shown
    let combinedChart = null;
    
    function initChart() {
        const ctx = document.getElementById('combinedChart');
        if (!ctx) return;
        
        combinedChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 20}, (_, i) => i),
                datasets: [
                    {
                        label: '温度 (°C)',
                        data: Array.from({length: 20}, () => Math.floor(Math.random() * 3) + 22),
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.3,
                        fill: false,
                        yAxisID: 'y'
                    },
                    {
                        label: '湿度 (%)',
                        data: Array.from({length: 20}, () => Math.floor(Math.random() * 10) + 60),
                        borderColor: 'rgb(54, 162, 235)',
                        tension: 0.3,
                        fill: false,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'CO2 (ppm)',
                        data: Array.from({length: 20}, () => Math.floor(Math.random() * 50) + 450),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.3,
                        fill: false,
                        yAxisID: 'y2'
                    },
                    {
                        label: '水分 (%)',
                        data: Array.from({length: 20}, () => Math.floor(Math.random() * 10) + 45),
                        borderColor: 'rgb(153, 102, 255)',
                        tension: 0.3,
                        fill: false,
                        yAxisID: 'y3'
                    },
                    {
                        label: '光照 (lux)',
                        data: Array.from({length: 20}, () => Math.floor(Math.random() * 1000) + 3000),
                        borderColor: 'rgb(255, 159, 64)',
                        tension: 0.3,
                        fill: false,
                        yAxisID: 'y4'
                    },
                    {
                        label: '水位 (cm)',
                        data: Array.from({length: 20}, () => Math.floor(Math.random() * 3) + 7),
                        borderColor: 'rgb(255, 205, 86)',
                        tension: 0.3,
                        fill: false,
                        yAxisID: 'y5'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        min: 15,
                        max: 35,
                        title: {
                            display: true,
                            text: '温度 (°C)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 40,
                        max: 90,
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: '湿度 (%)'
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 300,
                        max: 800,
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: 'CO2 (ppm)'
                        }
                    },
                    y3: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 30,
                        max: 70,
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: '水分 (%)'
                        }
                    },
                    y4: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 2000,
                        max: 7000,
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: '光照 (lux)'
                        }
                    },
                    y5: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 5,
                        max: 15,
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: '水位 (cm)'
                        }
                    }
                }
            }
        });

        // Update chart with new data every 2 seconds
        setInterval(() => {
            const newLabels = combinedChart.data.labels.slice(1);
            newLabels.push(newLabels[newLabels.length-1] + 1);
            combinedChart.data.labels = newLabels;
            
            combinedChart.data.datasets.forEach(dataset => {
                const newData = dataset.data.slice(1);
                if (dataset.label === '温度 (°C)') {
                    newData.push(Math.floor(Math.random() * 1) + 22);
                } else if (dataset.label === '湿度 (%)') {
                    newData.push(Math.floor(Math.random() * 3) + 60);
                } else if (dataset.label === 'CO2 (ppm)') {
                    newData.push(Math.floor(Math.random() * 3) + 450);
                } else if (dataset.label === '水分 (%)') {
                    newData.push(Math.floor(Math.random() * 3) + 45);
                } else if (dataset.label === '光照 (lux)') {
                    newData.push(Math.floor(Math.random() * 200) + 3000);
                } else if (dataset.label === '水位 (cm)') {
                    newData.push(Math.floor(Math.random() * 1) + 7);
                }
                dataset.data = newData;
            });
            
            combinedChart.update();
        }, 2000);
    }

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const targetId = this.getAttribute("data-target");

            // Destroy existing chart if it exists
            if (combinedChart) {
                combinedChart.destroy();
                combinedChart = null;
            }

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add("active");
                    if (section.id === 'statistical-analysis') {
                        initChart();
                    }
                } else {
                    section.classList.remove("active");
                }
            });
        });
    });

    // Show the first section by default
    sections[0].classList.add("active");
    
    // Also activate section if URL hash matches
    const hash = window.location.hash.substr(1);
    if (hash) {
        // Destroy existing chart if it exists
        if (combinedChart) {
            combinedChart.destroy();
            combinedChart = null;
        }

        sections.forEach(section => {
            if (section.id === hash) {
                section.classList.add("active");
                sections[0].classList.remove("active");
                if (section.id === 'statistical-analysis') {
                    initChart();
                }
            } else {
                section.classList.remove("active");
            }
        });
    }
});
