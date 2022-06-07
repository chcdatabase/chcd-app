import './Styles/Sass/App.scss';
import HomeView from './Components/Home/HomeView.js'
import SearchView from './Components/Search/SearchView.js'
import MapView from './Components/Map/MapView.js'
import NetworkView from './Components/Network/NetworkView.js'
import GeneralView from './Components/Data/General/GeneralView'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React, { useState } from 'react'
import CorporateEntityView from './Components/Data/CorporateEntity/CorporateEntityView';
import InstitutionView from './Components/Data/Institution/InstitutionView';
import GeographicView from './Components/Data/Geographic/GeographicView';


export default class App extends React.Component {

render() {
    return (
      <div className="App">
        <main className="App-header" role="main">
            <Route path="/" exact component={HomeView}/>
            <Route path="/search" component={SearchView} />
            <Route path="/map" component={MapView} />
            <Route path="/network" component={NetworkView} />
            <Route path="/data" component={GeneralView} />
            <Route path="/corporate-entity" component={CorporateEntityView} />
            <Route path="/institution-view" component={InstitutionView} />
            <Route path="/geographic-view" component={GeographicView} />
        </main>
      </div>

    );
  }
}
