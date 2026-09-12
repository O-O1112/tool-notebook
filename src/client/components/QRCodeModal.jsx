import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, QrCode, Sparkles } from 'lucide-react';
import { generateQRCodeSVG } from '../utils/qrcode';

export default function QRCodeModal({ isOpen, onClose, space }) {
  const [svgHtml, setSvgHtml] = useState('');
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?share=${space?.invite_code || ''}`
    : '';

  useEffect(() => {
    if (isOpen && shareUrl) {
      generateQRCodeSVG(shareUrl, { width: 220, margin: 1 })
        .then((svg) => setSvgHtml(svg))
        .catch((err) => console.error('QR code generation failed:', err));
    }
  }, [isOpen, shareUrl]);

  if (!isOpen || !space) return null;

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGuest = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2a2e]/50 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-card w-full max-w-md bg-white overflow-hidden shadow-2xl flex flex-col p-6">
        {/* 頂部標題 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e4e8e5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fff0eb] text-[#e17b62] flex items-center justify-center border border-[#e1ac9e]">
              <QrCode size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1f2a2e]">空間 QR Code 快速分享</h2>
              <p className="text-[11px] text-[#89959b]">Padlet 式一鍵分享，手機掃碼免登入即用</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* QR Code 預覽卡片 */}
        <div className="flex flex-col items-center justify-center py-6 bg-[#fafaf8] rounded-2xl border border-[#e4e8e5] my-4">
          <div className="p-3 bg-white rounded-xl shadow-md border border-[#e4e8e5]">
            {svgHtml ? (
              <div
                className="w-48 h-48 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-[#89959b]">
                產生 QR Code 中…
              </div>
            )}
          </div>
          <div className="mt-3 text-center">
            <div className="text-xs font-bold text-[#1f2a2e]">{space.name}</div>
            <div className="text-[11px] font-mono text-[#e17b62] mt-0.5">
              邀請代碼：{space.invite_code}
            </div>
          </div>
        </div>

        {/* 分享連結輸入列 */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#89959b] mb-1">
              公開唯讀分享網址 (含訪客直達參數)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="notebook-input flex-1 font-mono text-xs py-1.5 px-2.5 bg-gray-50 text-[#526066]"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="notebook-btn-primary text-xs py-1.5 px-3 shrink-0 flex items-center gap-1"
                title="複製網址"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? '已複製' : '複製'}</span>
              </button>
            </div>
          </div>

          {/* 訪客特性說明徽章 */}
          <div className="p-2.5 bg-[#f0f9f6] border border-[#c7eadc] rounded-xl text-[11px] text-[#2c6e59] flex items-start gap-2">
            <Sparkles size={14} className="shrink-0 mt-0.5 text-[#3b827e]" />
            <p className="leading-relaxed">
              任何學生、同事或訪客以手機掃描此條碼，<strong>無需註冊或登入</strong>即可直接在瀏覽器操作所有小工具！系統將自動保護您的空間不被竄改。
            </p>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-[#e4e8e5]">
          <button
            type="button"
            onClick={handleOpenGuest}
            className="notebook-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ExternalLink size={13} />
            <span>以訪客身分開啟測試</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="notebook-btn-primary text-xs py-1.5 px-4"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
