import React, { useState, ReactNode } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Package, 
  Edit3, 
  Mail, 
  Bot, 
  Youtube, 
  Shield,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Custom Accordion Component
interface AccordionProps {
  children: ReactNode;
  type?: "single";
  collapsible?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ children, type = "single", collapsible = true }) => {
  return <div className="w-full">{children}</div>;
};

interface AccordionItemProps {
  value: string;
  children: ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ value, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  return (
    <div className="border-b border-gray-200">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          if (child.type === AccordionTrigger) {
            return React.cloneElement(child, { 
              isOpen, 
              onClick: () => setIsOpen(!isOpen),
              key: index
            } as any);
          }
          if (child.type === AccordionContent) {
            return React.cloneElement(child, { isOpen, key: index } as any);
          }
        }
        return child;
      })}
    </div>
  );
};

interface AccordionTriggerProps {
  children: ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
}

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, isOpen, onClick, className = "" }) => {
  return (
    <button
      className={`flex w-full items-center justify-between py-4 text-left font-medium hover:bg-gray-50 transition-colors ${className}`}
      onClick={onClick}
    >
      <span>{children}</span>
      {isOpen ? (
        <ChevronDown className="h-4 w-4 text-gray-500 transition-transform" />
      ) : (
        <ChevronRight className="h-4 w-4 text-gray-500 transition-transform" />
      )}
    </button>
  );
};

interface AccordionContentProps {
  children: ReactNode;
  isOpen?: boolean;
}

const AccordionContent: React.FC<AccordionContentProps> = ({ children, isOpen }) => {
  return (
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-none pb-4' : 'max-h-0'}`}>
      {isOpen && <div className="pt-0">{children}</div>}
    </div>
  );
};

// Custom Alert Component
interface AlertProps {
  children: ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ children, className = "" }) => {
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );
};

interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = "" }) => {
  return <div className={`text-sm ${className}`}>{children}</div>;
};

// Custom Card Components
interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "" }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
};

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => {
  return <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
};

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = "" }) => {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};

// Custom Badge Component
interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

