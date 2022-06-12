

class Theme {

    axisStroke;
    axisStrokeWidth;

    seriesFill;
    seriesStroke;
    seriesStrokeWidth;

    labelTextHeight;
    labelTextWidth;

    bulletPoint = {};


    tickHeight;
    tickWidth;
    tickFill;

    gridLineStroke;
    gridLineStrokeWidth;

    cursorLineStroke;
    cursorLineStrokeWidth;
    cursorLineStrokeDash;


    constructor() {

        this.gradient  = new Gradient();
        this.defs       = document.createElementNS(Chart.svgNameSpace, 'defs');
        this.basic();

    }

    basic() {


        this.defs.appendChild(this.gradient.linear());

        this.axisStroke         = "grey";
        this.axisStrokeWidth    = "0.5px";

        this.seriesFill         = "url(#Gradient)";
        // this.seriesFill         = "none";
        this.seriesStroke       = "#00b2f3";
        this.seriesStrokeWidth  = 4;



        this.bulletPoint.radius   = 5;
        this.bulletPoint.fill     = "lightblue";


        this.labelTextHeight = 15;
        this.labelTextWidth  = 70;

        this.tickHeight     = 5;
        this.tickWidth      = 5;
        this.tickFill       = "grey";


        this.gridLineStroke         = "gainsboro";
        this.gridLineStrokeWidth    = "0.3px";

        this.cursorLineStroke = "grey";
        this.cursorLineStrokeWidth = "0.5px";
        this.cursorLineStrokeDash = "4 1 2 3";

    }




}