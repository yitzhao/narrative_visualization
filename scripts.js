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
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Fuel Efficient Cars");

    svg.append("text")
        .attr("x", 630)
        .attr("y", 290)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("These cars have both high city and highway MPG. ");

    svg.append("text")
        .attr("x", 630)
        .attr("y", 310)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Car makes from Tesla,  BMW, Hyundai, Nissan, Kia, ");

    svg.append("text")
        .attr("x", 630)
        .attr("y", 330)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Chevrolet, Fiat, Ford, and Mercedes-Benz.");
    
    svg.append("text")
        .attr("x", 630)
        .attr("y", 350)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Hover over to check more details.");
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
        .attr("transform", "translate(0, 550)")
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "12px");

    svg.append("text")
        .attr("x", 400)
        .attr("y", 590)  // Adjusted to position the label below the x-axis
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Engine Cylinders");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "12px");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -300)  // Adjusted to position the label along the y-axis
        .attr("y", 15)    // Adjusted to position the label near the y-axis
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("City MPG");

    svg.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Engine Cylinders vs City MPG");

    // Add annotation for 0 cylinder points
    const annotationGroup = svg.append("g");

    annotationGroup.append("rect")
        .attr("x", x(0) - 10)
        .attr("y", y(160))
        .attr("width", 20)
        .attr("height", y(100) - y(160))
        .attr("fill", "lightgreen")
        .attr("opacity", 0.1)
        .attr("pointer-events", "none"); // Make the rectangle not interfere with mouse events

    annotationGroup.append("text")
        .attr("x", x(0) + 30)
        .attr("y", y(130))
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("The 0 engine cylinder cars are more fuel-efficient");
}

function updateEngineCylindersScene(data, selected) {
    console.log("Updating engine cylinders scene...");
    const svg = d3.select("#viz svg");

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
        .text(`Engine Cylinders vs ${selected === "city" ? "City MPG" : "Highway MPG"}`);

    svg.select(".y-axis text")
        .text(selected === "city" ? "City MPG" : "Highway MPG");
}

