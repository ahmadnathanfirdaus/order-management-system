import { Navigate, Route, Routes } from "react-router-dom";
import MobileLayout from "./layouts/MobileLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Home from "./pages/mobile/Home.jsx";
import ProductDetail from "./pages/mobile/ProductDetail.jsx";
import Cart from "./pages/mobile/Cart.jsx";
import Checkout from "./pages/mobile/Checkout.jsx";
import OrderSuccess from "./pages/mobile/OrderSuccess.jsx";
import Account from "./pages/mobile/Account.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import CatalogList from "./pages/admin/CatalogList.jsx";
import CatalogForm from "./pages/admin/CatalogForm.jsx";
import OrdersList from "./pages/admin/OrdersList.jsx";
import OrderDetail from "./pages/admin/OrderDetail.jsx";
import Settings from "./pages/admin/Settings.jsx";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/mobile/home" replace />}
      />

      <Route path="/mobile/*" element={<MobileLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="account" element={<Account />} />
        <Route
          path="*"
          element={<Navigate to="/mobile/home" replace />}
        />
      </Route>

      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="catalog" element={<CatalogList />} />
        <Route path="catalog/new" element={<CatalogForm />} />
        <Route path="catalog/:id/edit" element={<CatalogForm />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="settings" element={<Settings />} />
        <Route
          path="*"
          element={<Navigate to="/admin/dashboard" replace />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/mobile/home" replace />}
      />
    </Routes>
  );
}

export default App;
