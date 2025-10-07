'use strict';
// 年数はここで調整（デフォルト25年）
const YEARS = 25;

const yen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

const ids = [
  'current-housing','current-utilities','current-phone','current-insurance','current-subscription','current-other',
  'reduced-housing','reduced-utilities','reduced-phone','reduced-insurance','reduced-subscription','reduced-other'
];

// DOM 参照
const currentTotalEl = document.getElementById('current-total');
const reducedTotalEl = document.getElementById('reduced-total');
const monthlySavingsEl = document.getElementById('monthly-savings');
const totalSavingsEl = document.getElementById('total-savings');

const currentBar = document.getElementById('current-bar');
const reducedBar = document.getElementById('reduced-bar');
const currentBarValue = document.getElementById('current-bar-value');
const reducedBarValue = document.getElementById('reduced-bar-value');

// 数値取得（未入力や負値は0扱い）
function val(id) {
  const n = Number(document.getElementById(id).value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function sum(prefix) {
  return val(`${prefix}-housing`)
       + val(`${prefix}-utilities`)
       + val(`${prefix}-phone`)
       + val(`${prefix}-insurance`)
       + val(`${prefix}-subscription`)
       + val(`${prefix}-other`);
}

function updateBars(current, reduced) {
  const max = Math.max(current, reduced, 1);
  const chartHeight = 200; // CSSの.heightと合わせる
  const minHeight = 20;

  const currentH = Math.max(minHeight, (current / max) * chartHeight);
  const reducedH = Math.max(minHeight, (reduced / max) * chartHeight);

  currentBar.style.height = `${currentH}px`;
  reducedBar.style.height = `${reducedH}px`;

  currentBarValue.textContent = yen.format(current);
  reducedBarValue.textContent = yen.format(reduced);
}

function recalc() {
  const current = sum('current');
  const reduced = sum('reduced');
  const monthlySavings = Math.max(0, current - reduced);
  const totalSavings = monthlySavings * 12 * YEARS;

  currentTotalEl.textContent = yen.format(current);
  reducedTotalEl.textContent = yen.format(reduced);
  monthlySavingsEl.textContent = yen.format(monthlySavings);
  totalSavingsEl.textContent = yen.format(totalSavings);

  updateBars(current, reduced);
}

// 入力イベントを一括で監視
ids.forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', recalc);
});

// 初期計算
recalc();