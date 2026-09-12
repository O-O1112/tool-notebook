import React from 'react';

/**
 * 資源回收桶空狀態插畫 (TrashEmptyIllustration)
 * 靈感來自手帳美學：小熊戴著毛帽坐在收納盒與書桌上專注閱讀，旁有綠植盆栽、暖黃復古檯燈與行囊
 */
export function TrashEmptyIllustration({ className = 'w-72 h-48' }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 地面輔助線 */}
      <line x1="30" y1="180" x2="290" y2="180" strokeDasharray="3 3" opacity="0.3" />

      {/* 書桌檯面與抽屜櫃 */}
      <rect x="50" y="125" width="220" height="7" rx="2" className="text-[var(--line,#2b3340)]" fill="currentColor" fillOpacity="0.1" />
      {/* 左側抽屜組 */}
      <rect x="55" y="132" width="65" height="34" rx="3" className="text-[var(--line,#2b3340)]" stroke="currentColor" fill="var(--card-bg,#1c222b)" />
      <line x1="55" y1="149" x2="120" y2="149" />
      <circle cx="87" cy="140" r="2" fill="currentColor" />
      <circle cx="87" cy="157" r="2" fill="currentColor" />
      {/* 桌腳 */}
      <path d="M 60 166 L 60 180 M 115 166 L 115 180 M 205 132 L 205 180 M 260 132 L 260 180" />

      {/* 桌底小嫩芽 */}
      <path d="M 155 180 Q 160 166 166 168 Q 170 180 155 180 Z" stroke="#34d399" fill="#34d399" fillOpacity="0.25" />
      <path d="M 166 168 Q 174 162 178 170 Q 172 176 166 168 Z" stroke="#34d399" fill="#34d399" fillOpacity="0.25" />

      {/* 左側：盆栽植物 */}
      <path d="M 75 125 L 78 106 L 98 106 L 101 125 Z" fill="var(--card-bg,#1c222b)" />
      <line x1="75" y1="106" x2="101" y2="106" />
      {/* 植物葉片 (龜背芋/手繪葉) */}
      <path d="M 88 106 Q 70 82 56 88 Q 68 105 88 106 Z" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.2" />
      <line x1="88" y1="106" x2="65" y2="92" stroke="#38b2ac" />
      <path d="M 88 104 Q 78 68 90 65 Q 102 78 88 104 Z" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.2" />
      <line x1="88" y1="104" x2="88" y2="72" stroke="#38b2ac" />
      <path d="M 90 105 Q 110 80 122 88 Q 112 106 90 105 Z" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.2" />
      <line x1="90" y1="105" x2="112" y2="92" stroke="#38b2ac" />

      {/* 右側：整齊收納紙箱組 */}
      <rect x="185" y="96" width="46" height="29" rx="2" fill="var(--card-bg,#1c222b)" />
      <line x1="185" y1="102" x2="231" y2="102" strokeDasharray="2 2" />
      <rect x="200" y="108" width="16" height="5" rx="2" />
      {/* 上方小箱 */}
      <rect x="190" y="74" width="36" height="22" rx="2" fill="var(--card-bg,#1c222b)" />
      <line x1="208" y1="74" x2="208" y2="96" strokeDasharray="2 2" />

      {/* 書包/行囊 */}
      <rect x="238" y="104" width="22" height="21" rx="4" fill="var(--card-bg,#1c222b)" />
      <path d="M 244 104 Q 249 97 254 104" />
      <rect x="242" y="112" width="14" height="9" rx="2" />

      {/* 復古彎管檯燈 */}
      <ellipse cx="215" cy="125" rx="7" ry="2" fill="currentColor" fillOpacity="0.3" />
      <path d="M 215 125 L 210 98 L 196 78" />
      <circle cx="210" cy="98" r="1.5" fill="currentColor" />
      <circle cx="196" cy="78" r="1.5" fill="currentColor" />
      {/* 燈罩 (溫潤鵝黃) */}
      <path d="M 188 80 L 176 66 A 9 9 0 0 1 189 57 L 198 73 Z" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.3" />
      {/* 燈光光暈射線 */}
      <line x1="172" y1="74" x2="162" y2="85" stroke="#fbbf24" strokeDasharray="2 3" opacity="0.6" />
      <line x1="178" y1="79" x2="170" y2="93" stroke="#fbbf24" strokeDasharray="2 3" opacity="0.6" />

      {/* 中央：可愛看書小角色 / 小熊 */}
      {/* 身體與外套 */}
      <path d="M 132 125 Q 128 92 144 78 Q 160 78 168 88 Q 174 105 170 125 Z" fill="var(--card-bg,#1c222b)" />
      {/* 圍巾或領口 */}
      <path d="M 138 82 Q 150 86 162 82" />
      {/* 圓耳朵 */}
      <circle cx="138" cy="54" r="4.5" fill="var(--card-bg,#1c222b)" />
      <circle cx="163" cy="54" r="4.5" fill="var(--card-bg,#1c222b)" />
      {/* 毛線冬帽 (溫柔珊瑚色) */}
      <path d="M 134 58 Q 150 43 166 58 Z" stroke="#f08b73" fill="#f08b73" fillOpacity="0.25" />
      <circle cx="150" cy="42" r="3.5" stroke="#f08b73" fill="#f08b73" />
      <line x1="135" y1="58" x2="165" y2="58" stroke="#f08b73" />
      {/* 專注閱讀的安詳神情 */}
      <path d="M 144 64 Q 147 67 150 64" />
      <path d="M 152 64 Q 155 67 158 64" />
      <circle cx="151" cy="69" r="1" fill="currentColor" />

      {/* 雙手捧著一本翻開的書 */}
      <path d="M 130 96 L 150 102 L 170 96 L 170 116 L 150 122 L 130 116 Z" fill="var(--paper,#11151a)" />
      <line x1="150" y1="102" x2="150" y2="122" />
      {/* 內頁文字排線 */}
      <line x1="134" y1="103" x2="146" y2="106" strokeWidth="1" opacity="0.6" />
      <line x1="134" y1="108" x2="146" y2="111" strokeWidth="1" opacity="0.6" />
      <line x1="134" y1="113" x2="144" y2="115" strokeWidth="1" opacity="0.6" />
      <line x1="154" y1="106" x2="166" y2="103" strokeWidth="1" opacity="0.6" />
      <line x1="154" y1="111" x2="166" y2="108" strokeWidth="1" opacity="0.6" />
      <line x1="154" y1="115" x2="164" y2="113" strokeWidth="1" opacity="0.6" />
      {/* 圓圓小手 */}
      <ellipse cx="129" cy="107" rx="3" ry="4" fill="var(--card-bg,#1c222b)" />
      <ellipse cx="171" cy="107" rx="3" ry="4" fill="var(--card-bg,#1c222b)" />
    </svg>
  );
}

/**
 * 我的最愛空狀態插畫 (FavoritesEmptyIllustration)
 * 天文望遠鏡眺望星空、閃耀星辰、許願星瓶與珍藏手帳
 */
export function FavoritesEmptyIllustration({ className = 'w-72 h-48' }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 弧形月夜地平線 */}
      <path d="M 40 175 Q 160 165 280 175" strokeDasharray="3 3" opacity="0.3" />

      {/* 雲朵與星空背景 */}
      <path d="M 60 55 Q 75 45 90 55 Q 105 50 115 62 Q 95 68 60 55 Z" opacity="0.2" fill="currentColor" />
      {/* 彎彎金黃新月 */}
      <path
        d="M 235 30 A 18 18 0 1 0 252 56 A 15 15 0 1 1 235 30 Z"
        stroke="#fbbf24"
        fill="#fbbf24"
        fillOpacity="0.25"
      />

      {/* 閃耀十字星辰 (琥珀金與珊瑚橘) */}
      <path d="M 195 24 Q 195 32 188 32 Q 195 32 195 40 Q 195 32 202 32 Q 195 32 195 24 Z" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.4" />
      <path d="M 130 38 Q 130 43 125 43 Q 130 43 130 48 Q 130 43 135 43 Q 130 43 130 38 Z" stroke="#f08b73" fill="#f08b73" fillOpacity="0.4" />
      <path d="M 270 65 Q 270 70 266 70 Q 270 70 270 75 Q 270 70 274 70 Q 270 70 270 65 Z" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.4" />
      {/* 微光小圓點 */}
      <circle cx="160" cy="28" r="1.5" fill="#fbbf24" opacity="0.7" />
      <circle cx="100" cy="72" r="1.5" fill="#fbbf24" opacity="0.7" />
      <circle cx="250" cy="85" r="1.5" fill="#f08b73" opacity="0.7" />

      {/* 天文望遠鏡與三腳架 */}
      <path d="M 145 105 L 205 60 L 214 72 L 154 117 Z" fill="var(--card-bg,#1c222b)" />
      <line x1="205" y1="60" x2="214" y2="72" />
      <circle cx="218" cy="54" r="3" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.3" />
      {/* 尋星鏡 */}
      <rect x="175" y="65" width="18" height="6" rx="1" transform="rotate(-37 175 65)" />
      {/* 經緯儀雲台 */}
      <circle cx="165" cy="115" r="4" fill="currentColor" />
      {/* 實木三腳架 */}
      <line x1="165" y1="115" x2="128" y2="175" />
      <line x1="165" y1="115" x2="165" y2="175" />
      <line x1="165" y1="115" x2="202" y2="175" />
      <line x1="140" y1="150" x2="190" y2="150" strokeDasharray="2 2" opacity="0.6" />

      {/* 左側小圓桌與星星收藏玻璃罐 */}
      <ellipse cx="85" cy="148" rx="24" ry="5" fill="var(--card-bg,#1c222b)" />
      <line x1="85" y1="153" x2="85" y2="175" />
      <line x1="72" y1="175" x2="98" y2="175" />

      {/* 許願玻璃罐 (裡面裝著最愛星星) */}
      <rect x="75" y="122" width="20" height="24" rx="5" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.1" />
      <rect x="77" y="118" width="16" height="4" rx="1.5" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.3" />
      {/* 罐子內的小金星 */}
      <path d="M 85 128 L 86 131 L 89 131 L 87 133 L 88 136 L 85 134 L 82 136 L 83 133 L 81 131 L 84 131 Z" stroke="#fbbf24" fill="#fbbf24" strokeWidth="0.8" />
      <circle cx="83" cy="139" r="1.2" fill="#fbbf24" />
      <circle cx="88" cy="138" r="1.2" fill="#f08b73" />

      {/* 珍藏筆記本疊放 */}
      <rect x="220" y="160" width="34" height="8" rx="1.5" fill="var(--card-bg,#1c222b)" />
      <rect x="222" y="152" width="30" height="8" rx="1.5" fill="var(--card-bg,#1c222b)" />
      <path d="M 232 152 L 232 165 L 235 162 L 238 165 L 238 152" stroke="#f08b73" fill="#f08b73" fillOpacity="0.3" strokeWidth="1" />
    </svg>
  );
}

