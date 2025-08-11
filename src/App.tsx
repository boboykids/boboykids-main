import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserProduct from "./pages/UserProduct";
import ChangePasswordPage from "./pages/ChangePassword";
import ProductPage from "./pages/Product";
import LicensePage from "./pages/Licence";
import ProductList from "./pages/Admin/ProductList";
import ProductDetail from "./pages/Admin/ProductDetail";
import OrderListPage from "./pages/Admin/OrderList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-product" element={<UserProduct />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/kode-21" element={<ProductList />} />
          <Route path="/admin/product/:id" element={<ProductDetail />} />
          <Route path="/admin/order" element={<OrderListPage />} />
          <Route path="/license" element={<LicensePage />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
