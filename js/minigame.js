// MinerPet - Match-3 Mini Game

const MiniGame = {
    config: {
        gridSize: 6,
        tileTypes: ['btc', 'block', 'hash', 'chip', 'bolt'],
        tileEmojis: {
            btc: 'B',
            block: '■',
            hash: '#',
            chip: '◆',
            bolt: '/'
        },
        gameDuration: 60,
        pointsPerMatch: 3,
        comboMultiplier: 1.3,
        minMatch: 3
    },

    state: {
        grid: [],
        selected: null,
        score: 0,
        combo: 0,
        timeLeft: 60,
        isPlaying: false,
        timerInterval: null,
        hintTimeout: null,
        hintedTiles: []
    },

    els: {},

    init() {
        this.createModal();
        this.cacheElements();
        this.bindEvents();
        console.log('🎮 MiniGame initialized');
    },

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'minigame-modal';
        modal.className = 'minigame-modal';
        modal.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title" data-i18n="minigame-title">Собери блок</div>
                    <button class="minigame-close" id="minigame-close">✕</button>
                </div>
                
                <div class="minigame-stats">
                    <div class="minigame-stat">
                        <span class="minigame-stat-value" id="minigame-score">0</span>
                        <span class="minigame-stat-label" data-i18n="score">очки</span>
                    </div>
                    <div class="minigame-stat timer">
                        <span class="minigame-stat-value" id="minigame-timer">60</span>
                        <span class="minigame-stat-label" data-i18n="seconds">сек</span>
                    </div>
                    <div class="minigame-stat">
                        <span class="minigame-stat-value" id="minigame-combo">x1</span>
                        <span class="minigame-stat-label">комбо</span>
                    </div>
                </div>

                <div class="minigame-grid" id="minigame-grid"></div>

                <div class="minigame-hint" data-i18n="minigame-hint">
                    Собирай 3+ в ряд!
                </div>

                <div class="minigame-overlay" id="minigame-start">
                    <div class="overlay-content">
                        <div class="overlay-icon">⛏️</div>
                        <div class="overlay-title" data-i18n="start-mining">Начать майнинг</div>
                        <div class="overlay-subtitle" data-i18n="collect-blocks">Собирай блоки, зарабатывай!</div>
                        <button class="overlay-btn" id="minigame-start-btn" data-i18n="start">СТАРТ</button>
                    </div>
                </div>

                <div class="minigame-overlay hidden" id="minigame-end">
                    <div class="overlay-content">
                        <div class="overlay-icon">🎉</div>
                        <div class="overlay-title" data-i18n="mining-complete">Майнинг завершён!</div>
                        <div class="overlay-reward">
                            <span data-i18n="earned">Заработано:</span>
                            <span class="reward-value" id="minigame-reward">0</span>
                            <span data-i18n="satoshi">сатоши</span>
                        </div>
                        <button class="overlay-btn" id="minigame-claim-btn" data-i18n="claim">ЗАБРАТЬ</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    cacheElements() {
        this.els = {
            modal: document.getElementById('minigame-modal'),
            grid: document.getElementById('minigame-grid'),
            score: document.getElementById('minigame-score'),
            timer: document.getElementById('minigame-timer'),
            combo: document.getElementById('minigame-combo'),
            closeBtn: document.getElementById('minigame-close'),
            startOverlay: document.getElementById('minigame-start'),
            endOverlay: document.getElementById('minigame-end'),
            startBtn: document.getElementById('minigame-start-btn'),
            claimBtn: document.getElementById('minigame-claim-btn'),
            reward: document.getElementById('minigame-reward')
        };
    },

    bindEvents() {
        this.els.closeBtn.addEventListener('click', () => this.close());
        this.els.startBtn.addEventListener('click', () => this.startGame());
        this.els.claimBtn.addEventListener('click', () => this.claimReward());
        this.els.modal.addEventListener('click', (e) => {
            if (e.target === this.els.modal) this.close();
        });
    },

    open() {
        this.els.modal.classList.add('active');
        this.resetGame();
        document.body.style.overflow = 'hidden';
        
        // Update i18n
        if (window.I18n) {
            I18n.updateUI();
        }
    },

    close() {
        if (this.state.isPlaying) return;
        this.els.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.stopTimer();
    },

    resetGame() {
        this.state = {
            grid: [],
            selected: null,
            score: 0,
            combo: 0,
            timeLeft: this.config.gameDuration,
            isPlaying: false,
            timerInterval: null,
            hintTimeout: null,
            hintedTiles: []
        };
        this.els.score.textContent = '0';
        this.els.timer.textContent = this.config.gameDuration;
        this.els.combo.textContent = 'x1';
        this.els.startOverlay.classList.remove('hidden');
        this.els.endOverlay.classList.add('hidden');
        this.generateGrid();
        this.renderGrid();
    },

    startGame() {
        this.state.isPlaying = true;
        this.els.startOverlay.classList.add('hidden');
        this.startTimer();
        this.resetHintTimer();
        this.haptic('medium');
    },

    startTimer() {
        this.state.timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this.els.timer.textContent = this.state.timeLeft;
            
            if (this.state.timeLeft <= 10) {
                this.els.timer.parentElement.classList.add('warning');
            }
            
            if (this.state.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    },

    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    },

    endGame() {
        this.stopTimer();
        this.clearHint();
        if (this.state.hintTimeout) {
            clearTimeout(this.state.hintTimeout);
        }
        this.state.isPlaying = false;
        this.els.reward.textContent = this.state.score;
        this.els.endOverlay.classList.remove('hidden');
        this.els.timer.parentElement.classList.remove('warning');
        this.haptic('success');
    },

    claimReward() {
        if (window.Game) {
            Game.addSatoshi(this.state.score);
        }
        
        // Трекинг для квестов
        if (window.Quests) {
            Quests.trackGame();
            window.QuestsUI?.updateTasksBadge();
        }
        
        this.els.modal.classList.remove('active');
        document.body.style.overflow = '';
    },

    generateGrid() {
        const { gridSize, tileTypes } = this.config;
        this.state.grid = [];
        
        for (let row = 0; row < gridSize; row++) {
            this.state.grid[row] = [];
            for (let col = 0; col < gridSize; col++) {
                let type;
                do {
                    type = tileTypes[Math.floor(Math.random() * tileTypes.length)];
                } while (this.wouldMatch(row, col, type));
                
                this.state.grid[row][col] = { type, row, col };
            }
        }
    },

    wouldMatch(row, col, type) {
        if (col >= 2) {
            if (this.state.grid[row][col-1]?.type === type && 
                this.state.grid[row][col-2]?.type === type) {
                return true;
            }
        }
        if (row >= 2) {
            if (this.state.grid[row-1]?.[col]?.type === type && 
                this.state.grid[row-2]?.[col]?.type === type) {
                return true;
            }
        }
        return false;
    },

    renderGrid() {
        const { gridSize, tileEmojis } = this.config;
        this.els.grid.innerHTML = '';
        this.els.grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const tile = this.state.grid[row][col];
                const el = document.createElement('div');
                el.className = 'minigame-tile';
                el.dataset.row = row;
                el.dataset.col = col;
                el.dataset.type = tile.type;
                el.textContent = tileEmojis[tile.type];
                
                el.addEventListener('click', () => this.onTileClick(row, col));
                
                this.els.grid.appendChild(el);
            }
        }
    },

    onTileClick(row, col) {
        if (!this.state.isPlaying) return;
        
        this.resetHintTimer();
        
        const { selected } = this.state;
        
        if (!selected) {
            this.state.selected = { row, col };
            this.highlightTile(row, col, true);
        } else {
            const isAdjacent = (
                (Math.abs(selected.row - row) === 1 && selected.col === col) ||
                (Math.abs(selected.col - col) === 1 && selected.row === row)
            );
            
            if (isAdjacent) {
                this.swapTiles(selected.row, selected.col, row, col);
            }
            
            this.highlightTile(selected.row, selected.col, false);
            this.state.selected = null;
        }
    },

    highlightTile(row, col, highlight) {
        const tile = this.els.grid.children[row * this.config.gridSize + col];
        if (tile) {
            tile.classList.toggle('selected', highlight);
        }
    },

    async swapTiles(r1, c1, r2, c2) {
        const temp = this.state.grid[r1][c1];
        this.state.grid[r1][c1] = this.state.grid[r2][c2];
        this.state.grid[r2][c2] = temp;
        
        this.state.grid[r1][c1].row = r1;
        this.state.grid[r1][c1].col = c1;
        this.state.grid[r2][c2].row = r2;
        this.state.grid[r2][c2].col = c2;
        
        const matches = this.findMatches();
        
        if (matches.length > 0) {
            this.renderGrid();
            await this.processMatches();
        } else {
            const temp2 = this.state.grid[r1][c1];
            this.state.grid[r1][c1] = this.state.grid[r2][c2];
            this.state.grid[r2][c2] = temp2;
            
            this.state.grid[r1][c1].row = r1;
            this.state.grid[r1][c1].col = c1;
            this.state.grid[r2][c2].row = r2;
            this.state.grid[r2][c2].col = c2;
            
            this.shakeTile(r1, c1);
            this.shakeTile(r2, c2);
        }
    },

    shakeTile(row, col) {
        const tile = this.els.grid.children[row * this.config.gridSize + col];
        if (tile) {
            tile.classList.add('shake');
            setTimeout(() => tile.classList.remove('shake'), 300);
        }
    },

    findMatches() {
        const { gridSize, minMatch } = this.config;
        const matches = [];
        const matchGroups = []; // Группы для подсчёта бонусов
        
        // Горизонтальные линии
        for (let row = 0; row < gridSize; row++) {
            let matchStart = 0;
            for (let col = 1; col <= gridSize; col++) {
                if (col < gridSize && 
                    this.state.grid[row][col].type === this.state.grid[row][matchStart].type) {
                    continue;
                }
                
                const matchLength = col - matchStart;
                if (matchLength >= minMatch) {
                    const group = [];
                    for (let i = matchStart; i < col; i++) {
                        matches.push({ row, col: i });
                        group.push({ row, col: i });
                    }
                    matchGroups.push({ length: matchLength, tiles: group, direction: 'horizontal' });
                }
                matchStart = col;
            }
        }
        
        // Вертикальные линии
        for (let col = 0; col < gridSize; col++) {
            let matchStart = 0;
            for (let row = 1; row <= gridSize; row++) {
                if (row < gridSize && 
                    this.state.grid[row][col].type === this.state.grid[matchStart][col].type) {
                    continue;
                }
                
                const matchLength = row - matchStart;
                if (matchLength >= minMatch) {
                    const group = [];
                    for (let i = matchStart; i < row; i++) {
                        matches.push({ row: i, col });
                        group.push({ row: i, col });
                    }
                    matchGroups.push({ length: matchLength, tiles: group, direction: 'vertical' });
                }
                matchStart = row;
            }
        }
        
        // Уникальные плитки
        const unique = [];
        const seen = new Set();
        for (const m of matches) {
            const key = `${m.row},${m.col}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(m);
            }
        }
        
        // Сохраняем группы для подсчёта бонусов
        this.lastMatchGroups = matchGroups;
        
        return unique;
    },

    async processMatches() {
        let hasMatches = true;
        
        while (hasMatches) {
            const matches = this.findMatches();
            
            if (matches.length === 0) {
                hasMatches = false;
                this.state.combo = 0;
                this.els.combo.textContent = 'x1';
                continue;
            }
            
            this.state.combo++;
            const comboMultiplier = Math.pow(this.config.comboMultiplier, this.state.combo - 1);
            this.els.combo.textContent = `x${comboMultiplier.toFixed(1)}`;
            
            // Подсчёт очков с бонусами за длинные линии
            let points = 0;
            const groups = this.lastMatchGroups || [];
            
            for (const group of groups) {
                let groupPoints = group.length * this.config.pointsPerMatch;
                
                // Бонусы за длинные линии
                if (group.length === 4) {
                    groupPoints *= 1.5; // +50% за 4 в ряд
                } else if (group.length >= 5) {
                    groupPoints *= 2.5; // +150% за 5+ в ряд
                }
                
                points += groupPoints;
            }
            
            // Проверка на L-образные или T-образные (пересечение линий)
            const hasIntersection = groups.length >= 2 && 
                groups.some(g1 => groups.some(g2 => 
                    g1 !== g2 && g1.direction !== g2.direction &&
                    g1.tiles.some(t1 => g2.tiles.some(t2 => t1.row === t2.row && t1.col === t2.col))
                ));
            
            if (hasIntersection) {
                points *= 1.5; // +50% бонус за L/T-образные
            }
            
            points = Math.floor(points * comboMultiplier);
            this.state.score += points;
            this.els.score.textContent = this.state.score;
            
            for (const m of matches) {
                const tile = this.els.grid.children[m.row * this.config.gridSize + m.col];
                if (tile) {
                    tile.classList.add('matched');
                    this.createMatchParticles(tile);
                }
            }
            
            // Show score popup
            // Определяем тип бонуса для отображения
            let bonusType = null;
            const maxLength = groups.length > 0 ? Math.max(...groups.map(g => g.length)) : 3;
            if (hasIntersection) {
                bonusType = 'L-COMBO!';
            } else if (maxLength >= 5) {
                bonusType = 'SUPER!';
            } else if (maxLength === 4) {
                bonusType = 'BONUS!';
            }
            
            this.showScorePopup(points, matches[0], bonusType);
            
            this.haptic('light');
            
            await this.delay(200);
            
            for (const m of matches) {
                this.state.grid[m.row][m.col] = null;
            }
            
            this.dropTiles();
            this.fillEmpty();
            this.renderGrid();
            
            await this.delay(150);
        }
        
        // Проверяем есть ли доступные ходы
        if (!this.hasValidMoves()) {
            await this.shuffleGrid();
        }
    },

    dropTiles() {
        const { gridSize } = this.config;
        
        for (let col = 0; col < gridSize; col++) {
            let emptyRow = gridSize - 1;
            
            for (let row = gridSize - 1; row >= 0; row--) {
                if (this.state.grid[row][col] !== null) {
                    if (row !== emptyRow) {
                        this.state.grid[emptyRow][col] = this.state.grid[row][col];
                        this.state.grid[emptyRow][col].row = emptyRow;
                        this.state.grid[row][col] = null;
                    }
                    emptyRow--;
                }
            }
        }
    },

    fillEmpty() {
        const { gridSize, tileTypes } = this.config;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (this.state.grid[row][col] === null) {
                    const type = tileTypes[Math.floor(Math.random() * tileTypes.length)];
                    this.state.grid[row][col] = { type, row, col };
                }
            }
        }
    },

    // Проверка есть ли доступные ходы
    hasValidMoves() {
        const { gridSize } = this.config;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                // Проверяем свап вправо
                if (col < gridSize - 1) {
                    if (this.wouldCreateMatch(row, col, row, col + 1)) {
                        return true;
                    }
                }
                // Проверяем свап вниз
                if (row < gridSize - 1) {
                    if (this.wouldCreateMatch(row, col, row + 1, col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    // Проверка создаст ли свап матч
    wouldCreateMatch(r1, c1, r2, c2) {
        // Временно меняем местами
        const temp = this.state.grid[r1][c1];
        this.state.grid[r1][c1] = this.state.grid[r2][c2];
        this.state.grid[r2][c2] = temp;
        
        const matches = this.findMatches();
        
        // Возвращаем обратно
        this.state.grid[r2][c2] = this.state.grid[r1][c1];
        this.state.grid[r1][c1] = temp;
        
        return matches.length > 0;
    },

    // Перемешивание сетки
    async shuffleGrid() {
        if (!this.state.isPlaying) return;
        
        // Показываем сообщение
        this.showShuffleMessage();
        
        await this.delay(500);
        
        // Собираем все типы плиток
        const types = [];
        const { gridSize } = this.config;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                types.push(this.state.grid[row][col].type);
            }
        }
        
        // Перемешиваем (Fisher-Yates)
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }
        
        // Применяем новые типы
        let idx = 0;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                this.state.grid[row][col].type = types[idx++];
            }
        }
        
        this.renderGrid();
        
        // Если всё ещё нет ходов — перемешиваем снова
        if (!this.hasValidMoves()) {
            await this.shuffleGrid();
        }
    },

    showShuffleMessage() {
        const msg = document.createElement('div');
        msg.className = 'shuffle-message';
        msg.textContent = 'SHUFFLE!';
        this.els.grid.appendChild(msg);
        
        setTimeout(() => msg.remove(), 800);
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    resetHintTimer() {
        this.clearHint();
        if (this.state.hintTimeout) {
            clearTimeout(this.state.hintTimeout);
        }
        if (this.state.isPlaying) {
            this.state.hintTimeout = setTimeout(() => this.showHint(), 3000);
        }
    },

    clearHint() {
        for (const pos of this.state.hintedTiles) {
            const tile = this.els.grid.children[pos.row * this.config.gridSize + pos.col];
            if (tile) {
                tile.classList.remove('hint');
            }
        }
        this.state.hintedTiles = [];
    },

    showHint() {
        const move = this.findPossibleMove();
        if (move) {
            this.state.hintedTiles = [move.from, move.to];
            for (const pos of this.state.hintedTiles) {
                const tile = this.els.grid.children[pos.row * this.config.gridSize + pos.col];
                if (tile) {
                    tile.classList.add('hint');
                }
            }
        }
    },

    findPossibleMove() {
        const { gridSize } = this.config;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (col < gridSize - 1) {
                    if (this.wouldMatchAfterSwap(row, col, row, col + 1)) {
                        return { from: {row, col}, to: {row, col: col + 1} };
                    }
                }
                if (row < gridSize - 1) {
                    if (this.wouldMatchAfterSwap(row, col, row + 1, col)) {
                        return { from: {row, col}, to: {row: row + 1, col} };
                    }
                }
            }
        }
        return null;
    },

    wouldMatchAfterSwap(r1, c1, r2, c2) {
        const temp = this.state.grid[r1][c1];
        this.state.grid[r1][c1] = this.state.grid[r2][c2];
        this.state.grid[r2][c2] = temp;
        
        const matches = this.findMatches();
        
        const temp2 = this.state.grid[r1][c1];
        this.state.grid[r1][c1] = this.state.grid[r2][c2];
        this.state.grid[r2][c2] = temp2;
        
        return matches.length > 0;
    },

    haptic(type) {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            if (type === 'success') {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            } else {
                window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
            }
        }
    },
    
    createMatchParticles(tile) {
        const rect = tile.getBoundingClientRect();
        const gridRect = this.els.grid.getBoundingClientRect();
        const x = rect.left - gridRect.left + rect.width / 2;
        const y = rect.top - gridRect.top + rect.height / 2;
        
        const colors = ['#FCD34D', '#C4B5FD', '#93C5FD', '#86EFAC', '#FCA5A5', '#FDE68A'];
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'match-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            this.els.grid.appendChild(particle);
            
            setTimeout(() => particle.remove(), 600);
        }
    },
    
    showScorePopup(points, position, bonusType) {
        const tile = this.els.grid.children[position.row * this.config.gridSize + position.col];
        if (!tile) return;
        
        const rect = tile.getBoundingClientRect();
        const gridRect = this.els.grid.getBoundingClientRect();
        
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        
        // Добавляем бонус если есть
        if (bonusType) {
            popup.classList.add('bonus');
            popup.innerHTML = `<span class="bonus-text">${bonusType}</span><br>+${points}`;
        } else {
            popup.textContent = '+' + points;
        }
        
        popup.style.left = (rect.left - gridRect.left + rect.width / 2 - 20) + 'px';
        popup.style.top = (rect.top - gridRect.top) + 'px';
        
        this.els.grid.appendChild(popup);
        
        setTimeout(() => popup.remove(), bonusType ? 1200 : 800);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MiniGame.init();
});

window.MiniGame = MiniGame;
