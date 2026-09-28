"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { OVERRIDES_STORAGE_KEY } from "@/lib/constants";
import {
  emptyOverrides,
  keyOf,
  type OverridesState,
} from "@/lib/overrides";
import type { Product } from "@/types/product";

type Action =
  | { type: "hydrate"; state: OverridesState }
  | { type: "add"; product: Product }
  | { type: "update"; id: Product["id"]; patch: Partial<Product> }
  | { type: "delete"; id: Product["id"] };

function reducer(state: OverridesState, action: Action): OverridesState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const id = keyOf(action.product.id);
      return {
        created: [action.product, ...state.created.filter((p) => keyOf(p.id) !== id)],
        updates: state.updates,
        deleted: state.deleted.filter((entry) => entry !== id),
      };
    }
    case "update": {
      const id = keyOf(action.id);
      const existsLocally = state.created.some((p) => keyOf(p.id) === id);
      if (existsLocally) {
        return {
          ...state,
          created: state.created.map((p) =>
            keyOf(p.id) === id ? { ...p, ...action.patch } : p,
          ),
        };
      }
      return {
        ...state,
        updates: {
          ...state.updates,
          [id]: { ...state.updates[id], ...action.patch },
        },
        deleted: state.deleted.filter((entry) => entry !== id),
      };
    }
    case "delete": {
      const id = keyOf(action.id);
      const { [id]: _removed, ...restUpdates } = state.updates;
      void _removed;
      return {
        created: state.created.filter((p) => keyOf(p.id) !== id),
        updates: restUpdates,
        deleted: state.deleted.includes(id)
          ? state.deleted
          : [...state.deleted, id],
      };
    }
    default:
      return state;
  }
}

interface ProductOverridesValue {
  state: OverridesState;
  addLocal: (product: Product) => void;
  updateLocal: (id: Product["id"], patch: Partial<Product>) => void;
  deleteLocal: (id: Product["id"]) => void;
}

const ProductOverridesContext = createContext<ProductOverridesValue | null>(
  null,
);

function readStoredState(): OverridesState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(OVERRIDES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OverridesState>;
    return {
      created: Array.isArray(parsed.created) ? parsed.created : [],
      updates:
        parsed.updates && typeof parsed.updates === "object"
          ? parsed.updates
          : {},
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
    };
  } catch {
    return null;
  }
}

export function ProductOverridesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, emptyOverrides);
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readStoredState();
    if (stored) dispatch({ type: "hydrate", state: stored });
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode errors */
    }
  }, [state]);

  const addLocal = useCallback(
    (product: Product) => dispatch({ type: "add", product }),
    [],
  );
  const updateLocal = useCallback(
    (id: Product["id"], patch: Partial<Product>) =>
      dispatch({ type: "update", id, patch }),
    [],
  );
  const deleteLocal = useCallback(
    (id: Product["id"]) => dispatch({ type: "delete", id }),
    [],
  );

  const value = useMemo<ProductOverridesValue>(
    () => ({ state, addLocal, updateLocal, deleteLocal }),
    [state, addLocal, updateLocal, deleteLocal],
  );

  return (
    <ProductOverridesContext.Provider value={value}>
      {children}
    </ProductOverridesContext.Provider>
  );
}

export function useProductOverrides(): ProductOverridesValue {
  const context = useContext(ProductOverridesContext);
  if (!context) {
    throw new Error(
      "useProductOverrides must be used inside a ProductOverridesProvider",
    );
  }
  return context;
}
