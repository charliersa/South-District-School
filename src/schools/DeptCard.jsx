import { ALL_CATEGORIES } from '../data.js';

export default function DeptCard({ school, dept, isFav, onFav, isCompare, onCompare }) {
  const cats = dept.cats.map(id => ALL_CATEGORIES.find(c => c.id === id)).filter(Boolean);
  const mainCat = cats[0];
  return (
    <article className="dept-card" style={{ '--accent': mainCat?.color, '--accent-bg': mainCat?.bg }}>
      <div className="dept-card-top">
        <div className="dept-cats">
          {cats.map(c => (
            <span key={c.id} className="dept-cat-pill" style={{ background: c.bg, color: c.color }}>
              {c.icon} {c.name}
            </span>
          ))}
        </div>
        <div className="dept-actions">
          <button className={`icon-btn ${isCompare ? 'on' : ''}`} onClick={onCompare} title="加入比較" aria-label="比較">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 4h12M2 8h8M2 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <button className={`icon-btn icon-fav ${isFav ? 'on' : ''}`} onClick={onFav} title="加入志願" aria-label="收藏">
            {isFav ? '★' : '☆'}
          </button>
        </div>
      </div>
      <h3 className="dept-name">{dept.name}</h3>
      <p className="dept-school">{school.short} · {school.college || school.name}</p>
      <p className="dept-oneliner">{dept.oneLiner}</p>
      {dept.tags && (
        <div className="dept-tags">
          {dept.tags.map(t => <span key={t} className="tag">#{t}</span>)}
        </div>
      )}
      <p className="dept-detail">{dept.detail}</p>
      <div className="dept-foot">
        {dept.url && <a href={dept.url} target="_blank" rel="noreferrer" className="dept-link">系所官網 ↗</a>}
        {dept.course && <a href={dept.course} target="_blank" rel="noreferrer" className="dept-link dept-link-alt">課程地圖 ↗</a>}
      </div>
    </article>
  );
}
