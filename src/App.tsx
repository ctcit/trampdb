import { createContext } from "react";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react"
import {
  Routes,
  Route,
  Link,
  BrowserRouter as Router,
} from "react-router-dom";
import './App.css';
import { EditTramp } from "./components/EditTramp";
import { NewTramp } from "./components/NewTramp";
import { RegionList } from "./components/RegionList";
import { TrampDisplay } from './components/TrampDisplay';
import { TrampList } from './components/TrampList';
import IRegion from "./interfaces/IRegion"
import RegionDataService from './utilities/region.service'
import { RegionDisplay } from "./components/RegionDisplay";
import { CreateFromTripReports as GroupTripReports } from "./components/GroupTripReports";

export const RegionContext = createContext<IRegion[]|undefined>(undefined)

function App() {
  const [regions, setRegions] = useState([] as IRegion[])
  useEffect(() => {
    RegionDataService.getAll().then((retrievedRegion: IRegion[] | undefined) => {
      if (retrievedRegion) {
        setRegions(retrievedRegion)
      } else {
      }
    })
  }, [])
  return (
    <RegionContext.Provider value={regions}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>CTC Tramps Database</h1>
            <nav>
              <Link to="/" className="px-2">All Tramps</Link>
              <Link to="/regions" className="px-2">Regions</Link>
              <Link to="/new" className="px-2">New</Link>
            </nav>
          </header>
          <Container>
            <Routes>
              <Route path="/tramp/:id" element={<TrampDisplay />} />
              <Route path="/region/:id" element={<RegionDisplay />} />
              <Route path="/edit/:id" element={<EditTramp />} />
              <Route path="/new" element={<NewTramp />} />
              <Route path="/regions" element={<RegionList />} />
              <Route path="/" element={<TrampList title=""/>} />
              <Route path="/group" element={<GroupTripReports/>} />
              <Route path="*" element={<TrampList title='unmatched!' />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </RegionContext.Provider>
  );
}

export default App;
