import { Seller } from "@/types/types";
import QRCode from "react-qr-code";
import { toast } from "sonner";

interface QRCodeWidgetProps {
  seller: Seller;
}

export default function QRCodeWidget({ seller }: QRCodeWidgetProps) {
  const pageUrl = `${window.location.origin}/${seller.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link."));
  };

  const handleDownload = () => {
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
  };

  return (
    <div className="card bg-base-100 shadow-lg p-6 space-y-6 border border-base-300">
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold text-base-content">Share Your Page</h3>
        <p className="text-base-content/70 text-sm">Scan or share your business link</p>
      </div>

      <div className="flex justify-center p-4 bg-base-200 rounded-lg">
        <QRCode id="qr-code-svg" value={pageUrl} size={180} />
      </div>

      <div className="text-center text-sm break-words text-primary font-medium">
        {pageUrl}
      </div>

      <div className="flex gap-2">
        <button onClick={handleCopy} className="btn btn-outline flex-1">Copy Link</button>
        <button onClick={handleDownload} className="btn btn-primary flex-1.5">Download QR</button>
      </div>
    </div>
  );
}