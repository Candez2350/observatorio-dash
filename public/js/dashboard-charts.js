
    // ===== LOADING =====
    document.addEventListener('DOMContentLoaded', () => {
        // Esconde o loader inicial e inicializa os componentes da primeira página
        document.getElementById('loader').classList.add('hidden');
        animateCounters();
        animateProgressBars();
        initCharts();
    });

    // ===== HEADER SCROLL =====
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ===== DYNAMIC PAGE LOADING (SPA BEHAVIOR) =====
    const mainContent = document.querySelector('.main-content');
    const header = document.getElementById('header');

    const loadPage = async (url, pushState = true) => {
        document.getElementById('loader').classList.remove('hidden');

        try {
            const response = await fetch(`${url}?partial=true`);
            if (!response.ok) throw new Error('Falha ao carregar página.');
            
            const html = await response.text();

            if (pushState) {
                history.pushState({ path: url }, '', url);
            }

            document.querySelectorAll('.tab-btn').forEach(btn => {
                const btnPath = new URL(btn.href).pathname;
                btn.classList.toggle('active', btnPath === url);
            });

            mainContent.style.opacity = 0;
            setTimeout(() => {
                mainContent.innerHTML = html;
                mainContent.style.opacity = 1;

                // Re-initialize components for the new content
                animateCounters();
                animateProgressBars();
                initCharts();

                document.getElementById('loader').classList.add('hidden');
            }, 200);

        } catch (error) {
            console.error('Erro ao carregar página:', error);
            mainContent.innerHTML = `<p style="text-align: center; color: var(--danger); padding: 50px;">Erro ao carregar o conteúdo. Tente novamente.</p>`;
            document.getElementById('loader').classList.add('hidden');
        }
    };

    header.addEventListener('click', (e) => {
        const link = e.target.closest('a.tab-btn');
        if (link) {
            e.preventDefault();
            const url = new URL(link.href).pathname;
            if (url === window.location.pathname) return;
            loadPage(url);
        }
    });

    window.addEventListener('popstate', (e) => {
        loadPage(location.pathname, false);
    });

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const start = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(target * eased).toLocaleString('pt-BR');
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // ===== PROGRESS BAR ANIMATION =====
    function animateProgressBars() {
        const fills = document.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
            const width = fill.dataset.width;
            setTimeout(() => {
                fill.style.width = width + '%';
            }, 200);
        });
    }

    // ===== CHART.JS CONFIG =====
    // Helper para buscar o valor das variáveis CSS e garantir que os gráficos sigam o tema
    const getCSSVar = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

    Chart.defaults.color = getCSSVar('--text-secondary');
    Chart.defaults.borderColor = getCSSVar('--border');
    Chart.defaults.font.family = "'Antenna', 'Rubik', sans-serif";
    Chart.defaults.font.size = 11;
    
    let charts = {};

    function destroyChart(id) {
        if (charts[id]) {
            charts[id].destroy();
            delete charts[id];
        }
    }

    function initCharts() {
        initPanoramaCharts();
        initRegiaoCharts();
        initTemporalCharts();
        initPerfilCharts();
    }

    function initPanoramaCharts() {
        // Pie Chart
        const pieEl = document.getElementById('panoramaPieChart');
        if (pieEl) {
            destroyChart('panoramaPieChart');
            const pieCtx = pieEl.getContext('2d');
            charts['panoramaPieChart'] = new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Violência Psicológica', 'Violência Física', 'Violência Sexual', 'Violência Patrimonial', 'Feminicídio', 'Outros'],
                    datasets: [{
                        data: [5821, 3245, 1876, 1198, 347, 450],
                        backgroundColor: [
                            '#a78bfa', '#f472b6', '#60a5fa', '#fbbf24', '#f87171', '#6b5f85'
                        ],
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 16,
                                usePointStyle: true,
                                pointStyleWidth: 10,
                            }
                        }
                    }
                }
            });
        }

        // Line Chart
        const lineEl = document.getElementById('panoramaLineChart');
        if (lineEl) {
            destroyChart('panoramaLineChart');
            const lineCtx = lineEl.getContext('2d');
            charts['panoramaLineChart'] = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Ocorrências',
                        data: [890, 945, 1020, 980, 1100, 1050, 1150, 1080, 1200, 1180, 1090, 802],
                        borderColor: '#a78bfa',
                        backgroundColor: 'rgba(167, 139, 250, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#a78bfa',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 7
                    }, {
                        label: 'Feminicídios',
                        data: [25, 28, 32, 29, 35, 31, 33, 30, 38, 36, 34, 26],
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.05)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#f87171',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: getCSSVar('--border') }
                        },
                        y1: {
                            position: 'right',
                            beginAtZero: true,
                            grid: { display: false }
                        },
                        x: {
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true,
                                pointStyleWidth: 10
                            }
                        }
                    }
                }
            });
        }
    }

    function initRegiaoCharts() {
        // Bar Chart - UFs
        const barEl = document.getElementById('regiaoBarChart');
        if (barEl) {
            destroyChart('regiaoBarChart');
            const barCtx = barEl.getContext('2d');
            charts['regiaoBarChart'] = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['SP', 'RJ', 'MG', 'BA', 'PR', 'RS', 'PE', 'CE', 'PA', 'GO', 'MA', 'AM', 'ES', 'PB', 'RN', 'SC', 'MT', 'AL', 'PI', 'DF', 'MS', 'RO', 'SE', 'TO', 'AC', 'AP', 'RR'],
                    datasets: [{
                        label: 'Ocorrências',
                        data: [2456, 1876, 1534, 1298, 1102, 987, 876, 754, 698, 645, 589, 534, 498, 456, 423, 412, 389, 356, 334, 312, 298, 276, 254, 234, 198, 156, 134],
                        backgroundColor: (ctx) => {
                            const val = ctx.raw;
                            if (val > 2000) return '#f87171';
                            if (val > 1000) return '#f472b6';
                            if (val > 500) return '#a78bfa';
                            return '#60a5fa';
                        },
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                        grid: { color: getCSSVar('--border') }
                        },
                        y: {
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // Rate Chart
        const rateEl = document.getElementById('regiaoRateChart');
        if (rateEl) {
            destroyChart('regiaoRateChart');
            const rateCtx = rateEl.getContext('2d');
            charts['regiaoRateChart'] = new Chart(rateCtx, {
                type: 'bar',
                data: {
                    labels: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'],
                    datasets: [{
                        label: 'Taxa por 100 mil',
                        data: [28.4, 24.7, 22.1, 19.8, 17.3],
                        backgroundColor: ['#60a5fa', '#f472b6', '#a78bfa', '#fbbf24', '#34d399'],
                        borderRadius: 10,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                        grid: { color: getCSSVar('--border') }
                        },
                        x: {
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    }

    function initTemporalCharts() {
        // Line Chart - Historical
        const lineEl = document.getElementById('temporalLineChart');
        if (lineEl) {
            destroyChart('temporalLineChart');
            const histCtx = lineEl.getContext('2d');
            charts['temporalLineChart'] = new Chart(histCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: '2019',
                        data: [720, 780, 850, 810, 890, 860, 920, 880, 950, 930, 870, 750],
                        borderColor: '#6b5f85',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        pointRadius: 2,
                        borderWidth: 2
                    }, {
                        label: '2020',
                        data: [680, 740, 820, 780, 860, 830, 900, 860, 930, 910, 850, 730],
                        borderColor: '#a78bfa',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        pointRadius: 2,
                        borderWidth: 2
                    }, {
                        label: '2021',
                        data: [750, 810, 890, 850, 930, 900, 970, 930, 1000, 980, 920, 800],
                        borderColor: '#60a5fa',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        pointRadius: 2,
                        borderWidth: 2
                    }, {
                        label: '2022',
                        data: [870, 925, 1000, 960, 1080, 1030, 1130, 1060, 1180, 1160, 1070, 782],
                        borderColor: '#f472b6',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        pointRadius: 2,
                        borderWidth: 2
                    }, {
                        label: '2023',
                        data: [890, 945, 1020, 980, 1100, 1050, 1150, 1080, 1200, 1180, 1090, 802],
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.05)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#f87171',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: getCSSVar('--border') }
                        },
                        x: { grid: { display: false } }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true,
                                pointStyleWidth: 10,
                                padding: 20,
                            }
                        }
                    }
                }
            });
        }

        // Bar Chart - Feminicídios
        const barEl = document.getElementById('temporalBarChart');
        if (barEl) {
            destroyChart('temporalBarChart');
            const femCtx = barEl.getContext('2d');
            charts['temporalBarChart'] = new Chart(femCtx, {
                type: 'bar',
                data: {
                    labels: ['2019', '2020', '2021', '2022', '2023'],
                    datasets: [{
                        label: 'Feminicídios',
                        data: [289, 263, 312, 330, 347],
                        backgroundColor: (ctx) => {
                            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                            gradient.addColorStop(0, '#f87171');
                            gradient.addColorStop(1, '#dc2626');
                            return gradient;
                        },
                        borderRadius: 10,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: getCSSVar('--border') }
                        },
                        x: { grid: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Radar Chart
        const radarEl = document.getElementById('temporalRadarChart');
        if (radarEl) {
            destroyChart('temporalRadarChart');
            const radarCtx = radarEl.getContext('2d');
            charts['temporalRadarChart'] = new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: ['Psicológica', 'Física', 'Sexual', 'Patrimonial', 'Feminicídio'],
                    datasets: [{
                        label: '2022',
                        data: [5680, 3270, 1745, 1180, 330],
                        borderColor: '#f472b6',
                        backgroundColor: 'rgba(244, 114, 182, 0.1)',
                        borderWidth: 2,
                        pointRadius: 3
                    }, {
                        label: '2023',
                        data: [5821, 3245, 1876, 1198, 347],
                        borderColor: '#a78bfa',
                        backgroundColor: 'rgba(167, 139, 250, 0.1)',
                        borderWidth: 2,
                        pointRadius: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            grid: { color: getCSSVar('--border') },
                            angleLines: { color: getCSSVar('--border') },
                            pointLabels: {
                                color: getCSSVar('--text-secondary')
                            },
                            ticks: { display: false }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true,
                                pointStyleWidth: 10,
                                padding: 20,
                            }
                        }
                    }
                }
            });
        }
    }

    function initPerfilCharts() {
        // Age Chart
        const ageEl = document.getElementById('perfilAgeChart');
        if (ageEl) {
            destroyChart('perfilAgeChart');
            const ageCtx = ageEl.getContext('2d');
            charts['perfilAgeChart'] = new Chart(ageCtx, {
                type: 'bar',
                data: {
                    labels: ['0-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'],
                    datasets: [{
                        label: 'Vítimas',
                        data: [145, 520, 980, 1245, 1456, 1320, 1180, 945, 678, 412, 389],
                        backgroundColor: (ctx) => {
                            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                            gradient.addColorStop(0, '#a78bfa');
                            gradient.addColorStop(1, '#7c3aed');
                            return gradient;
                        },
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: getCSSVar('--border') }
                        },
                        x: { grid: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Education Chart
        const eduEl = document.getElementById('perfilEducationChart');
        if (eduEl) {
            destroyChart('perfilEducationChart');
            const eduCtx = eduEl.getContext('2d');
            charts['perfilEducationChart'] = new Chart(eduCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Sem escolaridade', 'Ensino Fundamental', 'Ensino Médio', 'Ensino Superior', 'Não informado'],
                    datasets: [{
                        data: [8, 22, 35, 18, 17],
                        backgroundColor: ['#f87171', '#fbbf24', '#a78bfa', '#34d399', '#6b5f85'],
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 16,
                                usePointStyle: true,
                                pointStyleWidth: 10
                            }
                        }
                    }
                }
            });
        }

        // Work Chart
        const workEl = document.getElementById('perfilWorkChart');
        if (workEl) {
            destroyChart('perfilWorkChart');
            const workCtx = workEl.getContext('2d');
            charts['perfilWorkChart'] = new Chart(workCtx, {
                type: 'pie',
                data: {
                    labels: ['Desempregada', 'Autônoma', 'CLT', 'Do lar', 'Estudante', 'Servidora pública', 'Outros'],
                    datasets: [{
                        data: [28, 22, 18, 15, 8, 5, 4],
                        backgroundColor: ['#f87171', '#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#6b5f85'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 12,
                                usePointStyle: true,
                                pointStyleWidth: 10
                            }
                        }
                    }
                }
            });
        }

        // Race Chart
        const raceEl = document.getElementById('perfilRaceChart');
        if (raceEl) {
            destroyChart('perfilRaceChart');
            const raceCtx = raceEl.getContext('2d');
            charts['perfilRaceChart'] = new Chart(raceCtx, {
                type: 'bar',
                data: {
                    labels: ['Parda', 'Preta', 'Branca', 'Amarela', 'Indígena', 'Não informada'],
                    datasets: [{
                        label: '%',
                        data: [38, 24, 28, 4, 3, 3],
                        backgroundColor: ['#a78bfa', '#7c3aed', '#60a5fa', '#fbbf24', '#34d399', '#6b5f85'],
                        borderRadius: 10,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 50,
                        grid: { color: getCSSVar('--border') },
                            ticks: { callback: (v) => v + '%' }
                        },
                        y: { grid: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    // ===== YEAR SELECTOR (Currently disabled in UI) =====
    const yearSelector = document.getElementById('yearSelector');
    if (yearSelector) {
        yearSelector.addEventListener('change', function() {
            // In a real app, this would fetch new data
            // For demo, we just re-trigger animations
            animateCounters();
            animateProgressBars();
        });
    }
