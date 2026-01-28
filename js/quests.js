// MinerPet - Quests & Achievements System

const Quests = {
    // === СОСТОЯНИЕ ===
    state: {
        quizAnswered: [],      // ID отвеченных вопросов
        dailyTasks: {},        // Прогресс ежедневных заданий
        achievements: [],      // Полученные достижения
        lastDailyReset: null,  // Дата последнего сброса
        stats: {               // Статистика для достижений
            totalFed: 0,
            totalCooled: 0,
            totalSatoshi: 0,
            gamesPlayed: 0,
            hotCools: 0,       // Охлаждений при >80°C
            daysPlayed: 0
        }
    },

    // === ВИКТОРИНА ПРО КРИПТУ ===
    quizQuestions: [
        // Уровень 1-2 (легкие)
        {
            id: 'q1',
            level: 1,
            question: 'Что такое сатоши?',
            questionEn: 'What is satoshi?',
            answers: ['Японская еда', 'Наименьшая часть биткоина', 'Криптобиржа'],
            answersEn: ['Japanese food', 'Smallest unit of Bitcoin', 'Crypto exchange'],
            correct: 1,
            reward: 25
        },
        {
            id: 'q2',
            level: 1,
            question: 'Сколько сатоши в 1 биткоине?',
            questionEn: 'How many satoshi in 1 Bitcoin?',
            answers: ['1 миллион', '100 миллионов', '1 тысяча'],
            answersEn: ['1 million', '100 million', '1 thousand'],
            correct: 1,
            reward: 25
        },
        {
            id: 'q3',
            level: 1,
            question: 'Что делает ASIC-майнер?',
            questionEn: 'What does an ASIC miner do?',
            answers: ['Охлаждает комнату', 'Добывает криптовалюту', 'Играет в игры'],
            answersEn: ['Cools the room', 'Mines cryptocurrency', 'Plays games'],
            correct: 1,
            reward: 25
        },
        {
            id: 'q4',
            level: 2,
            question: 'В каком году появился биткоин?',
            questionEn: 'What year was Bitcoin created?',
            answers: ['2005', '2009', '2015'],
            answersEn: ['2005', '2009', '2015'],
            correct: 1,
            reward: 35
        },
        {
            id: 'q5',
            level: 2,
            question: 'Что такое халвинг?',
            questionEn: 'What is halving?',
            answers: ['Удвоение награды', 'Уменьшение награды вдвое', 'Разделение блокчейна'],
            answersEn: ['Doubling the reward', 'Cutting reward in half', 'Splitting blockchain'],
            correct: 1,
            reward: 40
        },
        {
            id: 'q6',
            level: 2,
            question: 'Кто создал биткоин?',
            questionEn: 'Who created Bitcoin?',
            answers: ['Илон Маск', 'Сатоши Накамото', 'Виталик Бутерин'],
            answersEn: ['Elon Musk', 'Satoshi Nakamoto', 'Vitalik Buterin'],
            correct: 1,
            reward: 35
        },
        // Уровень 3-4 (средние)
        {
            id: 'q7',
            level: 3,
            question: 'Что такое блокчейн?',
            questionEn: 'What is blockchain?',
            answers: ['Игра', 'Цепочка блоков с данными', 'Тип компьютера'],
            answersEn: ['A game', 'Chain of data blocks', 'Type of computer'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q8',
            level: 3,
            question: 'Что означает "proof of work"?',
            questionEn: 'What does "proof of work" mean?',
            answers: ['Справка с работы', 'Доказательство работы', 'Рабочий прототип'],
            answersEn: ['Work certificate', 'Proof of work done', 'Work prototype'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q9',
            level: 3,
            question: 'Как часто происходит халвинг биткоина?',
            questionEn: 'How often does Bitcoin halving occur?',
            answers: ['Каждый год', 'Примерно каждые 4 года', 'Каждый месяц'],
            answersEn: ['Every year', 'Approximately every 4 years', 'Every month'],
            correct: 1,
            reward: 55
        },
        {
            id: 'q10',
            level: 4,
            question: 'Что такое хешрейт?',
            questionEn: 'What is hashrate?',
            answers: ['Курс биткоина', 'Скорость майнинга', 'Размер блока'],
            answersEn: ['Bitcoin price', 'Mining speed', 'Block size'],
            correct: 1,
            reward: 65
        },
        {
            id: 'q11',
            level: 4,
            question: 'Сколько биткоинов будет всего?',
            questionEn: 'How many Bitcoins will exist in total?',
            answers: ['Бесконечно', '21 миллион', '100 миллионов'],
            answersEn: ['Infinite', '21 million', '100 million'],
            correct: 1,
            reward: 65
        },
        // Уровень 5+ (сложные)
        {
            id: 'q12',
            level: 5,
            question: 'Какой алгоритм использует биткоин?',
            questionEn: 'What algorithm does Bitcoin use?',
            answers: ['SHA-256', 'MD5', 'RSA'],
            answersEn: ['SHA-256', 'MD5', 'RSA'],
            correct: 0,
            reward: 80
        },
        {
            id: 'q13',
            level: 5,
            question: 'Что такое мемпул?',
            questionEn: 'What is mempool?',
            answers: ['Бассейн с мемами', 'Очередь неподтверждённых транзакций', 'Тип кошелька'],
            answersEn: ['Pool of memes', 'Queue of unconfirmed transactions', 'Wallet type'],
            correct: 1,
            reward: 80
        },
        {
            id: 'q14',
            level: 6,
            question: 'Через сколько блоков происходит халвинг?',
            questionEn: 'After how many blocks does halving occur?',
            answers: ['100,000', '210,000', '500,000'],
            answersEn: ['100,000', '210,000', '500,000'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q15',
            level: 6,
            question: 'Что такое difficulty adjustment?',
            questionEn: 'What is difficulty adjustment?',
            answers: ['Настройка сложности игры', 'Автоподстройка сложности майнинга', 'Изменение цены'],
            answersEn: ['Game difficulty setting', 'Auto-adjustment of mining difficulty', 'Price change'],
            correct: 1,
            reward: 100
        }
    ],

    // === ЕЖЕДНЕВНЫЕ ЗАДАНИЯ ===
    // Задания обновляются каждые 2 часа
    tasksTemplate: [
        // Кормление
        { id: 'feed1', nameRu: 'Накорми робота', nameEn: 'Feed robot once', target: 1, reward: 80, type: 'feed' },
        { id: 'feed3', nameRu: 'Накорми робота 3 раза', nameEn: 'Feed robot 3 times', target: 3, reward: 100, type: 'feed' },
        { id: 'feed5', nameRu: 'Накорми робота 5 раз', nameEn: 'Feed robot 5 times', target: 5, reward: 150, type: 'feed' },
        { id: 'feed10', nameRu: 'Накорми робота 10 раз', nameEn: 'Feed robot 10 times', target: 10, reward: 250, type: 'feed' },
        
        // Охлаждение
        { id: 'cool1', nameRu: 'Охлади робота', nameEn: 'Cool robot once', target: 1, reward: 80, type: 'cool' },
        { id: 'cool2', nameRu: 'Охлади робота 2 раза', nameEn: 'Cool robot 2 times', target: 2, reward: 100, type: 'cool' },
        { id: 'cool5', nameRu: 'Охлади робота 5 раз', nameEn: 'Cool robot 5 times', target: 5, reward: 150, type: 'cool' },
        { id: 'cool10', nameRu: 'Охлади робота 10 раз', nameEn: 'Cool robot 10 times', target: 10, reward: 250, type: 'cool' },
        
        // Критическое охлаждение
        { id: 'hotcool1', nameRu: 'Охлади при >80°C', nameEn: 'Cool when >80°C', target: 1, reward: 120, type: 'hotcool' },
        { id: 'hotcool3', nameRu: 'Охлади при >80°C 3 раза', nameEn: 'Cool when >80°C 3 times', target: 3, reward: 200, type: 'hotcool' },
        
        // Мини-игры
        { id: 'game1', nameRu: 'Сыграй в мини-игру', nameEn: 'Play mini-game', target: 1, reward: 100, type: 'game' },
        { id: 'game2', nameRu: 'Сыграй 2 мини-игры', nameEn: 'Play 2 mini-games', target: 2, reward: 180, type: 'game' },
        { id: 'game3', nameRu: 'Сыграй 3 мини-игры', nameEn: 'Play 3 mini-games', target: 3, reward: 280, type: 'game' },
        
        // Заработок
        { id: 'earn25', nameRu: 'Заработай 25 сатоши', nameEn: 'Earn 25 satoshi', target: 25, reward: 80, type: 'earn' },
        { id: 'earn50', nameRu: 'Заработай 50 сатоши', nameEn: 'Earn 50 satoshi', target: 50, reward: 100, type: 'earn' },
        { id: 'earn100', nameRu: 'Заработай 100 сатоши', nameEn: 'Earn 100 satoshi', target: 100, reward: 150, type: 'earn' },
        { id: 'earn200', nameRu: 'Заработай 200 сатоши', nameEn: 'Earn 200 satoshi', target: 200, reward: 250, type: 'earn' },
        { id: 'earn500', nameRu: 'Заработай 500 сатоши', nameEn: 'Earn 500 satoshi', target: 500, reward: 400, type: 'earn' },
        
        // Викторина
        { id: 'quiz1', nameRu: 'Ответь на вопрос', nameEn: 'Answer a question', target: 1, reward: 100, type: 'quiz' },
        { id: 'quiz2', nameRu: 'Ответь на 2 вопроса', nameEn: 'Answer 2 questions', target: 2, reward: 180, type: 'quiz' },
        
        // Комбо действия
        { id: 'feedcool', nameRu: 'Накорми и охлади', nameEn: 'Feed and cool', target: 2, reward: 120, type: 'combo' },
        { id: 'active5', nameRu: 'Сделай 5 действий', nameEn: 'Do 5 actions', target: 5, reward: 100, type: 'actions' },
        { id: 'active10', nameRu: 'Сделай 10 действий', nameEn: 'Do 10 actions', target: 10, reward: 180, type: 'actions' },
        { id: 'active20', nameRu: 'Сделай 20 действий', nameEn: 'Do 20 actions', target: 20, reward: 300, type: 'actions' },
        
        // Поддержание состояния
        { id: 'keepwarm', nameRu: 'Не дай перегреться 5 мин', nameEn: 'Keep cool for 5 min', target: 1, reward: 150, type: 'keepcool' },
        { id: 'keepfed', nameRu: 'Держи энергию >50%', nameEn: 'Keep energy >50%', target: 1, reward: 150, type: 'keepfed' },
        
        // Время в игре
        { id: 'online2', nameRu: 'Играй 2 минуты', nameEn: 'Play for 2 minutes', target: 120, reward: 80, type: 'online' },
        { id: 'online5', nameRu: 'Играй 5 минут', nameEn: 'Play for 5 minutes', target: 300, reward: 150, type: 'online' }
    ],

    // === ДОСТИЖЕНИЯ ===
    achievementsList: [
        { id: 'first_asic', nameRu: 'Первый ASIC', nameEn: 'First ASIC', descRu: 'Купи первый ASIC', descEn: 'Buy first ASIC', reward: 100, icon: '🎉' },
        { id: 'sat_1000', nameRu: 'Тысячник', nameEn: 'Thousander', descRu: 'Накопи 1000 сатоши', descEn: 'Save 1000 satoshi', reward: 200, icon: '💰' },
        { id: 'sat_10000', nameRu: 'Богач', nameEn: 'Rich', descRu: 'Накопи 10000 сатоши', descEn: 'Save 10000 satoshi', reward: 1000, icon: '🤑' },
        { id: 'sat_100000', nameRu: 'Магнат', nameEn: 'Magnate', descRu: 'Накопи 100000 сатоши', descEn: 'Save 100000 satoshi', reward: 5000, icon: '👑' },
        { id: 'level_3', nameRu: 'Юниор', nameEn: 'Junior', descRu: 'Достигни уровня Юниор', descEn: 'Reach Junior level', reward: 400, icon: '⭐' },
        { id: 'level_5', nameRu: 'Сеньор', nameEn: 'Senior', descRu: 'Достигни уровня Сеньор', descEn: 'Reach Senior level', reward: 2000, icon: '🌟' },
        { id: 'level_8', nameRu: 'Легенда', nameEn: 'Legend', descRu: 'Достигни уровня ЛЕГЕНДА', descEn: 'Reach LEGEND level', reward: 15000, icon: '🏆' },
        { id: 'feed_50', nameRu: 'Кормилец', nameEn: 'Feeder', descRu: 'Накорми 50 раз', descEn: 'Feed 50 times', reward: 200, icon: '⚡' },
        { id: 'cool_50', nameRu: 'Ледяной', nameEn: 'Ice Cold', descRu: 'Охлади 50 раз', descEn: 'Cool 50 times', reward: 200, icon: '❄️' },
        { id: 'quiz_5', nameRu: 'Знаток', nameEn: 'Expert', descRu: 'Ответь на 5 вопросов', descEn: 'Answer 5 questions', reward: 150, icon: '🧠' },
        { id: 'quiz_all', nameRu: 'Профессор', nameEn: 'Professor', descRu: 'Ответь на все вопросы', descEn: 'Answer all questions', reward: 1000, icon: '🎓' },
        { id: 'games_10', nameRu: 'Игрок', nameEn: 'Gamer', descRu: 'Сыграй 10 мини-игр', descEn: 'Play 10 mini-games', reward: 300, icon: '🎮' }
    ],

    // === СЛУЧАЙНЫЕ СОБЫТИЯ ===
    randomEvents: [
        { 
            id: 'bull_run', 
            nameRu: '🚀 Бычий рынок!', 
            nameEn: '🚀 Bull Run!',
            descRu: 'Доход x2 на 60 секунд!',
            descEn: 'Income x2 for 60 seconds!',
            duration: 60000,
            effect: 'income_x2'
        },
        {
            id: 'heat_wave',
            nameRu: '🌡️ Жара!',
            nameEn: '🌡️ Heat Wave!',
            descRu: 'Робот греется быстрее, но +50% дохода!',
            descEn: 'Robot heats faster, but +50% income!',
            duration: 45000,
            effect: 'heat_bonus'
        },
        {
            id: 'energy_sale',
            nameRu: '⚡ Скидка на энергию!',
            nameEn: '⚡ Energy Sale!',
            descRu: 'Кормление даёт +50% энергии!',
            descEn: 'Feeding gives +50% energy!',
            duration: 30000,
            effect: 'feed_bonus'
        },
        {
            id: 'lucky_block',
            nameRu: '🍀 Удачный блок!',
            nameEn: '🍀 Lucky Block!',
            descRu: 'Бонус +25 сатоши!',
            descEn: 'Bonus +25 satoshi!',
            duration: 0,
            effect: 'instant_bonus',
            bonus: 25
        }
    ],

    // === АКТИВНОЕ СОБЫТИЕ ===
    activeEvent: null,
    eventTimeout: null,

    // === ИНИЦИАЛИЗАЦИЯ ===
    init() {
        this.loadState();
        this.checkTasksReset();
        this.startEventTimer();
        console.log('🎯 Quests system initialized');
    },

    loadState() {
        const saved = localStorage.getItem('minerpet-quests');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
            } catch (e) {
                console.warn('Failed to load quests state:', e);
            }
        }
    },

    saveState() {
        localStorage.setItem('minerpet-quests', JSON.stringify(this.state));
    },

    // === ВИКТОРИНА ===
    getAvailableQuestion() {
        const level = window.Game?.state?.level || 1;
        const available = this.quizQuestions.filter(q => 
            !this.state.quizAnswered.includes(q.id) && q.level <= Math.max(1, level)
        );
        if (available.length === 0) return null;
        return available[Math.floor(Math.random() * available.length)];
    },

    answerQuestion(questionId, answerIndex) {
        const question = this.quizQuestions.find(q => q.id === questionId);
        if (!question) return { correct: false, reward: 0 };

        const correct = question.correct === answerIndex;

        if (correct) {
            this.state.quizAnswered.push(questionId);
            this.trackQuiz(); // Трекаем для заданий
            this.checkAchievements();
            return { correct: true, reward: question.reward };
        }

        return { correct: false, reward: 0 };
    },

    // Проверка завершения всех вопросов текущего уровня
    checkLevelComplete() {
        const level = window.Game?.state?.level || 1;
        const levelQuestions = this.quizQuestions.filter(q => q.level <= level);
        const answeredCount = levelQuestions.filter(q => 
            this.state.quizAnswered.includes(q.id)
        ).length;
        
        return answeredCount >= levelQuestions.length;
    },

    // Бонус за прохождение уровня (500 + 200 за каждый уровень)
    getLevelBonus() {
        const level = window.Game?.state?.level || 1;
        return 500 + (level - 1) * 200;
    },

    // Проверка есть ли ещё вопросы на текущем уровне
    hasMoreQuestions() {
        return this.getAvailableQuestion() !== null;
    },

    // === ЕЖЕДНЕВНЫЕ ЗАДАНИЯ ===
    // Проверка сброса заданий каждые 2 часа
    checkTasksReset() {
        const now = Date.now();
        const twoHours = 2 * 60 * 60 * 1000; // 2 часа в мс
        const lastReset = this.state.lastTasksReset || 0;
        
        if (now - lastReset >= twoHours) {
            this.resetTasks();
            this.state.lastTasksReset = now;
            this.state.stats.daysPlayed++;
            this.saveState();
        }
    },

    // Время до следующего сброса заданий (в секундах)
    getTimeUntilReset() {
        const now = Date.now();
        const twoHours = 2 * 60 * 60 * 1000;
        const lastReset = this.state.lastTasksReset || 0;
        const nextReset = lastReset + twoHours;
        return Math.max(0, Math.floor((nextReset - now) / 1000));
    },

    resetTasks() {
        // Выбираем 3 случайных задания
        const shuffled = [...this.tasksTemplate].sort(() => Math.random() - 0.5);
        const newTasks = shuffled.slice(0, 3);

        this.state.dailyTasks = {};
        newTasks.forEach(task => {
            this.state.dailyTasks[task.id] = {
                ...task,
                progress: 0,
                completed: false,
                claimed: false
            };
        });
        
        // Сбрасываем бонус за задания
        this.state.tasksBonusClaimed = false;
    },

    getTodayTasks() {
        return Object.values(this.state.dailyTasks);
    },

    updateTaskProgress(type, amount = 1) {
        let updated = false;
        Object.values(this.state.dailyTasks).forEach(task => {
            if (task.type === type && !task.completed) {
                task.progress = Math.min(task.progress + amount, task.target);
                if (task.progress >= task.target) {
                    task.completed = true;
                }
                updated = true;
            }
        });
        if (updated) this.saveState();
        return updated;
    },

    claimTaskReward(taskId) {
        const task = this.state.dailyTasks[taskId];
        if (task && task.completed && !task.claimed) {
            task.claimed = true;
            this.saveState();
            return task.reward;
        }
        return 0;
    },

    // Проверка все ли задания выполнены и забраны
    allTasksClaimed() {
        const tasks = Object.values(this.state.dailyTasks);
        if (tasks.length === 0) return false;
        return tasks.every(t => t.claimed);
    },

    // Бонус за выполнение всех заданий (300 + 100 за каждый уровень)
    getDailyBonus() {
        const level = window.Game?.state?.level || 1;
        return 300 + (level - 1) * 100;
    },

    // Проверка получен ли уже бонус за текущий цикл заданий
    isTasksBonusClaimed() {
        return this.state.tasksBonusClaimed === true;
    },

    // Отметить бонус как полученный
    claimTasksBonus() {
        this.state.tasksBonusClaimed = true;
        this.saveState();
        return this.getDailyBonus();
    },

    // === ДОСТИЖЕНИЯ ===
    checkAchievements() {
        const newAchievements = [];
        
        this.achievementsList.forEach(ach => {
            if (this.state.achievements.includes(ach.id)) return;
            
            let earned = false;
            const gameState = window.Game?.state;
            
            switch (ach.id) {
                case 'first_asic':
                    earned = gameState?.level >= 1;
                    break;
                case 'sat_1000':
                    earned = this.state.stats.totalSatoshi >= 1000;
                    break;
                case 'sat_10000':
                    earned = this.state.stats.totalSatoshi >= 10000;
                    break;
                case 'sat_100000':
                    earned = this.state.stats.totalSatoshi >= 100000;
                    break;
                case 'level_3':
                    earned = gameState?.level >= 3;
                    break;
                case 'level_5':
                    earned = gameState?.level >= 5;
                    break;
                case 'level_8':
                    earned = gameState?.level >= 8;
                    break;
                case 'feed_50':
                    earned = this.state.stats.totalFed >= 50;
                    break;
                case 'cool_50':
                    earned = this.state.stats.totalCooled >= 50;
                    break;
                case 'quiz_5':
                    earned = this.state.quizAnswered.length >= 5;
                    break;
                case 'quiz_all':
                    earned = this.state.quizAnswered.length >= this.quizQuestions.length;
                    break;
                case 'games_10':
                    earned = this.state.stats.gamesPlayed >= 10;
                    break;
            }
            
            if (earned) {
                this.state.achievements.push(ach.id);
                newAchievements.push(ach);
            }
        });
        
        if (newAchievements.length > 0) {
            this.saveState();
        }
        
        return newAchievements;
    },

    getAchievement(id) {
        return this.achievementsList.find(a => a.id === id);
    },

    // === СЛУЧАЙНЫЕ СОБЫТИЯ ===
    startEventTimer() {
        // Событие каждые 2-5 минут (только если уровень >= 2)
        const scheduleNext = () => {
            const delay = 120000 + Math.random() * 180000; // 2-5 минут
            this.eventTimeout = setTimeout(() => {
                if (window.Game?.state?.level >= 2 && !this.activeEvent) {
                    this.triggerRandomEvent();
                }
                scheduleNext();
            }, delay);
        };
        scheduleNext();
    },

    triggerRandomEvent() {
        const event = this.randomEvents[Math.floor(Math.random() * this.randomEvents.length)];
        this.activeEvent = { ...event, startTime: Date.now() };
        
        // Показать баннер
        if (window.QuestsUI) {
            QuestsUI.showEvent(event);
        }
        
        if (event.duration > 0) {
            setTimeout(() => {
                this.activeEvent = null;
            }, event.duration);
        } else {
            // Мгновенный бонус
            if (event.effect === 'instant_bonus' && window.Game) {
                window.Game.addSatoshi(event.bonus);
            }
            this.activeEvent = null;
        }
        
        return event;
    },

    getActiveEvent() {
        return this.activeEvent;
    },

    // === СТАТИСТИКА ===
    trackFeed() {
        this.state.stats.totalFed++;
        this.updateTaskProgress('feed');
        this.updateTaskProgress('combo'); // для комбо-заданий
        this.updateTaskProgress('actions'); // для заданий на действия
        this.checkAchievements();
        this.saveState();
    },

    trackCool(wasHot) {
        this.state.stats.totalCooled++;
        this.updateTaskProgress('cool');
        this.updateTaskProgress('combo'); // для комбо-заданий
        this.updateTaskProgress('actions'); // для заданий на действия
        if (wasHot) {
            this.state.stats.hotCools++;
            this.updateTaskProgress('hotcool');
        }
        this.checkAchievements();
        this.saveState();
    },

    trackEarning(amount) {
        this.state.stats.totalSatoshi += amount;
        this.updateTaskProgress('earn', amount);
        this.checkAchievements();
        this.saveState();
    },

    trackGame() {
        this.state.stats.gamesPlayed++;
        this.updateTaskProgress('game');
        this.updateTaskProgress('actions'); // для заданий на действия
        this.checkAchievements();
        this.saveState();
    },

    trackQuiz() {
        this.updateTaskProgress('quiz');
        this.updateTaskProgress('actions');
        this.saveState();
    },

    trackOnlineTime(seconds) {
        this.updateTaskProgress('online', seconds);
        this.saveState();
    },

    // === ЭФФЕКТЫ СОБЫТИЙ ===
    getIncomeMultiplier() {
        if (!this.activeEvent) return 1;
        if (this.activeEvent.effect === 'income_x2') return 2;
        if (this.activeEvent.effect === 'heat_bonus') return 1.5;
        return 1;
    },

    getFeedBonus() {
        if (this.activeEvent?.effect === 'feed_bonus') return 1.5;
        return 1;
    },

    getHeatMultiplier() {
        if (this.activeEvent?.effect === 'heat_bonus') return 1.5;
        return 1;
    }
};

// === UI КОНТРОЛЛЕР ===
const QuestsUI = {
    els: {},

    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateUI();
        Quests.init();
        
        // Скрыть кнопки на уровне < 2
        this.checkLevelVisibility();
    },

    cacheElements() {
        this.els = {
            quizBtn: document.getElementById('quiz-btn'),
            tasksBtn: document.getElementById('tasks-btn'),
            tasksBadge: document.getElementById('tasks-badge'),
            quizModal: document.getElementById('quiz-modal'),
            tasksModal: document.getElementById('tasks-modal'),
            quizClose: document.getElementById('quiz-close'),
            tasksClose: document.getElementById('tasks-close'),
            quizQuestion: document.getElementById('quiz-question'),
            quizAnswers: document.getElementById('quiz-answers'),
            quizResult: document.getElementById('quiz-result'),
            quizReward: document.getElementById('quiz-reward'),
            quizNextBtn: document.getElementById('quiz-next-btn'),
            dailyTasksList: document.getElementById('daily-tasks-list'),
            achievementsList: document.getElementById('achievements-list'),
            eventBanner: document.getElementById('event-banner'),
            eventText: document.getElementById('event-text'),
            eventTimer: document.getElementById('event-timer'),
            achievementPopup: document.getElementById('achievement-popup'),
            achPopupIcon: document.getElementById('ach-popup-icon'),
            achPopupName: document.getElementById('ach-popup-name'),
            achPopupReward: document.getElementById('ach-popup-reward')
        };
    },

    bindEvents() {
        // Quiz
        this.els.quizBtn?.addEventListener('click', () => this.openQuiz());
        this.els.quizClose?.addEventListener('click', () => this.closeQuiz());
        this.els.quizModal?.addEventListener('click', (e) => {
            if (e.target === this.els.quizModal) this.closeQuiz();
        });
        this.els.quizNextBtn?.addEventListener('click', () => this.nextQuestion());

        // Tasks
        this.els.tasksBtn?.addEventListener('click', () => this.openTasks());
        this.els.tasksClose?.addEventListener('click', () => this.closeTasks());
        this.els.tasksModal?.addEventListener('click', (e) => {
            if (e.target === this.els.tasksModal) this.closeTasks();
        });

        // Tabs
        document.querySelectorAll('.tasks-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
    },

    checkLevelVisibility() {
        // Показываем квесты сразу с 0 уровня
        if (this.els.quizBtn) {
            this.els.quizBtn.classList.remove('hidden');
        }
        if (this.els.tasksBtn) {
            this.els.tasksBtn.classList.remove('hidden');
        }
    },

    updateUI() {
        this.updateTasksBadge();
        this.checkLevelVisibility();
    },

    updateTasksBadge() {
        const tasks = Quests.getTodayTasks();
        const completedNotClaimed = tasks.filter(t => t.completed && !t.claimed).length;
        
        if (this.els.tasksBadge) {
            if (completedNotClaimed > 0) {
                this.els.tasksBadge.textContent = completedNotClaimed;
                this.els.tasksBadge.classList.add('active');
            } else {
                this.els.tasksBadge.classList.remove('active');
            }
        }
    },

    // === QUIZ ===
    openQuiz() {
        const question = Quests.getAvailableQuestion();
        
        if (!question) {
            this.showNoQuestions();
            return;
        }

        this.currentQuestion = question;
        const lang = I18n?.currentLang || 'ru';
        
        this.els.quizQuestion.textContent = lang === 'ru' ? question.question : question.questionEn;
        this.els.quizReward.textContent = '+' + question.reward + ' сат';
        this.els.quizResult.classList.remove('visible', 'correct', 'wrong');
        this.els.quizAnswers.innerHTML = '';

        const answers = lang === 'ru' ? question.answers : question.answersEn;
        answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-answer';
            btn.textContent = answer;
            btn.addEventListener('click', () => this.selectAnswer(index));
            this.els.quizAnswers.appendChild(btn);
        });

        this.els.quizModal.classList.add('active');
    },

    showNoQuestions() {
        const lang = I18n?.currentLang || 'ru';
        this.els.quizQuestion.innerHTML = `
            <div class="quiz-empty">
                <div class="quiz-empty-icon">🎓</div>
                ${lang === 'ru' ? 'Ты ответил на все вопросы!<br>Новые появятся на следующем уровне.' : 'You answered all questions!<br>New ones will appear at the next level.'}
            </div>
        `;
        this.els.quizAnswers.innerHTML = '';
        this.els.quizReward.textContent = '—';
        this.els.quizResult.classList.remove('visible');
        this.els.quizModal.classList.add('active');
    },

    selectAnswer(index) {
        if (!this.currentQuestion) return;

        const result = Quests.answerQuestion(this.currentQuestion.id, index);
        const buttons = this.els.quizAnswers.querySelectorAll('.quiz-answer');
        
        buttons.forEach((btn, i) => {
            btn.style.pointerEvents = 'none';
            if (i === this.currentQuestion.correct) {
                btn.classList.add('correct');
            } else if (i === index && !result.correct) {
                btn.classList.add('wrong');
            }
        });

        const lang = I18n?.currentLang || 'ru';
        if (result.correct) {
            this.els.quizResult.textContent = lang === 'ru' ? '✓ Правильно!' : '✓ Correct!';
            this.els.quizResult.classList.add('visible', 'correct');
            
            if (window.Game) {
                Game.addSatoshi(result.reward);
            }
            
            // Haptic
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else {
            this.els.quizResult.textContent = lang === 'ru' ? '✗ Неправильно' : '✗ Wrong';
            this.els.quizResult.classList.add('visible', 'wrong');
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }
        }

        // Показываем кнопку
        if (Quests.hasMoreQuestions()) {
            this.els.quizNextBtn.textContent = lang === 'ru' ? 'Следующий вопрос →' : 'Next question →';
        } else {
            // Все вопросы уровня пройдены — показываем бонус
            const bonus = Quests.getLevelBonus();
            this.els.quizNextBtn.textContent = lang === 'ru' ? `🎉 Забрать бонус +${bonus} сат` : `🎉 Claim bonus +${bonus} sat`;
        }
        this.els.quizNextBtn.classList.add('visible');
    },

    nextQuestion() {
        const lang = I18n?.currentLang || 'ru';
        
        // Если вопросы закончились — выдаём бонус
        if (!Quests.hasMoreQuestions()) {
            const bonus = Quests.getLevelBonus();
            if (window.Game) {
                Game.addSatoshi(bonus);
            }
            this.closeQuiz();
            return;
        }
        
        // Открываем следующий вопрос
        this.els.quizNextBtn.classList.remove('visible');
        this.openQuiz();
    },

    closeQuiz() {
        this.els.quizModal.classList.remove('active');
        this.els.quizNextBtn?.classList.remove('visible');
        this.currentQuestion = null;
    },

    // === TASKS ===
    openTasks() {
        this.renderDailyTasks();
        this.renderAchievements();
        this.els.tasksModal.classList.add('active');
    },

    closeTasks() {
        this.els.tasksModal.classList.remove('active');
    },

    switchTab(tab) {
        document.querySelectorAll('.tasks-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        
        this.els.dailyTasksList.classList.toggle('hidden', tab !== 'daily');
        this.els.achievementsList.classList.toggle('hidden', tab !== 'achievements');
    },

    renderDailyTasks() {
        const tasks = Quests.getTodayTasks();
        const lang = I18n?.currentLang || 'ru';

        let html = tasks.map(task => {
            const percent = Math.min(100, (task.progress / task.target) * 100);
            const name = lang === 'ru' ? task.nameRu : task.nameEn;

            return `
                <div class="task-item">
                    <div class="task-header">
                        <span class="task-name">${name}</span>
                        <span class="task-reward">+${task.reward}</span>
                    </div>
                    <div class="task-progress-bar">
                        <div class="task-progress-fill ${task.completed ? 'complete' : ''}" style="width: ${percent}%"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 6px; color: var(--gray);">${task.progress}/${task.target}</span>
                        <button class="task-claim ${task.claimed ? 'claimed' : ''}"
                                data-task="${task.id}"
                                ${!task.completed || task.claimed ? 'disabled' : ''}>
                            ${task.claimed ? (lang === 'ru' ? 'ПОЛУЧЕНО' : 'CLAIMED') : (lang === 'ru' ? 'ЗАБРАТЬ' : 'CLAIM')}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Показываем таймер до следующего сброса
        const timeLeft = Quests.getTimeUntilReset();
        const hours = Math.floor(timeLeft / 3600);
        const mins = Math.floor((timeLeft % 3600) / 60);
        const timeStr = `${hours}ч ${mins}м`;

        html += `
            <div class="tasks-timer">
                ⏱️ ${lang === 'ru' ? 'Новые задания через' : 'New tasks in'}: ${timeStr}
            </div>
        `;

        // Показываем бонус если все задания забраны
        if (Quests.allTasksClaimed() && !Quests.isTasksBonusClaimed()) {
            const bonus = Quests.getDailyBonus();
            html += `
                <div class="daily-bonus-block">
                    <div class="daily-bonus-title">🎉 ${lang === 'ru' ? 'Все задания выполнены!' : 'All tasks complete!'}</div>
                    <button class="daily-bonus-btn" id="claim-daily-bonus">
                        ${lang === 'ru' ? 'Забрать бонус' : 'Claim bonus'} +${bonus} сат
                    </button>
                </div>
            `;
        } else if (Quests.isTasksBonusClaimed()) {
            html += `
                <div class="daily-bonus-block claimed">
                    <div class="daily-bonus-title">✓ ${lang === 'ru' ? 'Бонус получен!' : 'Bonus claimed!'}</div>
                </div>
            `;
        }

        this.els.dailyTasksList.innerHTML = html;

        // Bind claim buttons
        this.els.dailyTasksList.querySelectorAll('.task-claim').forEach(btn => {
            btn.addEventListener('click', () => {
                const reward = Quests.claimTaskReward(btn.dataset.task);
                if (reward > 0 && window.Game) {
                    Game.addSatoshi(reward);
                    this.renderDailyTasks();
                    this.updateTasksBadge();

                    if (window.Telegram?.WebApp?.HapticFeedback) {
                        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                    }
                }
            });
        });

        // Bind daily bonus button
        const bonusBtn = document.getElementById('claim-daily-bonus');
        if (bonusBtn) {
            bonusBtn.addEventListener('click', () => {
                const bonus = Quests.claimTasksBonus();
                if (window.Game) {
                    Game.addSatoshi(bonus);
                    this.renderDailyTasks();

                    if (window.Telegram?.WebApp?.HapticFeedback) {
                        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                    }
                }
            });
        }
    },

    renderAchievements() {
        const lang = I18n?.currentLang || 'ru';
        
        this.els.achievementsList.innerHTML = Quests.achievementsList.map(ach => {
            const unlocked = Quests.state.achievements.includes(ach.id);
            const name = lang === 'ru' ? ach.nameRu : ach.nameEn;
            const desc = lang === 'ru' ? ach.descRu : ach.descEn;
            
            return `
                <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="ach-icon">${unlocked ? ach.icon : '🔒'}</div>
                    <div class="ach-info">
                        <div class="ach-name">${name}</div>
                        <div class="ach-desc">${desc}</div>
                    </div>
                    <div class="ach-reward">${unlocked ? '✓' : '+' + ach.reward}</div>
                </div>
            `;
        }).join('');
    },

    // === ACHIEVEMENT POPUP ===
    showAchievementPopup(achievement) {
        const lang = I18n?.currentLang || 'ru';
        
        this.els.achPopupIcon.textContent = achievement.icon;
        this.els.achPopupName.textContent = lang === 'ru' ? achievement.nameRu : achievement.nameEn;
        this.els.achPopupReward.textContent = '+' + achievement.reward;
        
        this.els.achievementPopup.classList.add('visible');
        
        // Начисляем награду
        if (window.Game) {
            Game.addSatoshi(achievement.reward);
        }
        
        // Конфетти!
        if (window.Confetti) {
            Confetti.launch();
        }
        
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }

        setTimeout(() => {
            this.els.achievementPopup.classList.remove('visible');
        }, 3000);
    },

    // === EVENTS ===
    showEvent(event) {
        const lang = I18n?.currentLang || 'ru';
        
        this.els.eventText.textContent = lang === 'ru' ? event.descRu : event.descEn;
        this.els.eventBanner.classList.add('active');
        
        if (event.duration > 0) {
            let remaining = Math.ceil(event.duration / 1000);
            this.els.eventTimer.textContent = remaining + 's';
            
            const interval = setInterval(() => {
                remaining--;
                if (remaining <= 0) {
                    clearInterval(interval);
                    this.els.eventBanner.classList.remove('active');
                } else {
                    this.els.eventTimer.textContent = remaining + 's';
                }
            }, 1000);
        } else {
            this.els.eventTimer.textContent = '';
            setTimeout(() => {
                this.els.eventBanner.classList.remove('active');
            }, 3000);
        }
        
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
        }
    }
};

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    QuestsUI.init();
});

// Экспорт
window.Quests = Quests;
window.QuestsUI = QuestsUI;
