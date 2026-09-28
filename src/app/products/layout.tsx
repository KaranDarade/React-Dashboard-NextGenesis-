import { DemoBanner } from "@/components/layout/DemoBanner";
import { Header } from "@/components/layout/Header";
import { ProductOverridesProvider } from "@/store/ProductOverridesContext";

export default function ProductsLayout({ children }: LayoutProps<"/products">) {
  return (
    <ProductOverridesProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <DemoBanner />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          {children}
        </main>
      </div>
    </ProductOverridesProvider>
  );
}