/**
 * 空間自建空狀態插畫 (SpacesEmptyIllustration)
 * 工作手帳台：攤開的方眼手帳、直尺、沾水筆、蒸氣熱咖啡杯與紙膠帶
 */
export function SpacesEmptyIllustration({ className = 'w-72 h-48' }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 桌面基線 */}
      <line x1="30" y1="168" x2="290" y2="168" strokeDasharray="3 3" opacity="0.3" />

      {/* 左側：冒著裊裊白煙的熱咖啡手沖馬克杯 */}
      <path d="M 58 132 L 61 162 A 5 5 0 0 0 77 162 L 80 132 Z" fill="var(--card-bg,#1c222b)" />
      <path d="M 80 136 C 88 136 88 152 80 152" />
      {/* 咖啡杯印花與蒸氣線 */}
      <line x1="63" y1="145" x2="75" y2="145" stroke="#f08b73" opacity="0.5" />
      <path d="M 66 124 Q 69 116 66 108" stroke="#f08b73" strokeDasharray="2 2" />
      <path d="M 72 122 Q 75 114 72 106" stroke="#f08b73" strokeDasharray="2 2" />

      {/* 中央：一本平攤的大開本手帳筆記本 */}
      <path
        d="M 98 102 L 155 107 L 212 102 L 212 156 L 155 161 L 98 156 Z"
        fill="var(--card-bg,#1c222b)"
      />
      {/* 中間書脊縫線 */}
      <line x1="155" y1="107" x2="155" y2="161" />
      {/* 左頁手帳方格底紋 */}
      <line x1="108" y1="116" x2="145" y2="119" strokeWidth="0.9" opacity="0.4" />
      <line x1="108" y1="124" x2="145" y2="127" strokeWidth="0.9" opacity="0.4" />
      <line x1="108" y1="132" x2="145" y2="135" strokeWidth="0.9" opacity="0.4" />
      <line x1="108" y1="140" x2="145" y2="143" strokeWidth="0.9" opacity="0.4" />
      {/* 右頁清單方塊與代辦橫線 */}
      <rect x="165" y="117" width="4" height="4" rx="1" stroke="#f08b73" strokeWidth="1" />
      <line x1="174" y1="119" x2="202" y2="117" strokeWidth="1" opacity="0.6" />
      <rect x="165" y="126" width="4" height="4" rx="1" stroke="#f08b73" strokeWidth="1" />
      <line x1="174" y1="128" x2="202" y2="126" strokeWidth="1" opacity="0.6" />
      <rect x="165" y="135" width="4" height="4" rx="1" stroke="#38b2ac" strokeWidth="1" />
      <line x1="174" y1="137" x2="196" y2="135" strokeWidth="1" opacity="0.6" />

      {/* 筆記本上方飄起的靈感火花 */}
      <path d="M 155 80 Q 155 87 148 87 Q 155 87 155 94 Q 155 87 162 87 Q 155 87 155 80 Z" stroke="#f08b73" fill="#f08b73" fillOpacity="0.4" />
      <circle cx="132" cy="74" r="2" fill="#fbbf24" />
      <circle cx="178" cy="76" r="1.5" fill="#38b2ac" />

      {/* 右側：文具筆筒 (放沾水鋼筆、刻度直尺、美工刀) */}
      <rect x="235" y="128" width="24" height="36" rx="3" fill="var(--card-bg,#1c222b)" />
      <line x1="235" y1="134" x2="259" y2="134" opacity="0.5" />
      {/* 刻度直尺 (斜插) */}
      <path d="M 238 128 L 244 88 L 252 90 L 246 128" fill="var(--card-bg,#1c222b)" />
      <line x1="246" y1="96" x2="250" y2="97" strokeWidth="0.8" />
      <line x1="245" y1="102" x2="249" y2="103" strokeWidth="0.8" />
      <line x1="244" y1="108" x2="248" y2="109" strokeWidth="0.8" />
      {/* 鋼筆 */}
      <path d="M 252 128 L 257 82 L 259 82 L 258 128" />
      <polygon points="258,76 256,82 260,82" stroke="#f08b73" fill="#f08b73" />

      {/* 桌面上散落的彩色紙膠帶 (Washi Tape) */}
      <ellipse cx="108" cy="164" rx="9" ry="4" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.25" />
      <ellipse cx="108" cy="162" rx="4" ry="2" stroke="#38b2ac" />
    </svg>
  );
}

/**
 * 他人共享空狀態插畫 (SharedEmptyIllustration)
 * 兩架摺紙紙飛機攜帶著卡片在星空與雲間環遊，連接著友情與協作郵筒
 */
export function SharedEmptyIllustration({ className = 'w-72 h-48' }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="30" y1="172" x2="290" y2="172" strokeDasharray="3 3" opacity="0.3" />

      {/* 共享協作復古小郵筒 */}
      <path d="M 65 172 L 65 135 A 14 14 0 0 1 93 135 L 93 172 Z" fill="var(--card-bg,#1c222b)" />
      <line x1="71" y1="130" x2="87" y2="130" stroke="#f08b73" strokeWidth="2" />
      {/* 郵筒投遞口與小紅旗 */}
      <rect x="70" y="142" width="18" height="4" rx="1" />
      <path d="M 93 140 L 102 136 L 102 144 Z" stroke="#f08b73" fill="#f08b73" />

      {/* 紙飛機 1 (大)：帶著協作小卡片朝右上翱翔 */}
      <path
        d="M 120 95 L 180 50 L 165 110 L 148 98 Z"
        stroke="#f08b73"
        fill="var(--card-bg,#1c222b)"
      />
      <line x1="180" y1="50" x2="148" y2="98" stroke="#f08b73" />
      {/* 飛機 1 尾流迴旋虛線 */}
      <path d="M 80 125 Q 95 105 110 115 T 130 96" stroke="#f08b73" strokeDasharray="3 3" opacity="0.7" />

      {/* 紙飛機 2 (小)：由右往左呼應相逢 */}
      <path
        d="M 260 70 L 210 95 L 235 118 L 240 98 Z"
        stroke="#38b2ac"
        fill="var(--card-bg,#1c222b)"
      />
      <line x1="210" y1="95" x2="240" y2="98" stroke="#38b2ac" />
      {/* 飛機 2 尾流 */}
      <path d="M 285 58 Q 275 75 258 72" stroke="#38b2ac" strokeDasharray="3 3" opacity="0.7" />

      {/* 傳遞中的協作愛心便箋信封 */}
      <rect x="180" y="116" width="34" height="24" rx="3" fill="var(--card-bg,#1c222b)" />
      <path d="M 180 116 L 197 130 L 214 116" stroke="#f08b73" />
      <circle cx="197" cy="130" r="3" stroke="#f08b73" fill="#f08b73" fillOpacity="0.4" />

      {/* 歡慶火花與愛心 */}
      <path d="M 152 40 Q 155 35 160 38 Q 165 35 168 40 Q 168 46 160 52 Q 152 46 152 40 Z" stroke="#f08b73" fill="#f08b73" fillOpacity="0.3" strokeWidth="1" />
      <circle cx="218" cy="42" r="1.5" fill="#fbbf24" />
      <circle cx="130" cy="62" r="1.5" fill="#38b2ac" />
    </svg>
  );
}

/**
 * 空間工具為空插畫 (ToolsEmptyIllustration)
 * 畫架、白板、懸浮的代碼積木小工具標籤與調色盤，呼喚使用者新增小工具
 */
export function ToolsEmptyIllustration({ className = 'w-72 h-48' }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="30" y1="175" x2="290" y2="175" strokeDasharray="3 3" opacity="0.3" />

      {/* 中央：設計畫板 / 工具黑板 */}
      <rect x="95" y="55" width="130" height="92" rx="6" fill="var(--card-bg,#1c222b)" />
      {/* 畫板內部的虛線卡片插槽 */}
      <rect x="107" y="67" width="106" height="68" rx="4" strokeDasharray="4 4" stroke="#f08b73" opacity="0.6" fill="var(--paper,#11151a)" />
      {/* 畫板支架三腳架 */}
      <line x1="120" y1="147" x2="105" y2="175" />
      <line x1="200" y1="147" x2="215" y2="175" />
      <line x1="160" y1="147" x2="160" y2="175" />

      {/* 畫板中心的大加號與小標籤 */}
      <circle cx="160" cy="101" r="14" stroke="#f08b73" fill="#f08b73" fillOpacity="0.15" />
      <line x1="160" y1="94" x2="160" y2="108" stroke="#f08b73" strokeWidth="2" />
      <line x1="153" y1="101" x2="167" y2="101" stroke="#f08b73" strokeWidth="2" />

      {/* 左上方懸浮：HTML / 程式碼小積木 */}
      <rect x="52" y="52" width="36" height="26" rx="4" stroke="#38b2ac" fill="var(--card-bg,#1c222b)" />
      <path d="M 64 61 L 60 65 L 64 69 M 76 61 L 80 65 L 76 69" stroke="#38b2ac" strokeWidth="1.2" />

      {/* 右上方懸浮：Iframe 視窗與地球圖標 */}
      <rect x="232" y="52" width="38" height="28" rx="4" stroke="#3b82f6" fill="var(--card-bg,#1c222b)" />
      <circle cx="251" cy="66" r="6" stroke="#3b82f6" strokeWidth="1.2" />
      <line x1="245" y1="66" x2="257" y2="66" stroke="#3b82f6" strokeWidth="1" />

      {/* 左下方：手帳調色盤與水彩筆 */}
      <path d="M 52 145 C 52 135 78 135 78 152 C 78 162 65 165 58 160 C 54 157 52 150 52 145 Z" fill="var(--card-bg,#1c222b)" />
      <circle cx="60" cy="144" r="2" fill="#f08b73" />
      <circle cx="68" cy="142" r="2" fill="#fbbf24" />
      <circle cx="71" cy="150" r="2" fill="#38b2ac" />

      {/* 右下方：齒輪工具 */}
      <circle cx="255" cy="150" r="7" stroke="#fbbf24" />
      <circle cx="255" cy="150" r="3" stroke="#fbbf24" />
    </svg>
  );
}

/**
 * 搜尋查無結果插畫 (SearchEmptyIllustration)
 * 放大鏡探索著翻開的手帳，周圍帶著問號小星芒
 */
