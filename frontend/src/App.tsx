import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./features/auth/components/Login";
import { Register } from "./features/auth/components/Register";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { HomePage } from "./features/home/components/HomePage";
import { NavBarLayout } from "./features/navbar/components/NavBarLayout";
import { RestaurantPage } from "./features/restaurants/components/pages/RestaurantPage";
import { MenuPage } from "./features/restaurants/components/pages/MenuPage";
import { MyRestaurantPage } from "./features/restaurants/components/pages/MyRestaurantPage";
import { OrdersPage } from "./features/orders/components/pages/OrdersPage";
import { ManageOrdersPage } from "./features/orders/components/pages/ManageOrdersPage";

function App() {
  return (
    <BrowserRouter>
      <NavBarLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/register/customer"
            element={<RegisterForm userType="customer" />}
          />
          <Route
            path="/register/restaurant"
            element={<RegisterForm userType="restaurant" />}
          />
          <Route
            path="/register/courier"
            element={<RegisterForm userType="courier" />}
          />
          <Route path="/home" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantPage />} />
          <Route path="/restaurant/:id" element={<MenuPage />} />
          <Route path="/my-restaurant" element={<MyRestaurantPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/manage-orders" element={<ManageOrdersPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </NavBarLayout>
    </BrowserRouter>
  );
}

export default App;
