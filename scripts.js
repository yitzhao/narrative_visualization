d3.csv("cars2017.csv").then(function(data) {
    // Preprocess the data
    data.forEach(d => {
        d.AverageCityMPG = +d.AverageCityMPG;
        d.AverageHighwayMPG = +d.AverageHighwayMPG;
        d.EngineCylinders = +d.EngineCylinders;
    });

    // Initial scene
    createScatterPlotScene(data);

    // Event listeners for buttons
    d3.select("#scatterplot-btn").on("click", () => createScatterPlotScene(data));
    d3.select("#enginecylinders-btn").on("click", () => createEngineCylindersScene(data));
    d3.select("#fueltype-btn").on("click", () => createFuelTypeScene(data));
});

function createScatterPlotScene(data) {
    d3.select("#viz").html("");

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

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.AverageCityMPG))
        .attr("cy", d => y(d.AverageHighwayMPG))
        .attr("r", d => 2 + d.EngineCylinders);

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
}

function createEngineCylindersScene(data) {
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

    // Adding a dropdown to switch between City and Highway MPG
    d3.select("#controls").append("select")
        .attr("id", "mpg-type")
        .selectAll("option")
        .data(["City MPG", "Highway MPG"])
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    d3.select("#mpg-type").on("change", function() {
        const selected = d3.select(this).property("value");
        y.domain(d3.extent(data, d => selected === "City MPG" ? d.AverageCityMPG : d.AverageHighwayMPG));
        svg.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cy", d => y(selected === "City MPG" ? d.AverageCityMPG : d.AverageHighwayMPG));
        svg.select(".y.axis")
            .transition()
            .duration(500)
            .call(yAxis);
        svg.select("text")
            .text(`Engine Cylinders vs ${selected}`);
    });
}

function createFuelTypeScene(data) {
    d3.select("#viz").html("");

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

    // Adding a dropdown to switch between City and Highway MPG
    d3.select("#controls").append("select")
        .attr("id", "mpg-type-fuel")
        .selectAll("option")
        .data(["City MPG", "Highway MPG"])
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    d3.select("#mpg-type-fuel").on("change", function() {
        const selected = d3.select(this).property("value");
        y.domain([0, d3.max(data, d => selected === "City MPG" ? d.AverageCityMPG : d.AverageHighwayMPG)]);
        svg.selectAll("rect")
            .transition()
            .duration(500)
            .attr("y", d => y(selected === "City MPG" ? d.AverageCityMPG : d.AverageHighwayMPG))
            .attr("height", d => 550 - y(selected === "City MPG" ? d.AverageCityMPG : d.AverageHighwayMPG));
        svg.select(".y.axis")
            .transition()
            .duration(500)
            .call(yAxis);
        svg.select("text")
            .text(`Fuel Type vs ${selected}`);
    });
}
