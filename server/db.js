const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'educluster.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

let dbState = {
  institutions: [],
  users: [],
  resources: [],
  resource_bookings: [],
  trainers: [],
  training_sessions: [],
  internships: [],
  internship_applications: [],
  certifications: [],
  placement_drives: [],
  placement_candidates: [],
  activity_logs: [],
  reviews: []
};

// Load database from file
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      dbState = JSON.parse(raw);
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error('Error loading DB file, initializing empty state:', err);
    saveDatabase();
  }
}

// Persist database to file
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving DB file:', err);
  }
}

// DB Helpers for generic table CRUD operations
const db = {
  get: (table) => {
    return dbState[table] || [];
  },

  findById: (table, id) => {
    const list = dbState[table] || [];
    return list.find(item => String(item.id) === String(id)) || null;
  },

  findOne: (table, predicate) => {
    const list = dbState[table] || [];
    return list.find(predicate) || null;
  },

  filter: (table, predicate) => {
    const list = dbState[table] || [];
    return list.filter(predicate);
  },

  insert: (table, record) => {
    if (!dbState[table]) {
      dbState[table] = [];
    }
    const newRecord = {
      id: record.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      ...record
    };
    dbState[table].push(newRecord);
    saveDatabase();
    return newRecord;
  },

  update: (table, id, updates) => {
    const list = dbState[table] || [];
    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;
    dbState[table][index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDatabase();
    return dbState[table][index];
  },

  delete: (table, id) => {
    const list = dbState[table] || [];
    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) return false;
    dbState[table].splice(index, 1);
    saveDatabase();
    return true;
  },

  logActivity: (action, description, actorId, institutionId) => {
    const log = {
      id: `act_${Date.now()}`,
      action,
      description,
      actorId,
      institutionId,
      timestamp: new Date().toISOString()
    };
    if (!dbState.activity_logs) dbState.activity_logs = [];
    dbState.activity_logs.unshift(log);
    if (dbState.activity_logs.length > 100) {
      dbState.activity_logs = dbState.activity_logs.slice(0, 100);
    }
    saveDatabase();
    return log;
  },

  resetWithSeed: (seedData) => {
    dbState = { ...seedData };
    saveDatabase();
  }
};

loadDatabase();

module.exports = db;