function createFuelTypeScene(data) {
    console.log("Creating fuel type scene...");
    d3.select("#viz").html("");
    d3.selectAll(".controls").style("display", "none");
    d3.select("#fuel-mpg-controls").style("display", "block");

    // Group data by fuel type and calculate average MPG
    const fuelData = Array.from(d3.group(data, d => d.Fuel), ([key, values]) => ({
        key: key,
        value: {
            AverageCityMPG: d3.mean(values, d => d.AverageCityMPG),
            AverageHighwayMPG: d3.mean(values, d => d.AverageHighwayMPG)
        }
    }));

    // Sort data by average city MPG by default
    fuelData.sort((a, b) => a.value.AverageCityMPG - b.value.AverageCityMPG);

    const svg = d3.select("#viz").append("svg")
        .attr("width", 1000)  // Increased width for better readability
        .attr("height", 600);

    const x = d3.scaleBand()
        .domain(fuelData.map(d => d.key))
        .range([50, 950])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(fuelData, d => d.value.AverageCityMPG)])
        .range([550, 50]);

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
        .attr("height", d => 550 - y(d.value.AverageCityMPG))
        .attr("fill", "lightblue")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Fuel Type: ${d.key}<br>Average City MPG: ${d.value.AverageCityMPG.toFixed(2)}<br>Average Highway MPG: ${d.value.AverageHighwayMPG.toFixed(2)}`)
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
        .attr("transform", "translate(0, 550)")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    svg.append("text")
        .attr("class", "title")
        .attr("x", 500)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Fuel Type vs City MPG");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -275)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Average MPG");

    d3.select("#mpg-type-fuel").on("change", function() {
        const selected = d3.select(this).property("value");
        updateFuelTypeScene(data, selected);
    });

    // Annotation for the third bar
    svg.append("rect")
        .attr("x", x(fuelData[2].key) - 10)
        .attr("y", y(fuelData[2].value.AverageCityMPG) - 20)
        .attr("width", x.bandwidth() + 20)
        .attr("height", 40)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1);

    svg.append("text")
        .attr("x", x(fuelData[2].key) + x.bandwidth() / 2)
        .attr("y", y(fuelData[2].value.AverageCityMPG) - 25)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Generally, electric cars are more fuel-efficient");
}

function updateFuelTypeScene(data, selected) {
    console.log("Updating fuel type scene...");
    const svg = d3.select("#viz svg");

    // Group data by fuel type and calculate average MPG
    const fuelData = Array.from(d3.group(data, d => d.Fuel), ([key, values]) => ({
        key: key,
        value: {
            AverageCityMPG: d3.mean(values, d => d.AverageCityMPG),
            AverageHighwayMPG: d3.mean(values, d => d.AverageHighwayMPG)
        }
    }));

    // Sort data by the selected MPG type
    fuelData.sort((a, b) => selected === "city" ? a.value.AverageCityMPG - b.value.AverageCityMPG : a.value.AverageHighwayMPG - b.value.AverageHighwayMPG);

    const y = d3.scaleLinear()
        .domain([0, d3.max(fuelData, d => selected === "city" ? d.value.AverageCityMPG : d.value.AverageHighwayMPG)])
        .range([550, 50]);

    const x = d3.scaleBand()
        .domain(fuelData.map(d => d.key))
        .range([50, 950])
        .padding(0.1);

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
    svg.selectAll(".annotation").remove();  // Remove existing annotations
    svg.append("rect")
        .attr("class", "annotation")
        .attr("x", x(fuelData[2].key) - 10)
        .attr("y", y(selected === "city" ? fuelData[2].value.AverageCityMPG : fuelData[2].value.AverageHighwayMPG) - 20)
        .attr("width", x.bandwidth() + 20)
        .attr("height", 40)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1);

    svg.append("text")
        .attr("class", "annotation")
        .attr("x", x(fuelData[2].key) + x.bandwidth() / 2)
        .attr("y", y(selected === "city" ? fuelData[2].value.AverageCityMPG : fuelData[2].value.AverageHighwayMPG) - 25)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Generally, electric cars are more fuel-efficient");
}


function createMakeMPGScene(data) {
    d3.select("#viz").html("");
    d3.selectAll(".controls").style("display", "none");
    d3.select("#make-mpg-controls").style("display", "block");

    const svg = d3.select("#viz").append("svg")
        .attr("width", 1000)  // Increased width for better readability
        .attr("height", 600);

    const groupedData = Array.from(d3.group(data, d => d.Make), ([key, values]) => ({
        key: key,
        value: {
            AverageCityMPG: d3.mean(values, d => d.AverageCityMPG),
            AverageHighwayMPG: d3.mean(values, d => d.AverageHighwayMPG)
        }
    }));

    const sortedData = groupedData.sort((a, b) => a.value.AverageCityMPG - b.value.AverageCityMPG);

    const x = d3.scaleBand()
        .domain(sortedData.map(d => d.key))
        .range([50, 950])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.value.AverageCityMPG)])
        .range([550, 50]);

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
        .attr("height", d => 550 - y(d.value.AverageCityMPG))
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
        .attr("x", 500)  // Centered according to new width
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Make vs City MPG");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -300)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Average MPG");

    d3.select("#mpg-type-make").on("change", function() {
        const selected = d3.select(this).property("value");
        updateMakeMPGScene(data, selected);
    });

    // Annotation for the rightmost bars
    svg.append("rect")
        .attr("x", 750)  // Adjusted to cover the rightmost 10 bars
        .attr("y", 50)
        .attr("width", 200)
        .attr("height", 500)
        .attr("fill", "lightcoral")
        .attr("opacity", 0.1)
        .attr("pointer-events", "none");

    svg.append("text")
        .attr("x", 850)
        .attr("y", 70)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("These are fuel-efficient car makes with average MPG over 60.");
}

function updateMakeMPGScene(data, selected) {
    console.log("Updating make MPG scene...");
    const svg = d3.select("#viz svg");

    const groupedData = Array.from(d3.group(data, d => d.Make), ([key, values]) => ({
        key: key,
        value: {
            AverageCityMPG: d3.mean(values, d => d.AverageCityMPG),
            AverageHighwayMPG: d3.mean(values, d => d.AverageHighwayMPG)
        }
    }));

    const sortedData = groupedData.sort((a, b) => selected === "city" ? a.value.AverageCityMPG - b.value.AverageCityMPG : a.value.AverageHighwayMPG - b.value.AverageHighwayMPG);

    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => selected === "city" ? d.value.AverageCityMPG : d.value.AverageHighwayMPG)])
        .range([550, 50]);

    const x = d3.scaleBand()
        .domain(sortedData.map(d => d.key))
        .range([50, 950])
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
}
