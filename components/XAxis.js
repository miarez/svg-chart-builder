

class XAxis extends Axis {

    constructor(theme) {
        super(theme);
    }


    createLabel(x, y, value) {
        let labelText = document.createElementNS(this.svgNameSpace, "text");
        labelText.setAttribute("x", x -  (this.theme.labelTextWidth/2));
        labelText.setAttribute("y", y + this.theme.labelTextHeight);
        labelText.textContent = value;
        this.labels.appendChild(labelText);
    }



}