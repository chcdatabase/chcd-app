import './Styles/Sass/App.scss';
import HomeView from './Components/Home/HomeView.js'
import SearchView from './Components/Search/SearchView.js'
import MapView from './Components/Map/MapView.js'
import NetworkView from './Components/Network/NetworkView.js'
import DataView from './Components/Data/DataView.js'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React, { useState } from 'react'


export default class App extends React.Component {

render() {
    return (
      <div className="App">
        <header className="App-header">
            <Route path="/" exact component={HomeView}/>
            <Route path="/search" component={SearchView} />
            <Route path="/map" component={MapView} />
            <Route path="/network" component={NetworkView} />
            <Route path="/data" component={DataView} />
        </header>

      </div>
    );
  }
}
