let width = 960,
    height = 700,
    centered;



// Promise.all first loads these files and will run the function afterwards.
Promise.all([
    d3.json("thailand.json"),
    d3.csv("coordinates.csv")
]).then( ([provinceData ,coordinates]) => {
    createMap(provinceData, coordinates)

})

/**
 * This function is everything from creating the leaflet map to drawing the geoJSON
 * provinces, plotting the wildfire data using D3, and doing all the map interactions (zooming, slider, tables)
 * @param provinceData the geoJSON file with the province data
 * @param coordinates the csv file with the wildfire data
 */
function createMap(provinceData, coordinates) {


    var allGroup = d3.map(coordinates, function(d){return(d.acq_date);}); // This takes the entire column for the date

    // uniqueDates is an array of the unique dates in coordinates. It is used to determine the max value of the slider
    // As well as indexing through it to filter for different dates from the coordinates.csv data
    let uniqueDates = allGroup.filter((item, i, ar) => ar.indexOf(item) === i);

    // dataForDate returns the rows from the csv that have the desired date the slider is selecting. We start with the first date
    var dataForDate = coordinates.filter(function(d) {
        return d["acq_date"] === uniqueDates[0]
    });


    // Get the slider and its output div from the HTML
    var slider = document.getElementById("mySlider"),
        output = document.getElementById("sliderValue");

    slider.setAttribute("max", (uniqueDates.length - 1)); // set the number of slider points to be equal to the number of unique dates from the data

    output.innerHTML = uniqueDates[slider.value]; // Output the slider value to equal the date so the user knows what data is currently being shown

    // This updates the date that is displayed to the user every time the user changes the slider value.
    // It also runs changeDate() which updates the wildfire data points on the map.
    slider.oninput = function () {
        changeDate();
        output.innerHTML = uniqueDates[slider.value];
    }

    // Create/attach the leaflet map to our map div.
    var map = new L.Map("map", {center: [13.7, 100.5], zoom: 5, minZoom: 4, maxZoom: 12})
        .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));


    // Add provinces from geoJSON file.
    // Create a new array and parse through the provinceData file to get the geoJSON object itself and add it to the array
    var provinces = new Array;
    var j;
    for (j = 0; j < provinceData.features.length; j++) {
        provinces.push(provinceData.features[j]);
    }

    var geojson;

    // Adds the provinces to the leaflet map
    function addProvinces() {
        geojson = L.geoJSON(provinces, {
            style: style,
            onEachFeature, make_graph
        }).addTo(map);
    }

    addProvinces();

    // Styles the geoJSON provinces
    function style(feature) {
        if (map.getZoom() > 9) {
            return {
                "color": "blue",
                "weight" : "0",
                "fillOpacity": "0"
            }
        } else {
            return {
                "color": "blue",
                "fillOpacity": "0"
            }
        }
    }

    // What gets added to each province object. For this, we just tell it what to do when its clicked
    function onEachFeature(feature, layer) {
        layer.on({
            click: zoomToFeature,
        });
    }
    function make_graph(province) {
        console.log("You clicked on a province");
        console.log(province)

        // Fetch
        // Method: GET
        // You're gonna get a response variable
        // Parse out the data that got sent.

        // Lets get all the coordinates for the past week
        let timeline_coords = coordinates.filter(function(d) {
            return d3.geoContains(province, [d["longitude"], d["latitude"]]);
        });

        // Now lets get the dates, and how many coords for each date
        let graph_array = []
        let graph_unique_dates = new Set()

        uniqueDates.forEach(date => {
            graph_array.push( { "date" : date, "count" : 0 } )
        })

        console.log(graph_array)

        timeline_coords.forEach(coord => {
            let date = coord["acq_date"]
            let record = graph_array.find(item=>item.date==date)
            record["count"] = record["count"] + 1
        })

        console.log(graph_array)

        // drawLineChart(graph_array, province.properties.name);
        drawBarGraph(graph_array, province.properties.name);

    }

    // What happens when you clean on the geoJSON feature.
    // e is the mouse event. e.target is the province object
    function zoomToFeature(e) {
        make_graph(e.target.feature)
        map.flyToBounds(e.target.getBounds());

        // Need to reset and make all the dots yellow again.
        for (var i = 0; i < dataForDate.length; i++) {
            allCircles[i].setAttribute("fill", "#FFD061");
        }

        document.querySelector('#provinceName').innerHTML = e.target.feature.properties.name; // Selector for the dots in the specific province you clicked on
        var j;
        firesInsideProvince(e.target.feature);

        // This function finds all the dots within the feature and make them red
        function firesInsideProvince(feature) {
            allCoord = new Array;
            var i;
            for(i = 0; i < dataForDate.length; i++) {
                if(d3.geoContains(feature, [dataForDate[i].longitude, dataForDate[i].latitude])) {
                    allCircles[i].setAttribute("fill", "red");
                    allCoord.push(dataForDate[i]);
                }
            }
        }
    }
    var allCoord = new Array; // An array for all the coordinates inside the province

    // Finds the overlayPane div and places an svg layer inside that has a class name of "circle-layer"
    // There is also a g div in the svg with a name of "inner-CL"
    // svg1 is essentially just the bounds for the wildfire data. If a circle is places outside of this layer, it will not be shown on the page
    // g1 contains all the circles. Here, we can put styles that are similar to all data.
    var svg1 = d3.select(map.getPanes().overlayPane).append("svg").attr("class", "circle-layer"),
        g1 = svg1.append("g").attr("class", "inner-CL");

    // This takes the path and fits the projection on it using the function below
    var transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);


    // Creates all the circle elements in the circle-layer div based on the date selected from dataForDate
    g1.selectAll("circle")
        .data(dataForDate)
        .enter().append("circle");

    g1.attr("id", "inner-CL");

    // Selector. Selects all the circle elements in the inner-CL div
    var allCircles = document.querySelectorAll(".inner-CL > circle");

    const table = document.querySelector('#wildfireInfo')

    // Sets all the attributes for each circle element
    for (var i = 0; i < dataForDate.length; i++) {
        if (coordinates[i].latitude > 5 && dataForDate[i].latitude < 20) { // This only sets attributes if the coordinates are within this latitude
            if (dataForDate[i].longitude > 98 && dataForDate[i].longitude < 105) { // and within this longitude
                allCircles[i].classList.add(i);
                allCircles[i].setAttribute("r", 4);
                allCircles[i].setAttribute("stroke-width", 1);
                allCircles[i].setAttribute("stroke", "#4F442B");
                allCircles[i].setAttribute("fill", "#FFD061");
                allCircles[i].setAttribute("cx", map.latLngToLayerPoint(new L.LatLng(dataForDate[i].latitude, dataForDate[i].longitude)).x); // This projects the coordinate from LatLng to the correct pixel on the webpage
                allCircles[i].setAttribute("cy", map.latLngToLayerPoint(new L.LatLng(dataForDate[i].latitude, dataForDate[i].longitude)).y);

                // This function runs when the dot is clicked
                allCircles[i].onclick = function () {

                    wildfireID = this.className.animVal

                    console.log(wildfireID)
                    console.log(coordinates[wildfireID])

                    // Updates the table with the correct information for that specific wildfire
                    document.querySelector('#acqDate').innerHTML = dataForDate[wildfireID].acq_date
                    document.querySelector('#acqTime').innerHTML = dataForDate[wildfireID].acq_time
                    document.querySelector('#latitude').innerHTML = dataForDate[wildfireID].latitude
                    document.querySelector('#longitude').innerHTML = dataForDate[wildfireID].longitude
                    document.querySelector('#dOrN').innerHTML = dataForDate[wildfireID].daynight
                    document.querySelector('#satellite').innerHTML = dataForDate[wildfireID].satellite
                    document.querySelector('#version').innerHTML = dataForDate[wildfireID].version
                };

                // What happens when the mouse hovers over the dot
               allCircles[i].onmouseover = function () {
                   this.setAttribute('fill', '#F50D00')
                }

                // What happens when the mouse no longer hovers over the dot
                allCircles[i].onmouseout = function () {
                    this.setAttribute('fill', '#FFD061')
                }
            }
        }
    }

    svg1.attr("width", 2000)
        .attr("height", 2000)
        .attr("pointer-events", "none"); // This allows us to click through the svg layer so that we can click on the dots


    /**
     * Handles the slider moving position and updates the map so that the data displayed corresponds to the correct date
     * @param e is a mouse click event
     */
    function changeDate(e) {
        // Update the desired date
        dataForDate = coordinates.filter(function(d) {
            return d["acq_date"] === uniqueDates[document.getElementById("mySlider").value]
        });

        const node = document.getElementById("inner-CL"); // find the inner-CL div
        node.innerHTML = ""; // delete all the circle elements that were in the inner-CL div

        g1.selectAll("circle")
            .data(dataForDate)
            .enter().append("circle"); // Like before, this created the correct number of circle elements in this layer depending on the date

        // Selector. Selects all the circle elements in the circle-layer div
        allCircles = document.querySelectorAll(".inner-CL > circle");

        // Sets all the attributes for each circle element
        for(var i = 0; i < dataForDate.length; i++) {
            if (dataForDate[i].latitude > 4 && dataForDate[i].latitude < 21) {
                if (dataForDate[i].longitude > 95 && dataForDate[i].longitude < 107) {
                    allCircles[i].classList.add(i);
                    allCircles[i].setAttribute("r", 4)
                    allCircles[i].setAttribute("stroke-width", 1);
                    allCircles[i].setAttribute("stroke", "#4F442B");
                    allCircles[i].setAttribute("fill", "#FFD061");
                    allCircles[i].setAttribute("cx", map.latLngToLayerPoint(new L.LatLng(dataForDate[i].latitude, dataForDate[i].longitude)).x);
                    allCircles[i].setAttribute("cy", map.latLngToLayerPoint(new L.LatLng(dataForDate[i].latitude, dataForDate[i].longitude)).y);
                    allCircles[i].onclick = function () {
                        wildfireID = this.className.animVal

                        console.log(wildfireID)
                        console.log(dataForDate[wildfireID])

                        document.querySelector('#acqDate').innerHTML = dataForDate[wildfireID].acq_date
                        document.querySelector('#acqTime').innerHTML = dataForDate[wildfireID].acq_time
                        document.querySelector('#latitude').innerHTML = dataForDate[wildfireID].latitude
                        document.querySelector('#longitude').innerHTML = dataForDate[wildfireID].longitude
                        document.querySelector('#dOrN').innerHTML = dataForDate[wildfireID].daynight
                        document.querySelector('#satellite').innerHTML = dataForDate[wildfireID].satellite
                        document.querySelector('#version').innerHTML = dataForDate[wildfireID].version
                    };

                    allCircles[i].onmouseover = function () {
                        this.setAttribute('fill', '#F50D00')
                    }
                    allCircles[i].onmouseout = function () {
                        this.setAttribute('fill', '#FFD061')
                    }

                }
            }
        }
    }

    map.on("zoom", reset); // When the user zooms in or out, this function should run

    // After the map finished zooming run this function. All it does is remove the geoJSON objects and adds them back again
    // This is needed because we have different styling depending on the zoom level. When you zoom in far enough,
    // the border for the provinces dissapear as they are not as detailed as the ones included in the leaflet map
    map.on("zoomend", function(){
        geojson.removeFrom(map);
        addProvinces();
    });

    reset();

    /**
     * This function runs every time the map zooms in or out. The point of this, is that the svg1 layer
     * needs to recalculate how big it is. The wildfire data also needs to recalculate where to draw itself.
     */
    function reset() {
        var bounds = path.bounds(provinceData),
            topLeft = bounds[0],
            bottomRight = bounds[1];

        svg1.style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px")
            .attr("width", 2000*map.getZoom())
            .attr("height", 2000*map.getZoom());

        g1.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")")
            .attr("pointer-events", "all");;

        const allCircles = document.querySelectorAll(".inner-CL > circle");
        for(i = 0; i < dataForDate.length; i++) {
            allCircles[i].setAttribute("cx", map.latLngToLayerPoint(new L.LatLng(dataForDate[i].latitude, dataForDate[i].longitude)).x);
            allCircles[i].setAttribute("cy", map.latLngToLayerPoint(new L.LatLng(dataForDate[i].latitude, dataForDate[i].longitude)).y);
        }
    }

    // Converts a LatLng to a correct pixel for the webpage so that its in the correct location in the leaflet map.
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

    function drawLineChart(dataset, province_name) {

        const yAccessor = (d) => d.count;
        const dateParser = d3.timeParse("%Y-%m-%d");
        const xAccessor = (d) => (dateParser(d.date));
        // const xAccessor = (d) => (d.date);
        // console.log(dataset[0].date)
        // console.log(dateParser(dataset[0].date))
        // console.log(typeof dateParser(dataset[0].date))

        //Check the value of xAccessor function now
        //console.log(xAccessor(dataset[0]));

        // 2. Create a chart dimension by defining the size of the Wrapper and Margin

        let dimensions = {
            width: window.innerWidth * 0.6,
            height: 600,
            margin: {
                top: 115,
                right: 20,
                bottom: 40,
                left: 60,
            },
        };
        dimensions.boundedWidth =
            dimensions.width - dimensions.margin.left - dimensions.margin.right;
        dimensions.boundedHeight =
            dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

        // 3. Draw Canvas

        // clear canvas
        document.getElementById("wrapper").innerHTML = ""

        const wrapper = d3
            .select("#wrapper")
            .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);

        //Log our new Wrapper Variable to the console to see what it looks like
        //console.log(wrapper);

        // 4. Create a Bounding Box

        const bounds = wrapper
            .append("g")
            .style(
                "transform",
                `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
            );

        // 5. Define Domain and Range for Scales

        const yScale = d3
            .scaleLinear()
            .domain([0,d3.max(dataset, yAccessor)])
            .range([dimensions.boundedHeight, 0]);

        // console.log(yScale(100));
        const referenceBandPlacement = yScale(100);
        const referenceBand = bounds
            .append("rect")
            .attr("x", 0)
            .attr("width", dimensions.boundedWidth)
            .attr("y", referenceBandPlacement)
            .attr("height", dimensions.boundedHeight - referenceBandPlacement)
            .attr("fill", "#ffece6");

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(dataset, xAccessor))
            .range([0, dimensions.boundedWidth]);

        //6. Convert a datapoints into X and Y value

        const lineGenerator = d3
            .line()
            .x((d) => xScale(xAccessor(d)))
            .y((d) => yScale(yAccessor(d)))
            .curve(d3.curveBasis);

        // 7. Convert X and Y into Path

        const line = bounds
            .append("path")
            .attr("d", lineGenerator(dataset))
            .attr("fill", "none")
            .attr("stroke", "Red")
            .attr("stroke-width", 2);

        //8. Create X axis and Y axis
        // Generate Y Axis

        const yAxisGenerator = d3.axisLeft().scale(yScale);
        const yAxis = bounds.append("g").call(yAxisGenerator);

        // Generate X Axis
        const xAxisGenerator = d3.axisBottom().ticks(dataset.length).scale(xScale);
        const xAxis = bounds
            .append("g")
            .call(xAxisGenerator.tickFormat(d3.timeFormat("%b,%d")))
            .style("transform", `translateY(${dimensions.boundedHeight}px)`);

        //9. Add a Chart Header

        wrapper
            .append("g")
            .style("transform", `translate(${50}px,${15}px)`)
            .append("text")
            .attr("class", "title")
            .attr("x", dimensions.width / 2)
            .attr("y", dimensions.margin.top / 2)
            .attr("text-anchor", "middle")
            .text("Data for " + province_name)
            .style("font-size", "36px")
            .style("text-decoration", "underline");
    }

    function drawBarGraph(data, province_name) {
        document.getElementById("bar_graph").innerHTML = ""

        var svg = d3.select("#bar_graph"),
            margin = 200,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin;


        var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
            yScale = d3.scaleLinear().range ([height, 0]);

        var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

        // Step 2
        xScale.domain(data.map(function(d) { return d.date; }));
        yScale.domain([0, d3.max(data, function(d) { return d.count; })]);

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }).ticks(10))
            .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("value");

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.date); })
            .attr("y", function(d) { return yScale(d.count); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - yScale(d.count); });
    }

}


