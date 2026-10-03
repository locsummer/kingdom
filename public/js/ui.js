// Kingdom Rush UI Manager - Tùy Chọn Độ Khó, Chọn 1 Tướng & Tối Đa 2 Bổ Trợ, Nút Bật Tắt Âm Thanh

class UIManager {
  constructor() {
    this.engine = null;
    this.currentView = 'title';
    this.selectedStage = null;

    // Lựa chọn chuẩn bị trước trận đánh
    this.selectedHero = 'gerald';
    this.selectedDifficulty = 'normal'; // 'casual', 'normal', 'hard'
    this.selectedSpells = ['rain_of_fire', 'reinforcements']; // Tối đa đúng 2 bổ trợ

    this.bindDOM();
    this.updateAuthUI();
    window.soundEngine.updateAudioButtonsUI();
  }

  setEngine(engine) {
    this.engine = engine;
  }

  bindDOM() {
    // Menu Chính
    document.getElementById('btn-play-game')?.addEventListener('click', () => this.showWorldMap());
    document.getElementById('btn-upgrades-menu')?.addEventListener('click', () => this.showUpgradesModal());
    document.getElementById('btn-heroes-menu')?.addEventListener('click', () => this.showHeroesModal());
    document.getElementById('btn-encyclopedia-menu')?.addEventListener('click', () => this.showEncyclopediaModal());
    document.getElementById('btn-auth-menu')?.addEventListener('click', () => this.showAuthModal());

    // Nút Bật/Tắt Âm Thanh Toàn Cục
    document.querySelectorAll('.audio-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.toggleMute();
      });
    });

    // Trong Trận Đấu
    document.getElementById('btn-call-wave')?.addEventListener('click', () => {
      if (this.engine) this.engine.startNextWave();
    });

    document.getElementById('btn-speed-toggle')?.addEventListener('click', (e) => {
      if (!this.engine) return;
      this.engine.gameSpeed = this.engine.gameSpeed === 1.0 ? 2.0 : 1.0;
      e.target.innerText = `${this.engine.gameSpeed}x`;
      e.target.classList.toggle('active', this.engine.gameSpeed === 2.0);
    });

    document.getElementById('btn-pause')?.addEventListener('click', () => {
      if (!this.engine) return;
      this.engine.paused = !this.engine.paused;
      document.getElementById('pause-modal').classList.toggle('hidden', !this.engine.paused);
    });

    // Kỹ Năng Tướng Trực Tiếp
    document.getElementById('btn-hero-active-skill')?.addEventListener('click', () => {
      if (!this.engine || !this.engine.hero) return;
      const success = this.engine.hero.triggerActiveSkill();
      if (!success) {
        this.engine.addFloatingText(this.engine.hero.x, this.engine.hero.y - 20, 'ĐANG HỒI CHIÊU!', '#e74c3c');
      }
    });

    document.getElementById('hero-portrait-btn')?.addEventListener('click', () => {
      if (!this.engine || !this.engine.hero) return;
      this.engine.selectEntity(this.engine.hero);
      this.engine.activeSpellMode = 'hero_rally';
      this.showSpellTargeting('Nhấp vào vị trí trên bản đồ để di chuyển Tướng!');
    });

    // Nút Đóng Modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => this.hideAllModals());
    });

    // Tab Đăng nhập / Đăng ký
    document.getElementById('tab-login')?.addEventListener('click', () => this.switchAuthTab('login'));
    document.getElementById('tab-register')?.addEventListener('click', () => this.switchAuthTab('register'));
    document.getElementById('auth-login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('auth-register-form')?.addEventListener('submit', (e) => this.handleRegister(e));
    document.getElementById('btn-logout')?.addEventListener('click', () => window.authManager.logout());

    // Chuyển Màn Hình
    document.getElementById('btn-back-to-menu')?.addEventListener('click', () => this.showTitleScreen());
    document.getElementById('btn-back-to-map')?.addEventListener('click', () => this.showWorldMap());
    document.getElementById('btn-restart-stage')?.addEventListener('click', () => {
      this.hideAllModals();
      if (this.selectedStage) this.launchStage(this.selectedStage);
    });
    document.getElementById('btn-victory-continue')?.addEventListener('click', () => this.showWorldMap());

    // Nâng Cấp Sao
    document.getElementById('btn-respec-stars')?.addEventListener('click', () => this.respecStars());

    // Bách Khoa Toàn Thư Tabs Fix
    this.bindEncyclopediaTabs();
  }

  bindEncyclopediaTabs() {
    const tabs = ['towers', 'enemies', 'tips'];
    tabs.forEach(tab => {
      const btn = document.getElementById(`enc-tab-${tab}`);
      if (btn) {
        btn.onclick = () => {
          tabs.forEach(t => document.getElementById(`enc-tab-${t}`)?.classList.remove('active'));
          btn.classList.add('active');
          this.renderEncyclopedia(tab);
        };
      }
    });
  }

  showTitleScreen() {
    this.currentView = 'title';
    document.getElementById('title-screen').classList.remove('hidden');
    document.getElementById('map-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    this.hideAllModals();
    window.soundEngine.startBGM('map');
  }

  showWorldMap() {
    this.currentView = 'map';
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('map-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    this.hideAllModals();
    this.renderWorldMap();
    window.soundEngine.startBGM('map');
  }

  launchStage(stageDef) {
    this.selectedStage = stageDef;
    this.currentView = 'game';
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('map-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    this.hideAllModals();

    if (this.engine) {
      this.engine.loadStage(stageDef, this.selectedHero, this.selectedDifficulty, this.selectedSpells);
    }
  }

  renderWorldMap() {
    const mapContainer = document.getElementById('map-pins-container');
    if (!mapContainer) return;
    mapContainer.innerHTML = '';

    const slot = window.authManager.getActiveSlot();
    const totalStars = window.authManager.getTotalStars();
    document.getElementById('map-total-stars').innerText = `${totalStars} Ngôi Sao`;

    window.GAME_DATA.STAGES.forEach((stage, idx) => {
      const isUnlocked = idx === 0 || !!slot.completedStages[window.GAME_DATA.STAGES[idx - 1].id];
      const progress = slot.completedStages[stage.id] || null;

      const pin = document.createElement('div');
      pin.className = `map-pin ${isUnlocked ? 'unlocked' : 'locked'}`;
      pin.style.left = `${stage.mapPos.x / 10}%`;
      pin.style.top = `${stage.mapPos.y / 6}%`;

      pin.innerHTML = `
        <div class="pin-icon">${isUnlocked ? (progress ? '★' : stage.number) : '🔒'}</div>
        <div class="pin-title">${stage.name}</div>
        ${progress ? `<div class="pin-stars">${'★'.repeat(progress.stars)}</div>` : ''}
      `;

      if (isUnlocked) {
        pin.addEventListener('click', () => this.showStageModal(stage, progress));
      }

      mapContainer.appendChild(pin);
    });
  }

  // --- Modal Chọn Độ Khó, 1 Tướng & 2 Bổ Trợ Trước Trận Đấu ---
  showStageModal(stage, progress) {
    this.selectedStage = stage;
    const modal = document.getElementById('stage-preview-modal');
    document.getElementById('stage-modal-title').innerText = `Màn ${stage.number}: ${stage.name}`;
    document.getElementById('stage-modal-desc').innerText = stage.description;
    document.getElementById('stage-modal-gold').innerText = `${stage.startingGold} Vàng`;
    document.getElementById('stage-modal-waves').innerText = `${stage.waves.length} Đợt`;

    // 1. Render Bộ Chọn Độ Khó (Casual / Normal / Hard)
    const diffContainer = document.getElementById('stage-difficulty-selector');
    diffContainer.innerHTML = '';
    const diffs = [
      { id: 'casual', name: 'DỄ', desc: 'Quái -20% máu, tốc độ chậm, dễ vượt ải' },
      { id: 'normal', name: 'BÌNH THƯỜNG', desc: 'Máu & tốc độ chuẩn Kingdom Rush' },
      { id: 'hard', name: 'KHÓ / HUYỀN THOẠI', desc: '+50% quái trong wave, quái +40% máu & +20% tốc chạy' }
    ];

    diffs.forEach(d => {
      const card = document.createElement('div');
      card.className = `diff-card ${this.selectedDifficulty === d.id ? 'active' : ''}`;
      card.innerHTML = `
        <div class="diff-name">${d.name}</div>
        <div class="diff-desc">${d.desc}</div>
      `;
      card.onclick = () => {
        this.selectedDifficulty = d.id;
        diffContainer.querySelectorAll('.diff-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        window.soundEngine.playSfx('click');
      };
      diffContainer.appendChild(card);
    });

    // 2. Render Bộ Chọn DUY NHẤT 1 Tướng
    const heroesContainer = document.getElementById('stage-hero-selector');
    heroesContainer.innerHTML = '';
    for (let heroKey in window.GAME_DATA.HEROES) {
      const h = window.GAME_DATA.HEROES[heroKey];
      const isSelected = this.selectedHero === heroKey;
      const hCard = document.createElement('div');
      hCard.className = `mini-hero-card ${isSelected ? 'selected' : ''}`;
      hCard.innerHTML = `
        <div class="mini-hero-icon" style="background:${h.color}">${h.name[0]}</div>
        <div class="mini-hero-name">${h.name.split(' ')[0]}</div>
      `;
      hCard.onclick = () => {
        this.selectedHero = heroKey;
        heroesContainer.querySelectorAll('.mini-hero-card').forEach(c => c.classList.remove('selected'));
        hCard.classList.add('selected');
        window.soundEngine.playSfx('click');
      };
      heroesContainer.appendChild(hCard);
    }

    // 3. Render Bộ Chọn TỐI ĐA 2 Bổ Trợ
    const spellsContainer = document.getElementById('stage-spells-selector');
    spellsContainer.innerHTML = '';
    for (let spellKey in window.GAME_DATA.SPELLS) {
      const sp = window.GAME_DATA.SPELLS[spellKey];
      const isChecked = this.selectedSpells.includes(spellKey);
      const spCard = document.createElement('div');
      spCard.className = `mini-spell-card ${isChecked ? 'selected' : ''}`;
      spCard.innerHTML = `
        <div class="mini-spell-icon">${sp.icon}</div>
        <div class="mini-spell-name">${sp.name}</div>
      `;
      spCard.onclick = () => {
        if (this.selectedSpells.includes(spellKey)) {
          if (this.selectedSpells.length > 1) {
            this.selectedSpells = this.selectedSpells.filter(s => s !== spellKey);
          }
        } else {
          if (this.selectedSpells.length >= 2) {
            this.selectedSpells.shift(); // Loại bỏ cái cũ nhất để giữ tối đa 2
          }
          this.selectedSpells.push(spellKey);
        }
        window.soundEngine.playSfx('click');
        this.showStageModal(stage, progress); // Re-render spell cards
      };
      spellsContainer.appendChild(spCard);
    }

    // Nút Bắt Đầu
    document.getElementById('btn-start-battle').onclick = () => {
      this.hideAllModals();
      this.launchStage(stage);
    };

    modal.classList.remove('hidden');
  }

  // --- Render Thanh 2 Bổ Trợ Trong HUD ---
  renderActiveSpellsHUD() {
    const hotbar = document.getElementById('active-spells-hotbar');
    if (!hotbar) return;
    hotbar.innerHTML = '';

    this.selectedSpells.forEach(spellKey => {
      const sp = window.GAME_DATA.SPELLS[spellKey];
      if (!sp) return;

      const slot = document.createElement('div');
      slot.id = `spell-${spellKey}-btn`;
      slot.className = 'spell-slot';
      slot.title = sp.name;
      slot.innerHTML = `
        ${sp.icon}
        <div id="spell-${spellKey}-mask" class="spell-cooldown-mask"></div>
      `;

      slot.onclick = () => {
        if (!this.engine || this.engine.spellCooldowns[spellKey] > 0) return;
        this.engine.activeSpellMode = spellKey;
        if (spellKey === 'frost_nova' || spellKey === 'holy_lightning' || spellKey === 'kings_bounty') {
          this.engine.handleInputClick(0, 0);
        } else {
          this.showSpellTargeting(`Nhấp vào bản đồ để thi triển ${sp.name}!`);
        }
      };

      hotbar.appendChild(slot);
    });
  }

  showBuildWheel(plot) {
    const wheel = document.getElementById('radial-build-wheel');
    const rect = this.engine.canvas.getBoundingClientRect();
    const screenX = rect.left + (plot.x / 1000) * rect.width;
    const screenY = rect.top + (plot.y / 600) * rect.height;

    wheel.style.left = `${screenX}px`;
    wheel.style.top = `${screenY}px`;
    wheel.classList.remove('hidden');

    ['archer_1', 'barracks_1', 'mage_1', 'artillery_1'].forEach(towerKey => {
      const btn = document.getElementById(`build-btn-${towerKey}`);
      if (btn) {
        const def = window.GAME_DATA.TOWERS[towerKey];
        btn.querySelector('.tower-cost').innerText = `${def.cost}v`;
        btn.onclick = () => {
          this.engine.buildTower(plot, towerKey);
          this.hideBuildWheel();
        };
      }
    });
  }

  hideBuildWheel() {
    document.getElementById('radial-build-wheel')?.classList.add('hidden');
  }

  showInspector(entity) {
    const inspector = document.getElementById('inspector-panel');
    inspector.classList.remove('hidden');

    if (entity instanceof window.Tower) {
      document.getElementById('inspector-title').innerText = `${entity.name} (Cấp ${entity.level})`;
      document.getElementById('inspector-desc').innerText = entity.def.description;
      document.getElementById('inspector-stats').innerHTML = `
        <div>Sát thương: <b>${entity.damageMin}-${entity.damageMax}</b> (${entity.damageType === 'magic' ? 'Phép thuật' : 'Vật lý'})</div>
        <div>Tầm bắn: <b>${entity.range}</b> | Tốc độ: <b>${entity.fireRate}s/phát</b></div>
      `;

      const actionsDiv = document.getElementById('inspector-actions');
      actionsDiv.innerHTML = '';

      if (entity.def.upgradesTo) {
        entity.def.upgradesTo.forEach(upKey => {
          const upDef = window.GAME_DATA.TOWERS[upKey];
          const btn = document.createElement('button');
          btn.className = 'game-btn gold-btn';
          btn.innerHTML = `Nâng cấp: ${upDef.name} (<b>${upDef.cost} vàng</b>)`;
          btn.onclick = () => this.engine.upgradeTower(entity, upKey);
          actionsDiv.appendChild(btn);
        });
      }

      if (entity.category === 'barracks') {
        const rallyBtn = document.createElement('button');
        rallyBtn.className = 'game-btn blue-btn';
        rallyBtn.innerText = '🚩 Đặt Điểm Tập Kết (Rally)';
        rallyBtn.onclick = () => {
          this.engine.activeSpellMode = 'barracks_rally';
          this.showSpellTargeting('Nhấp vào mặt đường để dời cờ tập kết lính canh!');
        };
        actionsDiv.appendChild(rallyBtn);
      }

      const sellRefund = Math.round(entity.cost * 0.7);
      const sellBtn = document.createElement('button');
      sellBtn.className = 'game-btn red-btn';
      sellBtn.innerHTML = `Bán Tháp (+${sellRefund} vàng)`;
      sellBtn.onclick = () => this.engine.sellTower(entity);
      actionsDiv.appendChild(sellBtn);

    } else if (entity instanceof window.Enemy) {
      document.getElementById('inspector-title').innerText = entity.name;
      document.getElementById('inspector-desc').innerText = entity.description || 'Kẻ địch hung bạo đang tiến về phía thành trì.';
      document.getElementById('inspector-stats').innerHTML = `
        <div>Máu (HP): <b>${Math.round(entity.hp)}/${entity.maxHp}</b></div>
        <div>Giáp vật lý: <b>${entity.armor}%</b> | Kháng phép: <b>${entity.magicResist}%</b></div>
        <div>Sát thương: <b>${entity.damage}</b> | Bay: <b>${entity.flying ? 'CÓ' : 'KHÔNG'}</b></div>
      `;
      document.getElementById('inspector-actions').innerHTML = '';
    } else if (entity instanceof window.Hero) {
      document.getElementById('inspector-title').innerText = `${entity.name} (Cấp ${entity.level})`;
      document.getElementById('inspector-desc').innerText = entity.title;
      document.getElementById('inspector-stats').innerHTML = `
        <div>Máu: <b>${Math.round(entity.hp)}/${entity.maxHp}</b> | Giáp: <b>${entity.armor}%</b></div>
        <div>Sát thương: <b>${entity.damageMin}-${entity.damageMax}</b> | Kinh nghiệm: <b>${entity.xp}/${entity.xpNextLevel}</b></div>
      `;
      const actionsDiv = document.getElementById('inspector-actions');
      actionsDiv.innerHTML = '';
      const rallyBtn = document.createElement('button');
      rallyBtn.className = 'game-btn blue-btn';
      rallyBtn.innerText = 'Di Chuyển Tướng';
      rallyBtn.onclick = () => {
        this.engine.activeSpellMode = 'hero_rally';
        this.showSpellTargeting('Nhấp vào bất kỳ đâu trên bản đồ để di chuyển Tướng!');
      };
      actionsDiv.appendChild(rallyBtn);
    }
  }

  hideInspector() {
    document.getElementById('inspector-panel')?.classList.add('hidden');
  }

  showSpellTargeting(text) {
    const banner = document.getElementById('spell-targeting-banner');
    banner.innerText = text;
    banner.classList.remove('hidden');
  }

  hideSpellTargeting() {
    document.getElementById('spell-targeting-banner')?.classList.add('hidden');
  }

  updateHUD() {
    if (!this.engine || !this.engine.stage) return;
    document.getElementById('hud-gold').innerText = this.engine.gold;
    document.getElementById('hud-lives').innerText = this.engine.lives;
    document.getElementById('hud-wave').innerText = `Đợt ${this.engine.currentWaveIndex}/${this.engine.stage.waves.length}`;

    // Cập nhật mặt nạ hồi chiêu 2 bổ trợ
    this.selectedSpells.forEach(spellId => {
      const cd = this.engine.spellCooldowns[spellId] || 0;
      const total = window.GAME_DATA.SPELLS[spellId].cooldown;
      const mask = document.getElementById(`spell-${spellId}-mask`);
      if (mask) {
        mask.style.height = `${(cd / total) * 100}%`;
      }
    });

    if (this.engine.hero) {
      document.getElementById('hud-hero-name').innerText = this.engine.hero.name.split(' ')[0];
      document.getElementById('hud-hero-level').innerText = `Cấp ${this.engine.hero.level}`;
      const hpPct = Math.max(0, (this.engine.hero.hp / this.engine.hero.maxHp) * 100);
      document.getElementById('hud-hero-hp-bar').style.width = `${hpPct}%`;

      const skillBtn = document.getElementById('btn-hero-active-skill');
      if (skillBtn) {
        const isReady = this.engine.hero.skillTimer <= 0;
        skillBtn.classList.toggle('ready', isReady);
        skillBtn.innerText = isReady ? '⚡ THI TRIỂN KỸ NĂNG!' : `⏳ ${Math.ceil(this.engine.hero.skillTimer)}s`;
      }
    }
  }

  showUpgradesModal() {
    const modal = document.getElementById('upgrades-modal');
    modal.classList.remove('hidden');
    this.renderUpgradeTree();
  }

  renderUpgradeTree() {
    const container = document.getElementById('upgrade-branches-container');
    container.innerHTML = '';

    const availStars = window.authManager.getAvailableStars();
    document.getElementById('upgrade-avail-stars').innerText = `${availStars} Ngôi Sao Khả Dụng`;

    const slot = window.authManager.getActiveSlot();
    const tree = window.GAME_DATA.UPGRADE_TREE;

    const branchNames = {
      archers: 'CUNG THỦ',
      barracks: 'DOANH TRẠI LÍNH',
      mages: 'PHÁP SƯ',
      artillery: 'PHÁO BINH',
      rain: 'MƯA THIÊN THẠCH',
      reinforce: 'QUÂN TIẾP VIỆN'
    };

    for (let branchKey in tree) {
      const branchDiv = document.createElement('div');
      branchDiv.className = 'upgrade-branch-card';
      branchDiv.innerHTML = `<h3>${branchNames[branchKey] || branchKey.toUpperCase()}</h3>`;

      const listDiv = document.createElement('div');
      listDiv.className = 'upgrade-nodes-list';

      tree[branchKey].forEach((node, nodeIdx) => {
        const isBought = slot.starUpgrades[branchKey][nodeIdx] === 1;
        const canBuy = !isBought && (nodeIdx === 0 || slot.starUpgrades[branchKey][nodeIdx - 1] === 1) && availStars >= node.cost;

        const nodeBtn = document.createElement('button');
        nodeBtn.className = `upgrade-node ${isBought ? 'bought' : canBuy ? 'available' : 'locked'}`;
        nodeBtn.innerHTML = `
          <div class="node-title">${node.name} (${node.cost}★)</div>
          <div class="node-desc">${node.desc}</div>
        `;

        if (canBuy) {
          nodeBtn.onclick = () => {
            slot.starUpgrades[branchKey][nodeIdx] = 1;
            window.authManager.saveLocally();
            window.soundEngine.playSfx('levelup');
            this.renderUpgradeTree();
          };
        }

        listDiv.appendChild(nodeBtn);
      });

      branchDiv.appendChild(listDiv);
      container.appendChild(branchDiv);
    }
  }

  respecStars() {
    const slot = window.authManager.getActiveSlot();
    for (let k in slot.starUpgrades) {
      slot.starUpgrades[k] = [0, 0, 0, 0, 0];
    }
    window.authManager.saveLocally();
    window.soundEngine.playSfx('gold');
    this.renderUpgradeTree();
  }

  showHeroesModal() {
    const modal = document.getElementById('heroes-modal');
    modal.classList.remove('hidden');

    const list = document.getElementById('heroes-selection-list');
    list.innerHTML = '';

    for (let heroKey in window.GAME_DATA.HEROES) {
      const hero = window.GAME_DATA.HEROES[heroKey];
      const isSelected = this.selectedHero === heroKey;

      const card = document.createElement('div');
      card.className = `hero-card ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="hero-card-icon" style="background: ${hero.color}">${hero.name[0]}</div>
        <h3>${hero.name}</h3>
        <p class="hero-title">${hero.title}</p>
        <p class="hero-quote">"${hero.quote}"</p>
        <p class="hero-desc">${hero.description}</p>
        <div style="font-size:11px; color:#f1c40f; margin-bottom:8px;">
          <b>Kỹ năng:</b> ${hero.skills.map(s => s.name).join(' • ')}
        </div>
        <button class="game-btn ${isSelected ? 'gold-btn' : 'blue-btn'}">${isSelected ? 'Đang Xuất Trận' : 'Chọn Tướng Này'}</button>
      `;

      card.querySelector('button').onclick = () => {
        this.selectedHero = heroKey;
        window.soundEngine.playSfx('click');
        this.showHeroesModal();
      };

      list.appendChild(card);
    }
  }

  showEncyclopediaModal() {
    const modal = document.getElementById('encyclopedia-modal');
    modal.classList.remove('hidden');

    document.querySelectorAll('.auth-tabs .auth-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('enc-tab-towers')?.classList.add('active');
    this.renderEncyclopedia('towers');
  }

  renderEncyclopedia(tab) {
    const container = document.getElementById('encyclopedia-content');
    container.innerHTML = '';

    if (tab === 'towers') {
      for (let tKey in window.GAME_DATA.TOWERS) {
        const t = window.GAME_DATA.TOWERS[tKey];
        const card = document.createElement('div');
        card.className = 'enc-card';
        card.innerHTML = `
          <h4 style="color:${t.spriteColor}">${t.name} (Cấp ${t.level})</h4>
          <p><b>Giá vàng:</b> ${t.cost}g | <b>Sát thương:</b> ${t.damageMin || 0}-${t.damageMax || 0} (${t.damageType === 'magic' ? 'Phép thuật' : 'Vật lý'})</p>
          <p>${t.description}</p>
        `;
        container.appendChild(card);
      }
    } else if (tab === 'enemies') {
      for (let eKey in window.GAME_DATA.ENEMIES) {
        const e = window.GAME_DATA.ENEMIES[eKey];
        const card = document.createElement('div');
        card.className = 'enc-card';
        card.innerHTML = `
          <h4 style="color:${e.color}">${e.name}</h4>
          <p><b>Máu (HP):</b> ${e.hp} | <b>Giáp:</b> ${e.armor}% | <b>Kháng phép:</b> ${e.magicResist}% | <b>Quái Bay:</b> ${e.flying ? 'CÓ' : 'KHÔNG'}</p>
          <p>${e.description}</p>
        `;
        container.appendChild(card);
      }
    } else if (tab === 'tips') {
      container.innerHTML = `
        <div class="enc-card">
          <h4>Chiến Thuật Điểm Nghẽn (Chokepoint)</h4>
          <p>Đặt lính Doanh Trại chặn đường ngay phía trước các cụm Tháp Pháo hoặc Tháp Phép để giữ quái đứng yên nhận trọn sát thương nổ lan!</p>
        </div>
        <div class="enc-card">
          <h4>Khắc Chế Giáp Vật Lý vs Kháng Phép</h4>
          <p>Orc Champion có giáp vật lý rất cao, hãy dùng Tháp Pháp Sư để bắn xuyên giáp. Quái bay Gargoyle không bị lính chặn, hãy dùng Cung Thủ để tiêu diệt!</p>
        </div>
        <div class="enc-card">
          <h4>Gọi Đợt Quái Sớm (Early Wave Call)</h4>
          <p>Bấm gọi đợt quái tiếp theo trước khi hết giờ đếm ngược sẽ giúp bạn nhận được thêm một lượng Vàng thưởng lớn và giảm hồi chiêu các phép thuật!</p>
        </div>
      `;
    }
  }

  showAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    this.updateAuthUI();
  }

  switchAuthTab(tab) {
    document.getElementById('auth-login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('auth-register-form').classList.toggle('hidden', tab !== 'register');
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  }

  async handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;

    const res = await window.authManager.login(identifier, password);
    if (res.success) {
      window.soundEngine.playSfx('victory');
      this.updateAuthUI();
      this.hideAllModals();
      if (this.currentView === 'map') this.renderWorldMap();
    } else {
      document.getElementById('auth-error-msg').innerText = res.error;
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const res = await window.authManager.register(username, email, password);
    if (res.success) {
      window.soundEngine.playSfx('victory');
      this.updateAuthUI();
      this.hideAllModals();
      if (this.currentView === 'map') this.renderWorldMap();
    } else {
      document.getElementById('auth-error-msg').innerText = res.error;
    }
  }

  updateAuthUI() {
    const isLoggedIn = window.authManager.isLoggedIn();
    const user = window.authManager.user;

    const authBtn = document.getElementById('btn-auth-menu');
    const profileSec = document.getElementById('auth-logged-in-profile');
    const formsSec = document.getElementById('auth-forms-container');

    if (authBtn) {
      authBtn.innerText = isLoggedIn ? `👤 ${user.username}` : '🔑 Đăng Nhập';
    }

    if (profileSec && formsSec) {
      profileSec.classList.toggle('hidden', !isLoggedIn);
      formsSec.classList.toggle('hidden', isLoggedIn);
      if (isLoggedIn) {
        document.getElementById('profile-username').innerText = user.username;
        document.getElementById('profile-email').innerText = user.email;
      }
    }
  }

  showVictoryModal(stars, score) {
    const modal = document.getElementById('victory-modal');
    modal.classList.remove('hidden');
    document.getElementById('victory-stars-display').innerText = '★'.repeat(stars);
    document.getElementById('victory-score-display').innerText = `Điểm Số Cuối Cùng: ${score}`;
  }

  showDefeatModal() {
    document.getElementById('defeat-modal').classList.remove('hidden');
  }

  hideAllModals() {
    document.querySelectorAll('.kr-modal').forEach(m => m.classList.add('hidden'));
    this.hideBuildWheel();
    this.hideSpellTargeting();
  }
}

window.UIManager = UIManager;
