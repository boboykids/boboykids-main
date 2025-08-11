import React, { useState, useEffect } from 'react';
import { ArrowRight, DollarSign, TrendingUp, Users, Star, CheckCircle, Play, Zap, Target, Award, Clock, Shield } from 'lucide-react';
import Footer from './Footer';
import Products from './Products';
import { Link } from 'react-router-dom';
import { ONBOARD_URL } from '@/constants';
import BoboyKidsFAQ from './FAQ';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Download Langsung",
      description: "Ribuan template siap download tanpa perlu menunggu. Edit dan gunakan dalam hitungan menit"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Terbukti Menghasilkan",
      description: "Template yang sudah terbukti digunakan oleh ribuan orang untuk menghasilkan uang online"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Mudah Digunakan",
      description: "Tidak perlu skill design atau coding. Tinggal edit nama, logo, dan langsung bisa dipakai"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Update Berkala",
      description: "Setiap minggu ada template baru sesuai trend terkini untuk menjaga bisnis Anda tetap fresh"
    }
  ];

  const scrollToProducts = () => {
    const productsSection = document.querySelector('#products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden pt-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-10 animate-spin slow-spin"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-sm font-semibold text-black animate-bounce">
            🚀 Platform untuk Menghasilkan Uang Online
          </div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Kumpulan Produk
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Digital Penghasil Uang
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Raih <span className="text-yellow-400 font-bold">penghasilan tambahan</span> tiap bulan dengan template siap pakai dan tools praktis untuk berbagai bisnis online
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to={ONBOARD_URL}>
              <button className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center">
                Mulai Sekarang
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button 
              onClick={scrollToProducts}
              className="group border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 backdrop-blur-sm flex items-center"
            >
              <Play className="mr-2 h-5 w-5" />
              Lihat Produk
            </button>
          </div>

          {/* YouTube Video Preview */}
          <div className=" mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 md:p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Lihat Cara Kerjanya
                  </span>
                </h3>
                <p className="text-gray-300">
                  Pelajari bagaimana template kami dapat membantu Anda menghasilkan uang online dalam hitungan menit
                </p>
              </div>
              
              <div className="relative rounded-xl overflow-hidden shadow-2xl group">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/L_2qs9ybGLk?si=2744Zh6pA6RyewLd&rel=0&modestbranding=1&showinfo=0"
                    title="Preview Video - Template Penghasil Uang"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>                
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
                Kenapa Pilih Template Kami?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Template dan tools siap pakai yang langsung bisa digunakan untuk memulai bisnis online Anda hari ini
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:bg-white/15">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Template Siap Pakai
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Koleksi lengkap template dan tools yang bisa langsung digunakan untuk berbagai jenis bisnis online
            </p>
          </div>

          <Products />
        </div>
      </section>

      <section className='relative z-10 '>
          <BoboyKidsFAQ />

        <Footer />

      </section>

      <style>{`
        .slow-spin {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;