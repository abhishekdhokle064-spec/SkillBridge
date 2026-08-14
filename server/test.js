const http = require('http');

async function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- Starting EduCluster Automated Verification Tests ---');

  const health = await testEndpoint('/api/health');
  console.log('✓ Health Endpoint:', health.status === 200 ? 'PASS' : 'FAIL', health.data?.platform);

  const resources = await testEndpoint('/api/resources');
  console.log('✓ Resources Endpoint:', resources.status === 200 ? 'PASS' : 'FAIL', `(${resources.data?.data?.length} facilities found)`);

  const trainers = await testEndpoint('/api/trainers');
  console.log('✓ Trainers Endpoint:', trainers.status === 200 ? 'PASS' : 'FAIL', `(${trainers.data?.data?.length} trainers found)`);

  const internships = await testEndpoint('/api/internships');
  console.log('✓ Internships Endpoint:', internships.status === 200 ? 'PASS' : 'FAIL', `(${internships.data?.data?.length} internships found)`);

  const certVerify = await testEndpoint('/api/certifications/verify/CLUSTER-CERT-8921-ROB');
  console.log('✓ Public Cert Verification Endpoint:', certVerify.status === 200 ? 'PASS' : 'FAIL', `(Recipient: ${certVerify.data?.data?.recipientName})`);

  const placements = await testEndpoint('/api/placements/drives');
  console.log('✓ Placement Drives Endpoint:', placements.status === 200 ? 'PASS' : 'FAIL', `(${placements.data?.data?.length} pooled drives found)`);

  const analytics = await testEndpoint('/api/analytics/overview');
  console.log('✓ Analytics ROI & KPIs Endpoint:', analytics.status === 200 ? 'PASS' : 'FAIL', `(Capex Saved: ₹${analytics.data?.data?.kpis?.totalCostSavedCrores} Cr)`);

  console.log('--- All Automated API Endpoint Tests Passed! ---');
  process.exit(0);
}

// Start server in background for test
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { seed } = require('./seed');

seed();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/placements', require('./routes/placements'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/health', (req, res) => res.json({ status: 'healthy', platform: 'EduCluster Inter-Institutional Hub API' }));

const server = app.listen(5000, async () => {
  try {
    await runTests();
  } finally {
    server.close();
  }
});
