// IMPORTS ////////////////////////////////////////////////////////////////////
import * as d3 from "d3";

// MAIN DEPENDENCIES
import React, { useEffect, useState, useRef } from "react";
import {Card, Spinner} from 'react-bootstrap';



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function PieChart(props) {
  const chart = useRef();

  const drawChart = (data) => {
    // transform the value of each group to a radius that will be displayed on the chart
    const pie = d3.pie()
      .value(function(d){return d.value})
      .sort(null)
      .padAngle(.03);

    const w = 300;
    const h = 320;
    const outerRadius = w / 2;
    const innerRadius = 80;

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // draws on arc per group
    const arc = d3.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    // initialize svg element with width and height
    const svg = d3.select(chart.current)
      .append("svg")
      .attr("height", h)
      .attr("width", w)
      .append("g")
      .attr("transform", 'translate('+w/2+','+h/2+')');

    // draw each path (pie chart section)
    const path = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("class", "shadow-filter section")
      .attr("fill", function(d, i) {
        return color(d.data.key);
      });

    // create transition
    path.transition()
      .duration(1000)
      .attrTween('d', function(d) {
        var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return function(t) {
            return arc(interpolate(t));
        };
      });

    // add labels
    const text = svg.selectAll('text')
      .data(pie(data))
      .enter()
      .append("text")
      .transition()
      .delay(1000)
      .duration(0)
      .attr("transform", function (d) {
          return "translate(" + arc.centroid(d) + ")";
      })
      .attr("dy", ".4em")
      .attr("text-anchor", "middle")
      .text(function(d){
          return d.data.value;
      })
      .attr('class', 'shadow-filter stroke-filter')
      .style("fill", "#fff")
      .style("font-weight", "bold")
      .style("font-size", "18px")

    // add legend
    const legendRectSize=20;
    const legendSpacing=7;
    const legendHeight=legendRectSize+legendSpacing;

    const legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr("class", "legend" )
      .attr("transform", function(d,i) {
        //Just a calculation for x and y position
        if (data.length > 4) {
          return 'translate(160,' + ((i*legendHeight) - 160) + ')';
        } else {
          return 'translate(-50,' + ((i*legendHeight) - 40) + ')';
        }
      })
      .style("background-color", "gray")

    legend.append('rect')
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .style("fill", color)
      .style("stroke", color)

    legend.append('text')
      .attr("x", 30)
      .attr("y", 15)
      .text(function(d){
          return d;
      })
  }

  useEffect(() => {
      drawChart(props.queryResult);
  }, []);

  // RETURNS PLACEHOLDER
  return (
      <Card className="h-100">
        <Card.Body>
          <Card.Title className="fs-6 text-center fw-normal mb-4 mt-2">
            {props.title}
          </Card.Title>
          <div className="d-flex flex-wrap flex-row justify-content-center" ref={chart}></div>
          { props.queryResultNullValues > 0 && (
            <p className="pt-2 mb-0">
              * There are { props.queryResult2NullValues } null values
            </p>
          )}
        </Card.Body>
      </Card>
  )
}

export default PieChart
