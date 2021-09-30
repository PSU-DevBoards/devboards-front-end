import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';

function App() {
  return (
      <div className="App">
        <Router>
          <Route path="/" component={Landing} exact/>
          <Route path="/auth" component={Auth} exact/>
        </Router>
      </div>
  );
}

export default App;
