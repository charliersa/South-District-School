import React from 'react';
import TopBar from './components/TopBar.jsx';
import SiteFoot from './components/SiteFoot.jsx';
import {
  TweaksPanel, TweakSection, TweakSelect, TweakToggle,
  useTweaks,
} from './components/TweaksPanel.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import AdmissionPage from './pages/AdmissionPage.jsx';
import SchoolsPage, { CompareModal } from './pages/SchoolsPage.jsx';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "style": "sticker",
  "accent": "#FF5C5C",
  "showSubtitles": true
}/*EDITMODE-END*/;

export default function App() {
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
