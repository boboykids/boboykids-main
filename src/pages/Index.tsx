
import Hero from "../components/Hero";
import ProductShowcase from "../components/ProductShowcase";
import Features from "../components/Features";
import ProcessSteps from "../components/ProcessSteps";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import DashboardHeader from "@/components/DashboardHeader";
import OrderWarning from "@/components/OrderWarning";
import LandingPage from "@/components/Landing";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-white relative overflow-hidden">
      {/* Background clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-32 right-20 w-24 h-16 bg-white rounded-full opacity-40 animate-float-delayed"></div>
        <div className="absolute top-64 left-1/4 w-28 h-18 bg-white rounded-full opacity-50 animate-float"></div>
        <div className="absolute bottom-32 right-10 w-36 h-24 bg-white rounded-full opacity-45 animate-float-delayed"></div>
        <div className="absolute bottom-64 left-16 w-20 h-14 bg-white rounded-full opacity-35 animate-float"></div>
      </div>
      <div className="fixed top-0 w-full z-50">
        <DashboardHeader />
        <OrderWarning />
      </div>
        <LandingPage />
    </div>
  );
};

export default Index;
