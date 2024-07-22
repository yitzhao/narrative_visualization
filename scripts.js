d3.csv("cars2017.csv").then(function(data) {
    // Preprocess the data
    data.forEach(d => {
        d.AverageCityMPG = +d.AverageCityMPG;
        d.AverageHighwayMPG = +d.AverageHighwayMPG;
        d.EngineCylinders = +d.EngineCylinders;
    });

    // Initial scene (City vs Highway MPG)
    createScatterPlotScene(data);

    // Event listeners for buttons
    d3.select("#mpg-scatter-btn").on("click", () => {
        createScatterPlotScene(data);
    });
    d3.select("#make-mpg-btn").on("click", () => {
        createMakeMPGScene(data);
        d3.select("#make-mpg-controls").style("display", "block");
    });
    d3.select("#fuel-mpg-btn").on("click", () => {
        createFuelTypeScene(data);
        d3.select("#fuel-mpg-controls").style("display", "block");
    });
    d3.select("#cylinders-mpg-btn").on("click", () => {
        createEngineCylindersScene(data);
        d3.select("#cylinders-mpg-controls").style("display", "block");
    });

    d3.select("#mpg-type-select").on("change", function() {
        const selected = d3.select(this).property("value");
        updateEngineCylindersScene(data, selected);
    });

    d3.select("#mpg-type-fuel").on("change", function() {
        const selected = d3.select(this).property("value");
        updateFuelTypeScene(data, selected);
    });

    d3.select("#mpg-type-make").on("change", function() {
        const selected = d3.select(this).property("value");
        updateMakeMPGScene(data, selected);
    });
});

function createScatterPlotScene(data) {
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
        .attr("r", d => 8)
        .attr("fill", "lightblue")
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
        .call(xAxis)
        .selectAll("text")  // Select all x-tick text elements
        .style("font-size", "12px");  // Adjust font size as needed;
    
    svg.append("text")
        .attr("x", 400)
        .attr("y", 590)  // Adjusted to position the label below the x-axis
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("City MPG");
    
    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis)
        .selectAll("text")  // Select all y-tick text elements
        .style("font-size", "12px");  // Adjust font size as needed
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -300)  // Adjusted to position the label along the y-axis
        .attr("y", 15)    // Adjusted to position the label near the y-axis
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Highway MPG");

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("City MPG vs Highway MPG");

    // Add annotation
    svg.append("rect")
        .attr("x", 550)
        .attr("y", 50)
        .attr("width", 200)
        .attr("height", 200)
        .attr("fill", "lightgreen")
        .attr("opacity", 0.1)
        .attr("pointer-events", "none"); // Make the rectangle not interfere with mouse events

    svg.append("text")
        .attr("x", 650)
        .attr("y", 270)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .text("Fuel Efficient Cars");

    svg.append("text")
        .attr("x", 500)
        .attr("y", 290)
        .attr("text-anchor", "start")
        .style("font-size", "13px")
        .text("These cars have both high city and highway MPG. ");

    svg.append("text")
        .attr("x", 500)
        .attr("y", 310)
        .attr("text-anchor", "start")
        .style("font-size", "13px")
        .text("Car makes from Tesla,  BMW, Hyundai, Nissan, ");

    svg.append("text")
        .attr("x", 500)
        .attr("y", 330)
        .attr("text-anchor", "start")
        .style("font-size", "13px")
        .text("Kia, Chevrolet, Fiat, Ford and Mercedes-Benz.");
    
    svg.append("text")
        .attr("x", 500)
        .attr("y", 350)
        .attr("text-anchor", "start")
        .style("font-size", "13px")
        .text("Hover over to check more details.");
}

