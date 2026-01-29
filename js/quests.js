// MinerPet - Quests & Achievements System

const Quests = {
    // === СОСТОЯНИЕ ===
    state: {
        // Викторина (обновляется каждый час)
        currentQuizQuestions: [],  // 3 текущих вопроса
        quizAnswered: [],          // ID отвеченных вопросов в текущем цикле
        quizErrors: 0,             // Количество ошибок в текущем цикле
        lastQuizReset: null,       // Время последнего сброса викторины
        quizBonusClaimed: false,   // Получен ли бонус за все 3
        
        // Задания (обновляются каждые 2 часа)
        dailyTasks: {},            // Прогресс ежедневных заданий
        lastTasksReset: null,      // Время последнего сброса заданий
        tasksBonusClaimed: false,  // Получен ли бонус за все задания
        
        // Общее
        achievements: [],          // Полученные достижения
        lastDailyReset: null,      // Дата последнего сброса (legacy)
        stats: {                   // Статистика для достижений
            totalFed: 0,
            totalCooled: 0,
            totalSatoshi: 0,
            gamesPlayed: 0,
            hotCools: 0,           // Охлаждений при >80°C
            daysPlayed: 0
        }
    },

    // === ВИКТОРИНА ПРО КРИПТУ ===
    // Викторина обновляется каждый час, показывает 3 случайных вопроса
    // difficulty: 1 (легкий), 2 (средний), 3 (сложный)
    quizQuestions: [
        // === ЛЕГКИЕ ВОПРОСЫ (difficulty: 1) - Базовые понятия ===
        {
            id: 'q1',
            difficulty: 1,
            question: 'Что такое сатоши?',
            questionEn: 'What is satoshi?',
            answers: ['Японская еда', 'Наименьшая часть биткоина', 'Криптобиржа'],
            answersEn: ['Japanese food', 'Smallest unit of Bitcoin', 'Crypto exchange'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q2',
            difficulty: 1,
            question: 'Сколько сатоши в 1 биткоине?',
            questionEn: 'How many satoshi in 1 Bitcoin?',
            answers: ['1 миллион', '100 миллионов', '1 тысяча'],
            answersEn: ['1 million', '100 million', '1 thousand'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q3',
            difficulty: 1,
            question: 'Что делает ASIC-майнер?',
            questionEn: 'What does an ASIC miner do?',
            answers: ['Охлаждает комнату', 'Добывает криптовалюту', 'Играет в игры'],
            answersEn: ['Cools the room', 'Mines cryptocurrency', 'Plays games'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q4',
            difficulty: 1,
            question: 'В каком году появился биткоин?',
            questionEn: 'What year was Bitcoin created?',
            answers: ['2005', '2009', '2015'],
            answersEn: ['2005', '2009', '2015'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q5',
            difficulty: 1,
            question: 'Кто создал биткоин?',
            questionEn: 'Who created Bitcoin?',
            answers: ['Илон Маск', 'Сатоши Накамото', 'Виталик Бутерин'],
            answersEn: ['Elon Musk', 'Satoshi Nakamoto', 'Vitalik Buterin'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q6',
            difficulty: 1,
            question: 'Что такое криптовалюта?',
            questionEn: 'What is cryptocurrency?',
            answers: ['Секретный код', 'Цифровые деньги', 'Вид игры'],
            answersEn: ['Secret code', 'Digital money', 'Type of game'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q7',
            difficulty: 1,
            question: 'Где хранятся биткоины?',
            questionEn: 'Where are bitcoins stored?',
            answers: ['В банке', 'В кошельке (wallet)', 'На флешке'],
            answersEn: ['In a bank', 'In a wallet', 'On a flash drive'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q8',
            difficulty: 1,
            question: 'Что такое майнинг?',
            questionEn: 'What is mining?',
            answers: ['Копание ямы', 'Добыча криптовалюты', 'Покупка биткоинов'],
            answersEn: ['Digging a hole', 'Mining cryptocurrency', 'Buying bitcoins'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q9',
            difficulty: 1,
            question: 'Можно ли разделить биткоин?',
            questionEn: 'Can Bitcoin be divided?',
            answers: ['Нет, только целиком', 'Да, на сатоши', 'Только пополам'],
            answersEn: ['No, only whole', 'Yes, into satoshis', 'Only in half'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q10',
            difficulty: 1,
            question: 'Что нужно майнеру для работы?',
            questionEn: 'What does a miner need to work?',
            answers: ['Лопата', 'Электричество', 'Вода'],
            answersEn: ['A shovel', 'Electricity', 'Water'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q11',
            difficulty: 1,
            question: 'Почему майнер нагревается?',
            questionEn: 'Why does a miner heat up?',
            answers: ['От солнца', 'От вычислений', 'От батареи'],
            answersEn: ['From the sun', 'From calculations', 'From battery'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q12',
            difficulty: 1,
            question: 'Как называется знак биткоина?',
            questionEn: 'What is the Bitcoin symbol called?',
            answers: ['$', '₿', '€'],
            answersEn: ['$', '₿', '€'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q13',
            difficulty: 1,
            question: 'Биткоин - это физическая монета?',
            questionEn: 'Is Bitcoin a physical coin?',
            answers: ['Да', 'Нет, это цифровая валюта', 'Иногда'],
            answersEn: ['Yes', 'No, it is digital currency', 'Sometimes'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q14',
            difficulty: 1,
            question: 'Что означает BTC?',
            questionEn: 'What does BTC mean?',
            answers: ['Bitcoin', 'Big Technology Company', 'Best Trading Coin'],
            answersEn: ['Bitcoin', 'Big Technology Company', 'Best Trading Coin'],
            correct: 0,
            reward: 50
        },
        {
            id: 'q15',
            difficulty: 1,
            question: 'Можно ли создать новые биткоины бесконечно?',
            questionEn: 'Can new bitcoins be created infinitely?',
            answers: ['Да', 'Нет, есть лимит', 'Только по выходным'],
            answersEn: ['Yes', 'No, there is a limit', 'Only on weekends'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q16',
            difficulty: 1,
            question: 'Что такое блокчейн?',
            questionEn: 'What is blockchain?',
            answers: ['Игра', 'Цепочка блоков с данными', 'Тип компьютера'],
            answersEn: ['A game', 'Chain of data blocks', 'Type of computer'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q17',
            difficulty: 1,
            question: 'Зачем майнеру охлаждение?',
            questionEn: 'Why does a miner need cooling?',
            answers: ['Для красоты', 'Чтобы не перегреться', 'Для звука'],
            answersEn: ['For beauty', 'To not overheat', 'For sound'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q18',
            difficulty: 1,
            question: 'Кто такой Сатоши Накамото?',
            questionEn: 'Who is Satoshi Nakamoto?',
            answers: ['Президент Японии', 'Создатель биткоина', 'Известный майнер'],
            answersEn: ['President of Japan', 'Creator of Bitcoin', 'Famous miner'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q19',
            difficulty: 1,
            question: 'Что получает майнер за работу?',
            questionEn: 'What does a miner get for work?',
            answers: ['Золото', 'Биткоины', 'Медали'],
            answersEn: ['Gold', 'Bitcoins', 'Medals'],
            correct: 1,
            reward: 50
        },
        {
            id: 'q20',
            difficulty: 1,
            question: 'Можно ли отменить транзакцию биткоина?',
            questionEn: 'Can a Bitcoin transaction be canceled?',
            answers: ['Да, легко', 'Нет, она навсегда', 'Только админ может'],
            answersEn: ['Yes, easily', 'No, it is permanent', 'Only admin can'],
            correct: 1,
            reward: 50
        },
        
        // === СРЕДНИЕ ВОПРОСЫ (difficulty: 2) - Углубленные знания ===
        {
            id: 'q21',
            difficulty: 2,
            question: 'Что такое халвинг?',
            questionEn: 'What is halving?',
            answers: ['Удвоение награды', 'Уменьшение награды вдвое', 'Разделение блокчейна'],
            answersEn: ['Doubling the reward', 'Cutting reward in half', 'Splitting blockchain'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q22',
            difficulty: 2,
            question: 'Как часто происходит халвинг биткоина?',
            questionEn: 'How often does Bitcoin halving occur?',
            answers: ['Каждый год', 'Примерно каждые 4 года', 'Каждый месяц'],
            answersEn: ['Every year', 'Approximately every 4 years', 'Every month'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q23',
            difficulty: 2,
            question: 'Что такое хешрейт?',
            questionEn: 'What is hashrate?',
            answers: ['Курс биткоина', 'Скорость майнинга', 'Размер блока'],
            answersEn: ['Bitcoin price', 'Mining speed', 'Block size'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q24',
            difficulty: 2,
            question: 'Сколько биткоинов будет всего?',
            questionEn: 'How many Bitcoins will exist in total?',
            answers: ['Бесконечно', '21 миллион', '100 миллионов'],
            answersEn: ['Infinite', '21 million', '100 million'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q25',
            difficulty: 2,
            question: 'Что означает "proof of work"?',
            questionEn: 'What does "proof of work" mean?',
            answers: ['Справка с работы', 'Доказательство работы', 'Рабочий прототип'],
            answersEn: ['Work certificate', 'Proof of work done', 'Work prototype'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q26',
            difficulty: 2,
            question: 'Сколько времени создается один блок биткоина?',
            questionEn: 'How long does it take to create one Bitcoin block?',
            answers: ['1 минута', '10 минут', '1 час'],
            answersEn: ['1 minute', '10 minutes', '1 hour'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q27',
            difficulty: 2,
            question: 'Что такое приватный ключ?',
            questionEn: 'What is a private key?',
            answers: ['Пароль от кошелька', 'Номер карты', 'Имя пользователя'],
            answersEn: ['Wallet password', 'Card number', 'Username'],
            correct: 0,
            reward: 100
        },
        {
            id: 'q28',
            difficulty: 2,
            question: 'Что происходит при перегреве майнера?',
            questionEn: 'What happens when a miner overheats?',
            answers: ['Работает быстрее', 'Эффективность падает', 'Ничего'],
            answersEn: ['Works faster', 'Efficiency drops', 'Nothing'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q29',
            difficulty: 2,
            question: 'Что такое пул майнинга?',
            questionEn: 'What is a mining pool?',
            answers: ['Бассейн для майнеров', 'Группа майнеров', 'Тип кошелька'],
            answersEn: ['Pool for miners', 'Group of miners', 'Wallet type'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q30',
            difficulty: 2,
            question: 'Когда был первый халвинг биткоина?',
            questionEn: 'When was the first Bitcoin halving?',
            answers: ['2009', '2012', '2016'],
            answersEn: ['2009', '2012', '2016'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q31',
            difficulty: 2,
            question: 'Какая награда за блок была вначале?',
            questionEn: 'What was the initial block reward?',
            answers: ['10 BTC', '50 BTC', '100 BTC'],
            answersEn: ['10 BTC', '50 BTC', '100 BTC'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q32',
            difficulty: 2,
            question: 'Что такое нода?',
            questionEn: 'What is a node?',
            answers: ['Майнер', 'Компьютер в сети блокчейна', 'Кошелек'],
            answersEn: ['Miner', 'Computer in blockchain network', 'Wallet'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q33',
            difficulty: 2,
            question: 'Какая комиссия за транзакцию биткоина?',
            questionEn: 'What is the Bitcoin transaction fee?',
            answers: ['Фиксированная', 'Зависит от нагрузки сети', 'Бесплатно'],
            answersEn: ['Fixed', 'Depends on network load', 'Free'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q34',
            difficulty: 2,
            question: 'Сколько подтверждений нужно для транзакции?',
            questionEn: 'How many confirmations are needed for a transaction?',
            answers: ['1', '6 и более', 'Не нужны'],
            answersEn: ['1', '6 or more', 'Not needed'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q35',
            difficulty: 2,
            question: 'Что такое ASIC?',
            questionEn: 'What is ASIC?',
            answers: ['Тип кошелька', 'Специальный чип для майнинга', 'Криптобиржа'],
            answersEn: ['Wallet type', 'Special chip for mining', 'Crypto exchange'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q36',
            difficulty: 2,
            question: 'Можно ли майнить биткоин на телефоне?',
            questionEn: 'Can you mine Bitcoin on a phone?',
            answers: ['Да, легко', 'Теоретически да, но неэффективно', 'Нет, невозможно'],
            answersEn: ['Yes, easily', 'Theoretically yes, but inefficient', 'No, impossible'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q37',
            difficulty: 2,
            question: 'Что такое адрес биткоина?',
            questionEn: 'What is a Bitcoin address?',
            answers: ['Email', 'Уникальный ID для получения BTC', 'Пароль'],
            answersEn: ['Email', 'Unique ID to receive BTC', 'Password'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q38',
            difficulty: 2,
            question: 'Что будет когда добудут все 21 млн BTC?',
            questionEn: 'What happens when all 21M BTC are mined?',
            answers: ['Майнинг остановится', 'Майнеры будут получать комиссии', 'Создадут новые BTC'],
            answersEn: ['Mining will stop', 'Miners will get fees', 'New BTC will be created'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q39',
            difficulty: 2,
            question: 'Кто контролирует биткоин?',
            questionEn: 'Who controls Bitcoin?',
            answers: ['Правительство', 'Никто, это децентрализация', 'Сатоши Накамото'],
            answersEn: ['Government', 'Nobody, it is decentralized', 'Satoshi Nakamoto'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q40',
            difficulty: 2,
            question: 'Что такое Lightning Network?',
            questionEn: 'What is Lightning Network?',
            answers: ['Быстрый интернет', 'Второй уровень для быстрых транзакций', 'Новая криптовалюта'],
            answersEn: ['Fast internet', 'Second layer for fast transactions', 'New cryptocurrency'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q41',
            difficulty: 2,
            question: 'Почему биткоин ограничен 21 миллионом?',
            questionEn: 'Why is Bitcoin limited to 21 million?',
            answers: ['Случайность', 'Защита от инфляции', 'Технические ограничения'],
            answersEn: ['Random', 'Protection from inflation', 'Technical limitations'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q42',
            difficulty: 2,
            question: 'Что такое genesis block?',
            questionEn: 'What is genesis block?',
            answers: ['Последний блок', 'Первый блок блокчейна', 'Самый большой блок'],
            answersEn: ['Last block', 'First blockchain block', 'Biggest block'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q43',
            difficulty: 2,
            question: 'Можно ли вернуть отправленные биткоины?',
            questionEn: 'Can sent bitcoins be returned?',
            answers: ['Да, есть кнопка отмены', 'Нет, только если получатель вернет', 'Автоматически через 24ч'],
            answersEn: ['Yes, there is cancel button', 'No, only if recipient returns', 'Automatically after 24h'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q44',
            difficulty: 2,
            question: 'Что такое холодный кошелек?',
            questionEn: 'What is a cold wallet?',
            answers: ['Кошелек в холодильнике', 'Оффлайн хранение ключей', 'Замороженный счет'],
            answersEn: ['Wallet in fridge', 'Offline key storage', 'Frozen account'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q45',
            difficulty: 2,
            question: 'Сколько биткоинов потеряно навсегда?',
            questionEn: 'How many bitcoins are lost forever?',
            answers: ['Ноль', 'Около 3-4 миллионов', 'Все потеряны'],
            answersEn: ['Zero', 'About 3-4 million', 'All are lost'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q46',
            difficulty: 2,
            question: 'Что такое seed фраза?',
            questionEn: 'What is a seed phrase?',
            answers: ['Пароль', '12-24 слова для восстановления кошелька', 'Адрес кошелька'],
            answersEn: ['Password', '12-24 words to recover wallet', 'Wallet address'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q47',
            difficulty: 2,
            question: 'Когда добудут последний биткоин?',
            questionEn: 'When will the last bitcoin be mined?',
            answers: ['2025', '2140', 'Никогда'],
            answersEn: ['2025', '2140', 'Never'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q48',
            difficulty: 2,
            question: 'Что такое fork блокчейна?',
            questionEn: 'What is a blockchain fork?',
            answers: ['Ошибка', 'Разделение на две цепи', 'Обновление'],
            answersEn: ['Error', 'Split into two chains', 'Update'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q49',
            difficulty: 2,
            question: 'Кто проверяет транзакции биткоина?',
            questionEn: 'Who verifies Bitcoin transactions?',
            answers: ['Банк', 'Майнеры и ноды', 'Полиция'],
            answersEn: ['Bank', 'Miners and nodes', 'Police'],
            correct: 1,
            reward: 100
        },
        {
            id: 'q50',
            difficulty: 2,
            question: 'Что такое mempool?',
            questionEn: 'What is mempool?',
            answers: ['Пул майнеров', 'Очередь неподтвержденных транзакций', 'Тип кошелька'],
            answersEn: ['Mining pool', 'Queue of unconfirmed transactions', 'Wallet type'],
            correct: 1,
            reward: 100
        },
        
        // === СЛОЖНЫЕ ВОПРОСЫ (difficulty: 3) - Экспертные знания ===
        {
            id: 'q51',
            difficulty: 3,
            question: 'Какой алгоритм использует биткоин?',
            questionEn: 'What algorithm does Bitcoin use?',
            answers: ['SHA-256', 'MD5', 'RSA'],
            answersEn: ['SHA-256', 'MD5', 'RSA'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q52',
            difficulty: 3,
            question: 'Через сколько блоков происходит халвинг?',
            questionEn: 'After how many blocks does halving occur?',
            answers: ['100,000', '210,000', '500,000'],
            answersEn: ['100,000', '210,000', '500,000'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q53',
            difficulty: 3,
            question: 'Что такое difficulty adjustment?',
            questionEn: 'What is difficulty adjustment?',
            answers: ['Настройка игры', 'Автоподстройка сложности майнинга', 'Изменение цены'],
            answersEn: ['Game setting', 'Auto-adjustment of mining difficulty', 'Price change'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q54',
            difficulty: 3,
            question: 'Как часто корректируется сложность?',
            questionEn: 'How often is difficulty adjusted?',
            answers: ['Каждый день', 'Каждые 2016 блоков', 'Каждый год'],
            answersEn: ['Every day', 'Every 2016 blocks', 'Every year'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q55',
            difficulty: 3,
            question: 'Сколько байт в одном блоке биткоина?',
            questionEn: 'How many bytes in one Bitcoin block?',
            answers: ['1 МБ', '4 МБ (с SegWit)', '10 МБ'],
            answersEn: ['1 MB', '4 MB (with SegWit)', '10 MB'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q56',
            difficulty: 3,
            question: 'Что такое SegWit?',
            questionEn: 'What is SegWit?',
            answers: ['Тип кошелька', 'Segregated Witness - оптимизация', 'Новая крипта'],
            answersEn: ['Wallet type', 'Segregated Witness - optimization', 'New crypto'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q57',
            difficulty: 3,
            question: 'Сколько нулей в начале хеша блока?',
            questionEn: 'How many zeros at the start of block hash?',
            answers: ['Ровно 10', 'Зависит от сложности', 'Всегда 6'],
            answersEn: ['Exactly 10', 'Depends on difficulty', 'Always 6'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q58',
            difficulty: 3,
            question: 'Что такое nonce в блоке?',
            questionEn: 'What is nonce in a block?',
            answers: ['Номер блока', 'Случайное число для майнинга', 'Адрес майнера'],
            answersEn: ['Block number', 'Random number for mining', 'Miner address'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q59',
            difficulty: 3,
            question: 'Какой текст в genesis block?',
            questionEn: 'What text is in genesis block?',
            answers: ['Hello World', 'The Times 03/Jan/2009...', 'Bitcoin 1.0'],
            answersEn: ['Hello World', 'The Times 03/Jan/2009...', 'Bitcoin 1.0'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q60',
            difficulty: 3,
            question: 'Что такое UTXO?',
            questionEn: 'What is UTXO?',
            answers: ['Новая крипта', 'Unspent Transaction Output', 'Тип майнера'],
            answersEn: ['New crypto', 'Unspent Transaction Output', 'Miner type'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q61',
            difficulty: 3,
            question: 'Сколько satoshi в genesis блоке?',
            questionEn: 'How many satoshi in genesis block?',
            answers: ['0 (нельзя потратить)', '50 BTC', '100 BTC'],
            answersEn: ['0 (cannot be spent)', '50 BTC', '100 BTC'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q62',
            difficulty: 3,
            question: 'Что такое Taproot?',
            questionEn: 'What is Taproot?',
            answers: ['Корень дерева', 'Обновление протокола', 'Тип адреса'],
            answersEn: ['Tree root', 'Protocol upgrade', 'Address type'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q63',
            difficulty: 3,
            question: 'Когда активировали Taproot?',
            questionEn: 'When was Taproot activated?',
            answers: ['2017', '2021', '2024'],
            answersEn: ['2017', '2021', '2024'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q64',
            difficulty: 3,
            question: 'Что такое Schnorr подписи?',
            questionEn: 'What are Schnorr signatures?',
            answers: ['Тип майнера', 'Улучшенные криптоподписи', 'Новая валюта'],
            answersEn: ['Miner type', 'Improved crypto signatures', 'New currency'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q65',
            difficulty: 3,
            question: 'Сколько OP кодов в Bitcoin Script?',
            questionEn: 'How many OP codes in Bitcoin Script?',
            answers: ['50', 'Около 100+', '10'],
            answersEn: ['50', 'About 100+', '10'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q66',
            difficulty: 3,
            question: 'Что такое dust transaction?',
            questionEn: 'What is dust transaction?',
            answers: ['Быстрая транзакция', 'Очень маленькая сумма', 'Ошибочная транзакция'],
            answersEn: ['Fast transaction', 'Very small amount', 'Erroneous transaction'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q67',
            difficulty: 3,
            question: 'Что такое coinbase транзакция?',
            questionEn: 'What is coinbase transaction?',
            answers: ['Биржа Coinbase', 'Первая транзакция в блоке', 'Тип кошелька'],
            answersEn: ['Coinbase exchange', 'First transaction in block', 'Wallet type'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q68',
            difficulty: 3,
            question: 'Сколько должно быть подтверждений для coinbase?',
            questionEn: 'How many confirmations for coinbase?',
            answers: ['6', '100', '1'],
            answersEn: ['6', '100', '1'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q69',
            difficulty: 3,
            question: 'Что такое orphan block?',
            questionEn: 'What is orphan block?',
            answers: ['Потерянный блок', 'Блок не включенный в главную цепь', 'Пустой блок'],
            answersEn: ['Lost block', 'Block not in main chain', 'Empty block'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q70',
            difficulty: 3,
            question: 'Что такое time lock в Bitcoin?',
            questionEn: 'What is time lock in Bitcoin?',
            answers: ['Блокировка на время', 'Таймер майнинга', 'Тип адреса'],
            answersEn: ['Time-based lock', 'Mining timer', 'Address type'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q71',
            difficulty: 3,
            question: 'Какой порт использует Bitcoin по умолчанию?',
            questionEn: 'What port does Bitcoin use by default?',
            answers: ['80', '8333', '443'],
            answersEn: ['80', '8333', '443'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q72',
            difficulty: 3,
            question: 'Что такое BIP?',
            questionEn: 'What is BIP?',
            answers: ['Bitcoin Improvement Proposal', 'Best Investment Plan', 'Block Index Protocol'],
            answersEn: ['Bitcoin Improvement Proposal', 'Best Investment Plan', 'Block Index Protocol'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q73',
            difficulty: 3,
            question: 'Что такое BIP-32?',
            questionEn: 'What is BIP-32?',
            answers: ['Версия кошелька', 'Hierarchical Deterministic Wallets', 'Тип адреса'],
            answersEn: ['Wallet version', 'Hierarchical Deterministic Wallets', 'Address type'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q74',
            difficulty: 3,
            question: 'Что делает BIP-39?',
            questionEn: 'What does BIP-39 do?',
            answers: ['Mnemonic seed фразы', 'Обновление протокола', 'Тип транзакции'],
            answersEn: ['Mnemonic seed phrases', 'Protocol update', 'Transaction type'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q75',
            difficulty: 3,
            question: 'Сколько слов в стандартной seed фразе?',
            questionEn: 'How many words in standard seed phrase?',
            answers: ['6 или 12', '12 или 24', '32 или 64'],
            answersEn: ['6 or 12', '12 or 24', '32 or 64'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q76',
            difficulty: 3,
            question: 'Что такое Replace-By-Fee (RBF)?',
            questionEn: 'What is Replace-By-Fee (RBF)?',
            answers: ['Замена комиссии', 'Отмена транзакции', 'Возврат средств'],
            answersEn: ['Fee replacement', 'Transaction cancellation', 'Fund return'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q77',
            difficulty: 3,
            question: 'Что такое CPFP?',
            questionEn: 'What is CPFP?',
            answers: ['Child Pays For Parent', 'Crypto Payment Protocol', 'Central Processing Unit'],
            answersEn: ['Child Pays For Parent', 'Crypto Payment Protocol', 'Central Processing Unit'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q78',
            difficulty: 3,
            question: 'Какой максимальный supply у биткоина?',
            questionEn: 'What is Bitcoin maximum supply?',
            answers: ['20,999,999.9769 BTC', '21,000,000 BTC ровно', '21,500,000 BTC'],
            answersEn: ['20,999,999.9769 BTC', '21,000,000 BTC exactly', '21,500,000 BTC'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q79',
            difficulty: 3,
            question: 'Что такое address derivation path?',
            questionEn: 'What is address derivation path?',
            answers: ['Путь к кошельку', 'Формула генерации адресов', 'Адрес биржи'],
            answersEn: ['Path to wallet', 'Address generation formula', 'Exchange address'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q80',
            difficulty: 3,
            question: 'Что означает m/44\'/0\'/0\'/0/0?',
            questionEn: 'What does m/44\'/0\'/0\'/0/0 mean?',
            answers: ['Версия кошелька', 'BIP-44 derivation path', 'Номер блока'],
            answersEn: ['Wallet version', 'BIP-44 derivation path', 'Block number'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q81',
            difficulty: 3,
            question: 'Что такое P2PKH адрес?',
            questionEn: 'What is P2PKH address?',
            answers: ['Pay to Public Key Hash', 'Protocol 2 Payment', 'Private Key Hash'],
            answersEn: ['Pay to Public Key Hash', 'Protocol 2 Payment', 'Private Key Hash'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q82',
            difficulty: 3,
            question: 'С чего начинается legacy адрес?',
            questionEn: 'What does legacy address start with?',
            answers: ['1', 'bc1', '3'],
            answersEn: ['1', 'bc1', '3'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q83',
            difficulty: 3,
            question: 'С чего начинается SegWit адрес?',
            questionEn: 'What does SegWit address start with?',
            answers: ['1', 'bc1', '3'],
            answersEn: ['1', 'bc1', '3'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q84',
            difficulty: 3,
            question: 'Что такое Merkle root?',
            questionEn: 'What is Merkle root?',
            answers: ['Корень дерева транзакций', 'Тип майнера', 'Адрес кошелька'],
            answersEn: ['Root of transaction tree', 'Miner type', 'Wallet address'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q85',
            difficulty: 3,
            question: 'Сколько транзакций может быть в блоке?',
            questionEn: 'How many transactions can be in a block?',
            answers: ['Ровно 1000', 'Зависит от размера', 'Бесконечно'],
            answersEn: ['Exactly 1000', 'Depends on size', 'Infinite'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q86',
            difficulty: 3,
            question: 'Что такое block header?',
            questionEn: 'What is block header?',
            answers: ['Название блока', 'Метаданные блока (80 байт)', 'Первая транзакция'],
            answersEn: ['Block name', 'Block metadata (80 bytes)', 'First transaction'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q87',
            difficulty: 3,
            question: 'Что такое blockchain reorganization?',
            questionEn: 'What is blockchain reorganization?',
            answers: ['Обновление', 'Смена главной цепи', 'Удаление блока'],
            answersEn: ['Update', 'Change of main chain', 'Block deletion'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q88',
            difficulty: 3,
            question: 'Что такое double-spend attack?',
            questionEn: 'What is double-spend attack?',
            answers: ['Двойные комиссии', 'Попытка потратить дважды', 'Удвоение монет'],
            answersEn: ['Double fees', 'Attempt to spend twice', 'Coin doubling'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q89',
            difficulty: 3,
            question: 'Что такое 51% attack?',
            questionEn: 'What is 51% attack?',
            answers: ['Налог 51%', 'Контроль >50% хешрейта', 'Кража 51% монет'],
            answersEn: ['51% tax', 'Control >50% hashrate', 'Steal 51% coins'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q90',
            difficulty: 3,
            question: 'Какова вероятность угадать приватный ключ?',
            questionEn: 'What is probability of guessing private key?',
            answers: ['1 из миллиона', 'Практически невозможно (2^256)', '50%'],
            answersEn: ['1 in million', 'Practically impossible (2^256)', '50%'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q91',
            difficulty: 3,
            question: 'Что такое vanity address?',
            questionEn: 'What is vanity address?',
            answers: ['Красивый адрес', 'Адрес с выбранным началом', 'VIP кошелек'],
            answersEn: ['Beautiful address', 'Address with chosen prefix', 'VIP wallet'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q92',
            difficulty: 3,
            question: 'Что такое SPV кошелек?',
            questionEn: 'What is SPV wallet?',
            answers: ['Super Private Wallet', 'Simplified Payment Verification', 'Special Protocol Version'],
            answersEn: ['Super Private Wallet', 'Simplified Payment Verification', 'Special Protocol Version'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q93',
            difficulty: 3,
            question: 'Сколько весит полная нода биткоина?',
            questionEn: 'How much does full Bitcoin node weigh?',
            answers: ['10 GB', '500+ GB', '50 GB'],
            answersEn: ['10 GB', '500+ GB', '50 GB'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q94',
            difficulty: 3,
            question: 'Что такое pruned node?',
            questionEn: 'What is pruned node?',
            answers: ['Обрезанная нода с меньшим хранилищем', 'Быстрая нода', 'Майнинг нода'],
            answersEn: ['Pruned node with less storage', 'Fast node', 'Mining node'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q95',
            difficulty: 3,
            question: 'Что такое HTLC?',
            questionEn: 'What is HTLC?',
            answers: ['Hash Time Locked Contract', 'High Transaction Low Cost', 'Hardware Test Logic'],
            answersEn: ['Hash Time Locked Contract', 'High Transaction Low Cost', 'Hardware Test Logic'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q96',
            difficulty: 3,
            question: 'Что делает OP_RETURN?',
            questionEn: 'What does OP_RETURN do?',
            answers: ['Возврат средств', 'Хранит данные в блокчейне', 'Отменяет транзакцию'],
            answersEn: ['Returns funds', 'Stores data in blockchain', 'Cancels transaction'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q97',
            difficulty: 3,
            question: 'Максимальный размер OP_RETURN?',
            questionEn: 'Maximum OP_RETURN size?',
            answers: ['40 байт', '80 байт', '1 KB'],
            answersEn: ['40 bytes', '80 bytes', '1 KB'],
            correct: 1,
            reward: 150
        },
        {
            id: 'q98',
            difficulty: 3,
            question: 'Что такое Bitcoin Ordinals?',
            questionEn: 'What is Bitcoin Ordinals?',
            answers: ['NFT на биткоине', 'Тип транзакции', 'Новая крипта'],
            answersEn: ['NFT on Bitcoin', 'Transaction type', 'New crypto'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q99',
            difficulty: 3,
            question: 'Что такое BRC-20 токены?',
            questionEn: 'What are BRC-20 tokens?',
            answers: ['Токены на биткоине', 'Тип адреса', 'Mining pool'],
            answersEn: ['Tokens on Bitcoin', 'Address type', 'Mining pool'],
            correct: 0,
            reward: 150
        },
        {
            id: 'q100',
            difficulty: 3,
            question: 'Когда будет следующий халвинг?',
            questionEn: 'When is the next halving?',
            answers: ['2024', '2028', '2032'],
            answersEn: ['2024', '2028', '2032'],
            correct: 1,
            reward: 150
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
        this.checkQuizReset();  // Проверяем сброс викторины (каждый час)
        this.checkTasksReset(); // Проверяем сброс заданий (каждые 2 часа)
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

    // === ВИКТОРИНА (обновляется каждый час) ===
    
    // Проверка сброса викторины каждый час
    checkQuizReset() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 час в мс
        const lastReset = this.state.lastQuizReset || 0;
        
        if (now - lastReset >= oneHour) {
            this.resetQuiz();
            this.state.lastQuizReset = now;
            this.saveState();
        }
    },

    // Время до следующего сброса викторины (в секундах)
    getTimeUntilQuizReset() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        const lastReset = this.state.lastQuizReset || 0;
        const nextReset = lastReset + oneHour;
        return Math.max(0, Math.floor((nextReset - now) / 1000));
    },

    // Сброс викторины - выбираем 3 новых вопроса
    resetQuiz() {
        const level = window.Game?.state?.level || 1;
        
        // Определяем подходящую сложность по уровню игрока
        let targetDifficulty = 1;
        if (level >= 15) targetDifficulty = 3;
        else if (level >= 6) targetDifficulty = 2;
        
        // Берем вопросы нужной сложности
        const suitableQuestions = this.quizQuestions.filter(q => q.difficulty === targetDifficulty);
        
        // Перемешиваем и берем 3 случайных
        const shuffled = [...suitableQuestions].sort(() => Math.random() - 0.5);
        this.state.currentQuizQuestions = shuffled.slice(0, 3);
        
        // Сбрасываем прогресс
        this.state.quizAnswered = [];
        this.state.quizErrors = 0;
        this.state.quizBonusClaimed = false;
    },

    // Получить текущий доступный вопрос
    getAvailableQuestion() {
        if (this.state.currentQuizQuestions.length === 0) {
            this.resetQuiz();
        }
        
        const available = this.state.currentQuizQuestions.filter(q => 
            !this.state.quizAnswered.includes(q.id)
        );
        
        if (available.length === 0) return null;
        return available[Math.floor(Math.random() * available.length)];
    },

    // Ответ на вопрос
    answerQuestion(questionId, answerIndex) {
        const question = this.quizQuestions.find(q => q.id === questionId);
        if (!question) return { correct: false, reward: 0 };

        const correct = question.correct === answerIndex;

        if (correct) {
            this.state.quizAnswered.push(questionId);
            this.trackQuiz(); // Трекаем для заданий
            this.checkAchievements();
            return { correct: true, reward: question.reward };
        } else {
            this.state.quizErrors++; // Считаем ошибки
        }

        return { correct: false, reward: 0 };
    },

    // Все вопросы отвечены?
    allQuizAnswered() {
        return this.state.quizAnswered.length === 3;
    },

    // Бонус за все 3 вопроса
    getQuizBonus() {
        const level = window.Game?.state?.level || 1;
        let bonus = 300 + (level - 1) * 100; // 300 на уровне 1, растет с уровнем
        
        // Перфект бонус: если все 3 ответа правильные без ошибок
        if (this.state.quizErrors === 0 && this.allQuizAnswered()) {
            bonus += 500; // Дополнительно +500 сат за перфект
        }
        
        return bonus;
    },

    // Проверка на перфект (все 3 правильно без ошибок)
    isPerfectQuiz() {
        return this.state.quizErrors === 0 && this.allQuizAnswered();
    },

    // Проверка получен ли бонус за викторину
    isQuizBonusClaimed() {
        return this.state.quizBonusClaimed === true;
    },

    // Забрать бонус за викторину
    claimQuizBonus() {
        this.state.quizBonusClaimed = true;
        this.saveState();
        return this.getQuizBonus();
    },

    // Проверка есть ли ещё вопросы в текущем цикле
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
            // Показываем popup для каждого нового достижения
            newAchievements.forEach((ach, index) => {
                setTimeout(() => {
                    if (window.QuestsUI) {
                        QuestsUI.showAchievementPopup(ach);
                    }
                }, index * 2000); // Задержка между попапами
            });
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
        
        // Показываем прогресс (X/3)
        const progress = `${Quests.state.quizAnswered.length}/3`;
        const questionText = lang === 'ru' ? question.question : question.questionEn;
        this.els.quizQuestion.innerHTML = `
            <div style="font-size: 8px; color: #8B5CF6; margin-bottom: 8px;">
                ${lang === 'ru' ? 'Вопрос' : 'Question'} ${progress}
            </div>
            <div>${questionText}</div>
        `;
        
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
        const timeLeft = Quests.getTimeUntilQuizReset();
        const hours = Math.floor(timeLeft / 3600);
        const mins = Math.floor((timeLeft % 3600) / 60);
        const timeStr = hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
        
        const allAnswered = Quests.allQuizAnswered();
        const bonusClaimed = Quests.isQuizBonusClaimed();
        
        let content = '';
        if (allAnswered && !bonusClaimed) {
            const bonus = Quests.getQuizBonus();
            const isPerfect = Quests.isPerfectQuiz();
            const buttonStyle = isPerfect ? 'background: linear-gradient(180deg, #F59E0B, #D97706); margin: 10px auto;' : 'margin: 10px auto;';
            const buttonText = isPerfect 
                ? (lang === 'ru' ? `🎉 ПЕРФЕКТ! +${bonus} сат` : `🎉 PERFECT! +${bonus} sat`)
                : (lang === 'ru' ? `Забрать бонус +${bonus} сат` : `Claim bonus +${bonus} sat`);
            
            content = `
                <div class="quiz-empty">
                    <div class="quiz-empty-icon">🎉</div>
                    <div style="font-size: 11px; margin-bottom: 10px;">
                        ${lang === 'ru' ? 'Все 3 вопроса отвечены!' : 'All 3 questions answered!'}
                        ${isPerfect ? `<div style="font-size: 9px; color: #F59E0B; margin-top: 5px;">✨ ${lang === 'ru' ? 'Без ошибок!' : 'Flawless!'} ✨</div>` : ''}
                    </div>
                    <button class="quiz-next-btn visible" onclick="QuestsUI.claimFinalBonus()" style="${buttonStyle}">
                        ${buttonText}
                    </button>
                </div>
            `;
        } else {
            content = `
                <div class="quiz-empty">
                    <div class="quiz-empty-icon">🎓</div>
                    <div style="font-size: 11px; margin-bottom: 10px;">
                        ${lang === 'ru' ? 'Все вопросы отвечены!' : 'All questions answered!'}
                    </div>
                    <div style="font-size: 9px; color: #666;">
                        ⏱️ ${lang === 'ru' ? 'Новые вопросы через' : 'New questions in'}: ${timeStr}
                    </div>
                </div>
            `;
        }
        
        this.els.quizQuestion.innerHTML = content;
        this.els.quizAnswers.innerHTML = '';
        this.els.quizReward.textContent = '';
        this.els.quizResult.classList.remove('visible');
        this.els.quizModal.classList.add('active');
    },
    
    claimFinalBonus() {
        const bonus = Quests.claimQuizBonus();
        if (window.Game) {
            Game.addSatoshi(bonus);
        }
        this.closeQuiz();
        
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
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
            // Все 3 вопроса пройдены — показываем бонус
            const bonus = Quests.getQuizBonus();
            const isPerfect = Quests.isPerfectQuiz();
            
            if (isPerfect) {
                this.els.quizNextBtn.textContent = lang === 'ru' ? `🎉 ПЕРФЕКТ! +${bonus} сат` : `🎉 PERFECT! +${bonus} sat`;
                this.els.quizNextBtn.style.background = 'linear-gradient(180deg, #F59E0B, #D97706)';
            } else {
                this.els.quizNextBtn.textContent = lang === 'ru' ? `🎉 Забрать бонус +${bonus} сат` : `🎉 Claim bonus +${bonus} sat`;
                this.els.quizNextBtn.style.background = '';
            }
        }
        this.els.quizNextBtn.classList.add('visible');
    },

    nextQuestion() {
        const lang = I18n?.currentLang || 'ru';
        
        // Если вопросы закончились — выдаём бонус
        if (!Quests.hasMoreQuestions()) {
            const bonus = Quests.claimQuizBonus();
            if (window.Game) {
                Game.addSatoshi(bonus);
            }
            this.closeQuiz();
            this.renderQuizModal(); // Обновляем UI
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
    },

    // Показать popup достижения на главном экране
    showAchievementPopup(achievement) {
        const lang = I18n?.currentLang || 'ru';
        const name = lang === 'ru' ? achievement.nameRu : achievement.nameEn;
        
        // Создаем popup элемент
        const popup = document.createElement('div');
        popup.className = 'achievement-popup-main';
        popup.innerHTML = `
            <div class="achievement-popup-icon">${achievement.icon}</div>
            <div class="achievement-popup-content">
                <div class="achievement-popup-label">${lang === 'ru' ? 'Достижение!' : 'Achievement!'}</div>
                <div class="achievement-popup-name">${name}</div>
                <div class="achievement-popup-reward">+${achievement.reward} сат</div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Добавляем награду
        if (window.Game) {
            Game.addSatoshi(achievement.reward);
        }
        
        // Haptic feedback
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        
        // Анимация появления
        setTimeout(() => popup.classList.add('show'), 100);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    }
};

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    QuestsUI.init();
});

// Экспорт
window.Quests = Quests;
window.QuestsUI = QuestsUI;
