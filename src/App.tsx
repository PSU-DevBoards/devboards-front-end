import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from './pages/Landing';

function App() {
  return (
    <div className="App" data-testid="app_container">
      <Router>
        <Route path="/" component={Landing} exact />
      </Router>
    </div>
  );
}

export default App;
