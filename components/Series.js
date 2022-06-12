

class Series {

    svgNameSpace = 'http://www.w3.org/2000/svg';

    data;
    line;

    valueMax;
    valueMin;

    labels;


    constructor(
        svg,
        theme,
        data,
        seriesKey
    ) {
        this.allData    = data;
        this.seriesKey  = seriesKey
        this.svg        = svg;
        this.theme      = theme;


        this.fill = this.theme.seriesFill;

    }

    createSeriesData() {

        this.data = [];
        for(let [index, dataRow] of Object.entries(this.allData))
        {
            this.data.push(dataRow[this.seriesKey]);
        }
        this.allData = undefined;
        this.data.sort().reverse();

        this.valueMax = Math.max.apply(null, this.data);
        this.valueMin = Math.min.apply(null, this.data);
    }


    createSeriesLine() {
        this.line =document.createElementNS(Chart.svgNameSpace, "polyline");
        this.line.setAttribute("fill", this.fill);
        this.line.setAttribute("opacity", 0.3);
        this.line.setAttribute("stroke", this.theme.seriesStroke);
        this.line.setAttribute("stroke-width", this.theme.seriesStrokeWidth);
    }

    createPoint(x , y) {
        var point = this.svg.createSVGPoint();
        point.x = x;
        point.y = y;
        this.line.points.appendItem(point);
    }

    createBulletPoint(x, y) {
        let bulletPoint =  document.createElementNS(Chart.svgNameSpace, "circle");
        bulletPoint.setAttribute("cx", x);
        bulletPoint.setAttribute("cy",  y);
        bulletPoint.setAttribute("r", this.theme.bulletPoint.radius);
        bulletPoint.setAttribute("fill", this.theme.bulletPoint.fill);
        this.svg.appendChild(bulletPoint);
    }

    createBulletText(x, y, value) {
        let labelText = document.createElementNS(Chart.svgNameSpace, "text");
        labelText.setAttribute("x", x);
        labelText.setAttribute("y", y);
        labelText.textContent = value;
        this.svg.appendChild(labelText);    }


}