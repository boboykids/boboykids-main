
import { Button } from "@/components/ui/button";
import { ONBOARD_URL } from "@/constants";
import { Play, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm">
            <Star className="w-4 h-4 fill-current" />
            Paket Terlengkap #1
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="text-gray-800">Bangun Channel</span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              YouTube Kids
            </span>
            <br />
            <span className="text-gray-800">yang Viral!</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Paket all-in-one berisi template video, thumbnail, kit branding, dan lainnya.
            Semua yang kamu butuhkan untuk bikin dan jual channel anak full branded.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to={ONBOARD_URL}>
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <Play className="w-5 h-5 mr-2" />
                Dapatkan Sekarang
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-pink-500 font-bold px-8 py-4 rounded-full text-lg">
              Lihat Preview
            </Button>
          </div>

          <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Hak Private Label
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Bebas Rebrand
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              100% Keuntungan
            </div>
          </div>
        </div>

        {/* Right Content - Character */}
        <div className="relative flex justify-center animate-scale-in">
          <div className="relative">
            {/* Main character placeholder */}
            <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <div className="text-6xl lg:text-8xl">👨‍💻</div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-bounce">
              🎬
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-bounce delay-300">
              📱
            </div>
            <div className="absolute top-1/2 -left-8 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg animate-pulse">
              ⭐
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
