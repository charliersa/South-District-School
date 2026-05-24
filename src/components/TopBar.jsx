export default function TopBar({ page, setPage, favCount, onOpenCompare, compareCount }) {
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
