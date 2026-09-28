import { ProductDetail } from "@/components/products/ProductDetail";

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
