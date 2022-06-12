

class Axis {

    svgNameSpace = 'http://www.w3.org/2000/svg';
    line;
    labels;
    cursorLine;
    valueSlider;

    constructor(theme) {

        this.theme          = theme;
        this.labels         = document.createElementNS(Chart.svgNameSpace, "g");
        this.ticks          = document.createElementNS(Chart.svgNameSpace, "g");
        this.gridLines      = document.createElementNS(Chart.svgNameSpace, "g");
        this.valueSlider    = document.createElementNS(Chart.svgNameSpace, "g");
    }


    createLabel(x, y, value) {
        let labelText = document.createElementNS(Chart.svgNameSpace, "text");
        labelText.setAttribute("x", x);
        labelText.setAttribute("y", y);
        labelText.textContent = value;
        this.labels.appendChild(labelText);
    }

    createLine(x1, x2, y1, y2) {
        this.line = document.createElementNS(Chart.svgNameSpace, "line");
        this.line.setAttribute("x1", x1);
        this.line.setAttribute("x2", x2);
        this.line.setAttribute("y1", y1);
        this.line.setAttribute("y2", y2);
        this.line.setAttribute("stroke", this.theme.axisStroke);
        this.line.setAttribute("stroke-width", this.theme.axisStrokeWidth);
    }


    createTick(x, y) {
        let tick = document.createElementNS(Chart.svgNameSpace, "rect");
        tick.setAttribute("x", x);
        tick.setAttribute("y", y);
        tick.setAttribute("height", this.theme.tickHeight);
        tick.setAttribute("width", this.theme.tickWidth);
        tick.setAttribute("fill", this.theme.tickFill);
        this.ticks.appendChild(tick);
    }

    createGridLine(x1, x2, y1, y2) {
        let gridLine = document.createElementNS(Chart.svgNameSpace, "line");
        gridLine.setAttribute("x1", x1);
        gridLine.setAttribute("x2", x2);
        gridLine.setAttribute("y1", y1);
        gridLine.setAttribute("y2", y2);
        gridLine.setAttribute("stroke", this.theme.gridLineStroke);
        gridLine.setAttribute("stroke-width", this.theme.gridLineStrokeWidth);
        this.gridLines.appendChild(gridLine);
    }



}