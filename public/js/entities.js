// Kingdom Rush Entities - Phong Cách Đồ Họa Pixel Art Chuẩn Retro 16-Bit

class FloatingText {
  constructor(x, y, text, color = '#fff', size = 13, isCrit = false) {
    this.x = Math.round(x + (Math.random() * 14 - 7));
    this.y = Math.round(y);
    this.text = text;
    this.color = color;
    this.size = isCrit ? Math.round(size * 1.3) : size;
    this.isCrit = isCrit;
    this.life = 0.85;
    this.maxLife = 0.85;
    this.vy = -35;
  }

  update(dt) {
    this.life -= dt;
    this.y += this.vy * dt;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.font = `bold ${Math.round(this.size)}px 'Press Start 2P', monospace, sans-serif`;
    ctx.textAlign = 'center';
    
    // Đổ bóng pixel
    ctx.fillStyle = '#000000';
    ctx.fillText(this.text, Math.round(this.x) + 2, Math.round(this.y) + 2);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, Math.round(this.x), Math.round(this.y));
    ctx.restore();
  }
}

class Particle {
  constructor(x, y, color, vx, vy, size, life, shape = 'square') {
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.size = Math.round(size);
    this.life = life;
    this.maxLife = life;
    this.shape = shape;
  }

  update(dt) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    const sz = Math.max(2, Math.round(this.size * (this.life / this.maxLife)));
    // Pixel square particle
    ctx.fillRect(Math.round(this.x - sz / 2), Math.round(this.y - sz / 2), sz, sz);
    ctx.restore();
  }
}

class Projectile {
  constructor(engine, type, startX, startY, target, damage, damageType, tower, extra = {}) {
    this.engine = engine;
    this.type = type;
    this.x = startX;
    this.y = startY;
    this.target = target;
    this.targetX = target ? target.x : extra.targetX || startX;
    this.targetY = target ? target.y : extra.targetY || startY;
    this.damage = damage;
    this.damageType = damageType;
    this.tower = tower;
    this.extra = extra;
    this.dead = false;

    if (type === 'arrow' || type === 'bullet') {
      this.speed = 560;
    } else if (type === 'magic_bolt' || type === 'sorcerer_bolt') {
      this.speed = 380;
    } else if (type === 'bomb' || type === 'super_bomb') {
      this.speed = 300;
      this.startX = startX;
      this.startY = startY;
      this.totalDist = Math.hypot(this.targetX - startX, this.targetY - startY);
      this.progress = 0;
      this.peakHeight = Math.min(110, this.totalDist * 0.45);
    } else if (type === 'missile') {
      this.speed = 360;
    }
  }

  update(dt) {
    if (this.dead) return;

    if (this.target && !this.target.dead) {
      this.targetX = this.target.x;
      this.targetY = this.target.y;
    }

    if (this.type === 'arrow' || this.type === 'bullet' || this.type === 'magic_bolt' || this.type === 'sorcerer_bolt' || this.type === 'missile') {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 14 || (this.target && this.target.dead)) {
        this.hitTarget();
        return;
      }

      const moveStep = this.speed * dt;
      this.x += (dx / dist) * moveStep;
      this.y += (dy / dist) * moveStep;

      if (this.type === 'magic_bolt' && Math.random() < 0.4) {
        this.engine.spawnParticle(this.x, this.y, '#e056fd', 0, 0, 4, 0.2);
      }
    } else if (this.type === 'bomb' || this.type === 'super_bomb') {
      const distToTarget = Math.hypot(this.targetX - this.startX, this.targetY - this.startY) || 1;
      this.progress += (this.speed * dt) / distToTarget;

      if (this.progress >= 1) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.hitTarget();
        return;
      }

      this.x = this.startX + (this.targetX - this.startX) * this.progress;
      const linearY = this.startY + (this.targetY - this.startY) * this.progress;
      const arc = 4 * this.peakHeight * this.progress * (1 - this.progress);
      this.y = linearY - arc;

