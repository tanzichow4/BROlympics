import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>BROlympics</h1>
      <button onClick={() => setCount((c) => c + 1)}>Count is {count}</button>
    </main>
  );
}
