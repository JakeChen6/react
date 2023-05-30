import { useState } from 'react';
import DataFlow from './components/DataFlow';
import './App.css';

function App() {
  const [text, setText] = useState("");

  return (
    <>
      <h2>Indicative Orders List</h2>
      <h4>{text}</h4>
      <DataFlow display={setText} />
    </>
  );
}

export default App;
