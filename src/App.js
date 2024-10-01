import "./App.css";
import { Routes, Route } from "react-router-dom";
import Data from "./page/Data/Data";
import Home from "./page/Home/Home";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<Data />} />
      </Routes>
    </>
  );
}
export default App;
