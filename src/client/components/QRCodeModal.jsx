import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, QrCode, Sparkles } from 'lucide-react';
import { generateQRCodeSVG } from '../utils/qrcode';
import { AirmailStampDoodle } from './Illustrations';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-modal-box w-full max-w-md p-6 flex flex-col relative">
        {/* 頂部標題 */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <div className="notebook-modal-badge">
              <QrCode size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--ink)]">空間 QR Code 快速分享</h2>
              <p className="text-xs text-[var(--muted)]">一鍵快速分享，手機掃碼免登入即用</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* QR Code 預覽卡片 */}
        <div className="flex flex-col items-center justify-center py-6 bg-[var(--paper)] rounded-2xl border border-[var(--line)] my-4 relative overflow-hidden">
          {/* 右上角航空郵票與波浪郵戳飾紋 */}
          <div className="absolute right-2.5 top-2 pointer-events-none opacity-30 dark:opacity-20">
            <AirmailStampDoodle className="w-20 h-14" />
          </div>

          <div className="p-3 bg-[var(--card-bg)] rounded-xl shadow-xs border border-[var(--line)] z-10">
            {svgHtml ? (
              <div
                className="w-48 h-48 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-[var(--muted)]">
                產生 QR Code 中…
              </div>
            )}
          </div>
          <div className="mt-3 text-center">
            <div className="text-xs font-bold text-[var(--ink)]">{space.name}</div>
            <div className="text-[11px] font-mono text-[var(--coral)] mt-0.5 font-bold">
              邀請代碼：{space.invite_code}
            </div>
          </div>
        </div>

        {/* 分享連結輸入列 */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
              公開唯讀分享網址 (含訪客直達參數)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="notebook-input flex-1 font-mono text-xs py-2 px-3 bg-[var(--paper)] text-[var(--ink)]"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="notebook-btn-primary text-xs py-2 px-3.5 shrink-0 flex items-center gap-1"
                title="複製網址"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? '已複製' : '複製'}</span>
              </button>
            </div>
          </div>

          {/* 訪客特性說明徽章 */}
          <div className="p-3 bg-[#f0f9f6] dark:bg-[#152723] border border-[#c7eadc] dark:border-[#21473f] rounded-xl text-xs text-[#2c6e59] dark:text-[#5eead4] flex items-start gap-2.5">
            <Sparkles size={15} className="shrink-0 mt-0.5 text-[#3b827e]" />
            <p className="leading-relaxed">
              任何學生、同事或訪客以手機掃描此條碼，<strong>無需註冊或登入</strong>即可直接在瀏覽器操作所有小工具！系統將自動保護您的空間不被竄改。
            </p>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="flex items-center justify-end gap-2.5 pt-4 mt-3 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={handleOpenGuest}
            className="notebook-btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <ExternalLink size={14} />
            <span>以訪客身分開啟測試</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="notebook-btn-primary text-xs py-2 px-4"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
