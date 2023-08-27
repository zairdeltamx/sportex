import React, { useState } from 'react';

const Counter = () => {
  const [Counter, setCounter] = useState(0);
  return (
    <div>
      <h1>{Counter}</h1>
      <button onClick={() => setCounter(Counter + 1)}></button>
    </div>
  );
};

export default Counter;
