## ТЕМА, МЕТА ТА МІСЦЕ РОЗТАШУВАННЯ

*   **Тема:** «Документування API за допомогою Swagger Деплой Node.js-додатку. Підсумковий проєкт: REST API з MySQL».

*   **Мета:**  вивчити принципи документування REST API; навчитися використовувати Swagger/OpenAPI для автоматичної генерації документації; 
інтегрувати Swagger UI у Node.js застосунок; створювати опис ендпоінтів та моделей даних; підготувати застосунок до деплою на хмарний сервіс та 
провести фінальне тестування через вебінтерфейс.

*   **Місце розташування:**
    *   **Репозиторій власного веб-застосунку (GitHub):** [github.com/nataaach/glowandcare](https://github.com/nataaach/glowandcare)
    *   **Власний веб-застосунок (Жива сторінка):** [nataaach.github.io/glowandcare](https://nataaach.github.io/glowandcare/)
    *   **Репозиторій звітного HTML-документа:** [github.com/nataaach/IS-32_appRECORD...](https://github.com/nataaach/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026)
    *   **Звітний HTML-документ (Жива сторінка):** [nataaach.github.io/IS-32_appRECORD...](https://nataaach.github.io/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026/)

    ### Завдання 1. Створити REST API на Node.js + Express.
    ### Завдання 2. Підключити MySQL. Реалізувати CRUD-операції.
      Для підсумкового проєкту реалізовано повноцінне REST API на базі Node.js та фреймворку Express, із використанням реляційної бази даних MySQL та Sequelize ORM для управління даними.
     *   **Основні можливості системи:** 
1. Управління користувачами та безпека: реалізована надійна система реєстрації та автентифікації за допомогою JWT (JSON Web Tokens). Паролі зберігаються у хешованому вигляді (bcrypt), впроваджено механізм оновлення токенів (Refresh Tokens) та підтвердження реєстрації через email.

2. Каталог товарів: створено API-ендпоінти для отримання списку продукції, фільтрації за категоріями та динамічного оновлення асортименту (CRUD операції).

3. Система замовлень: реалізована логіка оформлення замовлень із валідацією вхідних даних на стороні сервера (ім'я, email, телефон) та автоматичним очищенням кешу для підтримки актуальності даних.

     *   **Оптимізація та захист:** 

1. Кешування: використано node-cache для прискорення відповіді сервера при запитах до популярних категорій товарів.

2. Безпека: впроваджено обмеження кількості запитів (rate-limiting) для захисту від brute-force атак та Helmet.js для налаштування безпечних HTTP-заголовків.
    ### Завдання 3. Інтегрувати Swagger UI у проєкт.
    Встановлено бібліотеки `swagger-ui-express` та `swagger-jsdoc`. У файлі `server.js` налаштовано конфігурацію, яка зчитує JSDoc-коментарі прямо з коду.
```javascript 
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Glow & Care API',
            version: '1.0.0',
            description: 'Документація REST API для магазину косметики Glow & Care',
        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: ['./server.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```
### Завдання 4. Задокументувати всі endpoint-и
Товари та Головна сторінка
```javascript 
/**
 * @swagger
 * /:
 *   get:
 *     summary: Головна сторінка (EJS)
 *     description: Відображає головну сторінку з продуктами та категоріями. Використовує кешування.
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: HTML сторінка успішно завантажена
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Отримати всі товари (JSON)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Масив об'єктів товарів
 */
```
Автентифікація (Вхід, Реєстрація, Google)
```javascript 
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               confirmPassword: { type: string }
 *     responses:
 *       201:
 *         description: Користувача створено
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Вхід у систему
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Повертає JWT та Refresh Token
 *       401:
 *         description: Невірні дані
 */

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Вхід через Google
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Успішна авторизація через Google
 */
```
Профіль користувача (Потребує токена)
```javascript 
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Отримати дані профілю
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Дані поточного користувача
 */

/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary: Оновити ім'я або пароль
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профіль оновлено
 */

/**
 * @swagger
 * /profile/change-password:
 *   post:
 *     summary: Зміна пароля користувача
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Пароль успішно змінено
 */

/**
 * @swagger
 * /profile/delete:
 *   delete:
 *     summary: Видалення облікового запису
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Акаунт видалено
 */
```
Замовлення та Керування товарами
```javascript 
/**
 * @swagger
 * /create-order:
 *   post:
 *     summary: Створити нове замовлення
 *     tags: [Orders]
 *     responses:
 *       201:
 *         description: Замовлення прийнято
 */

/**
 * @swagger
 * /add-product:
 *   post:
 *     summary: Додати новий товар (Admin)
 *     tags: [Admin]
 *     responses:
 *       302:
 *         description: Редірект в адмінку
 */

/**
 * @swagger
 * /delete-product/{id}:
 *   post:
 *     summary: Видалити товар (Admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       302:
 *         description: Товар видалено
 */
```
Відновлення та токени
```javascript 
/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Оновити Access Token
 *     tags: [Tokens]
 *     responses:
 *       200:
 *         description: Новий токен видано
 */

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Запит на відновлення пароля
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Інструкції надіслано на пошту
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Вихід із системи
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Вихід успішний
 */
```
### Завдання 5. Підготовка до деплою
Для коректної роботи застосунку на зовнішніх серверах було внесено такі зміни:
1.  **Налаштування порту**: Використано змінну оточення `process.env.PORT`.
2.  **Start-script**: У `package.json` додано команду `"start": "node server.js"` для автоматичного запуску сервісом деплою.
3.  **Змінні середовища**: Конфіденційні дані (ключі БД, секрети JWT) винесено в змінні оточення.
### Завдання 6. Тестування Swagger UI
### 6.1 Робота Swagger UI 
За адресою `http://localhost:3000/api-docs` доступна інтерактивна документація. 
     ![task6](/assets/labs/lab-5/6.png)
     ![task6.1](/assets/labs/lab-5/6.1.png)
### 6.2 Тестування ендпоінтів
Проведено успішне тестування через функцію **"Try it out"**.
 ![task6.2](/assets/labs/lab-5/6.2.png)
![task6.2.1](/assets/labs/lab-5/6.2.1.png)
![task6.2.2](/assets/labs/lab-5/6.2.2.png)
### 6.3 Оптимізація та Кешування
Логи сервера підтверджують, що документація Swagger також користується системою кешування. 
Повторні запити обробляються швидше, що доводить високу продуктивність підсумкового проєкту.
![task6.3](/assets/labs/lab-5/6.3.png)
### Висновки
У ході виконання лабораторної роботи №6 було успішно завершено розробку та налаштування серверної частини проєкту Glow & Care — сучасного REST API для магазину косметики.
