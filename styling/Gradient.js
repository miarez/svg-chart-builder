class Gradient {

    constructor() {
        this.svgNameSpace = 'http://www.w3.org/2000/svg';
    }

    linear() {

        let gradient    = document.createElementNS(Chart.svgNameSpace, 'linearGradient');

        // Store an array of stop information for the <linearGradient>
        let stops = [
            {
                "color": "#00b2f3",
                "offset": "0%",
            },{
                "color": "white",
                "offset": "100%"
            }
        ];

        // Parses an array of stop information and appends <stop> elements to the <linearGradient>
        for (let i = 0, length = stops.length; i < length; i++)
        {

            // Create a <stop> element and set its offset based on the position of the for loop.
            var stop = document.createElementNS(this.svgNameSpace, 'stop');
            stop.setAttribute('offset', stops[i].offset);
            stop.setAttribute('stop-color', stops[i].color);


            // Add the stop to the <lineargradient> element.
            gradient.appendChild(stop);
        }

        gradient.id = 'Gradient';
        gradient.setAttribute('x1', '0');
        gradient.setAttribute('x2', '0');
        gradient.setAttribute('y1', '0');
        gradient.setAttribute('y2', '1');
        // gradient.setAttribute("opacity", "0");

        return gradient;
    }


}