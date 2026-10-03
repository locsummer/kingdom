// Kingdom Rush Game Engine - Đồ Họa Pixel Art & Tùy Chỉnh Độ Khó, 1 Tướng & 2 Bổ Trợ

class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 1000;
    this.height = 600;

    this.active = false;
    this.paused = false;
    this.gameSpeed = 1.0;
    this.lastTime = performance.now();

    this.screenShakeTime = 0;
    this.screenShakeIntensity = 0;

    this.stage = null;
    this.gold = 400;
    this.lives = 20;
    this.score = 0;
    this.currentWaveIndex = 0;
    this.waveTimer = 3.0;
    this.isWaveInProgress = false;
    this.waveSpawnQueue = [];

    this.selectedDifficulty = 'normal';
    this.selectedSpells = ['rain_of_fire', 'reinforcements']; // Tối đa 2 bổ trợ

    this.towers = [];
    this.enemies = [];
    this.soldiers = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.scorchMarks = [];
    this.poisonZones = [];
    this.hero = null;

    this.activeSpellMode = null;
    this.spellCooldowns = {
      rain_of_fire: 0,
      reinforcements: 0,
      frost_nova: 0,
      holy_lightning: 0,
      fat_boy_bomb: 0,
      kings_bounty: 0,
      poison_mist: 0
    };

    this.selectedEntity = null;
    this.selectedPlot = null;

    this.setupViewport();
    this.bindEvents();
  }

  setupViewport() {
    const resize = () => {
      const containerW = window.innerWidth;
      const containerH = window.innerHeight;

      const targetRatio = 1000 / 600;
      let w = containerW;
      let h = containerW / targetRatio;

      if (h > containerH) {
        h = containerH;
        w = containerH * targetRatio;
      }

      this.canvas.width = 1000;
      this.canvas.height = 600;
      this.canvas.style.width = `${Math.floor(w)}px`;
      this.canvas.style.height = `${Math.floor(h)}px`;

      this.ctx.imageSmoothingEnabled = false;
    };

    window.addEventListener('resize', resize);
    resize();
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * 1000;
    const y = ((clientY - rect.top) / rect.height) * 600;
    return { x, y };
  }

  bindEvents() {
    const handlePointerDown = (e) => {
      if (!this.active || !this.stage) return;
      const coords = this.getCanvasCoords(e);
      this.handleInputClick(coords.x, coords.y);
    };

    this.canvas.addEventListener('mousedown', handlePointerDown);
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handlePointerDown(e);
    }, { passive: false });
  }

  loadStage(stageDef, selectedHeroKey = 'gerald', difficulty = 'normal', chosenSpells = ['rain_of_fire', 'reinforcements']) {
    this.stage = stageDef;
    this.selectedDifficulty = difficulty;
    this.selectedSpells = chosenSpells.slice(0, 2); // Tối đa đúng 2 bổ trợ

    this.gold = stageDef.startingGold || 400;
    this.lives = stageDef.lives || 20;
    this.score = 0;
    this.currentWaveIndex = 0;
    this.waveTimer = 3.0;
    this.isWaveInProgress = false;
    this.waveSpawnQueue = [];

    this.towers = [];
    this.enemies = [];
    this.soldiers = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.scorchMarks = [];
    this.poisonZones = [];
    this.selectedEntity = null;
    this.selectedPlot = null;
    this.activeSpellMode = null;

    for (let k in this.spellCooldowns) {
      this.spellCooldowns[k] = 0;
    }

    const startPoint = stageDef.path ? stageDef.path[0] : stageDef.multiPaths[0][0];
    this.hero = new Hero(this, selectedHeroKey, startPoint.x + 100, startPoint.y);

    this.active = true;
    this.paused = false;
    this.lastTime = performance.now();
    window.soundEngine.startBGM('battle');

    if (window.uiManager) {
      window.uiManager.renderActiveSpellsHUD();
      window.uiManager.updateHUD();
      window.uiManager.hideAllModals();
    }
  }

  triggerScreenShake(time = 0.4, intensity = 8) {
    this.screenShakeTime = time;
    this.screenShakeIntensity = intensity;
  }

  startNextWave() {
    if (!this.stage || this.currentWaveIndex >= this.stage.waves.length) return;

    const wave = this.stage.waves[this.currentWaveIndex];
    this.currentWaveIndex++;
    this.isWaveInProgress = true;

    if (this.waveTimer > 0) {
      const bonus = Math.max(15, Math.round(this.waveTimer * 6));
      this.gold += bonus;
      window.soundEngine.playSfx('gold');
      this.addFloatingText(this.hero.x, this.hero.y - 40, `+${bonus} THƯỞNG GỌI SỚM!`, '#f1c40f', 14);
    }

    window.soundEngine.playSfx('horn');

    const countMultiplier = this.selectedDifficulty === 'hard' ? 1.5 : this.selectedDifficulty === 'casual' ? 0.8 : 1.0;

    wave.enemies.forEach(group => {
      const path = (group.pathIndex !== undefined && this.stage.multiPaths) ? 
        this.stage.multiPaths[group.pathIndex] : (this.stage.path || this.stage.multiPaths[0]);

      const finalCount = Math.max(1, Math.round(group.count * countMultiplier));

      for (let i = 0; i < finalCount; i++) {
        this.waveSpawnQueue.push({
          type: group.type,
          delay: i * (group.interval || 1.0),
          path: path
        });
      }
    });

    if (window.uiManager) {
      window.uiManager.updateHUD();
    }
  }

  spawnSummonedEnemy(type, x, y, waypointIndex, path) {
    const enemy = new Enemy(this, type, path);
    enemy.x = x + (Math.random() * 20 - 10);
    enemy.y = y + (Math.random() * 20 - 10);
    enemy.currentWaypointIndex = waypointIndex;
    this.enemies.push(enemy);
  }

  spawnParticle(x, y, color, vx, vy, size, life, shape = 'square') {
    this.particles.push(new Particle(x, y, color, vx, vy, size, life, shape));
  }

  spawnExplosion(x, y, radius) {
    this.scorchMarks.push({ x, y, radius: radius * 0.7, life: 8.0, maxLife: 8.0 });
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 90;
      const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2d3436'];
      this.particles.push(new Particle(
        x, y,
        colors[Math.floor(Math.random() * colors.length)],
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        5 + Math.random() * 4,
        0.35 + Math.random() * 0.35
      ));
    }
  }

  spawnImpact(x, y, type) {
    const color = type === 'magic' ? '#9b59b6' : '#bdc3c7';
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 15 + Math.random() * 40;
      this.particles.push(new Particle(x, y, color, Math.cos(angle) * speed, Math.sin(angle) * speed, 3, 0.2));
    }
  }

  spawnLightning(x1, y1, x2, y2) {
    const steps = 6;
    const points = [{ x: Math.round(x1), y: Math.round(y1) }];
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const nx = Math.round(x1 + (x2 - x1) * t + (Math.random() - 0.5) * 20);
      const ny = Math.round(y1 + (y2 - y1) * t + (Math.random() - 0.5) * 20);
      points.push({ x: nx, y: ny });
    }
    points.push({ x: Math.round(x2), y: Math.round(y2) });

    this.particles.push({
      points: points,
      life: 0.15,
      maxLife: 0.15,
      update: function(dt) { this.life -= dt; },
      draw: (ctx) => {
        ctx.strokeStyle = '#00d2d3';
        ctx.lineWidth = 3;
        ctx.beginPath();
        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      }
    });
  }

  addFloatingText(x, y, text, color, size, isCrit) {
    this.floatingTexts.push(new FloatingText(x, y, text, color, size, isCrit));
  }

  onEnemyKilled(enemy) {
    this.gold += enemy.rewardGold;
    this.score += enemy.rewardGold * 10;
    this.addFloatingText(enemy.x, enemy.y - 10, `+${enemy.rewardGold} VÀNG`, '#f1c40f', 11);
    if (this.hero) this.hero.gainXp(enemy.rewardGold * 2);

    if (window.uiManager) {
      window.uiManager.updateHUD();
    }
  }

  onEnemyReachEnd(enemy) {
    this.lives -= enemy.livesCost;
    window.soundEngine.playSfx('defeat');
    this.addFloatingText(500, 50, `-${enemy.livesCost} MẠNG!`, '#e74c3c', 16, true);

    if (window.uiManager) {
      window.uiManager.updateHUD();
    }

    if (this.lives <= 0) {
      this.triggerDefeat();
    }
  }

  triggerVictory() {
    this.active = false;
    window.soundEngine.stopBGM();
    window.soundEngine.playSfx('victory');

    const stars = this.lives >= 18 ? 3 : this.lives >= 10 ? 2 : 1;
    const stageId = this.stage.id;

    const slot = window.authManager.getActiveSlot();
    if (!slot.completedStages[stageId] || slot.completedStages[stageId].stars < stars) {
      slot.completedStages[stageId] = {
        stars: Math.max(stars, slot.completedStages[stageId]?.stars || 0),
        difficulty: this.selectedDifficulty
      };
    }
    window.authManager.saveLocally();
    window.authManager.submitStageScore(stageId, this.selectedDifficulty, this.score, stars);

    if (window.uiManager) {
      window.uiManager.showVictoryModal(stars, this.score);
    }
  }

  triggerDefeat() {
    this.active = false;
    window.soundEngine.stopBGM();
    window.soundEngine.playSfx('defeat');

    if (window.uiManager) {
      window.uiManager.showDefeatModal();
    }
  }

  handleInputClick(x, y) {
    if (this.activeSpellMode) {
      if (this.activeSpellMode === 'rain_of_fire') {
        this.castRainOfFire(x, y);
      } else if (this.activeSpellMode === 'reinforcements') {
        this.castReinforcements(x, y);
      } else if (this.activeSpellMode === 'frost_nova') {
        this.castFrostNova();
      } else if (this.activeSpellMode === 'holy_lightning') {
        this.castHolyLightning();
      } else if (this.activeSpellMode === 'fat_boy_bomb') {
        this.castFatBoyBomb(x, y);
      } else if (this.activeSpellMode === 'kings_bounty') {
        this.castKingsBounty();
      } else if (this.activeSpellMode === 'poison_mist') {
        this.castPoisonMist(x, y);
      } else if (this.activeSpellMode === 'hero_rally') {
        if (this.hero) this.hero.setDestination(x, y);
      } else if (this.activeSpellMode === 'barracks_rally') {
        if (this.selectedEntity && this.selectedEntity.category === 'barracks') {
          this.selectedEntity.setRally(x, y);
        }
      }
      this.activeSpellMode = null;
      if (window.uiManager) window.uiManager.hideSpellTargeting();
      return;
    }

    if (this.stage && this.stage.towerPlots) {
      for (let plot of this.stage.towerPlots) {
        const dist = Math.hypot(plot.x - x, plot.y - y);
        if (dist <= 28) {
          const existingTower = this.towers.find(t => t.plot.id === plot.id);
          if (existingTower) {
            this.selectEntity(existingTower);
          } else {
            this.selectedPlot = plot;
            this.selectedEntity = null;
            if (window.uiManager) window.uiManager.showBuildWheel(plot);
          }
          return;
        }
      }
    }

    if (this.hero && Math.hypot(this.hero.x - x, this.hero.y - y) <= 28) {
      this.selectEntity(this.hero);
      return;
    }

    for (let enemy of this.enemies) {
      if (!enemy.dead && Math.hypot(enemy.x - x, enemy.y - y) <= enemy.size + 10) {
        this.selectEntity(enemy);
        return;
      }
    }

    this.deselect();
  }

  selectEntity(entity) {
    this.selectedEntity = entity;
    this.selectedPlot = null;
    if (window.uiManager) {
      window.uiManager.hideBuildWheel();
      window.uiManager.showInspector(entity);
    }
  }

  deselect() {
    this.selectedEntity = null;
    this.selectedPlot = null;
    if (window.uiManager) {
      window.uiManager.hideBuildWheel();
      window.uiManager.hideInspector();
    }
  }

  buildTower(plot, towerKey) {
    const def = window.GAME_DATA.TOWERS[towerKey];
    if (this.gold < def.cost) {
      window.soundEngine.playSfx('defeat');
      this.addFloatingText(plot.x, plot.y - 20, 'KHÔNG ĐỦ VÀNG!', '#e74c3c');
      return;
    }

    this.gold -= def.cost;
    window.soundEngine.playSfx('build');
    const tower = new Tower(this, plot, towerKey);
    this.towers.push(tower);
    this.selectEntity(tower);

    if (window.uiManager) {
      window.uiManager.updateHUD();
    }
  }

  upgradeTower(tower, upgradeKey) {
    const nextDef = window.GAME_DATA.TOWERS[upgradeKey];
    if (this.gold < nextDef.cost) {
      this.addFloatingText(tower.x, tower.y - 20, 'KHÔNG ĐỦ VÀNG!', '#e74c3c');
      return;
    }

    this.gold -= nextDef.cost;
    window.soundEngine.playSfx('build');
    tower.applyDefinition(upgradeKey);
    this.selectEntity(tower);

    if (window.uiManager) {
      window.uiManager.updateHUD();
    }
  }

  sellTower(tower) {
    const refund = Math.round(tower.cost * 0.7);
    this.gold += refund;
    window.soundEngine.playSfx('gold');
    this.addFloatingText(tower.x, tower.y - 20, `+${refund} VÀNG`, '#f1c40f');

    if (tower.category === 'barracks') {
      this.soldiers = this.soldiers.filter(s => s.tower !== tower);
    }
    this.towers = this.towers.filter(t => t !== tower);
    this.deselect();

    if (window.uiManager) {
      window.uiManager.updateHUD();
    }
  }

  castRainOfFire(x, y) {
    this.spellCooldowns.rain_of_fire = window.GAME_DATA.SPELLS.rain_of_fire.cooldown;
    window.soundEngine.playSfx('meteor');
    this.triggerScreenShake(0.6, 10);

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        if (!this.active) return;
        const targetX = x + (Math.random() - 0.5) * 90;
        const targetY = y + (Math.random() - 0.5) * 90;
        this.spawnExplosion(targetX, targetY, 80);

        this.enemies.forEach(e => {
          if (!e.dead && !e.flying && Math.hypot(e.x - targetX, e.y - targetY) <= 85) {
            e.takeDamage(150, 'pure');
          }
        });
      }, i * 120);
    }
  }

  castReinforcements(x, y) {
    this.spellCooldowns.reinforcements = window.GAME_DATA.SPELLS.reinforcements.cooldown;
    window.soundEngine.playSfx('horn');

    for (let i = 0; i < 2; i++) {
      const s = new Soldier(this, null, x + (i === 0 ? -14 : 14), y, {
        hp: 160,
        damageMin: 18,
        damageMax: 28,
        armor: 25,
        color: '#e67e22',
        isReinforcement: true,
        duration: 25
      });
      s.setRally(x + (i === 0 ? -14 : 14), y);
      this.soldiers.push(s);
    }
  }

  castFrostNova() {
    this.spellCooldowns.frost_nova = window.GAME_DATA.SPELLS.frost_nova.cooldown;
    window.soundEngine.playSfx('magic');
    this.addFloatingText(500, 200, 'ĐÓNG BĂNG 5S!', '#74b9ff', 18, true);

    this.enemies.forEach(e => {
      if (!e.dead) {
        e.freezeTimer = 5.0;
        this.spawnParticle(e.x, e.y, '#74b9ff', 0, 0, 8, 1.0);
      }
    });
  }

  castHolyLightning() {
    this.spellCooldowns.holy_lightning = window.GAME_DATA.SPELLS.holy_lightning.cooldown;
    window.soundEngine.playSfx('magic');
    this.triggerScreenShake(0.4, 6);

    let count = 0;
    this.enemies.forEach(e => {
      if (!e.dead && count < 8) {
        count++;
        this.spawnLightning(e.x, 0, e.x, e.y);
        e.takeDamage(400, 'pure');
      }
    });
  }

  castFatBoyBomb(x, y) {
    this.spellCooldowns.fat_boy_bomb = window.GAME_DATA.SPELLS.fat_boy_bomb.cooldown;
    window.soundEngine.playSfx('cannon');
    this.triggerScreenShake(0.8, 16);
    this.spawnExplosion(x, y, 140);
    this.addFloatingText(x, y - 40, 'SIÊU BOM NGUYÊN TỬ!', '#ff4757', 16, true);

    this.enemies.forEach(e => {
      if (!e.dead && Math.hypot(e.x - x, e.y - y) <= 150) {
        e.takeDamage(1200, 'pure');
      }
    });
  }

  castKingsBounty() {
    this.spellCooldowns.kings_bounty = window.GAME_DATA.SPELLS.kings_bounty.cooldown;
    window.soundEngine.playSfx('gold');
    this.gold += 300;
    this.addFloatingText(500, 200, '+300 VÀNG TIẾP TẾ!', '#f1c40f', 18, true);

    if (window.uiManager) {
      window.uiManager.updateHUD();
    }
  }

  castPoisonMist(x, y) {
    this.spellCooldowns.poison_mist = window.GAME_DATA.SPELLS.poison_mist.cooldown;
    window.soundEngine.playSfx('magic');
    this.poisonZones.push({ x, y, radius: 90, life: 8.0, maxLife: 8.0 });
  }

  update(dt) {
    if (!this.active || this.paused || !this.stage) return;

    const scaledDt = dt * this.gameSpeed;

    if (this.screenShakeTime > 0) {
      this.screenShakeTime -= scaledDt;
    }

    for (let spellKey in this.spellCooldowns) {
      if (this.spellCooldowns[spellKey] > 0) {
        this.spellCooldowns[spellKey] = Math.max(0, this.spellCooldowns[spellKey] - scaledDt);
      }
    }

    this.poisonZones.forEach(pz => {
      pz.life -= scaledDt;
      this.enemies.forEach(e => {
        if (!e.dead && Math.hypot(e.x - pz.x, e.y - pz.y) <= pz.radius) {
          e.takeDamage(60 * scaledDt, 'pure', null, false);
          e.slowFactor = 0.5;
          e.slowTimer = 0.5;
        }
      });
    });
    this.poisonZones = this.poisonZones.filter(pz => pz.life > 0);

    if (this.waveSpawnQueue.length > 0) {
      for (let i = this.waveSpawnQueue.length - 1; i >= 0; i--) {
        const item = this.waveSpawnQueue[i];
        item.delay -= scaledDt;
        if (item.delay <= 0) {
          const enemy = new Enemy(this, item.type, item.path, this.currentWaveIndex);
          this.enemies.push(enemy);
          this.waveSpawnQueue.splice(i, 1);
        }
      }
    } else if (this.isWaveInProgress) {
      const activeEnemies = this.enemies.filter(e => !e.dead && !e.reachedEnd);
      if (activeEnemies.length === 0) {
        this.isWaveInProgress = false;
        if (this.currentWaveIndex >= this.stage.waves.length) {
          this.triggerVictory();
        }
      }
    }

    this.towers.forEach(t => t.update(scaledDt));
    this.soldiers.forEach(s => s.update(scaledDt));
    if (this.hero) this.hero.update(scaledDt);
    this.enemies.forEach(e => e.update(scaledDt));
    this.projectiles.forEach(p => p.update(scaledDt));
    this.particles.forEach(p => p.update(scaledDt));
    this.floatingTexts.forEach(t => t.update(scaledDt));

    this.scorchMarks.forEach(sm => sm.life -= scaledDt);

    this.projectiles = this.projectiles.filter(p => !p.dead);
    this.particles = this.particles.filter(p => p.life > 0);
    this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);
    this.scorchMarks = this.scorchMarks.filter(sm => sm.life > 0);
    this.enemies = this.enemies.filter(e => !e.dead && !e.reachedEnd);
    this.soldiers = this.soldiers.filter(s => !s.dead || !s.isReinforcement);
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (this.screenShakeTime > 0) {
      const sx = Math.round((Math.random() - 0.5) * this.screenShakeIntensity);
      const sy = Math.round((Math.random() - 0.5) * this.screenShakeIntensity);
      ctx.translate(sx, sy);
    }

    ctx.clearRect(0, 0, 1000, 600);

    if (!this.stage) {
      ctx.restore();
      return;
    }

    // 1. Pixel Terrain & Roads
    this.drawTerrain(ctx);

    // 2. Scorch marks & Poison
    this.scorchMarks.forEach(sm => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, sm.life / sm.maxLife) * 0.45;
      ctx.fillStyle = '#1e272e';
      const r = Math.round(sm.radius);
      ctx.fillRect(Math.round(sm.x - r), Math.round(sm.y - r), r * 2, r * 2);
      ctx.restore();
    });

    this.poisonZones.forEach(pz => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pz.life / pz.maxLife) * 0.35;
      ctx.fillStyle = '#2ecc71';
      const r = Math.round(pz.radius);
      ctx.fillRect(Math.round(pz.x - r), Math.round(pz.y - r), r * 2, r * 2);
      ctx.restore();
    });

    // 3. Pixel Tower Plots
    this.stage.towerPlots.forEach(plot => {
      const isSelected = this.selectedPlot === plot;
      const px = Math.round(plot.x);
      const py = Math.round(plot.y);

      ctx.save();
      ctx.fillStyle = isSelected ? '#f1c40f' : '#718093';
      ctx.fillRect(px - 22, py - 12, 44, 24);
      ctx.strokeStyle = isSelected ? '#ffffff' : '#2f3542';
      ctx.lineWidth = 2;
      ctx.strokeRect(px - 22, py - 12, 44, 24);

      ctx.fillStyle = '#dcdde1';
      ctx.fillRect(px - 6, py - 2, 12, 4);
      ctx.fillRect(px - 2, py - 6, 4, 12);
      ctx.restore();
    });

    // 4. Towers
    this.towers.forEach(t => t.draw(ctx));

    // 5. Selected Range Circle
    if (this.selectedEntity && this.selectedEntity.range) {
      ctx.save();
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(Math.round(this.selectedEntity.x), Math.round(this.selectedEntity.y), this.selectedEntity.range, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Soldiers, Heroes, Enemies
    const renderList = [
      ...this.soldiers,
      ...(this.hero ? [this.hero] : []),
      ...this.enemies
    ].sort((a, b) => a.y - b.y);

    renderList.forEach(item => item.draw(ctx));

    // 7. Projectiles
    this.projectiles.forEach(p => p.draw(ctx));

    // 8. Particles
    this.particles.forEach(p => p.draw(ctx));

    // 9. Floating Combat Text
    this.floatingTexts.forEach(t => t.draw(ctx));

    ctx.restore();
  }

  drawTerrain(ctx) {
    const theme = this.stage.bgTheme;

    // Pixel Palette Colors
    if (theme === 'grass' || theme === 'grass_hill') {
      ctx.fillStyle = '#44bd32';
    } else if (theme === 'river') {
      ctx.fillStyle = '#4cd137';
    } else if (theme === 'dark_forest') {
      ctx.fillStyle = '#2f3640';
    } else if (theme === 'castle') {
      ctx.fillStyle = '#718093';
    } else if (theme === 'lava_nether') {
      ctx.fillStyle = '#4b1509';
    }
    ctx.fillRect(0, 0, 1000, 600);

    // Pixel Grass Tuft Details
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    for (let x = 0; x < 1000; x += 32) {
      for (let y = 0; y < 600; y += 32) {
        if ((x + y) % 64 === 0) {
          ctx.fillRect(x + 4, y + 4, 8, 4);
        }
      }
    }

    // River Stream (Pixel Animated)
    if (theme === 'river') {
      ctx.fillStyle = '#00a8ff';
      ctx.fillRect(490, 0, 70, 600);
      ctx.fillStyle = '#f5f6fa';
      for (let y = 10; y < 600; y += 40) {
        ctx.fillRect(500, y, 16, 3);
        ctx.fillRect(530, y + 20, 18, 3);
      }
    }

    // Pixel Dirt Road
    const pathsToDraw = this.stage.multiPaths || [this.stage.path];
    pathsToDraw.forEach(path => {
      // Outer border
      ctx.strokeStyle = '#7f5835';
      ctx.lineWidth = 48;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      ctx.beginPath();
      path.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(Math.round(pt.x), Math.round(pt.y));
        else ctx.lineTo(Math.round(pt.x), Math.round(pt.y));
      });
      ctx.stroke();

      // Inner dirt road
      ctx.strokeStyle = '#e1b12c';
      ctx.lineWidth = 36;
      ctx.beginPath();
      path.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(Math.round(pt.x), Math.round(pt.y));
        else ctx.lineTo(Math.round(pt.x), Math.round(pt.y));
      });
      ctx.stroke();

      // Pixel cobblestones center
      ctx.strokeStyle = '#c69519';
      ctx.lineWidth = 10;
      ctx.beginPath();
      path.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(Math.round(pt.x), Math.round(pt.y));
        else ctx.lineTo(Math.round(pt.x), Math.round(pt.y));
      });
      ctx.stroke();
    });

    // Wooden Bridge in River Stage
    if (theme === 'river') {
      ctx.fillStyle = '#833471';
      ctx.fillRect(485, 275, 80, 50);
      ctx.fillStyle = '#5758BB';
      ctx.strokeRect(485, 275, 80, 50);
      for (let bx = 495; bx < 560; bx += 10) {
        ctx.fillStyle = '#1e272e';
        ctx.fillRect(bx, 275, 2, 50);
      }
    }
  }

  startLoop() {
    const loop = (currentTime) => {
      const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
      this.lastTime = currentTime;

      this.update(dt);
      this.draw();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

window.GameEngine = GameEngine;