export function SearchEmptyIllustration({ className = 'w-72 h-44' }) {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="50" y1="150" x2="270" y2="150" strokeDasharray="3 3" opacity="0.3" />

      {/* 底部翻開的筆記本 */}
      <path d="M 100 100 L 160 105 L 220 100 L 220 145 L 160 150 L 100 145 Z" fill="var(--card-bg,#1c222b)" />
      <line x1="160" y1="105" x2="160" y2="150" />
      <line x1="112" y1="116" x2="148" y2="119" strokeWidth="1" opacity="0.4" />
      <line x1="112" y1="126" x2="148" y2="129" strokeWidth="1" opacity="0.4" />
      <line x1="172" y1="119" x2="208" y2="116" strokeWidth="1" opacity="0.4" />
      <line x1="172" y1="129" x2="208" y2="126" strokeWidth="1" opacity="0.4" />

      {/* 懸浮巨大的手繪放大鏡 */}
      <circle cx="152" cy="72" r="24" stroke="#f08b73" strokeWidth="2.5" fill="var(--paper,#11151a)" />
      <path d="M 169 89 L 195 115" stroke="#f08b73" strokeWidth="4" />
      {/* 放大鏡鏡片反光紋 */}
      <path d="M 140 60 A 16 16 0 0 1 164 60" stroke="#f08b73" strokeWidth="1.2" opacity="0.6" />

      {/* 鏡片裡的好奇問號 */}
      <path d="M 148 66 Q 152 61 156 65 Q 156 70 152 73 L 152 76" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="152" cy="80" r="1" fill="#fbbf24" />

      {/* 四周浮動的尋找小星辰 */}
      <path d="M 95 62 Q 95 68 89 68 Q 95 68 95 74 Q 95 68 101 68 Q 95 68 95 62 Z" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.3" />
      <path d="M 215 54 Q 215 60 210 60 Q 215 60 215 66 Q 215 60 220 60 Q 215 60 215 54 Z" stroke="#f08b73" fill="#f08b73" fillOpacity="0.3" />
      <circle cx="120" cy="45" r="1.5" fill="#fbbf24" />
      <circle cx="188" cy="42" r="1.5" fill="#38b2ac" />
    </svg>
  );
}

/**
 * 底部手繪全景天際線 (PanoramicSkyline)
 * 精緻宏偉的手繪手帳漫遊天際線：
 * 包含遊樂摩天輪、巴伐利亞半木小木屋、三孔羅馬石橋與運河貢多拉、巨型翻開手帳之山與鋼筆紀念碑、
 * 玻璃花房植物溫室、宏偉哥德式大笨鐘鐘樓、古典石柱圖書館、熱氣球、凱旋門、法式鑄鐵街燈、
 * 鉛筆與鋼筆筆尖建築群、荷蘭風車與水車、天文台望遠鏡、星空新月與北斗七星、海崖紅白螺旋燈塔、
 * 雙桅帆船、海港木棧橋、海鳥與連綿松林海角。
 */
