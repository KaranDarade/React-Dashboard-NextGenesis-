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
  if (
    !values.rating.trim() ||
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 5
  ) {
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
  "focus-brand w-full rounded-xl border bg-white/[0.04] px-3 py-2.5 text-sm text-fg outline-none transition placeholder:text-fg-4 hover:border-line-strong focus:bg-white/[0.06]";
const fieldOk = "border-line focus:border-brand/50";
const fieldBad = "border-danger/40 focus:border-danger/60";
const labelClass = "text-xs font-medium text-fg-2";

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

  const errorFor = (field: keyof FormValues) =>
    errors[field] ? (
      <span className="text-xs text-danger">{errors[field]}</span>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="glass grid grid-cols-1 gap-5 rounded-2xl p-5 sm:p-6 lg:grid-cols-2"
    >
      <label className="flex flex-col gap-1.5 lg:col-span-2">
        <span className={labelClass}>Title</span>
        <input
          value={values.title}
          onChange={(event) => setField("title", event.target.value)}
          className={cn(fieldClass, errors.title ? fieldBad : fieldOk)}
          placeholder="e.g. Apple iPhone 15"
        />
        {errorFor("title")}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Category</span>
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
        {errorFor("category")}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Brand (optional)</span>
        <input
          value={values.brand}
          onChange={(event) => setField("brand", event.target.value)}
          className={cn(fieldClass, fieldOk)}
          placeholder="e.g. Apple"
        />
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:col-span-2">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Price (USD, shown in ₹)</span>
          <input
            value={values.price}
            onChange={(event) => setField("price", event.target.value)}
            inputMode="decimal"
            className={cn(fieldClass, errors.price ? fieldBad : fieldOk)}
            placeholder="99.99"
          />
          {errorFor("price")}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Stock</span>
          <input
            value={values.stock}
            onChange={(event) => setField("stock", event.target.value)}
            inputMode="numeric"
            className={cn(fieldClass, errors.stock ? fieldBad : fieldOk)}
            placeholder="25"
          />
          {errorFor("stock")}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Rating</span>
          <input
            value={values.rating}
            onChange={(event) => setField("rating", event.target.value)}
            inputMode="decimal"
            className={cn(fieldClass, errors.rating ? fieldBad : fieldOk)}
            placeholder="4.5"
          />
          {errorFor("rating")}
        </label>
      </div>

      <label className="flex flex-col gap-1.5 lg:col-span-2">
        <span className={labelClass}>Description</span>
        <textarea
          value={values.description}
          onChange={(event) => setField("description", event.target.value)}
          rows={4}
          className={cn(fieldClass, errors.description ? fieldBad : fieldOk)}
          placeholder="Short description of the product..."
        />
        {errorFor("description")}
      </label>

      <label className="flex flex-col gap-1.5 lg:col-span-2">
        <span className={labelClass}>Image URL (optional)</span>
        <input
          value={values.thumbnail}
          onChange={(event) => setField("thumbnail", event.target.value)}
          className={cn(fieldClass, fieldOk)}
          placeholder="https://..."
        />
      </label>

      <div className="flex justify-end gap-3 lg:col-span-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="focus-brand rounded-xl border border-line px-4 py-2 text-sm font-medium text-fg-2 transition hover:bg-white/[0.05] hover:text-fg disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="focus-brand rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-brand-darker transition hover:bg-brand-bright disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
