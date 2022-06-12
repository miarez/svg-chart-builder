


class XYChart extends Chart {

    svgNameSpace = 'http://www.w3.org/2000/svg';
    yAxisPadding;

    constructor(data, chartDivId, instructionConfig) {
        super();

        this.data = data;
        this.svg;

        this.chartDiv   = document.getElementById(chartDivId);

        this.xAxisPaddingPercentage = 10;
        this.yAxisPaddingPercentage = 5;


        this.root = {};
        this.root.height    = this.chartDiv.offsetHeight;
        this.root.width     = this.chartDiv.offsetWidth;

        this.xAxisPadding           = this.root.height * (this.xAxisPaddingPercentage/100);
        this.yAxisPadding           = this.root.width * (this.yAxisPaddingPercentage/100);

        this.chart = {};
        this.chart.height    = this.root.height - this.xAxisPadding;
        this.chart.width     = this.root.width - this.yAxisPadding;
        this.chart.x         = this.yAxisPadding + 0;
        this.chart.y         = this.root.width + 0;
        this.chart.yPadding  = 100;

        // cs(this.chart);

        this.xLabelPositions = {};

        this.theme = new Theme();
        this.chartX1 = this.yAxisPadding;

        this.scale = (number, [inMin, inMax], [outMin, outMax]) =>
        {
            // if you need an integer value use Math.floor or Math.ceil here
            return (number - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
        }


        this.axes = {};
        this.axes.x = {};
        this.axes.y = {};

        for(let [axisIndex, axisConfig] of instructionConfig){

            this.axes.x[axisIndex]                  = {};
            this.axes.x[axisIndex].key              = axisIndex;
            this.axes.x[axisIndex].axis             = new XAxis(this.theme);
            this.axes.x[axisIndex].data             = [];
            this.axes.x[axisIndex].labelCoordinates = {};

            this.axes.y[axisIndex] = {};
            this.axes.y[axisIndex].axis = new YAxis(this.theme);
            this.axes.y[axisIndex].series = {};

            for(let seriesIndex of axisConfig)
            {
                this.axes.y[axisIndex].series[seriesIndex]     = {};
                this.axes.y[axisIndex].series[seriesIndex]    = {};
            }

        }



        this.cursorPointer = {};
        this.cursorPointer.x = {};
        this.cursorPointer.y = {};

        this.xAxis = new XAxis(this.theme);


    }


    // for every axis, create the series that belong to it
    instantiateSeriesData() {

        for(let [axisKey, AxisInfo] of Object.entries(this.axes.y))
        {
            let minValues = [];
            let maxValues = [];


            let colors = ["#00b2f3", "#B026FF"];

            for(let [seriesKey] of Object.entries(AxisInfo.series))
            {
                let series = new Series(this.svg, this.theme, this.data, seriesKey);
                // series.fill = colors[0];
                // colors.shift();
                series.createSeriesData();
                AxisInfo.series[seriesKey] = series;

                minValues.push(series.valueMin);
                maxValues.push(series.valueMax);
            }
            AxisInfo.valueMin = Math.min.apply(null, minValues);
            AxisInfo.valueMax = Math.max.apply(null, maxValues);
        }

    }


    buildRootContainer() {

        this.svg = document.createElementNS(Chart.svgNameSpace, "svg");
        this.svg.classList.add('chart');
        this.svg.setAttribute("height", "100%");
        this.svg.setAttribute("width", "100%");
        this.svg.appendChild(this.theme.defs);

        // add the svg element to my page
        this.chartDiv.appendChild(this.svg);
    }



    buildAxes() {
        this.buildXAxis();
        this.buildYAxis();
    }

    buildXAxis() {

        for(let [axisIndex, AxisInfo] of Object.entries(this.axes.x))
        {
            for(let [dataIndex, dataRow] of Object.entries(this.data))
            {
                AxisInfo.data.push(dataRow[AxisInfo.key]);
            }


            AxisInfo.axis.createLine(
                this.chart.x,
                this.root.width,
                this.root.height - this.xAxisPadding,
                this.root.height - this.xAxisPadding
            );

            // // build spacing instructions
            let spacing = this.chart.width / (this.data.length-1);

            let labelFrequency = Math.ceil(AxisInfo.data.length / Math.floor(this.chart.width / (this.theme.labelTextWidth + 50)));

            for(let [index, value] of Object.entries(AxisInfo.data))
            {

                if (index % labelFrequency === 0) {
                    AxisInfo.axis.createLabel(
                        this.yAxisPadding + (spacing * index),
                        this.chart.height,
                        value
                    );
                    AxisInfo.axis.createTick(
                        (this.yAxisPadding + (spacing * index)) - (this.theme.tickWidth / 2),
                        this.chart.height - this.theme.tickHeight
                    )
                }

                AxisInfo.labelCoordinates[value] = this.yAxisPadding + (spacing * index) - (this.theme.labelTextWidth/2);

                AxisInfo.axis.createGridLine(
                    this.yAxisPadding + (spacing * index),
                    this.yAxisPadding + (spacing * index),
                    0,
                    this.chart.height
                );

            }

            this.svg.appendChild(AxisInfo.axis.line);
            this.svg.appendChild(AxisInfo.axis.labels);
            this.svg.appendChild(AxisInfo.axis.ticks);
            this.svg.appendChild(AxisInfo.axis.gridLines);

        }



        //
        //
        // this.xAxis.createCursorLine(
        //     this.chartWidth/2,
        //     this.chartWidth/2,
        //     0,
        //     this.chartHeight,
        //     "xAxisCursorLine"
        // );
        //
        // this.xAxis.createValueSlider(
        //     this.chartWidth/2,
        //     this.chartHeight,
        // )
        //
        // this.svg.appendChild(this.xAxis.cursorLine);
        // this.svg.appendChild(this.xAxis.valueSlider);

    }
    buildYAxis() {

        for(let [axisKey, AxisInfo] of Object.entries(this.axes.y)) {


            AxisInfo.axis.createLine(
                this.chart.x,
                this.chart.x,
                0,
                this.chart.height
            );

            // data point anchor point position
            let labelCount      = 10;
            let range           = AxisInfo.valueMax - AxisInfo.valueMin;
            let spacing         = range / labelCount;

            AxisInfo.axis.createLabel(
                0,
                20,
                AxisInfo.valueMax + this.chart.yPadding
            );


            for(let index = AxisInfo.valueMax; index >= AxisInfo.valueMin; index-=spacing)
            {

                let yPos = this.scale(index, [AxisInfo.valueMax, AxisInfo.valueMin], [this.chart.yPadding, this.chart.height - this.chart.yPadding]);

                AxisInfo.axis.createLabel(
                    0,
                    yPos,
                    Math.round(index)
                );
            }


            AxisInfo.axis.createLabel(
                0,
                this.chart.height,
                AxisInfo.valueMin - this.chart.yPadding
            );



            // let i = 0;
            // for(let index = labelCount; index >= 0; index--)
            // {
            //
            //     AxisInfo.axis.createLabel(
            //         0,
            //         10 + (spacing * i),
            //         Math.round(AxisInfo.valueMax * ((index * eachPercentage)/100))
            //     );
            //
            //     AxisInfo.axis.createTick(
            //         this.yAxisPadding - 10,
            //         (spacing * i) + 2.5
            //     )
            //
            //     AxisInfo.axis.createGridLine(
            //         this.chart.x,
            //         this.root.width,
            //         (spacing * index) + 2.5,
            //         (spacing * index) + 2.5
            //     )
            //
            //     this.svg.appendChild(AxisInfo.axis.line);
            //     this.svg.appendChild(AxisInfo.axis.ticks);
                this.svg.appendChild(AxisInfo.axis.labels);
            //     this.svg.appendChild(AxisInfo.axis.gridLines);
            //
            //     i++;
            // }
        }


    }

    addEventListeners() {
        let currentObject = this;
        this.svg.addEventListener('mousemove', function (e) {
            currentObject.setYAxisPosition(e)
            currentObject.setXAxisPosition(e)
            // currentObject.setXValueSlider(e)
            // currentObject.setYAxisPosition(e)

        }, false);
    }

    setYAxisPosition(e) {
        if(e.clientX < this.chart.x) return;
        this.cursorPointer.y.line.setAttribute("x1", e.clientX);
        this.cursorPointer.y.line.setAttribute("x2", e.clientX);
    }
    setXAxisPosition(e) {

        if(e.clientY > (this.root.height - this.xAxisPadding)) return;
        this.cursorPointer.x.line.setAttribute("y1", e.clientY);
        this.cursorPointer.x.line.setAttribute("y2", e.clientY);
    }


    setXValueSlider(e) {
        // broken todo
        let distance = {};
        for(let [label, xPos] of Object.entries(this.xLabelPositions))
        {
            distance[label] = Math.abs((+this.yAxisPadding + xPos) - (e.clientX));
        }
        let sortable = [];
        for (var vehicle in distance) {
            sortable.push([vehicle, distance[vehicle]]);
        }
        sortable.sort(function(a, b) {
            return a[1] - b[1];
        });
        let closestLabel = sortable[0][0];
        this.xAxis.valueSlider.setAttribute("x", e.clientX - 45);
        this.xAxis.valueSlider.setAttribute("x", e.clientX -20);
        this.xAxis.valueSlider.textContent = closestLabel;
    }


    buildSeries() {

        for(let [axisKey, AxisInfo] of Object.entries(this.axes.y))
        {
            for(let [seriesKey, series] of Object.entries(AxisInfo.series))
            {
                series.createSeriesLine();

                // calculate x-Spacing
                let spacing = this.chart.width / (this.data.length-1);

                // first series data-point
                series.createPoint(this.chart.x, this.chart.height);


                for(let [index, dataRow] of Object.entries(this.data))
                {

                    let value = dataRow[series,seriesKey];
                    // data point anchor point position
                    var xPos = this.chart.x + (spacing * index);
                    let yPos = this.scale(value, [AxisInfo.valueMax, AxisInfo.valueMin], [this.chart.yPadding, this.chart.height - this.chart.yPadding]);


                    // create anchor point and append
                    series.createPoint(xPos, yPos);

                    // create a bullet at the data point location
                    series.createBulletPoint(xPos, yPos);
                    // series.createBulletText(xPos, yPos, value);
                }

                // append the final anchor point
                series.createPoint(this.root.width, this.chart.height);
                this.svg.appendChild(series.line);
            }
        }

    }


    buildCursorLines() {


        this.cursorPointer.x.line = this.createCursorLine(
            this.chart.x,
            this.chart.width,
            this.chart.height/2,
            this.chart.height/2,
            "xAxisCursorLine"
        );

        this.cursorPointer.x.valueSlider  = this.createValueSlider(
            this.chart.width/2,
            this.chart.height,
        )

        this.svg.appendChild(this.cursorPointer.x.line);
        this.svg.appendChild(this.cursorPointer.x.valueSlider);


        this.cursorPointer.y.line = this.createCursorLine(
            this.chart.width/2,
            this.chart.width/2,
            0,
            this.chart.height,
            "yAxisCursorLine"
        );

        this.cursorPointer.y.valueSlider  = this.createValueSlider(
            this.chart.width/2,
            this.chart.height,
        )

        this.svg.appendChild(this.cursorPointer.y.line);
        this.svg.appendChild(this.cursorPointer.y.valueSlider);

    }

    createCursorLine(x1, x2, y1, y2, id) {
        let cursorLine = document.createElementNS(Chart.svgNameSpace, "line");
        cursorLine.id = id;
        cursorLine.setAttribute("x1", x1);
        cursorLine.setAttribute("x2", x2);
        cursorLine.setAttribute("y1", y1);
        cursorLine.setAttribute("y2", y2);
        cursorLine.setAttribute("stroke", this.theme.cursorLineStroke);
        cursorLine.setAttribute("stroke-width", this.theme.cursorLineStrokeWidth);
        cursorLine.setAttribute("stroke-dasharray", this.theme.cursorLineStrokeDash);
        return cursorLine;
    }

    createValueSlider(x, y) {

        let cursorPointer = document.createElementNS(Chart.svgNameSpace, "g");

        let boundingRect =  document.createElementNS(Chart.svgNameSpace, "rect");
        boundingRect.setAttribute("x", x);
        boundingRect.setAttribute("y", y);
        boundingRect.setAttribute("width", "90px");
        boundingRect.setAttribute("height", "20px");
        boundingRect.setAttribute("fill", "white");
        boundingRect.setAttribute("opacity", 0);
        cursorPointer.appendChild(boundingRect);

        let value =  document.createElementNS(Chart.svgNameSpace, "text");
        value.setAttribute("x", x);
        value.setAttribute("y", y);
        value.setAttribute("font-size", "12px");
        value.textContent = undefined;
        cursorPointer.appendChild(value);
        return cursorPointer;
    }

}



