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
        <main className="App-header" role="main">
            <Route path="/" exact render={(props) => <HomeView {...props} key={Math.random()}/>} />
            <Route path="/search" render={(props) => <SearchView {...props} key={Math.random()}/>} />
            <Route path="/map" render={(props) => <MapView {...props} key={Math.random()}/>} />
            <Route path="/network" render={(props) => <NetworkView {...props} key={Math.random()}/>} />
            <Route path="/data" render={(props) => <DataView {...props} key={Math.random()}/>} />
        </main>
      </div>
    );
  }
}
