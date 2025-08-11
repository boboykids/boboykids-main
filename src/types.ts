// types.ts
export interface Product {
  id: string;
  name: string;
  type: 'Video Course' | 'eBook' | 'Template' | 'Code Package';
  price: number;
  promo_price: number;
  status: 'completed' | 'in-progress' | 'downloaded' | 'not-started';
  image_url: string;
  slug: string;
  description: string;
  user_product_id?: string;
  link_categories?: any[]
  is_countdown_promotion: boolean;
  promo_end_at?: Date;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}
