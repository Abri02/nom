import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./features/auth/Login";
import { Register } from "./features/auth/Register";
import { RegisterForm } from "./features/auth/RegisterForm";

function App() {
  return (
    <BrowserRouter>
      
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/customer" element={<RegisterForm userType="customer" />} />
          <Route path="/register/restaurant" element={<RegisterForm userType="restaurant" />} />
          <Route path="/register/courier" element={<RegisterForm userType="courier" />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;