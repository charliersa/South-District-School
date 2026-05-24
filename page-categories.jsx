// 設計類別頁
function CategoriesPage({ onPickCategory }) {
  // 計算每類有幾個系
  const counts = React.useMemo(() => {
    const c = {};
    for (const sch of SCHOOLS) for (const d of sch.departments) for (const k of d.cats) c[k] = (c[k] || 0) + 1;
    return c;
  }, []);

  return (
    <div className="page page-categories">
      <header className="page-hero">
        <div className="hero-eyebrow">
          <span className="hero-dot" />
          PART 01
        </div>
        <h1 className="hero-title">設計學群的<span className="hl hl-coral">六大類別</span></h1>
        <p className="hero-sub">隨著科技與產業轉型，從傳統工藝美術延伸出數位、互動與跨領域多元科系。先搞懂這六類，再去選科系才知道自己在挑什麼。</p>
      </header>

      <div className="cat-grid">
        {CATEGORIES.map((cat, i) => (
          <article key={cat.id} className="cat-card" style={{ '--cat-color': cat.color, '--cat-bg': cat.bg, '--rot': `${(i % 2 ? 1 : -1) * 0.6}deg` }}>
            <div className="cat-card-head">
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-num">0{i + 1}</div>
            </div>
            <h2 className="cat-name">{cat.fullName}</h2>
            <p className="cat-en">{['Visual Communication', 'Digital Media & Animation', 'Industrial & Product', 'Spatial & Environmental', 'Fashion & Textile', 'Interaction & UX'][i]}</p>
            <p className="cat-desc">{cat.desc}</p>

            <div className="cat-row">
              <div className="cat-row-label">核心內容</div>
              <div className="chip-list">
                {cat.core.map(c => <span key={c} className="chip chip-core">{c}</span>)}
              </div>
            </div>

            <div className="cat-row">
              <div className="cat-row-label">就業方向</div>
              <div className="chip-list">
                {cat.jobs.map(j => <span key={j} className="chip chip-job">{j}</span>)}
              </div>
            </div>

            <button className="cat-cta" onClick={() => onPickCategory(cat.id)}>
              查看南區{cat.name}相關校系
              <span className="cta-arrow">→</span>
              <span className="cta-count">{counts[cat.id] || 0} 個系</span>
            </button>
          </article>
        ))}
      </div>

      <footer className="cat-foot">
        <div className="cat-foot-tag">小提醒</div>
        <p>每個學校會根據自身定位（藝術大學偏純美術與工藝；科技大學偏產業應用與數位工具）將上述類別跨領域組合或延伸。系名只是參考，<strong>還是要看實際課表</strong>。</p>
      </footer>
    </div>
  );
}

window.CategoriesPage = CategoriesPage;
