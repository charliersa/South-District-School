import { SCHOOLS, ALL_CATEGORIES } from '../data.js';

export default function CompareModal({ ids, onClose, toggleCompare, toggleFav, favorites }) {
  const items = ids.map(id => {
    const found = SCHOOLS.flatMap(s => s.departments.map(d => ({ s, d }))).find(x => x.d.id === id);
    return found;
  }).filter(Boolean);

  if (items.length === 0) return null;

  const rows = [
    { label: '系名', get: ({ d }) => d.name },
    { label: '學校', get: ({ s }) => `${s.name}` },
    { label: '地區', get: ({ s }) => s.city },
    { label: '類型', get: ({ s }) => s.type.startsWith('public') ? '公立' : '私立' },
    { label: '類別', get: ({ d }) => d.cats.map(id => ALL_CATEGORIES.find(c => c.id === id)?.name).filter(Boolean).join(' / ') },
    { label: '一句話', get: ({ d }) => d.oneLiner },
    { label: '特色標籤', get: ({ d }) => (d.tags || []).map(t => `#${t}`).join('　') },
    { label: '完整介紹', get: ({ d }) => d.detail },
    { label: '官方連結', get: ({ d }) => d.url, link: true },
    { label: '課程地圖', get: ({ d }) => d.course, link: true },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal compare-modal" onClick={e => e.stopPropagation()}>
        <header className="modal-head">
          <div>
            <h2>校系比較</h2>
            <p>{items.length} 個系並排對比 — 找出最適合自己的</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </header>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                {items.map(({ s, d }) => (
                  <th key={d.id}>
                    <div className="ct-card">
                      <div className="ct-card-cats">
                        {d.cats.slice(0, 2).map(id => {
                          const c = ALL_CATEGORIES.find(x => x.id === id);
                          return <span key={id} className="dept-cat-pill" style={{ background: c?.bg, color: c?.color }}>{c?.icon} {c?.name}</span>;
                        })}
                      </div>
                      <h3>{d.name}</h3>
                      <p>{s.short}</p>
                      <div className="ct-card-acts">
                        <button className={`icon-btn icon-fav ${favorites.includes(d.id) ? 'on' : ''}`} onClick={() => toggleFav(d.id)}>{favorites.includes(d.id) ? '★' : '☆'}</button>
                        <button className="icon-btn" onClick={() => toggleCompare(d.id)} title="移除">×</button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.label}>
                  <th>{r.label}</th>
                  {items.map(x => {
                    const v = r.get(x);
                    return (
                      <td key={x.d.id}>
                        {r.link
                          ? (v ? <a href={v} target="_blank" rel="noreferrer">前往 ↗</a> : <span className="muted">—</span>)
                          : (v || <span className="muted">—</span>)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
