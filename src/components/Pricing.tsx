
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";

const Pricing = () => {
  const features = [
    "50+ Template Video HD",
    "100+ Thumbnail Design",
    "Kit Branding Lengkap",
    "File Canva & PowerPoint",
    "Hak Private Label",
    "Panduan Lengkap",
    "Update Gratis Selamanya",
    "Support 24/7"
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-pink-50 to-orange-50 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm mb-6">
            <Star className="w-4 h-4 fill-current" />
            Penawaran Terbatas!
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Investasi Terbaik untuk Bisnis Anda
          </h2>
          <p className="text-xl text-gray-600">
            Sekali beli, untung berkali-kali dengan hak jual ulang penuh
          </p>
        </div>

        <Card className="relative overflow-hidden border-4 border-pink-300 shadow-2xl animate-scale-in">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-center py-3 font-bold">
            🔥 PAKET PALING LARIS - HEMAT 70%
          </div>
          
          <CardContent className="p-8 md:p-12 pt-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  YouTube Kids Channel Builder
                </h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-gray-400 line-through text-2xl">Rp 2.500.000</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">-70%</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                    Rp 199K
                  </div>
                  <p className="text-gray-600 mt-2">Sekali bayar, untung selamanya</p>
                </div>
                
                <Button size="lg" className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-4 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all mb-4">
                  <Zap className="w-6 h-6 mr-2" />
                  PESAN SEKARANG
                </Button>
                
                <p className="text-center text-sm text-gray-500">
                  💳 Pembayaran aman dengan jaminan 30 hari uang kembali
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-6">Yang Kamu Dapatkan:</h4>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-lg text-gray-600 mb-4">
            ⏰ <strong>Penawaran terbatas!</strong> Harga normal Rp 2.500.000
          </p>
          <div className="inline-flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-lg">
            <span className="text-red-500 font-bold">Berakhir dalam:</span>
            <div className="flex gap-2 font-mono font-bold text-xl">
              <span className="bg-red-500 text-white px-2 py-1 rounded">23</span>
              <span>:</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded">59</span>
              <span>:</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded">45</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
