import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Dashboard";
import Clients from "./Clients";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/clients/:id" element={<Clients />} />
      </Routes>
    </Router>
  );
};

export default App;