export function PanoramicSkyline({ className = 'w-full h-28 sm:h-36 md:h-48 lg:h-56 opacity-45 dark:opacity-30 pointer-events-none' }) {
  return (
    <svg
      viewBox="0 0 1600 152"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      preserveAspectRatio="xMidYBottom meet"
    >
      {/* 貫穿全景的大地與河岸基線 */}
      <line x1="0" y1="136" x2="1600" y2="136" strokeWidth="1.5" />
      {/* 河水與海港微波波紋 */}
      <path d="M 190 142 Q 220 145 250 142" strokeWidth="0.8" opacity="0.6" />
      <path d="M 270 146 Q 300 149 330 146" strokeWidth="0.8" opacity="0.5" />
      <path d="M 720 142 Q 750 145 780 142" strokeWidth="0.8" opacity="0.6" />
      <path d="M 740 148 Q 770 151 800 148" strokeWidth="0.8" opacity="0.5" />
      <path d="M 1080 144 Q 1110 147 1140 144" strokeWidth="0.8" opacity="0.6" />
      <path d="M 1260 142 Q 1300 146 1340 142" strokeWidth="0.8" opacity="0.6" />
      <path d="M 1320 148 Q 1360 152 1400 148" strokeWidth="0.8" opacity="0.5" />
      <path d="M 1430 144 Q 1470 148 1510 144" strokeWidth="0.8" opacity="0.6" />
      <path d="M 1490 150 Q 1530 154 1570 150" strokeWidth="0.8" opacity="0.5" />

      {/* 1. 左側：豪華浪漫遊樂摩天輪 (Ferris Wheel) */}
      <g>
        {/* 雙重轉輪外圈與桁架刻度 */}
        <circle cx="95" cy="72" r="42" strokeWidth="1.5" />
        <circle cx="95" cy="72" r="38" strokeDasharray="3 2" opacity="0.75" />
        <circle cx="95" cy="72" r="8" fill="var(--card-bg,#1c222b)" strokeWidth="1.5" />
        <circle cx="95" cy="72" r="3" fill="currentColor" />

        {/* 12 組輻條輪輻與交叉支撐 */}
        <line x1="95" y1="30" x2="95" y2="114" />
        <line x1="53" y1="72" x2="137" y2="72" />
        <line x1="65" y1="42" x2="125" y2="102" />
        <line x1="65" y1="102" x2="125" y2="42" />
        <line x1="78" y1="34" x2="112" y2="110" opacity="0.7" />
        <line x1="112" y1="34" x2="78" y2="110" opacity="0.7" />
        <line x1="57" y1="89" x2="133" y2="55" opacity="0.7" />
        <line x1="57" y1="55" x2="133" y2="89" opacity="0.7" />

        {/* 輪輻交叉斜撐 (Cross Bracing) */}
        <circle cx="95" cy="72" r="24" strokeDasharray="2 2" opacity="0.5" />

        {/* 12 座懸掛式景觀車廂 (Gondola Cars) */}
        <rect x="91" y="24" width="8" height="7" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="91" y="113" width="8" height="7" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="47" y="68" width="7" height="8" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="136" y="68" width="7" height="8" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="62" y="38" width="8" height="7" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="120" y="38" width="8" height="7" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="62" y="99" width="8" height="7" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="120" y="99" width="8" height="7" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="74" y="29" width="7" height="7" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="109" y="29" width="7" height="7" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="52" y="85" width="7" height="7" rx="2" fill="var(--card-bg,#1c222b)" />
        <rect x="131" y="85" width="7" height="7" rx="2" fill="var(--card-bg,#1c222b)" />

        {/* 摩天輪重型 A 字支架 */}
        <line x1="95" y1="72" x2="68" y2="136" strokeWidth="2" />
        <line x1="95" y1="72" x2="122" y2="136" strokeWidth="2" />
        <line x1="78" y1="114" x2="112" y2="114" strokeWidth="1.2" />
        <line x1="72" y1="128" x2="118" y2="128" strokeWidth="1" />

        {/* 乘車木棧道與波浪遮陽棚 */}
        <rect x="62" y="128" width="66" height="8" rx="1" fill="var(--card-bg,#1c222b)" />
        <path d="M 62 128 Q 67 124 72 128 Q 77 124 82 128 Q 87 124 92 128 Q 97 124 102 128 Q 107 124 112 128 Q 117 124 122 128 Q 127 124 128 128" stroke="#f59e0b" />
      </g>

      {/* 2. 巴伐利亞歐風半木造雙層小木屋聚落 (x: 150 - 225) */}
      <g>
        {/* 左側斜頂小木屋 */}
        <path d="M 148 136 L 148 95 L 164 78 L 180 95 L 180 136" fill="var(--card-bg,#1c222b)" />
        <path d="M 148 95 L 180 95" />
        {/* 屋頂瓦片與煙囪 */}
        <line x1="164" y1="78" x2="164" y2="88" />
        <rect x="170" y="72" width="5" height="12" />
        <path d="M 172 70 Q 170 62 176 56 Q 182 50 178 44" stroke="#89959b" strokeDasharray="2 2" />
        {/* 木造外露 X 形木桁架 */}
        <line x1="151" y1="98" x2="177" y2="116" stroke="#e17b62" opacity="0.6" />
        <line x1="177" y1="98" x2="151" y2="116" stroke="#e17b62" opacity="0.6" />
        <rect x="156" y="102" width="16" height="12" rx="1" fill="var(--card-bg,#1c222b)" />
        <line x1="164" y1="102" x2="164" y2="114" />
        <line x1="156" y1="108" x2="172" y2="108" />
        {/* 窗台花架 */}
        <rect x="154" y="114" width="20" height="3" rx="1" fill="#3b827e" fillOpacity="0.3" stroke="#3b827e" />

        {/* 右側雙坡屋頂高宅 */}
        <path d="M 182 136 L 182 72 L 202 52 L 222 72 L 222 136" fill="var(--card-bg,#1c222b)" />
        <path d="M 178 74 L 202 50 L 226 74" strokeWidth="1.5" />
        <circle cx="202" cy="64" r="4" />
        <line x1="202" y1="60" x2="202" y2="68" />
        <line x1="198" y1="64" x2="206" y2="64" />
        <rect x="190" y="80" width="8" height="11" rx="1" />
        <rect x="206" y="80" width="8" height="11" rx="1" />
        <rect x="190" y="104" width="8" height="11" rx="1" />
        <rect x="206" y="104" width="8" height="11" rx="1" />
        <rect x="196" y="122" width="12" height="14" rx="1" />
      </g>

      {/* 3. 羅馬三孔拱門大石橋與運河行舟 (x: 230 - 365) */}
      <g>
        {/* 橋墩與 3 個半圓拱門 */}
        <path d="M 230 114 L 365 114" strokeWidth="1.8" />
        <path d="M 230 118 L 365 118" />
        {/* 3 個橋拱 */}
        <path d="M 238 136 Q 260 92 282 136" />
        <path d="M 282 136 Q 304 92 326 136" />
        <path d="M 326 136 Q 348 92 370 136" />
        {/* 橋拱中央拱心石 (Keystone) */}
        <rect x="258" y="93" width="4" height="6" fill="currentColor" opacity="0.5" />
        <rect x="302" y="93" width="4" height="6" fill="currentColor" opacity="0.5" />
        <rect x="346" y="93" width="4" height="6" fill="currentColor" opacity="0.5" />
        {/* 石質護欄直條 */}
        <line x1="235" y1="108" x2="365" y2="108" strokeWidth="1" />
        <line x1="245" y1="108" x2="245" y2="114" />
        <line x1="260" y1="108" x2="260" y2="114" />
        <line x1="275" y1="108" x2="275" y2="114" />
        <line x1="290" y1="108" x2="290" y2="114" />
        <line x1="305" y1="108" x2="305" y2="114" />
        <line x1="320" y1="108" x2="320" y2="114" />
        <line x1="335" y1="108" x2="335" y2="114" />
        <line x1="350" y1="108" x2="350" y2="114" />
        {/* 橋上鑄鐵路燈 */}
        <path d="M 270 108 L 270 94 Q 272 90 276 94" />
        <circle cx="276" cy="94" r="2" fill="#fbbf24" stroke="#fbbf24" />
        <path d="M 330 108 L 330 94 Q 332 90 336 94" />
        <circle cx="336" cy="94" r="2" fill="#fbbf24" stroke="#fbbf24" />
        {/* 運河穿梭的小型貢多拉 / 划槳小舟 */}
        <path d="M 292 136 Q 302 143 316 136 Z" fill="var(--card-bg,#1c222b)" />
        <line x1="304" y1="126" x2="304" y2="136" strokeWidth="1.2" />
        <circle cx="304" cy="124" r="1.8" fill="currentColor" />
        <line x1="303" y1="129" x2="312" y2="138" />
      </g>

      {/* 4. 巨型展開手帳之山與鋼筆紀念碑 (x: 375 - 475) */}
      <g>
        {/* 展開之精裝手帳地貌 */}
        <path d="M 375 136 Q 390 86 422 66 L 426 136" fill="var(--paper,#f5f7f6)" stroke="currentColor" />
        <path d="M 422 66 Q 454 86 475 136" fill="var(--paper,#f5f7f6)" stroke="currentColor" />
        {/* 手帳頁面方格與線條暗示 */}
        <line x1="388" y1="98" x2="416" y2="86" stroke="#89959b" strokeDasharray="2 2" strokeWidth="0.8" />
        <line x1="392" y1="108" x2="418" y2="96" stroke="#89959b" strokeDasharray="2 2" strokeWidth="0.8" />
        <line x1="396" y1="118" x2="420" y2="106" stroke="#89959b" strokeDasharray="2 2" strokeWidth="0.8" />
        <line x1="432" y1="86" x2="460" y2="98" stroke="#89959b" strokeDasharray="2 2" strokeWidth="0.8" />
        <line x1="430" y1="96" x2="456" y2="108" stroke="#89959b" strokeDasharray="2 2" strokeWidth="0.8" />
        <line x1="428" y1="106" x2="452" y2="118" stroke="#89959b" strokeDasharray="2 2" strokeWidth="0.8" />
        {/* 垂掛飄揚的珊瑚色緞帶書籤 */}
        <path d="M 422 66 Q 418 96 427 118 L 423 124 L 432 124 Q 425 96 422 66 Z" fill="#e17b62" stroke="#e17b62" />
        {/* 山巔上的金色鋼筆筆尖地標紀念碑 */}
        <path d="M 418 66 L 422 42 L 426 66 Z" fill="#fbbf24" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="1.4" />
        <circle cx="422" cy="54" r="1.2" fill="#fbbf24" />
        <line x1="422" y1="42" x2="422" y2="54" stroke="#fbbf24" />
        {/* 山麓圍繞的長青松樹與針葉林 */}
        <path d="M 374 136 L 374 118 M 369 130 L 374 122 L 379 130" stroke="#3b827e" />
        <path d="M 470 136 L 470 116 M 465 128 L 470 120 L 475 128" stroke="#3b827e" />
      </g>

      {/* 5. 玻璃花房植物溫室 (Victorian Orangerie) (x: 485 - 565) */}
      <g>
        <rect x="485" y="102" width="76" height="34" rx="2" fill="var(--card-bg,#1c222b)" />
        {/* 拱形玻璃穹頂 */}
        <path d="M 495 102 A 28 28 0 0 1 551 102" />
        {/* 穹頂鑄鐵肋線 */}
        <path d="M 523 74 L 507 102" strokeDasharray="2 2" opacity="0.6" />
        <path d="M 523 74 L 539 102" strokeDasharray="2 2" opacity="0.6" />
        <line x1="523" y1="74" x2="523" y2="102" />
        {/* 頂部通風亭與風向雞 */}
        <rect x="520" y="68" width="6" height="6" rx="1" />
        <line x1="523" y1="68" x2="523" y2="58" />
        <path d="M 520 60 L 526 58 L 523 64 Z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.8" />
        {/* 溫室內部隱約可見之熱帶龜背芋與盆栽 */}
        <path d="M 505 120 Q 501 110 508 106 Q 512 116 505 120 Z" stroke="#3b827e" fill="#3b827e" fillOpacity="0.3" />
        <path d="M 541 120 Q 545 110 538 106 Q 534 116 541 120 Z" stroke="#3b827e" fill="#3b827e" fillOpacity="0.3" />
        <line x1="485" y1="116" x2="561" y2="116" />
      </g>

      {/* 6. 中央歐風宏偉大鐘樓 (Grand Gothic Clock Tower) (x: 575 - 635) */}
      <g>
        {/* 塔身高聳基座與側邊扶壁 */}
        <path d="M 576 136 L 576 56 L 588 38 L 622 38 L 634 56 L 634 136" fill="var(--card-bg,#1c222b)" strokeWidth="1.5" />
        <path d="M 580 136 L 580 56 M 630 136 L 630 56" opacity="0.7" />
        {/* 四面大鐘面 */}
        <rect x="588" y="62" width="34" height="34" rx="3" fill="var(--card-bg,#1c222b)" strokeWidth="1.4" />
        <circle cx="605" cy="79" r="13" strokeWidth="1.5" stroke="#f59e0b" />
        <circle cx="605" cy="79" r="11" strokeDasharray="1 3" strokeWidth="0.8" />
        {/* 指向 10:10 的典雅指針 */}
        <line x1="605" y1="79" x2="600" y2="72" strokeWidth="2" stroke="#f59e0b" />
        <line x1="605" y1="79" x2="612" y2="75" strokeWidth="1.5" stroke="#f59e0b" />
        <circle cx="605" cy="79" r="1.5" fill="#f59e0b" />
        {/* 鐘樓鐘室哥德式尖拱百葉窗 (Louvers) */}
        <path d="M 593 54 L 593 42 Q 597 38 601 42 L 601 54 Z" fill="var(--card-bg,#1c222b)" />
        <path d="M 609 54 L 609 42 Q 613 38 617 42 L 617 54 Z" fill="var(--card-bg,#1c222b)" />
        {/* 頂部四角小尖塔與八角形主尖頂 (Spire) */}
        <path d="M 586 38 L 605 12 L 624 38 Z" fill="var(--card-bg,#1c222b)" strokeWidth="1.5" />
        <line x1="605" y1="12" x2="605" y2="4" strokeWidth="1.5" stroke="#f59e0b" />
        <circle cx="605" cy="4" r="2" fill="#f59e0b" stroke="#f59e0b" />
        {/* 尖塔瓦紋線條 */}
        <line x1="605" y1="12" x2="598" y2="38" opacity="0.6" />
        <line x1="605" y1="12" x2="612" y2="38" opacity="0.6" />
        {/* 塔樓底部拱門 */}
        <path d="M 597 136 L 597 122 Q 605 116 613 122 L 613 136" />
      </g>

      {/* 7. 古典柱列圖書館 / 智慧殿堂 (Museum & Library) (x: 645 - 735) */}
      <g>
        {/* 三角形古典山形牆 (Pediment) 與浮雕 */}
        <path d="M 645 78 L 690 54 L 735 78 Z" fill="var(--card-bg,#1c222b)" strokeWidth="1.5" />
        <circle cx="690" cy="68" r="4" stroke="#e17b62" />
        <line x1="680" y1="69" x2="700" y2="69" stroke="#e17b62" strokeDasharray="1 1" />
        {/* 後方穹頂圓頂 */}
        <path d="M 668 54 A 22 22 0 0 1 712 54" fill="var(--card-bg,#1c222b)" strokeWidth="1.3" />
        <line x1="690" y1="32" x2="690" y2="24" />
        <circle cx="690" cy="24" r="1.5" fill="currentColor" />
        {/* 楣樑與柱頂橫帶 */}
        <rect x="645" y="78" width="90" height="6" fill="var(--card-bg,#1c222b)" />
        {/* 6 根帶凹槽古典石柱 (Colonnade) */}
        <line x1="653" y1="84" x2="653" y2="128" strokeWidth="2.5" />
        <line x1="668" y1="84" x2="668" y2="128" strokeWidth="2.5" />
        <line x1="683" y1="84" x2="683" y2="128" strokeWidth="2.5" />
        <line x1="697" y1="84" x2="697" y2="128" strokeWidth="2.5" />
        <line x1="712" y1="84" x2="712" y2="128" strokeWidth="2.5" />
        <line x1="727" y1="84" x2="727" y2="128" strokeWidth="2.5" />
        {/* 階梯狀基台 */}
        <line x1="640" y1="128" x2="740" y2="128" strokeWidth="1.2" />
        <line x1="638" y1="132" x2="742" y2="132" strokeWidth="1.2" />
        {/* 殿堂中央雙開銅門 */}
        <rect x="684" y="98" width="12" height="20" rx="1" fill="var(--card-bg,#1c222b)" />
        <line x1="690" y1="98" x2="690" y2="118" />
      </g>

      {/* 8. 天空漫遊：浪漫條紋熱氣球與雲端飛鳥 (x: 740 - 840) */}
      <g>
        {/* 巨型條紋熱氣球 (Hot Air Balloon) */}
        <path d="M 760 30 C 760 16 792 16 792 30 C 792 42 782 49 778 52 C 774 49 764 42 764 30 Z" fill="var(--card-bg,#1c222b)" strokeWidth="1.4" />
        {/* 熱氣球彩色弧形條紋 */}
        <path d="M 776 17 Q 770 30 774 52" stroke="#e17b62" />
        <path d="M 776 17 Q 782 30 778 52" stroke="#f59e0b" />
        {/* 燃燒器小火花與吊索 */}
        <path d="M 775 52 Q 776 49 777 52 Z" fill="#f59e0b" stroke="#f59e0b" />
        <line x1="771" y1="52" x2="773" y2="58" />
        <line x1="781" y1="52" x2="779" y2="58" />
        {/* 編織乘客藤籃 */}
        <rect x="771" y="58" width="10" height="6" rx="1" fill="var(--card-bg,#1c222b)" />
        <line x1="771" y1="61" x2="781" y2="61" strokeDasharray="1 1" />
        {/* 雲朵伴隨 */}
        <path d="M 800 32 Q 810 24 822 28 Q 834 20 848 28 Q 858 24 865 34 Q 830 40 800 32 Z" strokeDasharray="2 2" fill="var(--card-bg,#1c222b)" opacity="0.6" />
        {/* 5 隻海鷗/候鳥翱翔 */}
        <path d="M 735 24 Q 738 20 742 24 Q 746 20 749 24" strokeWidth="1" />
        <path d="M 750 16 Q 753 13 756 16 Q 759 13 762 16" strokeWidth="1" />
      </g>

      {/* 9. 宏偉凱旋門與香榭大道鑄鐵路燈 (x: 845 - 935) */}
      <g>
        {/* 凱旋門雙柱拱圈 */}
        <rect x="848" y="70" width="60" height="66" fill="var(--card-bg,#1c222b)" strokeWidth="1.5" />
        {/* 拱圈中央主通道 */}
        <path d="M 865 136 L 865 104 Q 878 92 891 104 L 891 136" fill="var(--paper,#f5f7f6)" strokeWidth="1.4" />
        {/* 閣樓層裝飾雕刻浮雕帶 */}
        <rect x="844" y="66" width="68" height="8" fill="var(--card-bg,#1c222b)" strokeWidth="1.3" />
        <line x1="850" y1="70" x2="906" y2="70" strokeDasharray="2 2" opacity="0.7" />
        {/* 兩側立面浮雕壁柱 */}
        <rect x="852" y="82" width="8" height="42" strokeDasharray="2 2" opacity="0.6" />
        <rect x="896" y="82" width="8" height="42" strokeDasharray="2 2" opacity="0.6" />
        {/* 雙頭歐風鑄鐵街燈 */}
        <path d="M 922 136 L 922 108 M 916 112 Q 922 106 928 112" />
        <circle cx="916" cy="112" r="2.5" fill="#fbbf24" stroke="#fbbf24" />
        <circle cx="928" cy="112" r="2.5" fill="#fbbf24" stroke="#fbbf24" />
      </g>

      {/* 10. 手帳靈魂建築群：鉛筆尖塔與鋼筆尖天際線 (x: 945 - 1025) */}
      <g>
        {/* 六角鉛筆高塔 */}
        <rect x="952" y="52" width="16" height="84" fill="var(--card-bg,#1c222b)" />
        <line x1="960" y1="52" x2="960" y2="136" opacity="0.6" />
        {/* 削筆木質錐形與石墨筆芯尖端 */}
        <path d="M 952 52 L 960 22 L 968 52 Z" fill="#fff9f6" stroke="currentColor" strokeWidth="1.3" />
        <polygon points="960,22 957,32 963,32" fill="currentColor" />
        {/* 鉛筆頂部金屬金箍 (Ferrule) */}
        <line x1="952" y1="58" x2="968" y2="58" stroke="#f59e0b" strokeWidth="1.5" />

        {/* 經典圓弧鋼筆筆尖大樓 (Quill & Nib Skyscraper) */}
        <path d="M 982 136 L 982 66 Q 982 32 996 16 Q 1010 32 1010 66 L 1010 136" fill="var(--card-bg,#1c222b)" strokeWidth="1.4" />
        {/* 金黃筆尖表面分界線與呼吸孔 */}
        <circle cx="996" cy="42" r="2.5" fill="#fbbf24" stroke="#fbbf24" />
        <line x1="996" y1="16" x2="996" y2="40" stroke="#fbbf24" strokeWidth="1.8" />
        <path d="M 988 56 Q 996 50 1004 56" stroke="#fbbf24" opacity="0.7" />
        {/* 塔樓長條窗格 */}
        <rect x="992" y="80" width="8" height="14" rx="1" />
        <rect x="992" y="104" width="8" height="14" rx="1" />
      </g>

      {/* 11. 經典傳統荷蘭風車與水磨坊 (x: 1030 - 1125) */}
      <g>
        {/* 風車八角形磨坊塔身 */}
        <path d="M 1045 136 L 1052 76 L 1080 76 L 1087 136 Z" fill="var(--card-bg,#1c222b)" strokeWidth="1.4" />
        {/* 圓弧草頂風車帽 (Cap) */}
        <path d="M 1048 76 Q 1066 60 1084 76 Z" fill="var(--card-bg,#1c222b)" />
        <circle cx="1066" cy="74" r="3.5" fill="currentColor" />
        {/* 4 片精緻格狀翼板 (Lattice Sail Blades) */}
        <line x1="1066" y1="36" x2="1066" y2="112" strokeWidth="1.8" />
        <line x1="1028" y1="74" x2="1104" y2="74" strokeWidth="1.8" />
        {/* 翼板網格階梯 */}
        <line x1="1061" y1="42" x2="1071" y2="42" opacity="0.7" />
        <line x1="1061" y1="52" x2="1071" y2="52" opacity="0.7" />
        <line x1="1061" y1="96" x2="1071" y2="96" opacity="0.7" />
        <line x1="1061" y1="106" x2="1071" y2="106" opacity="0.7" />
        <line x1="1036" y1="69" x2="1036" y2="79" opacity="0.7" />
        <line x1="1046" y1="69" x2="1046" y2="79" opacity="0.7" />
        <line x1="1086" y1="69" x2="1086" y2="79" opacity="0.7" />
        <line x1="1096" y1="69" x2="1096" y2="79" opacity="0.7" />
        {/* 水車磨坊側輪 */}
        <circle cx="1102" cy="130" r="14" strokeDasharray="3 2" opacity="0.75" />
        <line x1="1102" y1="116" x2="1102" y2="144" />
        <line x1="1088" y1="130" x2="1116" y2="130" />
      </g>

      {/* 12. 高山星象天文台與折射望遠鏡 (x: 1140 - 1235) */}
      <g>
        {/* 蜿蜒登山石階 */}
        <path d="M 1130 136 Q 1150 120 1170 105" strokeDasharray="2 2" opacity="0.6" />
        {/* 天文台圓柱基座 */}
        <rect x="1165" y="84" width="48" height="52" rx="2" fill="var(--card-bg,#1c222b)" strokeWidth="1.4" />
        {/* 半球形觀測圓頂 (Observatory Dome) */}
        <path d="M 1162 84 A 27 27 0 0 1 1216 84" fill="var(--card-bg,#1c222b)" strokeWidth="1.4" />
        {/* 開啟天窗與伸出之大型天文望遠鏡 (Telescope) */}
        <line x1="1189" y1="57" x2="1189" y2="84" strokeDasharray="2 2" />
        <path d="M 1195 68 L 1226 40 L 1230 44 L 1199 72 Z" fill="#3b827e" fillOpacity="0.3" stroke="#3b827e" strokeWidth="1.6" />
        <ellipse cx="1228" cy="42" rx="3" ry="5" fill="#fbbf24" stroke="#fbbf24" />
        {/* 避雷針與風速儀 */}
        <line x1="1175" y1="84" x2="1175" y2="72" />
        <circle cx="1175" cy="72" r="1.5" />
      </g>

      {/* 13. 夜空之境：金色新月與星座星宿 (x: 1240 - 1340) */}
      <g>
        {/* 經典童話新月 */}
        <path d="M 1256 16 A 16 16 0 1 0 1274 42 A 13 13 0 1 1 1256 16 Z" fill="#fbbf24" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1.3" />
        {/* 北斗七星星座節點 */}
        <circle cx="1295" cy="20" r="1.8" fill="#fbbf24" stroke="#fbbf24" />
        <circle cx="1308" cy="24" r="1.8" fill="#fbbf24" stroke="#fbbf24" />
        <circle cx="1318" cy="34" r="1.8" fill="#fbbf24" stroke="#fbbf24" />
        <circle cx="1330" cy="38" r="1.8" fill="#fbbf24" stroke="#fbbf24" />
        <circle cx="1326" cy="50" r="1.8" fill="#fbbf24" stroke="#fbbf24" />
        <circle cx="1342" cy="52" r="1.8" fill="#fbbf24" stroke="#fbbf24" />
        <circle cx="1344" cy="40" r="1.8" fill="#fbbf24" stroke="#fbbf24" />
        {/* 星座連線 */}
        <line x1="1295" y1="20" x2="1308" y2="24" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
        <line x1="1308" y1="24" x2="1318" y2="34" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
        <line x1="1318" y1="34" x2="1330" y2="38" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
        <line x1="1330" y1="38" x2="1326" y2="50" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
        <line x1="1326" y1="50" x2="1342" y2="52" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
        <line x1="1342" y1="52" x2="1344" y2="40" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
        <line x1="1344" y1="40" x2="1330" y2="38" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
      </g>

      {/* 14. 雄偉海角燈塔與掃描探照光束 (Coastal Lighthouse) (x: 1350 - 1420) */}
      <g>
        {/* 險峻海岸礁石懸崖 */}
        <path d="M 1345 136 Q 1358 114 1370 102 L 1405 102 Q 1416 118 1430 136" fill="var(--card-bg,#1c222b)" strokeWidth="1.3" />
        {/* 漸縮式石造燈塔塔身 */}
        <path d="M 1374 102 L 1380 40 L 1396 40 L 1402 102 Z" fill="var(--card-bg,#1c222b)" strokeWidth="1.5" />
        {/* 經典紅白螺旋條紋 (Candy Stripe) */}
        <line x1="1375" y1="92" x2="1401" y2="82" stroke="#e17b62" strokeWidth="2.5" />
        <line x1="1377" y1="74" x2="1399" y2="64" stroke="#e17b62" strokeWidth="2.5" />
        <line x1="1379" y1="54" x2="1397" y2="46" stroke="#e17b62" strokeWidth="2.5" />
        {/* 燈塔觀景圍欄與燈室 (Lantern Room) */}
        <line x1="1376" y1="40" x2="1400" y2="40" strokeWidth="2" />
        <rect x="1381" y="28" width="14" height="12" rx="1" fill="#fff0eb" stroke="#f59e0b" />
        <circle cx="1388" cy="34" r="3" fill="#fbbf24" />
        {/* 燈塔銅頂與風標針 */}
        <path d="M 1380 28 Q 1388 20 1396 28 Z" fill="var(--card-bg,#1c222b)" strokeWidth="1.3" />
        <line x1="1388" y1="20" x2="1388" y2="12" strokeWidth="1.2" />
        {/* 遠程探照燈光束 (掃射夜空) */}
        <line x1="1395" y1="32" x2="1490" y2="12" stroke="#fbbf24" strokeDasharray="3 3" strokeWidth="1.2" opacity="0.75" />
        <line x1="1395" y1="36" x2="1520" y2="42" stroke="#fbbf24" strokeDasharray="3 3" strokeWidth="1.2" opacity="0.75" />
      </g>

      {/* 15. 海港、木棧碼頭與雙桅大帆船 (Ocean Schooner) (x: 1430 - 1600) */}
      <g>
        {/* 碼頭木棧道與防波堤繫船柱 */}
        <rect x="1430" y="132" width="28" height="4" fill="var(--card-bg,#1c222b)" />
        <line x1="1436" y1="132" x2="1436" y2="128" strokeWidth="2" />
        <line x1="1450" y1="132" x2="1450" y2="128" strokeWidth="2" />
        <rect x="1440" y="126" width="6" height="6" rx="1" />

        {/* 雙桅帆船木造船身 */}
        <path d="M 1475 140 L 1545 140 Q 1558 138 1564 130 L 1468 130 Z" fill="var(--card-bg,#1c222b)" strokeWidth="1.5" />
        {/* 船艏斜桅 (Bowsprit) */}
        <line x1="1564" y1="130" x2="1582" y2="122" strokeWidth="1.5" />
        {/* 主桅與前桅杆 */}
        <line x1="1496" y1="130" x2="1496" y2="56" strokeWidth="1.8" />
        <line x1="1530" y1="130" x2="1530" y2="50" strokeWidth="1.8" />
        {/* 鼓脹的白色主帆布與三角帆 */}
        <path d="M 1496 62 Q 1475 92 1496 122 L 1496 62 Z" fill="#fff9f6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 1530 56 Q 1510 88 1530 120 L 1530 56 Z" fill="#fff9f6" stroke="currentColor" strokeWidth="1.2" />
        {/* 前三角首帆 (Jib) */}
        <path d="M 1530 62 L 1572 126 L 1530 120 Z" fill="#fff9f6" stroke="currentColor" strokeWidth="1.2" />
        {/* 桅頂迎風旗幟 */}
        <path d="M 1496 56 L 1486 52 L 1496 48 Z" fill="#e17b62" />
        <path d="M 1530 50 L 1520 46 L 1530 42 Z" fill="#e17b62" />

        {/* 海面飛翔的海鷗 */}
        <path d="M 1462 82 Q 1466 78 1470 82 Q 1474 78 1478 82" strokeWidth="1" />
        <path d="M 1570 72 Q 1574 68 1578 72 Q 1582 68 1586 72" strokeWidth="1" />

        {/* 右側地平線連綿松林海角與波浪 */}
        <path d="M 1545 136 Q 1572 118 1600 136" />
        <path d="M 1585 136 L 1585 120 M 1581 130 L 1585 124 L 1589 130" stroke="#3b827e" />
      </g>
    </svg>
  );
}

