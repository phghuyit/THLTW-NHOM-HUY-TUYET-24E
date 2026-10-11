"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconCheck, IconPlus, IconStore } from "@/components/admin/ui/Icons";

export default function CategoryForm({ category, onSave, submitLabel, successMessage, parents }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(category?.image || "");
  const [imageName, setImageName] = useState("");
  const [imageError, setImageError] = useState(false);
  const imageInput = useRef(null);
  const parentById = new Map(parents.map((parent) => [String(parent.id), parent.parent_id]));
  const availableParents = parents.filter((parent) => {
    if (!category) return true;
    let currentId = parent.id;
    const visited = new Set();
    while (currentId != null) {
      const key = String(currentId);
      if (key === String(category.id) || visited.has(key)) return false;
      visited.add(key);
      currentId = parentById.get(key);
    }
    return true;
  });

  function handleImageChange(event) {
    setImageError(false);
    const file = event.target.files[0];
    setImagePreview(category?.image || "");
    setImageName(file?.name || "");
    setFieldErrors((previous) => ({ ...previous, image: undefined }));
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setFieldErrors((previous) => ({ ...previous, image: ["Chọn ảnh JPG, PNG hoặc WebP không quá 2 MB."] }));
      event.target.value = "";
      setImageName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (imageInput.current?.files[0] === file) setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageError(false);
    imageInput.current.value = "";
    setImagePreview(category?.image || "");
    setImageName("");
    setFieldErrors((previous) => ({ ...previous, image: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;

    const formData = new FormData(event.currentTarget);
    formData.set("name", formData.get("name").trim());
    formData.set("description", formData.get("description").trim());
    if (!formData.get("image").size) formData.delete("image");

    setSaving(true);
    setError("");
    setFieldErrors({});

    try {
      await onSave(formData);
      window.alert(successMessage);
      router.push("/admin/category");
    } catch (error) {
      setFieldErrors(error.response?.data?.errors || {});
      setError(error.response?.status === 422
        ? "Vui lòng kiểm tra các trường bên dưới."
        : error.response?.data?.message || "Không lưu được danh mục.");
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
            <div><h2 className="h-section">Thông tin danh mục</h2><p className="mt-0.5 text-[12px] text-ink-2">Tên, danh mục cha và mô tả.</p></div>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <label htmlFor="category-name" className="field-label">Tên danh mục <span className="text-danger">*</span></label>
              <input id="category-name" name="name" defaultValue={category?.name || ""} required maxLength={100} placeholder="Ví dụ: Áo dài cưới" className="field h-10"
                aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "category-name-error" : undefined} />
              <FieldError id="category-name-error" errors={fieldErrors.name} />
              <FieldError id="category-slug-error" errors={fieldErrors.slug} />
              <p className="field-hint">Slug được backend tự tạo từ tên danh mục.</p>
            </div>
            <div>
              <label htmlFor="category-parent" className="field-label">Danh mục cha</label>
              <select id="category-parent" name="parent_id" defaultValue={category?.parent_id || ""} className="field h-10"
                aria-invalid={Boolean(fieldErrors.parent_id)} aria-describedby="category-parent-help category-parent-error">
                <option value="">Không có · Danh mục gốc</option>
                {category?.parent_id && !availableParents.some((parent) => parent.id === category.parent_id)
                  && <option value={category.parent_id}>Danh mục cha hiện tại không hợp lệ (ID #{category.parent_id})</option>}
                {availableParents.map((parent) => <option key={parent.id} value={parent.id}>{parent.name} (ID #{parent.id})</option>)}
              </select>
              <p id="category-parent-help" className="field-hint">Chọn danh mục cha nếu đây là danh mục con.</p>
              <FieldError id="category-parent-error" errors={fieldErrors.parent_id} />
            </div>
            <div>
              <label htmlFor="category-description" className="field-label">Mô tả <span className="ml-1 font-normal text-ink-3">· Không bắt buộc</span></label>
              <textarea id="category-description" name="description" defaultValue={category?.description || ""} rows={7} placeholder="Nhập mô tả ngắn cho danh mục..." className="field resize-y"
                aria-invalid={Boolean(fieldErrors.description)} aria-describedby={fieldErrors.description ? "category-description-error" : undefined} />
              <FieldError id="category-description-error" errors={fieldErrors.description} />
            </div>
          </div>
        </section>

        <div className="min-w-0 space-y-4">
          <section className="card overflow-hidden">
            <div className="border-b border-line bg-surface-2 px-5 py-4"><h2 className="h-section">Ảnh danh mục</h2><p className="mt-0.5 text-[12px] text-ink-2">Ảnh đại diện trong danh sách.</p></div>
            <div className="p-5">
              <input ref={imageInput} id="category-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="sr-only"
                aria-invalid={Boolean(fieldErrors.image)} aria-describedby="category-image-help category-image-error" />
              <label htmlFor="category-image" className="flex cursor-pointer flex-col items-center rounded-md border border-dashed border-line bg-surface-2 px-4 py-6 text-center transition-colors hover:border-accent hover:bg-accent-soft has-focus-visible:outline">
                {imagePreview && !imageError
                  ? <Image src={imagePreview} alt="Ảnh danh mục" width={96} height={96} unoptimized onError={() => setImageError(true)} className="h-24 w-24 rounded-md border border-line bg-white object-contain p-2" />
                  : <span className="grid h-20 w-20 place-items-center rounded-md border border-line bg-beige text-accent"><IconStore width={30} height={30} /></span>}
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium"><IconPlus width={14} height={14} />{imagePreview ? "Đổi ảnh danh mục" : "Chọn ảnh danh mục"}</span>
                <span className="mt-1 text-[11.5px] text-ink-3">Ưu tiên ảnh vuông, nền rõ ràng.</span>
              </label>
              {imageName && <div className="mt-3 flex min-w-0 items-center gap-2"><span className="flex-1 truncate text-[11.5px] text-ink-2" title={imageName}>{imageName}</span><button type="button" onClick={removeImage} className="text-[11.5px] text-danger hover:underline">Bỏ ảnh</button></div>}
              <p id="category-image-help" className="field-hint mt-3">JPG, PNG hoặc WebP · Tối đa 2 MB.{category && " Không chọn ảnh mới sẽ giữ ảnh hiện tại."}</p>
              {imageError && <p className="field-hint text-danger">Không tải được ảnh hiện tại. Bạn có thể chọn ảnh mới.</p>}
              <FieldError id="category-image-error" errors={fieldErrors.image} />
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-line bg-surface-2 px-5 py-4"><h2 className="h-section">Trạng thái hiển thị</h2></div>
            <div className="p-5">
              <label htmlFor="category-status" className="field-label">Trạng thái <span className="text-danger">*</span></label>
              <select id="category-status" name="status" defaultValue={category?.status || "active"} className="field h-10"
                aria-invalid={Boolean(fieldErrors.status)} aria-describedby="category-status-help category-status-error">
                <option value="active">Đang hiển thị</option><option value="hidden">Đang ẩn</option>
              </select>
              <p id="category-status-help" className="field-hint">Chọn ẩn nếu danh mục chưa sẵn sàng xuất hiện trên trang khách.</p>
              <FieldError id="category-status-error" errors={fieldErrors.status} />
            </div>
          </section>
        </div>

        <div className="card flex flex-wrap items-center justify-between gap-3 px-5 py-4 @4xl:col-span-2">
          <p className="text-[12px] text-ink-3"><span className="text-danger">*</span> Thông tin bắt buộc</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => router.push("/admin/category")} className="btn btn-outline">Hủy</button>
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
