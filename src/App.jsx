import { useState } from "react";
import Catalog from "./components/catalog";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Catalog></Catalog>
    </>
  );
}

export default App;
