import React, { useState } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Building2, 
  Calendar, 
  Sparkles,
  Lock
} from 'lucide-react';

export const VerifyCertificate = () => {
  const { showToast, triggerConfetti } = useApp();
  const [certCode, setCertCode] = useState('EDU-CERT-8921-AI');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!certCode.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.verifyCertificate(certCode.trim());
      setResult(res.data);
      setHasSearched(true);
      triggerConfetti();
      showToast('Certificate Verified Authentically on Cluster Ledger!');
    } catch (err) {
      setResult(null);
      setHasSearched(true);
      setErrorMsg(err.message || 'Certificate code not recognized.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
        }}>
          <ShieldCheck size={28} color="#ffffff" />
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Public Cluster Credential Verifier</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '540px', margin: '0.5rem auto 0' }}>
          Instantly verify the authenticity, issuer validation, and competency scores of any credential issued across the cluster consortium.
        </p>
      </div>

      {/* Verification Query Input */}
      <form onSubmit={handleVerify} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label className="form-label" style={{ fontSize: '0.875rem' }}>
          Enter Unique Certificate Verification Code
        </label>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              required
              placeholder="E.g. EDU-CERT-8921-AI"
              value={certCode}
              onChange={(e) => setCertCode(e.target.value)}
              className="input mono"
              style={{ paddingLeft: '2.5rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
            <ShieldCheck size={16} />
            <span>{loading ? 'Verifying...' : 'Authenticate Credential'}</span>
          </button>
        </div>

        {/* Quick Demo Pre-fill Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span>Try Sample Credentials:</span>
          <button 
            type="button" 
            onClick={() => { setCertCode('EDU-CERT-8921-AI'); }} 
            className="badge badge-indigo" 
            style={{ cursor: 'pointer', border: 'none' }}
          >
            EDU-CERT-8921-AI (Deep Learning)
          </button>
          <button 
            type="button" 
            onClick={() => { setCertCode('EDU-CERT-4412-ROB'); }} 
            className="badge badge-amber" 
            style={{ cursor: 'pointer', border: 'none' }}
          >
            EDU-CERT-4412-ROB (Robotics & CNC)
          </button>
        </div>
      </form>

      {/* Verification Result Display */}
      {hasSearched && result && (
        <div 
          className="glass-panel"
          style={{
            padding: '2rem',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.05), rgba(15, 23, 42, 0.9))',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Authentic Status Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#6ee7b7' }}>
                  Authentic Verified Credential
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Validated against Consortium Ledger • Audit count: {result.verifiedCount}
                </div>
              </div>
            </div>
            <span className="badge badge-emerald mono" style={{ fontSize: '0.8125rem' }}>
              {result.certCode}
            </span>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AWARDED TO</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>{result.recipientName}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--accent-cyan)' }}>{result.recipientInstitution}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ISSUING AUTHORITY</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>{result.issuerInstitutionName}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Under National Capital Cluster MOU</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COMPETENCY TITLE</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{result.title}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ASSESSMENT GRADE</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fcd34d' }}>{result.grade}</div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>ENDORSED SKILL REPERTOIRE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {result.skills?.map((sk, idx) => (
                <span key={idx} className="badge badge-indigo">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Cryptographic Audit Trail */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#6ee7b7' }}>
              <Lock size={12} />
              <strong>Ledger Integrity:</strong> {result.integrityStatus}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              Verified Timestamp: {new Date(result.verificationTimestamp).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasSearched && errorMsg && (
        <div 
          className="glass-panel"
          style={{
            padding: '1.5rem',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(244, 63, 94, 0.05)'
          }}
        >
          <AlertTriangle size={24} color="var(--accent-rose)" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--accent-rose)' }}>Verification Failed</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{errorMsg}</div>
          </div>
        </div>
      )}
    </div>
  );
};
