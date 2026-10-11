"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconCheck, IconPlus, IconStore } from "@/components/admin/ui/Icons";

export default function BrandForm({ brand, onSave, submitLabel, successMessage }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(brand?.logo || "");
  const [logoName, setLogoName] = useState("");
  const logoInput = useRef(null);

  function handleLogoChange(event) {
    const file = event.target.files[0];
    setLogoPreview(brand?.logo || "");
    setLogoName(file?.name || "");
    setFieldErrors((previous) => ({ ...previous, logo: undefined }));
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setFieldErrors((previous) => ({ ...previous, logo: ["Chọn ảnh JPG, PNG hoặc WebP không quá 2 MB."] }));
      event.target.value = "";
      setLogoName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (logoInput.current?.files[0] === file) setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    logoInput.current.value = "";
    setLogoPreview(brand?.logo || "");
    setLogoName("");
    setFieldErrors((previous) => ({ ...previous, logo: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;

    const formData = new FormData(event.currentTarget);
    formData.set("name", formData.get("name").trim());
    formData.set("slug", formData.get("slug").trim());
    formData.set("description", formData.get("description").trim());
    if (!formData.get("logo").size) formData.delete("logo");

    setSaving(true);
    setError("");
    setFieldErrors({});

    try {
      await onSave(formData);
      window.alert(successMessage);
      router.push("/admin/brand");
    } catch (error) {
      setFieldErrors(error.response?.data?.errors || {});
      setError(error.response?.status === 422
        ? "Vui lòng kiểm tra các trường bên dưới."
        : error.response?.data?.message || "Không lưu được thương hiệu.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {error && <p role="alert" className="rounded-md border border-danger/30 bg-danger-soft p-3 text-[13px] text-danger">{error}</p>}
      <fieldset disabled={saving} className="grid min-w-0 gap-4 @4xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="card min-w-0 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-accent"><IconStore width={18} height={18} /></span>
            <div><h2 className="h-section">Thông tin thương hiệu</h2><p className="mt-0.5 text-[12px] text-ink-2">Tên, đường dẫn và mô tả thương hiệu.</p></div>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <label htmlFor="brand-name" className="field-label">Tên thương hiệu <span className="text-danger">*</span></label>
              <input id="brand-name" name="name" defaultValue={brand?.name || ""} required maxLength={100} placeholder="Ví dụ: Elise Fashion" className="field h-10"
                aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "brand-name-error" : undefined} />
              <FieldError id="brand-name-error" errors={fieldErrors.name} />
            </div>
            <div>
              <label htmlFor="brand-slug" className="field-label">Slug <span className="text-danger">*</span></label>
              <input id="brand-slug" name="slug" defaultValue={brand?.slug || ""} required maxLength={120} placeholder="elise-fashion" className="field h-10"
                aria-invalid={Boolean(fieldErrors.slug)} aria-describedby="brand-slug-help brand-slug-error" />
              <p id="brand-slug-help" className="field-hint">Tên viết không dấu, dùng dấu gạch ngang giữa các từ.</p>
              <FieldError id="brand-slug-error" errors={fieldErrors.slug} />
            </div>
            <div>
              <label htmlFor="brand-description" className="field-label">Mô tả <span className="ml-1 font-normal text-ink-3">· Không bắt buộc</span></label>
              <textarea id="brand-description" name="description" defaultValue={brand?.description || ""} rows={7} placeholder="Giới thiệu ngắn về phong cách, sản phẩm hoặc câu chuyện thương hiệu..." className="field resize-y"
                aria-invalid={Boolean(fieldErrors.description)} aria-describedby={fieldErrors.description ? "brand-description-error" : undefined} />
              <FieldError id="brand-description-error" errors={fieldErrors.description} />
            </div>
          </div>
        </section>

        <div className="min-w-0 space-y-4">
          <section className="card overflow-hidden">
            <div className="border-b border-line bg-surface-2 px-5 py-4"><h2 className="h-section">Logo thương hiệu</h2><p className="mt-0.5 text-[12px] text-ink-2">Ảnh đại diện trong danh sách.</p></div>
            <div className="p-5">
              <input ref={logoInput} id="brand-logo" name="logo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} className="sr-only"
                aria-invalid={Boolean(fieldErrors.logo)} aria-describedby="brand-logo-help brand-logo-error" />
              <label htmlFor="brand-logo" className="flex cursor-pointer flex-col items-center rounded-md border border-dashed border-line bg-surface-2 px-4 py-6 text-center transition-colors hover:border-accent hover:bg-accent-soft has-focus-visible:outline">
                {logoPreview
                  ? <Image src={logoPreview} alt="Logo thương hiệu" width={96} height={96} unoptimized className="h-24 w-24 rounded-md border border-line bg-white object-contain p-2" />
                  : <span className="grid h-20 w-20 place-items-center rounded-md border border-line bg-beige text-accent"><IconStore width={30} height={30} /></span>}
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium"><IconPlus width={14} height={14} />{logoPreview ? "Đổi ảnh logo" : "Chọn ảnh logo"}</span>
                <span className="mt-1 text-[11.5px] text-ink-3">Ưu tiên ảnh vuông, nền rõ ràng.</span>
              </label>
              {logoName && <div className="mt-3 flex min-w-0 items-center gap-2"><span className="flex-1 truncate text-[11.5px] text-ink-2" title={logoName}>{logoName}</span><button type="button" onClick={removeLogo} className="text-[11.5px] text-danger hover:underline">Bỏ ảnh</button></div>}
              <p id="brand-logo-help" className="field-hint mt-3">JPG, PNG hoặc WebP · Tối đa 2 MB.{brand && " Không chọn ảnh mới sẽ giữ logo hiện tại."}</p>
              <FieldError id="brand-logo-error" errors={fieldErrors.logo} />
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-line bg-surface-2 px-5 py-4"><h2 className="h-section">Trạng thái hiển thị</h2></div>
            <div className="p-5">
              <label htmlFor="brand-status" className="field-label">Trạng thái <span className="text-danger">*</span></label>
              <select id="brand-status" name="status" defaultValue={brand?.status || "active"} className="field h-10"
                aria-invalid={Boolean(fieldErrors.status)} aria-describedby="brand-status-help brand-status-error">
                <option value="active">Đang hiển thị</option><option value="hidden">Đang ẩn</option>
              </select>
              <p id="brand-status-help" className="field-hint">Chọn ẩn nếu thương hiệu chưa sẵn sàng xuất hiện trên trang khách.</p>
              <FieldError id="brand-status-error" errors={fieldErrors.status} />
            </div>
          </section>
        </div>

        <div className="card flex flex-wrap items-center justify-between gap-3 px-5 py-4 @4xl:col-span-2">
          <p className="text-[12px] text-ink-3"><span className="text-danger">*</span> Thông tin bắt buộc</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => router.push("/admin/brand")} className="btn btn-outline">Hủy</button>
            <button type="submit" className="btn"><IconCheck width={15} height={15} />{saving ? "Đang lưu..." : submitLabel}</button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

function FieldError({ id, errors }) {
  return errors ? <p id={id} className="mt-1 text-[12px] text-danger">{errors.join(" ")}</p> : null;
}
