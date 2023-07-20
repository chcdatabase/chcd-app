// IMPORTS ////////////////////////////////////////////////////////////////////
import * as d3 from "d3";

// MAIN DEPENDENCIES
import React, { useEffect, useRef } from "react";
import {Card, Spinner} from 'react-bootstrap';



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function PieChart(props) {
  const chart = useRef();
  const legend = useRef();
  const cardWidth = 450;

 
  const drawChart = (data, ref) => {

    // transform the value of each group to a radius that will be displayed on the chart
    const pie = d3.pie()
      .value(function(d){return d.value})
      .sort(null)
      .padAngle(.03);

    const w = cardWidth;
    const h = 320;
    const outerRadius = 250 / 2;
    const innerRadius = 50;

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // draws on arc per group
    const arc = d3.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    // initialize svg element with width and height
    const svg = d3.select(ref.current)
      .append("svg")
      .attr("height", h)
      .attr("width", w)
      .append("g")
      .attr("transform", 'translate('+300/2+','+h/2+')');

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
          let c = arc.centroid(d);
          return "translate(" + c[0]*1.6 +"," + c[1]*1.6 + ")";
      })
      .attr("text-anchor", "middle")
      .text(function(d){
          return d.data.value;
      })
      .style("font-size", "10px")
  }

  const drawLegend = (data, ref) => {
    // transform the value of each group to a radius that will be displayed on the chart

    const w = 150;
    const h = 320

    // Construct Invisibale Placeholder Piechart
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const pie = d3.pie().value(function(d){return d.value}).sort(null).padAngle(.03);
    const arc = d3.arc().outerRadius(0).innerRadius(0);
    const svg = d3.select(ref.current)
      .append("svg")
      .attr("height", h)
      .attr("width", w)
      .append("g")
      .attr("transform", 'translate(0,'+h/2+')');
    const path = svg.selectAll('path').data(pie(data)).enter().append("path").attr("d", arc).attr("class", "shadow-filter section").attr("fill", function(d, i) {return color(d.data.key);});

    // add legend
    const legendRectSize=15;
    const legendSpacing=7;
    const legendHeight=legendRectSize+legendSpacing;

    const legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr("class", "legend" )
      .attr("class", function(d, i) { return `legend ${data[i].key}`})
      //Just a calculation for x and y position
      .attr("transform", function(d,i) {
        if (data.length > 2) {return 'translate(5,' + ((i*legendHeight) - 11*data.length) + ')';}
        else { return 'translate(5,' + ((i*legendHeight) - 40) + ')';}
        })

    legend.append('rect')
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .attr("rx", 30)
      .attr("ry", 30)
      .style("fill", color)
      .style("stroke", color)

    legend.append('text')
        .attr("x", 20)
        .attr("y", 12)
        .attr("font-size" , "12px")
        .text(function(d, i){
          return `${d} (${data[i].value})`;
        })
  }

  useEffect(() => {
      drawChart(props.queryResult, chart);
      drawLegend(props.queryResult, legend);
  }, []);

  // RETURNS PLACEHOLDER
  return (
      <Card className="h-100 d-flex justify-content-center">
        <Card.Body>
          <Card.Title className="fs-6 text-center fw-normal mb-4 mt-4">{props.title}</Card.Title>
          { props.queryResult
            ? <div className="h-100 w-100 d-flex justify-content-center">
                <div ref={chart} style={{float: 'left', width: '300px', height: '320px'}}></div>
                <div ref={legend} className="filter_scroll_area" style={{overflowX: 'hidden', float: 'left', width: '200px', height: '320px'}}></div>
                { props.queryResultNullValues > 0 && (<p className="pt-2 mb-0">* This chart excludes { props.queryResultNullValues } nodes with 'null' or 'unknown' values</p>)}
              </div>
            : <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden">Loading...</span></Spinner>
          }
        </Card.Body>
      </Card>
  )
}

export default PieChart
