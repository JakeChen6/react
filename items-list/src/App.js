import './App.css';
import Discovery from './components/Discovery';
import DataFlow from './components/DataFlow';

const isDiscovery = window.location.pathname.replace(/\//g, '') === 'discovery';

function App() {
  if (isDiscovery) {
    return <Discovery />;
  }
  return (
    <div className="App">
      <h2>Indicative Orders List</h2>
      <DataFlow />
    </div>
  );
}

export default App;
