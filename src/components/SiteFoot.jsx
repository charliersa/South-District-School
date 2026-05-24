import React from 'react';
import { SCHOOLS } from '../data.js';

function useVisitorCount() {
  const [count, setCount] = React.useState(null);
  const [today, setToday] = React.useState(null);

  React.useEffect(() => {
    const NS = 'south-design-schools-2026';

    // 累計總訪客
    fetch(`https://api.counterapi.dev/v1/${NS}/visits/up`)
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {});

    // 今日訪客（用日期當 key）
    const todayKey = new Date().toISOString().slice(0, 10);
    fetch(`https://api.counterapi.dev/v1/${NS}/daily-${todayKey}/up`)
      .then(r => r.json())
      .then(d => setToday(d.count))
      .catch(() => {});
  }, []);

  return { count, today };
}

function fmt(n) {
  if (n == null) return '—';
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 萬';
  return n.toLocaleString('zh-TW');
}

export default function SiteFoot() {
  const { count, today } = useVisitorCount();

  return (
    <footer className="sitefoot">
      <div className="sitefoot-inner">
        <div className="foot-col">
          <div className="foot-title">關於這份整理</div>
          <p>南部地區（嘉義、台南、高雄、屏東）9 所學校、約 30 個設計 / 藝術 / 空間相關校系的整理。</p>
          <p className="foot-warn">⚠️ 招生名額、採計科目、二階方式每年都會變，<strong>請務必再到官方招生頁確認</strong>。</p>
        </div>
        <div className="foot-col">
          <div className="foot-title">收錄學校</div>
          <ul className="foot-school-list">
            {SCHOOLS.map(s => (
              <li key={s.id}>
                <a href={s.links.admission} target="_blank" rel="noreferrer">
                  {s.name}（{s.short}）↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <div className="foot-title">下一步建議</div>
          <ul className="foot-tips">
            <li>把感興趣的系按 ★ 加入志願清單</li>
            <li>用「比較」功能挑出最後 2–4 個系並排對比</li>
            <li>對著官網的「課程地圖」逐一確認四年要學什麼</li>
            <li>到官方招生頁查當年度名額、採計、二階方式</li>
          </ul>
        </div>
      </div>

      {/* 流量計數列 */}
      <div className="sitefoot-traffic">
        <div className="traffic-inner">
          <span className="traffic-icon">📊</span>
          <div className="traffic-item">
            <span className="traffic-label">累計瀏覽</span>
            <span className={`traffic-num${count == null ? ' traffic-loading' : ''}`}>{fmt(count)}</span>
          </div>
          <div className="traffic-divider" />
          <div className="traffic-item">
            <span className="traffic-label">今日瀏覽</span>
            <span className={`traffic-num${today == null ? ' traffic-loading' : ''}`}>{fmt(today)}</span>
          </div>
        </div>
      </div>

      <div className="sitefoot-bottom">資料整理 · 2026 · 南區設計藝術校系</div>
    </footer>
  );
}
