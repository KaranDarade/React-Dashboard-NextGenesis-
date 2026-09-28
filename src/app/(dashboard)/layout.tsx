import { DashboardShell } from "@/components/shell/DashboardShell";
import { ProductOverridesProvider } from "@/store/ProductOverridesContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProductOverridesProvider>
      <DashboardShell>{children}</DashboardShell>
    </ProductOverridesProvider>
  );
}
