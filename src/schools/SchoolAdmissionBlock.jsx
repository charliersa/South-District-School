import React from 'react';
import { ADMISSION_PATHS, TRACK_LABELS } from '../data.js';

export default function SchoolAdmissionBlock({ school }) {
  const [open, setOpen] = React.useState(false);
  const track = TRACK_LABELS[school.track] || TRACK_LABELS.general;
  const paths = (school.paths || []).map(id => ({ id, ...ADMISSION_PATHS[id] })).filter(p => p.name);

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
