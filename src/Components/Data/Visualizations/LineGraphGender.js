//bar chart
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Card, Spinner} from "react-bootstrap";



function LineGraphGender(props) {
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

      // Create date formats
      var parseTime = d3.timeParse("%Y");
      var dates = [];
      for (let obj of data) {dates.push(parseTime(obj.info));}
      
      // Add X axis --> it is a date format
      var x = d3.scaleTime()
      .domain(d3.extent(dates))
      .range([ 0, width ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
      
      var maxf =  d3.max(data, function(d) { return +d.female; });
      var maxm = d3.max(data, function(d) { return +d.male; });
      let max;
      if (maxf > maxm) { max = maxf} else {max = maxm}

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, max])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));
      
        
        // Line
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "pink")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
          .x(function(d) { return x(parseTime(d.info)) })
          .y(function(d) { return y(d.female) })
          .curve(d3.curveBasis)
          )
      svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(parseTime(d.info)) })
        .y(function(d) { return y(d.male) })
        .curve(d3.curveBasis)
        )
      if (data.length === 1) {
        
      svg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("fill", "pink")
        .attr("stroke", "pink")
        .attr("stroke-width", 2)
        .attr("cx", function(d) { return x(parseTime(d.info))})
        .attr("cy", function(d) { return y(d.female) })
        .attr("r", 4)
        
      svg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("fill", "steelblue")
        .attr("stroke", "none")
        .attr("stroke-width", 0)
        .attr("cx", function(d) { return x(parseTime(d.info))})
        .attr("cy", function(d) { return y(d.male) })
        .attr("r", 4)
      } else {}
          // Add the key (legend)
    const legend = svg
      .append('g')
      .attr('transform', 'translate(0, -20)'); // Adjust the position as needed

    // Add legend items
    legend
      .append('circle')
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', 5)
      .style('fill', 'pink');

    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 10)
      .text('Female')
      .attr('alignment-baseline', 'middle');

    legend
      .append('circle')
      .attr('cx', 90)
      .attr('cy', 10)
      .attr('r', 5)
      .style('fill', 'steelblue');

    legend
      .append('text')
      .attr('x', 100)
      .attr('y', 10)
      .text('Male')
      .attr('alignment-baseline', 'middle');

    }, [data]);

    return (
      <Card className="h-100">
        <Card.Body>
          <Card.Title className="fs-6 mb-4 mt-4 text-center fw-normal">{props.title}</Card.Title>
          <div className="d-flex flex-wrap flex-row justify-content-center">
          { props.queryResult
            ? <div ref={svgRef}> </div>
            : <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden">Loading...</span></Spinner>
          }
          </div>
        </Card.Body>
       </Card>
    );
}

export default LineGraphGender;
