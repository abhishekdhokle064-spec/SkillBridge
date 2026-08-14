const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/overview', (req, res) => {
  const institutions = db.get('institutions');
  const resources = db.get('resources');
  const bookings = db.get('resource_bookings');
  const trainers = db.get('trainers');
  const sessions = db.get('training_sessions');
  const internships = db.get('internships');
  const certs = db.get('certifications');
  const drives = db.get('placement_drives');
  const candidates = db.get('placement_candidates');
  const activity = db.get('activity_logs');

  const totalBookedHours = resources.reduce((acc, r) => acc + (r.totalBookedHours || 0), 0);
  
  // Cost saving estimation: avg lab hour market value = ₹12,500 vs ₹0 cluster MOU
  const totalCostSavedInINR = totalBookedHours * 14500;
  const totalCostSavedCrores = (totalCostSavedInINR / 10000000).toFixed(2);

  // Category wise resource utilization
  const categoryStats = {};
  resources.forEach(r => {
    if (!categoryStats[r.category]) {
      categoryStats[r.category] = { category: r.category, count: 0, hours: 0, icon: r.icon };
    }
    categoryStats[r.category].count += 1;
    categoryStats[r.category].hours += (r.totalBookedHours || 0);
  });

  // Institution wise collaboration matrix (Provider vs Consumer)
  const instMatrix = institutions.map(inst => {
    const hostedResources = resources.filter(r => r.institutionId === inst.id);
    const hostedHours = hostedResources.reduce((sum, r) => sum + (r.totalBookedHours || 0), 0);
    const consumedBookings = bookings.filter(b => b.requesterInstitutionId === inst.id);
    const consumedHours = consumedBookings.length * 4; // avg 4 hrs per booking

    return {
      id: inst.id,
      name: inst.name,
      code: inst.code,
      tier: inst.tier,
      logo: inst.logo,
      providedHours: hostedHours,
      consumedHours: consumedHours,
      netContributionScore: hostedHours - consumedHours + 50
    };
  });

  // Placement package distribution & Tier-wise hiring
  const placementSummary = {
    totalDrives: drives.length,
    activeDrives: drives.filter(d => d.status === 'active').length,
    totalOpenings: drives.reduce((sum, d) => sum + (d.openings || 0), 0),
    highestPackage: "₹32.0 LPA",
    averagePackage: "₹18.4 LPA",
    tierBreakdown: [
      { tier: "Tier-1 Autonomous", placedCount: 84, avgCtc: "₹21.2 LPA", color: "#3b82f6" },
      { tier: "Tier-2 Affiliated", placedCount: 62, avgCtc: "₹16.5 LPA", color: "#10b981" },
      { tier: "Tier-3 Polytechnic & Skill", placedCount: 38, avgCtc: "₹12.8 LPA", color: "#f59e0b" }
    ]
  };

  // Skill demands & certification growth
  const skillHeatmap = [
    { skill: "Edge AI & Embedded Inference", demandIndex: 96, certifiedStudents: 140, status: "High Growth" },
    { skill: "5-Axis CNC & Advanced CAD/CAM", demandIndex: 91, certifiedStudents: 115, status: "High Growth" },
    { skill: "Genomics & Bio-Informatics Pipelines", demandIndex: 88, certifiedStudents: 85, status: "Expanding" },
    { skill: "Automotive Battery Systems (BMS)", demandIndex: 85, certifiedStudents: 92, status: "Expanding" },
    { skill: "Subsonic Aerodynamics & CFD", demandIndex: 78, certifiedStudents: 64, status: "Steady" }
  ];

  res.json({
    success: true,
    data: {
      kpis: {
        institutionsCount: institutions.length,
        totalResources: resources.length,
        totalBookedHours,
        totalCostSavedCrores,
        totalTrainers: trainers.length,
        totalSessions: sessions.length,
        totalInternships: internships.length,
        totalCertifications: certs.length,
        totalPlacementDrives: drives.length,
        clusterUtilizationRate: "82.4%"
      },
      categoryStats: Object.values(categoryStats),
      institutionMatrix: instMatrix,
      placementSummary,
      skillHeatmap,
      recentActivity: activity.slice(0, 10)
    }
  });
});

// Endpoint to reset and reseed database
router.post('/reset-seed', (req, res) => {
  const { seed } = require('../seed');
  seed();
  res.json({ success: true, message: 'EduCluster demo database successfully re-seeded!' });
});

module.exports = router;
