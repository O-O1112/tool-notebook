/**
 * AI 代寫小工具核心引擎 (AI Tool Generator Engine)
 * 支援 Google Gemini 官方 API 與 OpenAI 相容規範（Groq、OpenRouter 等）
 */

export const AI_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini (官方免費推薦)',
    defaultModel: 'gemini-2.0-flash',
    models: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'],
    keyHelp: '請前往 aistudio.google.com 免費取得 API Key (每日 1,500 次免費呼叫)',
    keyUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'groq',
    name: 'Groq Cloud (超高速開源小模型)',
    defaultModel: 'qwen-2.5-coder-32b',
    models: ['qwen-2.5-coder-32b', 'llama-3.1-8b-instant', 'llama-3.3-70b-versatile'],
    baseUrl: 'https://api.groq.com/openai/v1',
    keyHelp: '請前往 console.groq.com 免費取得 API Key (推論速度高達 500 tokens/秒)',
    keyUrl: 'https://console.groq.com/keys',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (多模型免費聚合)',
    defaultModel: 'qwen/qwen-2.5-coder-32b-instruct:free',
    models: [
      'qwen/qwen-2.5-coder-32b-instruct:free',
      'google/gemini-2.0-flash-exp:free',
      'meta-llama/llama-3.3-70b-instruct:free',
    ],
    baseUrl: 'https://openrouter.ai/api/v1',
    keyHelp: '請前往 openrouter.ai/keys 取得免費模型 API Key',
    keyUrl: 'https://openrouter.ai/keys',
  },
  {
    id: 'custom',
    name: '自訂相容端點 (Custom OpenAI API)',
    defaultModel: 'gpt-4o-mini',
    models: [],
    baseUrl: '',
    keyHelp: '可填寫任何相容 OpenAI 規範的 Base URL 與 API Key',
  },
];

export const PRESET_AI_PROMPTS = [
  {
    title: '複利投資與資產成長試算器',
    description: '計算定期定額投資、年化報酬率與本金成長，繪製長條圖與逐年明細表格，支援 CSV 匯出。',
    prompt: '請幫我寫一個高質感的「複利投資試算器」。具備：初始本金、每月定期定額金額、預期年化報酬率（%）、投資年數（年）輸入欄位。即時計算累計投入本金與最終複利總資產。用 HTML5 Canvas 繪製清晰的本金 vs 獲利成長長條圖，並條列每年前 10 年與關鍵年份的本金與資產明細表。提供一鍵匯出 CSV 功能，並將最後計算條件自動儲存於 localStorage。嚴格禁止表情符號。',
  },
  {
    title: '學生成績統計與評級分佈圖',
    description: '輸入或貼入學生成績，自動計算平均分、中位數、標準差與通過率，繪製分數區間分佈直方圖。',
    prompt: '請寫一個給老師使用的「成績統計與分佈直方圖工具」。具備文字框可一行一個輸入學生姓名與分數（或貼入逗號分隔資料）。自動計算全班人數、平均分數、最高分、最低分、標準差及及格率（60分）。以 Canvas 繪製 0-59、60-69、70-79、80-89、90-100 各區間的人數分佈直方圖。支援一鍵匯出成績報告為 CSV，並將資料持久化儲存於 localStorage。嚴格禁止表情符號。',
  },
  {
    title: '多階段番茄鐘與專注記錄簿',
    description: '自訂工作/短休/長休週期、圓環倒數計時、Web Audio 提示音、待辦清單與完成統計。',
    prompt: '請製作一個專業的「多階段番茄鐘與專注筆記工具」。具備 25 分鐘專注、5 分鐘短休、15 分鐘長休切換模式，並允許自訂各階段分鐘數。提供高雅的圓環進度倒數計時器，倒數結束時以 Web Audio API 合成輕柔提示嗶聲。下方具備當日待辦任務清單，可新增任務並標記完成。累計今日完成的番茄數並保存於 localStorage。嚴格禁止表情符號。',
  },
  {
    title: 'CSV 樞紐數據表格檢視器',
    description: '支援讀取上傳或貼入 CSV 檔案，提供分頁瀏覽、關鍵字即時搜尋、欄位排序與數值加總。',
    prompt: '請寫一個「CSV 數據檔案檢視與樞紐小工具」。具備檔案拖曳上傳與貼入 CSV 文字區域。讀取後自動解析第一行標題，呈現自適應現代數據表格，支援關鍵字即時過濾篩選、每頁 10/25 筆分頁切換、點擊表頭排序。針對純數字欄位，自動在底部列出加總值與平均值。支援編輯資料後重新匯出 CSV。嚴格禁止表情符號。',
  },
  {
    title: '雙面抽認卡記憶學習機 (Anki風)',
    description: '建立與編輯題目/答案抽認卡，支援隨機抽題、點擊翻牌、熟悉度標記與複習率進度。',
    prompt: '請製作一個「雙面抽認記憶卡片工具」。卡片正面為題目/單字，點擊後具備 3D 平滑翻轉動畫呈現背面解答。提供「答對（已掌握）」與「答錯（需加強）」評分按鈕。頂部顯示當前複習掌握率進度條。具備卡片管理抽屜，可新增、編輯、刪除卡片題目與答案，並將卡片庫完整儲存於 localStorage。嚴格禁止表情符號。',
  },
  {
    title: 'SVG 流程圖與架構決策樹繪製器',
    description: '以直覺的節點清單即時繪製樹狀/流程圖，支援平移縮放、顏色標記與一鍵匯出 SVG/PNG。',
    prompt: '請寫一個「流程圖與決策架構繪製小工具」。使用者可新增多個節點（標題、說明、狀態），並指定節點間的連接方向。即時以 SVG 自動佈局並繪製高雅的圓角卡片節點與箭頭連接線。節點支援拖曳微調位置。提供將當前流程圖一鍵匯出為向量 SVG 與高解析度 PNG 檔案。嚴格禁止表情符號。',
  },
];

