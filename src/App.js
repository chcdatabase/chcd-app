import './Styles/Sass/App.scss';
import Navbar from './Components/Navbar/Navbar.js'
import SearchView from './Components/Views/SearchView.js'
import MapView from './Components/Views/MapView.js'
import NetworkView from './Components/Views/NetworkView.js'
import DataView from './Components/Views/DataView.js'
import { BrowserRouter, Route } from 'react-router-dom'

function App() {


  return (
    <div className="App">
      <header className="App-header">
      <BrowserRouter>
          <Route path="/" component={Navbar} />
          <Route path="/search" component={SearchView} />
          <Route path="/map" component={MapView} />
          <Route path="/network" component={NetworkView} />
          <Route path="/data" component={DataView} />
      </BrowserRouter>
      </header>

    </div>
  );
}

export default App;
