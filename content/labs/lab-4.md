## ТЕМА, МЕТА ТА МІСЦЕ РОЗТАШУВАННЯ

*   **Тема:** Розширені можливості Node.js-додатків: логування, завантаження
файлів, моніторинг продуктивності
*   **Мета:** Ознайомитися з розширеними можливостями серверних застосунків на базі Node.js, а саме:
1. реалізацією логування запитів і подій
2. організацією завантаження файлів на сервер
3. моніторингом продуктивності застосунку

*   **Місце розташування:**
    *   **Репозиторій власного веб-застосунку (GitHub):** [github.com/nataaach/glowandcare](https://github.com/nataaach/glowandcare)
    *   **Власний веб-застосунок (Жива сторінка):** [nataaach.github.io/glowandcare](https://nataaach.github.io/glowandcare/)
    *   **Репозиторій звітного HTML-документа:** [github.com/nataaach/IS-32_appRECORD...](https://github.com/nataaach/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026)
    *   **Звітний HTML-документ (Жива сторінка):** [nataaach.github.io/IS-32_appRECORD...](https://nataaach.github.io/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026/)

*   **Завдання:** 
1. Створення базового сервера.
2. Логування запитів.
3. Завантаження файлів.
4. Моніторинг продуктивності.
5. Логування продуктивності.
6. Ініціалізація проєкту.
7. Логування HTTP-запитів.
8. Файлове логування подій.
9. Обробка помилок.
10. Завантаження одного файлу.
11. Завантаження кількох файлів.
12. Валідація файлів.
13. Моніторинг стану сервера.
14. Вимірювання часу відповіді.
15. Інтеграція менеджера процесів.
### Завдання 1. Створення базового сервера.
  Було ініціалізовано проєкт за допомогою `npm init` та встановлено необхідні залежності: `express`, `morgan`, `winston`, `multer`. Створено базовий сервер на Node.js, який прослуховує порт 3000 та повертає повідомлення 'Server is running' на головній сторінці.
1) Створення файлу `package.json `
 ![init](/assets/labs/lab-4/init.png)
2) Встановлення інструментів
 ![dep](/assets/labs/lab-4/dep.png)
3) Створення файлу `app.js`
 ![file](/assets/labs/lab-4/file.png)
 ### Завдання 2. Логування запитів.
 У цьому завданні налаштовано комплексне логування: мідлвар Morgan виводить деталі HTTP-запитів у консоль, а бібліотека Winston фіксує системні події у файл `app.js`. Це дозволяє одночасно моніторити активність сервера в реальному часі та зберігати історію
  ```javascript
const express = require('express');
const morgan = require('morgan'); 
const winston = require('winston'); 

const app = express();

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({ filename: 'app.log' }) 
    ]
});

app.use(morgan('combined')); 

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
    logger.info('Server started'); 
});
```
 ![morgan](/assets/labs/lab-4/morgan.png)
  ### Завдання 3. Завантаження файлів.
  Для обробки файлів використано бібліотеку Multer. Створено `/upload`, який приймає файл через POST-запит та автоматично зберігає його у директорію `uploads/`
```javascript
  app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});
```
 ![download1](/assets/labs/lab-4/3.png)
  ### Завдання 4. Моніторинг продуктивності.
  Реалізовано маршрут `/status`, який повертає дані про час безперервної роботи сервера (uptime) та поточне використання оперативної пам'яті процесом (memoryUsage) у форматі JSON
```javascript
    app.get('/status', (req, res) => {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    res.json({
        uptime,
        memoryUsage
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
    logger.info('Server started');
});
```
 ![4](/assets/labs/lab-4/4.png)
  ### Завдання 5. Логування продуктивності.
Створено власне проміжне ПЗ (middleware), яке фіксує момент початку запиту та обчислює час до моменту відправки відповіді. Результат виводиться у консоль, що дозволяє аналізувати швидкість роботи кожного маршруту
```javascript
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[Performance] ${req.method} ${req.url} оброблено за ${duration}ms`);
    });
    next();
});

