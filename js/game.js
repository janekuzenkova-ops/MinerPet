// MinerPet - Game Logic

const Game = {
    // State
    state: {
        satoshi: 0,
        energy: 100,
        temperature: 30,
        level: 0,
        hashrate: 0,
        feedCooldown: 0,
        coolCooldown: 0
    },

    // Уровни прогрессии — эволюция робота
    levels: [
        { 
            id: 0, 
            name: 'start',
            nameRu: 'Старт', 
            nameEn: 'Start',
            price: 0,
            hashrate: 0,
            baseCooldown: 15,
            evolution: ''
        },
        { 
            id: 1, 
            name: 'baby',
            nameRu: 'Малыш', 
            nameEn: 'Baby',
            price: 100,
            hashrate: 50,
            baseCooldown: 15,
            evolution: 'evo-baby'
        },
        { 
            id: 2, 
            name: 'student',
            nameRu: 'Ученик', 
            nameEn: 'Student',
            price: 500,
            hashrate: 150,
            baseCooldown: 18,
            evolution: 'evo-antenna'
        },
        { 
            id: 3, 
            name: 'junior',
            nameRu: 'Юниор', 
            nameEn: 'Junior',
            price: 2000,
            hashrate: 400,
            baseCooldown: 20,
            evolution: 'evo-screen'
        },
        { 
            id: 4, 
            name: 'middle',
            nameRu: 'Мидл', 
            nameEn: 'Middle',
            price: 8000,
            hashrate: 1000,
            baseCooldown: 22,
            evolution: 'evo-arms'
        },
        { 
            id: 5, 
            name: 'senior',
            nameRu: 'Сеньор', 
            nameEn: 'Senior',
            price: 25000,
            hashrate: 2500,
            baseCooldown: 25,
            evolution: 'evo-wheels'
        },
        { 
            id: 6, 
            name: 'master',
            nameRu: 'Мастер', 
            nameEn: 'Master',
            price: 80000,
            hashrate: 6000,
            baseCooldown: 28,
            evolution: 'evo-cooler'
        },
        { 
            id: 7, 
            name: 'guru',
            nameRu: 'Гуру', 
            nameEn: 'Guru',
            price: 250000,
            hashrate: 15000,
            baseCooldown: 32,
            evolution: 'evo-wings'
        },
        { 
            id: 8, 
            name: 'legend',
            nameRu: 'ЛЕГЕНДА', 
            nameEn: 'LEGEND',
            price: 1000000,
            hashrate: 50000,
            baseCooldown: 40,
            evolution: 'evo-mega'
        }
    ],

    // Config
    config: {
        satoshiPerTH: 0.01,
        energyDrain: 0.15,       // энергия уходит за тик (было 0.5)
        tempIncrease: 0.2,       // температура растёт за тик при работе
        tempDecrease: 0.05,      // температура падает за тик без работы
        feedAmount: 25,          // +энергия за кормление
        coolAmount: 35,          // -температура за охлаждение
        overheatThreshold: 80,   // после этого эффективность падает
        criticalTemp: 95,        // после этого робот "болеет"
        tickInterval: 1000
    },

    // DOM elements cache
    els: {},

    // Initialize
    init() {
        this.cacheElements();
        this.loadState();
        this.render();
        this.updateRobotState();
        this.updateEnvironment();
        this.bindEvents();
        this.startLoop();
        this.startRandomAnimations();
        
        console.log('🤖 MinerPet initialized');
    },

    cacheElements() {
        this.els = {
            balance: document.getElementById('balance'),
            energyBar: document.getElementById('energy-bar'),
            energyValue: document.getElementById('energy-value'),
            tempBar: document.getElementById('temp-bar'),
            tempValue: document.getElementById('temp-value'),
            incomeRate: document.getElementById('income-rate'),
            feedBtn: document.getElementById('feed-btn'),
            coolBtn: document.getElementById('cool-btn'),
            feedCooldown: document.getElementById('feed-cooldown'),
            coolCooldown: document.getElementById('cool-cooldown'),
            upgradeBtn: document.getElementById('upgrade-btn'),
            upgradePrice: document.getElementById('upgrade-price'),
            levelName: document.getElementById('level-name'),
            minigameBtn: document.getElementById('minigame-btn'),
            thoughtBubble: document.getElementById('thought-bubble'),
            robot: document.getElementById('robot'),
            robotStatus: document.getElementById('robot-status'),
            environment: document.getElementById('environment')
        };
    },

    loadState() {
        const saved = localStorage.getItem('minerpet-state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
                const currentLevel = this.levels[this.state.level];
                this.state.hashrate = currentLevel ? currentLevel.hashrate : 0;
            } catch (e) {
                console.warn('Failed to load state:', e);
            }
        }
    },

    saveState() {
        localStorage.setItem('minerpet-state', JSON.stringify(this.state));
    },

    bindEvents() {
        this.els.feedBtn.addEventListener('click', () => this.feed());
        this.els.coolBtn.addEventListener('click', () => this.cool());
        this.els.upgradeBtn.addEventListener('click', () => this.upgrade());
        this.els.minigameBtn.addEventListener('click', () => this.openMiniGame());
        
        window.addEventListener('langchange', () => this.updateDynamicText());
    },

    openMiniGame() {
        if (window.MiniGame) {
            MiniGame.open();
        }
    },

    // Game loop
    startLoop() {
        setInterval(() => this.tick(), this.config.tickInterval);
    },

    tick() {
        // Cooldown countdown
        if (this.state.feedCooldown > 0) {
            this.state.feedCooldown--;
            this.updateCooldownUI('feed');
        }
        if (this.state.coolCooldown > 0) {
            this.state.coolCooldown--;
            this.updateCooldownUI('cool');
        }

        // Если уровень 0 или нет энергии — робот спит
        if (this.state.level === 0 || this.state.energy <= 0) {
            this.state.temperature = Math.max(30, this.state.temperature - this.config.tempDecrease);
            this.updateRobotState();
            this.render();
            this.saveState();
            return;
        }

        // Расход энергии
        this.state.energy = Math.max(0, this.state.energy - this.config.energyDrain);

        // Рост температуры при работе
        this.state.temperature = Math.min(100, this.state.temperature + this.config.tempIncrease);

        // Эффективность в зависимости от температуры
        let efficiency = 1;
        if (this.state.temperature > this.config.overheatThreshold) {
            efficiency = 1 - ((this.state.temperature - this.config.overheatThreshold) / 
                            (100 - this.config.overheatThreshold)) * 0.5;
        }
        if (this.state.temperature >= this.config.criticalTemp) {
            efficiency = 0.2;
        }

        // Доход
        const income = this.state.hashrate * this.config.satoshiPerTH * efficiency;
        this.state.satoshi += income;

        this.updateRobotState();
        this.render();
        this.saveState();
    },

    // Actions
    feed() {
        if (this.state.feedCooldown > 0) return;
        
        this.state.energy = Math.min(100, this.state.energy + this.config.feedAmount);
        this.state.feedCooldown = this.getCurrentCooldown();
        
        this.updateCooldownUI('feed');
        this.render();
        this.saveState();
        
        this.haptic('light');
        this.showHappy(); // Реакция радости при кормлении
    },

    cool() {
        if (this.state.coolCooldown > 0) return;
        
        const wasHot = this.state.temperature >= this.config.overheatThreshold;
        this.state.temperature = Math.max(30, this.state.temperature - this.config.coolAmount);
        this.state.coolCooldown = this.getCurrentCooldown();
        
        this.updateCooldownUI('cool');
        this.render();
        this.saveState();
        
        this.haptic('light');
        
        // Реакция облегчения после охлаждения
        if (wasHot) {
            this.showExcitedReaction();
        } else {
            this.showHappy();
        }
    },

    upgrade() {
        const nextLevel = this.getNextLevel();
        if (!nextLevel) return;
        
        if (this.state.satoshi >= nextLevel.price) {
            this.state.satoshi -= nextLevel.price;
            this.state.level = nextLevel.id;
            this.state.hashrate = nextLevel.hashrate;
            
            // Сброс энергии и температуры при апгрейде
            this.state.energy = 100;
            this.state.temperature = 30;
            
            this.render();
            this.updateRobotState();
            this.saveState();
            this.updateEnvironment();
            
            // Конфетти!
            if (window.Confetti) {
                Confetti.launch();
            }
            
            this.haptic('heavy');
            
            // Прыжок радости и глаза-сердечки!
            this.showJumpReaction();
            setTimeout(() => this.showLoveReaction(), 500);
            
            // Показать образовательный факт про апгрейд
            setTimeout(() => this.showUpgradeFact(), 1500);
        }
    },

    showUpgradeFact() {
        const bubble = this.els.thoughtBubble;
        const icon = bubble.querySelector('.thought-icon');
        
        // Случайная сторона
        const isLeftSide = Math.random() < 0.5;
        bubble.classList.toggle('left-side', isLeftSide);
        
        const fact = this.facts.upgrade[Math.floor(Math.random() * this.facts.upgrade.length)];
        icon.textContent = fact;
        bubble.classList.add('fact-mode', 'visible');
        
        clearTimeout(this.animationState.thoughtTimeout);
        this.animationState.thoughtTimeout = setTimeout(() => {
            bubble.classList.remove('visible', 'fact-mode', 'left-side');
        }, 4000);
    },

    getCurrentLevel() {
        return this.levels[this.state.level];
    },

    getNextLevel() {
        if (this.state.level >= this.levels.length - 1) return null;
        return this.levels[this.state.level + 1];
    },

    getCurrentCooldown() {
        const level = this.getCurrentLevel();
        return level ? level.baseCooldown : 15;
    },

    // Rendering
    render() {
        const { satoshi, energy, temperature, level } = this.state;
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();

        // Balance
        this.els.balance.textContent = Math.floor(satoshi).toLocaleString();

        // Energy bar
        this.els.energyBar.style.width = energy + '%';
        this.els.energyValue.textContent = Math.floor(energy) + '%';

        // Temperature bar
        this.els.tempBar.style.width = temperature + '%';
        this.els.tempValue.textContent = Math.floor(temperature) + '°C';
        
        // Temperature color
        this.els.tempBar.classList.remove('medium', 'high');
        if (temperature >= this.config.criticalTemp) {
            this.els.tempBar.classList.add('high');
        } else if (temperature >= this.config.overheatThreshold) {
            this.els.tempBar.classList.add('medium');
        }

        // Income rate
        let efficiency = 1;
        if (temperature > this.config.overheatThreshold) {
            efficiency = 1 - ((temperature - this.config.overheatThreshold) / 
                            (100 - this.config.overheatThreshold)) * 0.5;
        }
        const income = this.state.hashrate * this.config.satoshiPerTH * efficiency;
        this.els.incomeRate.textContent = '+' + income.toFixed(1);

        // Level name
        this.els.levelName.textContent = this.getLevelName(currentLevel);

        // Upgrade button
        if (nextLevel) {
            this.els.upgradePrice.textContent = this.formatPrice(nextLevel.price);
            this.els.upgradeBtn.disabled = satoshi < nextLevel.price;
            
            // На уровне 0 показываем "КУПИТЬ ASIC" вместо "АПГРЕЙД"
            const upgradeText = this.els.upgradeBtn.querySelector('[data-i18n="upgrade"], [data-i18n="buy-asic"]');
            if (upgradeText) {
                upgradeText.textContent = level === 0 ? t('buy-asic') : t('upgrade');
                upgradeText.dataset.i18n = level === 0 ? 'buy-asic' : 'upgrade';
            }
        } else {
            this.els.upgradeBtn.style.display = 'none';
        }

        // Feed/Cool buttons enabled state
        // На уровне 0 (нет ASIC'а) - кнопки заблокированы
        const isLevel0 = this.state.level === 0;
        this.els.feedBtn.disabled = isLevel0 || this.state.feedCooldown > 0;
        this.els.coolBtn.disabled = isLevel0 || this.state.coolCooldown > 0;
        
        // Добавляем класс для притушения статов на уровне 0
        document.getElementById('app').classList.toggle('no-asic', isLevel0);
    },

    updateCooldownUI(type) {
        const btn = type === 'feed' ? this.els.feedBtn : this.els.coolBtn;
        const cooldownEl = type === 'feed' ? this.els.feedCooldown : this.els.coolCooldown;
        const cooldown = type === 'feed' ? this.state.feedCooldown : this.state.coolCooldown;

        if (cooldown > 0) {
            btn.classList.add('on-cooldown');
            cooldownEl.textContent = cooldown + 's';
        } else {
            btn.classList.remove('on-cooldown');
            cooldownEl.textContent = '';
        }
    },

    updateRobotState() {
        const robot = this.els.robot;
        robot.classList.remove('working', 'overheating', 'sleeping', 'hot', 'hungry');
        
        let status = '';
        
        if (this.state.level === 0 || this.state.energy <= 0) {
            robot.classList.add('sleeping');
            status = this.state.level === 0 ? t('buy-first') : t('no-energy');
        } else if (this.state.temperature >= this.config.criticalTemp) {
            robot.classList.add('overheating');
            robot.classList.add('hot');
            status = t('overheating');
        } else if (this.state.temperature >= this.config.overheatThreshold) {
            robot.classList.add('working');
            robot.classList.add('hot');
            status = t('hot');
        } else {
            robot.classList.add('working');
            status = t('mining');
        }
        
        // Add hungry class when energy is low
        if (this.state.energy < 30 && this.state.level > 0) {
            robot.classList.add('hungry');
        }
        
        this.els.robotStatus.textContent = status;
        
        // Update need indicators
        this.updateNeedIndicators();
    },
    
    updateNeedIndicators() {
        // Эффекты теперь на самом роботе (flames, sweat, hunger-indicator)
        // Управляются через CSS классы .hot и .hungry
    },

    updateEnvironment() {
        const level = this.getCurrentLevel();
        const robot = this.els.robot;
        
        // Remove all evolution classes
        robot.classList.remove('evo-baby', 'evo-antenna', 'evo-screen', 'evo-arms', 'evo-wheels', 'evo-cooler', 'evo-wings', 'evo-mega');
        
        // Add current evolution class (cumulative - add all previous levels too)
        if (level && level.id > 0) {
            for (let i = 1; i <= level.id; i++) {
                const lvl = this.levels[i];
                if (lvl && lvl.evolution) {
                    robot.classList.add(lvl.evolution);
                }
            }
        }
    },

    getLevelName(level) {
        if (!level) return '';
        const lang = localStorage.getItem('minerpet-lang') || 'ru';
        return lang === 'ru' ? level.nameRu : level.nameEn;
    },

    formatPrice(price) {
        if (price >= 1000000) {
            return (price / 1000000).toFixed(1) + 'M сат';
        } else if (price >= 1000) {
            return (price / 1000).toFixed(0) + 'K сат';
        }
        return price + ' сат';
    },

    updateDynamicText() {
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();
        
        if (currentLevel) {
            this.els.levelName.textContent = this.getLevelName(currentLevel);
        }
        if (nextLevel) {
            this.els.upgradePrice.textContent = this.formatPrice(nextLevel.price);
        }
        this.updateRobotState();
    },

    haptic(style) {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
        }
    },

    // Public methods
    addSatoshi(amount) {
        this.state.satoshi += amount;
        this.render();
        this.saveState();
    },

    reset() {
        localStorage.removeItem('minerpet-state');
        location.reload();
    },

    // === ОБРАЗОВАТЕЛЬНЫЕ ФАКТЫ ===
    
    facts: {
        general: [
            "сатоши — это 0.00000001 BTC!",
            "сатоши назван в честь создателя биткоина",
            "1 биткоин = 100 000 000 сатоши",
            "хешрейт — моя скорость майнинга!",
            "TH/s = триллион хешей в секунду",
            "майнеры решают задачи для сети",
            "биткоин появился в 2009 году",
            "всего будет 21 млн биткоинов",
            "ASIC = специальный чип для майнинга",
            "блок биткоина находят каждые ~10 минут",
            "халвинг — награда уменьшается вдвое",
            "я считаю SHA-256 хеши!",
            "майнинг защищает сеть биткоина",
            "proof-of-work = доказательство работы",
            // новые простые факты для детей
            "биткоин — это цифровые деньги в интернете",
            "майнинг — как искать золото, но в компьютере!",
            "я решаю математические загадки весь день",
            "блокчейн — это длинная цепочка записей",
            "каждый блок помнит предыдущий блок",
            "никто не может подделать биткоин!",
            "биткоин можно отправить в любую страну",
            "переводы работают без банков",
            "я работаю 24 часа в сутки без перерыва!",
            "майнеры по всему миру — одна команда",
            "чем больше майнеров, тем безопаснее сеть",
            "биткоин нельзя напечатать, как обычные деньги",
            "создатель биткоина — загадочный Сатоши",
            "никто не знает, кто такой Сатоши!",
            "первая покупка за биткоин — 2 пиццы!",
            "за те пиццы заплатили 10 000 BTC",
            "хеш — это как отпечаток пальца для данных",
            "каждый хеш уникален и неповторим",
            "я угадываю числа миллиарды раз в секунду",
            "майнинг — это соревнование компьютеров",
            "кто первый решил задачу — получает награду",
            "сложность майнинга растёт со временем",
            "раньше майнить можно было на ноутбуке",
            "сейчас нужны специальные машины — ASIC'и",
            "ASIC создан только для майнинга",
            "в одном блоке тысячи транзакций",
            "транзакция — это перевод биткоинов",
            "комиссия за перевод идёт майнерам",
            "биткоин хранится в цифровом кошельке",
            "кошелёк защищён секретным ключом",
            "потерял ключ — потерял биткоины навсегда!",
            "биткоин работает без выходных",
            "майнинг-фермы — это комнаты с компьютерами",
            "фермы часто строят где холодно",
            "холод помогает охлаждать компьютеры бесплатно"
        ],
        hot: [
            "ох, жарко! ASIC'и греются до 80°C",
            "чем я холоднее, тем быстрее считаю",
            "перегрев снижает мой хешрейт!",
            "охлаждение — ключ к эффективности",
            "в дата-центрах нужны кондиционеры"
        ],
        hungry: [
            "энергия — моё топливо!",
            "майнинг потребляет много электричества",
            "без энергии я не могу считать хеши",
            "эффективность измеряется в J/TH",
            "дешёвое электричество = больше прибыли"
        ],
        upgrade: [
            "новые ASIC'и мощнее и эффективнее!",
            "каждое поколение быстрее предыдущего",
            "апгрейд = больше сатоши!"
        ]
    },

    // === СИСТЕМА АНИМАЦИЙ ===
    
    animationState: {
        currentEmotion: null,
        thoughtTimeout: null,
        emotionTimeout: null
    },

    startRandomAnimations() {
        // Случайные анимации каждые 3-8 секунд
        this.scheduleRandomAnimation();
    },

    scheduleRandomAnimation() {
        const delay = 5000; // каждые 5 секунд
        setTimeout(() => {
            this.playRandomAnimation();
            this.scheduleRandomAnimation();
        }, delay);
    },

    playRandomAnimation() {
        // Не играем анимации если робот в критическом состоянии
        if (this.state.level === 0 || this.state.energy <= 0) {
            this.showSleepyAnimation();
            return;
        }
        
        if (this.state.temperature >= this.config.criticalTemp) {
            return; // При перегреве уже есть свои анимации
        }

        const animations = [
            { weight: 3, fn: () => this.showThought() },
            { weight: 2, fn: () => this.showWink() },
            { weight: 2, fn: () => this.showLookAround() },
            { weight: 1, fn: () => this.showSurprised() },
            { weight: 1, fn: () => this.showHappy() },
            { weight: 1, fn: () => this.showBored() }
        ];

        // При cooldown — показываем скуку чаще
        if (this.state.feedCooldown > 0 || this.state.coolCooldown > 0) {
            animations.push({ weight: 3, fn: () => this.showBored() });
        }

        const totalWeight = animations.reduce((sum, a) => sum + a.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const anim of animations) {
            random -= anim.weight;
            if (random <= 0) {
                anim.fn();
                break;
            }
        }
    },

    showThought() {
        const bubble = this.els.thoughtBubble;
        const icon = bubble.querySelector('.thought-icon');
        
        // Случайная сторона (лево или право)
        const isLeftSide = Math.random() < 0.5;
        bubble.classList.toggle('left-side', isLeftSide);
        
        // 70% факты, 30% иконки
        const showFact = Math.random() < 0.7;
        
        if (showFact) {
            // Выбираем контекстный факт
            let factPool = [...this.facts.general];
            
            if (this.state.temperature >= this.config.overheatThreshold) {
                factPool = [...this.facts.hot, ...this.facts.general.slice(0, 5)];
            } else if (this.state.energy < 30) {
                factPool = [...this.facts.hungry, ...this.facts.general.slice(0, 5)];
            }
            
            const fact = factPool[Math.floor(Math.random() * factPool.length)];
            icon.textContent = fact;
            bubble.classList.add('fact-mode');
        } else {
            const thoughts = ['₿', '⚡', '💰', '🚀', '💎'];
            icon.textContent = thoughts[Math.floor(Math.random() * thoughts.length)];
            bubble.classList.remove('fact-mode');
        }
        
        bubble.classList.add('visible');
        
        clearTimeout(this.animationState.thoughtTimeout);
        this.animationState.thoughtTimeout = setTimeout(() => {
            bubble.classList.remove('visible', 'fact-mode', 'left-side');
        }, showFact ? 4000 : 2500); // Факты показываем дольше
    },

    showWink() {
        this.setEmotion('winking', 400);
    },

    showLookAround() {
        const robot = this.els.robot;
        
        robot.classList.add('looking-left');
        setTimeout(() => {
            robot.classList.remove('looking-left');
            robot.classList.add('looking-right');
            setTimeout(() => {
                robot.classList.remove('looking-right');
            }, 600);
        }, 600);
    },

    showSurprised() {
        this.setEmotion('surprised', 800);
    },

    showHappy() {
        this.setEmotion('happy', 1200);
    },

    showBored() {
        this.setEmotion('bored', 2000);
    },

    showSleepyAnimation() {
        this.setEmotion('sleepy', 3000);
    },

    setEmotion(emotion, duration) {
        const robot = this.els.robot;
        
        // Убираем предыдущую эмоцию
        this.clearEmotion();
        
        robot.classList.add(emotion);
        this.animationState.currentEmotion = emotion;
        
        clearTimeout(this.animationState.emotionTimeout);
        this.animationState.emotionTimeout = setTimeout(() => {
            robot.classList.remove(emotion);
            this.animationState.currentEmotion = null;
        }, duration);
    },

    clearEmotion() {
        const robot = this.els.robot;
        const emotions = ['winking', 'looking-left', 'looking-right', 'surprised', 'happy', 'bored', 'sleepy', 'excited', 'love'];
        emotions.forEach(e => robot.classList.remove(e));
        this.animationState.currentEmotion = null;
    },

    // Контекстные реакции
    showLoveReaction() {
        this.setEmotion('love', 1000);
    },

    showExcitedReaction() {
        this.setEmotion('excited', 1500);
    },

    showJumpReaction() {
        const robot = this.els.robot;
        robot.classList.add('jumping');
        setTimeout(() => {
            robot.classList.remove('jumping');
        }, 500);
    }
};

// Start game when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
    
    // Telegram WebApp integration
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
    }
});

// Expose for debugging
window.Game = Game;
