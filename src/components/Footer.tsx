import { ONBOARD_URL, PHONE } from "@/constants";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black/20 text-white py-12 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Siap Memulai Mendapat Penghasilan?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Bergabung dengan ribuan creator yang sudah sukses membangun channel YouTube menguntungkan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ONBOARD_URL}>
              <button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-full transition-all transform hover:scale-105">
                Mulai Sekarang
              </button>
            </Link>
            
            <button onClick={() => window.open('https://wa.me/' + PHONE)} className="border-2 border-white hover:bg-white hover:text-gray-800 font-bold px-8 py-3 rounded-full transition-all">
              Hubungi Kami
            </button>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-400">
            <div>
              <p>&copy; 2025 Boboykids</p>
            </div>
            <div className="flex justify-center gap-6">
              <Link className="hover:text-white transition-colors" to="/license">
                Lisensi
              </Link>
              {/* <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a> */}
            </div>
            <div>
              <p>🚀</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
