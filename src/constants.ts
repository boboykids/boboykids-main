// constants.ts
import { Play, BookOpen, Code, Layout } from 'lucide-react';
import { User, Product } from './types';

export const CURRENT_USER: User = {
  name: "Andi Pratama",
  email: "andi.pratama@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
};

export const MOCK_PRODUCTS: Product[] = [

];

export const STATUS_CONFIG = {
  'completed': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'Selesai' },
  'in-progress': { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Sedang Berjalan' },
  'downloaded': { color: 'bg-purple-100 text-purple-800 border-purple-200', text: 'Diunduh' },
  'not-started': { color: 'bg-slate-100 text-slate-800 border-slate-200', text: 'Belum Dibeli' }
};

export const TYPE_ICONS = {
  'Video Course': Play,
  'eBook': BookOpen,
  'Template': Layout,
  'Code Package': Code
};

export const FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Tipe' },
  { value: 'video', label: 'Video Course' },
  { value: 'ebook', label: 'eBook' },
  { value: 'template', label: 'Template' },
  { value: 'code', label: 'Code Package' }
];

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Terbaru' },
  { value: 'name', label: 'Nama A-Z' },
  { value: 'progress', label: 'Progress' }
];

export const ONBOARD_URL = `/register`;
export const PHONE = '6285121137723';