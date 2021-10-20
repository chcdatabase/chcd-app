// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React, { useEffect, useRef, useState } from 'react';
import { Map, TileLayer, Marker, Popup, ZoomControl, FeatureGroup, LayersControl, LayerGroup, Circle} from "react-leaflet";
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
//LEAFLET DEPENDENCIES
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import HeatmapLayer  from "react-leaflet-heatmap-layer";
import MarkerClusterGroup from 'react-leaflet-markercluster';
//ASSET IMPORTS
import newIcon from "../../Assets/icons/circle-marker.png"
import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"


// SUPPORTING FUNCTIONS ////////////////////////////////////////////////////////

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

// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function LeafletMap(props) {

  //CONSTRUCT MAP
  const group = L.featureGroup();

   // FILTERS NODES TO UNIQUE INSTANCES
   const uniqueArray = props.nodeArray.filter((e, i) => {
     return props.nodeArray.findIndex((x) => {
       return x.key === e.key && x.locat.id === e.locat.id
     }) === i;
   });

   // REDUCES FILTERED NODES TO HEATMAP COMPLIANT LAYER
   const heatArray = uniqueArray.map( (i) =>[Number(i.locat.latitude), Number(i.locat.longitude), 50])

   // TEMPLATES FOR POPUPS BASED ON NODE TYPE
   function popup(node) {
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
          <h6 className="pop_head">{pers_name}</h6>
          <span className="highlight">{translate[0]["gender"][props.language]}:</span> {translate[0][node.properties.gender.toLowerCase()][props.language]}<br/>
          <span className="highlight">{translate[0]["institution"][props.language]}:</span> {inst_name}<br/>
          <span className="highlight">{translate[0]["affiliation"][props.language]}:</span> {aff_name}<br/>
          <span className="highlight">{translate[0]["years"][props.language]}:</span> {node.rel.start_year} - {node.rel.end_year}<br/>
          <span className="highlight">{translate[0]["location"][props.language]}:</span> {loc_name}
        </p>
        <Button size="sm" className="col-12" variant="danger" onClick={() =>  props.selectSwitchInitial(node.key)}>{translate[0]["learn_more"][props.language]}</Button>
      </Col></Row></Popup>
     )}
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
          if (node.properties.gender_served) { gender_serve = translate[0][node.properties.gender_served.toLowerCase()][props.language] }
          else { gender_serve = '-' }
       let aff;
        if (node.aff.religious_family) {aff = node.aff.religious_family;}
        else {aff = "N/A"}

       return (
       <Popup className="map_popup"><Row><Col className="col-12">
        <p className="mb-2 mt-0">
          <h6 className="pop_head">{inst_name}</h6>
          <span className="highlight">{translate[0]["religious_family"][props.language]}:</span> {family_trans[0][aff.replace(/\s|\//g, '_').toLowerCase()][props.language]}<br/>
          <span className="highlight">{translate[0]["category"][props.language]}:</span> {cat_trans[0][node.properties.institution_category.replace(/\s|\//g, '_').toLowerCase()][props.language]}<br/>
          <span className="highlight">{translate[0]["subcategory"][props.language]}:</span> {cat_trans[0][node.properties.institution_subcategory.replace(/\s|\//g, '_').toLowerCase()][props.language]}<br/>
          <span className="highlight">{translate[0]["gender_served"][props.language]}:</span> {gender_serve}<br/>
          <span className="highlight">{translate[0]["years"][props.language]}:</span> {node.properties.start_year} - {node.properties.end_year}<br/>
          <span className="highlight">{translate[0]["location"][props.language]}:</span> {loc_name}
        </p>
        <Button size="sm" className="col-12" variant="danger" onClick={() =>  props.selectSwitchInitial(node.key)}>{translate[0]["learn_more"][props.language]}</Button>
      </Col></Row></Popup>
     )}
   }

   // RETURNS SPINNER ON CONTENT LOADING STATE
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

   // RETURNS MAP
   return (
     <div>
     {checkLoad(props)}
     <Map bounds={props.bounds} zoom={7} zoomControl={false}>
      <LayersControl position="topright">

        {/* LAYER CONTROLS - GRAY BASELAYER */}
        <LayersControl.BaseLayer checked name={translate[0]["grayscale"][props.language]}>
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
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
          <MarkerClusterGroup
            spiderfyDistanceMultiplier={1}
            showCoverageOnHover={false}
            maxClusterRadius={60}
            iconCreateFunction={createClusterCustomIcon}
          >
          {uniqueArray.map(node => (
            <Marker
              key={node.properties.key}
              position={[node.locat.latitude,node.locat.longitude]}
              icon={myIcon}
            >
              {popup(node)}
            </Marker>
          ))}
          </MarkerClusterGroup>
          </LayersControl.Overlay>
          {/* LAYER CONTROLS - HEATMAP OVERLAY */}
          <LayersControl.Overlay name={translate[0]["heat_map"][props.language]}>
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
          </LayersControl.Overlay>
        </LayersControl>
      {/* ZOOM POSITIONING */}
      <ZoomControl position="bottomright" />
     </Map>
     </div>
   )

}

export default LeafletMap
