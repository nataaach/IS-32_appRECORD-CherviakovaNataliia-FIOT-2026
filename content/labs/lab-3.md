## ТЕМА, МЕТА ТА МІСЦЕ РОЗТАШУВАННЯ

*   **Тема:** РОЗРОБКА ФУНКЦІОНАЛЬНОГО REST API. РЕЄСТРАЦІЯ ТА АВТОРИЗАЦІЯ КОРИСТУВАЧІВ. ВАЛІДАЦІЯ ДАНИХ І ОБРОБКА ПОМИЛОК.
*   **Мета:** Вивчити принципи побудови REST API. Набути практичних навичок розробки серверного застосунку з використанням платформи Node.js і фреймворку Express. Реалізувати механізми реєстрації та авторизації користувачів, забезпечити валідацію вхідних даних і обробку помилок. Організувати захищений доступ до ресурсів із використанням JWT-токенів, системи ролей користувачів, а також інтегрувати зовнішню авторизацію OAuth (Google Login).

*   **Місце розташування:**
    *   **Репозиторій власного веб-застосунку (GitHub):** [github.com/nataaach/glowandcare](https://github.com/nataaach/glowandcare)
    *   **Власний веб-застосунок (Жива сторінка):** [nataaach.github.io/glowandcare](https://nataaach.github.io/glowandcare/)
    *   **Репозиторій звітного HTML-документа:** [github.com/nataaach/IS-32_appRECORD...](https://github.com/nataaach/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026)
    *   **Звітний HTML-документ (Жива сторінка):** [nataaach.github.io/IS-32_appRECORD...](https://nataaach.github.io/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026/)

*   **Завдання:** 
1. Встановити необхідні бібліотеки
2. Реалізувати реєстрацію та авторизацію користувача
3. Додати валідацію даних, обробку помилок
4. Реалізувати захищений маршрут
5. Протестувати API через Postman або curl
6. Проаналізувати отримані результати
7. Додати підтвердження пароля при реєстрації
8. Додати роль користувача (admin/user)
9. Реалізувати logout
10. Додати оновлення профілю
11. Зберігати користувачів у базі
12. Реалізувати refresh token
13. Додати логування помилок
14. Обмежити кількість спроб входу
15. Додати middleware для перевірки токена
16. Реалізувати зміну пароля
17. Реалізувати видалення користувача
18. Реалізувати відновлення пароля
19. Додати підтвердження email
20. Реалізувати OAuth (Google login)
### Завдання 1. Встановити необхідні бібліотеки

Для реалізації функціоналу було встановлено та підключено необхідні модулі: `express` для сервера, `bcryptjs` для безпеки паролів, `jsonwebtoken` для авторизації, а також бібліотеки для роботи з БД, обмеження запитів та OAuth.
 ![libraries](/assets/labs/lab-3/lib.png)
 ### Завдання 8, 11, 12, 19. Зберігати користувачів у базі (Додавання ролей користувачам, зберігання користувачів у базі, реалізація Refresh токена, додавання підтвердження email)
 Всі зміни внесені у файл моделі `models/User.js`.
 ```javascript
 import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    //Ролі
    role: { 
        type: DataTypes.STRING, 
        defaultValue: 'user' 
    },
    //Підтвердження email
    isEmailConfirmed: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    confirmationToken: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    //Відновлення пароля
    resetPasswordToken: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    // Рефреш токену
    refreshToken: { 
        type: DataTypes.STRING, 
        allowNull: true 
    }
}, {
    tableName: 'users', 
    timestamps: true   
});

export default User;
```
![role](/assets/labs/lab-3/role.png)

### Завдання 13. Додати логування помилок
Усі зміни у файлі`server.js`.
 ```javascript
//Логування помилок 
const logError = (error) => {
    const logMessage = `${new Date().toISOString()} - ${error.message}\n`;
    fs.appendFileSync("error.log", logMessage);
    console.error(error);
};

app.get('/', async (req, res) => {
    try {
        const products = await db.Product.findAll();
        const categories = await db.Category.findAll();
        res.render('index', { products, categories });
    } catch (err) {
        logError(err); 
        res.status(500).send("Помилка бази даних");
    }
});

app.get('/admin', async (req, res) => {
    try {
        const products = await db.Product.findAll();
        res.render('admin', { products });
    } catch (err) {
        logError(err); 
        res.status(500).send("Не вдалося відкрити адмінку");
    }
});

app.get('/auth', (req, res) => {
    res.render('auth');
});

app.post('/add-product', async (req, res) => {
    try {
        const { name, price, image } = req.body;
        await db.Product.create({ 
            name, 
            price, 
            image: image || 'product-1.png' 
        });
        res.redirect('/admin');
    } catch (err) {
        logError(err); 
        res.status(500).send("Помилка при додаванні");
    }
});

app.post('/delete-product/:id', async (req, res) => {
    try {
        await db.Product.destroy({ where: { id: req.params.id } });
        res.redirect('/admin');
    } catch (err) {
        logError(err); 
        res.status(500).send("Помилка при видаленні");
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await db.User.create({ 
            username: username || email.split('@')[0], 
            email, 
            password: password || 'password123',
            role: 'user' // п. 8
        });
        res.redirect('/');
    } catch (err) {
        logError(err); 
        res.status(500).send("Помилка реєстрації");
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.User.findOne({ where: { email, password } });
        if (user) {
            res.redirect('/');
        } else {
            res.status(401).send("Невірні дані");
        }
    } catch (err) {
        logError(err); 
        res.status(500).send("Помилка входу");
    }
});
```
### Завдання 15. Додати middleware для перевірки токена
Функція для захисту маршрутів від неавторизованих запитів.
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Немає токена" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), "secret"); 
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: "Недійсний токен" });
    }
};

