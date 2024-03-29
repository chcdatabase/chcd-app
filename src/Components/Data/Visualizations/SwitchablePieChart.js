// IMPORTS ////////////////////////////////////////////////////////////////////
import * as d3 from "d3";

// MAIN DEPENDENCIES
import React, { useEffect, useState, useRef } from "react";
import { Card, Spinner, Nav, Tab, Tabs } from 'react-bootstrap';



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function SwitchablePieChart(props) {
  const chart1 = useRef();
  const chart2 = useRef();
  const legend1 = useRef();
  const legend2 = useRef();
  const cardWidth = 500;

  const drawChart = (data, ref) => {

    // transform the value of each group to a radius that will be displayed on the chart
    const pie = d3.pie()
      .value(function(d){return d.value})
      .sort(null)
      .padAngle(.03);

    const w = cardWidth;
    const h = 300;
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

    function extractKeys(jsonElement) {
      const keys = [];
      function extractKeys(obj) {
        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            extractKeys(obj[key]);
          } else if (key === 'key') {
            keys.push(obj[key]);
          }
        }
      }
      extractKeys(jsonElement);
      return keys;
    }
  
    var keyArray = extractKeys(data)
    var longest = keyArray.reduce(
      function (a, b) {
          return a.length > b.length ? a : b;
      }
  );

    const w = 100 + longest.length*4;
    let h
    if (data.length > 5) {h = 18*data.length}
    else { h = 300 }

    // Construct Invisibale Placeholder Piechart
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const pie = d3.pie().value(function(d){return d.value}).sort(null).padAngle(.03);
    const arc = d3.arc().outerRadius(0).innerRadius(0);
    const svg = d3.select(ref.current)
      .append("svg")
      .attr("height", h)
      .attr("width", w)
      .append("g")
      .attr("transform", 'translate(0,'+(h/2.5)+')');
    const path = svg.selectAll('path').data(pie(data)).enter().append("path").attr("d", arc).attr("class", "shadow-filter section").attr("fill", function(d, i) {return color(d.data.key);});

    // add legend
    const legendRectSize=11;
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
        if (data.length > 5) {return 'translate(5,' + ((i*legendHeight) - 7*data.length) + ')';}
        else { return 'translate(5,' + ((i*legendHeight) - 7*data.length) + ')';}
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
        .attr("y", 11)
        .attr("font-size" , "11px")
        .text(function(d, i){
          return `${d} (${data[i].value})`;
        })
  }

  useEffect(() => {
    drawChart(props.queryResult1, chart1);
    drawChart(props.queryResult2, chart2);
    drawLegend(props.queryResult1, legend1);
    drawLegend(props.queryResult2, legend2);
  }, []);

  // RETURNS PLACEHOLDER
  return (
    <Card id="pie-chart-card" className="h-100">
        <Card.Body>
            <Tab.Container defaultActiveKey={props.title1}>
                <Nav variant="pills" className="mb-4 d-flex justify-content-center">
                    <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                        <Nav.Link eventKey={props.title1}>{props.title1}</Nav.Link>
                    </Nav.Item >
                    <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                        <Nav.Link eventKey={props.title2} id="test">{props.title2}</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey={props.title1}>
                    { props.queryResult1
                    ? <div className="d-flex flex-wrap flex-row justify-content-center">
                        <div ref={chart1} style={{float: 'left', width: '300px', height: '320px'}}></div>
                        <div ref={legend1} className="filter_scroll_area" style={{width: '250px', minHeight: '320px', maxHeight: '320px', height: ((18*props.queryResult1.length)+20), overflow: 'auto'}}></div>
                        { props.queryResult1NullValues > 0 && (
                          <p className="pt-3 mb-0" style={{ fontSize: '.75em', float: 'left', minWidth: '200px'}}>
                            * This chart excludes { props.queryResult1NullValues } nodes with 'null' or 'unknown' values
                          </p>
                        )}
                      </div>
                    : <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden">Loading...</span></Spinner>
                    }
                    </Tab.Pane>
                    <Tab.Pane eventKey={props.title2}>
                    { props.queryResult2
                    ? <div className="d-flex flex-wrap flex-row justify-content-center">
                      <div ref={chart2} style={{float: 'left', width: '300px', height: '320px'}}></div>
                        <div ref={legend2} className="filter_scroll_area" style={{width: '250px', minHeight: '320px', maxHeight: '320px', height: ((18*props.queryResult2.length)+20), overflow: 'auto'}}></div>
                        { props.queryResult1NullValues > 0 && (
                          <p className="pt-3 mb-0" style={{ fontSize: '.75em', float: 'left', minWidth: '200px'}}>
                            * This chart excludes { props.queryResult2NullValues } nodes with 'null' or 'unknown' values.
                          </p>
                        )}
                      </div>
                    : <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden">Loading...</span></Spinner>
                    }
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Card.Body>
      </Card>
  )
}

export default SwitchablePieChart