/**
 * 手帳空間卡片封面主題手繪插圖飾紋 (CoverDoodle)
 * 為 6 款彩色卡片封面與回收桶封面提供專屬手繪向量小插圖
 */
export function CoverDoodle({ themeIndex = 0, isTrash = false, className = 'w-24 h-16 pointer-events-none opacity-45 dark:opacity-35' }) {
  if (isTrash) {
    return (
      <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* 回收籃與綠葉 */}
        <rect x="35" y="24" width="30" height="24" rx="3" stroke="#64748b" />
        <line x1="42" y1="24" x2="42" y2="48" stroke="#64748b" strokeDasharray="2 2" />
        <line x1="50" y1="24" x2="50" y2="48" stroke="#64748b" strokeDasharray="2 2" />
        <line x1="58" y1="24" x2="58" y2="48" stroke="#64748b" strokeDasharray="2 2" />
        {/* 紙質封套與發芽嫩葉 */}
        <path d="M 40 18 L 60 18 L 65 24 L 35 24 Z" stroke="#64748b" />
        <path d="M 50 14 Q 56 6 62 10 Q 58 18 50 14 Z" stroke="#34d399" fill="#34d399" fillOpacity="0.3" />
        <circle cx="28" cy="35" r="1.5" fill="#64748b" opacity="0.5" />
        <circle cx="74" cy="32" r="1.5" fill="#64748b" opacity="0.5" />
      </svg>
    );
  }

  switch (themeIndex % 6) {
    case 0: // 珊瑚蜜桃：桃花花瓣、手沖馬克杯與書籤緞帶
      return (
        <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* 馬克杯 */}
          <path d="M 52 25 L 54 47 A 4 4 0 0 0 66 47 L 68 25 Z" stroke="#f08b73" fill="#f08b73" fillOpacity="0.12" />
          <path d="M 68 28 C 74 28 74 40 68 40" stroke="#f08b73" />
          <path d="M 58 18 Q 61 12 58 6" stroke="#f08b73" strokeDasharray="2 2" strokeWidth="1" />
          {/* 蜜桃花與花瓣 */}
          <circle cx="34" cy="36" r="3" stroke="#f08b73" fill="#f08b73" fillOpacity="0.3" />
          <path d="M 34 29 Q 37 32 34 36" stroke="#f08b73" />
          <path d="M 41 36 Q 37 39 34 36" stroke="#f08b73" />
          <path d="M 34 43 Q 31 39 34 36" stroke="#f08b73" />
          <path d="M 27 36 Q 31 32 34 36" stroke="#f08b73" />
          <circle cx="25" cy="22" r="1.5" fill="#f08b73" />
          <circle cx="78" cy="44" r="1.5" fill="#f08b73" />
        </svg>
      );

    case 1: // 薄荷松綠：小盆栽、多肉植物與澆水嫩葉
      return (
        <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* 盆栽 */}
          <path d="M 50 48 L 47 32 L 67 32 L 64 48 Z" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.15" />
          <line x1="45" y1="32" x2="69" y2="32" stroke="#38b2ac" />
          {/* 多肉/闊葉 */}
          <path d="M 57 32 Q 44 14 34 20 Q 44 32 57 32 Z" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.25" />
          <path d="M 57 32 Q 57 8 68 12 Q 65 28 57 32 Z" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.25" />
          <path d="M 57 32 Q 74 18 80 26 Q 68 35 57 32 Z" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.25" />
          <circle cx="26" cy="38" r="1.5" fill="#38b2ac" />
          <circle cx="78" cy="18" r="1.5" fill="#38b2ac" />
        </svg>
      );

    case 2: // 天峰蔚藍：摺紙紙飛機與天空雲朵
      return (
        <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* 雲朵 */}
          <path d="M 28 42 Q 33 34 42 36 Q 50 30 58 38 Q 66 36 68 44 Q 50 48 28 42 Z" stroke="#60a5fa" strokeDasharray="2 2" fill="#60a5fa" fillOpacity="0.08" />
          {/* 紙飛機 */}
          <path d="M 44 26 L 76 14 L 64 38 L 56 30 Z" stroke="#60a5fa" fill="#60a5fa" fillOpacity="0.2" />
          <line x1="76" y1="14" x2="56" y2="30" stroke="#60a5fa" />
          {/* 飛行軌跡 */}
          <path d="M 22 36 Q 30 22 42 27" stroke="#60a5fa" strokeDasharray="2 2" strokeWidth="1" />
          <circle cx="78" cy="38" r="1.5" fill="#60a5fa" />
        </svg>
      );

    case 3: // 薰衣草紫：新月、羽毛筆與魔幻星宿
      return (
        <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* 新月 */}
          <path d="M 56 12 A 14 14 0 1 0 70 34 A 12 12 0 1 1 56 12 Z" stroke="#a78bfa" fill="#a78bfa" fillOpacity="0.2" />
          {/* 羽毛沾水筆 */}
          <path d="M 38 48 Q 44 32 32 18 Q 48 22 48 40 L 46 48 Z" stroke="#a78bfa" fill="#a78bfa" fillOpacity="0.12" />
          <line x1="46" y1="48" x2="40" y2="34" stroke="#a78bfa" />
          {/* 星星 */}
          <path d="M 74 16 Q 74 20 70 20 Q 74 20 74 24 Q 74 20 78 20 Q 74 20 74 16 Z" stroke="#a78bfa" fill="#a78bfa" />
          <circle cx="26" cy="36" r="1.5" fill="#a78bfa" />
          <circle cx="78" cy="42" r="1.5" fill="#a78bfa" />
        </svg>
      );

    case 4: // 晨曦暖黃：溫暖晨光、咖啡與復古小鬧鐘
      return (
        <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* 復古小鬧鐘 */}
          <circle cx="56" cy="36" r="12" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.15" />
          <line x1="56" y1="36" x2="56" y2="29" stroke="#fbbf24" />
          <line x1="56" y1="36" x2="62" y2="36" stroke="#fbbf24" />
          {/* 鬧鐘雙耳 */}
          <path d="M 46 25 Q 48 21 52 25" stroke="#fbbf24" />
          <path d="M 60 25 Q 64 21 66 25" stroke="#fbbf24" />
          {/* 鐘腳 */}
          <line x1="48" y1="46" x2="44" y2="50" stroke="#fbbf24" />
          <line x1="64" y1="46" x2="68" y2="50" stroke="#fbbf24" />
          {/* 晨光光暈線 */}
          <line x1="32" y1="18" x2="38" y2="24" stroke="#fbbf24" strokeDasharray="2 2" />
          <line x1="28" y1="30" x2="36" y2="30" stroke="#fbbf24" strokeDasharray="2 2" />
          <circle cx="76" cy="20" r="1.5" fill="#fbbf24" />
        </svg>
      );

    default: // 典雅焦糖：復古相機、羅盤與旅行者印章
      return (
        <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* 復古相機 */}
          <rect x="42" y="24" width="28" height="20" rx="3" stroke="#e08b68" fill="#e08b68" fillOpacity="0.12" />
          <circle cx="56" cy="34" r="6" stroke="#e08b68" fill="#e08b68" fillOpacity="0.2" />
          <rect x="47" y="20" width="8" height="4" rx="1" stroke="#e08b68" />
          <circle cx="65" cy="28" r="1.5" fill="#e08b68" />
          {/* 旅行戳印 */}
          <circle cx="30" cy="38" r="10" stroke="#e08b68" strokeDasharray="3 2" opacity="0.6" />
          <line x1="24" y1="38" x2="36" y2="38" stroke="#e08b68" opacity="0.6" />
          <circle cx="78" cy="22" r="1.5" fill="#e08b68" />
        </svg>
      );
  }
}

