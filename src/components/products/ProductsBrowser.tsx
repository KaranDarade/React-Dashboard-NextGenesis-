"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FilterChips, type FilterChip } from "@/components/products/FilterChips";
import { Pagination } from "@/components/products/Pagination";
import { ProductGrid } from "@/components/products/ProductGrid";
import {
  ProductToolbar,
  type ProductView,
} from "@/components/products/ProductToolbar";
import { ProductTable } from "@/components/products/ProductTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassCard } from "@/components/ui/GlassCard";
import { Spinner } from "@/components/ui/Spinner";
import { PlusIcon } from "@/components/shell/icons";
import { useDebounce } from "@/hooks/useDebounce";
import { usePersistedString } from "@/hooks/usePersistedString";
import { useProducts } from "@/hooks/useProducts";
import { deleteProduct } from "@/lib/api/products";
import {
  DEBOUNCE_MS,
  SORT_OPTIONS,
  STORAGE_KEYS,
} from "@/lib/constants";
import { decorateList, filterCreated, isLocalId } from "@/lib/overrides";
import {
  buildListQuery,
  parseListQuery,
  parseSortValue,
  sortValue,
  type ListQuery,
} from "@/lib/search-params";
import {
  useDashboardActivity,
  useDashboardData,
} from "@/store/DashboardDataContext";
import { useProductOverrides } from "@/store/ProductOverridesContext";
import type { Product } from "@/types/product";

