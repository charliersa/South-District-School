import React from 'react';
import { SCHOOLS, ALL_CATEGORIES, TRACK_LABELS } from '../data.js';
import DeptCard from '../schools/DeptCard.jsx';
import CompareModal from '../schools/CompareModal.jsx';
import SchoolAdmissionBlock from '../schools/SchoolAdmissionBlock.jsx';

export default function SchoolsPage({ initialCategory, favorites, toggleFav, compareIds, toggleCompare, onOpenCompare }) {
  const [activeCat, setActiveCat] = React.useState(initialCategory || 'all');
  const [activeType, setActiveType] = React.useState('all');
  const [activeCity, setActiveCity] = React.useState('all');
  const [viewMode, setViewMode] = React.useState('school');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    if (initialCategory) setActiveCat(initialCategory);
  }, [initialCategory]);

  const filtered = React.useMemo(() => {
    const out = [];
    for (const sch of SCHOOLS) {
      if (activeType !== 'all') {
        if (activeType === 'public' && !sch.type.startsWith('public')) continue;
        if (activeType === 'private' && !sch.type.startsWith('private')) continue;
      }
      if (activeCity !== 'all' && sch.city !== activeCity) continue;
      for (const d of sch.departments) {
        if (activeCat !== 'all' && !d.cats.includes(activeCat)) continue;
        if (search && !`${sch.name}${sch.short}${d.name}${d.oneLiner}${(d.tags || []).join(' ')}`.toLowerCase().includes(search.toLowerCase())) continue;
        if (viewMode === 'favorites' && !favorites.includes(d.id)) continue;
        out.push({ school: sch, dept: d });
      }
    }
    return out;
  }, [activeCat, activeType, activeCity, search, viewMode, favorites]);

  const grouped = React.useMemo(() => {
    const g = new Map();
    for (const item of filtered) {
      const key = viewMode === 'category'
        ? item.dept.cats[0]
        : item.school.id;
      if (!g.has(key)) g.set(key, []);
      g.get(key).push(item);
    }
    return g;
  }, [filtered, viewMode]);

  return (
    <div className="page page-schools">
      <header className="page-hero schools-hero">
        <div className="hero-eyebrow">
          <span className="hero-dot" style={{ background: '#12B886' }} />
          PART 03
        </div>
        <h1 className="hero-title">南區<span className="hl hl-mint">設計藝術空間</span>校系</h1>
        <p className="hero-sub">嘉義、台南、高雄、屏東共 <strong>9 所</strong>學校、約 <strong>30 個系</strong>。可用上方按類別、學校類型、地區、收藏快速篩選。</p>
      </header>

      <div className="filter-bar">
        <div className="filter-row">
          <span className="filter-label">類別</span>
          <div className="chip-scroll">
            <button className={`fchip ${activeCat === 'all' ? 'on' : ''}`} onClick={() => setActiveCat('all')}>全部</button>
            {ALL_CATEGORIES.map(c => (
              <button key={c.id} className={`fchip ${activeCat === c.id ? 'on' : ''}`}
                style={activeCat === c.id ? { background: c.color, borderColor: c.color, color: '#fff' } : { borderColor: c.color, color: c.color }}
                onClick={() => setActiveCat(c.id)}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-label">學校</span>
          <div className="filter-segments">
            <div className="seg">
              <button className={activeType === 'all' ? 'on' : ''} onClick={() => setActiveType('all')}>全部</button>
              <button className={activeType === 'public' ? 'on' : ''} onClick={() => setActiveType('public')}>公立</button>
              <button className={activeType === 'private' ? 'on' : ''} onClick={() => setActiveType('private')}>私立</button>
            </div>
            <div className="seg">
              <button className={activeCity === 'all' ? 'on' : ''} onClick={() => setActiveCity('all')}>全區</button>
              <button className={activeCity === '台南' ? 'on' : ''} onClick={() => setActiveCity('台南')}>台南</button>
              <button className={activeCity === '高雄' ? 'on' : ''} onClick={() => setActiveCity('高雄')}>高雄</button>
              <button className={activeCity === '屏東' ? 'on' : ''} onClick={() => setActiveCity('屏東')}>屏東</button>
            </div>
          </div>
          <input className="filter-search" placeholder="搜尋系名 / 關鍵字…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="filter-row filter-row-end">
          <div className="seg seg-view">
            <button className={viewMode === 'school' ? 'on' : ''} onClick={() => setViewMode('school')}>依學校</button>
            <button className={viewMode === 'category' ? 'on' : ''} onClick={() => setViewMode('category')}>依類別</button>
            <button className={viewMode === 'favorites' ? 'on' : ''} onClick={() => setViewMode('favorites')}>
              我的志願 <span className="fav-bubble">{favorites.length}</span>
            </button>
          </div>
          <div className="result-count">共 <strong>{filtered.length}</strong> 個系</div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">{viewMode === 'favorites' ? '☆' : '🔍'}</div>
          <h3>{viewMode === 'favorites' ? '志願清單還是空的' : '找不到符合條件的科系'}</h3>
          <p>{viewMode === 'favorites' ? '在卡片右上角按 ☆ 把感興趣的系加入志願清單。' : '試著放寬篩選條件，或清空搜尋字詞。'}</p>
        </div>
      )}

      <div className="schools-content">
        {[...grouped.entries()].map(([key, items]) => {
          if (viewMode === 'category') {
            const cat = ALL_CATEGORIES.find(c => c.id === key);
            return (
              <section key={key} className="school-section cat-section" style={{ '--cat-color': cat?.color, '--cat-bg': cat?.bg }}>
                <header className="school-section-head">
                  <div className="school-mark cat-mark">{cat?.icon}</div>
                  <div>
                    <h2>{cat?.fullName || cat?.name}</h2>
                    <p className="school-meta">{items.length} 個系</p>
                  </div>
                </header>
                <div className="dept-grid">
                  {items.map(({ school, dept }) => (
                    <DeptCard key={dept.id} school={school} dept={dept}
                      isFav={favorites.includes(dept.id)} onFav={() => toggleFav(dept.id)}
                      isCompare={compareIds.includes(dept.id)} onCompare={() => toggleCompare(dept.id)} />
                  ))}
                </div>
              </section>
            );
          }

          const sch = items[0].school;
          const track = TRACK_LABELS[sch.track] || TRACK_LABELS.general;
          return (
            <section key={key} className="school-section">
              <header className="school-section-head">
                <div className="school-mark">{sch.short.slice(0, 2)}</div>
                <div className="school-head-main">
                  <h2>
                    {sch.name}
                    <span className={`school-badge school-badge-${sch.type.startsWith('public') ? 'public' : 'private'}`}>
                      {sch.type.startsWith('public') ? '公立' : '私立'}
                    </span>
                    <span className="school-city">📍 {sch.city}</span>
                    <span className="track-badge" style={{ background: track.bg, color: track.color, borderColor: track.color }}>
                      {track.short}
                    </span>
                  </h2>
                  <p className="school-meta">{sch.college && `${sch.college} · `}{items.length} 個系</p>
                  <p className="school-note">{sch.note}</p>
                  <div className="school-links">
                    {sch.links.admission && <a href={sch.links.admission} target="_blank" rel="noreferrer">招生入口 ↗</a>}
                    {sch.links.college && <a href={sch.links.college} target="_blank" rel="noreferrer">學院首頁 ↗</a>}
                    {sch.links.courses && <a href={sch.links.courses} target="_blank" rel="noreferrer">課程科目表 ↗</a>}
                    {sch.links.day && <a href={sch.links.day} target="_blank" rel="noreferrer">四技日間部 ↗</a>}
                  </div>
                </div>
              </header>

              <SchoolAdmissionBlock school={sch} />

              <div className="dept-grid">
                {items.map(({ school, dept }) => (
                  <DeptCard key={dept.id} school={school} dept={dept}
                    isFav={favorites.includes(dept.id)} onFav={() => toggleFav(dept.id)}
                    isCompare={compareIds.includes(dept.id)} onCompare={() => toggleCompare(dept.id)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {compareIds.length > 0 && (
        <div className="compare-bar">
          <div className="compare-bar-inner">
            <div className="compare-info">
              <span className="compare-count">{compareIds.length}</span>
              <span>系已加入比較</span>
            </div>
            <div className="compare-thumbs">
              {compareIds.map(id => {
                const found = SCHOOLS.flatMap(s => s.departments.map(d => ({ s, d }))).find(x => x.d.id === id);
                if (!found) return null;
                return (
                  <span key={id} className="compare-thumb">
                    {found.s.short}·{found.d.name.replace('學系', '系').replace(' 系', '系')}
                    <button onClick={() => toggleCompare(id)}>×</button>
                  </span>
                );
              })}
            </div>
            <button className="compare-go" onClick={onOpenCompare} disabled={compareIds.length < 2}>
              比較 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { CompareModal };
