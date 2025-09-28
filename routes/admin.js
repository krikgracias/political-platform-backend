const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Helper function to read JSON files
const readDataFile = (filename, defaultValue = []) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      return fs.readJsonSync(filePath);
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
  }
  return defaultValue;
};

// Helper function to write JSON files
const writeDataFile = (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.ensureDirSync(DATA_DIR);
    fs.writeJsonSync(filePath, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Dashboard overview
router.get('/overview', (req, res) => {
  const candidates = readDataFile('candidates.json');
  const elections = readDataFile('elections.json');
  const pendingUpdates = readDataFile('pending-updates.json', { updates: [] });
  
  res.json({
    candidates: candidates.length,
    elections: elections.length,
    pendingUpdates: pendingUpdates.updates.length,
    lastScan: pendingUpdates.lastScan,
    totalMatches: 156 // Mock data for now
  });
});

// Get pending updates
router.get('/pending-updates', (req, res) => {
  const data = readDataFile('pending-updates.json', { updates: [] });
  res.json(data);
});

// Approve update
router.post('/approve-update/:id', (req, res) => {
  const { id } = req.params;
  const pendingData = readDataFile('pending-updates.json', { updates: [] });
  
  const updateIndex = pendingData.updates.findIndex(update => update.id === id);
  if (updateIndex === -1) {
    return res.status(404).json({ error: 'Update not found' });
  }
  
  const update = pendingData.updates[updateIndex];
  
  // Process the update based on type
  if (update.type === 'candidate') {
    const candidates = readDataFile('candidates.json');
    candidates.push({
      id: Date.now().toString(),
      name: update.data?.name || update.title,
      party: update.data?.party || 'Unknown',
      election: update.data?.election || 'Unknown',
      status: 'active',
      source: update.source,
      approvedAt: new Date().toISOString()
    });
    writeDataFile('candidates.json', candidates);
  }
  
  // Remove from pending
  pendingData.updates.splice(updateIndex, 1);
  writeDataFile('pending-updates.json', pendingData);
  
  res.json({ success: true, message: 'Update approved' });
});

// Reject update
router.post('/reject-update/:id', (req, res) => {
  const { id } = req.params;
  const pendingData = readDataFile('pending-updates.json', { updates: [] });
  
  const updateIndex = pendingData.updates.findIndex(update => update.id === id);
  if (updateIndex === -1) {
    return res.status(404).json({ error: 'Update not found' });
  }
  
  pendingData.updates.splice(updateIndex, 1);
  writeDataFile('pending-updates.json', pendingData);
  
  res.json({ success: true, message: 'Update rejected' });
});

// Get candidates
router.get('/candidates', (req, res) => {
  const candidates = readDataFile('candidates.json');
  res.json(candidates);
});

// Get elections
router.get('/elections', (req, res) => {
  const elections = readDataFile('elections.json');
  res.json(elections);
});

// Trigger manual scan
router.post('/trigger-scan', async (req, res) => {
  try {
    // Mock scan results
    const mockUpdate = {
      id: Date.now().toString(),
      type: 'candidate',
      title: 'New candidate filing detected',
      description: 'John Smith filed for Hernando County School Board District 2',
      source: 'hernando_county_elections',
      discovered: new Date().toISOString(),
      data: {
        name: 'John Smith',
        party: 'Nonpartisan',
        election: 'Hernando County School Board'
      }
    };
    
    const pendingData = readDataFile('pending-updates.json', { updates: [] });
    pendingData.updates.push(mockUpdate);
    pendingData.lastScan = new Date().toISOString();
    writeDataFile('pending-updates.json', pendingData);
    
    res.json({
      success: true,
      message: 'Manual scan completed',
      summary: {
        newCandidates: 1,
        newBallotMeasures: 0,
        policyUpdates: 0,
        newsUpdates: 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Scan failed', message: error.message });
  }
});

module.exports = router;