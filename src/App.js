import './Styles/Sass/App.scss';
import HomeView from './Components/Home/HomeView.js'
import SearchView from './Components/Search/SearchView.js'
import MapView from './Components/Map/MapView.js'
import NetworkView from './Components/Network/NetworkView.js'
import DataView from './Components/Data/DataView.js'
import { Route, Routes } from 'react-router-dom'
import React from 'react'


export default class App extends React.Component {

render() {

    return (
      <div className="App">
        <main className="App-header" role="main">
              <Routes>
                <Route path="/" exact Component={HomeView}/>
                <Route path="/search" Component={SearchView} />
                <Route path="/map" Component={MapView} />
                <Route path="/network" Component={NetworkView} />
                <Route path="/data" Component={DataView} />
              </Routes>
        </main>
      </div>
    );
  }
}