      if (Math.random() < 0.5) {
        this.engine.spawnParticle(this.x, this.y, '#7f8c8d', 0, 10, 4, 0.25);
      }
    }
  }

  hitTarget() {
    this.dead = true;

    if (this.type === 'arrow' || this.type === 'bullet' || this.type === 'magic_bolt' || this.type === 'sorcerer_bolt') {
      if (this.target && !this.target.dead) {
        this.target.takeDamage(this.damage, this.damageType, this.tower);
        if (this.extra.poison) {
          this.target.applyPoison(this.extra.poison.dmg, this.extra.poison.dur);
        }
        if (this.extra.polymorph) {
          this.target.applyPolymorph(8);
        }
      }
      this.engine.spawnImpact(this.x, this.y, this.damageType);
    } else if (this.type === 'bomb' || this.type === 'super_bomb' || this.type === 'missile') {
      const radius = this.extra.splashRadius || 70;
      window.soundEngine.playSfx('cannon');
      this.engine.spawnExplosion(this.x, this.y, radius);

      this.engine.enemies.forEach(enemy => {
        if (!enemy.dead && !enemy.flying) {
          const d = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (d <= radius) {
            const falloff = this.extra.smartTarget ? 1 : Math.max(0.4, 1 - (d / radius) * 0.5);
            enemy.takeDamage(this.damage * falloff, this.damageType, this.tower);
          }
        }
      });
    }
  }

  draw(ctx) {
    if (this.dead) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const px = Math.round(this.x);
    const py = Math.round(this.y);

    if (this.type === 'arrow') {
      const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
      ctx.translate(px, py);
      ctx.rotate(angle);
      // Pixel Arrow
      ctx.fillStyle = '#8B5A2B';
      ctx.fillRect(-8, -1, 14, 3);
      ctx.fillStyle = '#f1f2f6';
      ctx.fillRect(6, -2, 4, 5);
      ctx.fillStyle = '#d2dae2';
      ctx.fillRect(-10, -2, 3, 5);
    } else if (this.type === 'bullet') {
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(px - 3, py - 3, 6, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px - 1, py - 1, 2, 2);
    } else if (this.type === 'magic_bolt') {
      ctx.fillStyle = '#e056fd';
      ctx.fillRect(px - 4, py - 4, 8, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px - 2, py - 2, 4, 4);
    } else if (this.type === 'bomb' || this.type === 'super_bomb') {
      const bsz = this.type === 'super_bomb' ? 10 : 8;
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(px - bsz / 2, py - bsz / 2, bsz, bsz);
      ctx.fillStyle = '#ff4757';
      ctx.fillRect(px - 1, py - bsz / 2 - 3, 3, 3);
    }

    ctx.restore();
  }
}

class Enemy {
  constructor(engine, dataKey, pathWaypoints, waveNumber = 1) {
    this.engine = engine;
    const def = window.GAME_DATA.ENEMIES[dataKey];
    this.dataKey = dataKey;
    this.name = def.name;

    // Difficulty scaling
    const diff = engine.selectedDifficulty || 'normal';
    const hpMult = diff === 'hard' ? 1.4 : diff === 'casual' ? 0.8 : 1.0;
    const speedMult = diff === 'hard' ? 1.2 : diff === 'casual' ? 0.85 : 1.0;

    this.maxHp = Math.round(def.hp * hpMult);
    this.hp = this.maxHp;
    this.speed = def.speed * 48 * speedMult;
    this.baseSpeed = this.speed;
    this.armor = def.armor || 0;
    this.magicResist = def.magicResist || 0;
    this.damage = Math.round(def.damage * hpMult);
    this.rewardGold = def.rewardGold;
    this.livesCost = def.livesCost || 1;
    this.flying = !!def.flying;
    this.isBoss = !!def.isBoss;
    this.color = def.color;
    this.size = def.size || 16;
    this.isHealer = !!def.isHealer;
    this.isSummoner = !!def.isSummoner;
    this.healCooldown = def.healCooldown || 3.5;
    this.summonCooldown = def.summonCooldown || 4.5;
    this.healTimer = this.healCooldown;
    this.summonTimer = this.summonCooldown;
    this.regenRate = def.regenRate || 0;

    this.path = pathWaypoints;
    this.currentWaypointIndex = 0;
    this.x = pathWaypoints[0].x;
    this.y = pathWaypoints[0].y;
    this.progressDist = 0;

    this.dead = false;
    this.reachedEnd = false;
    this.engagedWith = null;
    this.attackCooldown = 1.0;
    this.attackTimer = 0;
    this.walkAnimTimer = 0;

    this.slowTimer = 0;
    this.slowFactor = 1.0;
    this.poisonTimer = 0;
    this.poisonDmgPerSec = 0;
    this.poisonTickTimer = 0;
    this.polymorphTimer = 0;
    this.freezeTimer = 0;
  }

