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
  Lock,
  Download,
  Copy,
  Check,
  Share2,
  GraduationCap,
  Star
} from 'lucide-react';

export const VerifyCertificate = () => {
  const { showToast, triggerConfetti } = useApp();
  const [certCode, setCertCode] = useState('CLUSTER-CERT-8921-ROB');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

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
      setErrorMsg(err.message || 'Certificate code not recognized on cluster ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.certCode);
    setCopied(true);
    showToast(`Verification code ${result.certCode} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10B981, #06B6D4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
          color: '#FFFFFF'
        }}>
          <ShieldCheck size={30} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
          Public Cluster Credential Verifier
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '560px', margin: '0.6rem auto 0', lineHeight: '1.5' }}>
          Instantly verify the cryptographic authenticity, issuing institution credentials, and demonstrated competency scores of any cluster-issued certificate.
        </p>
      </div>

      {/* Verification Query Input */}
      <form 
        onSubmit={handleVerify} 
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
          Enter Unique Certificate Verification Code
        </label>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text"
              required
              placeholder="E.g. CLUSTER-CERT-8921-ROB"
              value={certCode}
              onChange={(e) => setCertCode(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.6rem',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#1E40AF',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0 1.75rem',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <ShieldCheck size={18} />
            <span>{loading ? 'Verifying...' : 'Authenticate Credential'}</span>
          </button>
        </div>

        {/* Quick Demo Pre-fill Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#64748B', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          <span>Try Sample Credentials:</span>
          <button 
            type="button" 
            onClick={() => { setCertCode('CLUSTER-CERT-8921-ROB'); }} 
            style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#1E40AF',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            CLUSTER-CERT-8921-ROB (Robotics)
          </button>
          <button 
            type="button" 
            onClick={() => { setCertCode('CLUSTER-CERT-4410-GPU'); }} 
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#B45309',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            CLUSTER-CERT-4410-GPU (Deep Learning)
          </button>
          <button 
            type="button" 
            onClick={() => { setCertCode('CLUSTER-CERT-5529-SEMI'); }} 
            style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            CLUSTER-CERT-5529-SEMI (Nanofabrication)
          </button>
        </div>
      </form>

      {/* Verification Result Display */}
      {hasSearched && result && (
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #10B981',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Authentic Status Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <CheckCircle2 size={28} />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065F46' }}>
                  Authentic Verified Credential
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  Validated against Western Maharashtra Consortium Ledger • Audit Check #{result.verifiedCount || 1}
                </div>
              </div>
            </div>

            <button 
              onClick={handleCopyCode}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                fontWeight: 800,
                color: '#1E40AF',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{result.certCode}</span>
            </button>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>AWARDED TO SCHOLAR</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>{result.recipientName}</div>
              <div style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600 }}>{result.recipientInstitution}</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>ISSUING CONSORTIUM AUTHORITY</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>{result.issuerInstitutionName}</div>
              <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>Under Inter-Institutional Cluster MOU</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>COMPETENCY TITLE</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{result.title}</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>ASSESSMENT GRADE</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>{result.grade}</div>
            </div>
          </div>

          {/* Endorsed Skills Breakdown */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              ENDORSED SKILL REPERTOIRE
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {result.skills?.map((sk, idx) => (
                <span 
                  key={idx} 
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#1E40AF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '6px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600
                  }}
                >
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Cryptographic Audit Trail */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem 1.25rem', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#059669', fontWeight: 700 }}>
              <Lock size={14} />
              <span>Ledger Integrity: {result.integrityStatus}</span>
            </div>
            <div style={{ color: '#64748B' }}>
              Audit Verification Timestamp: {new Date(result.verificationTimestamp).toLocaleString()}
            </div>
          </div>

          {/* Print Certificate Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
            <button 
              onClick={() => {
                triggerConfetti();
                window.print();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.4rem',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Download size={16} />
              <span>Print Verified Official Certificate</span>
            </button>
          </div>

        </div>
      )}

      {/* Error state */}
      {hasSearched && errorMsg && (
        <div 
          style={{
            padding: '1.5rem',
            border: '1px solid #FECDD3',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: '#FFF1F2'
          }}
        >
          <AlertTriangle size={26} color="#E11D48" />
          <div>
            <div style={{ fontWeight: 700, color: '#BE123C', fontSize: '1rem' }}>Verification Failed</div>
            <div style={{ fontSize: '0.875rem', color: '#881337', marginTop: '0.15rem' }}>{errorMsg}</div>
          </div>
        </div>
      )}

    </div>
  );
};
