import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { createServer as createViteServer } from "vite";
import db from "./db.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    try {
      const user = db.prepare("SELECT id, username, name, role FROM users WHERE username = ? AND password = ?").get(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      res.json({ user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Customers
  app.get("/api/customers", (req, res) => {
    const customers = db.prepare("SELECT * FROM customers ORDER BY name ASC").all();
    res.json(customers);
  });

  app.post("/api/customers", (req, res) => {
    const { name, phone, notes } = req.body;
    const info = db.prepare("INSERT INTO customers (name, phone, notes) VALUES (?, ?, ?)").run(name, phone, notes);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/customers/:id", (req, res) => {
    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  });

  // Gold Tests
  app.get("/api/gold-tests", (req, res) => {
    const tests = db.prepare(`
      SELECT 
        gt.*, 
        c.name as customer_name,
        COUNT(gti.id) as item_count,
        SUM(gti.gross_weight) as total_weight
      FROM gold_tests gt 
      JOIN customers c ON gt.customer_id = c.id 
      LEFT JOIN gold_test_items gti ON gt.id = gti.test_id
      GROUP BY gt.id
      ORDER BY gt.created_at DESC
    `).all();
    res.json(tests);
  });

  app.post("/api/gold-tests", (req, res) => {
    const { customer_id, items } = req.body;
    const transaction = db.transaction(() => {
      db.prepare("UPDATE sequences SET value = value + 1 WHERE name = 'gold_test'").run();
      const seq = db.prepare("SELECT value FROM sequences WHERE name = 'gold_test'").get() as any;
      const testNumber = `GT-${seq.value.toString().padStart(5, '0')}`;

      const info = db.prepare("INSERT INTO gold_tests (test_number, customer_id, status) VALUES (?, ?, 'TODO')").run(testNumber, customer_id);
      const testId = info.lastInsertRowid;
      
      const insertItem = db.prepare("INSERT INTO gold_test_items (test_id, name, gross_weight) VALUES (?, ?, ?)");
      for (const item of items) {
        insertItem.run(testId, item.name, item.gross_weight);
      }
      return testId;
    });
    
    const testId = transaction();
    res.json({ id: testId });
  });

  app.get("/api/gold-tests/:id", (req, res) => {
    const test = db.prepare(`
      SELECT gt.*, c.name as customer_name 
      FROM gold_tests gt 
      JOIN customers c ON gt.customer_id = c.id 
      WHERE gt.id = ?
    `).get(req.params.id);
    
    if (!test) return res.status(404).json({ error: "Test not found" });
    
    const items = db.prepare("SELECT * FROM gold_test_items WHERE test_id = ?").all(req.params.id);
    res.json({ ...test, items });
  });

  app.patch("/api/gold-tests/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE gold_tests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/gold-tests/:id", (req, res) => {
    const transaction = db.transaction(() => {
      db.prepare("DELETE FROM gold_test_items WHERE test_id = ?").run(req.params.id);
      db.prepare("DELETE FROM gold_tests WHERE id = ?").run(req.params.id);
    });
    transaction();
    res.json({ success: true });
  });

  app.patch("/api/gold-test-items/:id", (req, res) => {
    const { name, gross_weight, test_weight, net_weight, purity, fine_weight, remarks, returned } = req.body;
    
    const fields = [];
    const values = [];
    
    if (name !== undefined) { fields.push("name = ?"); values.push(name); }
    if (gross_weight !== undefined) { fields.push("gross_weight = ?"); values.push(gross_weight); }
    if (test_weight !== undefined) { fields.push("test_weight = ?"); values.push(test_weight); }
    if (net_weight !== undefined) { fields.push("net_weight = ?"); values.push(net_weight); }
    if (purity !== undefined) { fields.push("purity = ?"); values.push(purity); }
    if (fine_weight !== undefined) { fields.push("fine_weight = ?"); values.push(fine_weight); }
    if (remarks !== undefined) { fields.push("remarks = ?"); values.push(remarks); }
    if (returned !== undefined) { fields.push("returned = ?"); values.push(returned ? 1 : 0); }
    
    if (fields.length === 0) return res.json({ success: true });
    
    values.push(req.params.id);
    db.prepare(`UPDATE gold_test_items SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    res.json({ success: true });
  });

  // Silver Tests (Similar to Gold)
  app.get("/api/silver-tests", (req, res) => {
    const tests = db.prepare(`
      SELECT 
        st.*, 
        c.name as customer_name,
        COUNT(sti.id) as item_count,
        SUM(sti.gross_weight) as total_weight
      FROM silver_tests st 
      JOIN customers c ON st.customer_id = c.id 
      LEFT JOIN silver_test_items sti ON st.id = sti.test_id
      GROUP BY st.id
      ORDER BY st.created_at DESC
    `).all();
    res.json(tests);
  });

  app.post("/api/silver-tests", (req, res) => {
    const { customer_id, items } = req.body;
    const transaction = db.transaction(() => {
      db.prepare("UPDATE sequences SET value = value + 1 WHERE name = 'silver_test'").run();
      const seq = db.prepare("SELECT value FROM sequences WHERE name = 'silver_test'").get() as any;
      const testNumber = `ST-${seq.value.toString().padStart(5, '0')}`;

      const info = db.prepare("INSERT INTO silver_tests (test_number, customer_id, status) VALUES (?, ?, 'TODO')").run(testNumber, customer_id);
      const testId = info.lastInsertRowid;
      
      const insertItem = db.prepare("INSERT INTO silver_test_items (test_id, name, gross_weight) VALUES (?, ?, ?)");
      for (const item of items) {
        insertItem.run(testId, item.name, item.gross_weight);
      }
      return testId;
    });
    
    const testId = transaction();
    res.json({ id: testId });
  });

  app.get("/api/silver-tests/:id", (req, res) => {
    const test = db.prepare(`
      SELECT st.*, c.name as customer_name 
      FROM silver_tests st 
      JOIN customers c ON st.customer_id = c.id 
      WHERE st.id = ?
    `).get(req.params.id);
    
    if (!test) return res.status(404).json({ error: "Test not found" });
    
    const items = db.prepare("SELECT * FROM silver_test_items WHERE test_id = ?").all(req.params.id);
    res.json({ ...test, items });
  });

  app.patch("/api/silver-tests/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE silver_tests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/silver-tests/:id", (req, res) => {
    const transaction = db.transaction(() => {
      db.prepare("DELETE FROM silver_test_items WHERE test_id = ?").run(req.params.id);
      db.prepare("DELETE FROM silver_tests WHERE id = ?").run(req.params.id);
    });
    transaction();
    res.json({ success: true });
  });

  app.patch("/api/silver-test-items/:id", (req, res) => {
    const { name, gross_weight, test_weight, net_weight, purity, fine_weight, remarks, returned } = req.body;
    
    const fields = [];
    const values = [];
    
    if (name !== undefined) { fields.push("name = ?"); values.push(name); }
    if (gross_weight !== undefined) { fields.push("gross_weight = ?"); values.push(gross_weight); }
    if (test_weight !== undefined) { fields.push("test_weight = ?"); values.push(test_weight); }
    if (net_weight !== undefined) { fields.push("net_weight = ?"); values.push(net_weight); }
    if (purity !== undefined) { fields.push("purity = ?"); values.push(purity); }
    if (fine_weight !== undefined) { fields.push("fine_weight = ?"); values.push(fine_weight); }
    if (remarks !== undefined) { fields.push("remarks = ?"); values.push(remarks); }
    if (returned !== undefined) { fields.push("returned = ?"); values.push(returned ? 1 : 0); }
    
    if (fields.length === 0) return res.json({ success: true });
    
    values.push(req.params.id);
    db.prepare(`UPDATE silver_test_items SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    res.json({ success: true });
  });

  // Verification Endpoint
  app.get("/api/verify/:type/:id", (req, res) => {
    const { type, id } = req.params;
    
    let table = '';
    let itemsTable = '';
    
    if (type === 'gold' || type === 'photo') {
      table = 'gold_tests';
      itemsTable = 'gold_test_items';
    } else if (type === 'silver') {
      table = 'silver_tests';
      itemsTable = 'silver_test_items';
    } else {
      return res.status(400).json({ error: "Invalid verification type" });
    }

    try {
      const test = db.prepare(`
        SELECT t.*, c.name as customer_name 
        FROM ${table} t 
        JOIN customers c ON t.customer_id = c.id 
        WHERE t.id = ?
      `).get(id);
      
      if (!test) return res.status(404).json({ error: "Certificate not found" });
      
      const items = db.prepare(`SELECT * FROM ${itemsTable} WHERE test_id = ?`).all(id);
      res.json({ ...test, items });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ error: "Failed to verify certificate" });
    }
  });

  // Dashboard Stats
  app.get("/api/stats", (req, res) => {
    const customerCount = db.prepare("SELECT COUNT(*) as count FROM customers").get().count;
    const goldTestCount = db.prepare("SELECT COUNT(*) as count FROM gold_tests").get().count;
    const silverTestCount = db.prepare("SELECT COUNT(*) as count FROM silver_tests").get().count;
    const pendingGold = db.prepare("SELECT COUNT(*) as count FROM gold_tests WHERE status != 'DONE'").get().count;
    const pendingSilver = db.prepare("SELECT COUNT(*) as count FROM silver_tests WHERE status != 'DONE'").get().count;

    res.json({
      customerCount,
      goldTestCount,
      silverTestCount,
      pendingGold,
      pendingSilver
    });
  });

  // Audit Logs
  app.get("/api/audit", (req, res) => {
    const logs = db.prepare(`
      SELECT al.*, u.name as user_name 
      FROM audit_logs al 
      LEFT JOIN users u ON al.user_id = u.id 
      ORDER BY al.timestamp DESC 
      LIMIT 100
    `).all();
    res.json(logs);
  });

  // System Logs
  app.get("/api/logs", (req, res) => {
    const logs = db.prepare(`
      SELECT * FROM system_logs 
      ORDER BY timestamp DESC 
      LIMIT 100
    `).all();
    res.json(logs);
  });

  app.post("/api/logs", (req, res) => {
    const { level, source, message, details, route, user_id } = req.body;
    const ip_address = req.ip || req.socket.remoteAddress;
    const info = db.prepare(
      "INSERT INTO system_logs (level, source, message, details, route, user_id, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(level, source, message, details, route, user_id, ip_address);
    res.json({ id: info.lastInsertRowid });
  });

  // Backup
  const fs = require('fs');
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const MAX_BACKUPS = 30;
  const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

  async function runBackup() {
    try {
      const date = new Date();
      const timestamp = date.toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `lab_${timestamp}.db`);
      
      // SQLite online backup API
      await db.backup(backupFile);
      
      db.prepare("INSERT INTO system_logs (level, source, message) VALUES (?, ?, ?)").run('INFO', 'SYSTEM', `Database backup created: lab_${timestamp}.db`);
      
      // Backup Rotation
      const files = fs.readdirSync(backupDir).filter((f: string) => f.endsWith('.db'));
      const backups = files.map((f: string) => ({
        name: f,
        time: fs.statSync(path.join(backupDir, f)).birthtime.getTime()
      })).sort((a: any, b: any) => b.time - a.time);

      if (backups.length > MAX_BACKUPS) {
        const toDelete = backups.slice(MAX_BACKUPS);
        for (const b of toDelete) {
          fs.unlinkSync(path.join(backupDir, b.name));
          db.prepare("INSERT INTO system_logs (level, source, message) VALUES (?, ?, ?)").run('INFO', 'SYSTEM', `Deleted old backup: ${b.name}`);
        }
      }

      return `lab_${timestamp}.db`;
    } catch (error) {
      console.error("Backup failed:", error);
      db.prepare("INSERT INTO system_logs (level, source, message, details) VALUES (?, ?, ?, ?)").run('ERROR', 'SYSTEM', 'Database backup failed', String(error));
      throw error;
    }
  }

  // Startup Backup Check
  try {
    const files = fs.readdirSync(backupDir).filter((f: string) => f.endsWith('.db'));
    if (files.length === 0) {
      runBackup();
    } else {
      const latest = files.map((f: string) => fs.statSync(path.join(backupDir, f)).birthtime.getTime()).sort((a: number, b: number) => b - a)[0];
      if (Date.now() - latest > BACKUP_INTERVAL_MS) {
        runBackup();
      }
    }
  } catch (e) {
    console.error("Startup backup check failed:", e);
  }

  // Automated Daily Backup
  setInterval(runBackup, BACKUP_INTERVAL_MS);

  app.get("/api/backup", (req, res) => {
    try {
      const files = fs.readdirSync(backupDir);
      const backups = files
        .filter((f: string) => f.endsWith('.db'))
        .map((f: string) => {
          const stats = fs.statSync(path.join(backupDir, f));
          return {
            filename: f,
            size: stats.size,
            createdAt: stats.birthtime
          };
        })
        .sort((a: any, b: any) => b.createdAt - a.createdAt);
      res.json(backups);
    } catch (error) {
      res.status(500).json({ error: "Failed to list backups" });
    }
  });

  app.post("/api/backup", async (req, res) => {
    try {
      const filename = await runBackup();
      res.json({ success: true, filename });
    } catch (error) {
      res.status(500).json({ error: "Backup failed" });
    }
  });

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Error:", err);
    const ip_address = req.ip || req.socket.remoteAddress;
    const route = req.originalUrl;
    const user_id = (req as any).user?.id || null;
    
    try {
      db.prepare(
        "INSERT INTO system_logs (level, source, message, details, route, user_id, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).run('ERROR', 'API', err.message || 'Internal Server Error', err.stack || String(err), route, user_id, ip_address);
    } catch (dbErr) {
      console.error("Failed to log error to database:", dbErr);
    }

    res.status(500).json({ error: "Internal Server Error" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