/**
 * 建立新空間卡片專屬插圖 (CreateSpaceDoodle)
 * 空白畫布畫架、鉛筆與靈感光芒
 */
export function CreateSpaceDoodle({ className = 'w-16 h-16 text-[var(--coral,#e17b62)]' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 畫架 */}
      <line x1="22" y1="20" x2="16" y2="56" />
      <line x1="42" y1="20" x2="48" y2="56" />
      <line x1="32" y1="12" x2="32" y2="56" opacity="0.5" />
      <line x1="14" y1="44" x2="50" y2="44" />
      {/* 畫布 */}
      <rect x="18" y="16" width="28" height="24" rx="2" fill="var(--card-bg,#1c222b)" stroke="#f08b73" />
      {/* 畫布中心的加號與星星 */}
      <circle cx="32" cy="28" r="7" stroke="#f08b73" fill="#f08b73" fillOpacity="0.2" />
      <line x1="32" y1="24" x2="32" y2="32" stroke="#f08b73" strokeWidth="2" />
      <line x1="28" y1="28" x2="36" y2="28" stroke="#f08b73" strokeWidth="2" />
      {/* 靈感星芒 */}
      <path d="M 48 10 Q 48 14 45 14 Q 48 14 48 18 Q 48 14 51 14 Q 48 14 48 10 Z" stroke="#fbbf24" fill="#fbbf24" />
      <circle cx="14" cy="24" r="1.5" fill="#38b2ac" />
    </svg>
  );
}

