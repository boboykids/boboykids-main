import useProductQuery from "@/hooks/useProductQuery"
import ProductCard from "./ProductCard";

export default function Products() {

  const { data } = useProductQuery();
  const products = data || [];
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}