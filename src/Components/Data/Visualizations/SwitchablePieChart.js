// IMPORTS ////////////////////////////////////////////////////////////////////
import * as d3 from "d3";
import { color } from "d3";

// MAIN DEPENDENCIES
import React, { useEffect, useState, useRef } from "react";
import { Card, Spinner, Nav, Tab, Tabs } from 'react-bootstrap';



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function SwitchablePieChart(props) {
  const chart1 = useRef();
  const chart2 = useRef();
  const cardWidth = 600;

  const drawChart = (data, ref) => {
      
    // transform the value of each group to a radius that will be displayed on the chart
    const pie = d3.pie()
      .value(function(d){return d.value})
      .sort(null)
      .padAngle(.03);
    
    const w = cardWidth;
    const h = 320;
    const outerRadius = 300 / 2;
    const innerRadius = 100;

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
      .attr("class", function(d, i) {
        return `legend ${data[i].key}`
      })
      .attr("transform", function(d,i) {
        //Just a calculation for x and y position
        if (data.length > 4) {
          return 'translate(160,' + ((i*legendHeight) - 160) + ')';
        } else {
          return 'translate(160,' + ((i*legendHeight) - 40) + ')';
        }
      })
      .style("background-color", "gray")

    legend.append('rect')
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .attr("rx", 20)
      .attr("ry", 20)
      .style("fill", color)
      .style("stroke", color)

    legend.append('text')
        .attr("x", 30)
        .attr("y", 15)
        .text(function(d, i){
          return `${d} (${data[i].value})`;
        })
  }

  useEffect(() => {
    drawChart(props.queryResult1, chart1);
    drawChart(props.queryResult2, chart2);
  }, []);

  // RETURNS PLACEHOLDER
  return ( 
    <Card style={{ width: `${cardWidth}px`, border: 'none' }} id="pie-chart-card">
        <Card.Body>
            <Tab.Container defaultActiveKey={props.title1}>
                <Nav variant="pills" className="flex-column" style={{width: 300}}>
                    <Nav.Item>
                        <Nav.Link eventKey={props.title1}>{props.title1}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item style={{marginTop: '0px'}}>
                        <Nav.Link eventKey={props.title2} id="test">{props.title2}</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey={props.title1}>
                        <div ref={chart1}></div>
                        { props.queryResult1NullValues && (
                          <p style={{marginLeft: "45px", marginTop: "10px", color: "#444444"}}>
                            * There are { props.queryResult1NullValues } null values
                          </p>
                        )}
                    </Tab.Pane>
                    <Tab.Pane eventKey={props.title2}>
                        <div ref={chart2}></div>
                        { props.queryResult2NullValues && (
                          <p style={{marginLeft: "45px", marginTop: "10px", color: "#444444"}}>
                            * There are { props.queryResult2NullValues } null values
                          </p>
                        )}
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Card.Body>
      </Card>
  )
}

export default SwitchablePieChart
