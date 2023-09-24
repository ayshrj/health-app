import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import FoodEatenPage from "./pages/FoodEatenPage/FoodEatenPage";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/FoodEatenPage" element={<FoodEatenPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
