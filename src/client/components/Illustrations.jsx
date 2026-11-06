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
 * 高密度連綿手繪漫遊景觀：
 * 包含連綿起伏丘陵、背景高聳山脈、繁茂樹叢與松林、遊樂摩天輪、鄉村尖頂小屋、
 * 緊湊密集的現代都市高樓群（排屋、垂直百葉塔樓、波浪立面大廈、帝國尖塔、斜頂商辦）、
 * 丘陵上的石造燈塔、橫跨水岸的鋼索吊橋、水濱香蒲蘆葦、山頂炊煙小屋與放牧羊群、
 * 第二座跨湖吊橋、海角崖頂燈塔以及全幅貫穿的起伏水岸波紋。
 */
export function PanoramicSkyline({ className = 'w-full h-28 sm:h-36 md:h-48 lg:h-56 opacity-60 dark:opacity-45 pointer-events-none' }) {
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
      {/* ============================================================ */}
      {/* 1. 第一層：遠景崇山峻嶺與天際線輪廓 (Background Mountains)   */}
      {/* ============================================================ */}
      <g opacity="0.6">
        {/* 左側遠山 1 (x: 40 - 180) */}
        <path d="M 40 138 L 105 38 L 175 138" strokeWidth="1.3" />
        <path d="M 105 38 L 115 115" strokeWidth="1" />
        {/* 山體右側斜向陰影排線 */}
        <line x1="108" y1="52" x2="124" y2="60" strokeWidth="0.8" />
        <line x1="110" y1="64" x2="136" y2="76" strokeWidth="0.8" />
        <line x1="112" y1="76" x2="148" y2="92" strokeWidth="0.8" />
        <line x1="114" y1="88" x2="158" y2="108" strokeWidth="0.8" />

        {/* 左側遠山 2 (x: 150 - 245) */}
        <path d="M 150 138 L 188 56 L 245 138" strokeWidth="1.2" />
        <path d="M 188 56 L 196 118" strokeWidth="0.9" />
        <line x1="190" y1="70" x2="208" y2="80" strokeWidth="0.8" />
        <line x1="192" y1="84" x2="220" y2="98" strokeWidth="0.8" />

        {/* 都市後方遠山 3 (x: 550 - 660) */}
        <path d="M 550 138 L 605 44 L 665 138" strokeWidth="1.3" />
        <path d="M 605 44 L 612 115" strokeWidth="1" />
        <line x1="607" y1="58" x2="624" y2="68" strokeWidth="0.8" />
        <line x1="609" y1="72" x2="636" y2="86" strokeWidth="0.8" />
        <line x1="611" y1="86" x2="648" y2="104" strokeWidth="0.8" />

        {/* 燈塔 1 後方遠山 4 (x: 645 - 755) */}
        <path d="M 645 138 L 695 56 L 755 138" strokeWidth="1.2" />
        <path d="M 695 56 L 702 120" strokeWidth="0.9" />
        <line x1="697" y1="72" x2="716" y2="82" strokeWidth="0.8" />
        <line x1="699" y1="88" x2="730" y2="102" strokeWidth="0.8" />

        {/* 吊橋後方綿延山脈 (x: 920 - 1080) */}
        <path d="M 920 138 L 975 75 L 1025 105 L 1080 138" strokeWidth="1.1" />

        {/* 右側雄偉阿爾卑斯雙峰 (x: 1180 - 1340) */}
        <path d="M 1180 138 L 1228 34 L 1262 76 L 1295 44 L 1345 138" strokeWidth="1.4" />
        <path d="M 1228 34 L 1238 112" strokeWidth="1" />
        <line x1="1231" y1="48" x2="1248" y2="58" strokeWidth="0.8" />
        <line x1="1233" y1="62" x2="1256" y2="74" strokeWidth="0.8" />
        <path d="M 1295 44 L 1302 110" strokeWidth="1" />
        <line x1="1297" y1="58" x2="1318" y2="70" strokeWidth="0.8" />
        <line x1="1299" y1="74" x2="1330" y2="92" strokeWidth="0.8" />

        {/* 右側海岸山脈 (x: 1530 - 1600) */}
        <path d="M 1530 138 L 1572 48 L 1600 95" strokeWidth="1.3" />
        <path d="M 1572 48 L 1578 112" strokeWidth="0.9" />
        <line x1="1574" y1="62" x2="1590" y2="72" strokeWidth="0.8" />
      </g>

      {/* 天空點綴：自由翱翔的海鳥群 */}
      <g strokeWidth="1" opacity="0.55">
        <path d="M 72 26 Q 76 22 80 26 Q 84 22 88 26" />
        <path d="M 88 18 Q 91 15 95 18 Q 98 15 102 18" />
        <path d="M 845 22 Q 849 18 853 22 Q 857 18 861 22" />
        <path d="M 860 14 Q 863 11 867 14 Q 870 11 874 14" />
        <path d="M 1370 20 Q 1374 16 1378 20 Q 1382 16 1386 20" />
      </g>

      {/* ============================================================ */}
      {/* 2. 第二層：中景連綿起伏丘陵 (Midground Rolling Hills)         */}
      {/* ============================================================ */}
      {/* 丘陵採用 fill="var(--paper)" 確保遮蔽背後遠山，營造純粹層次感 */}
      <g fill="var(--paper,#fbfbf9)">
        {/* 左側丘陵 */}
        <path d="M -10 138 Q 45 102 105 118 Q 155 130 195 138 Z" strokeWidth="1.3" />
        {/* 摩天輪右側過渡丘陵 */}
        <path d="M 215 138 Q 265 110 325 124 Q 355 132 385 138 Z" strokeWidth="1.3" />
        {/* 都市右側過渡斜坡 */}
        <path d="M 535 138 Q 585 112 645 125 Q 695 134 735 138 Z" strokeWidth="1.3" />
        {/* 燈塔 1 圓頂大丘陵 */}
        <path d="M 715 138 Q 782 82 852 112 Q 885 128 915 138 Z" strokeWidth="1.4" />
        {/* 鄉村小屋坐落之寬闊起伏山丘 */}
        <path d="M 1065 138 Q 1135 84 1205 108 Q 1245 125 1275 138 Z" strokeWidth="1.4" />
        {/* 右側燈塔 2 海岬起伏丘陵 */}
        <path d="M 1465 138 Q 1530 82 1585 114 Q 1600 124 1610 138 Z" strokeWidth="1.4" />
      </g>

      {/* ============================================================ */}
      {/* 3. 第三層：常青針葉松林 (Evergreen Pine Trees)              */}
      {/* ============================================================ */}
      <g strokeWidth="1.1">
        {/* 遠山坡松樹 1 (x: 82) */}
        <path d="M 82 118 L 82 102 M 78 112 L 82 105 L 86 112 M 79 116 L 82 110 L 85 116" stroke="#3b827e" />
        {/* 摩天輪旁松樹 2 (x: 238) */}
        <path d="M 238 126 L 238 108 M 233 120 L 238 112 L 243 120 M 234 124 L 238 117 L 242 124" stroke="#3b827e" />
        {/* 都市出口坡道松樹 3 (x: 572) */}
        <path d="M 572 126 L 572 106 M 567 118 L 572 110 L 577 118 M 568 123 L 572 116 L 576 123" stroke="#3b827e" />
        {/* 燈塔 1 山腳松樹 4 (x: 648) */}
        <path d="M 648 128 L 648 108 M 643 120 L 648 112 L 653 120 M 644 125 L 648 118 L 652 125" stroke="#3b827e" />
        {/* 燈塔 1 頂峰陪伴松樹 5 (x: 812, 矗立於燈塔旁) */}
        <path d="M 812 104 L 812 76 M 805 92 L 812 80 L 819 92 M 806 98 L 812 88 L 818 98 M 807 103 L 812 94 L 817 103" stroke="#3b827e" strokeWidth="1.2" />
        {/* 小屋後方山林松樹 6 (x: 1195) */}
        <path d="M 1195 112 L 1195 86 M 1188 100 L 1195 89 L 1202 100 M 1189 106 L 1195 96 L 1201 106 M 1190 111 L 1195 102 L 1200 111" stroke="#3b827e" />
        {/* 阿爾卑斯山腳松樹 7 (x: 1282) */}
        <path d="M 1282 116 L 1282 92 M 1276 106 L 1282 96 L 1288 106 M 1277 112 L 1282 103 L 1287 112" stroke="#3b827e" />
        {/* 右側燈塔 2 崖壁松樹 8 (x: 1568, 矗立於海風中) */}
        <path d="M 1568 102 L 1568 76 M 1561 92 L 1568 80 L 1575 92 M 1562 98 L 1568 88 L 1574 98 M 1563 103 L 1568 94 L 1573 103" stroke="#3b827e" strokeWidth="1.2" />
      </g>

      {/* ============================================================ */}
      {/* 4. 第四層：核心建築與工程景觀 (Architecture & Landmarks)      */}
      {/* ============================================================ */}

      {/* 4A. 左側遊樂摩天輪 (Ferris Wheel, x: 140 - 225) */}
      <g>
        {/* 雙重轉輪輪圈 */}
        <circle cx="182" cy="74" r="36" strokeWidth="1.4" />
        <circle cx="182" cy="74" r="32" strokeDasharray="3 2" opacity="0.7" />
        <circle cx="182" cy="74" r="6" fill="var(--paper,#fbfbf9)" strokeWidth="1.4" />
        <circle cx="182" cy="74" r="2.5" fill="currentColor" />

        {/* 12 組放射狀輪輻輻條 */}
        <line x1="182" y1="38" x2="182" y2="110" />
        <line x1="146" y1="74" x2="218" y2="74" />
        <line x1="156" y1="48" x2="208" y2="100" />
        <line x1="156" y1="100" x2="208" y2="48" />
        <line x1="168" y1="41" x2="196" y2="107" opacity="0.65" />
        <line x1="196" y1="41" x2="168" y2="107" opacity="0.65" />
        <line x1="149" y1="88" x2="215" y2="60" opacity="0.65" />
        <line x1="149" y1="60" x2="215" y2="88" opacity="0.65" />
        {/* 內層環形支撐拉索 */}
        <circle cx="182" cy="74" r="18" strokeDasharray="2 2" opacity="0.5" />

        {/* 12 座外掛式景觀座艙 */}
        <rect x="178" y="32" width="8" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="178" y="109" width="8" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="141" y="70" width="7" height="8" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="216" y="70" width="7" height="8" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="153" y="44" width="7" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="204" y="44" width="7" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="153" y="97" width="7" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="204" y="97" width="7" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="164" y="36" width="7" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="193" y="36" width="7" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="145" y="85" width="7" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />
        <rect x="212" y="85" width="7" height="7" rx="1.5" fill="var(--paper,#fbfbf9)" />

        {/* 重型 A 字立體結構主支架 */}
        <line x1="182" y1="74" x2="160" y2="136" strokeWidth="1.8" />
        <line x1="182" y1="74" x2="204" y2="136" strokeWidth="1.8" />
        <line x1="168" y1="114" x2="196" y2="114" strokeWidth="1.2" />
        <line x1="163" y1="126" x2="201" y2="126" strokeWidth="1.2" />
      </g>

      {/* 4B. 鄉村斜頂洋房與天線 (Gabled Town House, x: 254 - 296) */}
      <g fill="var(--paper,#fbfbf9)">
        {/* 屋頂山牆 */}
        <path d="M 252 86 L 275 64 L 298 86 Z" strokeWidth="1.4" />
        {/* 屋頂排煙煙囪與天線 */}
        <rect x="284" y="58" width="5" height="12" />
        <line x1="264" y1="64" x2="264" y2="52" />
        <line x1="260" y1="56" x2="268" y2="56" />
        <circle cx="264" cy="52" r="1.2" fill="currentColor" />
        {/* 兩層主樓立面 */}
        <rect x="256" y="86" width="38" height="50" strokeWidth="1.3" />
        {/* 閣樓圓形採光窗 */}
        <circle cx="275" cy="76" r="3.5" />
        <line x1="275" y1="72.5" x2="275" y2="79.5" />
        <line x1="271.5" y1="76" x2="278.5" y2="76" />
        {/* 二樓雙矩形窗戶 */}
        <rect x="262" y="93" width="9" height="12" rx="1" />
        <line x1="266.5" y1="93" x2="266.5" y2="105" />
        <line x1="262" y1="99" x2="271" y2="99" />
        <rect x="279" y="93" width="9" height="12" rx="1" />
        <line x1="283.5" y1="93" x2="283.5" y2="105" />
        <line x1="279" y1="99" x2="288" y2="99" />
        {/* 一樓門與單窗 */}
        <rect x="262" y="115" width="10" height="21" rx="1" />
        <rect x="279" y="115" width="9" height="11" rx="1" />
        <line x1="283.5" y1="115" x2="283.5" y2="126" />
      </g>

      {/* 4C. 密集無縫現代都市天際線群 (Dense City Skyline, x: 335 - 550) */}
      <g fill="var(--paper,#fbfbf9)">
        {/* 建築 1：三層經典排屋公寓 (x: 336 - 376) */}
        <rect x="336" y="58" width="40" height="78" strokeWidth="1.3" />
        <line x1="334" y1="58" x2="378" y2="58" strokeWidth="1.6" />
        {/* 頂樓通風口 */}
        <rect x="350" y="52" width="12" height="6" />
        {/* 3 列 x 3 行對稱窗格 */}
        <rect x="342" y="66" width="6" height="9" rx="0.8" />
        <rect x="353" y="66" width="6" height="9" rx="0.8" />
        <rect x="364" y="66" width="6" height="9" rx="0.8" />
        <rect x="342" y="82" width="6" height="9" rx="0.8" />
        <rect x="353" y="82" width="6" height="9" rx="0.8" />
        <rect x="364" y="82" width="6" height="9" rx="0.8" />
        <rect x="342" y="98" width="6" height="9" rx="0.8" />
        <rect x="353" y="98" width="6" height="9" rx="0.8" />
        <rect x="364" y="98" width="6" height="9" rx="0.8" />
        <rect x="351" y="118" width="10" height="18" rx="1" />

        {/* 建築 2：高聳立體百葉柱大樓 (x: 380 - 418) */}
        <rect x="380" y="38" width="38" height="98" strokeWidth="1.3" />
        {/* 樓頂天線塔與階梯女兒牆 */}
        <line x1="390" y1="38" x2="390" y2="24" strokeWidth="1.2" />
        <circle cx="390" cy="24" r="1.5" fill="currentColor" />
        <line x1="406" y1="38" x2="406" y2="28" strokeWidth="1.2" />
        {/* 4 條修長之立面百葉柱長槽窗 */}
        <rect x="385" y="46" width="4" height="42" rx="2" />
        <rect x="393" y="46" width="4" height="42" rx="2" />
        <rect x="401" y="46" width="4" height="42" rx="2" />
        <rect x="409" y="46" width="4" height="42" rx="2" />
        <rect x="385" y="96" width="4" height="26" rx="2" />
        <rect x="393" y="96" width="4" height="26" rx="2" />
        <rect x="401" y="96" width="4" height="26" rx="2" />
        <rect x="409" y="96" width="4" height="26" rx="2" />

        {/* 建築 3：水波紋立面幾何商辦 (x: 422 - 462) */}
        <rect x="422" y="52" width="40" height="84" strokeWidth="1.3" />
        <rect x="430" y="46" width="24" height="6" />
        {/* 經典水波紋 / 折線裝飾立面 */}
        <path d="M 428 64 Q 434 60 442 64 T 456 64" strokeWidth="1.1" />
        <path d="M 428 76 Q 434 72 442 76 T 456 76" strokeWidth="1.1" />
        <path d="M 428 88 Q 434 84 442 88 T 456 88" strokeWidth="1.1" />
        <path d="M 428 100 Q 434 96 442 100 T 456 100" strokeWidth="1.1" />
        <path d="M 428 112 Q 434 108 442 112 T 456 112" strokeWidth="1.1" />

        {/* 建築 4：帝國之峰階梯尖頂摩天樓 (x: 466 - 508) */}
        <rect x="466" y="68" width="42" height="68" strokeWidth="1.3" />
        <rect x="472" y="48" width="30" height="20" strokeWidth="1.2" />
        <rect x="478" y="32" width="18" height="16" strokeWidth="1.2" />
        {/* 中央極限針尖避雷天線 */}
        <line x1="487" y1="32" x2="487" y2="16" strokeWidth="1.5" stroke="#f59e0b" />
        <circle cx="487" cy="16" r="1.8" fill="#f59e0b" />
        {/* 立面纖細窗線 */}
        <line x1="477" y1="74" x2="477" y2="128" strokeDasharray="3 2" />
        <line x1="487" y1="74" x2="487" y2="128" strokeDasharray="3 2" />
        <line x1="497" y1="74" x2="497" y2="128" strokeDasharray="3 2" />

        {/* 建築 5：現代斜切屋頂旗艦辦公室 (x: 512 - 548) */}
        <path d="M 512 68 L 548 52 L 548 136 L 512 136 Z" strokeWidth="1.3" />
        {/* 矩陣辦公窗戶 */}
        <rect x="518" y="74" width="7" height="6" rx="0.5" />
        <rect x="529" y="71" width="7" height="6" rx="0.5" />
        <rect x="518" y="86" width="7" height="6" rx="0.5" />
        <rect x="529" y="83" width="7" height="6" rx="0.5" />
        <rect x="518" y="98" width="7" height="6" rx="0.5" />
        <rect x="529" y="95" width="7" height="6" rx="0.5" />
        <rect x="518" y="110" width="7" height="6" rx="0.5" />
        <rect x="529" y="107" width="7" height="6" rx="0.5" />
      </g>

      {/* 4D. 丘陵上的第一座石造燈塔 (Lighthouse 1, x: 778 - 802, y: 52 to 84) */}
      <g fill="var(--paper,#fbfbf9)">
        {/* 漸縮石造塔身 */}
        <path d="M 783 84 L 786 58 L 798 58 L 801 84 Z" strokeWidth="1.3" />
        <line x1="784.5" y1="70" x2="799.5" y2="70" />
        {/* 觀景廊台圍欄 */}
        <line x1="782" y1="58" x2="802" y2="58" strokeWidth="1.8" />
        {/* 燈室與圓頂金屬罩 */}
        <rect x="786" y="50" width="12" height="8" rx="1" fill="#fff9f6" stroke="#f59e0b" />
        <circle cx="792" cy="54" r="2" fill="#fbbf24" stroke="#fbbf24" />
        <path d="M 785 50 Q 792 42 799 50 Z" strokeWidth="1.2" />
        <line x1="792" y1="42" x2="792" y2="38" />
        {/* 射向天際的光芒虛線 */}
        <line x1="786" y1="52" x2="768" y2="44" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="1" />
        <line x1="798" y1="52" x2="816" y2="44" stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="1" />
      </g>

      {/* 4E. 第一座跨河水岸大吊橋 (Suspension Bridge 1, x: 885 - 1025) */}
      <g>
        {/* 雙主塔鋼架結構 */}
        <line x1="916" y1="72" x2="916" y2="136" strokeWidth="2.2" />
        <line x1="924" y1="72" x2="924" y2="136" strokeWidth="2.2" />
        <line x1="914" y1="84" x2="926" y2="84" strokeWidth="1.2" />
        <line x1="914" y1="102" x2="926" y2="102" strokeWidth="1.2" />
        <line x1="916" y1="72" x2="920" y2="66 L 924 72" strokeWidth="1.2" />

        <line x1="986" y1="72" x2="986" y2="136" strokeWidth="2.2" />
        <line x1="994" y1="72" x2="994" y2="136" strokeWidth="2.2" />
        <line x1="984" y1="84" x2="996" y2="84" strokeWidth="1.2" />
        <line x1="984" y1="102" x2="996" y2="102" strokeWidth="1.2" />
        <line x1="986" y1="72" x2="990" y2="66 L 994 72" strokeWidth="1.2" />

        {/* 主懸索 (Main Catenary Cables) */}
        <path d="M 885 120 Q 902 96 920 72" strokeWidth="1.5" />
        <path d="M 920 72 Q 955 106 990 72" strokeWidth="1.6" />
        <path d="M 990 72 Q 1008 96 1025 120" strokeWidth="1.5" />

        {/* 橋面桁架與護欄 */}
        <rect x="882" y="118" width="146" height="4" rx="0.5" fill="var(--paper,#fbfbf9)" strokeWidth="1.4" />
        <line x1="882" y1="115" x2="1028" y2="115" strokeWidth="0.9" />

        {/* 密集垂直吊索 (Vertical Hangers) */}
        <line x1="895" y1="110" x2="895" y2="118" strokeWidth="0.8" />
        <line x1="906" y1="94" x2="906" y2="118" strokeWidth="0.8" />
        <line x1="935" y1="82" x2="935" y2="118" strokeWidth="0.8" />
        <line x1="948" y1="97" x2="948" y2="118" strokeWidth="0.8" />
        <line x1="962" y1="102" x2="962" y2="118" strokeWidth="0.8" />
        <line x1="975" y1="92" x2="975" y2="118" strokeWidth="0.8" />
        <line x1="1004" y1="88" x2="1004" y2="118" strokeWidth="0.8" />
        <line x1="1015" y1="106" x2="1015" y2="118" strokeWidth="0.8" />
      </g>

      {/* 4F. 山丘上的溫馨田園小屋與放牧山丘 (Hilltop Cottage, x: 1120 - 1165, y: 64 to 90) */}
      <g fill="var(--paper,#fbfbf9)">
        {/* 屋頂與煙囪 */}
        <path d="M 1120 80 L 1142 64 L 1164 80 Z" strokeWidth="1.4" />
        <rect x="1148" y="58" width="5" height="10" />
        {/* 炊煙裊裊 */}
        <path d="M 1150 56 Q 1146 48 1152 42 Q 1158 36 1154 30" strokeWidth="0.9" strokeDasharray="2 2" />
        {/* 小屋立面 */}
        <rect x="1126" y="80" width="32" height="18" strokeWidth="1.3" />
        <rect x="1130" y="84" width="7" height="8" rx="0.8" />
        <line x1="1133.5" y1="84" x2="1133.5" y2="92" />
        <rect x="1147" y="84" width="7" height="8" rx="0.8" />
        <line x1="1150.5" y1="84" x2="1150.5" y2="92" />
        <rect x="1139" y="87" width="5" height="11" rx="0.5" />

        {/* 山坡上放牧的小棉羊群 */}
        <g strokeWidth="1">
          <ellipse cx="1184" cy="108" rx="5" ry="3.5" />
          <circle cx="1179" cy="107" r="1.8" fill="currentColor" />
          <line x1="1182" y1="111" x2="1182" y2="115" />
          <line x1="1186" y1="111" x2="1186" y2="115" />

          <ellipse cx="1198" cy="116" rx="4.5" ry="3" />
          <circle cx="1203" cy="115" r="1.6" fill="currentColor" />
          <line x1="1196" y1="119" x2="1196" y2="122" />
          <line x1="1200" y1="119" x2="1200" y2="122" />
        </g>
      </g>

      {/* 4G. 第二座跨湖懸索橋 (Suspension Bridge 2, x: 1345 - 1445) */}
      <g>
        {/* 左塔與右塔 */}
        <line x1="1368" y1="80" x2="1368" y2="136" strokeWidth="2" />
        <line x1="1374" y1="80" x2="1374" y2="136" strokeWidth="2" />
        <line x1="1366" y1="92" x2="1376" y2="92" strokeWidth="1.1" />

        <line x1="1420" y1="80" x2="1420" y2="136" strokeWidth="2" />
        <line x1="1426" y1="80" x2="1426" y2="136" strokeWidth="2" />
        <line x1="1418" y1="92" x2="1428" y2="92" strokeWidth="1.1" />

        {/* 主懸索弧線 */}
        <path d="M 1345 120 Q 1357 98 1371 80 Q 1397 108 1423 80 Q 1435 98 1448 120" strokeWidth="1.5" />
        {/* 橋面 */}
        <rect x="1342" y="118" width="108" height="4" rx="0.5" fill="var(--paper,#fbfbf9)" strokeWidth="1.3" />
        <line x1="1342" y1="115" x2="1450" y2="115" strokeWidth="0.8" />

        {/* 垂直鋼索 */}
        <line x1="1356" y1="104" x2="1356" y2="118" strokeWidth="0.8" />
        <line x1="1385" y1="92" x2="1385" y2="118" strokeWidth="0.8" />
        <line x1="1397" y1="102" x2="1397" y2="118" strokeWidth="0.8" />
        <line x1="1409" y1="95" x2="1409" y2="118" strokeWidth="0.8" />
        <line x1="1436" y1="104" x2="1436" y2="118" strokeWidth="0.8" />
      </g>

      {/* 4H. 右側海角崖頂第二座守望燈塔 (Lighthouse 2, x: 1532 - 1558, y: 52 to 84) */}
      <g fill="var(--paper,#fbfbf9)">
        <path d="M 1536 84 L 1539 58 L 1551 58 L 1554 84 Z" strokeWidth="1.3" />
        <line x1="1537.5" y1="71" x2="1552.5" y2="71" />
        <line x1="1535" y1="58" x2="1555" y2="58" strokeWidth="1.8" />
        <rect x="1539" y="50" width="12" height="8" rx="1" fill="#fff9f6" stroke="#f59e0b" />
        <circle cx="1545" cy="54" r="2" fill="#fbbf24" stroke="#fbbf24" />
        <path d="M 1538 50 Q 1545 42 1552 50 Z" strokeWidth="1.2" />
        <line x1="1545" y1="42" x2="1545" y2="38" />
        {/* 探照燈向海面的光芒 */}
        <line x1="1551" y1="52" x2="1585" y2="40" stroke="#fbbf24" strokeDasharray="3 2" strokeWidth="1.1" />
        <line x1="1551" y1="56" x2="1598" y2="52" stroke="#fbbf24" strokeDasharray="3 2" strokeWidth="1.1" />
      </g>

      {/* ============================================================ */}
      {/* 5. 第五層：全域茂密樹木與灌木叢 (Lush Foliage & Bushes)       */}
      {/* ============================================================ */}
      {/* 填補每一處空隙，與參考圖一模一樣的飽滿與生機 */}
      <g fill="var(--paper,#fbfbf9)" strokeWidth="1.2">
        {/* 樹木 1 (最左岸邊小樹, x: 16) */}
        <path d="M 16 136 L 16 112" />
        <path d="M 8 112 Q 6 100 16 96 Q 26 100 24 112 Z" />

        {/* 樹木 2 (摩天輪左側大樹 1, x: 55) */}
        <path d="M 55 136 L 55 92" strokeWidth="1.5" />
        <path d="M 42 96 Q 38 78 52 74 Q 60 64 72 72 Q 82 82 76 96 Q 66 104 55 102 Z" />

        {/* 樹木 3 (摩天輪左前蓬鬆巨木, x: 128) */}
        <path d="M 126 136 L 126 78" strokeWidth="1.8" />
        <path d="M 108 82 Q 102 62 118 56 Q 128 44 144 52 Q 158 60 154 76 Q 148 90 132 90 Z" />

        {/* 樹木 4 (摩天輪右側小屋前綠樹, x: 228) */}
        <path d="M 226 136 L 226 104" strokeWidth="1.4" />
        <path d="M 215 106 Q 212 92 224 88 Q 236 86 240 96 Q 242 108 230 112 Z" />

        {/* 樹木 5 (小屋右側伴隨大樹, x: 316) */}
        <path d="M 316 136 L 316 94" strokeWidth="1.6" />
        <path d="M 302 96 Q 296 78 312 72 Q 324 64 336 74 Q 346 86 338 100 Q 326 106 314 104 Z" />

        {/* 樹木 6 (都市入口綠化小樹, x: 374) */}
        <path d="M 374 136 L 374 110" />
        <path d="M 364 112 Q 360 100 372 96 Q 384 98 384 110 Z" />

        {/* 樹木 7 (都市中庭綠樹, x: 462) */}
        <path d="M 462 136 L 462 114" />
        <path d="M 454 114 Q 450 102 462 100 Q 472 102 470 114 Z" />

        {/* 樹木 8 (都市出口自然過渡樹, x: 536) */}
        <path d="M 536 136 L 536 108" strokeWidth="1.4" />
        <path d="M 524 110 Q 520 96 534 92 Q 546 94 546 108 Z" />

        {/* 樹木 9 (丘陵坡上茂密綠樹, x: 608) */}
        <path d="M 608 136 L 608 96" strokeWidth="1.5" />
        <path d="M 594 98 Q 588 82 604 76 Q 618 72 626 84 Q 632 96 622 106 Z" />

        {/* 樹木 10 (燈塔 1 旁山腰圓樹, x: 722) */}
        <path d="M 722 136 L 722 104" strokeWidth="1.4" />
        <path d="M 710 106 Q 706 92 720 88 Q 734 88 736 102 Z" />

        {/* 樹木 11 (吊橋 1 左橋墩大樹, x: 864) */}
        <path d="M 864 136 L 864 106" strokeWidth="1.5" />
        <path d="M 850 108 Q 844 92 860 86 Q 874 84 880 98 Q 882 112 868 116 Z" />

        {/* 樹木 12 (吊橋 1 右岸迎客大樹, x: 1042) */}
        <path d="M 1042 136 L 1042 92" strokeWidth="1.6" />
        <path d="M 1026 94 Q 1020 74 1038 68 Q 1052 62 1062 74 Q 1070 88 1060 102 Q 1048 108 1038 104 Z" />

        {/* 樹木 13 (田園小屋左護林, x: 1108) */}
        <path d="M 1108 136 L 1108 86" strokeWidth="1.5" />
        <path d="M 1094 88 Q 1088 72 1104 66 Q 1118 64 1124 76 Q 1128 88 1120 98 Z" />

        {/* 樹木 14 (田園小屋右護林, x: 1172) */}
        <path d="M 1172 136 L 1172 84" strokeWidth="1.5" />
        <path d="M 1158 86 Q 1152 70 1168 64 Q 1182 62 1190 74 Q 1194 86 1184 96 Z" />

        {/* 樹木 15 (高山腳下優美老樹, x: 1256) */}
        <path d="M 1256 136 L 1256 94" strokeWidth="1.6" />
        <path d="M 1240 96 Q 1234 78 1250 72 Q 1264 66 1274 78 Q 1282 90 1272 104 Z" />

        {/* 樹木 16 (吊橋 2 左水濱樹, x: 1324) */}
        <path d="M 1324 136 L 1324 102" strokeWidth="1.4" />
        <path d="M 1312 104 Q 1308 90 1322 86 Q 1336 86 1338 100 Z" />

        {/* 樹木 17 (吊橋 2 右水濱大樹, x: 1464) */}
        <path d="M 1464 136 L 1464 96" strokeWidth="1.6" />
        <path d="M 1448 98 Q 1442 80 1458 74 Q 1472 68 1482 80 Q 1490 92 1480 106 Z" />

        {/* 樹木 18 (右側燈塔 2 崖頂綠樹, x: 1516) */}
        <path d="M 1516 136 L 1516 98" strokeWidth="1.4" />
        <path d="M 1504 100 Q 1500 86 1514 82 Q 1528 82 1530 96 Z" />
      </g>

      {/* 沿途密布的可愛小灌木叢 (Shrub Clusters) */}
      <g strokeWidth="1.1" fill="var(--paper,#fbfbf9)">
        <path d="M 24 136 Q 30 128 36 136" />
        <path d="M 96 136 Q 102 126 110 136" />
        <path d="M 154 136 Q 160 127 168 136" />
        <path d="M 218 136 Q 224 128 232 136" />
        <path d="M 296 136 Q 302 126 310 136" />
        <path d="M 354 136 Q 360 128 366 136" />
        <path d="M 412 136 Q 418 127 426 136" />
        <path d="M 552 136 Q 558 126 566 136" />
        <path d="M 630 136 Q 636 128 644 136" />
        <path d="M 736 136 Q 742 126 750 136" />
        <path d="M 834 136 Q 840 127 848 136" />
        <path d="M 964 136 Q 970 128 978 136" />
        <path d="M 1068 136 Q 1074 126 1082 136" />
        <path d="M 1218 136 Q 1224 128 1232 136" />
        <path d="M 1294 136 Q 1300 127 1308 136" />
        <path d="M 1404 136 Q 1410 128 1418 136" />
        <path d="M 1486 136 Q 1492 126 1500 136" />
        <path d="M 1582 136 Q 1588 128 1596 136" />
      </g>

      {/* ============================================================ */}
      {/* 6. 第六層：水岸香蒲蘆葦與生動草叢 (Cattails & Grass Tufts)   */}
      {/* ============================================================ */}
      {/* 吊橋下與水岸旁的生動水生植物 (香蒲 Cattails) */}
      <g strokeWidth="1">
        {/* 吊橋 1 左岸香蒲 (x: 882, 894) */}
        <line x1="882" y1="136" x2="880" y2="120" stroke="#89959b" />
        <rect x="878.5" y="120" width="3" height="7" rx="1.5" fill="currentColor" stroke="none" />
        <line x1="886" y1="136" x2="887" y2="124" stroke="#89959b" />
        <line x1="894" y1="136" x2="896" y2="118" stroke="#89959b" />
        <rect x="894.5" y="118" width="3" height="7" rx="1.5" fill="currentColor" stroke="none" />
        <line x1="890" y1="136" x2="891" y2="123" stroke="#89959b" />

        {/* 吊橋 1 右岸香蒲 (x: 1018, 1028) */}
        <line x1="1018" y1="136" x2="1016" y2="119" stroke="#89959b" />
        <rect x="1014.5" y="119" width="3" height="7" rx="1.5" fill="currentColor" stroke="none" />
        <line x1="1022" y1="136" x2="1023" y2="125" stroke="#89959b" />
        <line x1="1028" y1="136" x2="1030" y2="121" stroke="#89959b" />
        <rect x="1028.5" y="121" width="3" height="7" rx="1.5" fill="currentColor" stroke="none" />

        {/* 吊橋 2 左岸香蒲 (x: 1342, 1352) */}
        <line x1="1342" y1="136" x2="1340" y2="122" stroke="#89959b" />
        <rect x="1338.5" y="122" width="3" height="6.5" rx="1.5" fill="currentColor" stroke="none" />
        <line x1="1348" y1="136" x2="1349" y2="125" stroke="#89959b" />
        <line x1="1354" y1="136" x2="1355" y2="120" stroke="#89959b" />
        <rect x="1353.5" y="120" width="3" height="6.5" rx="1.5" fill="currentColor" stroke="none" />

        {/* 吊橋 2 右岸香蒲 (x: 1438, 1448) */}
        <line x1="1440" y1="136" x2="1438" y2="121" stroke="#89959b" />
        <rect x="1436.5" y="121" width="3" height="6.5" rx="1.5" fill="currentColor" stroke="none" />
        <line x1="1448" y1="136" x2="1450" y2="123" stroke="#89959b" />
        <rect x="1448.5" y="123" width="3" height="6.5" rx="1.5" fill="currentColor" stroke="none" />
      </g>

      {/* 遍布山坡與草地的三叉生動草尖 (Grass Tufts) */}
      <g strokeWidth="0.9" opacity="0.75">
        <path d="M 68 136 L 66 128 M 68 136 L 70 127 M 68 136 L 73 130" />
        <path d="M 198 136 L 196 129 M 198 136 L 200 128 M 198 136 L 203 131" />
        <path d="M 330 136 L 328 128 M 330 136 L 332 127 M 330 136 L 335 130" />
        <path d="M 590 136 L 588 129 M 590 136 L 592 128 M 590 136 L 595 131" />
        <path d="M 678 136 L 676 128 M 678 136 L 680 127 M 678 136 L 683 130" />
        <path d="M 760 114 L 758 107 M 760 114 L 762 106 M 760 114 L 765 109" />
        <path d="M 945 136 L 943 129 M 945 136 L 947 128 M 945 136 L 950 131" />
        <path d="M 1152 110 L 1150 103 M 1152 110 L 1154 102 M 1152 110 L 1157 105" />
        <path d="M 1238 136 L 1236 129 M 1238 136 L 1240 128 M 1238 136 L 1243 131" />
        <path d="M 1380 136 L 1378 129 M 1380 136 L 1382 128 M 1380 136 L 1385 131" />
        <path d="M 1505 118 L 1503 111 M 1505 118 L 1507 110 M 1505 118 L 1510 113" />
      </g>

      {/* ============================================================ */}
      {/* 7. 第七層：貫穿全景的大地水岸起伏基線 (Continuous Shoreline) */}
      {/* ============================================================ */}
      {/* 連綿不斷的起伏水岸大浪與河畔輪廓 */}
      <path
        d="M 0 137 Q 35 134 70 138 T 140 136 T 210 138 T 280 136 T 350 138 T 420 136 T 490 138 T 560 136 T 630 138 T 700 136 T 770 138 T 840 136 T 910 138 T 980 136 T 1050 138 T 1120 136 T 1190 138 T 1260 136 T 1330 138 T 1400 136 T 1470 138 T 1540 136 T 1600 137"
        strokeWidth="1.6"
      />

      {/* 水面微波與倒影漣漪 */}
      <g strokeWidth="0.9" opacity="0.5">
        <path d="M 18 143 Q 32 145 46 143" />
        <path d="M 85 146 Q 105 148 125 146" />
        <path d="M 160 144 Q 185 147 210 144" />
        <path d="M 245 146 Q 270 149 295 146" />
        <path d="M 360 144 Q 390 147 420 144" />
        <path d="M 450 147 Q 480 150 510 147" />
        <path d="M 580 144 Q 610 147 640 144" />
        <path d="M 710 146 Q 740 149 770 146" />
        <path d="M 880 143 Q 910 146 940 143" />
        <path d="M 960 147 Q 990 150 1020 147" />
        <path d="M 1090 144 Q 1120 147 1150 144" />
        <path d="M 1220 146 Q 1250 149 1280 146" />
        <path d="M 1340 143 Q 1370 146 1400 143" />
        <path d="M 1420 147 Q 1450 150 1480 147" />
        <path d="M 1520 144 Q 1550 147 1580 144" />
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