const SYSTEM_PROMPT = `你是一位世界頂級的前端架構師與單檔應用程式開發專家。
使用者正在「工具小本本」平台中打造專屬的手帳小工具。
你的任務是根據使用者的需求描述，編寫出一個【100% 獨立完整、具備真實實用功能、高質感】的單一 HTML5 檔案。

【嚴格開發規範】
1. 輸出格式：必須為完整標準的 HTML5 文件，開頭必須是 <!DOCTYPE html>，結尾是 </html>。
2. 零外部打包依賴：所有樣式 (CSS) 與邏輯 (JavaScript) 必須內嵌於該 HTML 檔案的 <style> 與 <script> 標籤中；可使用標準 CDN (例如 https://cdn.tailwindcss.com) 輔助現代排版。
3. 實質深度與功能完整：拒絕任何僅有外殼或假 alert 的展示代碼！所有計算、Canvas 圖表繪製、表格過濾、檔案上傳 (FileReader)、檔案下載 (Blob / URL.createObjectURL) 必須真實可行且具備完整錯誤防護。
4. 本機資料持久化 (Persistence)：使用 localStorage 儲存使用者的關鍵資料與設定狀態，確保網頁重新整理後內容依然存在。
5. 設計美學：採用溫潤米紙手帳風格或俐落現代極簡風格，具備高對比度、精緻圓角與優雅間距。
6. 表情符號禁令 (STRICT ZERO EMOJIS)：全站文字、按鈕、提示、註解均【嚴格禁止使用任何表情符號 (Emoji)】，請使用純文字或標準 Unicode 符號 (如 +, -, x, /, >, <, # 等)。
7. 語言要求：所有介面文字一律使用【繁體中文 (台灣)】。
8. 輸出要求：請直接輸出 HTML 代碼。如果使用 markdown 標籤包裹，請使用 \`\`\`html ... \`\`\`。`;

export function getAIConfig() {
  try {
    const raw = localStorage.getItem('notebook_ai_config');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse notebook_ai_config:', e);
  }
  return {
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-2.0-flash',
    baseUrl: '',
  };
}

