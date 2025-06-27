import { Seller } from "@/types/types";
import QRCode from "react-qr-code";
import { downloadQRCode, copyToClipboard } from "@/utils/qrcode";

interface QRCodeWidgetProps {
  seller: Seller;
}

export default function QRCodeWidget({ seller }: QRCodeWidgetProps) {
  const pageUrl = `${window.location.origin}/${seller.slug}`;

  return (
    <div className="card mt-6 bg-base-100 shadow-lg p-6 space-y-6 border border-base-300">
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold text-base-content">Share Your Page</h3>
        <p className="text-base-content/70 text-sm">Scan or share your business link</p>
      </div>

      <div className="flex justify-center">
        <QRCode id="qr-code-svg" value={pageUrl} size={180} />
      </div>

      <div className="text-center text-sm break-words text-primary font-medium">
        {pageUrl}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => copyToClipboard(pageUrl)}
          className="btn btn-outline flex-1 hover:btn-primary"
        >
          Copy Link
        </button>
        <button
          onClick={() => downloadQRCode()}
          className="btn btn-primary flex-1"
        >
          Download QR
        </button>
      </div>
    </div>
  );
}