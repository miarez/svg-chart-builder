
class MultiTimeSeries extends XYChart {

    constructor(
        data,
        chartDivId,
        instructionConfig
    ) {
        super(data, chartDivId, instructionConfig);
    }

    build() {

        this.buildRootContainer();
        this.instantiateSeriesData();

        this.buildSeries();
        this.buildAxes();
        this.buildCursorLines();
        this.addEventListeners();
    }


}

