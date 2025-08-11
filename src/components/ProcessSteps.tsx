
import { Card, CardContent } from "@/components/ui/card";
import { Download, Palette, DollarSign } from "lucide-react";

const ProcessSteps = () => {
  const steps = [
    {
      number: "LANGKAH 1",
      title: "Akses",
      description: "Dapatkan akses instan ke TubeKids, YouTube Kids Channel Builder terbaik yang isinya penuh template video, aset, thumbnail, kit branding, animasi, dan banyak lagi.",
      icon: Download,
      color: "from-blue-400 to-purple-500",
      image: "💻"
    },
    {
      number: "LANGKAH 2", 
      title: "Rebrand",
      description: "Kustomisasi template dan aset dengan branding kamu pakai tool editing yang gampang—gak perlu skill canggih. Tambahin nama kamu, utak-atik desainnya, dan bikin jadi milikmu sendiri.",
      icon: Palette,
      color: "from-green-400 to-blue-500",
      image: "🎨"
    },
    {
      number: "LANGKAH 3",
      title: "Cuan",
      description: "Jual template dan aset channel YouTube Anak yang sudah full branded dengan Hak Private Label (PLR) dan nikmati 100% keuntungannya.",
      icon: DollarSign,
      color: "from-yellow-400 to-green-500",
      image: "💰"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            3 Langkah Mudah Menuju Sukses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dari akses hingga cuan, ikuti 3 langkah sederhana ini untuk memulai bisnis YouTube Kids channel yang menguntungkan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 200}ms` }}>
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${step.color} h-64 flex flex-col items-center justify-center relative overflow-hidden`}>
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {step.number}
                    </div>
                    <div className="text-6xl mb-4">{step.image}</div>
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-lg">
            <span className="text-2xl">🚀</span>
            <span className="text-lg font-bold text-gray-800">
              Mulai perjalanan sukses Anda hari ini!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
