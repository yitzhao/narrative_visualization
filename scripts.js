d3.csv("cars2017.csv").then(function(data) {
    // Preprocess the data
    data.forEach(d => {
        d.MPG = +d.MPG;
        d.Horsepower = +d.Horsepower;
    });

    // Initial scene
    createIntroScene(data);

    // Event listeners for buttons
    d3.select("#intro-btn").on("click", () => createIntroScene(data));
    d3.select("#mpg-btn").on("click", () => createMPGScene(data));
    d3.select("#horsepower-btn").on("click", () => createHorsepowerScene(data));
    d3.select("#interactive-btn").on("click", () => createInteractiveScene(data));
});

function createIntroScene(data) {
    d3.select("#viz").html("");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    svg.append("text")
        .attr("x", 400)
        .attr("y", 300)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Welcome to the Car Data Narrative Visualization");
}

function createMPGScene(data) {
    d3.select("#viz").html("");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.MPG)])
        .range([50, 750]);
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Horsepower)])
        .range([550, 50]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.MPG))
        .attr("cy", d => y(d.Horsepower))
        .attr("r", 5);

    const annotations = [
        {
            note: { label: "High MPG", title: "Efficient Cars" },
            x: x(40),
            y: y(150),
            dx: -50,
            dy: -50
        }
    ];

    const makeAnnotations = d3.annotation()
        .annotations(annotations);

    svg.append("g")
        .call(makeAnnotations);
}

function createHorsepowerScene(data) {
    d3.select("#viz").html("");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Horsepower)])
        .range([50, 750]);
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.MPG)])
        .range([550, 50]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.Horsepower))
        .attr("cy", d => y(d.MPG))
        .attr("r", 5);

    const annotations = [
        {
            note: { label: "High Horsepower", title: "Powerful Cars" },
            x: x(300),
            y: y(20),
            dx: -50,
            dy: -50
        }
    ];

    const makeAnnotations = d3.annotation()
        .annotations(annotations);

    svg.append("g")
        .call(makeAnnotations);
}

function createInteractiveScene(data) {
    d3.select("#viz").html("");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.MPG)])
        .range([50, 750]);
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Horsepower)])
        .range([550, 50]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.MPG))
        .attr("cy", d => y(d.Horsepower))
        .attr("r", 5)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "red");
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x(d.MPG))
                .attr("y", y(d.Horsepower) - 10)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text(`MPG: ${d.MPG}, Horsepower: ${d.Horsepower}`);
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "black");
            d3.select("#tooltip").remove();
        });
}
