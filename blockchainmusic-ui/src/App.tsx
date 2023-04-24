import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import './App.css';
import Profile from './pages/profile';
import Browse from './pages/browse';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/Profile" element={<Profile/>}/>
            <Route path="/Browse" element={<Browse />}/>
        </Routes>
      </Router>
    </div>
  )
  /*
  return (
    <div className="App">
      
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          
        </a>
      </header>
    </div>
  );
  */
}

export default App;
