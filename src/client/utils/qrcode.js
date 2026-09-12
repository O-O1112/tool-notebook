import QRCode from 'qrcode';

/**
 * 產生向量 SVG QR Code 字串
 * @param {string} text 欲編碼的文字或網址
 * @param {object} options 自訂選項 (寬度、顏色、邊距等)
 * @returns {Promise<string>} SVG 標籤字串
 */
export async function generateQRCodeSVG(text, options = {}) {
  const defaultOpts = {
    type: 'svg',
    margin: 2,
    color: {
      dark: '#1f2a2e',
      light: '#ffffff',
    },
    ...options,
  };
  return QRCode.toString(text, defaultOpts);
}

/**
 * 產生 Base64 DataURL (便於 <img> 渲染或下載)
 * @param {string} text 欲編碼的文字或網址
 * @param {object} options 自訂選項
 * @returns {Promise<string>} data:image/png;base64,...
 */
export async function generateQRCodeDataURL(text, options = {}) {
  const defaultOpts = {
    margin: 2,
    width: 280,
    color: {
      dark: '#1f2a2e',
      light: '#ffffff',
    },
    ...options,
  };
  return QRCode.toDataURL(text, defaultOpts);
}
