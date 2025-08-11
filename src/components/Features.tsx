
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Palette, Video, Crown, Zap, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "100% Bisa Diedit di Canva!",
      description: "Kustomisasi Mudah, Bisa disesuaikan dengan canva, Video, thumbnail, branding dan banyak lagi tanpa perlu skill desain.",
      color: "text-blue-500"
    },
    {
      icon: Video,
      title: "Template Video Siap Pakai",
      description: "Bikin konten anak yang seru dan berkualitas dalam hitungan menit!",
      color: "text-pink-500"
    },
    {
      icon: Palette,
      title: "Thumbnail YouTube & Shorts yang Eye-Catching",
      description: "Desain yang bikin mata langsung tertarik!",
      color: "text-yellow-500"
    },
    {
      icon: Crown,
      title: "Branding Kit Lengkap",
      description: "Channel art, logo, end screen, dan animasi subscribe, semua untuk bangun brand yang profesional.",
      color: "text-green-500"
    },
    {
      icon: Zap,
      title: "Lower Thirds & Logo Opener Animasi",
      description: "Tampilkan nama dan identitas channel dengan animasi yang keren dan halus.",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Paket Voiceover Anak",
      description: "Voiceover seru dan ramah anak yang sudah siap dipakai!",
      color: "text-orange-500"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Kenapa Pilih Paket Ini?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan kepemilikan penuh dengan Hak Private Label, bebas rebrand, jual ulang, dan nikmati 100% keuntungan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-pink-200 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
