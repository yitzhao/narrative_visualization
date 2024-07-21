d3.csv("cars2017.csv").then(function(data) {
    // Preprocess the data
    data.forEach(d => {
        d.AverageCityMPG = +d.AverageCityMPG;
        d.AverageHighwayMPG = +d.AverageHighwayMPG;
        d.EngineCylinders = +d.EngineCylinders;
    });

    // Initial scene (Overview)
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
        d3.select("#fuel-mpg-controls").style("display", "block");
    });
    d3.select("#make-mpg-btn").on("click", () => {
        console.log("Make MPG button clicked");
        createMakeMPGScene(data);
        d3.select("#make-mpg-controls").style("display", "block");
    });

    d3.select("#mpg-type-select").on("change", function() {
        const selected = d3.select(this).property("value");
        console.log(`MPG type selected: ${selected}`);
        updateEngineCylindersScene(data, selected);
    });

    d3.select("#mpg-type-fuel").on("change", function() {
        const selected = d3.select(this).property("value");
        console.log(`MPG type selected for fuel: ${selected}`);
        updateFuelTypeScene(data, selected);
    });

    d3.select("#mpg-type-make").on("change", function() {
        const selected = d3.select(this).property("value");
        console.log(`MPG type selected for make: ${selected}`);
        updateMakeMPGScene(data, selected);
    });
});

function createOverviewScene(data) {
    createScatterPlotScene(data);
}

function createScatterPlotScene(data) {
    console.log("Creating scatter plot scene...");
    d3.select("#viz").html("");
    d3.selectAll(".controls").style("display", "none");

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
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "lightsteelblue")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

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

    // Note for hover information
    svg.append("text")
        .attr("x", 400)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Hover over the points to see the general information of the cars");

    // Add annotation
    svg.append("rect")
        .attr("x", 550)
        .attr("y", 50)
        .attr("width", 200)
        .attr("height", 200)
        .attr("fill", "lightgreen")
        .attr("opacity", 0.3)
        .attr("pointer-events", "none"); // Make the rectangle not interfere with mouse events

    svg.append("text")
        .attr("x", 760)
        .attr("y", 70)
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Fuel Efficient Cars");

    svg.append("text")
        .attr("x", 760)
        .attr("y", 90)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text("These cars have both high city and highway MPG.");
}

function createEngineCylindersScene(data) {
    console.log("Creating engine cylinders scene...");
    d3.select("#viz").html("");
    d3.selectAll(".controls").style("display", "none");
    d3.select("#cylinders-mpg-controls").style("display", "block");

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

function updateFuelTypeScene(data, selected) {
    console.log("Updating fuel type scene...");
    const svg = d3.select("#viz svg");

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG)])
        .range([550, 50]);

    const yAxis = d3.axisLeft(y);

    svg.selectAll("rect")
        .transition()
        .duration(500)
        .attr("y", d => y(selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG))
        .attr("height", d => 550 - y(selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG));

    svg.select("g.y-axis")
        .transition()
        .duration(500)
        .call(yAxis);

    svg.select("text.title")
        .text(`Fuel Type vs ${selected === "city" ? "City MPG" : "Highway MPG"}`);
}


function createFuelTypeScene(data) {
    console.log("Creating fuel type scene...");
    d3.select("#viz").html("");
    d3.selectAll(".controls").style("display", "none");
    d3.select("#fuel-mpg-controls").style("display", "block");

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
        .attr("class", "y-axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    svg.append("text")
        .attr("class", "title")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Fuel Type vs City MPG");

    d3.select("#mpg-type-fuel").on("change", function() {
        const selected = d3.select(this).property("value");
        updateFuelTypeScene(data, selected);
    });
}

function updateFuelTypeScene(data, selected) {
    console.log("Updating fuel type scene...");
    const svg = d3.select("#viz svg");

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG)])
        .range([550, 50]);

    const yAxis = d3.axisLeft(y);

    svg.selectAll("rect")
        .transition()
        .duration(500)
        .attr("y", d => y(selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG))
        .attr("height", d => 550 - y(selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG));

    svg.select("g.y-axis")
        .transition()
        .duration(500)
        .call(yAxis);

    svg.select("text.title")
        .text(`Fuel Type vs ${selected === "city" ? "City MPG" : "Highway MPG"}`);
}

function createMakeMPGScene(data) {
    console.log("Creating make MPG scene...");
    d3.select("#viz").html("");
    d3.selectAll(".controls").style("display", "none");
    d3.select("#make-mpg-controls").style("display", "block");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const makes = Array.from(new Set(data.map(d => d.Make)));
    const x = d3.scaleBand()
        .domain(makes)
        .range([50, 750])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AverageCityMPG)])
        .range([550, 50]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Make))
        .attr("y", d => y(d.AverageCityMPG))
        .attr("width", x.bandwidth())
        .attr("height", d => 550 - y(d.AverageCityMPG))
        .attr("fill", "steelblue");

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("transform", "translate(0, 550)")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    svg.append("text")
        .attr("class", "title")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Make vs City MPG");

    d3.select("#mpg-type-make").on("change", function() {
        const selected = d3.select(this).property("value");
        updateMakeMPGScene(data, selected);
    });
}


function updateMakeMPGScene(data, selected) {
    console.log("Updating make MPG scene...");
    const svg = d3.select("#viz svg");

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG)])
        .range([550, 50]);

    const yAxis = d3.axisLeft(y);

    svg.selectAll("rect")
        .transition()
        .duration(500)
        .attr("y", d => y(selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG))
        .attr("height", d => 550 - y(selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG));

    svg.select("g.y-axis")
        .transition()
        .duration(500)
        .call(yAxis);

    svg.select("text.title")
        .text(`Make vs ${selected === "city" ? "City MPG" : "Highway MPG"}`);
}
