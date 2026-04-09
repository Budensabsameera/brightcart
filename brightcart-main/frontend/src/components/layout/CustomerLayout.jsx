import { Outlet } from "react-router-dom";
import Toast from "../common/Toast";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Footer from "./Footer";
import Navbar from "./Navbar";

function CustomerLayout() {
  const { toast } = useCart();
  const { authNotice } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container page-transition">
        <Outlet />
      </main>
      <Toast message={authNotice?.message ?? toast?.message} />
      <Footer />
    </div>
  );
}

export default CustomerLayout;
