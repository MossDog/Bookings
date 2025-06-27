import { toast } from "sonner";

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => toast.success("Link copied to clipboard!"))
    .catch(() => toast.error("Failed to copy link."));
}

export function downloadQRCode() {
  const element = document.getElementById("qr-code-svg");
  if (!(element instanceof SVGSVGElement)) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(element);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const urlObject = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "qr-code.png";
          link.click();
        }
      }, "image/png");
    }
    URL.revokeObjectURL(urlObject);
  };

  img.src = urlObject;
}