const Badge: React.FC<BadgeProps> = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    outline: "border border-gray-200 bg-white text-gray-900"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default function BoboyKidsFAQ(): JSX.Element {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-black text-left">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-300">Semua yang perlu Anda ketahui tentang BoboyKids</p>
      </div>

      {/* Main FAQ Sections */}
      <div className="space-y-6">
        
        {/* Basic Information */}
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Package className="h-5 w-5" />
              Informasi Dasar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="what-is-boboykids">
                <AccordionTrigger className="text-left">Apa itu BoboyKids?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed">BoboyKids adalah paket lengkap yang dirancang khusus untuk membantu kamu membuat video anak-anak berkualitas tinggi di YouTube.</p>
                    <p className="text-gray-700 leading-relaxed">Di dalamnya sudah tersedia template video siap pakai, animasi, dan voiceover—cocok untuk pendidik, orang tua, pebisnis digital, dan konten kreator.</p>
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <AlertDescription className="text-yellow-800">
                          BoboyKids adalah koleksi aset & template video, bukan aplikasi, software, atau plugin.
                        </AlertDescription>
                      </div>
                    </Alert>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="package-contents">
                <AccordionTrigger className="text-left">Apa saja isi paket BoboyKids?</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3">
                    {[
                      "Template video yang bisa dikustomisasi sepenuhnya",
                      "Animasi profesional & voiceover siap pakai", 
                      "Koleksi besar aset YouTube",
                      "Background virtual studio",
                      "Lisensi personal dan komersial"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Duplicate Content Warning */}
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-red-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="h-5 w-5" />
              Duplicate Content YouTube
            </CardTitle>
            <CardDescription className="text-red-700">
              Penting! Baca dengan seksama untuk menghindari masalah konten duplikat
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="duplicate-risk">
                <AccordionTrigger className="text-left">Apakah konten dari template ini bisa duplikat?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">Ya, kalau digunakan tanpa modifikasi, konten bisa mirip dengan yang lain dan dianggap duplikat.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="duplicate-consequences">
                <AccordionTrigger className="text-left">Risiko duplikat konten di YouTube apa?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">Bisa bikin video turun peringkat, demonetisasi, atau dihapus.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="avoid-duplicate">
                <AccordionTrigger className="text-left">Bagaimana cara menghindari duplikat?</AccordionTrigger>
                <AccordionContent>
                  <Alert className="border-green-200 bg-green-50">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <AlertDescription className="text-green-800">
                        <strong>Modifikasi cerita:</strong> Ganti nama, latar, dialog, dan tambahkan ide unik.
                      </AlertDescription>
                    </div>
                  </Alert>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="commercial-use">
                <AccordionTrigger className="text-left">Boleh pakai langsung untuk komersial?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">Boleh, tapi disarankan untuk personalisasi agar konten unik dan aman.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="copyright">
                <AccordionTrigger className="text-left">Apakah cerita ini ada hak cipta?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">Cerita kami original dan bebas hak cipta, tapi tetap perlu modifikasi agar unik.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Alert className="mt-4 border-orange-200 bg-orange-50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <AlertDescription className="text-orange-800">
                  <strong>Disclaimer:</strong> Kami tidak bisa menggaransi monetize atau lolos duplicate, karena semua orang bisa memiliki produk ini. Produk ini untuk mempermudah anda membuat konten, sama seperti produk template lainnya.
                </AlertDescription>
              </div>
            </Alert>
          </CardContent>
        </Card>

        {/* License Information */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Shield className="h-5 w-5" />
              Informasi Lisensi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="license-type">
                <AccordionTrigger className="text-left">Jenis lisensi apa yang saya dapatkan?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Personal</Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Commercial</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-gray-700"><strong>Lisensi Personal:</strong> Penggunaan untuk diri sendiri, tidak mendapatkan keuntungan materi apapun.</p>
                      <p className="text-gray-700"><strong>Lisensi Komersial:</strong> Untuk penggunaan yang mendapatkan keuntungan, baik materi atau hal lain.</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Penggunaan Lisensi Komersial:</h4>
                      <div className="grid gap-2 pl-4">
                        <div className="text-gray-700">
                          <strong>Offline Business:</strong> Penawaran kepada instansi/organisasi/perserorangan
                        </div>
                        <div className="text-gray-700">
                          <strong>Sosial Media:</strong> YouTube, Instagram, TikTok/Shorts/Reels, platform lainnya
                        </div>
                        <div className="text-gray-700">
                          <strong>Pembuatan Produk Turunan:</strong> Mencetak desain menjadi produk fisik seperti buku, majalah, souvenir
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="branding-requirement">
                <AccordionTrigger className="text-left text-red-600">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Wajib Ganti Nama Produk
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <Alert className="border-red-200 bg-red-50">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <AlertDescription className="text-red-800">
                        <div className="space-y-2">
                          <p><strong>Anda wajib mengganti nama BoboyKids menjadi brand Anda sendiri.</strong></p>
                          <p><strong>Contoh:</strong> "FunEdu Kids", "SmartPlay Studio", dll.</p>
                          <p>Ini penting untuk menghindari konflik lisensi.</p>
                        </div>
                      </AlertDescription>
                    </div>
                  </Alert>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Technical Information */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Edit3 className="h-5 w-5" />
              Informasi Teknis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="how-to-edit">
                <AccordionTrigger className="text-left">Bagaimana cara edit templatenya?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p className="text-gray-700">Proses editing sangat mudah! Template BoboyKids bisa diedit menggunakan:</p>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Canva</Badge>
                      <Badge className="bg-orange-100 text-orange-800 border border-orange-200">PowerPoint</Badge>
                    </div>
                    <p className="text-gray-700">Kamu juga akan mendapatkan panduan lengkap berupa tutorial langkah demi langkah.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="access-after-purchase">
                <AccordionTrigger className="text-left">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Bagaimana cara mengakses BoboyKids setelah beli?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p className="text-gray-700">Setelah kamu melakukan pembelian, kamu akan menerima email berisi:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🔑</span>
                        <span className="text-gray-700">Link akses ke halaman member area</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💼</span>
                        <span className="text-gray-700">Kamu bisa langsung login dan mulai menggunakan BoboyKids kapan saja</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ai-usage">
                <AccordionTrigger className="text-left">
                  <span className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Tentang Penggunaan AI dalam Produk Ini
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">Kami tetap merangkai template, menambahkan desain dan tidak asal copy-paste.</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <span className="text-2xl">🖼️</span>
                          Gambar/Ilustrasi
                        </h4>
                        <p className="text-gray-700 ml-8">Sebagian gambar dibuat dengan teknologi AI dan yang sudah mendukung lisensi komersial serta distribusi.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <span className="text-2xl">🎤</span>
                          Voice Over (Dubbing)
                        </h4>
                        <div className="ml-8 space-y-1">
                          <p className="text-gray-700"><strong>Bahasa Indonesia:</strong> Manual dengan optimasi AI untuk variasi suara</p>
                          <p className="text-gray-700"><strong>Bahasa Inggris:</strong> Voice over AI berbayar dengan lisensi komersial</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">Lisensi komersial kami memungkinkan redistribusi, jadi produk ini bisa digunakan oleh banyak pengguna secara legal.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="social-media-upload">
                <AccordionTrigger className="text-left">
                  <span className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    Apakah Boleh Diupload ke YouTube atau Media Sosial?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <Alert className="border-green-200 bg-green-50">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <AlertDescription className="text-green-800">
                          <strong>Boleh!</strong> Namun perlu diperhatikan beberapa hal penting.
                        </AlertDescription>
                      </div>
                    </Alert>
                    
                    <div className="space-y-2">
                      <p className="text-gray-700">Beberapa platform mungkin mendeteksi konten duplikat, jadi sebaiknya Anda mengubah narasi atau alur cerita agar lebih unik.</p>
                      <p className="text-gray-700">Produk ini sangat cocok untuk diolah ulang dan disesuaikan dengan gaya penyampaian Anda sendiri.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-gray-300 shadow-lg">
          <CardHeader className="bg-gray-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <AlertTriangle className="h-5 w-5" />
              Disclaimer / Garansi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <AlertDescription className="text-yellow-800">
                    <div className="space-y-2">
                      <p><strong>BoboyKids adalah alat bantu visual edukatif.</strong> Ini bukan program cepat kaya atau penghasil uang instan.</p>
                      <p>Penggunaan logo perusahaan dalam template hanya sebagai contoh desain dan tidak mewakili brand tersebut. Semua hak cipta logo tetap milik masing-masing pemilik brand.</p>
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
              
              <Alert className="border-orange-200 bg-orange-50">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <AlertDescription className="text-orange-800">
                    Kami tidak bisa menggaransi monetize atau lolos duplicate, karena semua orang bisa memiliki produk ini. Produk ini untuk mempermudah anda membuat konten, sama seperti produk template lainnya.
                  </AlertDescription>
                </div>
              </Alert>
              
              <Alert className="border-red-200 bg-red-50">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <AlertDescription className="text-red-800">
                    <strong>NO REFUND. TIDAK ADA REFUND.</strong>
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}