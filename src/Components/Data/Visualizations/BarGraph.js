//bar chart
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
import { Card } from "react-bootstrap";


function BarGraph(props) {
    const data = props.queryResult;
    const svgRef = useRef();

    // will be called initially and on every data change
    useEffect(() => {

      // set the dimensions and margins of the graph
      var margin = {top: 30, right: 30, bottom: 90, left: 60},
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


      // append the svg object to the body of the page
      var svg = d3.select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // X axis
      var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d.nationality; }))
        .padding(0.2);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

      // Add Y axis
      const max = Math.max.apply(Math, data.map(function(o) { return o.count; }))
      var y = d3.scaleLinear()
        .domain([0, max])
        .range([ height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // Bars
      svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
          .attr("x", function(d) { return x(d.nationality); })
          .attr("y", function(d) { return y(d.count); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.count); })
          .attr("fill", "#4e79a7")
          .attr("class", "bar")

      // Numbers
      svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("text")
          .text(function(d) { return d.count })
           .attr("font-family" , "sans-serif")
           .attr("x", function(d) { return x(d.nationality) + x.bandwidth() / 2 })
           .attr("y", function(d) { return y(d.count) - 6; })
           .attr("font-size" , "8px")
           .attr("fill" , "black")
          .attr("text-anchor", "middle");

    }, [data]);



    return (
      <Card>
        <Card.Body>
          <Card.Title className="fs-6 mb-4 mt-4 text-center fw-normal">{props.title}</Card.Title>
            <div ref={svgRef}> </div>
            { props.queryResultNationalityNull > 0 && (
              <p className="pt-2 mb-0">
                * There are { props.queryResultNationalityNull } null values
              </p>
            )}
        </Card.Body>
       </Card>
    );
}

export default BarGraph;
