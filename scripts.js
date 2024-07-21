d3.csv("cars2017.csv").then(function(data) {
    // Preprocess the data
    data.forEach(d => {
        d.AverageCityMPG = +d.AverageCityMPG;
        d.AverageHighwayMPG = +d.AverageHighwayMPG;
        d.EngineCylinders = +d.EngineCylinders;
    });

    // Initial scene
    console.log("Creating initial scene...");
    createOverviewScene(data);

    // Event listeners for buttons
    console.log("Adding event listeners...");
    d3.select("#overview-btn").on("click", () => {
        console.log("Overview button clicked");
        createOverviewScene(data);
    });
    d3.select("#mpg-scatter-btn").on("click", () => {
        console.log("MPG scatter button clicked");
        createScatterPlotScene(data);
    });
    d3.select("#cylinders-mpg-btn").on("click", () => {
        console.log("Cylinders MPG button clicked");
        createEngineCylindersScene(data);
        d3.select("#cylinders-mpg-controls").style("display", "block");
    });
    d3.select("#fuel-mpg-btn").on("click", () => {
        console.log("Fuel MPG button clicked");
        createFuelTypeScene(data);
    });

    d3.select("#mpg-type-select").on("change", function() {
        const selected = d3.select(this).property("value");
        console.log(`MPG type selected: ${selected}`);
        updateEngineCylindersScene(data, selected);
    });
});

function createOverviewScene(data) {
    console.log("Creating overview scene...");
    d3.select("#viz").html("");
    d3.select("#cylinders-mpg-controls").style("display", "none");
    // Add code to create the overview visualization
}

function createScatterPlotScene(data) {
    console.log("Creating scatter plot scene...");
    d3.select("#viz").html("");
    d3.select("#cylinders-mpg-controls").style("display", "none");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const x = d3.scaleLog()
        .domain([10, 150])
        .range([50, 750])
        .base(10);
    
    const y = d3.scaleLog()
        .domain([10, 150])
        .range([550, 50])
        .base(10);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.AverageCityMPG))
        .attr("cy", d => y(d.AverageHighwayMPG))
        .attr("r", d => 2 + d.EngineCylinders)
        .attr("fill", "blue")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Make: ${d.Make}<br>Fuel Type: ${d.Fuel}<br>Engine Cylinders: ${d.EngineCylinders}<br>City MPG: ${d.AverageCityMPG}<br>Highway MPG: ${d.AverageHighwayMPG}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    const xAxis = d3.axisBottom(x)
        .tickValues([10, 20, 50, 100])
        .tickFormat(d3.format("~s"));
    const yAxis = d3.axisLeft(y)
        .tickValues([10, 20, 50, 100])
        .tickFormat(d3.format("~s"));

    svg.append("g")
        .attr("transform", "translate(0, 550)")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("City MPG vs Highway MPG (Log Scale)");

    // Add annotation
    const annotations = [{
        note: {
            label: "These cars are the most fuel efficient",
            title: "Fuel Efficient Cars"
        },
        x: 550,
        y: 100,
        dy: -30,
        dx: -30,
        subject: {
            width: 250,
            height: 150
        }
    }];

    const makeAnnotations = d3.annotation()
        .type(d3.annotationCalloutRect)
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

function createEngineCylindersScene(data) {
    console.log("Creating engine cylinders scene...");
    d3.select("#viz").html("");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.EngineCylinders))
        .range([50, 750]);
    
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.AverageCityMPG))
        .range([550, 50]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.EngineCylinders))
        .attr("cy", d => y(d.AverageCityMPG))
        .attr("r", 5);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("transform", "translate(0, 550)")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Engine Cylinders vs City MPG");
}

function updateEngineCylindersScene(data, selected) {
    console.log("Updating engine cylinders scene...");
    const svg = d3.select("#viz svg");
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG))
        .range([550, 50]);

    svg.selectAll("circle")
        .transition()
        .duration(500)
        .attr("cy", d => y(selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG));

    const yAxis = d3.axisLeft(y);
    svg.select(".y.axis")
        .transition()
        .duration(500)
        .call(yAxis);

    svg.select("text")
        .text(`Engine Cylinders vs ${selected === "city" ? "City MPG" : "Highway MPG"}`);
}

function createFuelTypeScene(data) {
    console.log("Creating fuel type scene...");
    d3.select("#viz").html("");
    d3.select("#cylinders-mpg-controls").style("display", "none");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const fuelTypes = Array.from(new Set(data.map(d => d.Fuel)));
    const x = d3.scaleBand()
        .domain(fuelTypes)
        .range([50, 750])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AverageCityMPG)])
        .range([550, 50]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Fuel))
        .attr("y", d => y(d.AverageCityMPG))
        .attr("width", x.bandwidth())
        .attr("height", d => 550 - y(d.AverageCityMPG))
        .attr("fill", "steelblue");

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("transform", "translate(0, 550)")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Fuel Type vs City MPG");
}
