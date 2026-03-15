import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('lab.db');
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('ADMIN', 'OPERATOR', 'TECHNICIAN', 'CASHIER', 'AUDITOR')),
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    balance REAL DEFAULT 0,
    gold_weight_balance REAL DEFAULT 0,
    silver_weight_balance REAL DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sequences (
    name TEXT PRIMARY KEY,
    value INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS gold_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_number TEXT UNIQUE,
    customer_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS gold_test_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    gross_weight REAL NOT NULL,
    test_weight REAL DEFAULT 0,
    net_weight REAL DEFAULT 0,
    purity REAL DEFAULT 0,
    fine_weight REAL DEFAULT 0,
    remarks TEXT,
    returned BOOLEAN DEFAULT 0,
    FOREIGN KEY (test_id) REFERENCES gold_tests(id)
  );

  CREATE TABLE IF NOT EXISTS silver_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_number TEXT UNIQUE,
    customer_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS silver_test_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    gross_weight REAL NOT NULL,
    test_weight REAL DEFAULT 0,
    net_weight REAL DEFAULT 0,
    purity REAL DEFAULT 0,
    fine_weight REAL DEFAULT 0,
    remarks TEXT,
    returned BOOLEAN DEFAULT 0,
    FOREIGN KEY (test_id) REFERENCES silver_tests(id)
  );

  CREATE TABLE IF NOT EXISTS gold_certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    certificate_no TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES gold_tests(id)
  );

  CREATE TABLE IF NOT EXISTS silver_certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    certificate_no TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES silver_tests(id)
  );

  CREATE TABLE IF NOT EXISTS credit_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('CREDIT', 'DEBIT')),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id INTEGER,
    old_value TEXT,
    new_value TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT NOT NULL CHECK(level IN ('INFO', 'WARN', 'ERROR')),
    source TEXT NOT NULL,
    message TEXT NOT NULL,
    details TEXT,
    route TEXT,
    user_id INTEGER,
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Seed admin user if not exists
  INSERT OR IGNORE INTO users (username, password, role, name) 
  VALUES ('admin', 'admin123', 'ADMIN', 'System Administrator');
`);

// Migration for system_logs
try {
  db.exec("ALTER TABLE system_logs ADD COLUMN route TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE system_logs ADD COLUMN user_id INTEGER");
} catch (e) {}
try {
  db.exec("ALTER TABLE system_logs ADD COLUMN ip_address TEXT");
} catch (e) {}

// Migration for test_number
try {
  db.exec("ALTER TABLE gold_tests ADD COLUMN test_number TEXT UNIQUE");
} catch (e) {}
try {
  db.exec("ALTER TABLE silver_tests ADD COLUMN test_number TEXT UNIQUE");
} catch (e) {}

// Seed initial sequences if they don't exist
db.exec("INSERT OR IGNORE INTO sequences (name, value) VALUES ('gold_test', 0)");
db.exec("INSERT OR IGNORE INTO sequences (name, value) VALUES ('silver_test', 0)");

export default db;
