
import { Card, CardContent } from "@/components/ui/card";

const ProductShowcase = () => {
  const products = [
    {
      title: "AYO, LUAT SESUATU YANG KEREN!",
      category: "Template Video",
      image: "🎮",
      color: "from-green-400 to-blue-500"
    },
    {
      title: "WAKTU BERCERITA",
      category: "Story Template",
      image: "📚",
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Di Percobaan Sains!",
      category: "Science Series",
      image: "🔬",
      color: "from-blue-400 to-purple-500"
    },
    {
      title: "TANTANGAN PALING SERU",
      category: "Challenge Video",
      image: "🏆",
      color: "from-orange-400 to-red-500"
    },
    {
      title: "KUIS KEREN UNTUK YOUTUBE KIDS",
      category: "Quiz Template",
      image: "🧠",
      color: "from-purple-400 to-pink-500"
    },
    {
      title: "BERMAIN & BELAJAR",
      category: "Educational",
      image: "🎓",
      color: "from-teal-400 to-green-500"
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Lihat Apa Yang Kamu Dapatkan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Koleksi lengkap template video, thumbnail, dan branding kit yang siap pakai untuk channel YouTube Kids yang profesional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${product.color} h-48 flex items-center justify-center relative overflow-hidden`}>
                  <div className="text-6xl">{product.image}</div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-bold text-gray-800">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-pink-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mt-2">Template siap pakai dengan kualitas HD</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
