'use client';

import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
}

function QRCodeGenerator(props: QRCodeGeneratorProps) {
  const {
    value,
    size = 128,
    bgColor = '#ffffff',
    fgColor = '#000000',
    level = 'L',
    includeMargin = false,
    className = ''
  } = props;
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render QR code on client side to avoid hydration issues
  if (!mounted) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="animate-pulse bg-gray-200 w-3/4 h-3/4"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <QRCodeCanvas
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        includeMargin={includeMargin}
      />
    </div>
  );
}

export default QRCodeGenerator;