module.exports = authenticateToken;
```

### Завдання 14. Обмежити кількість спроб входу
Захист від Brute-force атак (максимум 5 спроб на 15 хвилин).
 ```javascript
// Обмеження спроб входу 
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: "Забагато спроб входу. Спробуйте знову через 15 хвилин.",
    standardHeaders: true, 
    legacyHeaders: false,
});
```
### Завдання 20. Реалізувати OAuth (Google login)
Маршрут для входу через Google із генерацією JWT.
 ```javascript
app.post('/api/auth/google', async (req, res) => {
    try {
        const { idToken } = req.body;
        
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
        });
        
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await db.User.findOne({ where: { email } });
        if (!user) {
            user = await db.User.create({
                username: name,
                email: email,
                password: null, 
                role: 'user'
            });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: "Успішний вхід через Google", token, user });
    } catch (err) {
        logError(err);
        res.status(400).json({ message: "Помилка Google авторизації" });
    }
});
```
### Завдання 2, 3, 7. Реєстрація та авторизація, валідація даних та підтвердження пароля
Обробка реєстрації з хешуванням пароля та валідацією полів.
 ```javascript
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Завдання 3
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Всі поля обов'язкові" });
        }

        // Завдання 7
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Паролі не співпадають" });
        }

        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email вже існує" });

        // Завдання 2
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Генерація токена підтвердження 
        const confirmToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1d' });

        const userCount = await db.User.count();
        const newUser = await db.User.create({ 
            username, 
            email, 
            password: hashedPassword,
            role: userCount === 0 ? 'admin' : 'user', 
            confirmationToken: confirmToken
        });

        console.log(`[EMAIL SIMULATION]: Підтвердіть пошту: http://localhost:5000/confirm/${confirmToken}`);
        res.status(201).json({ message: "Користувача створено. Перевірте консоль для підтвердження email." });
    } catch (err) {
        logError(err); 
        res.status(500).send("Помилка реєстрації");
    }
});
```
### Завдання 19. Підтвердження email
 ```javascript
app.get("/confirm/:token", async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { confirmationToken: req.params.token } });
        if (!user) return res.status(400).send("Недійсний або прострочений токен");
        
        user.isEmailConfirmed = true;
        user.confirmationToken = null;
        await user.save();
        
        res.send("<h1>Email успішно підтверджено!</h1><p>Тепер ви можете увійти у свій акаунт.</p>");
    } catch (error) {
        logError(error); 
        res.status(500).send("Помилка підтвердження");
    }
});
```
### Завдання 2, 12. Авторизація та реалізація refresh token
 ```javascript
app.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.User.findOne({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            if (!user.isEmailConfirmed) {
                return res.status(403).json({ message: "Будь ласка, підтвердіть вашу пошту!" });
            }
            const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            
            const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
            
            await user.update({ refreshToken });

            res.json({ message: "Успішний вхід", token, refreshToken });
        } else {
            res.status(401).send("Невірні дані");
        }
    } catch (err) {
        logError(err); 
        res.status(500).send("Помилка входу");
    }
});

app.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh Token відсутній" });

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await db.User.findOne({ where: { id: decoded.id, refreshToken } });

        if (!user) return res.status(403).json({ message: "Недійсний Refresh Token" });

        const newToken = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token: newToken });
    } catch (err) {
        logError(err);
        res.status(403).json({ message: "Помилка оновлення токена" });
    }
});
```
### Завдання 4. Реалізувати захищений маршрут
 ```javascript
