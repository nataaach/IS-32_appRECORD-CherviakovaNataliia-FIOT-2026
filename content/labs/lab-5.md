## ТЕМА, МЕТА ТА МІСЦЕ РОЗТАШУВАННЯ

*   **Тема:** Безпека та продуктивність серверних додатків Безпека Node.js-додатків Оптимізація запитів і кешування Тестування API
*   **Мета:** 
1. забезпечувати базову безпеку Node.js-додатків; 
2. оптимізувати продуктивність REST API; 
3. використовувати кешування для зменшення навантаження на сервер; 
4. тестувати API за допомогою сучасних інструментів;
5. аналізувати продуктивність backend-застосунків.

*   **Місце розташування:**
    *   **Репозиторій власного веб-застосунку (GitHub):** [github.com/nataaach/glowandcare](https://github.com/nataaach/glowandcare)
    *   **Власний веб-застосунок (Жива сторінка):** [nataaach.github.io/glowandcare](https://nataaach.github.io/glowandcare/)
    *   **Репозиторій звітного HTML-документа:** [github.com/nataaach/IS-32_appRECORD...](https://github.com/nataaach/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026)
    *   **Звітний HTML-документ (Жива сторінка):** [nataaach.github.io/IS-32_appRECORD...](https://nataaach.github.io/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026/)

    ### Завдання 1. Створення проєкту.
     ![task1](/assets/labs/lab-5/1.png)
    ### Завдання 2. Встановлення залежностей.
    Для реалізації завдань лабораторної роботи було встановлено пакети для безпеки, валідації, кешування та тестування:
     ![task2](/assets/labs/lab-5/2.png)
     ![task3](/assets/labs/lab-5/3.png)
    ### Завдання 3. Базова безпека: Helmet та Rate-Limit
У головний файл `server.js` інтегровано Middleware для захисту HTTP-заголовків та обмеження частоти запитів для захисту від DDoS та Brute-force:
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet()); 

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, // максимум 100 запитів з одного IP
    message: { error: "Забагато запитів, спробуйте пізніше" }
});
app.use(limiter);
```
### Завдання 4. Валідація даних (express-validator)
Для запобігання збереженню некоректних даних реалізовано строгу перевірку вхідних параметрів на маршруті створення замовлення:
```javascript
app.post('/create-order', [
    body('customerName').notEmpty().withMessage("Будь ласка, вкажіть ваше ім'я"), 
    body('email').isEmail().withMessage("Введіть коректну адресу пошти"), 
    body('phone').isLength({ min: 10 }).withMessage("Номер телефону має містити мінімум 10 цифр"), 
    body('address').notEmpty().withMessage("Адреса доставки обов'язкова") 
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg }); 
    }

    try {
        const { customerName, email, phone, address, cartItems } = req.body;
        cache.del('main_page_data'); 
        
        res.status(201).json({ message: "Замовлення успішно прийнято!" });
    } catch (err) {
        logError(err);
        res.status(500).json({ error: "Сталася помилка при оформленні замовлення" });
    }
});
```
### Завдання 5. Оптимізація та In-Memory Кешування (node-cache)
У маршруті app.get('/') додано перевірку: якщо дані про товари та категорії вже є в кеші, сервер віддає їх миттєво без звернення до БД.
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 });

app.get('/api/products', async (req, res) => {
    try {
        const cachedProducts = cache.get('products_list');
        if (cachedProducts) {
            return res.json(cachedProducts);
        }

        const products = await db.Product.findAll(); 
        cache.set('products_list', products); 
        res.json(products);
    } catch (err) {
        logError(err); 
        res.status(500).json({ error: "Помилка сервера при отриманні товарів" });
    }
});
```
### Завдання 6. Автоматизоване тестування (Jest + Supertest)
Створено файл `api.test.js` для перевірки ключових маршрутів API на відповідність очікуваним статус-кодам та форматам відповідей.
```javascript
const request = require('supertest');
const SERVER_URL = 'http://localhost:3000';

describe('Glow & Care API Tests', () => {
    
    test('GET /api/products має повертати статус 200 та масив товарів', async () => {
        const response = await request(SERVER_URL).get('/api/products');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy(); 

    });

    test('Захищений маршрут /profile без токена має видати 401', async () => {
        const response = await request(SERVER_URL).get('/profile');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Немає токена");
    });

    test('Маршрут /admin без токена має видати 401', async () => {
        const response = await request(SERVER_URL).get('/admin');
        expect(response.statusCode).toBe(401);
    });

    test('POST /register з пустими полями має повертати 400', async () => {
        const response = await request(SERVER_URL)
            .post('/register')
            .send({ email: "test@mail.com" }); 
        expect(response.statusCode).toBe(400);
    });
});
```
### Завдання 7. Результати виконання та тестування
У терміналі було запущено команду `npm test`. Результат виконання продемонстрував успішне проходження всіх тестів:
     ![task7](/assets/labs/lab-5/7.png)
### Завдання 8. Навантажувальне тестування (Artillery)
Команда для симуляції 50 користувачів, кожен з яких робить по 20 запитів:
```bash
npx artillery quick --count 50 --num 20 http://localhost:3000/
```
**Результати звіту Artillery (З увімкненим кешуванням):**
* `http.requests`: 1000
* `http.codes.200`: 1000 (100% успішних відповідей)
* `http.request_rate`: 760 запитів на секунду.
* `http.response_time p95`: 34.1 мс.
* `http.response_time median`: 23.8 мс.
Завдяки впровадженню NodeCache, час відповіді сервера залишається низьким навіть при високому навантаженні (760 запитів/сек). Перший запит завантажив дані з бази даних, а всі наступні 999 запитів були миттєво отримані з оперативної пам'яті сервера, що значно розвантажило систему та забезпечило швидкий відгук для користувачів.
## Висновки
У ході виконання лабораторної роботи було суттєво підвищено рівень безпеки та продуктивності серверної частини застосунку .

1. **Безпека:**  Використання Helmet забезпечило надійне керування заголовками HTTP, блокуючи типові вразливості на кшталт XSS та "sniffing" атак. Завдяки express-rate-limit було встановлено інтелектуальний поріг запитів, що унеможливило перевантаження системи зловмисними скриптами та гарантувало доступність сервісу для реальних користувачів.

2. **Надійність даних:** Впровадження express-validator дозволило створити потужний шар пре-валідації. Це гарантує, що база даних працює виключно з чистими та структурованими об'єктами, що зводить до мінімуму виникнення помилок на рівні бізнес-логіки та забезпечує високу якість контенту в системі.

3. **Продуктивність:** Інтеграція node-cache трансформувала підхід до обробки даних, перенісши навантаження з дискової підсистеми MySQL в оперативну пам'ять. Тести Artillery підтвердили стабільну пропускну здатність у 760 запитів на секунду, демонструючи, що сервер обробляє повторні звернення майже миттєво, не створюючи черг на боці бази даних.

4. **Стабільність (QA):** Застосування методології автоматизованого тестування через Jest та Supertest дозволило створити "мережу безпеки" навколо коду. Це дає впевненість, що будь-які зміни в архітектурі або додавання нових фіч не порушать цілісність існуючих процесів, забезпечуючи передбачувану поведінку системи 24/7.

