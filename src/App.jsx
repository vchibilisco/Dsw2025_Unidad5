import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const Incrementar = () => {
    setCount(count + 1);
  };

  const Decrementar = () => {
    setCount(count - 1);
  };

  return (
    <>
      <div className="App">
        <h1>Contador: {count}</h1>
        <button onClick={Incrementar}>Incrementar</button>
        <button onClick={Decrementar}>Decrementar</button>
      </div>

    </>
  );
}

export default App;