export function ProductsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => parseListQuery(searchParams), [searchParams]);

  const debouncedQ = useDebounce(query.q, DEBOUNCE_MS);
  const fetchQuery = useMemo<ListQuery>(
    () => ({ ...query, q: query.q === "" ? "" : debouncedQ }),
    [query, debouncedQ],
  );

  const { data, loading, error, retry } = useProducts(fetchQuery);
  const {
    categories,
    loading: catalogLoading,
    error: catalogError,
    refresh: refreshCatalog,
    statusOf,
  } = useDashboardData();
  const { state, deleteLocal } = useProductOverrides();
  const { log } = useDashboardActivity();
  const [view, setView] = usePersistedString(
    STORAGE_KEYS.productView,
    "table",
  );

  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const lastLoggedQuery = useRef("");

  const replaceQuery = useCallback(
    (patch: Partial<ListQuery>) => {
      const next: ListQuery = { ...query, ...patch };
      const queryString = buildListQuery(next);
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [query, pathname, router],
  );

  const remoteProducts = useMemo(
    () => decorateList(data?.products ?? [], state),
    [data, state],
  );
  const localProducts = useMemo(
    () => filterCreated(state.created, fetchQuery),
    [state.created, fetchQuery],
  );

  const onFirstPage = query.page === 1;
  const products = onFirstPage
    ? [...localProducts, ...remoteProducts]
    : remoteProducts;

  const deletedRemote = state.deleted.filter((id) => !isLocalId(id)).length;
  const adjustedTotal = Math.max(
    0,
    (data?.total ?? 0) - deletedRemote + localProducts.length,
  );

  useEffect(() => {
    if (loading || error || !data) return;
    if (adjustedTotal <= 0) return;
    const totalPages = Math.max(1, Math.ceil(adjustedTotal / query.limit));
    if (query.page > totalPages) {
      replaceQuery({ page: totalPages });
    }
  }, [
    loading,
    error,
    data,
    adjustedTotal,
    query.page,
    query.limit,
    replaceQuery,
  ]);

  useEffect(() => {
    if (fetchQuery.q && fetchQuery.q !== lastLoggedQuery.current) {
      lastLoggedQuery.current = fetchQuery.q;
      log({ action: "Searched products", detail: `"${fetchQuery.q}"` });
    }
  }, [fetchQuery.q, log]);

  const handleSearch = (value: string) =>
    replaceQuery({ q: value, category: "", page: 1 });

  const handleCategory = (value: string) => {
    if (value) {
      const name =
        categories.find((item) => item.slug === value)?.name ?? value;
      log({ action: "Filtered by category", detail: name });
    }
    replaceQuery({ category: value, q: "", page: 1 });
  };

  const handleSort = (value: string) => {
    const { sortBy, order } = parseSortValue(value);
    if (sortBy) {
      log({
        action: "Sorted products",
        detail: `${sortBy} (${order === "desc" ? "high to low" : "low to high"})`,
      });
    }
    replaceQuery({ sortBy, order, page: 1 });
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      if (!isLocalId(pendingDelete.id)) {
        await deleteProduct(pendingDelete.id);
      }
    } catch {
      // DummyJSON does not persist deletes - keep the local change.
    } finally {
      log({
        action: "Deleted product",
        detail: pendingDelete.title,
        status: "warning",
      });
      deleteLocal(pendingDelete.id);
      setPendingDelete(null);
      setDeleting(false);
    }
  };

  const chips = useMemo<FilterChip[]>(() => {
    const list: FilterChip[] = [];
    if (query.q) {
      list.push({
        key: "q",
        label: `Search: "${query.q}"`,
        onRemove: () => replaceQuery({ q: "", page: 1 }),
      });
    }
    if (query.category) {
      const name =
        categories.find((item) => item.slug === query.category)?.name ??
        query.category;
      list.push({
        key: "category",
        label: `Category: ${name}`,
        onRemove: () => replaceQuery({ category: "", page: 1 }),
      });
    }
    if (query.sortBy) {
      const value = sortValue(query.sortBy, query.order);
      const label =
        SORT_OPTIONS.find((option) => option.value === value)?.label ??
        query.sortBy;
      list.push({
        key: "sort",
        label: label.replace("Sort: ", ""),
        onRemove: () => replaceQuery({ sortBy: "", order: "asc", page: 1 }),
      });
    }
    return list;
  }, [query, categories, replaceQuery]);

  const showEmpty = !loading && !error && products.length === 0;
  const showData = !loading && !error && products.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-fg">
            Products
          </h2>
          <p className="mt-0.5 text-sm text-fg-2">
            Manage your product catalog.
          </p>
        </div>
        <Link
          href="/products/new"
          className="focus-brand inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-sm font-medium text-brand-darker transition hover:bg-brand-bright"
        >
          <PlusIcon className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <ProductToolbar
        search={query.q}
        onSearch={handleSearch}
        searchLoading={loading}
        categories={categories}
        categoriesLoading={catalogLoading}
        categoriesError={catalogError}
        onRetryCategories={refreshCatalog}
        category={query.category}
        onCategory={handleCategory}
        sort={sortValue(query.sortBy, query.order)}
        onSort={handleSort}
        limit={query.limit}
        onLimit={(limit) => replaceQuery({ limit, page: 1 })}
        view={view as ProductView}
        onViewChange={(next) => setView(next)}
      />

      <FilterChips chips={chips} />

      {query.q && !loading && !error ? (
        <p className="text-xs text-fg-3">
          Search results for{" "}
          <span className="text-fg-2">“{query.q}”</span> · {adjustedTotal}{" "}
          products
        </p>
      ) : null}

      {loading ? <Spinner label="Loading products..." /> : null}
      {error ? <ErrorState message={error} onRetry={retry} /> : null}

      {showEmpty ? (
        <EmptyState
          title="No products found"
          description="Try changing your search or filters."
          action={
            <button
              type="button"
              onClick={() =>
                replaceQuery({
                  q: "",
                  category: "",
                  sortBy: "",
                  order: "asc",
                  page: 1,
                })
              }
              className="focus-brand rounded-xl border border-line px-4 py-2 text-sm font-medium text-fg-2 transition hover:bg-white/[0.05] hover:text-fg"
            >
              Clear filters
            </button>
          }
        />
      ) : null}

      {showData ? (
        <>
          <div className="glass hidden rounded-2xl md:block">
            {view === "table" ? (
              <ProductTable
                products={products}
                statusOf={statusOf}
                onDelete={setPendingDelete}
              />
            ) : (
              <div className="p-3">
                <ProductGrid
                  products={products}
                  statusOf={statusOf}
                  onDelete={setPendingDelete}
                />
              </div>
            )}
          </div>

          <div className="md:hidden">
            <ProductGrid
              products={products}
              statusOf={statusOf}
              onDelete={setPendingDelete}
            />
          </div>

          <GlassCard className="p-4">
            <Pagination
              page={query.page}
              limit={query.limit}
              total={adjustedTotal}
              onPageChange={(page) => replaceQuery({ page })}
              onLimitChange={(limit) => replaceQuery({ limit, page: 1 })}
            />
          </GlassCard>
        </>
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete product?"
        message={
          pendingDelete
            ? `This will remove "${pendingDelete.title}" from the current catalog. Changes are stored in this browser only.`
            : ""
        }
        confirmLabel="Delete Product"
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) setPendingDelete(null);
        }}
      />
    </div>
  );
}
