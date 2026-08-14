import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, change, trend = 'up', color = 'indigo' }) => {
  const getColorStyles = () => {
    switch (color) {
      case 'cyan':
        return { bg: 'var(--accent-cyan-light)', text: 'var(--accent-cyan)', border: 'rgba(6, 182, 212, 0.3)' };
      case 'emerald':
        return { bg: 'var(--accent-emerald-light)', text: 'var(--accent-emerald)', border: 'rgba(16, 185, 129, 0.3)' };
      case 'amber':
        return { bg: 'var(--accent-amber-light)', text: 'var(--accent-amber)', border: 'rgba(245, 158, 11, 0.3)' };
      case 'rose':
        return { bg: 'var(--accent-rose-light)', text: 'var(--accent-rose)', border: 'rgba(244, 63, 94, 0.3)' };
      default:
        return { bg: 'var(--accent-primary-light)', text: '#a5b4fc', border: 'rgba(99, 102, 241, 0.3)' };
    }
  };

  const style = getColorStyles();

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: style.bg,
            border: `1px solid ${style.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: style.text
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
            {subtitle}
          </div>
        )}
      </div>

      {change && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: trend === 'up' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
          <span>{trend === 'up' ? '↑' : '↓'}</span>
          <span>{change}</span>
        </div>
      )}
    </div>
  );
};
