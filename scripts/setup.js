const fs = require('fs-extra');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

const initializeData = () => {
  // Ensure data directory exists
  fs.ensureDirSync(DATA_DIR);
  
  const initialData = {
    'candidates.json': [
      {
        id: '1',
        name: 'Michelle Bonczek',
        party: 'Nonpartisan',
        election: 'Hernando County School Board',
        district: 'District 1',
        status: 'active',
        source: 'manual_entry',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Kayce Hawkins',
        party: 'Nonpartisan',
        election: 'Hernando County School Board',
        district: 'District 3',
        status: 'active',
        source: 'manual_entry',
        createdAt: new Date().toISOString()
      }
    ],
    
    'elections.json': [
      {
        id: '1',
        name: 'Hernando County School Board',
        date: '2026-11-03',
        type: 'local',
        status: 'upcoming',
        candidateCount: 5
      },
      {
        id: '2',
        name: 'Brooksville City Council',
        date: '2025-11-05',
        type: 'municipal',
        status: 'upcoming',
        candidateCount: 5
      }
    ],
    
    'pending-updates.json': {
      lastScan: null,
      updates: []
    }
  };
  
  Object.entries(initialData).forEach(([filename, data]) => {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeJsonSync(filePath, data, { spaces: 2 });
      console.log(`Created ${filename}`);
    }
  });
  
  console.log('Data initialization complete!');
};

if (require.main === module) {
  initializeData();
}

module.exports = { initializeData };