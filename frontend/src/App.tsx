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
import { FavouritesPage } from "./features/restaurants/components/pages/FavouritesPage";
import { OrdersPage } from "./features/orders/components/pages/OrdersPage";
import { ManageOrdersPage } from "./features/orders/components/pages/ManageOrdersPage";
import { CourierDeliveriesPage } from "./features/orders/components/pages/CourierDeliveriesPage";
import { CheckoutPage } from "./features/orders/components/pages/CheckoutPage";
import { AdminRoute } from "./features/admin/components/AdminRoute";
import { AdminDashboard } from "./features/admin/components/pages/AdminDashboard";
import { UsersManagementPage } from "./features/admin/components/pages/UsersManagementPage";
import { OrdersManagementPage } from "./features/admin/components/pages/OrdersManagementPage";
import { RestaurantsManagementPage } from "./features/admin/components/pages/RestaurantsManagementPage";
import { ProfilePage } from "./features/home/components/ProfilePage";
import { FavouriteMenusPage } from "./features/restaurants/components/pages/FavouriteMenusPage";

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
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/favourite-menu-items" element={<FavouriteMenusPage />} />
          <Route path="/restaurant/:id" element={<MenuPage />} />
          <Route path="/my-restaurant" element={<MyRestaurantPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/manage-orders" element={<ManageOrdersPage />} />
          <Route path="/deliveries" element={<CourierDeliveriesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrdersManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <AdminRoute>
                <RestaurantsManagementPage />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </NavBarLayout>
    </BrowserRouter>
  );
}

export default App;
