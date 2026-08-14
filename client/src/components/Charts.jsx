import React from 'react';

// Horizontal Progress Bar for Category Resource Hours
export const ResourceCategoryBarChart = ({ data = [] }) => {
  if (!data.length) return <div style={{ color: 'var(--text-muted)' }}>No category data available</div>;

  const maxHours = Math.max(...data.map(d => d.hours || 0), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {data.map((item, idx) => {
        const percentage = Math.round(((item.hours || 0) / maxHours) * 100);
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <span>{item.icon || '🔬'}</span>
                <span>{item.category}</span>
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                {item.hours} hrs <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({item.count} facilities)</span>
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.8s ease'
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Inter-Institutional Contribution Comparison Matrix
export const InstitutionMatrixChart = ({ data = [] }) => {
  if (!data.length) return null;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Partner Institution</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Cluster Tier</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Hours Shared (Out)</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Hours Utilized (In)</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Collaboration Health</th>
          </tr>
        </thead>
        <tbody>
          {data.map((inst, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '0.75rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <span style={{ fontSize: '1.1rem' }}>{inst.logo}</span>
                <span>{inst.name}</span>
              </td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                <span className="badge badge-indigo">{inst.tier}</span>
              </td>
              <td style={{ padding: '0.75rem 0.5rem', color: '#6ee7b7', fontWeight: 700 }}>
                +{inst.providedHours} hrs
              </td>
              <td style={{ padding: '0.75rem 0.5rem', color: '#67e8f9', fontWeight: 700 }}>
                {inst.consumedHours} hrs
              </td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '70px',
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(inst.netContributionScore, 100)}%`,
                      height: '100%',
                      backgroundColor: inst.netContributionScore > 50 ? '#10b981' : '#f59e0b',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {inst.netContributionScore > 50 ? 'Strong Contributor' : 'Net Consumer'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Skill Demand vs Certified Talent Matrix
export const SkillDemandMatrix = ({ data = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {data.map((item, idx) => (
        <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.skill}</div>
            <span className="badge badge-emerald">{item.status}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.75rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Industry Demand Index</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.demandIndex}%`, height: '100%', background: '#4f46e5' }} />
                </div>
                <span style={{ fontWeight: 700, color: '#a5b4fc' }}>{item.demandIndex}/100</span>
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Cluster Certified Candidates</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((item.certifiedStudents / 150) * 100, 100)}%`, height: '100%', background: '#06b6d4' }} />
                </div>
                <span style={{ fontWeight: 700, color: '#67e8f9' }}>{item.certifiedStudents}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
