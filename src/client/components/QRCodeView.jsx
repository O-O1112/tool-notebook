import React, { useState, useEffect } from 'react';
import { generateQRCodeSVG } from '../utils/qrcode';

export default function QRCodeView({ value, size = 120, className = '' }) {
  const [svgHtml, setSvgHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (value) {
      generateQRCodeSVG(value, { width: size, margin: 1 })
        .then((svg) => {
          if (!cancelled) setSvgHtml(svg);
        })
        .catch((err) => {
          console.warn('QR Code generation error:', err);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!svgHtml) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`animate-pulse bg-[var(--paper)] rounded-lg ${className}`}
      />
    );
  }

  return (
    <div
      className={`inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
