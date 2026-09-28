"use client";

import { useState } from "react";
import { cn } from "@/lib/format";
import type { Category, ProductInput } from "@/types/product";

interface FormValues {
  title: string;
  brand: string;
  category: string;
  price: string;
  stock: string;
  rating: string;
  description: string;
  thumbnail: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

function toFormValues(input?: Partial<ProductInput>): FormValues {
  return {
    title: input?.title ?? "",
    brand: input?.brand ?? "",
    category: input?.category ?? "",
    price: input?.price !== undefined ? String(input.price) : "",
    stock: input?.stock !== undefined ? String(input.stock) : "",
    rating: input?.rating !== undefined ? String(input.rating) : "",
    description: input?.description ?? "",
    thumbnail: input?.thumbnail ?? "",
  };
}

function validate(values: FormValues): {
  errors: FormErrors;
  input?: ProductInput;
} {
  const errors: FormErrors = {};

  if (values.title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters.";
  }
  if (!values.category.trim()) {
    errors.category = "Category is required.";
  }
  if (values.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  const price = Number(values.price);
  if (!values.price.trim() || !Number.isFinite(price) || price <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  const stock = Number(values.stock);
  if (!values.stock.trim() || !Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number (0 or more).";
  }

  const rating = Number(values.rating);
  if (!values.rating.trim() || !Number.isFinite(rating) || rating < 0 || rating > 5) {
    errors.rating = "Rating must be between 0 and 5.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors,
    input: {
      title: values.title.trim(),
      brand: values.brand.trim() || undefined,
      category: values.category.trim(),
      price,
      stock,
      rating,
      description: values.description.trim(),
      thumbnail: values.thumbnail.trim() || undefined,
    },
  };
}

const fieldClass =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2";
const fieldOk = "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200";
const fieldBad = "border-red-400 focus:border-red-500 focus:ring-red-200";

export function ProductForm({
  initialValues,
  categories = [],
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: {
  initialValues?: Partial<ProductInput>;
  categories?: Category[];
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: ProductInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(initialValues),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (field: keyof FormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const { errors: nextErrors, input } = validate(values);
    setErrors(nextErrors);
    if (!input) return;
    onSubmit(input);
  };

  const renderError = (field: keyof FormValues) =>
    errors[field] ? (
      <span className="text-xs text-red-600">{errors[field]}</span>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid grid-cols-1 gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Title</span>
        <input
          value={values.title}
          onChange={(event) => setField("title", event.target.value)}
          className={cn(fieldClass, errors.title ? fieldBad : fieldOk)}
          placeholder="e.g. Wireless Headphones"
        />
        {renderError("title")}
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <input
            value={values.category}
            onChange={(event) => setField("category", event.target.value)}
            list="product-categories"
            className={cn(fieldClass, errors.category ? fieldBad : fieldOk)}
            placeholder="e.g. smartphones"
          />
          <datalist id="product-categories">
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </datalist>
          {renderError("category")}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">
            Brand (optional)
          </span>
          <input
            value={values.brand}
            onChange={(event) => setField("brand", event.target.value)}
            className={cn(fieldClass, fieldOk)}
            placeholder="e.g. Apple"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Price (USD)</span>
          <input
            value={values.price}
            onChange={(event) => setField("price", event.target.value)}
            inputMode="decimal"
            className={cn(fieldClass, errors.price ? fieldBad : fieldOk)}
            placeholder="99.99"
          />
          {renderError("price")}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Stock</span>
          <input
            value={values.stock}
            onChange={(event) => setField("stock", event.target.value)}
            inputMode="numeric"
            className={cn(fieldClass, errors.stock ? fieldBad : fieldOk)}
            placeholder="25"
          />
          {renderError("stock")}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Rating</span>
          <input
            value={values.rating}
            onChange={(event) => setField("rating", event.target.value)}
            inputMode="decimal"
            className={cn(fieldClass, errors.rating ? fieldBad : fieldOk)}
            placeholder="4.5"
          />
          {renderError("rating")}
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          value={values.description}
          onChange={(event) => setField("description", event.target.value)}
          rows={4}
          className={cn(fieldClass, errors.description ? fieldBad : fieldOk)}
          placeholder="Short description of the product..."
        />
        {renderError("description")}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">
          Image URL (optional)
        </span>
        <input
          value={values.thumbnail}
          onChange={(event) => setField("thumbnail", event.target.value)}
          className={cn(fieldClass, fieldOk)}
          placeholder="https://..."
        />
      </label>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
