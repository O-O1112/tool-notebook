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
 * 參考 reference 截圖底部的漫遊城市景緻：摩天輪、巴黎鐵塔/鐘樓、拱橋、歐風尖頂小木屋、書本山丘與樹林
 */
export function PanoramicSkyline({ className = 'w-full h-16 sm:h-20 opacity-25 dark:opacity-15 pointer-events-none' }) {
  return (
    <svg
      viewBox="0 0 1200 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      preserveAspectRatio="none"
    >
      {/* 貫穿全景的大地基線 */}
      <path d="M 0 82 L 1200 82" />

      {/* 1. 左側：浪漫遊樂摩天輪 (Ferris Wheel) */}
      <circle cx="70" cy="50" r="24" strokeDasharray="3 2" />
      <circle cx="70" cy="50" r="4" />
      <line x1="70" y1="26" x2="70" y2="74" />
      <line x1="46" y1="50" x2="94" y2="50" />
      <line x1="53" y1="33" x2="87" y2="67" />
      <line x1="53" y1="67" x2="87" y2="33" />
      {/* 車廂 */}
      <rect x="67" y="22" width="6" height="5" rx="1" />
      <rect x="67" y="73" width="6" height="5" rx="1" />
      <rect x="42" y="48" width="5" height="6" rx="1" />
      <rect x="93" y="48" width="5" height="6" rx="1" />
      {/* 摩天輪人字支架 */}
      <line x1="70" y1="50" x2="52" y2="82" />
      <line x1="70" y1="50" x2="88" y2="82" />

      {/* 2. 小木屋與尖頂閣樓聚落 */}
      <path d="M 110 82 L 110 60 L 124 48 L 138 60 L 138 82" />
      <rect x="118" y="64" width="12" height="12" />
      <line x1="124" y1="64" x2="124" y2="76" />
      <line x1="118" y1="70" x2="130" y2="70" />
      {/* 煙囪 */}
      <path d="M 130 52 L 130 44 L 134 44 L 134 56" />

      {/* 3. 雙層聯排市集建築 */}
      <path d="M 148 82 L 148 40 L 180 40 L 180 82" />
      <path d="M 148 40 L 164 28 L 180 40" />
      <rect x="154" y="46" width="8" height="10" />
      <rect x="166" y="46" width="8" height="10" />
      <rect x="154" y="62" width="8" height="10" />
      <rect x="166" y="62" width="8" height="10" />

      {/* 4. 拱門石橋與流水波紋 */}
      <path d="M 190 82 Q 215 58 240 82" />
      <path d="M 185 70 L 245 70" />
      <line x1="195" y1="70" x2="195" y2="74" />
      <line x1="210" y1="70" x2="210" y2="67" />
      <line x1="225" y1="70" x2="225" y2="70" />
      <path d="M 202 85 Q 215 88 228 85" strokeWidth="0.8" opacity="0.6" />

      {/* 5. 巨大翻開的手帳作為山丘與知識紀念碑 */}
      <path d="M 255 82 L 275 42 L 305 48 L 335 42 L 355 82" />
      <line x1="305" y1="48" x2="305" y2="82" />
      <line x1="280" y1="52" x2="300" y2="55" strokeWidth="0.8" opacity="0.6" />
      <line x1="280" y1="60" x2="300" y2="63" strokeWidth="0.8" opacity="0.6" />
      <line x1="310" y1="55" x2="330" y2="52" strokeWidth="0.8" opacity="0.6" />
      <line x1="310" y1="63" x2="330" y2="60" strokeWidth="0.8" opacity="0.6" />

      {/* 6. 松樹林與圓頂溫室 */}
      <path d="M 370 82 L 370 58 M 365 72 L 370 64 L 375 72 M 363 78 L 370 70 L 377 78" />
      <path d="M 385 82 L 385 54 M 379 68 L 385 60 L 391 68 M 377 76 L 385 66 L 393 76" />
      <path d="M 405 82 L 405 60 A 18 18 0 0 1 441 60 L 441 82" />
      <line x1="423" y1="42" x2="423" y2="82" />
      <line x1="405" y1="60" x2="441" y2="60" />

      {/* 7. 中央歐風宏偉大鐘樓 (Clock Tower) */}
      <path d="M 458 82 L 458 35 L 472 20 L 486 35 L 486 82" />
      <line x1="472" y1="20" x2="472" y2="10" />
      <circle cx="472" cy="10" r="1.5" fill="currentColor" />
      <circle cx="472" cy="42" r="6" />
      <line x1="472" y1="42" x2="472" y2="39" />
      <line x1="472" y1="42" x2="475" y2="42" />
      <rect x="465" y="56" width="14" height="20" rx="2" />

      {/* 8. 階梯狀層疊圖書館建築 */}
      <path d="M 500 82 L 500 50 L 525 50 L 525 65 L 545 65 L 545 82" />
      <rect x="506" y="56" width="6" height="8" />
      <rect x="514" y="56" width="6" height="8" />
      <rect x="530" y="70" width="8" height="8" />

      {/* 9. 浪漫熱氣球 (Hot Air Balloon) 飄浮於天空 */}
      <path d="M 570 32 A 10 10 0 0 1 590 32 C 590 40 583 45 580 47 C 577 45 570 40 570 32 Z" />
      <line x1="575" y1="47" x2="577" y2="52" />
      <line x1="585" y1="47" x2="583" y2="52" />
      <rect x="576" y="52" width="8" height="4" rx="1" />

      {/* 10. 凱旋門與街燈 */}
      <path d="M 610 82 L 610 48 L 646 48 L 646 82" />
      <path d="M 620 82 L 620 62 Q 628 55 636 62 L 636 82" />
      <line x1="606" y1="48" x2="650" y2="48" strokeWidth="2" />
      {/* 街燈 */}
      <path d="M 660 82 L 660 62 Q 663 56 667 62" />
      <circle cx="667" cy="62" r="2.5" fill="currentColor" opacity="0.7" />

      {/* 11. 連綿手帳與鉛筆之塔 (Pencil & Pen Spires) */}
      <path d="M 685 82 L 685 30 L 692 18 L 699 30 L 699 82" />
      <polygon points="692,18 689,26 695,26" fill="currentColor" opacity="0.6" />
      <path d="M 710 82 L 710 44 L 728 44 L 728 82" />
      <path d="M 710 44 L 719 32 L 728 44" />

      {/* 12. 第二座拱橋與水車 */}
      <path d="M 740 82 Q 765 62 790 82" />
      <path d="M 735 72 L 795 72" />
      <circle cx="810" cy="72" r="10" strokeDasharray="2 2" />
      <line x1="810" y1="62" x2="810" y2="82" />
      <line x1="800" y1="72" x2="820" y2="72" />

      {/* 13. 高聳現代天文台 / 圓頂星象館 */}
      <path d="M 835 82 L 835 48 A 20 20 0 0 1 875 48 L 875 82" />
      <line x1="855" y1="28" x2="870" y2="20" strokeWidth="2" />
      <circle cx="872" cy="18" r="2" />

      {/* 14. 樹林與小山坡 */}
      <path d="M 890 82 Q 915 65 940 82" />
      <path d="M 915 72 L 915 58 M 910 68 L 915 62 L 920 68" />
      <path d="M 945 82 L 945 42 L 970 42 L 970 82" />
      <rect x="951" y="48" width="8" height="10" />
      <rect x="951" y="64" width="8" height="10" />

      {/* 15. 燈塔 (Lighthouse) 與海岸線 */}
      <path d="M 990 82 L 996 35 L 1010 35 L 1016 82" />
      <rect x="998" y="28" width="10" height="7" rx="1" />
      <path d="M 997 28 L 1003 20 L 1009 28" />
      {/* 燈塔探照燈光 */}
      <line x1="1008" y1="31" x2="1035" y2="25" strokeDasharray="3 3" opacity="0.6" />
      <line x1="1008" y1="33" x2="1038" y2="38" strokeDasharray="3 3" opacity="0.6" />

      {/* 16. 右側連綿山丘與書籍波浪 */}
      <path d="M 1040 82 Q 1070 55 1100 82" />
      <path d="M 1095 82 L 1095 50 L 1120 50 L 1120 82" />
      <path d="M 1095 50 L 1107 38 L 1120 50" />
      <path d="M 1130 82 Q 1165 60 1200 82" />
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