/**
 * 側邊欄底部配額卡片專屬手繪書架小品 (BookshelfDoodle)
 * 排列整齊的手帳本、書擋與小盆栽
 */
export function BookshelfDoodle({ className = 'w-full h-12 text-[var(--ink,#1f2a2e)]' }) {
  return (
    <svg viewBox="0 0 200 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 層架橫板 */}
      <line x1="10" y1="36" x2="190" y2="36" strokeWidth="1.8" />
      {/* 左側書籍排立 */}
      <rect x="25" y="12" width="8" height="24" rx="1" stroke="#f08b73" fill="#f08b73" fillOpacity="0.15" />
      <rect x="34" y="8" width="9" height="28" rx="1" stroke="#38b2ac" fill="#38b2ac" fillOpacity="0.15" />
      <rect x="44" y="14" width="7" height="22" rx="1" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.15" />
      {/* 傾斜倚靠的筆記本 */}
      <path d="M 52 16 L 62 12 L 67 34 L 57 36 Z" stroke="#a78bfa" fill="#a78bfa" fillOpacity="0.15" />
      {/* 小仙人掌盆栽 */}
      <path d="M 85 36 L 87 27 L 97 27 L 99 36 Z" fill="currentColor" fillOpacity="0.1" />
      <ellipse cx="92" cy="22" rx="4" ry="7" stroke="#34d399" fill="#34d399" fillOpacity="0.25" />
      <path d="M 88 23 Q 86 20 88 18" stroke="#34d399" />
      <path d="M 96 21 Q 98 18 96 16" stroke="#34d399" />
      {/* 右側書籍平疊 */}
      <rect x="120" y="30" width="30" height="6" rx="1" />
      <rect x="122" y="24" width="26" height="6" rx="1" />
      <rect x="125" y="18" width="20" height="6" rx="1" stroke="#f08b73" fill="#f08b73" fillOpacity="0.2" />
      {/* 書擋 */}
      <path d="M 160 36 L 160 18 L 166 36 Z" />
    </svg>
  );
}

/**
 * 貨架空欄位放置導引插畫 (EmptyShelfBasketDoodle)
 */
export function EmptyShelfBasketDoodle({ className = 'w-24 h-20 text-[var(--muted,#89959b)]' }) {
  return (
    <svg viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 收納籃/置物盒 */}
      <path d="M 18 28 L 22 52 L 58 52 L 62 28 Z" fill="currentColor" fillOpacity="0.05" />
      <line x1="14" y1="28" x2="66" y2="28" />
      <line x1="28" y1="36" x2="52" y2="36" strokeDasharray="2 2" opacity="0.6" />
      {/* 拖曳指向箭頭 */}
      <path d="M 40 8 L 40 22 M 34 16 L 40 22 L 46 16" stroke="#f08b73" strokeWidth="2" />
      <circle cx="26" cy="14" r="1.5" fill="#fbbf24" />
      <circle cx="54" cy="14" r="1.5" fill="#38b2ac" />
    </svg>
  );
}

/**
 * 登入 / 註冊迎賓手繪插圖 (LoginWelcomeIllustration)
 * 溫暖手帳、蒸氣咖啡杯、鋼筆、眼鏡與星芒裝飾
 */
export function LoginWelcomeIllustration({ className = 'w-56 h-24' }) {
  return (
    <svg viewBox="0 0 240 100" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 桌面底線 */}
      <line x1="20" y1="90" x2="220" y2="90" strokeDasharray="3 3" opacity="0.3" />

      {/* 左側：展開的手帳筆記本 */}
      <g transform="translate(30, 26)">
        {/* 手帳書皮底板 */}
        <path d="M 4 58 L 56 62 L 108 58 L 104 12 L 56 16 L 8 12 Z" fill="var(--paper,#f5f7f6)" stroke="currentColor" />
        {/* 手帳中脊 */}
        <line x1="56" y1="16" x2="56" y2="62" stroke="#e17b62" strokeWidth="1.8" />
        {/* 左頁線條 */}
        <line x1="18" y1="24" x2="48" y2="24" stroke="#89959b" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="18" y1="32" x2="48" y2="32" stroke="#89959b" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="18" y1="40" x2="42" y2="40" stroke="#89959b" strokeWidth="1" strokeDasharray="2 2" />
        {/* 右頁清單方塊與線條 */}
        <rect x="64" y="22" width="5" height="5" rx="1" stroke="#3b827e" />
        <line x1="74" y1="25" x2="98" y2="25" stroke="#89959b" strokeWidth="1" />
        <rect x="64" y="32" width="5" height="5" rx="1" stroke="#3b827e" />
        <line x1="74" y1="35" x2="98" y2="35" stroke="#89959b" strokeWidth="1" />
        <rect x="64" y="42" width="5" height="5" rx="1" stroke="#e17b62" />
        <line x1="74" y1="45" x2="92" y2="45" stroke="#89959b" strokeWidth="1" />
        {/* 紅色書籤帶 */}
        <path d="M 56 62 Q 54 74 62 76 L 66 70 L 70 76 Q 60 70 56 62 Z" fill="#e17b62" stroke="#e17b62" />
      </g>

      {/* 右側：熱氣騰騰的馬克杯 */}
      <g transform="translate(156, 38)">
        {/* 杯身 */}
        <rect x="8" y="16" width="30" height="34" rx="4" fill="var(--card-bg,#1c222b)" stroke="#e17b62" />
        {/* 杯把手 */}
        <path d="M 38 24 Q 48 24 48 33 Q 48 42 38 42" stroke="#e17b62" strokeWidth="1.5" />
        {/* 熱氣蒸氣波浪 */}
        <path d="M 16 10 Q 14 4 18 0" stroke="#e17b62" strokeWidth="1.2" opacity="0.7" />
        <path d="M 23 12 Q 21 6 25 2" stroke="#e17b62" strokeWidth="1.2" opacity="0.85" />
        <path d="M 30 10 Q 28 4 32 0" stroke="#e17b62" strokeWidth="1.2" opacity="0.7" />
        {/* 杯上愛心印花 */}
        <path d="M 23 33 Q 23 31 21 31 Q 19 31 19 33 Q 19 36 23 39 Q 27 36 27 33 Q 27 31 25 31 Q 23 31 23 33 Z" fill="#e17b62" stroke="#e17b62" strokeWidth="0.8" />
      </g>

      {/* 前方斜躺的鋼筆 */}
      <g transform="translate(90, 78)">
        <line x1="0" y1="8" x2="45" y2="4" stroke="#3b827e" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 45 4 L 52 3.5 L 45 2.5 Z" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1" />
        <line x1="12" y1="9" x2="12" y2="5" stroke="#fbbf24" strokeWidth="1.5" />
      </g>

      {/* 飄浮靈感小星芒 */}
      <path d="M 28 16 Q 28 20 25 20 Q 28 20 28 24 Q 28 20 31 20 Q 28 20 28 16 Z" stroke="#fbbf24" fill="#fbbf24" />
      <circle cx="148" cy="22" r="1.5" fill="#3b827e" />
      <circle cx="215" cy="30" r="1.5" fill="#fbbf24" />
      <circle cx="16" cy="45" r="1.2" fill="#e17b62" />
    </svg>
  );
}

/**
 * 備份與檔案收納手繪裝飾插圖 (BackupArchiveDoodle)
 */
export function BackupArchiveDoodle({ className = 'w-32 h-16' }) {
  return (
    <svg viewBox="0 0 140 70" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 檔案收納箱 */}
      <rect x="25" y="22" width="90" height="42" rx="4" fill="var(--card-bg,#1c222b)" stroke="currentColor" />
      {/* 箱蓋邊緣 */}
      <path d="M 22 22 L 25 14 L 115 14 L 118 22 Z" fill="var(--paper,#f5f7f6)" stroke="currentColor" />
      {/* 箱把手 */}
      <rect x="58" y="38" width="24" height="8" rx="2" stroke="#e17b62" fill="currentColor" fillOpacity="0.05" />
      {/* 露出箱口的資料夾與標籤 */}
      <path d="M 38 14 L 38 6 L 56 6 L 62 10 L 80 10 L 80 14" stroke="#3b827e" fill="#3b827e" fillOpacity="0.15" />
      <line x1="44" y1="10" x2="52" y2="10" stroke="#3b827e" />
      {/* 向上與向下資料流動箭頭 */}
      <path d="M 98 4 L 98 12 M 95 9 L 98 12 L 101 9" stroke="#fbbf24" strokeWidth="1.6" />
      <circle cx="108" cy="8" r="1.5" fill="#e17b62" />
      <circle cx="18" cy="36" r="1.5" fill="#3b827e" />
    </svg>
  );
}

/**
 * 紙質與主題調色盤手繪裝飾插圖 (ThemePaperDoodle)
 */
export function ThemePaperDoodle({ className = 'w-28 h-14' }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 疊放紙張 */}
      <rect x="18" y="14" width="44" height="38" rx="3" transform="rotate(-6 18 14)" stroke="#89959b" fill="var(--card-bg,#1c222b)" />
      <rect x="36" y="10" width="44" height="38" rx="3" transform="rotate(4 36 10)" stroke="#e17b62" fill="#fff9f6" fillOpacity="0.8" />
      {/* 網格紋理暗示 */}
      <line x1="44" y1="18" x2="72" y2="20" stroke="#f7d2c8" strokeDasharray="2 2" />
      <line x1="44" y1="26" x2="72" y2="28" stroke="#f7d2c8" strokeDasharray="2 2" />
      {/* 水彩畫筆 */}
      <path d="M 88 12 L 98 22 L 76 44 L 68 46 L 70 38 Z" stroke="#3b827e" fill="#3b827e" fillOpacity="0.2" />
      <line x1="86" y1="14" x2="94" y2="22" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="64" cy="50" r="2" fill="#e17b62" />
      <circle cx="20" cy="18" r="1.5" fill="#fbbf24" />
    </svg>
  );
}

/**
 * 置頂卡片專屬手繪和紙膠帶飾紋 (WashiTapePinDoodle)
 * 半透明膠帶條，帶有撕裂鋸齒邊緣與溫暖格子斜紋
 */
