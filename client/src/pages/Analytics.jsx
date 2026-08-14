import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { 
  ResourceCategoryBarChart, 
  InstitutionMatrixChart, 
  SkillDemandMatrix 
} from '../components/Charts';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Layers, 
  Award, 
  Building2,
  PieChart,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.getAnalyticsOverview();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const kpis = data?.kpis;
  const placementSummary = data?.placementSummary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Cluster Resource & ROI Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Real-time metrics on equipment utilization, capital expenditure savings, and cross-institutional placement outcomes.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <StatCard 
          title="Cluster Capital Saved" 
          value={`₹${kpis?.totalCostSavedCrores || '4.2'} Cr`} 
          subtitle="Lab Capex Shared vs Duplicated" 
          icon={DollarSign}
          color="emerald"
          change="+18.4% ROI optimization"
        />
        <StatCard 
          title="Average Placement Package" 
          value={placementSummary?.averagePackage || '₹18.4 LPA'} 
          subtitle={`Highest CTC: ${placementSummary?.highestPackage || '₹32.0 LPA'}`} 
          icon={TrendingUp}
          color="cyan"
          change="Pooled Drive Premium"
        />
        <StatCard 
          title="Consortium Utilization" 
          value={kpis?.clusterUtilizationRate || '82.4%'} 
          subtitle={`${kpis?.totalBookedHours || '1,420'} Booked Facility Hours`} 
          icon={Clock}
          color="indigo"
          change="High Efficiency"
        />
        <StatCard 
          title="Active Partner Colleges" 
          value={`${kpis?.institutionsCount || '5'} Colleges`} 
          subtitle="MOU Inter-Institutional Network" 
          icon={Building2}
          color="amber"
          change="Tier 1, 2 & Polytechnic"
        />
      </div>

      {/* Row 1: Category Utilization Breakdown & Tier Placement Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Category Resource Hours */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Resource Utilization by Research Domain</h3>
            <span className="badge badge-cyan">Facility Hours</span>
          </div>
          <ResourceCategoryBarChart data={data?.categoryStats || []} />
        </div>

        {/* Tier-Wise Placement Yield */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Pooled Placement Distribution by Tier</h3>
            <span className="badge badge-emerald">Equity in Placements</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {placementSummary?.tierBreakdown?.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: item.color }}>{item.tier}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#f8fafc' }}>
                    {item.placedCount} Placed • Avg {item.avgCtc}
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
                    width: `${(item.placedCount / 100) * 100}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
            💡 <strong>Cluster Impact:</strong> Tier-2 and Polytechnic students achieved a <strong>3.2x increase</strong> in Tier-1 product company interview access via cluster pooled drives.
          </div>
        </div>
      </div>

      {/* Row 2: Inter-Institutional Collaboration Flow Matrix */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem' }}>Inter-Institutional Collaboration & Contribution Matrix</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Tracks balance between facilities provided to cluster vs resources consumed from member colleges.
            </p>
          </div>
          <span className="badge badge-indigo">Mutual Exchange MOU</span>
        </div>

        <InstitutionMatrixChart data={data?.institutionMatrix || []} />
      </div>

      {/* Row 3: Industry Demand vs Certified Student Talent */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem' }}>Curriculum & Skill Gap Alignment Index</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Maps cluster training programs against real-time recruiter demand signals.
            </p>
          </div>
          <span className="badge badge-emerald">Live Demand Feed</span>
        </div>

        <SkillDemandMatrix data={data?.skillHeatmap || []} />
      </div>
    </div>
  );
};
