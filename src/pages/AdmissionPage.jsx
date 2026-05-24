import { ADMISSION_DATA, JUNIOR_TO_SENIOR } from '../data.js';

export default function AdmissionPage() {
  return (
    <div className="page page-admission">
      <header className="page-hero">
        <div className="hero-eyebrow">
          <span className="hero-dot" style={{ background: '#1E90FF' }} />
          PART 02
        </div>
        <h1 className="hero-title">台灣升學的<span className="hl hl-blue">兩階段管道</span></h1>
        <p className="hero-sub">從國中升高中職、到高中職升大學，不論走學術路線（普高）還是技術路線（技高 / 高職），都有對應的管道。</p>
      </header>

      <section className="admit-stage">
        <div className="stage-tag stage-tag-1">階段 ①</div>
        <h2 className="stage-title">國中 <span className="arrow">➔</span> 高中職 / 五專</h2>
        <p className="stage-sub">以「<strong>國中教育會考</strong>」作為評量依據。</p>

        <div className="path-grid">
          {JUNIOR_TO_SENIOR.map(p => (
            <div key={p.name} className="path-card" style={{ '--path-color': p.color }}>
              <div className="path-card-head">
                <h3>{p.name}</h3>
                <span className="path-tag">{p.tag}</span>
              </div>
              <ul className="path-items">
                {p.items.map(it => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="admit-stage">
        <div className="stage-tag stage-tag-2">階段 ②</div>
        <h2 className="stage-title">高中職 <span className="arrow">➔</span> 大學 / 四技二專</h2>
        <p className="stage-sub">依「就讀普高還是技高 / 高職」分流。</p>

        <div className="route-pair">
          <div className="route-block route-a">
            <div className="route-head">
              <div className="route-letter">A</div>
              <div>
                <div className="route-from">{ADMISSION_DATA.highSchoolToCollege.title.split('·')[1]?.trim() || ''}</div>
                <div className="route-sub">{ADMISSION_DATA.highSchoolToCollege.subtitle}</div>
              </div>
            </div>
            <div className="route-paths">
              {ADMISSION_DATA.highSchoolToCollege.paths.map(p => (
                <div key={p.name} className="route-path" style={{ '--p-color': p.color }}>
                  <div className="route-path-name">{p.name}</div>
                  <div className="route-path-tag">{p.tag}</div>
                  <p className="route-path-desc">{p.desc}</p>
                  <div className="route-path-good">適合：{p.good}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="route-block route-b">
            <div className="route-head">
              <div className="route-letter">B</div>
              <div>
                <div className="route-from">{ADMISSION_DATA.vocationalToTech.title.split('·')[1]?.trim() || ''}</div>
                <div className="route-sub">{ADMISSION_DATA.vocationalToTech.subtitle}</div>
              </div>
            </div>
            <div className="route-paths">
              {ADMISSION_DATA.vocationalToTech.paths.map(p => (
                <div key={p.name} className="route-path" style={{ '--p-color': p.color }}>
                  <div className="route-path-name">{p.name}</div>
                  <div className="route-path-tag">{p.tag}</div>
                  <p className="route-path-desc">{p.desc}</p>
                  <div className="route-path-good">適合：{p.good}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bridge-block">
          <div className="bridge-head">
            <span className="bridge-icon">🌉</span>
            <h3>跨界管道（普高與技高的互通橋樑）</h3>
          </div>
          <div className="bridge-list">
            {ADMISSION_DATA.crossBridges.map(b => (
              <div key={b.name} className="bridge-item">
                <div className="bridge-name">{b.name}</div>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