  update(dt) {
    if (this.dead || this.reachedEnd) return;

    if (this.freezeTimer > 0) {
      this.freezeTimer -= dt;
      return;
    }

    this.walkAnimTimer += dt * 8;

    if (this.regenRate > 0 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + this.regenRate * dt);
    }

    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) this.slowFactor = 1.0;
    }

    if (this.poisonTimer > 0) {
      this.poisonTimer -= dt;
      this.poisonTickTimer += dt;
      if (this.poisonTickTimer >= 0.5) {
        this.poisonTickTimer = 0;
        this.takeDamage(this.poisonDmgPerSec * 0.5, 'pure', null, false);
      }
    }

    if (this.polymorphTimer > 0) {
      this.polymorphTimer -= dt;
    }

    if (this.isHealer && this.polymorphTimer <= 0) {
      this.healTimer -= dt;
      if (this.healTimer <= 0) {
        this.healTimer = this.healCooldown;
        this.engine.enemies.forEach(ally => {
          if (!ally.dead && Math.hypot(ally.x - this.x, ally.y - this.y) <= 120) {
            ally.hp = Math.min(ally.maxHp, ally.hp + 60);
            this.engine.addFloatingText(ally.x, ally.y - 10, '+60', '#2ecc71');
          }
        });
      }
    }

    if (this.isSummoner && this.polymorphTimer <= 0) {
      this.summonTimer -= dt;
      if (this.summonTimer <= 0) {
        this.summonTimer = this.summonCooldown;
        this.engine.spawnSummonedEnemy('skeleton', this.x, this.y, this.currentWaypointIndex, this.path);
        this.engine.addFloatingText(this.x, this.y - 20, 'TRỖI DẬY!', '#8e44ad');
      }
    }

    if (this.engagedWith && !this.engagedWith.dead && this.polymorphTimer <= 0) {
      this.attackTimer += dt;
      if (this.attackTimer >= this.attackCooldown) {
        this.attackTimer = 0;
        window.soundEngine.playSfx('sword');
        this.engagedWith.takeDamage(this.damage);
      }
      return;
    } else {
      this.engagedWith = null;
    }

    if (this.currentWaypointIndex < this.path.length - 1) {
      const targetPoint = this.path[this.currentWaypointIndex + 1];
      const dx = targetPoint.x - this.x;
      const dy = targetPoint.y - this.y;
      const dist = Math.hypot(dx, dy);

      const effectiveSpeed = this.baseSpeed * this.slowFactor * (this.polymorphTimer > 0 ? 0.6 : 1.0);
      const step = effectiveSpeed * dt;

      if (dist <= step) {
        this.x = targetPoint.x;
        this.y = targetPoint.y;
        this.currentWaypointIndex++;
        if (this.currentWaypointIndex >= this.path.length - 1) {
          this.reachedEnd = true;
          this.engine.onEnemyReachEnd(this);
        }
      } else {
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
        this.progressDist += step;
      }
    }
  }

  takeDamage(amount, damageType = 'physical', source = null, showText = true) {
    if (this.dead) return;

    let finalDamage = amount;
    if (damageType === 'physical') {
      const reduction = Math.min(0.9, this.armor / 100);
      finalDamage = amount * (1 - reduction);
    } else if (damageType === 'magic') {
      const reduction = Math.min(0.9, this.magicResist / 100);
      finalDamage = amount * (1 - reduction);
    }

    finalDamage = Math.max(1, Math.round(finalDamage));
    this.hp -= finalDamage;

    if (showText) {
      const color = damageType === 'magic' ? '#be2edd' : damageType === 'pure' ? '#f39c12' : '#ff4757';
      this.engine.addFloatingText(this.x, this.y - 12, `-${finalDamage}`, color);
    }

    if (this.hp <= 0) {
      this.die();
    }
  }

  applyPoison(dmg, duration) {
    this.poisonDmgPerSec = dmg / duration;
    this.poisonTimer = duration;
  }

  applyPolymorph(duration) {
    this.polymorphTimer = duration;
    if (this.engagedWith) {
      this.engagedWith.engagedWith = null;
      this.engagedWith = null;
    }
    this.engine.addFloatingText(this.x, this.y - 20, 'BEE-E-E!', '#e056fd');
  }

  die() {
    if (this.dead) return;
    this.dead = true;
    window.soundEngine.playSfx('death');
    this.engine.onEnemyKilled(this);

    if (this.engagedWith) {
      this.engagedWith.engagedWith = null;
      this.engagedWith = null;
    }
  }

  draw(ctx) {
    if (this.dead || this.reachedEnd) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const px = Math.round(this.x);
    const bounce = Math.round(Math.sin(this.walkAnimTimer) * 2);
    const py = Math.round(this.flying ? this.y - 16 + bounce : this.y + bounce);
    const sz = Math.round(this.size);

    // Pixel shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(px - sz * 0.7, Math.round(this.y + (this.flying ? 22 : sz * 0.4)), sz * 1.4, 4);

    if (this.freezeTimer > 0) {
      ctx.fillStyle = 'rgba(116, 185, 255, 0.75)';
      ctx.fillRect(px - sz - 2, py - sz - 2, (sz + 2) * 2, (sz + 2) * 2);
    }

    if (this.polymorphTimer > 0) {
      // Pixel Sheep
      ctx.fillStyle = '#f5f6fa';
      ctx.fillRect(px - 8, py - 6, 16, 12);
      ctx.fillStyle = '#2f3640';
      ctx.fillRect(px + 6, py - 4, 6, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 8, py - 3, 2, 2);
    } else {
      // Pixel Body
      ctx.fillStyle = this.color;
      ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      ctx.strokeStyle = '#1e272e';
      ctx.lineWidth = 2;
      ctx.strokeRect(px - sz / 2, py - sz / 2, sz, sz);

      // Pixel Eyes
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(px + 2, py - 3, 3, 3);

      // Boss Crown
      if (this.isBoss) {
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(px - 8, py - sz / 2 - 8, 16, 6);
        ctx.fillRect(px - 10, py - sz / 2 - 12, 4, 6);
        ctx.fillRect(px - 2, py - sz / 2 - 12, 4, 6);
        ctx.fillRect(px + 6, py - sz / 2 - 12, 4, 6);
      }

      // Flying wings
      if (this.flying) {
        const wingY = Math.round(Math.sin(this.walkAnimTimer * 2) * 4);
        ctx.fillStyle = '#d2dae2';
        ctx.fillRect(px - sz - 6, py - 4 + wingY, 8, 4);
        ctx.fillRect(px + sz - 2, py - 4 + wingY, 8, 4);
      }
    }

    // Pixel Health Bar
    const barW = this.isBoss ? 44 : 26;
    const barH = 4;
    const hpRatio = Math.max(0, this.hp / this.maxHp);
    const barX = px - barW / 2;
    const barY = py - sz / 2 - 9;

    ctx.fillStyle = '#000000';
    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
    ctx.fillStyle = hpRatio > 0.5 ? '#2ecc71' : hpRatio > 0.25 ? '#f39c12' : '#e74c3c';
    ctx.fillRect(barX, barY, Math.round(barW * hpRatio), barH);

    ctx.restore();
  }
}

