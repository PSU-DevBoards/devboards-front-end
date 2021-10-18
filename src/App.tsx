import './styles/App.css';
import SiteRouter from './navigation/SiteRouter';

function App() {
  return (
    <div className="App" data-testid="app_container">
      <SiteRouter />
    </div>
  );
}
export default App;
