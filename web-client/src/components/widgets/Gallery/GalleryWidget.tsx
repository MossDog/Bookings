import ImageSlot from "../../image/ImageSlot";
import { getCacheBustedSupabaseImageUrl } from "@/utils/bucket";

export default function GalleryWidget() {
  // Example: replace with your actual file path
  const imageUrl = getCacheBustedSupabaseImageUrl("farting");
  return (
    <div className="w-[600px] h-[600px] grid gap-2 grid-cols-3 grid-rows-3">
      <ImageSlot
        imagePreviewUrl={imageUrl}
        gridOptions={{ x: 1, y: 1, width: 2, height: 2 }}
      />
      {/* <ImageSlot gridOptions={{x: 3, y: 1, width: 1, height: 2}}/>
      <ImageSlot gridOptions={{x: 1, y: 3, width: 3, height: 1}}/> */}
    </div>
  );
}
