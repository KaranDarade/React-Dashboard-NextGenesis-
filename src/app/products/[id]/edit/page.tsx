import { EditProductForm } from "@/components/products/EditProductForm";

export default async function EditProductPage({
  params,
}: PageProps<"/products/[id]/edit">) {
  const { id } = await params;
  return <EditProductForm id={id} />;
}
