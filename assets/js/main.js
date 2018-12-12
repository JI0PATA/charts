let vue = new Vue({
    el: '#app',
    data: {
        formulas: [],
        curFormula: [],
        charts: [],
        range: 0,
        selectedFormulasIndex: [],
        selectedFormulas: [],
        animateInterval: null,
    },
    methods: {
        calcDots() {
            this.charts = [];

            this.selectedFormulas.forEach(formula => {
                let marker = this.calcDot(1 / 100 * this.range, formula.formula);

                let chart = {
                    color: 'red',
                    dots: [],
                    formula: formula.formula,
                    marker: {
                        x: marker.t,
                        y: marker.y,
                    }
                };

                let step_x = 1 / 500;

                for (let i = 0; i < 500; i++) {
                    let dot = this.calcDot(i * step_x, formula.formula);
                    chart.dots.push({
                        x: dot.t,
                        y: dot.y,
                    });
                }

                this.charts.push(chart);
            });
        },

        calcDot(t, formula) {
            eval("y = " + formula);
            t = t < 0 ? t + 1 : t;
            return {t, y};
        },

        animate() {
            if (this.animateInterval) return;

            let delay = 3000 / 100;

            if (parseInt(this.range) === 100 || this.selectedFormulas.length === 0) return;

            this.animateInterval = setInterval(_ => {
                this.range = parseInt(this.range) + 1;

                if (parseInt(this.range) === 100) {
                    clearInterval(this.animateInterval);
                    this.animateInterval = null;
                }
            }, delay);
        }
    },
    watch: {
        selectedFormulasIndex: function (val) {
            this.selectedFormulas = [];

            val.forEach(index => {
                this.selectedFormulas.push(this.formulas[index]);
            });

            this.calcDots();
        },

        range: function(val) {
            this.charts.forEach(chart => {
                let marker = this.calcDot(1 / 100 * this.range, chart.formula);
                chart.marker.x = parseInt(this.range) === 100 ? 1 : marker.t;
                chart.marker.y = marker.y;
            });
        }
    },
    created: function () {
        fetch('/formulas.json')
            .then(res => res.json())
            .then(res => {
                this.formulas = res;
            });
    }
});