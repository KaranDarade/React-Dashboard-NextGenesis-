"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterSort } from "@/components/products/FilterSort";
import { Pagination } from "@/components/products/Pagination";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductTable } from "@/components/products/ProductTable";
import { SearchBar } from "@/components/products/SearchBar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Spinner } from "@/components/ui/Spinner";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import { deleteProduct } from "@/lib/api/products";
import { DEBOUNCE_MS } from "@/lib/constants";
import {
  decorateList,
  filterCreated,
  isLocalId,
} from "@/lib/overrides";
import {
  buildListQuery,
  parseListQuery,
  parseSortValue,
  sortValue,
  type ListQuery,
} from "@/lib/search-params";
import { useProductOverrides } from "@/store/ProductOverridesContext";
import type { Product } from "@/types/product";

export function ProductsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => parseListQuery(searchParams), [searchParams]);

  // The URL keeps the live search term, but requests are debounced so we do not
  // call the API on every keystroke.
  const debouncedQ = useDebounce(query.q, DEBOUNCE_MS);
  const fetchQuery = useMemo<ListQuery>(
    // If the search was cleared (e.g. by picking a category) do not let the
    // still-debouncing term fire one last stale request.
    () => ({ ...query, q: query.q === "" ? "" : debouncedQ }),
    [query, debouncedQ],
  );

  const {
    data,
    loading,
    error,
    retry,
  } = useProducts(fetchQuery);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    retry: retryCategories,
  } = useCategories();
  const { state, deleteLocal } = useProductOverrides();

  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const replaceQuery = useCallback(
    (patch: Partial<ListQuery>) => {
      const next: ListQuery = { ...query, ...patch };
      const queryString = buildListQuery(next);
      router.replace(
        queryString ? `${pathname}?${queryString}` : pathname,
        { scroll: false },
      );
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

  // Clamp out-of-range pages (?page=999) once we know the real total.
  useEffect(() => {
    if (loading || error || !data) return;
    if (adjustedTotal <= 0) return;
    const totalPages = Math.max(1, Math.ceil(adjustedTotal / query.limit));
    if (query.page > totalPages) {
      replaceQuery({ page: totalPages });
    }
  }, [loading, error, data, adjustedTotal, query.page, query.limit, replaceQuery]);

  const handleSearch = (value: string) =>
    replaceQuery({ q: value, category: "", page: 1 });

  const handleCategory = (value: string) =>
    replaceQuery({ category: value, q: "", page: 1 });

  const handleSort = (value: string) => {
    const { sortBy, order } = parseSortValue(value);
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
      // DummyJSON does not persist deletes anyway - continue with the local
      // change so the UI stays consistent.
    } finally {
      deleteLocal(pendingDelete.id);
      setPendingDelete(null);
      setDeleting(false);
    }
  };

  const showEmpty = !loading && !error && products.length === 0;
  const showData = !loading && !error && products.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">
            Browse, search and manage the DummyJSON catalogue.
          </p>
        </div>
        <Link
          href="/products/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Add product
        </Link>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <SearchBar value={query.q} onChange={handleSearch} loading={loading} />
        <FilterSort
          categories={categories}
          category={query.category}
          onCategoryChange={handleCategory}
          sort={sortValue(query.sortBy, query.order)}
          onSortChange={handleSort}
          loading={categoriesLoading}
          error={categoriesError}
          onRetry={retryCategories}
        />
        {query.q ? (
          <p className="text-xs text-slate-500">
            Category filtering is turned off while searching: the API cannot
            search and filter by category at the same time.
          </p>
        ) : null}
      </div>

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
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
          <Pagination
            page={query.page}
            limit={query.limit}
            total={adjustedTotal}
            onPageChange={(page) => replaceQuery({ page })}
            onLimitChange={(limit) => replaceQuery({ limit, page: 1 })}
          />
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