class Soldier {
  constructor(engine, towerOrNull, x, y, stats = {}) {
    this.engine = engine;
    this.tower = towerOrNull;
    this.x = x;
    this.y = y;
    this.rallyX = x;
    this.rallyY = y;
    this.offsetAngle = stats.offsetAngle || 0;

    this.maxHp = stats.hp || 100;
    this.hp = this.maxHp;
    this.damageMin = stats.damageMin || 4;
    this.damageMax = stats.damageMax || 8;
    this.armor = stats.armor || 10;
    this.speed = 65;
    this.color = stats.color || '#e67e22';

    this.dead = false;
    this.respawnTimer = 0;
    this.maxRespawnTime = stats.respawnTime || 8;
    this.engagedWith = null;
    this.attackCooldown = 0.9;
    this.attackTimer = 0;
    this.isReinforcement = !!stats.isReinforcement;
    this.duration = stats.duration || 0;
    this.lifeTime = 0;
  }

  setRally(targetX, targetY) {
    const spread = 22;
    this.rallyX = targetX + Math.cos(this.offsetAngle) * spread;
    this.rallyY = targetY + Math.sin(this.offsetAngle) * spread;
    if (this.engagedWith) {
      this.engagedWith.engagedWith = null;
      this.engagedWith = null;
    }
  }

