import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_store.json');

const defaultData = {
  users: [],
  skills: [],
  evidences: [],
  audit_logs: [],
};

class JSONDatabase {
  constructor() {
    this.cache = null;
    this.saveTimeout = null;
    if (!fs.existsSync(DB_FILE)) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      } catch (err) {
        console.error('Error creating db_store.json:', err);
      }
    }
  }

  read() {
    if (this.cache) return this.cache;
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        this.cache = JSON.parse(data);
        return this.cache;
      }
    } catch (err) {
      console.warn('Error reading JSON DB, returning default schema:', err);
    }
    this.cache = { ...defaultData };
    return this.cache;
  }

  write(data) {
    this.cache = data;
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    
    // Immediate async write with debounce fallback
    fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8', (err) => {
      if (err) console.error('Error persisting database:', err);
    });
  }
}

export const dbStore = new JSONDatabase();