export function WashiTapePinDoodle({ className = 'w-24 h-7' }) {
  return (
    <svg viewBox="0 0 96 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 和紙膠帶主體 (半透明質地) */}
      <path
        d="M 6 4 L 90 4 L 88 8 L 92 14 L 87 20 L 91 24 L 6 24 L 8 20 L 4 14 L 9 8 Z"
        fill="#e17b62"
        fillOpacity="0.22"
        stroke="#e17b62"
        strokeWidth="1.2"
      />
      {/* 和紙微撕裂邊緣細線 */}
      <path d="M 6 4 L 9 8 L 4 14 L 8 20 L 6 24" stroke="#e17b62" strokeWidth="1.4" opacity="0.8" />
      <path d="M 90 4 L 88 8 L 92 14 L 87 20 L 91 24" stroke="#e17b62" strokeWidth="1.4" opacity="0.8" />
      {/* 內部手繪裝飾紋理 (小圓點與幾何斜紋) */}
      <line x1="22" y1="6" x2="16" y2="22" stroke="#e17b62" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
      <line x1="36" y1="6" x2="30" y2="22" stroke="#e17b62" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
      <line x1="50" y1="6" x2="44" y2="22" stroke="#e17b62" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
      <line x1="64" y1="6" x2="58" y2="22" stroke="#e17b62" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
      <line x1="78" y1="6" x2="72" y2="22" stroke="#e17b62" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
      {/* 圖釘微光芒 */}
      <circle cx="48" cy="14" r="2.5" fill="#ffffff" stroke="#e17b62" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * 空間 QR Code 航空郵票與波浪郵戳飾紋 (AirmailStampDoodle)
 */
export function AirmailStampDoodle({ className = 'w-24 h-16' }) {
  return (
    <svg viewBox="0 0 100 68" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 郵票齒孔外框 */}
      <rect x="8" y="8" width="46" height="52" rx="3" stroke="#e17b62" strokeDasharray="3 3" fill="var(--card-bg,#1c222b)" />
      <rect x="13" y="13" width="36" height="42" rx="2" stroke="#e17b62" fill="#fff0eb" fillOpacity="0.2" />
      {/* 郵票內愛心印花 */}
      <path d="M 31 32 Q 31 29 28 29 Q 25 29 25 32 Q 25 36 31 40 Q 37 36 37 32 Q 37 29 34 29 Q 31 29 31 32 Z" fill="#e17b62" stroke="#e17b62" />
      <text x="31" y="49" textAnchor="middle" fontSize="6" fill="#e17b62" fontWeight="bold" stroke="none">AIR MAIL</text>
      
      {/* 圓形紀念郵戳 */}
      <circle cx="68" cy="30" r="16" stroke="#3b827e" strokeWidth="1.2" opacity="0.85" />
      <circle cx="68" cy="30" r="13" stroke="#3b827e" strokeDasharray="2 2" opacity="0.6" />
      <path d="M 60 30 L 76 30" stroke="#3b827e" opacity="0.8" />
      
      {/* 波浪郵戳消印線條 */}
      <path d="M 64 52 Q 74 48 84 52 Q 94 56 100 52" stroke="#3b827e" strokeWidth="1.3" opacity="0.75" />
      <path d="M 64 57 Q 74 53 84 57 Q 94 61 100 57" stroke="#3b827e" strokeWidth="1.3" opacity="0.75" />
    </svg>
  );
}

/**
 * 邀請碼通關黃銅鑰匙飾紋 (VintageKeyDoodle)
 */
export function VintageKeyDoodle({ className = 'w-16 h-16' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 復古黃銅鑰匙握柄 (愛心鏤空) */}
      <circle cx="22" cy="22" r="13" stroke="#f59e0b" fill="#fef3c7" fillOpacity="0.2" />
      <circle cx="22" cy="22" r="7" stroke="#f59e0b" />
      {/* 鑰匙長桿 */}
      <line x1="31" y1="31" x2="52" y2="52" stroke="#f59e0b" strokeWidth="2.5" />
      {/* 齒痕 */}
      <line x1="47" y1="47" x2="54" y2="40" stroke="#f59e0b" strokeWidth="2.2" />
      <line x1="41" y1="41" x2="46" y2="36" stroke="#f59e0b" strokeWidth="2.2" />
      <line x1="50" y1="50" x2="55" y2="45" stroke="#f59e0b" strokeWidth="2" />
      {/* 星塵光芒 */}
      <path d="M 22 4 Q 22 8 19 8 Q 22 8 22 12 Q 22 8 25 8 Q 22 8 22 4 Z" fill="#f59e0b" stroke="#f59e0b" />
      <circle cx="56" cy="24" r="1.5" fill="#3b827e" />
      <circle cx="36" cy="12" r="1.2" fill="#e17b62" />
    </svg>
  );
}

/**
 * 建立空間方格藍圖草稿飾紋 (DraftingNotebookDoodle)
 */
export function DraftingNotebookDoodle({ className = 'w-20 h-16' }) {
  return (
    <svg viewBox="0 0 80 64" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 方格藍圖底紙 */}
      <rect x="8" y="10" width="56" height="46" rx="3" stroke="#60a5fa" fill="var(--card-bg,#1c222b)" strokeDasharray="3 3" />
      {/* 藍圖網格線 */}
      <line x1="16" y1="10" x2="16" y2="56" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
      <line x1="28" y1="10" x2="28" y2="56" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
      <line x1="40" y1="10" x2="40" y2="56" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
      <line x1="52" y1="10" x2="52" y2="56" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
      <line x1="8" y1="22" x2="64" y2="22" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
      <line x1="8" y1="34" x2="64" y2="34" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
      <line x1="8" y1="46" x2="64" y2="46" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
      
      {/* 繪圖圓規 */}
      <path d="M 50 6 L 40 40 L 58 46" stroke="#e17b62" strokeWidth="1.6" />
      <circle cx="50" cy="6" r="3" fill="#e17b62" />
      {/* 繪圖弧線 */}
      <path d="M 28 44 A 16 16 0 0 1 54 44" stroke="#e17b62" strokeDasharray="2 2" opacity="0.7" />
    </svg>
  );
}

/**
 * 創客工具工作台飾紋 (CraftStudioDoodle)
 */
export function CraftStudioDoodle({ className = 'w-24 h-14' }) {
  return (
    <svg viewBox="0 0 100 56" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 切割墊底板 */}
      <rect x="6" y="14" width="70" height="36" rx="2" stroke="#3b827e" fill="var(--card-bg,#1c222b)" />
      <line x1="6" y1="26" x2="76" y2="26" stroke="#3b827e" opacity="0.4" strokeDasharray="2 2" />
      <line x1="6" y1="38" x2="76" y2="38" stroke="#3b827e" opacity="0.4" strokeDasharray="2 2" />
      <line x1="24" y1="14" x2="24" y2="50" stroke="#3b827e" opacity="0.4" strokeDasharray="2 2" />
      <line x1="42" y1="14" x2="42" y2="50" stroke="#3b827e" opacity="0.4" strokeDasharray="2 2" />
      <line x1="60" y1="14" x2="60" y2="50" stroke="#3b827e" opacity="0.4" strokeDasharray="2 2" />
      
      {/* 直角量尺 */}
      <path d="M 52 4 L 52 42 L 86 42" stroke="#f59e0b" strokeWidth="1.8" />
      <line x1="56" y1="42" x2="56" y2="38" stroke="#f59e0b" />
      <line x1="64" y1="42" x2="64" y2="38" stroke="#f59e0b" />
      <line x1="72" y1="42" x2="72" y2="38" stroke="#f59e0b" />
      <line x1="80" y1="42" x2="80" y2="38" stroke="#f59e0b" />
      
      {/* 標籤小吊牌 */}
      <rect x="14" y="6" width="22" height="14" rx="2" stroke="#e17b62" fill="#fff0eb" fillOpacity="0.4" />
      <circle cx="18" cy="13" r="1.5" fill="#e17b62" />
      <line x1="23" y1="13" x2="31" y2="13" stroke="#e17b62" />
    </svg>
  );
}

/**
 * 空間工具區頂部書桌文具橫幅飾紋 (SpaceStationeryBannerDoodle)
 */
export function SpaceStationeryBannerDoodle({ className = 'w-48 h-12' }) {
  return (
    <svg viewBox="0 0 180 44" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 迴紋針 Paperclip */}
      <path d="M 12 18 L 12 30 Q 12 36 17 36 Q 22 36 22 30 L 22 14 Q 22 8 16 8 Q 10 8 10 14 L 10 28" stroke="#89959b" strokeWidth="1.4" />
      
      {/* 紙膠帶小卷 */}
      <ellipse cx="44" cy="24" rx="12" ry="12" stroke="#e17b62" fill="#fff0eb" fillOpacity="0.2" />
      <ellipse cx="44" cy="24" rx="6" ry="6" stroke="#e17b62" />
      <path d="M 44 36 L 62 36 L 66 32" stroke="#e17b62" strokeDasharray="2 2" />
      
      {/* 鋼筆沾水筆尖 Fountain Pen */}
      <path d="M 88 36 L 96 12 L 104 36 Z" stroke="#3b827e" fill="#3b827e" fillOpacity="0.15" />
      <line x1="96" y1="12" x2="96" y2="28" stroke="#3b827e" />
      <circle cx="96" cy="28" r="1.5" fill="#3b827e" />
      
      {/* 玻璃墨水瓶 */}
      <rect x="122" y="16" width="22" height="20" rx="3" stroke="#89959b" fill="var(--card-bg,#1c222b)" />
      <rect x="127" y="10" width="12" height="6" rx="1" stroke="#89959b" />
      <line x1="125" y1="26" x2="141" y2="26" stroke="#3b827e" strokeDasharray="2 2" />
      
      {/* 漂浮星芒 */}
      <circle cx="160" cy="18" r="1.5" fill="#f59e0b" />
      <circle cx="75" cy="14" r="1.2" fill="#e17b62" />
    </svg>
  );
}

/**
 * 個人專屬手帳封蠟火漆印章 (WaxSealDoodle)
 */
export function WaxSealDoodle({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* 封蠟熔滴不規則邊緣 */}
      <path
        d="M 22 3 Q 29 2 34 7 Q 41 12 40 20 Q 42 28 36 34 Q 30 41 22 41 Q 14 42 8 36 Q 2 30 4 21 Q 3 13 10 7 Q 15 2 22 3 Z"
        fill="#e17b62"
        fillOpacity="0.18"
        stroke="#e17b62"
        strokeWidth="1.4"
      />
      {/* 內印圓框 */}
      <circle cx="22" cy="22" r="12" stroke="#e17b62" strokeWidth="1.2" />
      <circle cx="22" cy="22" r="10" stroke="#e17b62" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
      {/* 中心展開書本標章 */}
      <path d="M 17 25 Q 20 23 22 24 Q 24 23 27 25 L 27 19 Q 24 17 22 18 Q 20 17 17 19 Z" fill="#e17b62" stroke="#e17b62" />
      <line x1="22" y1="18" x2="22" y2="24" stroke="#e17b62" strokeWidth="1.2" />
    </svg>
  );
}