  update(dt) {
    if (this.dead) {
      if (!this.isReinforcement) {
        this.respawnTimer -= dt;
        if (this.respawnTimer <= 0) {
          this.respawn();
        }
      }
      return;
    }

    if (this.isReinforcement) {
      this.lifeTime += dt;
      if (this.duration > 0 && this.lifeTime >= this.duration) {
        this.die(false);
        return;
      }
    }

    if (this.engagedWith && !this.engagedWith.dead) {
      this.attackTimer += dt;
      if (this.attackTimer >= this.attackCooldown) {
        this.attackTimer = 0;
        const dmg = Math.floor(Math.random() * (this.damageMax - this.damageMin + 1)) + this.damageMin;
        this.engagedWith.takeDamage(dmg, 'physical', this.tower);
      }
      return;
    } else {
      this.engagedWith = null;
    }

    const dx = this.rallyX - this.x;
    const dy = this.rallyY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 4) {
      const step = this.speed * dt;
      this.x += (dx / dist) * Math.min(step, dist);
      this.y += (dy / dist) * Math.min(step, dist);
    } else {
      const searchRadius = 40;
      for (let enemy of this.engine.enemies) {
        if (!enemy.dead && !enemy.flying && !enemy.engagedWith && enemy.polymorphTimer <= 0 && enemy.freezeTimer <= 0) {
          if (Math.hypot(enemy.x - this.x, enemy.y - this.y) <= searchRadius) {
            this.engagedWith = enemy;
            enemy.engagedWith = this;
            break;
          }
        }
      }
    }
  }

  takeDamage(amount) {
    if (this.dead) return;
    const reduction = Math.min(0.9, this.armor / 100);
    const finalDmg = Math.max(1, Math.round(amount * (1 - reduction)));
    this.hp -= finalDmg;
    this.engine.addFloatingText(this.x, this.y - 12, `-${finalDmg}`, '#e74c3c', 11);

    if (this.hp <= 0) {
      this.die(true);
    }
  }

  die(shouldRespawn = true) {
    this.dead = true;
    this.hp = 0;
    if (this.engagedWith) {
      this.engagedWith.engagedWith = null;
      this.engagedWith = null;
    }
    if (shouldRespawn && !this.isReinforcement) {
      this.respawnTimer = this.maxRespawnTime;
    }
  }

  respawn() {
    this.dead = false;
    this.hp = this.maxHp;
    if (this.tower) {
      this.x = this.tower.x;
      this.y = this.tower.y;
    }
  }

  draw(ctx) {
    if (this.dead) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const px = Math.round(this.x);
    const py = Math.round(this.y);

    // Pixel shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(px - 6, py + 6, 12, 3);

    // Pixel Soldier Body
    ctx.fillStyle = this.color;
    ctx.fillRect(px - 5, py - 6, 10, 12);
    ctx.fillStyle = '#f1f2f6';
    ctx.fillRect(px - 3, py - 6, 6, 4); // Helmet

    // Shield & Sword
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(px + 4, py - 3, 4, 8);
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(px - 7, py - 2, 2, 7);

    // HP Bar
    const barW = 18;
    const barH = 3;
    const hpRatio = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = '#000000';
    ctx.fillRect(px - barW / 2 - 1, py - 12, barW + 2, barH + 2);
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(px - barW / 2, py - 11, Math.round(barW * hpRatio), barH);

    ctx.restore();
  }
}

class Hero {
  constructor(engine, heroKey, startX, startY) {
    this.engine = engine;
    const def = window.GAME_DATA.HEROES[heroKey] || window.GAME_DATA.HEROES['gerald'];
    this.heroKey = heroKey;
    this.name = def.name;
    this.title = def.title;
    this.color = def.color;
    this.isRanged = !!def.isRanged;
    this.range = def.range || 160;

    this.level = 1;
    this.xp = 0;
    this.xpNextLevel = 100;

    this.maxHp = def.hp;
    this.hp = def.hp;
    this.damageMin = def.damageMin;
    this.damageMax = def.damageMax;
    this.armor = def.armor;
    this.speed = def.speed * 55;
    this.respawnTime = def.respawnTime;
    this.respawnTimer = 0;
    this.dead = false;

    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;
    this.engagedWith = null;

    this.attackCooldown = 0.8;
    this.attackTimer = 0;
    this.skillCooldown = def.skillCooldown || 6.0;
    this.skillTimer = 1.0;
  }

  setDestination(x, y) {
    this.targetX = x;
    this.targetY = y;
    if (this.engagedWith) {
      this.engagedWith.engagedWith = null;
      this.engagedWith = null;
    }
  }

  gainXp(amount) {
    if (this.level >= 10) return;
    this.xp += amount;
    if (this.xp >= this.xpNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.xp = 0;
    this.xpNextLevel = Math.round(this.xpNextLevel * 1.4);
    this.maxHp = Math.round(this.maxHp * 1.2);
    this.hp = this.maxHp;
    this.damageMin = Math.round(this.damageMin * 1.2);
    this.damageMax = Math.round(this.damageMax * 1.2);
    window.soundEngine.playSfx('levelup');
    this.engine.addFloatingText(this.x, this.y - 25, 'LÊN CẤP!', '#f1c40f', 15, true);
  }

  triggerActiveSkill() {
    if (this.dead || this.skillTimer > 0) return false;
    this.skillTimer = this.skillCooldown;
    this.castHeroSkill();
    return true;
  }

  update(dt) {
    if (this.dead) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) {
        this.dead = false;
        this.hp = this.maxHp;
        this.x = this.targetX;
        this.y = this.targetY;
        this.engine.addFloatingText(this.x, this.y - 20, 'TƯỚNG HỒI SINH', '#f1c40f', 13);
      }
      return;
    }

