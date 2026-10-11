"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { IconPlus } from "@/components/admin/ui/Icons";

export default function ProductImagePicker({ name, title, existing, errors, multiple = false }) {
  const input = useRef(null);
  const [previews, setPreviews] = useState(existing);
  const [selected, setSelected] = useState(false);
  const [error, setError] = useState("");

  async function changeImages(event) {
    const files = Array.from(event.target.files);
    setError("");
    if (files.length > 8 || files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024)) {
      event.target.value = "";
      setSelected(false);
      setPreviews(existing);
      setError("Chọn tối đa 8 ảnh JPG, PNG hoặc WebP, mỗi ảnh không quá 2 MB.");
      return;
    }
    setSelected(files.length > 0);
    const values = await Promise.all(files.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    })));
    if (input.current?.files[0] === files[0]) setPreviews(files.length ? values : existing);
  }

  function cancelSelection() {
    input.current.value = "";
    setSelected(false);
    setPreviews(existing);
    setError("");
  }

  return <section className="card overflow-hidden">
    <div className="border-b border-line bg-surface-2 px-5 py-4"><h2 className="h-section">{title}</h2></div>
    <div className="p-5">
      <input ref={input} id={`product-${name}`} name={name} type="file" multiple={multiple} accept="image/jpeg,image/png,image/webp" onChange={changeImages} className="sr-only" />
      <div className="mb-3 grid grid-cols-2 gap-2">{previews.map((src, index) => <ImagePreview key={`${src}-${index}`} src={src} />)}</div>
      <label htmlFor={`product-${name}`} className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-line bg-surface-2 p-4 text-[13px] hover:border-accent"><IconPlus width={14} height={14} />{multiple ? "Chọn ảnh chi tiết" : "Chọn ảnh đại diện"}</label>
      {selected && <button type="button" onClick={cancelSelection} className="mt-3 text-[12px] text-danger hover:underline">Bỏ ảnh mới</button>}
      <p className="field-hint mt-3">JPG, PNG hoặc WebP · Tối đa 2 MB/ảnh.{multiple && " Tối đa 8 ảnh. Chọn ảnh mới sẽ thay bộ ảnh chi tiết cũ."} Không chọn ảnh mới sẽ giữ ảnh hiện tại.</p>
      {(error || errors?.length > 0) && <p className="mt-1 text-[12px] text-danger">{error || errors.join(" ")}</p>}
    </div>
  </section>;
}

function ImagePreview({ src }) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className="grid h-24 place-items-center rounded-md border border-line bg-surface-2 text-[11px] text-ink-3">Không tải được ảnh</span>
    : <Image src={src} alt="Ảnh sản phẩm" width={120} height={120} unoptimized onError={() => setFailed(true)} className="h-24 w-full rounded-md border border-line bg-white object-contain p-1" />;
}
