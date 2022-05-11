/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useRef } from "react";
import { Row, Col, Spinner } from 'react-bootstrap';
import * as d3 from "d3";
import forceBoundary from 'd3-force-boundary';
import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export function EgoGraph({ nodeArray, content, node_id, selectSwitchInitial, language, filterDisplay, networkKey}) {

// CONSTRUCT CONTAINER ///////////////////////////////////////////////////////////////////////////////
  const d3Container = useRef(null);

// HOOK TO CREATE GRAPH & UPDATE  ON STATE CHANGE ////////////////////////////////////////////////////
  useEffect(() => {
    if (nodeArray.length !== 0 && d3Container.current) {
      //USE NODEARRAY TO CREATE NEW ARRAY WITH CONNECTION COUNT INCLUDED IN NODE SUBARRAYS
      const nodes2 = nodeArray[0].nodes;
      const rels2 = nodeArray[0].links;
      let countArray = [];
      for (var i = 0; i < nodes2.length ; i++) {
        const nodeOutput = [];
        for (var r = 0; r < rels2.length ; r++) {
          if (nodes2[i].key === rels2[r].source || nodes2[i].key === rels2[r].target) {nodeOutput.push(1)}
        };
        countArray.push({key: nodes2[i].key, label: nodes2[i].label, properties: nodes2[i].properties, count: nodeOutput.length});
      };
      let newNodeArray = [];
      for (var i = 0; i < countArray.length ; i++) {
        if (countArray[i].count > 0) {  newNodeArray.push(countArray[i]) }
      }

      //SET HEIGHT & WIDTH
      var parentDiv = document.getElementById("graph-float");
      var styles = window.getComputedStyle(parentDiv);
      var w = styles.width.slice(0, -2);
      var h = styles.height.slice(0, -2);

      //CONSTRUCT SVG CONTAINER WITH ZOOM
      const svg = d3
        .select(d3Container.current)
        .html("")
        .attr("viewBox", [0, 0, w, h])
        .call(d3.zoom().on("zoom", function () {svg.attr("transform", d3.event.transform)}))
        .append("g");

      //CONSTRUCT SCALER FOR GRAPH SYMBOLS
      const myScale = d3
        .scaleSqrt()
        .domain([0, 100])
        .range([200, 2000]);

      //CONTROL FORCES ON GRAPH
      const link_force = d3
        .forceLink(nodeArray[0].links)
        .id(function(d) { return d.key; })
      const simulation = d3
        .forceSimulation()
        .nodes(newNodeArray);
      simulation
        .force("charge_force", d3.forceManyBody().strength(-200))
        .force('radial', d3.forceRadial().radius(100).x(w / 2).y(h / 2))
        .force("center_force", d3.forceCenter(w / 2, h / 2))
        .force("collision", d3.forceCollide())
        .force("links", link_force);

      //ADD NODE DRAGGING CAPABILITIES
      const drag = (simulation) => {
        const dragstarted = (d) => {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        };
        const dragged = (d) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        };
        const dragended = (d) => {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        };
        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          //.on("end", dragended);
      }

      //DRAW LINES FOR LINKS
      let link = svg
        .append("g")
        .attr("stroke", "#afafaf")
        .attr("stroke-opacity", 1)
        .selectAll("line")
        .data(nodeArray[0].links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

      //CREATE NODES
      let node = svg.append("g")
        .classed("nodes", true)
        .selectAll("g")
        .data(newNodeArray)
        .enter()
        .append("g");

      //ADD NODE SYMBOLS
      node
        .append("path")
        .on("click", function(d){selectSwitchInitial(d.key)})
        .attr('d', d3.symbol()
          .type(function(d){
            if (d.label === "Person") {return d3.symbolCircle}
            else if (d.label === "Institution") {return d3.symbolSquare}
            else if (d.label === "CorporateEntity") {return d3.symbolTriangle}
            else if (d.label === "Event") {return d3.symbolDiamond}
          })
          .size(d => myScale(d.count))
        )
        .attr("fill", function(d){
          if (d.label === "Institution") {return "#f2905c"}
          else if (d.label === "CorporateEntity") {return "#e8859b"}
          else if (d.label === "Event") {return "#bc0943"}
          else if (d.properties.gender === "Male") {return "#5cbef2"}
          else if (d.properties.gender === "Female") {return "#f25c73"}
          else {return "#b18cf5"}
        })
        .attr("stroke", "#000")
        .attr("stroke-width", function(d){
          if (d.key === node_id) {return "3"}
          else { return "0"}
        })
        .call(drag(simulation))
        .on('mouseover', function (d) {
          link
          .style('stroke', function (link_d) { return link_d.source.key === d.key|| link_d.target.key === d.key ? '#fff' : '#afafaf';})
          .style('stroke-width', function (link_d) { return link_d.source.key === d.key || link_d.target.key === d.key ? 3 : 1;})
        })
        .on('mouseout', function (d) {
          link
            .style('stroke', '#afafaf')
            .style('stroke-width', '1')
        });

      //ADD NODE LABELS
      node
        .append("text")
        .classed("node_label", true)
        .on("click", function(d){selectSwitchInitial(d.key)})
        .attr("text-anchor", "middle")
        .attr("dx", 0)
        .attr("dy", 0)
        .text(function(d){
          if (d.label === "Person") {
             if ((language == "zh" || language == "tw") && d.properties.chinese_given_name_hanzi) {return d.properties.chinese_family_name_hanzi + d.properties.chinese_given_name_hanzi }
             else { return d.properties.given_name_western + ` ` + d.properties.family_name_western  }
          }
          else {
            if ((language == "zh" || language == "tw") && d.properties.chinese_name_hanzi) { return d.properties.chinese_name_hanzi }
            else { return d.properties.name_western }
          }
        })
        .on('mouseover', function (d) {
          link
          .style('stroke', function (link_d) { return link_d.source.key === d.key|| link_d.target.key === d.key ? '#fff' : '#afafaf';})
          .style('stroke-width', function (link_d) { return link_d.source.key === d.key || link_d.target.key === d.key ? 3 : 1;})
        })
        .on('mouseout', function (d) {
          link
            .style('stroke', '#afafaf')
            .style('stroke-width', '1')
        });

      // TICKACTION TO UPDATE POSITION ON INTERNAL D3 SIMULATION CHANGE
      function tickActions() {
        //UPDATE NODE POSITIONS ON EACH TICK
        node.attr('transform', d => `translate(${d.x},${d.y})`);
        //UPDATE LINKS POSITIONS ON EACH TICK (CONNECTS NODES AND LINKS)
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; })
          .exit().remove();
      }

      // ADD TICKACTION TO SIMULATION
      simulation.on("tick", tickActions );

      //REMOVE OLD ELEMENTS
      node.exit().remove();
    }
  },[nodeArray, selectSwitchInitial, node_id])

