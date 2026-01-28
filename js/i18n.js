// MinerPet - Internationalization

const I18n = {
    currentLang: 'ru',
    
    strings: {
        ru: {
            'energy': 'ЭНЕРГИЯ',
            'temperature': 'ТЕМП.',
            'satoshi': 'сатоши',
            'income': 'Доход:',
            'feed': 'КОРМИТЬ',
            'cool': 'ОХЛАДИТЬ',
            'minigame': 'МИНИ-ИГРА',
            'upgrade': 'АПГРЕЙД',
            'buy-asic': 'КУПИТЬ ASIC',
            'level': 'Уровень:',
            'mining': 'Майнит...',
            'hot': 'Горячо!',
            'overheating': 'ПЕРЕГРЕВ!',
            'no-energy': 'Нет энергии',
            'buy-first': 'Купи ASIC!',
            // Minigame
            'minigame-title': 'Собери блок',
            'score': 'очки',
            'seconds': 'сек',
            'minigame-hint': 'Собирай 3+ в ряд!',
            'start-mining': 'Начать майнинг',
            'collect-blocks': 'Собирай блоки, зарабатывай!',
            'start': 'СТАРТ',
            'mining-complete': 'Майнинг завершён!',
            'earned': 'Заработано:',
            'claim': 'ЗАБРАТЬ'
        },
        en: {
            'energy': 'ENERGY',
            'temperature': 'TEMP.',
            'satoshi': 'satoshi',
            'income': 'Income:',
            'feed': 'FEED',
            'cool': 'COOL',
            'minigame': 'MINI-GAME',
            'upgrade': 'UPGRADE',
            'buy-asic': 'BUY ASIC',
            'level': 'Level:',
            'mining': 'Mining...',
            'hot': 'Hot!',
            'overheating': 'OVERHEAT!',
            'no-energy': 'No energy',
            'buy-first': 'Buy ASIC!',
            // Minigame
            'minigame-title': 'Build Block',
            'score': 'score',
            'seconds': 'sec',
            'minigame-hint': 'Match 3+ in a row!',
            'start-mining': 'Start Mining',
            'collect-blocks': 'Collect blocks, earn satoshi!',
            'start': 'START',
            'mining-complete': 'Mining Complete!',
            'earned': 'Earned:',
            'claim': 'CLAIM'
        }
    },

    init() {
        const saved = localStorage.getItem('minerpet-lang');
        if (saved) {
            this.currentLang = saved;
        }
        this.updateUI();
        this.bindEvents();
    },

    bindEvents() {
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => this.toggleLang());
        }
    },

    toggleLang() {
        this.currentLang = this.currentLang === 'ru' ? 'en' : 'ru';
        localStorage.setItem('minerpet-lang', this.currentLang);
        this.updateUI();
        
        // Notify game
        window.dispatchEvent(new Event('langchange'));
    },

    updateUI() {
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.textContent = this.currentLang === 'ru' ? 'EN' : 'RU';
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.strings[this.currentLang][key]) {
                el.textContent = this.strings[this.currentLang][key];
            }
        });
    },

    t(key) {
        return this.strings[this.currentLang][key] || key;
    }
};

// Global translate function
function t(key) {
    return I18n.t(key);
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});

window.I18n = I18n;
