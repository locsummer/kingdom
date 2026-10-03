// Kingdom Rush Game Data - Bản Cân Bằng Đỉnh Cao, Đầy Đủ 8 Tướng & 7 Bổ Trợ Phép Thuật

window.GAME_DATA = {
  // ---------------- HỆ THỐNG THÁP THỦ (TOWERS) - ĐÃ BUFF SÁT THƯƠNG ----------------
  TOWERS: {
    // 1. NHÁNH CUNG THỦ (ARCHER)
    archer_1: {
      id: 'archer_1',
      name: 'Tháp Cung Thủ',
      category: 'archer',
      level: 1,
      cost: 70,
      damageMin: 8,
      damageMax: 14,
      damageType: 'physical',
      range: 170,
      fireRate: 0.65,
      description: 'Bắn tên nhanh như gió. Rất hiệu quả trước các đàn quái không giáp.',
      projectileType: 'arrow',
      spriteColor: '#27ae60',
      upgradesTo: ['archer_2']
    },
    archer_2: {
      id: 'archer_2',
      name: 'Tháp Thiện Xạ',
      category: 'archer',
      level: 2,
      cost: 110,
      damageMin: 16,
      damageMax: 26,
      damageType: 'physical',
      range: 195,
      fireRate: 0.55,
      description: 'Tăng mạnh tốc độ bắn và tầm ngắm, xuyên phá tốt hơn.',
      projectileType: 'arrow',
      spriteColor: '#2ecc71',
      upgradesTo: ['archer_3']
    },
    archer_3: {
      id: 'archer_3',
      name: 'Tháp Xạ Thủ Tinh Anh',
      category: 'archer',
      level: 3,
      cost: 160,
      damageMin: 30,
      damageMax: 48,
      damageType: 'physical',
      range: 225,
      fireRate: 0.45,
      description: 'Xả tên liên thanh với sát thương chí mạng cực cao.',
      projectileType: 'arrow',
      spriteColor: '#16a085',
      upgradesTo: ['archer_rangers', 'archer_musketeers']
    },
    archer_rangers: {
      id: 'archer_rangers',
      name: 'Sơn Trại Kiểm Lâm (Rangers)',
      category: 'archer',
      level: 4,
      cost: 230,
      damageMin: 45,
      damageMax: 70,
      damageType: 'physical',
      range: 250,
      fireRate: 0.35,
      description: 'Xả bão tên thần tốc. Kỹ năng: Tẩm Độc Đậm Đặc và Rễ Cây Rỉ Máu.',
      projectileType: 'arrow',
      spriteColor: '#1abc9c',
      skills: {
        poisonArrows: { name: 'Mũi Tên Kịch Độc', maxLevel: 3, cost: [150, 100, 100], desc: 'Gây 90/180/270 sát thương độc trong 3 giây.' },
        wrathOfForest: { name: 'Rễ Cây Ma Quái', maxLevel: 3, cost: [200, 150, 150], desc: 'Trói chân quái vật 3/4/5 giây kèm sát thương rỉ máu cực mạnh.' }
      }
    },
    archer_musketeers: {
      id: 'archer_musketeers',
      name: 'Đồn Hỏa Mai (Musketeers)',
      category: 'archer',
      level: 4,
      cost: 230,
      damageMin: 110,
      damageMax: 190,
      damageType: 'physical',
      range: 300,
      fireRate: 1.1,
      description: 'Súng trường công phá siêu tầm xa. Kỹ năng: Bắn Tỉa One-Hit và Đạn Pháo Nổ.',
      projectileType: 'bullet',
      spriteColor: '#34495e',
      skills: {
        sniperShot: { name: 'Phát Bắn Tử Thần', maxLevel: 3, cost: [200, 150, 150], desc: '30%/50%/70% cơ hội tiêu diệt tức thì mục tiêu hoặc gây 800+ sát thương.' },
        shrapnelShot: { name: 'Đạn Pháo Nổ Lan', maxLevel: 3, cost: [250, 150, 150], desc: 'Bắn đạn chùm gây 200/350/500 sát thương nổ diện rộng.' }
      }
    },

    // 2. NHÁNH DOANH TRẠI LÍNH (BARRACKS)
    barracks_1: {
      id: 'barracks_1',
      name: 'Trại Dân Binh',
      category: 'barracks',
      level: 1,
      cost: 70,
      soldierCount: 3,
      soldierHp: 100,
      soldierDamageMin: 4,
      soldierDamageMax: 8,
      soldierArmor: 10,
      respawnTime: 8,
      range: 145,
      description: 'Huấn luyện 3 dân binh kiên cường chặn đường và cận chiến.',
      spriteColor: '#d35400',
      upgradesTo: ['barracks_2']
    },
    barracks_2: {
      id: 'barracks_2',
      name: 'Trại Bộ Binh',
      category: 'barracks',
      level: 2,
      cost: 110,
      soldierCount: 3,
      soldierHp: 200,
      soldierDamageMin: 10,
      soldierDamageMax: 18,
      soldierArmor: 25,
      respawnTime: 8,
      range: 155,
      description: 'Trang bị kiếm thép và khiên da, gia tăng đáng kể lượng máu và sức chịu đựng.',
      spriteColor: '#e67e22',
      upgradesTo: ['barracks_3']
    },
    barracks_3: {
      id: 'barracks_3',
      name: 'Trại Hiệp Sĩ',
      category: 'barracks',
      level: 3,
      cost: 160,
      soldierCount: 3,
      soldierHp: 350,
      soldierDamageMin: 20,
      soldierDamageMax: 35,
      soldierArmor: 50,
      respawnTime: 8,
      range: 165,
      description: 'Hiệp sĩ giáp sắt uy dũng, chặn đứng những bầy quái vật hung bạo nhất.',
      spriteColor: '#f39c12',
      upgradesTo: ['barracks_holy', 'barracks_barbarians']
    },
    barracks_holy: {
      id: 'barracks_holy',
      name: 'Thánh Điện Thánh Hiệp Sĩ (Holy Order)',
      category: 'barracks',
      level: 4,
      cost: 230,
      soldierCount: 3,
      soldierHp: 550,
      soldierDamageMin: 35,
      soldierDamageMax: 55,
      soldierArmor: 75,
      respawnTime: 8,
      range: 175,
      description: 'Paladin bất tử mang phước lành thánh thần. Kỹ năng: Ánh Sáng Tự Lành, Khiên Bất Hoại, Đòn Đánh Thánh.',
      spriteColor: '#f1c40f',
      skills: {
        healingLight: { name: 'Ánh Sáng Hồi Máu', maxLevel: 3, cost: [120, 100, 100], desc: 'Tự động hồi 80/160/240 HP mỗi 4 giây.' },
        shieldOfValor: { name: 'Khiên Bất Hoại', maxLevel: 3, cost: [150, 100, 100], desc: 'Tăng giáp lên 80%/88%/95%.' },
        holyStrike: { name: 'Đòn Đánh Thánh Chuẩn', maxLevel: 3, cost: [180, 120, 120], desc: 'Cơ hội tung đòn sát thương chuẩn 100/180/260 diện rộng.' }
      }
    },
    barracks_barbarians: {
      id: 'barracks_barbarians',
      name: 'Đại Sảnh Cuồng Chiến Binh (Barbarians)',
      category: 'barracks',
      level: 4,
      cost: 230,
      soldierCount: 3,
      soldierHp: 480,
      soldierDamageMin: 50,
      soldierDamageMax: 85,
      soldierArmor: 30,
      respawnTime: 8,
      range: 175,
      description: 'Chiến binh cuồng nộ sát thương cực lớn. Kỹ năng: Ném Rìu Tầm Xa, Cuồng Huyết Hút Máu, Song Rìu Hủy Diệt.',
      spriteColor: '#c0392b',
      skills: {
        throwingAxes: { name: 'Ném Rìu Hạ Quái Bay', maxLevel: 3, cost: [150, 100, 100], desc: 'Ném rìu tấn công mục tiêu từ xa gây 80/140/200 sát thương.' },
        bloodlust: { name: 'Cuồng Huyết Hút Máu', maxLevel: 3, cost: [150, 100, 100], desc: 'Tăng tốc độ đánh và hút 40% máu trên sát thương gây ra.' },
        moreAxes: { name: 'Song Rìu Sát Thủ', maxLevel: 3, cost: [180, 120, 120], desc: 'Tăng trực tiếp +30/+60/+90 sát thương cận chiến.' }
      }
    },

    // 3. NHÁNH PHÁP SƯ (MAGE)
    mage_1: {
      id: 'mage_1',
      name: 'Tháp Pháp Sư',
      category: 'mage',
      level: 1,
      cost: 100,
      damageMin: 18,
      damageMax: 32,
      damageType: 'magic',
      range: 155,
      fireRate: 1.2,
      description: 'Bắn tia năng lượng phép xuyên thủng 100% giáp vật lý của kẻ địch.',
      projectileType: 'magic_bolt',
      spriteColor: '#8e44ad',
      upgradesTo: ['mage_2']
    },
    mage_2: {
      id: 'mage_2',
      name: 'Tháp Pháp Sư Cao Cấp',
      category: 'mage',
      level: 2,
      cost: 160,
      damageMin: 45,
      damageMax: 80,
      damageType: 'magic',
      range: 175,
      fireRate: 1.1,
      description: 'Gia tăng sức mạnh bí thuật và tốc độ niệm phép.',
      projectileType: 'magic_bolt',
      spriteColor: '#9b59b6',
      upgradesTo: ['mage_3']
    },
    mage_3: {
      id: 'mage_3',
      name: 'Tháp Đại Pháp Sư',
      category: 'mage',
      level: 3,
      cost: 240,
      damageMin: 90,
      damageMax: 150,
      damageType: 'magic',
      range: 195,
      fireRate: 1.0,
      description: 'Hỏa lực phép thuật hủy diệt mọi quái vật bọc giáp dày đặc.',
      projectileType: 'magic_bolt',
      spriteColor: '#6c5ce7',
      upgradesTo: ['mage_arcane', 'mage_sorcerer']
    },
    mage_arcane: {
      id: 'mage_arcane',
      name: 'Tháp Pháp Sư Bí Thuật (Arcane Wizard)',
      category: 'mage',
      level: 4,
      cost: 300,
      damageMin: 160,
      damageMax: 280,
      damageType: 'magic',
      range: 220,
      fireRate: 0.9,
      description: 'Phép thuật cổ xưa tối thượng. Kỹ năng: Tia Hủy Diệt (Death Ray) và Dịch Chuyển Quái Lùi Lại.',
      projectileType: 'arcane_beam',
      spriteColor: '#a29bfe',
      skills: {
        deathRay: { name: 'Tia Hủy Diệt One-Hit', maxLevel: 3, cost: [250, 150, 150], desc: 'Hạ gục tức thì mục tiêu bất kỳ sau mỗi 16/12/8 giây.' },
        teleport: { name: 'Dịch Chuyển Lùi Quái', maxLevel: 3, cost: [200, 120, 120], desc: 'Dịch chuyển lùi 4/6/8 quái vật ngược lại điểm xuất phát.' }
      }
    },
    mage_sorcerer: {
      id: 'mage_sorcerer',
      name: 'Tháp Phù Thủy Nguyền Rủa (Sorcerer Mage)',
      category: 'mage',
      level: 4,
      cost: 300,
      damageMin: 100,
      damageMax: 180,
      damageType: 'magic',
      range: 205,
      fireRate: 0.75,
      description: 'Nguyền rủa quái vật. Kỹ năng: Biến Quái Thành Cừu Vĩnh Viễn và Triệu Hồi Người Đá Khổng Lồ.',
      projectileType: 'sorcerer_bolt',
      spriteColor: '#e056fd',
      skills: {
        polymorph: { name: 'Biến Thành Cừu', maxLevel: 3, cost: [250, 150, 150], desc: 'Biến quái vật nguy hiểm thành chú cừu vô hại vĩnh viễn!' },
        summonElemental: { name: 'Người Đá Khổng Lồ', maxLevel: 3, cost: [250, 150, 150], desc: 'Triệu hồi Người Đá (1200 HP, 80 dmg) đứng vững chặn đường.' }
      }
    },

    // 4. NHÁNH PHÁO BINH (ARTILLERY)
    artillery_1: {
      id: 'artillery_1',
      name: 'Pháo Cối Người Lùn',
      category: 'artillery',
      level: 1,
      cost: 125,
      damageMin: 20,
      damageMax: 40,
      damageType: 'physical',
      splashRadius: 65,
      range: 155,
      fireRate: 2.3,
      description: 'Bắn đại bác nổ lan diện rộng quét sạch các đàn quái vật đông đúc.',
      projectileType: 'bomb',
      spriteColor: '#7f8c8d',
      upgradesTo: ['artillery_2']
    },
    artillery_2: {
      id: 'artillery_2',
      name: 'Pháo Tầm Xa',
      category: 'artillery',
      level: 2,
      cost: 220,
      damageMin: 50,
      damageMax: 95,
      damageType: 'physical',
      splashRadius: 75,
      range: 175,
      fireRate: 2.1,
      description: 'Khẩu pháo nòng lớn với uy lực và bán kính công phá mạnh mẽ hơn.',
      projectileType: 'bomb',
      spriteColor: '#95a5a6',
      upgradesTo: ['artillery_3']
    },
    artillery_3: {
      id: 'artillery_3',
      name: 'Trận Địa Pháo Hạng Nặng',
      category: 'artillery',
      level: 3,
      cost: 320,
      damageMin: 110,
      damageMax: 200,
      damageType: 'physical',
      splashRadius: 90,
      range: 195,
      fireRate: 1.9,
      description: 'Đạn đại bác hủy diệt tạo nên những trận động đất rung chuyển chiến trường.',
      projectileType: 'bomb',
      spriteColor: '#bdc3c7',
      upgradesTo: ['artillery_bertha', 'artillery_tesla']
    },
    artillery_bertha: {
      id: 'artillery_bertha',
      name: 'Siêu Đại Bác Big Bertha 500mm',
      category: 'artillery',
      level: 4,
      cost: 400,
      damageMin: 220,
      damageMax: 420,
      damageType: 'physical',
      splashRadius: 110,
      range: 230,
      fireRate: 2.0,
      description: 'Vũ khí hủy diệt tối thượng. Kỹ năng: Tên Lửa Rồng Bám Đuổi và Thảm Bom Chùm.',
      projectileType: 'super_bomb',
      spriteColor: '#2c3e50',
      skills: {
        dragonsBreath: { name: 'Tên Lửa Rồng Tầm Nhiệt', maxLevel: 3, cost: [250, 150, 150], desc: 'Phóng tên lửa tìm mục tiêu toàn bản đồ gây 600/1000/1500 sát thương.' },
        clusterBomb: { name: 'Thảm Bom Chùm', maxLevel: 3, cost: [200, 120, 120], desc: 'Bom phát nổ phân tách thành 5/7/9 bom con rải thảm mặt đường.' }
      }
    },
    artillery_tesla: {
      id: 'artillery_tesla',
      name: 'Tháp Sét Tesla x104',
      category: 'artillery',
      level: 4,
      cost: 375,
      damageMin: 130,
      damageMax: 240,
      damageType: 'physical',
      range: 195,
      fireRate: 1.4,
      description: 'Tháp điện giật sét chuỗi cả quái đất lẫn quái bay. Kỹ năng: Quá Tải Tĩnh Điện và Sét Siêu Cường.',
      projectileType: 'tesla_shock',
      spriteColor: '#0984e3',
      skills: {
        overcharge: { name: 'Vòng Điện Quá Tải', maxLevel: 3, cost: [200, 120, 120], desc: 'Tạo bão điện từ giật xung quanh 120/240/360 sát thương.' },
        superchargedBolt: { name: 'Sét Siêu Cường', maxLevel: 3, cost: [220, 130, 130], desc: 'Tăng số lượng mục tiêu bị giật tia sét lên 5/7/9 kẻ địch.' }
      }
    }
  },

  // ---------------- DANH SÁCH 8 ANH HÙNG (HEROES) - CỰC MẠNH & KỸ NĂNG BÁ ĐẠO ----------------
  HEROES: {
    gerald: {
      id: 'gerald',
      name: 'Gerald Lightseeker',
      title: 'Đại Thống Lĩnh Hiệp Sĩ',
      hp: 650,
      damageMin: 35,
      damageMax: 60,
      armor: 60,
      speed: 1.8,
      respawnTime: 10,
      color: '#f1c40f',
      quote: 'Vì Đức Vua và Vương Quốc!',
      skillCooldown: 7.0, // 7 giây dùng chiêu 1 lần!
      skills: [
        { id: 'retribution', name: 'Khiên Phản Kích', desc: 'Phản lại 50% sát thương cho kẻ tấn công.' },
        { id: 'courage', name: 'Hào Quang Dũng Khí', desc: 'Tăng 50% sát thương và hồi máu cho lính xung quanh.' }
      ],
      description: 'Hiệp sĩ giáp vàng huyền thoại, có lượng máu và giáp siêu kiên cố cùng hào quang buff đồng minh.'
    },
    alleria: {
      id: 'alleria',
      name: 'Alleria Swiftwind',
      title: 'Nữ Xạ Thủ Tiên Tộc',
      hp: 450,
      damageMin: 55,
      damageMax: 90,
      armor: 20,
      speed: 2.4,
      range: 240,
      isRanged: true,
      respawnTime: 8,
      color: '#2ecc71',
      quote: 'Cung tên của ta không bao giờ trượt!',
      skillCooldown: 6.0,
      skills: [
        { id: 'multishot', name: 'Bão Tên Liên Hoàn', desc: 'Bắn cùng lúc 6 mũi tên chí mạng vào quái vật.' },
        { id: 'wildcat', name: 'Triệu Hồi Báo Rừng', desc: 'Triệu hồi báo hoa mai chiến đấu dũng mãnh.' }
      ],
      description: 'Nữ cung thủ tiên tộc xả tên tầm cực xa với độ chính xác tuyệt đối và triệu hồi linh thú.'
    },
    malik: {
      id: 'malik',
      name: 'Malik Hammerfury',
      title: 'Cuồng Lôi Người Lùn',
      hp: 800,
      damageMin: 70,
      damageMax: 120,
      armor: 45,
      speed: 1.5,
      respawnTime: 12,
      color: '#e74c3c',
      quote: 'Nghiền nát chúng thành tro bụi!',
      skillCooldown: 6.5,
      skills: [
        { id: 'earthquake', name: 'Địa Chấn Búa Tạ', desc: 'Dậm đất gây 250 sát thương và làm choáng 3s.' },
        { id: 'fury', name: 'Cuồng Lực', desc: 'Tăng gấp đôi tốc độ đánh khi máu giảm.' }
      ],
      description: 'Đấu sĩ người lùn vung cây búa sấm sét tạo nên những cơn địa chấn làm choáng hàng loạt quái.'
    },
    ignis: {
      id: 'ignis',
      name: 'Ignis Long Vương',
      title: 'Hỏa Long Cổ Đại',
      hp: 700,
      damageMin: 65,
      damageMax: 110,
      armor: 40,
      speed: 2.2,
      range: 200,
      isRanged: true,
      respawnTime: 10,
      color: '#e67e22',
      quote: 'Hơi thở của ta sẽ thiêu rụi tất cả!',
      skillCooldown: 6.0,
      skills: [
        { id: 'firebreath', name: 'Bão Lửa Long Vương', desc: 'Phun bão lửa thiêu đốt toàn bộ kẻ địch trên đường.' },
        { id: 'meteorite', name: 'Cánh Lửa Tro Tàn', desc: 'Đập cánh tạo mưa nham thạch nổ tung 300 sát thương.' }
      ],
      description: 'Hỏa Long huyền thoại bay lượn trên chiến trường, phun bão lửa thiêu rụi mọi đội hình quái vật.'
    },
    denas: {
      id: 'denas',
      name: 'Vua Denas',
      title: 'Đức Vua Linirea',
      hp: 600,
      damageMin: 45,
      damageMax: 75,
      armor: 50,
      speed: 1.6,
      range: 180,
      isRanged: true,
      respawnTime: 10,
      color: '#9b59b6',
      quote: 'Bảo vệ vương quốc của ta!',
      skillCooldown: 7.0,
      skills: [
        { id: 'royalguard', name: 'Triệu Hồi Ngự Lâm Quân', desc: 'Triệu hồi 3 cận vệ hoàng gia tinh nhuệ chặn đường.' },
        { id: 'cannonbarrage', name: 'Pháo Lễ Hoàng Gia', desc: 'Bắn 4 quả pháo đại bác hoàng gia nổ tung toàn sân.' }
      ],
      description: 'Đức vua vĩ đại của Linirea có khả năng gọi ngự lâm quân và chỉ thị pháo kích yểm trợ.'
    },
    bolla: {
      id: 'bolla',
      name: 'Bolla Sát Thủ',
      title: 'Bóng Ma Ám Sát',
      hp: 480,
      damageMin: 80,
      damageMax: 140,
      armor: 25,
      speed: 2.6,
      respawnTime: 8,
      color: '#2c3e50',
      quote: 'Từ trong bóng tối, ngươi sẽ ngã xuống!',
      skillCooldown: 5.5,
      skills: [
        { id: 'shadowstrike', name: 'Lướt Ám Sát', desc: 'Chớp nhoáng chém 5 nhát kiếm chí mạng gây 400 damage.' },
        { id: 'poisondarts', name: 'Phi Tiêu Độc', desc: 'Phóng phi tiêu làm chậm và ăn mòn quái vật.' }
      ],
      description: 'Sát thủ bóng đêm nhanh nhẹn, tung ra những nhát kiếm đoạt mạng mục tiêu trong nháy mắt.'
    },
    magnus: {
      id: 'magnus',
      name: 'Đại Pháp Sư Magnus',
      title: 'Chúa Tể Bí Thuật',
      hp: 500,
      damageMin: 75,
      damageMax: 130,
      armor: 20,
      speed: 1.9,
      range: 230,
      isRanged: true,
      respawnTime: 9,
      color: '#3498db',
      quote: 'Bí thuật sẽ định hình chiến trường!',
      skillCooldown: 6.0,
      skills: [
        { id: 'arcaneclones', name: 'Phân Thân Ảo Ảnh', desc: 'Tạo ra 2 phân thân cùng bắn phép thuật hủy diệt.' },
        { id: 'timestorm', name: 'Mưa Năng Lượng', desc: 'Dội cơn bão phép bí thuật quét sạch quái vật.' }
      ],
      description: 'Pháp sư tối cao với khả năng phân thân ảo ảnh và phóng bão năng lượng Arcane.'
    },
    hacksaw: {
      id: 'hacksaw',
      name: 'Hacksaw Cỗ Máy',
      title: 'Người Máy Chiến Tranh',
      hp: 950,
      damageMin: 60,
      damageMax: 105,
      armor: 65,
      speed: 1.4,
      respawnTime: 14,
      color: '#16a085',
      quote: 'Cắt! Xé! Nghiền nát tất cả!',
      skillCooldown: 6.5,
      skills: [
        { id: 'chainsaw', name: 'Cưa Máy Tử Thần', desc: 'Cưa máy xé toạc mục tiêu gây 500 sát thương chuẩn.' },
        { id: 'missilebarrage', name: 'Bắn Tên Lửa Chùm', desc: 'Phóng 6 quả tên lửa hủy diệt quái bay và quái đất.' }
      ],
      description: 'Cỗ máy bọc thép khổng lồ điều khiển bởi Goblin với cưa máy và bệ phóng tên lửa tự chế.'
    }
  },

  // ---------------- HỆ THỐNG 7 BỔ TRỢ PHÉP THUẬT TOÀN CỤC (SPELLS) ----------------
  SPELLS: {
    rain_of_fire: {
      id: 'rain_of_fire',
      name: 'Mưa Thiên Thạch',
      icon: '🔥',
      cooldown: 45,
      damage: 350,
      description: 'Dội cơn mưa thiên thạch rực lửa từ bầu trời xuống quét sạch quái vật trên diện rộng.'
    },
    reinforcements: {
      id: 'reinforcements',
      name: 'Quân Tiếp Viện',
      icon: '🛡️',
      cooldown: 10,
      unitHp: 160,
      unitDamage: 18,
      unitArmor: 25,
      duration: 25,
      description: 'Thả ngay 2 chiến binh dân binh tinh nhuệ vào điểm nóng để chặn quái vật.'
    },
    frost_nova: {
      id: 'frost_nova',
      name: 'Đóng Băng Thời Gian',
      icon: '❄️',
      cooldown: 35,
      duration: 5.0,
      description: 'Đóng băng toàn bộ quái vật trên toàn bản đồ trong 5 giây, không thể di chuyển!'
    },
    holy_lightning: {
      id: 'holy_lightning',
      name: 'Bão Sét Thánh Thần',
      icon: '⚡',
      cooldown: 30,
      damage: 400,
      targetCount: 8,
      description: 'Giáng sấm sét hủy diệt cùng lúc 8 quái vật mạnh nhất trên đường đi.'
    },
    fat_boy_bomb: {
      id: 'fat_boy_bomb',
      name: 'Siêu Bom Nguyên Tử',
      icon: '💣',
      cooldown: 60,
      damage: 1200,
      radius: 140,
      description: 'Vụ nổ siêu cấp xóa sổ hoàn toàn mọi quái vật trong khu vực chỉ định!'
    },
    kings_bounty: {
      id: 'kings_bounty',
      name: 'Rương Vàng Hoàng Gia',
      icon: '👑',
      cooldown: 50,
      goldAmount: 300,
      description: 'Tiếp tế ngay lập tức +300 Vàng vào ngân khố để nâng cấp và xây tháp khẩn cấp!'
    },
    poison_mist: {
      id: 'poison_mist',
      name: 'Sương Độc Tử Thần',
      icon: '🧪',
      cooldown: 35,
      duration: 8.0,
      damagePerSec: 60,
      description: 'Phủ làn sương độc kéo dài 8 giây, làm chậm và ăn mòn máu của mọi quái vật đi qua.'
    }
  },

  // ---------------- DANH SÁCH QUÁI VẬT ----------------
  ENEMIES: {
    goblin: {
      id: 'goblin',
      name: 'Yêu Tinh Goblin',
      hp: 55,
      speed: 1.4,
      armor: 0,
      magicResist: 0,
      damage: 4,
      rewardGold: 8,
      livesCost: 1,
      flying: false,
      color: '#27ae60',
      size: 14,
      description: 'Quái vật nhỏ bé, chạy nhanh nhưng máu giấy và không có giáp.'
    },
    orc_champion: {
      id: 'orc_champion',
      name: 'Chiến Binh Orc',
      hp: 180,
      speed: 0.9,
      armor: 40,
      magicResist: 0,
      damage: 15,
      rewardGold: 18,
      livesCost: 1,
      flying: false,
      color: '#16a085',
      size: 18,
      description: 'Orc mang giáp sắt dày. Chống chịu tốt tên bắn, dễ bị tiêu diệt bởi tháp phép.'
    },
    ogre: {
      id: 'ogre',
      name: 'Khổng Lồ Ogre',
      hp: 500,
      speed: 0.6,
      armor: 20,
      magicResist: 0,
      damage: 40,
      rewardGold: 40,
      livesCost: 2,
      flying: false,
      color: '#d35400',
      size: 24,
      description: 'Quái vật khổng lồ với lượng máu cực lớn, đè bẹp lính chặn trong cận chiến.'
    },
    brigand: {
      id: 'brigand',
      name: 'Sơn Tặc Brigand',
      hp: 110,
      speed: 1.1,
      armor: 20,
      magicResist: 0,
      damage: 9,
      rewardGold: 12,
      livesCost: 1,
      flying: false,
      color: '#e67e22',
      size: 16,
      description: 'Kẻ cướp với khiên gỗ cân bằng giữa tốc độ và phòng thủ.'
    },
    gargoyle: {
      id: 'gargoyle',
      name: 'Quái Bay Gargoyle',
      hp: 95,
      speed: 1.3,
      armor: 0,
      magicResist: 30,
      damage: 12,
      rewardGold: 14,
      livesCost: 1,
      flying: true,
      color: '#7f8c8d',
      size: 16,
      description: 'Quái thú đá có cánh, bay qua đầu lính chặn đường. Phải dùng cung/pháp sư để hạ.'
    },
    shaman: {
      id: 'shaman',
      name: 'Thầy Pháp Shaman',
      hp: 150,
      speed: 0.8,
      armor: 0,
      magicResist: 50,
      damage: 14,
      rewardGold: 25,
      livesCost: 1,
      flying: false,
      color: '#8e44ad',
      size: 17,
      isHealer: true,
      healCooldown: 3.5,
      description: 'Phù thủy liên tục niệm chú hồi máu cho các quái vật đồng minh xung quanh.'
    },
    shadow_wolf: {
      id: 'shadow_wolf',
      name: 'Sói Bóng Đêm',
      hp: 85,
      speed: 2.1,
      armor: 0,
      magicResist: 0,
      damage: 12,
      rewardGold: 10,
      livesCost: 1,
      flying: false,
      color: '#2c3e50',
      size: 15,
      description: 'Quái thú di chuyển siêu tốc độ, dễ dàng vượt qua các hàng phòng thủ sơ hở.'
    },
    necromancer: {
      id: 'necromancer',
      name: 'Pháp Sư Gọi Hồn',
      hp: 260,
      speed: 0.7,
      armor: 0,
      magicResist: 60,
      damage: 20,
      rewardGold: 35,
      livesCost: 1,
      flying: false,
      color: '#575fcf',
      size: 18,
      isSummoner: true,
      summonCooldown: 4.5,
      description: 'Pháp sư bóng tối liên tục triệu hồi các bộ xương khô Skeleton từ lòng đất.'
    },
    skeleton: {
      id: 'skeleton',
      name: 'Bộ Xương Khô Skeleton',
      hp: 45,
      speed: 1.0,
      armor: 0,
      magicResist: 0,
      damage: 6,
      rewardGold: 3,
      livesCost: 1,
      flying: false,
      color: '#d2dae2',
      size: 13,
      description: 'Chiến binh xương bất tử được triệu hồi bởi Pháp Sư Gọi Hồn.'
    },
    mountain_troll: {
      id: 'mountain_troll',
      name: 'Quái Đỉnh Núi Troll',
      hp: 850,
      speed: 0.5,
      armor: 0,
      magicResist: 30,
      damage: 50,
      regenRate: 20,
      rewardGold: 60,
      livesCost: 3,
      flying: false,
      color: '#485460',
      size: 26,
      description: 'Troll khổng lồ có khả năng tự hồi phục lượng máu cực nhanh theo thời gian.'
    },
    boss_jt: {
      id: 'boss_jt',
      name: 'Trùm Người Tuyết J.T.',
      isBoss: true,
      hp: 2800,
      speed: 0.4,
      armor: 30,
      magicResist: 30,
      damage: 140,
      rewardGold: 250,
      livesCost: 10,
      flying: false,
      color: '#00d2d3',
      size: 34,
      description: 'Quái vật đỉnh băng giá huyền thoại. Dậm chân tạo sóng xung kích địa chấn.'
    },
    boss_veznan: {
      id: 'boss_veznan',
      name: 'Chúa Tể Hắc Ám Vez\'nan',
      isBoss: true,
      hp: 4500,
      speed: 0.45,
      armor: 40,
      magicResist: 50,
      damage: 180,
      rewardGold: 600,
      livesCost: 20,
      flying: false,
      color: '#ff3838',
      size: 36,
      description: 'Đại ma đầu điều khiển toàn bộ quân đoàn hắc ám. Niệm chú đóng băng tháp phòng thủ!'
    }
  },

  // ---------------- CÂY NÂNG CẤP SAO ----------------
  UPGRADE_TREE: {
    archers: [
      { name: 'Thu Hồi Vàng', cost: 1, desc: 'Bán tháp nhận lại 80% số vàng đã bỏ ra.' },
      { name: 'Mắt Đại Bàng', cost: 1, desc: 'Tăng tầm bắn của tháp cung thủ thêm +10%.' },
      { name: 'Tên Xuyên Giáp', cost: 2, desc: 'Mũi tên bỏ qua 20% giáp của kẻ địch.' },
      { name: 'Tầm Xa Tối Thượng', cost: 2, desc: 'Gia tăng tầm bắn thêm +15% nữa.' },
      { name: 'Song Tiễn', cost: 3, desc: '35% cơ hội bắn cùng lúc 2 mũi tên mỗi phát bắn.' }
    ],
    barracks: [
      { name: 'Thể Lực Dẻo Dai', cost: 1, desc: 'Tăng lượng máu của binh lính thêm +20%.' },
      { name: 'Giáp Gia Cố', cost: 1, desc: 'Tăng giáp cơ bản của lính thêm +15%.' },
      { name: 'Tiếp Viện Thần Tốc', cost: 2, desc: 'Giảm 30% thời gian hồi sinh của binh lính.' },
      { name: 'Huấn Luyện Sinh Tồn', cost: 2, desc: 'Tăng thêm +35% máu tối đa cho lính.' },
      { name: 'Ý Chí Sắt Đá', cost: 3, desc: 'Lính tự hồi 8% máu mỗi giây khi không trong giao tranh.' }
    ],
    mages: [
      { name: 'Tập Trung Ma Thuật', cost: 1, desc: 'Tăng 15% sát thương cơ bản của tháp pháp sư.' },
      { name: 'Thông Thạo Bí Thuật', cost: 1, desc: 'Gia tăng tầm bắn của tháp phép thêm +12%.' },
      { name: 'Cường Hóa Phép', cost: 2, desc: 'Giảm 25% kháng phép của mục tiêu bị trúng đòn.' },
      { name: 'Băng Giảm Tốc', cost: 2, desc: 'Đòn đánh làm chậm 30% tốc độ chạy của quái trong 2s.' },
      { name: 'Ánh Sáng Khai Sáng', cost: 3, desc: 'Giảm 20% giá vàng xây dựng và nâng cấp tháp phép.' }
    ],
    artillery: [
      { name: 'Thuốc Nổ Tinh Chế', cost: 1, desc: 'Tăng 15% sát thương nổ của đạn đại bác.' },
      { name: 'Thấu Kính Tầm Xa', cost: 1, desc: 'Tăng tầm bắn của đại bác thêm +15%.' },
      { name: 'Hậu Cần Chiến Trường', cost: 2, desc: 'Giảm 20% chi phí vàng xây dựng tháp pháo.' },
      { name: 'Nổ Lan Thông Minh', cost: 2, desc: 'Gây 100% sát thương toàn bộ trong bán kính nổ.' },
      { name: 'Mặt Đất Rực Lửa', cost: 3, desc: 'Vụ nổ để lại tàn lửa thiêu đốt quái đi qua liên tục.' }
    ],
    rain: [
      { name: 'Bầu Trời Rực Lửa', cost: 1, desc: 'Tăng 30% sát thương của Mưa Thiên Thạch.' },
      { name: 'Thiêu Rụi Mặt Đất', cost: 1, desc: 'Mặt đất bốc cháy trong 6s gây sát thương liên tục.' },
      { name: 'Địa Ngục Lửa', cost: 2, desc: 'Tăng số lượng thiên thạch lên 8 quả và mở rộng bán kính.' },
      { name: 'Đại Hồng Thủy', cost: 2, desc: 'Giảm 15 giây thời gian hồi chiêu Mưa Thiên Thạch.' },
      { name: 'Ngày Tận Thế', cost: 3, desc: 'Gọi thêm các thiên thạch ngẫu nhiên rơi khắp chiến trường.' }
    ],
    reinforce: [
      { name: 'Chiến Binh Thiện Chiến', cost: 1, desc: 'Quân tiếp viện tăng +30% máu và +30% sát thương.' },
      { name: 'Trang Bị Giáp Sắt', cost: 1, desc: 'Lính tiếp viện được trang bị khiên sắt có 30% giáp.' },
      { name: 'Phóng Lao Tầm Xa', cost: 2, desc: 'Lính tiếp viện có thể phóng giáo hạ quái bay và quái từ xa.' },
      { name: 'Quân Đoàn Vệ Binh', cost: 2, desc: 'Tăng thêm +50% máu và sát thương cho lính tiếp viện.' },
      { name: 'Đội Tiên Phong Tinh Nhuệ', cost: 3, desc: 'Triệu hồi 3 chiến binh tinh nhuệ thay vì 2.' }
    ]
  },

  // ---------------- CÁC MÀN CHƠI CHIẾN DỊCH ----------------
  STAGES: [
    {
      id: 'stage_1',
      number: 1,
      name: 'Tiền Đồn Ven Biển (Southport)',
      subtitle: 'Vùng Đất Thanh Bình',
      startingGold: 400,
      lives: 20,
      bgTheme: 'grass',
      mapPos: { x: 180, y: 380 },
      description: 'Bảo vệ ngôi làng ven biển Southport thanh bình trước cuộc tập kích bất ngờ của bè lũ yêu tinh Goblin.',
      path: [
        { x: 40, y: 280 },
        { x: 260, y: 280 },
        { x: 380, y: 280 },
        { x: 520, y: 360 },
        { x: 680, y: 360 },
        { x: 820, y: 260 },
        { x: 960, y: 260 }
      ],
      towerPlots: [
        { id: 'p1', x: 200, y: 190 },
        { id: 'p2', x: 340, y: 190 },
        { id: 'p3', x: 300, y: 380 },
        { id: 'p4', x: 480, y: 260 },
        { id: 'p5', x: 600, y: 460 },
        { id: 'p6', x: 680, y: 260 },
        { id: 'p7', x: 780, y: 360 },
        { id: 'p8', x: 880, y: 170 }
      ],
      waves: [
        { waveNum: 1, enemies: [{ type: 'goblin', count: 8, interval: 1.2 }] },
        { waveNum: 2, enemies: [{ type: 'goblin', count: 12, interval: 1.0 }, { type: 'brigand', count: 3, interval: 2.0 }] },
        { waveNum: 3, enemies: [{ type: 'goblin', count: 15, interval: 0.8 }, { type: 'orc_champion', count: 4, interval: 2.5 }] },
        { waveNum: 4, enemies: [{ type: 'shadow_wolf', count: 6, interval: 1.2 }, { type: 'orc_champion', count: 6, interval: 2.0 }] },
        { waveNum: 5, enemies: [{ type: 'ogre', count: 2, interval: 4.0 }, { type: 'goblin', count: 20, interval: 0.7 }] },
        { waveNum: 6, enemies: [{ type: 'orc_champion', count: 10, interval: 1.5 }, { type: 'ogre', count: 4, interval: 3.5 }] }
      ]
    },
    {
      id: 'stage_2',
      number: 2,
      name: 'Đồi Ngoại Ô Pagras (The Pagras)',
      subtitle: 'Cửa Ngõ Thủ Phủ',
      startingGold: 450,
      lives: 20,
      bgTheme: 'grass_hill',
      mapPos: { x: 340, y: 310 },
      description: 'Những ngọn đồi cỏ xanh đang bị vây hãm. Cẩn thận với bầy quái bay Gargoyle trên bầu trời!',
      path: [
        { x: 40, y: 180 },
        { x: 300, y: 180 },
        { x: 420, y: 320 },
        { x: 340, y: 460 },
        { x: 580, y: 500 },
        { x: 740, y: 380 },
        { x: 960, y: 380 }
      ],
      towerPlots: [
        { id: 'p1', x: 180, y: 90 },
        { id: 'p2', x: 260, y: 270 },
        { id: 'p3', x: 380, y: 220 },
        { id: 'p4', x: 480, y: 390 },
        { id: 'p5', x: 420, y: 550 },
        { id: 'p6', x: 620, y: 400 },
        { id: 'p7', x: 700, y: 490 },
        { id: 'p8', x: 820, y: 290 },
        { id: 'p9', x: 860, y: 470 }
      ],
      waves: [
        { waveNum: 1, enemies: [{ type: 'goblin', count: 12, interval: 1.0 }] },
        { waveNum: 2, enemies: [{ type: 'brigand', count: 8, interval: 1.5 }, { type: 'gargoyle', count: 4, interval: 2.0 }] },
        { waveNum: 3, enemies: [{ type: 'orc_champion', count: 8, interval: 1.8 }, { type: 'gargoyle', count: 6, interval: 1.8 }] },
        { waveNum: 4, enemies: [{ type: 'shaman', count: 3, interval: 3.0 }, { type: 'orc_champion', count: 8, interval: 1.5 }] },
        { waveNum: 5, enemies: [{ type: 'shadow_wolf', count: 10, interval: 0.9 }, { type: 'ogre', count: 3, interval: 3.5 }] },
        { waveNum: 6, enemies: [{ type: 'gargoyle', count: 10, interval: 1.2 }, { type: 'shaman', count: 4, interval: 2.5 }, { type: 'ogre', count: 4, interval: 3.0 }] },
        { waveNum: 7, enemies: [{ type: 'orc_champion', count: 14, interval: 1.2 }, { type: 'ogre', count: 6, interval: 2.5 }] }
      ]
    },
    {
      id: 'stage_3',
      number: 3,
      name: 'Đèo Song Hà (Twin River Pass)',
      subtitle: 'Ngã Ba Sông Khốc Liệt',
      startingGold: 550,
      lives: 20,
      bgTheme: 'river',
      mapPos: { x: 500, y: 250 },
      description: 'Hai nhánh đường quái tấn công cùng đổ dồn về cây cầu duy nhất. Bố trí hỏa lực chéo thật chính xác!',
      multiPaths: [
        [
          { x: 40, y: 150 },
          { x: 350, y: 150 },
          { x: 520, y: 300 },
          { x: 700, y: 300 },
          { x: 960, y: 300 }
        ],
        [
          { x: 40, y: 480 },
          { x: 350, y: 480 },
          { x: 520, y: 300 },
          { x: 700, y: 300 },
          { x: 960, y: 300 }
        ]
      ],
      towerPlots: [
        { id: 'p1', x: 200, y: 70 },
        { id: 'p2', x: 240, y: 230 },
        { id: 'p3', x: 200, y: 560 },
        { id: 'p4', x: 240, y: 400 },
        { id: 'p5', x: 420, y: 220 },
        { id: 'p6', x: 420, y: 390 },
        { id: 'p7', x: 600, y: 220 },
        { id: 'p8', x: 600, y: 390 },
        { id: 'p9', x: 780, y: 220 },
        { id: 'p10', x: 780, y: 390 }
      ],
      waves: [
        { waveNum: 1, enemies: [{ type: 'goblin', count: 16, interval: 0.9, pathIndex: 0 }] },
        { waveNum: 2, enemies: [{ type: 'brigand', count: 10, interval: 1.2, pathIndex: 1 }, { type: 'goblin', count: 10, interval: 1.0, pathIndex: 0 }] },
        { waveNum: 3, enemies: [{ type: 'orc_champion', count: 8, interval: 1.5, pathIndex: 0 }, { type: 'orc_champion', count: 8, interval: 1.5, pathIndex: 1 }] },
        { waveNum: 4, enemies: [{ type: 'necromancer', count: 2, interval: 4.0, pathIndex: 0 }, { type: 'shaman', count: 3, interval: 3.0, pathIndex: 1 }] },
        { waveNum: 5, enemies: [{ type: 'gargoyle', count: 12, interval: 1.0, pathIndex: 0 }, { type: 'ogre', count: 4, interval: 3.0, pathIndex: 1 }] },
        { waveNum: 6, enemies: [{ type: 'mountain_troll', count: 2, interval: 5.0, pathIndex: 0 }, { type: 'ogre', count: 6, interval: 2.5, pathIndex: 1 }] },
        { waveNum: 7, enemies: [{ type: 'orc_champion', count: 15, interval: 1.0, pathIndex: 0 }, { type: 'necromancer', count: 4, interval: 3.0, pathIndex: 1 }] },
        { waveNum: 8, enemies: [{ type: 'boss_jt', count: 1, interval: 1.0, pathIndex: 0 }, { type: 'ogre', count: 6, interval: 3.0, pathIndex: 1 }] }
      ]
    },
    {
      id: 'stage_4',
      number: 4,
      name: 'Rừng Sồi Bạc (Silveroak Forest)',
      subtitle: 'Khu Rừng Ám Ảnh',
      startingGold: 600,
      lives: 20,
      bgTheme: 'dark_forest',
      mapPos: { x: 670, y: 190 },
      description: 'Khu rừng bị nguyền rủa đen tối đầy rẫy Pháp Sư Gọi Hồn và đàn Sói Bóng Đêm hung tợn.',
      path: [
        { x: 40, y: 350 },
        { x: 220, y: 350 },
        { x: 220, y: 160 },
        { x: 540, y: 160 },
        { x: 540, y: 450 },
        { x: 780, y: 450 },
        { x: 780, y: 250 },
        { x: 960, y: 250 }
      ],
      towerPlots: [
        { id: 'p1', x: 130, y: 260 },
        { id: 'p2', x: 300, y: 90 },
        { id: 'p3', x: 300, y: 250 },
        { id: 'p4', x: 460, y: 250 },
        { id: 'p5', x: 460, y: 390 },
        { id: 'p6', x: 620, y: 360 },
        { id: 'p7', x: 620, y: 530 },
        { id: 'p8', x: 700, y: 190 },
        { id: 'p9', x: 860, y: 350 }
      ],
      waves: [
        { waveNum: 1, enemies: [{ type: 'shadow_wolf', count: 12, interval: 0.8 }] },
        { waveNum: 2, enemies: [{ type: 'necromancer', count: 3, interval: 3.0 }, { type: 'orc_champion', count: 8, interval: 1.5 }] },
        { waveNum: 3, enemies: [{ type: 'gargoyle', count: 14, interval: 1.0 }, { type: 'shaman', count: 4, interval: 2.0 }] },
        { waveNum: 4, enemies: [{ type: 'mountain_troll', count: 3, interval: 4.0 }, { type: 'necromancer', count: 4, interval: 2.5 }] },
        { waveNum: 5, enemies: [{ type: 'shadow_wolf', count: 20, interval: 0.6 }, { type: 'ogre', count: 6, interval: 2.0 }] },
        { waveNum: 6, enemies: [{ type: 'mountain_troll', count: 5, interval: 3.0 }, { type: 'orc_champion', count: 15, interval: 1.0 }] }
      ]
    },
    {
      id: 'stage_5',
      number: 5,
      name: 'Thành Trì Linirea (Citadel)',
      subtitle: 'Hoàng Thành Bất Diệt',
      startingGold: 700,
      lives: 20,
      bgTheme: 'castle',
      mapPos: { x: 780, y: 380 },
      description: 'Hoàng thành của Đức Vua là thành trì cuối cùng của niềm hy vọng. Giữ vững cổng thành bằng mọi giá!',
      multiPaths: [
        [
          { x: 40, y: 200 },
          { x: 400, y: 200 },
          { x: 550, y: 320 },
          { x: 960, y: 320 }
        ],
        [
          { x: 40, y: 440 },
          { x: 400, y: 440 },
          { x: 550, y: 320 },
          { x: 960, y: 320 }
        ]
      ],
      towerPlots: [
        { id: 'p1', x: 180, y: 110 },
        { id: 'p2', x: 280, y: 280 },
        { id: 'p3', x: 180, y: 530 },
        { id: 'p4', x: 280, y: 360 },
        { id: 'p5', x: 460, y: 120 },
        { id: 'p6', x: 460, y: 520 },
        { id: 'p7', x: 620, y: 230 },
        { id: 'p8', x: 620, y: 410 },
        { id: 'p9', x: 750, y: 230 },
        { id: 'p10', x: 750, y: 410 }
      ],
      waves: [
        { waveNum: 1, enemies: [{ type: 'orc_champion', count: 12, interval: 1.0, pathIndex: 0 }, { type: 'orc_champion', count: 12, interval: 1.0, pathIndex: 1 }] },
        { waveNum: 2, enemies: [{ type: 'gargoyle', count: 16, interval: 0.9, pathIndex: 0 }, { type: 'shaman', count: 5, interval: 2.0, pathIndex: 1 }] },
        { waveNum: 3, enemies: [{ type: 'mountain_troll', count: 4, interval: 3.5, pathIndex: 0 }, { type: 'necromancer', count: 4, interval: 2.5, pathIndex: 1 }] },
        { waveNum: 4, enemies: [{ type: 'ogre', count: 8, interval: 2.0, pathIndex: 0 }, { type: 'ogre', count: 8, interval: 2.0, pathIndex: 1 }] },
        { waveNum: 5, enemies: [{ type: 'mountain_troll', count: 6, interval: 2.5, pathIndex: 0 }, { type: 'shadow_wolf', count: 20, interval: 0.5, pathIndex: 1 }] }
      ]
    },
    {
      id: 'stage_6',
      number: 6,
      name: 'Tháp Hắc Ám Vez\'nan',
      subtitle: 'Trận Chiến Định Đoạt',
      startingGold: 900,
      lives: 20,
      bgTheme: 'lava_nether',
      mapPos: { x: 880, y: 150 },
      description: 'Tiến vào lòng núi lửa dung nham và tiêu diệt Chúa Tể Vez\'nan trước khi hắn nuốt chửng vương quốc!',
      path: [
        { x: 40, y: 300 },
        { x: 260, y: 300 },
        { x: 260, y: 140 },
        { x: 500, y: 140 },
        { x: 500, y: 480 },
        { x: 740, y: 480 },
        { x: 740, y: 280 },
        { x: 960, y: 280 }
      ],
      towerPlots: [
        { id: 'p1', x: 160, y: 210 },
        { id: 'p2', x: 160, y: 390 },
        { id: 'p3', x: 360, y: 70 },
        { id: 'p4', x: 380, y: 250 },
        { id: 'p5', x: 420, y: 410 },
        { id: 'p6', x: 620, y: 170 },
        { id: 'p7', x: 620, y: 560 },
        { id: 'p8', x: 660, y: 390 },
        { id: 'p9', x: 820, y: 190 },
        { id: 'p10', x: 820, y: 390 }
      ],
      waves: [
        { waveNum: 1, enemies: [{ type: 'orc_champion', count: 15, interval: 0.8 }, { type: 'gargoyle', count: 10, interval: 1.0 }] },
        { waveNum: 2, enemies: [{ type: 'necromancer', count: 5, interval: 2.0 }, { type: 'shaman', count: 5, interval: 2.0 }] },
        { waveNum: 3, enemies: [{ type: 'mountain_troll', count: 6, interval: 2.5 }, { type: 'ogre', count: 8, interval: 1.8 }] },
        { waveNum: 4, enemies: [{ type: 'shadow_wolf', count: 25, interval: 0.4 }, { type: 'mountain_troll', count: 5, interval: 2.0 }] },
        { waveNum: 5, enemies: [{ type: 'boss_veznan', count: 1, interval: 1.0 }, { type: 'orc_champion', count: 20, interval: 0.8 }, { type: 'ogre', count: 10, interval: 2.0 }] }
      ]
    }
  ]
};
