// 南區校系頁
function SchoolsPage({ initialCategory, favorites, toggleFav, compareIds, toggleCompare, onOpenCompare }) {
  const [activeCat, setActiveCat] = React.useState(initialCategory || 'all');
  const [activeType, setActiveType] = React.useState('all'); // all / public / private
  const [activeCity, setActiveCity] = React.useState('all'); // all / 台南 / 高雄 / 屏東
  const [viewMode, setViewMode] = React.useState('school'); // school / category / favorites
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    if (initialCategory) setActiveCat(initialCategory);
  }, [initialCategory]);

  // 篩選後的系
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

  // 分組
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

// 系卡片
function DeptCard({ school, dept, isFav, onFav, isCompare, onCompare }) {
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

// 比較表 Modal
function CompareModal({ ids, onClose, toggleCompare, toggleFav, favorites }) {
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

window.SchoolsPage = SchoolsPage;
window.DeptCard = DeptCard;
window.CompareModal = CompareModal;

// 學校升學管道區塊
function SchoolAdmissionBlock({ school }) {
  const [open, setOpen] = React.useState(false);
  const track = TRACK_LABELS[school.track] || TRACK_LABELS.general;
  const paths = (school.paths || []).map(id => ({ id, ...ADMISSION_PATHS[id] })).filter(p => p.name);

  // 對應到該管道的官方連結（如果有）
  const linkMap = {
    'tech-star': school.links.star,
    'tech-excellent': school.links.excellent,
    'tech-select': school.links.select,
    'tech-place': school.links.place,
    'tech-apply': school.links.apply,
    'tech-solo': school.links.solo,
  };

  return (
    <div className="admission-block">
      <button className="admission-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="at-left">
          <span className="at-icon" style={{ background: track.color }}>🎯</span>
          <span>
            <span className="at-title">升學管道對照</span>
            <span className="at-sub">{track.name} · {track.desc}</span>
          </span>
        </span>
        <span className="at-tags">
          {paths.slice(0, 4).map(p => (
            <span key={p.id} className="at-pill" style={{ background: p.color }}>{p.short}</span>
          ))}
          {paths.length > 4 && <span className="at-more">+{paths.length - 4}</span>}
        </span>
        <span className="at-chev" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)' }}>▸</span>
      </button>

      {open && (
        <div className="admission-detail">
          {school.trackNote && (
            <div className="admission-tnote" style={{ background: track.bg, borderColor: track.color }}>
              <strong style={{ color: track.color }}>判讀：</strong>{school.trackNote}
            </div>
          )}

          <div className="admission-paths">
            {paths.map(p => {
              const link = linkMap[p.id];
              return (
                <div key={p.id} className="admission-path" style={{ '--ap-color': p.color }}>
                  <div className="ap-head">
                    <span className="ap-tag" style={{ background: p.color }}>{p.short}</span>
                    <span className="ap-name">{p.name}</span>
                    {link && <a className="ap-link" href={link} target="_blank" rel="noreferrer">官方頁 ↗</a>}
                  </div>
                  <p className="ap-note">{p.note}</p>
                </div>
              );
            })}
          </div>

          {school.advice && school.advice.length > 0 && (
            <div className="admission-advice">
              <div className="aa-title">📌 準備建議</div>
              <ul>
                {school.advice.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

window.SchoolAdmissionBlock = SchoolAdmissionBlock;