    if (!this.engagedWith && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + 18 * dt);
    }

    if (this.skillTimer > 0) {
      this.skillTimer -= dt;
    } else {
      const hasEnemiesNear = this.engine.enemies.some(e => !e.dead && Math.hypot(e.x - this.x, e.y - this.y) <= 220);
      if (hasEnemiesNear) {
        this.skillTimer = this.skillCooldown;
        this.castHeroSkill();
      }
    }

    if (this.engagedWith && !this.engagedWith.dead) {
      this.attackTimer += dt;
      if (this.attackTimer >= this.attackCooldown) {
        this.attackTimer = 0;
        window.soundEngine.playSfx('sword');
        const dmg = Math.floor(Math.random() * (this.damageMax - this.damageMin + 1)) + this.damageMin;
        this.engagedWith.takeDamage(dmg, 'physical');
        this.gainXp(18);
      }
      return;
    } else {
      this.engagedWith = null;
    }

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      const step = this.speed * dt;
      this.x += (dx / dist) * Math.min(step, dist);
      this.y += (dy / dist) * Math.min(step, dist);
    } else {
      const range = this.isRanged ? this.range : 50;
      for (let enemy of this.engine.enemies) {
        if (!enemy.dead && (!enemy.flying || this.isRanged)) {
          const d = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (d <= range) {
            if (this.isRanged) {
              this.attackTimer += dt;
              if (this.attackTimer >= this.attackCooldown) {
                this.attackTimer = 0;
                window.soundEngine.playSfx('arrow');
                const dmg = Math.floor(Math.random() * (this.damageMax - this.damageMin + 1)) + this.damageMin;
                this.engine.projectiles.push(new Projectile(this.engine, 'arrow', this.x, this.y, enemy, dmg, 'physical', null));
                this.gainXp(15);
              }
            } else if (!enemy.engagedWith && !enemy.flying) {
              this.engagedWith = enemy;
              enemy.engagedWith = this;
            }
            break;
          }
        }
      }
    }
  }

  castHeroSkill() {
    window.soundEngine.playSfx('magic');

    if (this.heroKey === 'gerald') {
      this.engine.addFloatingText(this.x, this.y - 25, 'HÀO QUANG DŨNG KHÍ!', '#f1c40f', 14, true);
      this.engine.soldiers.forEach(s => {
        if (!s.dead && Math.hypot(s.x - this.x, s.y - this.y) <= 200) {
          s.hp = Math.min(s.maxHp, s.hp + 120);
          this.engine.addFloatingText(s.x, s.y - 10, '+120 HP', '#2ecc71');
        }
      });
    } else if (this.heroKey === 'alleria') {
      this.engine.addFloatingText(this.x, this.y - 25, 'BÃO TÊN LIÊN HOÀN!', '#2ecc71', 14, true);
      let shots = 0;
      this.engine.enemies.forEach(e => {
        if (!e.dead && shots < 6 && Math.hypot(e.x - this.x, e.y - this.y) <= 260) {
          shots++;
          this.engine.projectiles.push(new Projectile(this.engine, 'arrow', this.x, this.y, e, 120, 'physical', null));
        }
      });
    } else if (this.heroKey === 'malik') {
      this.engine.addFloatingText(this.x, this.y - 25, 'ĐỊA CHẤN BÚA TẠ!', '#e74c3c', 14, true);
      this.engine.spawnExplosion(this.x, this.y, 100);
      this.engine.enemies.forEach(e => {
        if (!e.dead && !e.flying && Math.hypot(e.x - this.x, e.y - this.y) <= 120) {
          e.takeDamage(250, 'physical');
          e.slowFactor = 0.1;
          e.slowTimer = 3.0;
        }
      });
    } else if (this.heroKey === 'ignis') {
      this.engine.addFloatingText(this.x, this.y - 25, 'BÃO LỬA LONG VƯƠNG!', '#e67e22', 14, true);
      this.engine.spawnExplosion(this.x, this.y, 110);
      this.engine.enemies.forEach(e => {
        if (!e.dead && Math.hypot(e.x - this.x, e.y - this.y) <= 150) {
          e.takeDamage(300, 'pure');
        }
      });
    } else if (this.heroKey === 'denas') {
      this.engine.addFloatingText(this.x, this.y - 25, 'NGỰ LÂM QUÂN XUẤT TRẬN!', '#9b59b6', 14, true);
      for (let i = 0; i < 3; i++) {
        const s = new Soldier(this.engine, null, this.x + (i - 1) * 18, this.y + 15, {
          hp: 200, damageMin: 25, damageMax: 45, armor: 40, color: '#f1c40f', isReinforcement: true, duration: 25
        });
        s.setRally(this.x + (i - 1) * 18, this.y + 15);
        this.engine.soldiers.push(s);
      }
    } else if (this.heroKey === 'bolla') {
      this.engine.addFloatingText(this.x, this.y - 25, 'CHỚP NHOÁNG ÁM SÁT!', '#2c3e50', 14, true);
      this.engine.enemies.forEach(e => {
        if (!e.dead && Math.hypot(e.x - this.x, e.y - this.y) <= 140) {
          e.takeDamage(350, 'pure');
        }
      });
    } else if (this.heroKey === 'magnus') {
      this.engine.addFloatingText(this.x, this.y - 25, 'MƯA NĂNG LƯỢNG BÍ THUẬT!', '#3498db', 14, true);
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          if (!this.engine.active) return;
          const target = this.engine.enemies.find(e => !e.dead);
          if (target) {
            this.engine.projectiles.push(new Projectile(this.engine, 'magic_bolt', this.x, this.y - 20, target, 180, 'magic', null));
          }
        }, i * 120);
      }
    } else if (this.heroKey === 'hacksaw') {
      this.engine.addFloatingText(this.x, this.y - 25, 'CƯA MÁY HUY CHƯƠNG!', '#16a085', 14, true);
      this.engine.enemies.forEach(e => {
        if (!e.dead && !e.flying && Math.hypot(e.x - this.x, e.y - this.y) <= 100) {
          e.takeDamage(450, 'pure');
        }
      });
    }
  }

  takeDamage(amount) {
    if (this.dead) return;
    const reduction = Math.min(0.9, this.armor / 100);
    const finalDmg = Math.max(1, Math.round(amount * (1 - reduction)));
    this.hp -= finalDmg;
    this.engine.addFloatingText(this.x, this.y - 14, `-${finalDmg}`, '#ff3838', 12);

    if (this.hp <= 0) {
      this.dead = true;
      this.respawnTimer = this.respawnTime;
      if (this.engagedWith) {
        this.engagedWith.engagedWith = null;
        this.engagedWith = null;
      }
    }
  }

  draw(ctx) {
    if (this.dead) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const px = Math.round(this.x);
    const py = Math.round(this.y);

    // Pixel Aura
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.strokeRect(px - 9, py - 9, 18, 18);

    // Pixel Hero Body
    ctx.fillStyle = this.color;
    ctx.fillRect(px - 7, py - 7, 14, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 2, py - 2, 4, 4);

    // Pixel HP Bar
    const barW = 28;
    const barH = 4;
    const hpRatio = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = '#000000';
    ctx.fillRect(px - barW / 2 - 1, py - 18, barW + 2, barH + 2);
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(px - barW / 2, py - 17, Math.round(barW * hpRatio), barH);

    ctx.restore();
  }
}

