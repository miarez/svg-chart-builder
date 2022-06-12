
class TimeSeries extends XYChart {

    constructor(
        data,
        chartDivId,
        xAxisValue,
        yAxisValue
    ) {
        super(data, chartDivId);
        this.xAxisValue = xAxisValue;
        this.yAxisValue = yAxisValue;
    }

    build() {
        this.buildRootContainer();
        this.buildSeries();
        this.buildAxes();
        this.addEventListeners();
    }


}

