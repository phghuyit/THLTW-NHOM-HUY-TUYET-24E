"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductImagePicker from "./ProductImagePicker";
import { IconCheck } from "@/components/admin/ui/Icons";

const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL", "FreeSize"];

export default function ProductForm({ product, options, onSave, submitLabel, successMessage }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [sizes, setSizes] = useState(() => Object.fromEntries(product ? product.sizes.map((size) => [size.size, size.stock_quantity]) : [["FreeSize", 0]]));

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    for (const name of ["name", "short_description", "description"]) data.set(name, data.get(name).trim());
    data.set("is_featured", data.has("is_featured") ? "1" : "0");
    if (!data.get("thumbnail").size) data.delete("thumbnail");
    if (!data.get("gallery_files[]").size) data.delete("gallery_files[]");
    Object.entries(sizes).forEach(([size, stock], index) => {
      data.append(`sizes[${index}][size]`, size);
      data.append(`sizes[${index}][stock_quantity]`, stock);
    });
    if (Object.keys(sizes).length === 0) {
      setError("Vui lòng chọn ít nhất một size.");
      return;
    }
    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      await onSave(data);
      window.alert(successMessage);
      router.push("/admin/product");
    } catch (error) {
      setFieldErrors(error.response?.data?.errors || {});
      setError(error.response?.status === 422 ? "Vui lòng kiểm tra các trường bên dưới." : error.response?.data?.message || "Không lưu được sản phẩm.");
      setSaving(false);
    }
  }

  function toggleSize(size, checked) {
    setSizes((previous) => {
      const next = { ...previous };
      if (checked) next[size] = 0;
      else delete next[size];
      return next;
    });
  }

  const sizeErrors = Object.entries(fieldErrors).filter(([key]) => key === "sizes" || key.startsWith("sizes.")).flatMap(([, errors]) => errors);

  return <form onSubmit={handleSubmit} className="w-full space-y-4">
    {error && <p role="alert" className="rounded-md border border-danger/30 bg-danger-soft p-3 text-[13px] text-danger">{error}</p>}
    <fieldset disabled={saving} className="grid min-w-0 gap-4 @4xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-4">
        <section className="card overflow-hidden">
          <SectionTitle title="Thông tin sản phẩm" description="Tên, phân loại và mô tả sản phẩm." />
          <div className="space-y-5 p-5 sm:p-6">
            <Field label="Tên sản phẩm *" name="name" errors={fieldErrors.name}>
              <input id="product-name" name="name" defaultValue={product?.name || ""} required maxLength={200} placeholder="Ví dụ: Đầm satin dự tiệc" className="field h-10" />
              <FieldError errors={fieldErrors.slug} />
              <p className="field-hint">Slug tự tạo từ tên sản phẩm.</p>
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Danh mục *" name="category_id" errors={fieldErrors.category_id}>
                <select id="product-category_id" name="category_id" defaultValue={product?.category_id || ""} required className="field h-10">
                  <option value="">Chọn danh mục</option>
                  {product && !options.categories.some((item) => item.id === product.category_id) && <option value={product.category_id}>Danh mục đã xóa · ID #{product.category_id}</option>}
                  {options.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </Field>
              <Field label="Thương hiệu" name="brand_id" errors={fieldErrors.brand_id}>
                <select id="product-brand_id" name="brand_id" defaultValue={product?.brand_id || ""} className="field h-10">
                  <option value="">Không có thương hiệu</option>
                  {product?.brand_id && !options.brands.some((item) => item.id === product.brand_id) && <option value={product.brand_id}>Thương hiệu đã xóa · ID #{product.brand_id}</option>}
                  {options.brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Mô tả ngắn" name="short_description" errors={fieldErrors.short_description}><textarea id="product-short_description" name="short_description" defaultValue={product?.short_description || ""} maxLength={500} rows={3} className="field resize-y" /></Field>
            <Field label="Mô tả chi tiết" name="description" errors={fieldErrors.description}><textarea id="product-description" name="description" defaultValue={product?.description || ""} rows={6} className="field resize-y" /></Field>
          </div>
        </section>
        <section className="card overflow-hidden">
          <SectionTitle title="Giá thuê và tiền cọc" description="Nhập giá bằng đồng Việt Nam." />
          <div className="grid gap-5 p-5 sm:grid-cols-3 sm:p-6">
            <NumberField label="Giá thuê / ngày *" name="rental_price_per_day" value={product?.rental_price_per_day ?? 0} max={9999999999.99} step="0.01" errors={fieldErrors.rental_price_per_day} />
            <NumberField label="Giá trị sản phẩm *" name="original_value" value={product?.original_value ?? 0} max={9999999999.99} step="0.01" errors={fieldErrors.original_value} />
            <NumberField label="Tỷ lệ cọc (%) *" name="deposit_rate_percent" value={product?.deposit_rate_percent ?? 70} max={100} errors={fieldErrors.deposit_rate_percent} />
          </div>
        </section>
        <section className="card overflow-hidden">
          <SectionTitle title="Size và tồn kho" description="Chọn các size đang bán và nhập số lượng cho từng size." />
          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap gap-3">{sizeOptions.map((size) => <label key={size} className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-[13px]"><input type="checkbox" checked={Object.hasOwn(sizes, size)} onChange={(event) => toggleSize(size, event.target.checked)} />{size}</label>)}</div>
            <div className="grid gap-4 sm:grid-cols-3">{Object.entries(sizes).map(([size, stock]) => <div key={size}><label htmlFor={`stock-${size}`} className="field-label">Tồn kho · {size}</label><input id={`stock-${size}`} type="number" min={0} max={2147483647} step={1} required value={stock} onChange={(event) => setSizes((previous) => ({ ...previous, [size]: event.target.value }))} className="field h-10" /></div>)}</div>
            <FieldError errors={sizeErrors} />
          </div>
        </section>
      </div>
      <div className="min-w-0 space-y-4">
        <ProductImagePicker name="thumbnail" title="Ảnh đại diện *" existing={product?.thumbnail ? [product.thumbnail] : []} errors={fieldErrors.thumbnail} />
        <ProductImagePicker name="gallery_files[]" title="Ảnh chi tiết" multiple existing={product?.images?.map((image) => image.image_url) || []} errors={Object.entries(fieldErrors).filter(([key]) => key === "gallery_files" || key.startsWith("gallery_files.")).flatMap(([, errors]) => errors)} />
        <section className="card overflow-hidden">
          <SectionTitle title="Hiển thị" />
          <div className="space-y-4 p-5">
            <Field label="Trạng thái *" name="status" errors={fieldErrors.status}><select id="product-status" name="status" defaultValue={product?.status || "active"} className="field h-10"><option value="active">Đang hiển thị</option><option value="hidden">Đang ẩn</option></select></Field>
            <label className="flex items-center gap-2 text-[13px]"><input name="is_featured" type="checkbox" defaultChecked={product?.is_featured || false} />Sản phẩm nổi bật</label>
            <FieldError errors={fieldErrors.is_featured} />
          </div>
        </section>
      </div>
      <div className="card flex flex-wrap items-center justify-between gap-3 px-5 py-4 @4xl:col-span-2">
        <p className="text-[12px] text-ink-3"><span className="text-danger">*</span> Thông tin bắt buộc</p>
        <div className="flex items-center gap-2"><button type="button" onClick={() => router.push("/admin/product")} className="btn btn-outline">Hủy</button><button type="submit" className="btn"><IconCheck width={15} height={15} />{saving ? "Đang lưu..." : submitLabel}</button></div>
      </div>
    </fieldset>
  </form>;
}

function SectionTitle({ title, description }) {
  return <div className="border-b border-line bg-surface-2 px-5 py-4"><h2 className="h-section">{title}</h2>{description && <p className="mt-0.5 text-[12px] text-ink-2">{description}</p>}</div>;
}

function Field({ label, name, errors, children }) {
  return <div><label htmlFor={`product-${name}`} className="field-label">{label}</label>{children}<FieldError errors={errors} /></div>;
}

function NumberField({ label, name, value, max, step = 1, errors }) {
  return <Field label={label} name={name} errors={errors}><input id={`product-${name}`} name={name} type="number" min={0} max={max} step={step} defaultValue={value} required className="field h-10" /></Field>;
}

function FieldError({ errors }) {
  return errors?.length ? <p className="mt-1 text-[12px] text-danger">{errors.join(" ")}</p> : null;
}