// ---------------- 16 LOẠI THÁP THỦ ĐỒ HỌA PIXEL ----------------
class Tower {
  constructor(engine, plot, towerKey) {
    this.engine = engine;
    this.plot = plot;
    this.x = plot.x;
    this.y = plot.y;
    this.towerKey = towerKey;
    this.skills = {};

    this.soldiers = [];
    this.rallyX = plot.x;
    this.rallyY = plot.y + 45;
    this.fireTimer = 0;

    this.applyDefinition(towerKey);
  }

  applyDefinition(towerKey) {
    this.towerKey = towerKey;
    const def = window.GAME_DATA.TOWERS[towerKey];
    this.def = def;
    this.name = def.name;
    this.category = def.category;
    this.level = def.level;
    this.cost = def.cost;
    this.range = def.range;
    this.fireRate = def.fireRate || 1.0;
    this.damageMin = def.damageMin || 0;
    this.damageMax = def.damageMax || 0;
    this.damageType = def.damageType || 'physical';
    this.splashRadius = def.splashRadius || 0;
    this.color = def.spriteColor || '#bdc3c7';

    if (this.category === 'barracks') {
      const count = def.soldierCount || 3;
      if (this.soldiers.length === 0) {
        for (let i = 0; i < count; i++) {
          const offsetAngle = (i / count) * Math.PI * 2;
          const s = new Soldier(this.engine, this, this.x, this.y, {
            hp: def.soldierHp,
            damageMin: def.soldierDamageMin,
            damageMax: def.soldierDamageMax,
            armor: def.soldierArmor,
            respawnTime: def.respawnTime,
            color: this.color,
            offsetAngle
          });
          s.setRally(this.rallyX, this.rallyY);
          this.soldiers.push(s);
          this.engine.soldiers.push(s);
        }
      } else {
        this.soldiers.forEach(s => {
          s.maxHp = def.soldierHp;
          s.hp = def.soldierHp;
          s.damageMin = def.soldierDamageMin;
          s.damageMax = def.soldierDamageMax;
          s.armor = def.soldierArmor;
          s.color = this.color;
        });
      }
    }
  }

