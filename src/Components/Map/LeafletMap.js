// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React, { useEffect, useRef } from 'react';
import { Map, TileLayer, Marker, Popup, ZoomControl, FeatureGroup, LayersControl, LayerGroup, Circle} from "react-leaflet";
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
//LEAFLET DEPENDENCIES
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import HeatmapLayer  from "react-leaflet-heatmap-layer";
import MarkerClusterGroup from 'react-leaflet-markercluster';
//ASSET IMPORTS
import newIcon from "../../Assets/icons/circle-marker.png"


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
//CONSTRUCT MAP
const group = L.featureGroup();



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function LeafletMap(props) {

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
     if (node.properties.given_name_western) { return (
       <Popup className="map_popup"><Row><Col className="col-12">
        <p className="mb-2 mt-0">
          <h6 className="pop_head">{node.properties.given_name_western} {node.properties.family_name_western.toUpperCase()}</h6>
          <span className="highlight">Gender:</span> {node.properties.gender}<br/>
          <span className="highlight">Institution:</span> {node.inst.name_western}<br/>
          <span className="highlight">Affiliation:</span> {node.aff.name_western}<br/>
          <span className="highlight">Years:</span> {node.rel.start_year} - {node.rel.end_year}<br/>
          <span className="highlight">Location:</span> {node.locat.name_wes}
        </p>
        <Button size="sm" className="col-12" variant="danger" onClick={() =>  props.selectSwitchInitial(node.key)}>Learn More...</Button>
      </Col></Row></Popup>
     )}
     else if (node.properties.institution_category) { return (
       <Popup className="map_popup"><Row><Col className="col-12">
        <p className="mb-2 mt-0">
          <h6 className="pop_head">{node.properties.name_western}</h6>
          <span className="highlight">Religious Family:</span> {node.aff.religious_family}<br/>
          <span className="highlight">Category:</span> {node.properties.institution_category}<br/>
          <span className="highlight">Sub-Category:</span> {node.properties.institution_subcategory}<br/>
          <span className="highlight">Gender Served:</span> {node.properties.gender_served}<br/>
          <span className="highlight">Years:</span> TBD<br/>
          <span className="highlight">Location:</span> {node.locat.name_wes}
        </p>
        <Button size="sm" className="col-12" variant="danger" onClick={() =>  props.selectSwitchInitial(node.key)}>Learn More...</Button>
      </Col></Row></Popup>
     )}
     else if (node.properties.corporate_entity_category) { return (
        <Popup className="map_popup"><Row><Col className="col-12">
          <p className="mb-2 mt-0">
            <h6 className="pop_head">{node.properties.name_western}</h6>
            <span className="highlight">Religious Family:</span> {node.aff.religious_family}<br/>
            <span className="highlight">Category:</span> {node.properties.corporate_entity_category}<br/>
            <span className="highlight">Sub-Category:</span> {node.properties.corporate_entity_subcategory}<br/>
            <span className="highlight">Years:</span> TBD<br/>
            <span className="highlight">Location:</span> {node.locat.name_wes}
          </p>
          <Button size="sm" className="col-12" variant="danger" onClick={() =>  props.selectSwitchInitial(node.key)}>Learn More...</Button>
        </Col></Row></Popup>
     )}
   }

   // RETURNS SPINNER ON CONTENT LOADING STATE
   function checkLoad(props) {
     if (props.content === "loading") { return (
         <div className="list_container">
           <div className="list_float d-flex align-items-center justify-content-center">
             <Row><Col>
               <Spinner animation="border" role="status" variant="light"><span className="visually-hidden hide">Loading...</span></Spinner>
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
        <LayersControl.BaseLayer checked name="Grayscale">
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        {/* LAYER CONTROLS - TOPOGRAPHIC BASELAYER */}
        <LayersControl.BaseLayer name="Topographic">
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        {/* LAYER CONTROLS - POINT DATA OVERLAY */}
        <LayersControl.Overlay checked name="Point Data">
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
          <LayersControl.Overlay name="Heat Map">
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