app.get("/profile", authenticateToken, async (req, res) => {
    try {
        // Шукаємо користувача за ID, який ми дістали з токена в Middleware
        const user = await db.User.findByPk(req.user.id, { 
            attributes: ['username', 'email', 'role'] 
        });
        
        if (!user) return res.status(404).json({ message: "Користувача не знайдено" });
        
        res.json(user);
    } catch (err) {
        logError(err);
        res.status(500).json({ message: "Помилка сервера" });
    }
});
```
### Завдання 10. Додати оновлення профілю
 ```javascript
app.put("/profile/update", authenticateToken, async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }
        if (username) user.username = username;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.json({ 
            message: "Профіль успішно оновлено",
            user: { username: user.username, email: user.email }
        });
    } catch (err) {
        logError(err); 
        res.status(500).json({ message: "Помилка при оновленні профілю" });
    }
});
```
### Завдання 16. Реалізувати зміну пароля
 ```javascript
app.post("/profile/change-password", authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "Будь ласка, заповніть усі поля" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "Нові паролі не збігаються" });
        }
        const user = await db.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Поточний пароль введено невірно" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Пароль успішно змінено!" });

    } catch (err) {
        logError(err); 
        res.status(500).json({ message: "Помилка при зміні пароля" });
    }
});
```
### Завдання 17. Реалізувати видалення користувача
 ```javascript
app.delete("/profile/delete", authenticateToken, async (req, res) => {
    try {
        const { password } = req.body; 

        const user = await db.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }

        if (password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Пароль невірний. Видалення скасовано." });
            }
        }
        await user.destroy();

        res.json({ message: "Обліковий запис успішно видалено." });
    } catch (err) {
        logError(err);
        res.status(500).json({ message: "Помилка при видаленні акаунта" });
    }
});
```
### Завдання 18. Реалізувати відновлення пароля
 ```javascript
app.post("/forgot-password", async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { email: req.body.email } });
        
        if (user) {
            const resetToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
            user.resetPasswordToken = resetToken;
            await user.save();
            
            console.log(`\x1b[33m%s\x1b[0m`, `[EMAIL SEND]: Відновлення пароля для ${user.email}: http://localhost:5000/reset-password/${resetToken}`);
        }

        res.json({ message: "Якщо email існує, ми надіслали інструкції." });
    } catch (err) {
        logError(err);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

app.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, SECRET_KEY);
        
        const user = await db.User.findOne({ where: { id: decoded.id, resetPasswordToken: token } });

        if (!user) {
            return res.status(400).json({ message: "Токен недійсний або застарілий" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        await user.save();

        res.json({ message: "Пароль успішно змінено! Тепер ви можете увійти." });
    } catch (err) {
        logError(err);
        res.status(400).json({ message: "Помилка: токен прострочений або невірний" });
    }
});
```
### Завдання 9. Реалізувати logout
 ```javascript
app.post("/logout", authenticateToken, async (req, res) => {
    try {
        const user = await db.User.findByPk(req.user.id);

        if (user) {
            await user.update({ refreshToken: null });
            
            res.json({ message: "Вихід успішний. Токен анульовано." });
        } else {
            res.status(404).json({ message: "Користувача не знайдено" });
        }
    } catch (err) {
        logError(err); 
        res.status(500).json({ message: "Помилка при виході з системи" });
    }
});
```
## 3. Тестування API 
### 1. Синхронізація БД та запуск сервера
![Запуск сервера](/assets/labs/lab-3/db.png)
### 2. Реєстрація користувача (POST /register)
![Реєстрація](/assets/labs/lab-3/register.png)
### 3. Підтвердження Email (GET /confirm)
![Підтвердження пошти](/assets/labs/lab-3/confirm.png)
### 4. Авторизація користувача (POST /login)
![Вхід](/assets/labs/lab-3/login.png)
### 5. Доступ до захищеного профілю (GET /profile)
![Профіль](/assets/labs/lab-3/profile.png)
### 6. Вихід із системи (POST /logout) 
![Вихід](/assets/labs/lab-3/logout.png)
---
# Висновки
У ході роботи було розроблено надійну систему автентифікації на базі Node.js та Express, що використовує сучасний стандарт JWT для безпечної передачі даних користувача. Реалізована архітектура з використанням Access та Refresh токенів забезпечує високий рівень захисту сесій, дозволяючи безпечно оновлювати доступ без повторного введення пароля. Впровадження обов'язкового підтвердження Email через унікальний токен та імітація розсилки листів демонструє розуміння повного життєвого циклу реєстрації користувача. Завдяки використанню Sequelize ORM та бази даних MySQL було забезпечено структуроване зберігання користувачів із розмежуванням ролей (admin/user) для контролю доступу до ресурсів.
Успішне тестування всіх маршрутів через Postman, включаючи реєстрацію, логін та вихід (logout), підтверджує коректність обробки запитів, валідації даних та стійкість серверної частини до помилок.