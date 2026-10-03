const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'kingdom-rush-td-super-secret-key-2026';

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ---------------- AUTH ROUTES ----------------

// Register User
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    db.run(sql, [username.trim(), email.trim().toLowerCase(), hash], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Username or Email already registered' });
        }
        return res.status(500).json({ error: err.message });
      }

      const userId = this.lastID;
      const token = jwt.sign({ id: userId, username, email }, JWT_SECRET, { expiresIn: '30d' });

      // Create default save state
      const defaultSave = {
        slots: [
          {
            id: 1,
            name: "Hero Save",
            stars: 0,
            gems: 100,
            completedStages: {},
            heroUpgrades: { selected: "gerald", level: 1, xp: 0, points: 0, skills: {} },
            starUpgrades: {
              archers: [0, 0, 0, 0, 0],
              barracks: [0, 0, 0, 0, 0],
              mages: [0, 0, 0, 0, 0],
              artillery: [0, 0, 0, 0, 0],
              rain: [0, 0, 0, 0, 0],
              reinforce: [0, 0, 0, 0, 0]
            },
            unlockedHeroes: ["gerald", "alleria", "malik"],
            achievements: []
          }
        ],
        activeSlot: 1,
        settings: { sfxVolume: 0.8, bgmVolume: 0.6, difficulty: "normal", quality: "high" }
      };

      db.run('INSERT INTO game_saves (user_id, save_data) VALUES (?, ?)', [userId, JSON.stringify(defaultSave)]);

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: userId, username, email },
        saveData: defaultSave
      });
    });
  });
});

// Login User
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.get(sql, [identifier.trim(), identifier.trim().toLowerCase()], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Authentication error' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username/email or password' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

      // Fetch save data
      db.get('SELECT save_data FROM game_saves WHERE user_id = ?', [user.id], (err, saveRow) => {
        let saveData = null;
        if (saveRow && saveRow.save_data) {
          try {
            saveData = JSON.parse(saveRow.save_data);
          } catch (e) {
            console.error('JSON parse save error:', e);
          }
        }

        return res.json({
          message: 'Login successful',
          token,
          user: { id: user.id, username: user.username, email: user.email },
          saveData
        });
      });
    });
  });
});

// Current User Profile Check
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
  db.get(sql, [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.get('SELECT save_data FROM game_saves WHERE user_id = ?', [user.id], (err, saveRow) => {
      let saveData = null;
      if (saveRow && saveRow.save_data) {
        try {
          saveData = JSON.parse(saveRow.save_data);
        } catch (e) {}
      }

      return res.json({ user, saveData });
    });
  });
});

// ---------------- CLOUD SAVE SYNC ROUTES ----------------

// Save Game Progress to Cloud
app.post('/api/save/sync', authenticateToken, (req, res) => {
  const { saveData } = req.body;
  if (!saveData) {
    return res.status(400).json({ error: 'saveData payload required' });
  }

  const jsonStr = typeof saveData === 'string' ? saveData : JSON.stringify(saveData);

  const sql = `
    INSERT INTO game_saves (user_id, save_data, updated_at) 
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET 
      save_data = excluded.save_data,
      updated_at = CURRENT_TIMESTAMP
  `;

  db.run(sql, [req.user.id, jsonStr], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to sync save data' });
    }
    return res.json({ success: true, message: 'Cloud save synced successfully', timestamp: new Date().toISOString() });
  });
});

// Fetch Game Progress from Cloud
app.get('/api/save/load', authenticateToken, (req, res) => {
  db.get('SELECT save_data, updated_at FROM game_saves WHERE user_id = ?', [req.user.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve save data' });
    }

    if (!row || !row.save_data) {
      return res.json({ saveData: null });
    }

    try {
      const saveData = JSON.parse(row.save_data);
      return res.json({ saveData, updatedAt: row.updated_at });
    } catch (e) {
      return res.status(500).json({ error: 'Malformed save data' });
    }
  });
});

// ---------------- LEADERBOARD ROUTES ----------------

// Submit Stage Score
app.post('/api/scores/submit', authenticateToken, (req, res) => {
  const { stageId, difficulty, score, stars } = req.body;
  if (!stageId || score === undefined) {
    return res.status(400).json({ error: 'stageId and score required' });
  }

  const sql = `
    INSERT INTO scores (user_id, username, stage_id, difficulty, score, stars)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [req.user.id, req.user.username, stageId, difficulty || 'normal', score, stars || 3], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to record score' });
    }
    return res.json({ success: true, scoreId: this.lastID });
  });
});

// Get Top Leaderboards
app.get('/api/scores/top', (req, res) => {
  const stageId = req.query.stageId;
  let sql = `
    SELECT username, stage_id, difficulty, score, stars, created_at 
    FROM scores
  `;
  const params = [];

  if (stageId) {
    sql += ' WHERE stage_id = ?';
    params.push(stageId);
  }

  sql += ' ORDER BY score DESC LIMIT 50';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to query leaderboard' });
    }
    return res.json({ leaderboard: rows || [] });
  });
});

// Fallback to index.html for Single Page App routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Kingdom Rush Game Server running at http://localhost:${PORT}`);
});
