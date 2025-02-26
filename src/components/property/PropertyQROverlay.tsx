
import { QRCodeSVG } from 'qrcode.react';

interface PropertyQROverlayProps {
  webViewUrl: string;
  showQR: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const PropertyQROverlay = ({
  webViewUrl,
  showQR,
  onMouseEnter,
  onMouseLeave
}: PropertyQROverlayProps) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showQR && (
        <div className="bg-white p-2 rounded">
          <QRCodeSVG value={window.location.origin + webViewUrl} size={120} />
        </div>
      )}
    </div>
  );
};