export function saveAIConfig(config) {
  try {
    localStorage.setItem('notebook_ai_config', JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save notebook_ai_config:', e);
  }
}

/**
 * 呼叫 AI API 生成小工具代碼
 */
export async function generateToolCode({ prompt, contextCode = '', config = null, onProgress }) {
  const currentConfig = config || getAIConfig();
  const apiKey = (currentConfig.apiKey || '').trim();

  if (!apiKey) {
    throw new Error('尚未設定 API Key。請點擊面板中的「API 設定」填入免費金鑰。');
  }

  const userPrompt = contextCode
    ? `【既有代碼微調需求】\n既有代碼：\n\`\`\`html\n${contextCode}\n\`\`\`\n\n使用者希望進行的修改與強化需求：\n${prompt}`
    : `【全新小工具開發需求】\n${prompt}`;

  if (onProgress) onProgress('正在構建架構與生成小工具代碼...');

  if (currentConfig.provider === 'gemini') {
    return await callGeminiAPI(apiKey, currentConfig.model || 'gemini-2.0-flash', userPrompt);
  } else {
    // OpenAI 相容介面 (Groq / OpenRouter / 自訂)
    let baseUrl = currentConfig.baseUrl;
    let model = currentConfig.model;

    if (currentConfig.provider === 'groq') {
      baseUrl = 'https://api.groq.com/openai/v1';
      model = model || 'qwen-2.5-coder-32b';
    } else if (currentConfig.provider === 'openrouter') {
      baseUrl = 'https://openrouter.ai/api/v1';
      model = model || 'qwen/qwen-2.5-coder-32b-instruct:free';
    } else if (currentConfig.provider === 'custom') {
      baseUrl = (currentConfig.baseUrl || '').replace(/\/+$/, '');
    }

    return await callOpenAICompatibleAPI(baseUrl, apiKey, model, userPrompt);
  }
}

/**
 * 呼叫 Google Gemini API
 */
async function callGeminiAPI(apiKey, model, userPrompt) {
  const modelName = model || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 8192,
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const msg = errorData.error?.message || `Gemini API 請求失敗 (HTTP ${res.status})`;
    throw new Error(msg);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini API 未回傳有效代碼內容，請重試或簡化提示詞。');
  }

  return cleanGeneratedHtml(rawText);
}

/**
 * 呼叫 OpenAI 相容端點 (Groq / OpenRouter / Custom)
 */
async function callOpenAICompatibleAPI(baseUrl, apiKey, model, userPrompt) {
  const cleanBase = (baseUrl || 'https://api.groq.com/openai/v1').replace(/\/+$/, '');
  const endpoint = `${cleanBase}/chat/completions`;

  const body = {
    model: model || 'qwen-2.5-coder-32b',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 8192,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const msg = errorData.error?.message || `API 請求失敗 (HTTP ${res.status})`;
    throw new Error(msg);
  }

  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error('AI 未回傳代碼內容，請重試。');
  }

  return cleanGeneratedHtml(rawText);
}

/**
 * 清理並提取產出之 HTML 代碼
 */
export function cleanGeneratedHtml(rawText) {
  if (!rawText) return '';
  let cleaned = rawText.trim();

  // 若被 markdown 包裹，提取出內部 HTML
  const htmlBlockMatch = cleaned.match(/```html\s*([\s\S]*?)\s*```/i);
  if (htmlBlockMatch) {
    cleaned = htmlBlockMatch[1].trim();
  } else {
    const genericBlockMatch = cleaned.match(/```\s*([\s\S]*?)\s*```/i);
    if (genericBlockMatch) {
      cleaned = genericBlockMatch[1].trim();
    }
  }

  // 若缺少 DOCTYPE 補全標準頭部
  if (!cleaned.toLowerCase().includes('<!doctype html>')) {
    if (cleaned.toLowerCase().includes('<html')) {
      cleaned = '<!DOCTYPE html>\n' + cleaned;
    } else {
      cleaned = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: sans-serif; padding: 16px; margin: 0; }
  </style>
</head>
<body>
${cleaned}
</body>
</html>`;
    }
  }

  return cleaned;
}
