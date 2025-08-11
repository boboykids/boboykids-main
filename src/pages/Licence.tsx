import React from 'react';
import { CheckCircle, XCircle, Shield, Users, DollarSign, BookOpen } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

const LicensePage = () => {
  const allowedItems = [
    {
      icon: <Users className="w-5 h-5" />,
      text: "Gunakan video untuk membuat konten untuk klien Anda (misalnya, layanan pembuatan video)"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      text: "Monetize video di YouTube, TikTok, atau platform lainnya"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: "Sertakan video tersebut dalam seminar berbayar atau lokakarya komersial Anda"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Gunakan video tersebut sebagai konten komersial untuk klien Anda (misalnya, bagian dari kampanye pemasaran atau materi promosi)"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: "Integrasikan video tersebut ke dalam kursus berbayar, materi pelatihan, atau produk pendidikan Anda sendiri"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      text: "Gunakan video untuk iklan atau kampanye media sosial untuk bisnis atau merek Anda"
    }
  ];

  const prohibitedItems = [
    "Jual kembali video apa adanya atau dalam bentuk apa pun",
    "Berikan video tersebut secara gratis, baik sebagai file mandiri atau dalam bentuk bundel",
    "Berikan file yang dapat diedit (misalnya, templat mentah atau file proyek) kepada klien Anda",
    "Ubah citra atau klaim kepemilikan video sebagai kreasi Anda sendiri",
    "Bagikan atau unggah file video mentah ke perpustakaan stok atau platform distribusi"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <DashboardHeader />
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
              <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Lisensi Anda
            </h1>
            <div className="inline-flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
              <Shield className="w-4 h-4 mr-2" />
              COMMERCIAL LICENSE
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Allowed Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-4 border-b border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />
                <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                  [YA] - DIIZINKAN
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {allowedItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                    <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {item.icon}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prohibited Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-800">
              <div className="flex items-center">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
                <h2 className="text-xl font-bold text-red-800 dark:text-red-200">
                  TIDAK DIPERBOLEHKAN
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {prohibitedItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30">
                    <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Penting untuk Diingat
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Lisensi komersial ini memberikan Anda fleksibilitas untuk menggunakan konten dalam berbagai konteks bisnis. 
              Pastikan untuk selalu mematuhi ketentuan yang tercantum di atas untuk menghindari pelanggaran lisensi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicensePage;