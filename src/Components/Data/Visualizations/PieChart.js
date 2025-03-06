// IMPORTS ////////////////////////////////////////////////////////////////////
import * as d3 from "d3";

// MAIN DEPENDENCIES
import React, { useEffect, useRef } from "react";
import { Card, Spinner } from 'react-bootstrap';

// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function PieChart(props) {
  const chart = useRef();
  const legend = useRef();
  const cardWidth = 450;

  // Define color mapping based on useGenderColors flag
  const getColorScale = (useGenderColors) => {
    return useGenderColors
      ? d3.scaleOrdinal()
        .domain(['Male', 'Female', 'Unknown'])  // Explicit mapping
        .range([d3.schemeTableau10[0], d3.schemeTableau10[7], d3.schemeTableau10[9]]) // Male = Blue, Female = Red, Unknown = Gray
      : d3.scaleOrdinal(d3.schemeTableau10);
  };

  const drawChart = (data, ref, useGenderColors) => {
    // Get the appropriate color scale
    const color = getColorScale(useGenderColors);

    // Convert data to ensure consistent category mapping
    const pieData = d3.pie()
      .value(d => d.value)
      .sort(null)  // 🔹 Prevents sorting, preserving original order
      .padAngle(0.03)(data);

    const w = cardWidth;
    const h = 320;
    const outerRadius = 250 / 2;
    const innerRadius = 50;

    const arc = d3.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    // Initialize SVG
    const svg = d3.select(ref.current)
      .append("svg")
      .attr("height", h)
      .attr("width", w)
      .append("g")
      .attr("transform", `translate(${300 / 2},${h / 2})`);

    // Draw pie chart sections
    const path = svg.selectAll('path')
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("class", "shadow-filter section")
      .attr("fill", d => color(d.data.key));  // 🔹 Ensures colors always match key

    // Create transition animation
    path.transition()
      .duration(1000)
      .attrTween('d', function (d) {
        var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    // Add labels
    svg.selectAll('text')
      .data(pieData)
      .enter()
      .append("text")
      .transition()
      .delay(1000)
      .duration(0)
      .attr("transform", d => {
        let c = arc.centroid(d);
        return `translate(${c[0] * 1.6}, ${c[1] * 1.6})`;
      })
      .attr("text-anchor", "middle")
      .text(d => d.data.value)
      .style("font-size", "10px");
  };

  const drawLegend = (data, ref, useGenderColors) => {
    const w = 150;
    const h = 320;
    const legendRectSize = 15;
    const legendSpacing = 7;
    const legendHeight = legendRectSize + legendSpacing;

    // Get the appropriate color scale
    const color = getColorScale(useGenderColors);

    const svg = d3.select(ref.current)
      .append("svg")
      .attr("height", h)
      .attr("width", w)
      .append("g")
      .attr("transform", `translate(0,${h / 2})`);

    // Use explicit order only if using gender colors
    const legendKeys = useGenderColors ? ['Male', 'Female', 'Unknown'] : data.map(d => d.key);

    const legend = svg.selectAll('.legend')
      .data(legendKeys)
      .enter()
      .append('g')
      .attr("class", "legend")
      .attr("transform", (d, i) => {
        if (data.length > 2) {
          return `translate(5, ${(i * legendHeight) - 11 * data.length})`;
        } else {
          return `translate(5, ${(i * legendHeight) - 40})`;
        }
      });

    // Add color squares
    legend.append('rect')
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .attr("rx", 30)
      .attr("ry", 30)
      .style("fill", d => color(d))  // 🔹 Ensure legend colors match pie chart
      .style("stroke", d => color(d));

    // Add text labels with correct values
    legend.append('text')
      .attr("x", 20)
      .attr("y", 12)
      .attr("font-size", "12px")
      .text(d => {
        const found = data.find(item => item.key === d);
        return `${d} (${found ? found.value : 0})`; // Show 0 if missing
      });
  };

  useEffect(() => {
    drawChart(props.queryResult, chart, props.useGenderColors);
    drawLegend(props.queryResult, legend, props.useGenderColors);
  }, [props.queryResult, props.useGenderColors]);

  // RETURNS PLACEHOLDER
  return (
    <Card className="h-100 d-flex justify-content-center">
      <Card.Body>
        <Card.Title className="fs-6 text-center fw-normal mb-4 mt-4">{props.title}</Card.Title>
        {props.queryResult
          ? <div className="h-100 w-100 d-flex justify-content-center">
            <div ref={chart} style={{ float: 'left', width: '300px', height: '320px' }}></div>
            <div ref={legend} className="filter_scroll_area" style={{ overflowX: 'hidden', float: 'left', width: '200px', height: '320px' }}></div>
            {props.queryResultNullValues > 0 && (<p className="pt-2 mb-0">* This chart excludes {props.queryResultNullValues} nodes with 'null' or 'unknown' values</p>)}
          </div>
          : <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden">Loading...</span></Spinner>
        }
      </Card.Body>
    </Card>
  )
}

export default PieChart;