function createEngineCylindersScene(data) {
    d3.select("#viz").html("");
    d3.selectAll(".controls").style("display", "none");
    d3.select("#cylinders-mpg-controls").style("display", "block");

    const svgWidth = 800;
    const svgHeight = 600;

    const svg = d3.select("#viz").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.EngineCylinders))
        .range([50, svgWidth - 50]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AverageCityMPG)])
        .range([svgHeight - 50, 50]);

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
        .attr("cx", d => x(d.EngineCylinders))
        .attr("cy", d => y(d.AverageCityMPG))
        .attr("r", 6)
        .attr("fill", "lightblue")
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

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("transform", `translate(0, ${svgHeight - 50})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "12px");

    svg.append("text")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight - 10)  // Adjusted to position the label below the x-axis
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Number of Engine Cylinders");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "12px");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgHeight / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("City MPG");

    svg.append("text")
        .attr("x", svgWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("class", "title")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Number of Engine Cylinders vs City MPG");

    updateEngineCylindersAnnotation(svg, data, "city", x, y);
}

function updateEngineCylindersScene(data, selected) {
    const svg = d3.select("#viz svg");

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.EngineCylinders))
        .range([50, 750]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG)])
        .range([550, 50]);

    const yAxis = d3.axisLeft(y);

    svg.selectAll("circle")
        .transition()
        .duration(500)
        .attr("cy", d => y(selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG));

    svg.select("g.y-axis")
        .transition()
        .duration(500)
        .call(yAxis);

    svg.select("text.title")
        .text(`Number of Engine Cylinders vs ${selected === "city" ? "City MPG" : "Highway MPG"}`);

    svg.select(".y-axis text")
        .text(selected === "city" ? "City MPG" : "Highway MPG");

    updateEngineCylindersAnnotation(svg, data, selected, x, y);
}

function updateEngineCylindersAnnotation(svg, data, selected, x, y) {
    // Update annotation for 0 cylinder points
    const zeroCylinderCars = data.filter(d => d.EngineCylinders === 0);
    const carMakes = [...new Set(zeroCylinderCars.map(d => d.Make))].join(", ");

    svg.selectAll(".annotation").remove();

    svg.append("rect")
        .attr("class", "annotation")
        .attr("x", x(0) - 20)
        .attr("y", y(d3.max(zeroCylinderCars, d => selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG)))
        .attr("width", 40)
        .attr("height", y(80) - y(d3.max(zeroCylinderCars, d => selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG)))
        .attr("fill", "lightgreen")
        .attr("opacity", 0.1)
        .attr("pointer-events", "none");

    svg.append("text")
        .attr("class", "annotation")
        .attr("x", x(0) + 50)
        .attr("y", y((d3.max(zeroCylinderCars, d => selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG) + 80) / 2))
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(`The 0-engine cylinder cars are more fuel-efficient.`);

    svg.append("text")
        .attr("class", "annotation")
        .attr("x", x(0) + 50)
        .attr("y", y((d3.max(zeroCylinderCars, d => selected === "city" ? d.AverageCityMPG : d.AverageHighwayMPG) + 80) / 2) + 20)
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(`Car makes include ${carMakes}.`);
}

function createFuelTypeScene(data) {
    d3.select("#viz").html("");
    d3.selectAll(".controls").style("display", "none");
    d3.select("#fuel-mpg-controls").style("display", "block");

    // Group data by fuel type and calculate average MPG
    const fuelData = Array.from(d3.group(data, d => d.Fuel), ([key, values]) => ({
        key: key,
        value: {
            AverageCityMPG: d3.mean(values, d => d.AverageCityMPG),
            AverageHighwayMPG: d3.mean(values, d => d.AverageHighwayMPG),
            carMakes: values.map(d => d.Make)
        }
    }));

    // Sort data by average city MPG by default
    fuelData.sort((a, b) => a.value.AverageCityMPG - b.value.AverageCityMPG);

    const svgWidth = 800;  // Increased width for better readability
    const svgHeight = 600;

    const svg = d3.select("#viz").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const x = d3.scaleBand()
        .domain(fuelData.map(d => d.key))
        .range([50, svgWidth - 50])
        .padding(0.2);  // Increased padding for narrower bars

    const y = d3.scaleLinear()
        .domain([0, d3.max(fuelData, d => d.value.AverageCityMPG)])
        .range([svgHeight - 50, 50]);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "lightsteelblue")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    svg.selectAll("rect")
        .data(fuelData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.value.AverageCityMPG))
        .attr("width", x.bandwidth())
        .attr("height", d => svgHeight - 50 - y(d.value.AverageCityMPG))
        .attr("fill", "lightblue")
        .on("mouseover", function(event, d) {
            const carMakes = d.value.carMakes.join(", ");
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Fuel Type: ${d.key}<br>Car Makes: ${carMakes}<br>Average City MPG: ${d.value.AverageCityMPG.toFixed(2)}<br>Average Highway MPG: ${d.value.AverageHighwayMPG.toFixed(2)}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${svgHeight - 50})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "14px");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "14px");

    svg.append("text")
        .attr("class", "title")
        .attr("x", svgWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Fuel Type vs City MPG");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgHeight / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Average MPG");

    d3.select("#mpg-type-fuel").on("change", function() {
        const selected = d3.select(this).property("value");
        updateFuelTypeScene(data, selected);
    });

    // Initial annotation for the third bar
    annotateBar(svg, x, y, fuelData[2], "city", svgHeight);
}

function updateFuelTypeScene(data, selected) {
    const svg = d3.select("#viz svg");

    // Group data by fuel type and calculate average MPG
    const fuelData = Array.from(d3.group(data, d => d.Fuel), ([key, values]) => ({
        key: key,
        value: {
            AverageCityMPG: d3.mean(values, d => d.AverageCityMPG),
            AverageHighwayMPG: d3.mean(values, d => d.AverageHighwayMPG),
            carMakes: values.map(d => d.Make)
        }
    }));

    // Sort data by the selected MPG type
    fuelData.sort((a, b) => selected === "city" ? a.value.AverageCityMPG - b.value.AverageCityMPG : a.value.AverageHighwayMPG - b.value.AverageHighwayMPG);

    const x = d3.scaleBand()
        .domain(fuelData.map(d => d.key))
        .range([50, 750])
        .padding(0.2);  // Increased padding for narrower bars

    const y = d3.scaleLinear()
        .domain([0, d3.max(fuelData, d => selected === "city" ? d.value.AverageCityMPG : d.value.AverageHighwayMPG)])
        .range([550, 50]);

    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x);

    svg.selectAll("rect")
        .data(fuelData)
        .transition()
        .duration(500)
        .attr("x", d => x(d.key))
        .attr("y", d => y(selected === "city" ? d.value.AverageCityMPG : d.value.AverageHighwayMPG))
        .attr("height", d => 550 - y(selected === "city" ? d.value.AverageCityMPG : d.value.AverageHighwayMPG));

    svg.select("g.y-axis")
        .transition()
        .duration(500)
        .call(yAxis);

    svg.select("g.x-axis")
        .transition()
        .duration(500)
        .call(xAxis);

    svg.select("text.title")
        .text(`Fuel Type vs ${selected === "city" ? "City MPG" : "Highway MPG"}`);

    // Update annotation for the third bar
    svg.selectAll(".annotation").remove();
    annotateBar(svg, x, y, fuelData[2], selected, 600);
}

function annotateBar(svg, x, y, barData, selected, svgHeight) {
    const carMakesList = barData.value.carMakes.join(", ");

    svg.append("rect")
        .attr("class", "annotation")
        .attr("x", x(barData.key) - 10)
        .attr("y", y(selected === "city" ? barData.value.AverageCityMPG : barData.value.AverageHighwayMPG))
        .attr("width", x.bandwidth() + 20)
        .attr("height", svgHeight - 50 - y(selected === "city" ? barData.value.AverageCityMPG : barData.value.AverageHighwayMPG))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1);

    const annotationY = y(selected === "city" ? barData.value.AverageCityMPG : barData.value.AverageHighwayMPG) + (svgHeight - 50 - y(selected === "city" ? barData.value.AverageCityMPG : barData.value.AverageHighwayMPG)) / 2;

    svg.append("text")
        .attr("class", "annotation")
        .attr("x", x(barData.key) + x.bandwidth() / 2)
        .attr("y", annotationY)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Electric cars are the most fuel-efficient, with");

    svg.append("text")
        .attr("class", "annotation")
        .attr("x", x(barData.key) + x.bandwidth() / 2)
        .attr("y", annotationY + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(`car makes: ${carMakesList}`);
}


function createMakeMPGScene(data) {
    d3.select("#viz").html("");
    d3.selectAll(".controls").style("display", "none");
    d3.select("#make-mpg-controls").style("display", "block");

    const svgWidth = 800;  // Set width to 800 for better readability and fitting all bars
    const svgHeight = 600;

    const svg = d3.select("#viz").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const groupedData = Array.from(d3.group(data, d => d.Make), ([key, values]) => ({
        key: key,
        value: {
            AverageCityMPG: d3.mean(values, d => d.AverageCityMPG),
            AverageHighwayMPG: d3.mean(values, d => d.AverageHighwayMPG)
        }
    }));

    const sortedData = groupedData.sort((a, b) => a.value.AverageCityMPG - b.value.AverageCityMPG).slice(0, 30);

    const x = d3.scaleBand()
        .domain(sortedData.map(d => d.key))
        .range([50, svgWidth - 50])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.value.AverageCityMPG)])
        .range([svgHeight - 50, 50]);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "lightsteelblue")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    svg.selectAll("rect")
        .data(sortedData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.value.AverageCityMPG))
        .attr("width", x.bandwidth())
        .attr("height", d => svgHeight - 50 - y(d.value.AverageCityMPG))
        .attr("fill", "lightblue")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Make: ${d.key}<br>Average City MPG: ${d.value.AverageCityMPG.toFixed(2)}<br>Average Highway MPG: ${d.value.AverageHighwayMPG.toFixed(2)}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${svgHeight - 50})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis)
        .style("font-size", "12px");

    svg.append("text")
        .attr("class", "title")
        .attr("x", svgWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Make vs City MPG");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgHeight / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Average MPG");

    d3.select("#mpg-type-make").on("change", function() {
        const selected = d3.select(this).property("value");
        updateMakeMPGScene(data, selected);
    });
    const numRightmostBars = 4;
    updateMakeMPGAnnotation(svg, sortedData, "city", numRightmostBars, 50, svgHeight, x);
}

function updateMakeMPGScene(data, selected) {
    const svg = d3.select("#viz svg");

    const groupedData = Array.from(d3.group(data, d => d.Make), ([key, values]) => ({
        key: key,
        value: {
            AverageCityMPG: d3.mean(values, d => d.AverageCityMPG),
            AverageHighwayMPG: d3.mean(values, d => d.AverageHighwayMPG)
        }
    }));

    const sortedData = groupedData.sort((a, b) => selected === "city" ? a.value.AverageCityMPG - b.value.AverageCityMPG : a.value.AverageHighwayMPG - b.value.AverageHighwayMPG).slice(0, 30);

    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => selected === "city" ? d.value.AverageCityMPG : d.value.AverageHighwayMPG)])
        .range([550, 50]);

    const x = d3.scaleBand()
        .domain(sortedData.map(d => d.key))
        .range([50, 750])
        .padding(0.1);

    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x);

    svg.selectAll("rect")
        .data(sortedData)
        .transition()
        .duration(500)
        .attr("x", d => x(d.key))
        .attr("y", d => y(selected === "city" ? d.value.AverageCityMPG : d.value.AverageHighwayMPG))
        .attr("height", d => 550 - y(selected === "city" ? d.value.AverageCityMPG : d.value.AverageHighwayMPG));

    svg.select("g.y-axis")
        .transition()
        .duration(500)
        .call(yAxis);

    svg.select("g.x-axis")
        .transition()
        .duration(500)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.select("text.title")
        .text(`Make vs ${selected === "city" ? "City MPG" : "Highway MPG"}`);

    // Update annotation for the rightmost bars
    updateMakeMPGAnnotation(svg, sortedData, selected, numRightmostBars, 50, svgHeight, x);
}

function updateMakeMPGAnnotation(svg, sortedData, mpgType, numRightmostBars, marginTop, svgHeight, x) {
    svg.selectAll(".annotation").remove();
    const annotationStart = sortedData.length - numRightmostBars;

    svg.append("rect")
        .attr("class", "annotation")
        .attr("x", x(sortedData[annotationStart].key))
        .attr("y", marginTop)
        .attr("width", x.bandwidth() * numRightmostBars)
        .attr("height", svgHeight - marginTop - 50)
        .attr("fill", "lightgreen")
        .attr("opacity", 0.1)
        .attr("pointer-events", "none");

    svg.append("text")
        .attr("class", "annotation")
        .attr("x", x(sortedData[annotationStart].key) + (x.bandwidth() * numRightmostBars) / 2)
        .attr("y", marginTop + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("These are highly fuel-efficient car makes");

    svg.append("text")
        .attr("class", "annotation")
        .attr("x", x(sortedData[annotationStart].key) + (x.bandwidth() * numRightmostBars) / 2)
        .attr("y", marginTop + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(`with average ${mpgType} MPG both over 50.`);

    svg.append("text")
        .attr("class", "annotation")
        .attr("x", x(sortedData[annotationStart].key) + (x.bandwidth() * numRightmostBars) / 2)
        .attr("y", marginTop + 60)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Car makes include Tesla, Hyundai, Fiat, and Mitsubishi.");
}
