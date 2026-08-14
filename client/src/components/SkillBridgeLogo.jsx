import React from 'react';

export const SkillBridgeLogo = ({ size = 36, showText = true, textColor = '#FFFFFF', subtitleColor = '#94A3B8' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* High-tech Bridge & Interconnection SVG Emblem */}
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #06B6D4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
          flexShrink: 0,
          position: 'relative'
        }}
      >
        <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bridge Arch Cable */}
          <path d="M4 22C8 13 24 13 28 22" stroke="#FFFFFF" strokeWidth="2.75" strokeLinecap="round" />
          {/* Suspension Struts / Network Pillars */}
          <path d="M9 17.5V22.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 14.5V22.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M23 17.5V22.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Central Skill Beacon / Node */}
          <circle cx="16" cy="8.5" r="3.2" fill="#34D399" />
          {/* Left and Right Connection Nodes */}
          <circle cx="6" cy="22.5" r="2.2" fill="#FBBF24" />
          <circle cx="26" cy="22.5" r="2.2" fill="#60A5FA" />
        </svg>
      </div>

      {showText && (
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: textColor, letterSpacing: '-0.025em' }}>
            SkillBridge
          </div>
          <div style={{ fontSize: '0.65rem', color: subtitleColor, fontWeight: 500, letterSpacing: '0.02em' }}>
            Bridging Institutions. Sharing Future.
          </div>
        </div>
      )}
    </div>
  );
};
