// Authentication & Cloud Save Management
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('kr_jwt_token') || null;
    this.user = JSON.parse(localStorage.getItem('kr_user_profile') || 'null');
    this.saveData = JSON.parse(localStorage.getItem('kr_local_save') || 'null') || this.getDefaultSave();
    this.syncInterval = null;
  }

  getDefaultSave() {
    return {
      slots: [
        {
          id: 1,
          name: "Hero Slot 1",
          stars: 0,
          gems: 100,
          completedStages: {}, // e.g. { stage_1: { stars: 3, difficulty: 'normal', iron: true, heroic: true } }
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
  }

  getActiveSlot() {
    if (!this.saveData.slots || this.saveData.slots.length === 0) {
      this.saveData = this.getDefaultSave();
    }
    const slot = this.saveData.slots.find(s => s.id === this.saveData.activeSlot) || this.saveData.slots[0];
    return slot;
  }

  saveLocally() {
    localStorage.setItem('kr_local_save', JSON.stringify(this.saveData));
    if (this.isLoggedIn()) {
      this.syncToCloud();
    }
  }

  isLoggedIn() {
    return !!this.token && !!this.user;
  }

  async register(username, email, password) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      this.token = data.token;
      this.user = data.user;
      if (data.saveData) {
        this.saveData = data.saveData;
      }
      localStorage.setItem('kr_jwt_token', this.token);
      localStorage.setItem('kr_user_profile', JSON.stringify(this.user));
      this.saveLocally();
      return { success: true, user: this.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async login(identifier, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      this.token = data.token;
      this.user = data.user;
      if (data.saveData) {
        this.saveData = data.saveData;
      }
      localStorage.setItem('kr_jwt_token', this.token);
      localStorage.setItem('kr_user_profile', JSON.stringify(this.user));
      this.saveLocally();
      return { success: true, user: this.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('kr_jwt_token');
    localStorage.removeItem('kr_user_profile');
    if (window.uiManager) {
      window.uiManager.updateAuthUI();
    }
  }

  async syncToCloud() {
    if (!this.token) return;
    try {
      await fetch('/api/save/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ saveData: this.saveData })
      });
    } catch (e) {
      console.warn('Cloud sync error (offline or server unreachable):', e);
    }
  }

  async loadFromCloud() {
    if (!this.token) return;
    try {
      const res = await fetch('/api/save/load', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.saveData) {
          this.saveData = data.saveData;
          localStorage.setItem('kr_local_save', JSON.stringify(this.saveData));
        }
      }
    } catch (e) {
      console.warn('Cloud load error:', e);
    }
  }

  // Calculate total stars earned across completed stages
  getTotalStars() {
    const slot = this.getActiveSlot();
    let total = 0;
    for (const stId in slot.completedStages) {
      const st = slot.completedStages[stId];
      total += (st.stars || 0);
      if (st.heroic) total += 1;
      if (st.iron) total += 1;
    }
    return total;
  }

  // Calculate available unspent stars
  getAvailableStars() {
    const total = this.getTotalStars();
    const slot = this.getActiveSlot();
    let spent = 0;
    const tree = window.GAME_DATA.UPGRADE_TREE;

    for (const cat in slot.starUpgrades) {
      const levels = slot.starUpgrades[cat];
      levels.forEach((val, idx) => {
        if (val && tree[cat] && tree[cat][idx]) {
          spent += tree[cat][idx].cost;
        }
      });
    }

    return Math.max(0, total - spent);
  }

  async submitStageScore(stageId, difficulty, score, stars) {
    if (!this.token) return;
    try {
      await fetch('/api/scores/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ stageId, difficulty, score, stars })
      });
    } catch (e) {}
  }
}

window.authManager = new AuthManager();
