"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FilterSort } from "@/components/products/FilterSort";
import { Pagination } from "@/components/products/Pagination";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductTable } from "@/components/products/ProductTable";
import { SearchBar } from "@/components/products/SearchBar";
import { PlusIcon } from "@/components/shell/icons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassCard } from "@/components/ui/GlassCard";
import { Spinner } from "@/components/ui/Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import { deleteProduct } from "@/lib/api/products";
import { DEBOUNCE_MS } from "@/lib/constants";
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
  } = useDashboardData();
  const { state, deleteLocal } = useProductOverrides();
  const { log } = useDashboardActivity();

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

  const showEmpty = !loading && !error && products.length === 0;
  const showData = !loading && !error && products.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-ink-900">
            Products
          </h2>
          <p className="mt-0.5 text-sm text-ink-500">
            {adjustedTotal.toLocaleString()} products in the catalogue.
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 px-3.5 py-2 text-sm font-medium text-white shadow-[0_10px_24px_-12px_rgba(79,70,229,0.9)] transition hover:-translate-y-0.5 sm:hidden"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Link>
      </div>

      <GlassCard className="flex flex-col gap-4 p-4">
        <SearchBar value={query.q} onChange={handleSearch} loading={loading} />
        <FilterSort
          categories={categories}
          category={query.category}
          onCategoryChange={handleCategory}
          sort={sortValue(query.sortBy, query.order)}
          onSortChange={handleSort}
          loading={catalogLoading}
          error={catalogError}
          onRetry={refreshCatalog}
        />
        {query.q ? (
          <p className="text-xs text-ink-500">
            Category filtering is paused while searching: the API cannot search
            and filter by category at the same time.
          </p>
        ) : null}
      </GlassCard>

      {loading ? <Spinner label="Loading products..." /> : null}
      {error ? <ErrorState message={error} onRetry={retry} /> : null}
      {showEmpty ? (
        <EmptyState
          title="No products found"
          description="Try a different search term or clear the filters."
          action={
            query.q || query.category || query.sortBy ? (
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
                className="rounded-xl border border-white/60 bg-white/60 px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-white/90"
              >
                Clear filters
              </button>
            ) : null
          }
        />
      ) : null}

      {showData ? (
        <>
          <ProductTable products={products} onDelete={setPendingDelete} />
          <ProductGrid products={products} onDelete={setPendingDelete} />
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
        title="Delete product"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.title}"? This cannot be undone.`
            : ""
        }
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) setPendingDelete(null);
        }}
      />
    </div>
  );
}
