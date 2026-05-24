// 主 App
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "style": "sticker",
  "accent": "#FF5C5C",
  "showSubtitles": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState('schools');
  const [initialCat, setInitialCat] = React.useState(null);
  const [favorites, setFavorites] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('south-design-favs') || '[]'); } catch (e) { return []; }
  });
  const [compareIds, setCompareIds] = React.useState([]);
  const [compareOpen, setCompareOpen] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('south-design-favs', JSON.stringify(favorites));
  }, [favorites]);

  // 對應風格 class
  React.useEffect(() => {
    document.documentElement.setAttribute('data-style', t.style);
  }, [t.style]);

  const toggleFav = (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  const toggleCompare = (id) => setCompareIds(c => c.includes(id) ? c.filter(x => x !== id) : c.length >= 4 ? c : [...c, id]);

  const goToSchoolsWithCat = (catId) => {
    setInitialCat(catId);
    setPage('schools');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  return (
    <div className="app">
      <TopBar page={page} setPage={setPage} favCount={favorites.length}
        onOpenCompare={() => setCompareOpen(true)} compareCount={compareIds.length} />

      <main className="main">
        {page === 'categories' && <CategoriesPage onPickCategory={goToSchoolsWithCat} />}
        {page === 'admission' && <AdmissionPage />}
        {page === 'schools' && (
          <SchoolsPage
            initialCategory={initialCat}
            favorites={favorites} toggleFav={toggleFav}
            compareIds={compareIds} toggleCompare={toggleCompare}
            onOpenCompare={() => setCompareOpen(true)}
          />
        )}
      </main>

      <SiteFoot />

      {compareOpen && (
        <CompareModal ids={compareIds} onClose={() => setCompareOpen(false)}
          toggleCompare={toggleCompare} toggleFav={toggleFav} favorites={favorites} />
      )}

      <TweaksPanel title="風格切換">
        <TweakSection label="整體視覺風格" />
        <TweakSelect label="風格" value={t.style}
          options={[
            { value: 'sticker', label: '🌈 彩色貼紙風（活潑）' },
            { value: 'notebook', label: '📓 筆記本風（清爽）' },
            { value: 'marker', label: '🖍️ 螢光標記風（焦點）' },
          ]}
          onChange={v => setTweak('style', v)} />
        <TweakToggle label="顯示英文副標 / 額外副標" value={t.showSubtitles}
          onChange={v => setTweak('showSubtitles', v)} />
        <TweakSection label="提示" />
        <div style={{ fontSize: 12, lineHeight: 1.6, color: '#666', padding: '0 4px' }}>
          切換不同風格時，色彩、邊框、陰影都會跟著改變。志願清單會自動儲存在這個瀏覽器裡。
        </div>
      </TweaksPanel>
    </div>
  );
}

function TopBar({ page, setPage, favCount, onOpenCompare, compareCount }) {
  return (
    <header className="topbar" data-screen-label="Topbar">
      <div className="topbar-inner">
        <div className="brand" onClick={() => setPage('schools')}>
          <div className="brand-mark">
            <span className="bm-1">南</span>
            <span className="bm-2">區</span>
          </div>
          <div className="brand-text">
            <div className="brand-title">南區設計 / 藝術 / 空間校系</div>
            <div className="brand-sub">嘉義・台南・高雄・屏東　校系總整理</div>
          </div>
        </div>

        <nav className="topnav">
          <button className={page === 'categories' ? 'on' : ''} onClick={() => setPage('categories')}>
            <span className="nn">01</span>設計類別
          </button>
          <button className={page === 'admission' ? 'on' : ''} onClick={() => setPage('admission')}>
            <span className="nn">02</span>升學資訊
          </button>
          <button className={page === 'schools' ? 'on' : ''} onClick={() => setPage('schools')}>
            <span className="nn">03</span>南區校系
          </button>
        </nav>

        <div className="topbar-actions">
          {compareCount > 0 && (
            <button className="ta-btn ta-compare" onClick={onOpenCompare}>
              比較 <span className="ta-num">{compareCount}</span>
            </button>
          )}
          <button className="ta-btn ta-fav" onClick={() => setPage('schools')}>
            <span>★</span> 志願 <span className="ta-num">{favCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function SiteFoot() {
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
      <div className="sitefoot-bottom">資料整理 · 2026 · 南區設計藝術校系</div>
    </footer>
  );
}

window.App = App;
