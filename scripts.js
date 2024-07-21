d3.csv("cars2017.csv").then(function(data) {
    // Preprocess the data
    data.forEach(d => {
        d.AverageCityMPG = +d.AverageCityMPG;
        d.AverageHighwayMPG = +d.AverageHighwayMPG;
        d.EngineCylinders = +d.EngineCylinders;
    });

    // Initial scene
    createOverviewScene(data);

    // Event listeners for buttons
    d3.select("#overview-btn").on("click", () => createOverviewScene(data));
    d3.select("#mpg-scatter-btn").on("click", () => createMPGScatterScene(data));
    d3.select("#cylinders-mpg-btn").on("click", () => createCylindersMPGScene(data));
    d3.select("#fuel-mpg-btn").on("click", () => createFuelMPGScene(data));

    // Event listener for MPG type selection
    d3.select("#mpg-type-select").on("change", function() {
        createCylindersMPGScene(data);
    });
});

function createOverviewScene(data) {
    d3.select("#viz").html("");
    d3.select("#cylinders-mpg-controls").style("display", "none");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    svg.append("text")
        .attr("x", 400)
        .attr("y", 300)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Car Purchase Recommendations");

    svg.append("text")
        .attr("x", 400)
        .attr("y", 350)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Explore the best car options based on various criteria.");
}

function createMPGScatterScene(data) {
    d3.select("#viz").html("");
    d3.select("#cylinders-mpg-controls").style("display", "none");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const x = d3.scaleLog()
        .base(10)
        .domain([10, 150])
        .range([50, 750]);

    const y = d3.scaleLog()
        .base(10)
        .domain([10, 150])
        .range([550, 50]);

    const r = d => 2 + d.EngineCylinders;

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.AverageCityMPG))
        .attr("cy", d => y(d.AverageHighwayMPG))
        .attr("r", r);

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
        .style("font-size", "20px")
        .text("City MPG vs Highway MPG (Log Scale)");

    svg.append("text")
        .attr("x", 400)
        .attr("y", 590)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Average City MPG");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -300)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Average Highway MPG");
}

function createCylindersMPGScene(data) {
    d3.select("#viz").html("");
    d3.select("#cylinders-mpg-controls").style("display", "block");

    const mpgType = d3.select("#mpg-type-select").property("value");
    const yValue = mpgType === "city" ? "AverageCityMPG" : "AverageHighwayMPG";

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.EngineCylinders)])
        .range([50, 750]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yValue])])
        .range([550, 50]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.EngineCylinders))
        .attr("cy", d => y(d[yValue]))
        .attr("r", 5);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("transform", "translate(0, 550)")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate &#8203;:citation[oaicite:0]{index=0}&#8203;