// PRE-RENDER CONSTRUCTORS //////////////////////////////////////////////////////////////////////////

  // CHECKS & CONSTRUCTS GRAPH CONTAINER
  let containerCheck;
    if (filterDisplay == "filter_container") {containerCheck = "graph_float"}
    else {containerCheck = "graph_float_full"}

// RETURNS ////////////////////////////////////////////////////////////////////////////////////////

  // LOADING STATE RETURN IF LOADING
  if (nodeArray.length === 0 && content == "loading") {return (
      <div className="graph_container">
        <div className="graph_float d-flex align-items-center justify-content-center">
          <Row><Col>
            <Spinner animation="border" role="status" variant="light"><span className="visually-hidden hide">Loading...</span></Spinner>
          </Col></Row>
        </div>
      </div>
   )}
  // LOADING STATE RETURN IF NO NETWORK
  else if (nodeArray.length === 0) { return (
    <div className="graph_container">
      <div className={containerCheck + " d-flex align-items-center justify-content-center"} id="main">
        <Row><Col>
          <h1 className="list_placeholder_title text-center">{translate[0]["network-prompt"][language]}</h1>
          <div className="list_placeholder"> </div>
        </Col></Row>
      </div>
    </div>
  )}

  // NETWORK GRAPH RETURN
  else { return (
    <div>
      <h1 className="aria-only">{translate[0]["network"][language]}</h1>
      <div className="graph_container" id="main">
        <div id="graph-float" className={containerCheck}>

          <svg className="d3-component" ref={d3Container} />
        </div>
      </div>
    </div>
  )}

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default EgoGraph
