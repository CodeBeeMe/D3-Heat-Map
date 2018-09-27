/* !Date:18.09.2018 Copyright ©2018 JavaScript & React code by Cătălin Anghel-Ursu @Madness2aMaze (https://codepen.io/Madness2aMaze)
- All Rights Reserved!

MIT License

Copyright (c) 2018 Cătălin Anghel-Ursu (https://github.com/Madness2aMaze/D3-Heat-Map)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

window.onload = () => {
  let url =
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";  
  
  req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.send();
  req.onload = () => {
    json = JSON.parse(req.responseText);
    //const dataset = json.map((el) => Object.values(el));
    const dataset = json.monthlyVariance.map(el => Object.values(el));
    console.log(json);
    console.log(dataset);
    const width = 1204;
    const height = 600;
    const padding = 75;

    d3
      .select(".container-fluid")
      .append("div")
      .attr("id", "title")
      .append("div")
      .attr("id", "logo")
      .append("h1")
      .attr("id", "dee")
      .text("D");

    d3
      .select("#logo")
      .append("h1")
      .attr("id", "three")
      .text("3");

    d3
      .select("#title")
      .append("h3")
      .attr("id", "sub") 
      .text("HEAT MAP");

    d3
      .select(".container-fluid")
      .append("div")
      .attr("id", "chart")
      .append("h1")
      .attr("id", "chart-title")
      .attr("class", "text-grad-cool-to-hot")    
      .text("Monthly Global Land-Surface Temperature");

    d3
      .select("#chart")
      .append("h3")
      .attr("id", "description")
      .text("1753 - 2015: base temperature 8.66℃");

    d3
      .select("#chart")
      .append("div")
      .attr("id", "legend");    

    d3
      .select(".container-fluid")
      .append("div")
      .attr("id", "nfo");

    const parseYear = d3.timeParse("%Y");

    const xScale = d3.scaleTime()
                     .range([padding, width - padding])
                     .domain(d3.extent(dataset, (d) => parseYear(d[0])));
    
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    
    const yScale = d3.scaleBand()
                     .rangeRound([height - padding, padding])
                     .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    
    //format the month from a numerical value, whrere 0 is returned as January and 11 as December
    function formatMonth(month) {
      const date = new Date(0);
      date.setUTCMonth(month);
      return d3.utcFormat("%B")(date);
    }
    
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => formatMonth(d));
    
    const tempFormat = d3.format(".1f"); //fixed point notation format used to correctly round the temp value and variation
    
    //get the exact temp for the specific date
    function measuredTemp(arr) {
      return tempFormat(8.66 + arr[2]);
    }

    const tooltip = d3
    .select("#chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

    const svg = d3
    .select("#chart")
    .append("svg")
    .attr("id", "main")
    .attr("width", width)
    .attr("height", height);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", (d) => d[1] - 1)
      .attr("data-year", (d) => d[0])
      .attr("data-temp", (d) => d[2])
      .attr("x", (d, i) => padding + (i / 2.995))
      .attr("y", (d, i) => height - (d[1] + 2 ) * 37.5)
      .attr("width", 5)
      .attr("height", 38)
      .attr("fill", (d) => (
           measuredTemp(d) < 2.8 ? "#2c33ba"
         : measuredTemp(d) >= 2.8 && measuredTemp(d) < 3.9 ? "#2c6bba"
         : measuredTemp(d) >= 3.9 && measuredTemp(d) < 5.0 ? "#2c94ba"
         : measuredTemp(d) >= 5.0 && measuredTemp(d) < 6.1 ? "#45bce8"
         : measuredTemp(d) >= 6.1 && measuredTemp(d) < 7.2 ? "#9be4ff"
         : measuredTemp(d) >= 7.2 && measuredTemp(d) < 8.3 ? "#f6ff9b"
         : measuredTemp(d) >= 8.3 && measuredTemp(d) < 9.5 ? "#edd08b"
         : measuredTemp(d) >= 9.5 && measuredTemp(d) < 10.6 ? "#fcad6a"
         : measuredTemp(d) >= 10.6 && measuredTemp(d) < 11.7 ? "#fc6f3c"
         : measuredTemp(d) >= 11.7 && measuredTemp(d) < 12.8 ? "#ff4747"
         : measuredTemp(d) >= 12.8 ? "#c91414": "None"))
      .on("mouseover", (d) => {
      tooltip
        .transition()
        .duration(50)
        .style("opacity", 0.9);
      tooltip
        .attr("data-year", d[0])
        .html("<strong>" +
          (d[1] === 1 ? "Jan"
         : d[1] === 2 ? "Feb"
         : d[1] === 3 ? "Mar"
         : d[1] === 4 ? "Apr"
         : d[1] === 5 ? "May"
         : d[1] === 6 ? "Jun"
         : d[1] === 7 ? "Jul"
         : d[1] === 8 ? "Aug"
         : d[1] === 9 ? "Sep"
         : d[1] === 10 ? "Oct"
         : d[1] === 11 ? "Nov"
         : d[1] === 12 ? "Dec" : "None") +
        "-" +
        d[0] + "</strong>" +       
        "<br/>" + "Temp: " +
        tempFormat(8.66 + d[2]) +
        "℃" +
        "<br/>" + "Variance: " +
        tempFormat(d[2]) +
        "℃")
        .style("left", (d3.event.pageX - width / 2.25) + "px")
        .style("top", (d3.event.pageY - height / 4.5) + "px");	
    })
      .on("mouseout", d => {
      tooltip
        .transition()
        .duration(500)
        .style("opacity", 0);
    });

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("class", "tick")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "11px");

    svg
      .append("text")
      .attr("transform", "translate(" + width / 1.1 + " ," + (height - 25) + ")")
      .style("text-anchor", "middle")
      .style("fill", "#75aaaa")
      .text("Years")
      .style("font-size", "18px");

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("class", "tick")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis)      
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("x", -5)
      .attr("y", -10)
      .style("font-size", "11px");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 25)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .style("fill", "#75aaaa")
      .text("Months")
      .style("font-size", "18px");
    
    
    //Legend colors chart
    const legendData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const legend = d3.select("#legend")
                     .append("svg")
                     .attr("id", "sec")
                     .attr("width", 265)
                     .attr("height", 30);
    
    legend
      .selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("class", "legend-cell")
      .attr("x", (d, i) => 40 + i * 16 )
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => (
           d < 1 ? "#2c33ba"
         : d >= 1 && d < 2 ? "#2c6bba"
         : d >= 2 && d < 3 ? "#2c94ba"
         : d >= 3 && d < 4 ? "#45bce8"
         : d >= 4 && d < 5 ? "#9be4ff"
         : d >= 5 && d < 6 ? "#f6ff9b"
         : d >= 6 && d < 7 ? "#edd08b"
         : d >= 7 && d < 8 ? "#fcad6a"
         : d >= 8 && d < 9 ? "#fc6f3c"
         : d >= 9 && d < 10 ? "#ff4747"
         : d >= 10 ? "#c91414": "None"));
    
    legend
      .append("text")
      .attr("transform", "translate(" +  238 + " ," + 11 + ")")
      .style("text-anchor", "middle")
      .style("fill", "#75aaaa")
      .text("Warmer")
      .style("font-size", "11px");
    
    legend
      .append("text")
      .attr("transform", "translate(" +  20 + " ," + 11 + ")")
      .style("text-anchor", "middle")
      .style("fill", "#75aaaa")
      .text("Cooler")
      .style("font-size", "11px");
    
  };
};