app.get('/', (req, res) => {
    res.send('Server is running');
});
```
 ![5](/assets/labs/lab-4/5.png)
### Завдання 6. Ініціалізація проєкту.
Сервер успішно обробив GET-запит.
 ![6](/assets/labs/lab-4/6.png)
### Завдання 7. Логування HTTP-запитів.
Дублює завдання 2.
 ### Завдання 8. Файлове логування подій.
  ```javascript
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'app.log' }), 
        new winston.transports.Console({ format: winston.format.simple() }) 
    ]
});
```
 ![8](/assets/labs/lab-4/8.png)
 ### Завдання 9. Обробка помилок.
 Для обробки помилок створено  middleware з чотирма параметрами (err, req, res, next), яке розміщене в кінці ланцюжка маршрутів. Цей обробник перехоплює всі системні помилки, автоматично логує їх у файл app.log через Winston та запобігає зупинці сервера. Клієнту замість стандартної HTML-сторінки помилки повертається структурована JSON-відповідь із зазначенням статус-коду (500 або 400) та описом проблеми.
  ```javascript
app.use((err, req, res, next) => {
    logger.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            error: { code: 400, message: "Помилка завантаження файлу: " + err.message }
        });
    }
```
 ![8](/assets/labs/lab-4/8.png)
 ### Завдання 10. Завантаження одного файлу.
Дублює завдання 3.
 ### Завдання 11. Завантаження кількох файлів.
 ```javascript
 app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    const fileNames = req.files.map(file => file.filename);
    res.send(`Успішно завантажено ${req.files.length} файлів: ${fileNames.join(', ')}`);
});
```
 ![11](/assets/labs/lab-4/11.1.png)
 ![11](/assets/labs/lab-4/11.2.png)
 ### Завдання 12. Валідація файлів.
 Для валідації файлів у конфігурацію Multer додано обмеження розміру limits.fileSize (максимум 2 МБ) та функцію fileFilter. Вона перевіряє розширення та MIME-тип файлу, дозволяючи завантаження виключно форматів jpg, png та pdf, відхиляючи всі інші з відповідним повідомленням про помилку.
  ```javascript
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Дозволені лише файли форматів JPG, PNG та PDF!'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter: fileFilter
});
```
 ![12](/assets/labs/lab-4/12.png)
 ### Завдання 13. Моніторинг стану сервера.
 Реалізовано GET-маршрут /status для системного моніторингу. Він повертає JSON-відповідь, яка містить поточний час безперервної роботи сервера `process.uptime()` та детальну статистику використання оперативної пам'яті `process.memoryUsage()`, що дозволяє контролювати навантаження на застосунок.
   ```javascript
app.get('/status', (req, res) => {
    res.json({
        uptime: `${Math.floor(process.uptime())} секунд`,
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});
```
 ![13](/assets/labs/lab-4/13.png)
 ### Завдання 14. Вимірювання часу відповіді.
 Для вимірювання швидкодії розроблено middleware, яке фіксує початковий час запиту (Date.now()) та, використовуючи подію res.on('finish'), обчислює загальний час обробки в мілісекундах. Результат вимірювання автоматично виводиться у консоль та паралельно записується у файл app.log через Winston.
```javascript
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const msg = `[Performance] ${req.method} ${req.url} оброблено за ${duration}ms`;
        console.log(msg); 
        logger.info(msg);
    });
    next();
});
```
 ![14](/assets/labs/lab-4/14.png)
 ### Завдання 15. Інтеграція менеджера процесів.
 Проєкт успішно інтегровано з process-менеджером PM2. Застосунок було запущено у фоновому режимі (команда pm2 start app.js), перевірено доступність логів через pm2 logs та підтверджено автоматичний перезапуск процесу (auto-restart) у разі виникнення критичних збоїв.
![15](/assets/labs/lab-4/15.1.png)
![15](/assets/labs/lab-4/15.2.png)
![15](/assets/labs/lab-4/15.3.png)
![15](/assets/labs/lab-4/15.4.png)
![15](/assets/labs/lab-4/15.5.png)
![15](/assets/labs/lab-4/15.6.png)
![15](/assets/labs/lab-4/15.7.png)
 ### Висновки
 У ході виконання лабораторної роботи було опановано інструменти логування Morgan та Winston, що дозволило налаштувати професійну фіксацію HTTP-запитів і системних подій у консоль та файли. Завдяки використанню бібліотеки Multer реалізовано механізм завантаження файлів із налаштуванням кастомного сховища, обмеженням розміру та перевіркою дозволених форматів. Також було впроваджено моніторинг продуктивності через вбудовані модулі Node.js та менеджер процесів PM2, що забезпечило контроль за використанням ресурсів і стабільністю роботи сервера.