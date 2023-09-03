
    const { createApp, ref, onMounted, reactive } = Vue
    createApp({
        setup() {
            var chartData = {
                labels: ['Invested amount', 'Est. returns'],
                datasets: [{
                    data: [3000000, 2808477],
                    backgroundColor: ['#98A4FF', '#5367FF'],
                }]
            };
            var chart = null;

            const investmentType = ref('sip')
            const investmentData = reactive({
                amount: 25000,
                rate: 12,
                period: 10
            })
            const maturityData = reactive({
                investedAmount: '30,00,000',
                estimatedReturn: '28,08,477',
                totalValue: '58,08,477',
            })

            onMounted(() => {
                const ctx = document.getElementById('chartCanvas')
                chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: chartData,
                    options: {
                        cutout: 70,
                        plugins: {
                            legend: {
                                labels: {
                                    usePointStyle: true,
                                    pointStyle: 'rectRounded'
                                },
                            }
                        },
                        events: [],
                        maintainAspectRatio: false,
                        elements: {
                            arc: {
                                borderColor: '',
                                borderWidth: 0,
                            }
                        }
                    }
                });
            })

            function calculate() {
                var amt = investmentData.amount
                var r = investmentData.rate
                var y = investmentData.period
                var invested;
                var total;

                if (investmentType.value === "sip") {
                    invested = calculateInvestedAmountForSIP(amt, y)
                    total = calculateTotalInvestmentValueForSIP(amt, r, y);
                }

                if (investmentType.value === 'lumpsum') {
                    invested = amt
                    total = calculateTotalInvestmentValueForLumpsum(amt, r, y);
                }

                var estimated = calculateEstimatedReturns(invested, total)
                updateChart(invested, estimated)
                maturityData.investedAmount = invested.toLocaleString()
                maturityData.estimatedReturn = estimated.toLocaleString()
                maturityData.totalValue = total.toLocaleString()
            }

            function updateChart(invested, estimated) {
                chartData.datasets[0].data[0] = invested
                chartData.datasets[0].data[1] = estimated
                chart.update()
            }

            function calculateEstimatedReturns(invested, total) {
                return total - invested
            }

            function calculateTotalInvestmentValueForSIP(inv, rate, years) {
                var n = 12
                var a = inv * ((Math.pow((1 + rate / 100 / n), (n * years)) - 1) / (rate / 100 / n)) * (1 + rate / 100 / n)
                return Math.round(a)
            }

            function calculateTotalInvestmentValueForLumpsum(inv, rate, years) {
                var a = inv * (Math.pow((1 + rate / 100), years));
                return Math.round(a)
            }

            function calculateInvestedAmountForSIP(amount, years) {
                return amount * 12 * years
            }

            return {
                calculate,
                maturityData,
                investmentData,
                investmentType
            }
        }
    }).mount('#app')