  setRally(x, y) {
    this.rallyX = x;
    this.rallyY = y;
    this.soldiers.forEach(s => s.setRally(x, y));
  }

  update(dt) {
    if (this.category === 'barracks') return;

    this.fireTimer += dt;
    if (this.fireTimer >= this.fireRate) {
      const target = this.findTarget();
      if (target) {
        this.fireTimer = 0;
        this.attackTarget(target);
      }
    }
  }

  findTarget() {
    let bestTarget = null;
    let maxProgress = -1;

    for (let enemy of this.engine.enemies) {
      if (enemy.dead || enemy.reachedEnd) continue;
      if (this.category === 'artillery' && enemy.flying && this.towerKey !== 'artillery_tesla') {
        continue;
      }

      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist <= this.range) {
        if (enemy.progressDist > maxProgress) {
          maxProgress = enemy.progressDist;
          bestTarget = enemy;
        }
      }
    }
    return bestTarget;
  }

  attackTarget(target) {
    const dmg = Math.floor(Math.random() * (this.damageMax - this.damageMin + 1)) + this.damageMin;

    if (this.category === 'archer') {
      window.soundEngine.playSfx('arrow');
      const extra = {};
      if (this.skills.poisonArrows) {
        extra.poison = { dmg: 90 * this.skills.poisonArrows, dur: 3 };
      }
      this.engine.projectiles.push(new Projectile(this.engine, this.def.projectileType || 'arrow', this.x, this.y - 14, target, dmg, this.damageType, this, extra));
    } else if (this.category === 'mage') {
      window.soundEngine.playSfx('magic');
      const extra = {};
      if (this.skills.polymorph && Math.random() < 0.2 * this.skills.polymorph && !target.isBoss) {
        extra.polymorph = true;
      }
      this.engine.projectiles.push(new Projectile(this.engine, this.def.projectileType || 'magic_bolt', this.x, this.y - 18, target, dmg, this.damageType, this, extra));
    } else if (this.category === 'artillery') {
      if (this.towerKey === 'artillery_tesla') {
        window.soundEngine.playSfx('magic');
        target.takeDamage(dmg, this.damageType, this);
        this.engine.spawnLightning(this.x, this.y - 20, target.x, target.y);
      } else {
        window.soundEngine.playSfx('cannon');
        const extra = { splashRadius: this.splashRadius };
        if (this.skills.clusterBomb) {
          extra.clusterCount = 3 * this.skills.clusterBomb;
        }
        this.engine.projectiles.push(new Projectile(this.engine, this.def.projectileType || 'bomb', this.x, this.y - 14, target, dmg, this.damageType, this, extra));
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const px = Math.round(this.x);
    const py = Math.round(this.y);

    // Pixel Base Plinth
    ctx.fillStyle = '#4b6584';
    ctx.fillRect(px - 20, py - 4, 40, 18);
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(px - 22, py + 10, 44, 6);

    // Pixel Tower Main Body
    ctx.fillStyle = this.color;
    ctx.fillRect(px - 14, py - 26, 28, 24);
    ctx.strokeStyle = '#1e272e';
    ctx.lineWidth = 2;
    ctx.strokeRect(px - 14, py - 26, 28, 24);

    // Pixel Roof / Turret
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(px - 16, py - 36, 32, 10);
    ctx.fillRect(px - 10, py - 42, 20, 6);

    // Level Text
    ctx.fillStyle = '#f1c40f';
    ctx.font = "bold 9px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`L${this.level}`, px, py - 12);

    // Pixel Rally Flag
    if (this.category === 'barracks') {
      const rx = Math.round(this.rallyX);
      const ry = Math.round(this.rallyY);
      ctx.fillStyle = '#eb4d4b';
      ctx.fillRect(rx, ry - 18, 12, 8);
      ctx.fillStyle = '#f1f2f6';
      ctx.fillRect(rx - 2, ry - 18, 2, 18);
    }

    ctx.restore();
  }
}

window.FloatingText = FloatingText;
window.Particle = Particle;
window.Projectile = Projectile;
window.Enemy = Enemy;
window.Soldier = Soldier;
window.Hero = Hero;
window.Tower = Tower;
