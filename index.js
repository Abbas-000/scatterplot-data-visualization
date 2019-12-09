d3
  .json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
  .then(dataset => {
    dataset.forEach(el => {
      el["Year"] = new Date(el["Year"], 1, 1);
      el["Seconds"] = new Date(null, null, null, null, null, el["Seconds"]);
    });

    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
      w = 800 - margin.left - margin.right,
      h = 500 - margin.top - margin.bottom;

    d3
      .select("main")
      .append("h1")
      .text("Doping in Professional Bicycle Racing")
      .attr("id", "title");

    var xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, d => d["Year"]))
      .range([0, w])
      .nice();

    var yScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, d => d["Seconds"]).reverse())
      .range([h, 0]);


    var x_axis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    var y_axis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    var svg = d3
      .select("main")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var tooltip = d3
      .select("main")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", "0.9");

    function mouseoverHandler({ Name, Time, Place, Year, Doping }) {
      Year = new Date(Year).getFullYear();
      tooltip.html(
        `<p style='margin-bottom: 1px;'>Name:${Name} Place:${Place} Time:${Time} Year:${Year}</p><p style='margin-top: 1px;'>${Doping}</p>`
      );
      tooltip.attr("data-year", Year);
      tooltip
        .style("display", "inline-block")
        .style("left", d3.event.pageX + 3 + "px")
        .style("top", d3.event.pageY + 1 + "px");
    }

    function mouseoutHandler() {
      tooltip.style("display", "none");
    }

    svg
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .on("mouseover", mouseoverHandler)
      .on("mouseout", mouseoutHandler)
      .attr("cx", d => xScale(d["Year"]))
      .attr("cy", d => yScale(d["Seconds"]))
      .attr("r", 8.5)
      .transition()
      .duration(1500)
      .attr("class", "dot")
      .style("fill", d => {
        if (d["Doping"] === "") {
          return "orange";
        } else {
          return "teal";
        }
      })
      .attr("data-xvalue", d => new Date(d["Year"]).getFullYear())
      .attr("data-yvalue", d => new Date(d["Seconds"]));

    d3
      .select("svg")
      .append("rect")
      .attr("x", 780)
      .attr("y", 220)
      .attr("id", "tealBox");
    d3
      .select("svg")
      .append("rect")
      .attr("x", 780)
      .attr("y", 240)
      .attr("id", "orangeBox");

    d3
      .select("svg")
      .append("text")
      .attr("id", "legend")
      .attr("x", 569)
      .attr("y", 231)
      .text("Riders with Doping Allegations");
    d3
      .select("svg")
      .append("text")
      .attr("id", "legend")
      .attr("x", 569)
      .attr("y", 253)
      .text("No Doping Allegations");

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h})`)
      .call(x_axis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .call(y_axis);
  });
