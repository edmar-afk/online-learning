import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login";
import Dashboard from "./routes/Dashboard";
import Welcome from "./routes/Welcome";
import Register from "./routes/Register";
import Lessons from "./routes/Lessons";
import Profile from "./routes/Profile";
import Progress from "./routes/Progress";
function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/lessons" element={<Lessons/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/progress" element={<Progress/>} />

        <Route path="/logout" element={<Logout/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
