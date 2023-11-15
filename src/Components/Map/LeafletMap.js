/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useRef, useState } from 'react';
import { Map, TileLayer, Marker, Popup, ZoomControl, FeatureGroup, LayersControl, LayerGroup, Circle} from "react-leaflet";
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import HeatmapLayer  from "react-leaflet-heatmap-layer";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import newIcon from "../../Assets/icons/circle-marker.png"
import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"
import CsvDownloadButton from 'react-json-to-csv'
import ReactTooltip from "react-tooltip"
import { FaFileCsv, FaQuoteRight } from 'react-icons/fa'
import { useAlert } from 'react-alert'


/////////////////////////////////////////////////////////////////////////////////////////////////////
// SUPPORTING FUNCTIONS /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//CREATE CUSTOMIZED CLUSTER ICONS BASED ON CLUSTER SIZE
const createClusterCustomIcon = function (cluster) {
  let size = cluster.getChildCount();
  if (size < 20) {
    return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom small',
    iconSize: L.point(30, 30, true),
    })
  } else if (size > 20 && size < 80 ){
    return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom medium',
    iconSize: L.point(40, 40, true),
    })
  } else {
    return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom large',
    iconSize: L.point(50, 50, true),
    })
  }
};
//CREATE CUSTOM ICON
const myIcon = L.icon({
  iconUrl: newIcon,
  iconSize: [15,15],
  className: "custom-icon"
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function LeafletMap(props) {

  const alert = useAlert()

  //CONSTRUCT MAP
  const group = L.featureGroup();

   // FILTERS NODES TO UNIQUE INSTANCES AND REDUCES FILTERED NODES TO HEATMAP COMPLIANT LAYER
   let uniqueArray;
   let heatArray;
   if (props.nodeArray.length > 0) {
    uniqueArray = props.nodeArray.filter((e, i) => {
      return props.nodeArray.findIndex((x) => {
        return x.key === e.key && x.locat.id === e.locat.id
      }) === i;
    });
    heatArray = uniqueArray.map( (i) =>[Number(i.locat.latitude), Number(i.locat.longitude), 50])
  } else {
    uniqueArray = props.nodeArray;
    heatArray = props.nodeArray;
  }

   // TEMPLATES FOR POPUPS BASED ON NODE TYPE //////////////
   /////////////////////////////////////////////////////////
   function popup(node) {
     //Person Popup
     if (node.properties.given_name_western) {
       let pers_name;
          if ((props.language == "zh" || props.language == "tw") && node.inst.chinese_name_hanzi) { pers_name = `${node.properties.chinese_family_name_hanzi} ${node.properties.chinese_given_name_hanzi.toUpperCase()}` }
          else { pers_name = `${node.properties.given_name_western} ${node.properties.family_name_western.toUpperCase()}` }
       let inst_name;
          if ((props.language == "zh" || props.language == "tw") && node.inst.chinese_name_hanzi) { inst_name = node.inst.chinese_name_hanzi }
          else { inst_name = node.inst.name_western }
       let aff_name;
          if ((props.language == "zh" || props.language == "tw") && node.aff.chinese_name_hanzi) { aff_name = node.aff.chinese_name_hanzi }
          else { aff_name = node.aff.name_western }
       let loc_name;
          if ((props.language == "zh" || props.language == "tw") && node.locat.name_zh) { loc_name = node.locat.name_zh }
          else { loc_name = node.locat.name_wes }
       return (
       <Popup className="map_popup"><Row><Col className="col-12">
        <p className="mb-2 mt-0">
          <span className="pop_head">{pers_name}</span>
          <span className="highlight">{translate[0]["gender"][props.language]}:</span> {translate[0][node.properties.gender.toLowerCase()][props.language]}<br/>
          <span className="highlight">{translate[0]["institution"][props.language]}:</span> {inst_name}<br/>
          <span className="highlight">{translate[0]["affiliation"][props.language]}:</span> {aff_name}<br/>
          <span className="highlight">{translate[0]["years"][props.language]}:</span> {node.rel.start_year} - {node.rel.end_year}<br/>
          <span className="highlight">{translate[0]["location"][props.language]}:</span> {loc_name}
        </p>
        <Button size="sm" className="col-12" variant="danger" onClick={() =>  props.selectSwitchInitial(node.key)}>{translate[0]["learn_more"][props.language]}</Button>
      </Col></Row></Popup>
     )}

     //Institution Popup
     else if (node.properties.institution_category) {
       let inst_name;
          if ((props.language == "zh" || props.language == "tw") && node.properties.chinese_name_hanzi) { inst_name = node.properties.chinese_name_hanzi }
          else { inst_name = node.properties.name_western }
       let aff_name;
          if ((props.language == "zh" || props.language == "tw") && node.aff.chinese_name_hanzi) { aff_name = node.aff.chinese_name_hanzi }
          else { aff_name = node.aff.name_western }
       let loc_name;
          if ((props.language == "zh" || props.language == "tw") && node.locat.name_zh) { loc_name = node.locat.name_zh }
          else { loc_name = node.locat.name_wes }

       let gender_serve;
         if (node.properties.gender_serve === undefined) {let na = "N/A"; gender_serve = translate[0][na.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
         else if (translate[0][node.properties.gender_serve.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {gender_serve = node.properties.gender_serve}
         else {gender_serve = translate[0][node.properties.gender_serve.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

       let category = node.properties.institution_category
         if (node.properties.institution_category === undefined) {let na = "N/A"; category = translate[0][na.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
         else if (cat_trans[0][node.properties.institution_category.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {category = node.properties.institution_category}
         else {category = cat_trans[0][node.properties.institution_category.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

       let subcategory = node.properties.institution_subcategory
         if (node.properties.institution_subcategory === undefined) {let na = "N/A"; subcategory = translate[0][na.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
         else if (cat_trans[0][node.properties.institution_subcategory.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {subcategory = node.properties.institution_subcategory}
         else {subcategory = cat_trans[0][node.properties.institution_subcategory.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

       let aff;
        if (node.aff.religious_family) {aff = node.aff.religious_family;}
        else {aff = "N/A"}

       return (
       <Popup className="map_popup"><Row><Col className="col-12">
        <p className="mb-2 mt-0">
          <h6 className="pop_head">{inst_name}</h6>
          <span className="highlight">{translate[0]["religious_family"][props.language]}:</span> {family_trans[0][aff.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}<br/>
          <span className="highlight">{translate[0]["category"][props.language]}:</span> {category}<br/>
          <span className="highlight">{translate[0]["subcategory"][props.language]}:</span> {subcategory}<br/>
          <span className="highlight">{translate[0]["gender_served"][props.language]}:</span> {gender_serve}<br/>
          {/* <span className="highlight">{translate[0]["years"][props.language]}:</span> {node.properties.start_year} - {node.properties.end_year}<br/> */}
          <span className="highlight">{translate[0]["location"][props.language]}:</span> {loc_name}
        </p>
        <Button size="sm" className="col-12" variant="danger" onClick={() =>  props.selectSwitchInitial(node.key)}>{translate[0]["learn_more"][props.language]}</Button>
      </Col></Row></Popup>
     )}

     //Event Popup
     else if (node.properties.event_category) {
       let inst_name;
          if ((props.language == "zh" || props.language == "tw") && node.properties.chinese_name_hanzi) { inst_name = node.properties.chinese_name_hanzi }
          else { inst_name = node.properties.name_western }
       let loc_name;
          if ((props.language == "zh" || props.language == "tw") && node.locat.name_zh) { loc_name = node.locat.name_zh }
          else { loc_name = node.locat.name_wes }
       let category = node.properties.event_category
         if (node.properties.event_category === undefined) {let na = "N/A"; category = translate[0][na.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
         else if (cat_trans[0][node.properties.event_category.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {category = node.properties.event_category}
         else {category = cat_trans[0][node.properties.event_category.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
       let subcategory = node.properties.event_subcategory
         if (node.properties.event_subcategory === undefined) {let na = "N/A"; subcategory = translate[0][na.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
         else if (cat_trans[0][node.properties.event_subcategory.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined ) {subcategory = node.properties.event_subcategory}
         else {subcategory = cat_trans[0][node.properties.event_subcategory.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

       return (
       <Popup className="map_popup"><Row><Col className="col-12">
        <p className="mb-2 mt-0">
          <h6 className="pop_head">{inst_name}</h6>
          <span className="highlight">{translate[0]["category"][props.language]}:</span> {category}<br/>
          <span className="highlight">{translate[0]["subcategory"][props.language]}:</span> {subcategory}<br/>
          {/* <span className="highlight">{translate[0]["years"][props.language]}:</span> {node.properties.start_year} - {node.properties.end_year}<br/> */}
          <span className="highlight">{translate[0]["location"][props.language]}:</span> {loc_name}
        </p>
        <Button size="sm" className="col-12" variant="danger" onClick={() =>  props.selectSwitchInitial(node.key)}>{translate[0]["learn_more"][props.language]}</Button>
      </Col></Row></Popup>
     )}

   }

// RETURNS ////////////////////////////////////////////////////////////////////////////////////////

   // LOADING STATE RETURN
   function checkLoad(props) {
     if (props.content === "loading") { return (
         <div className="list_container">
           <div className="list_float d-flex align-items-center justify-content-center">
             <Row><Col>
               <Spinner animation="border" role="status" variant="light"><span className="visually-hidden hide">{translate[0]["loading"][props.language]}</span></Spinner>
             </Col></Row>
           </div>
         </div>
      )} else {return null}
   }

   function getMap(props) {
     if (props.language === "en") { return (
       <TileLayer
         attribution="Map tiles by <a href='http://stamen.com'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a> &mdash; Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
         url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
       />
    )}
    else { return (
      <TileLayer
        attribution="Map tiles by <a href='http://stamen.com'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a> &mdash; Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        url='http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
      />
    )}
   }

   function getDownloadLink(props) {
    if (props.printArray.length !== 0 ) { return ( 
    <div>
      <div className="d-flex justify-content-end position-absolute" style={{zIndex: '1000', bottom:'8em', right:'.25em'}}>
        <CsvDownloadButton delimiter="*" data={props.printArray} style={{borderWidth:'0px', background:'none'}}> 
          <FaFileCsv className="link-icons" data-tip data-for="all"/> 
          <ReactTooltip id="all" place="left" effect="solid">{translate[0]["download_all_data"][props.language]}</ReactTooltip>
        </CsvDownloadButton>
      </div>
      <div className="d-flex justify-content-end position-absolute" style={{zIndex: '1000', bottom:'6em', right:'.5em'}}>
        <FaQuoteRight 
          className="link-icons pt-1" 
          data-tip data-for="cite"
          onClick={() => { 
            const link = window.location.href;
            const title = translate[0]["custom_map"][props.language]
            const message = props.getCitation(title, link);
            const header = translate[0]["citation"][props.language]
            alert.show(message, { closeCopy: 'X', title: header });
          }}
          />
        <ReactTooltip id="cite" place="bottom" effect="solid">{translate[0]["citation"][props.language]}</ReactTooltip>
      </div>
    </div>
    )}
    else {}
   };

   // Conditionally render the MarkerClusterGroup and its contents
  function renderMarkers() {
    if (uniqueArray.length > 0) {
      return (
        <MarkerClusterGroup
          spiderfyDistanceMultiplier={1}
          showCoverageOnHover={false}
          maxClusterRadius={60}
          iconCreateFunction={createClusterCustomIcon}
        >
          {uniqueArray.map((node) => (
            <Marker
              key={node.properties.key}
              position={[node.locat.latitude, node.locat.longitude]}
              icon={myIcon}
            >
              {popup(node)}
            </Marker>
          ))}
        </MarkerClusterGroup>
      );
    } else {
      // If uniqueArray is empty, you can render a placeholder or null
      return null;
    }
  }

  function renderHeatMap() {
    if (heatArray.length > 0) {
      return (
        <LayerGroup>
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={heatArray}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => parseFloat(m[2])}
          />
        </LayerGroup>
      );
    } else {
      // If heatArray is empty, you can render a placeholder or null
      return null;
    }
  }
   // MAP RETURN
   return (
     <div>
     <h1 className="aria-only">{translate[0]["map"][props.language]}</h1>
     {checkLoad(props)}
     {getDownloadLink(props)}
     <Map bounds={props.bounds} zoom={7} zoomControl={false} id="main">
      <LayersControl position="topright">
        {/* LAYER CONTROLS - GRAY BASELAYER */}
        <LayersControl.BaseLayer checked name={translate[0]["standard"][props.language]}>
          {getMap(props)}
        </LayersControl.BaseLayer>
        {/* LAYER CONTROLS - TOPOGRAPHIC BASELAYER */}
        <LayersControl.BaseLayer name={translate[0]["topographic"][props.language]}>
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>

        {/* LAYER CONTROLS - POINT DATA OVERLAY */}
        <LayersControl.Overlay checked name={translate[0]["point_data"][props.language]}>
          {renderMarkers()}
          </LayersControl.Overlay>
          {/* LAYER CONTROLS - HEATMAP OVERLAY */}
          <LayersControl.Overlay name={translate[0]["heat_map"][props.language]}>
            {renderHeatMap()}
          </LayersControl.Overlay>
        </LayersControl>
      {/* ZOOM POSITIONING */}
      <ZoomControl position="bottomright" />
     </Map>
     </div>
   )
 }

 /////////////////////////////////////////////////////////////////////////////////////////////////////
 // EXPORT //////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////////////

 export default LeafletMap
