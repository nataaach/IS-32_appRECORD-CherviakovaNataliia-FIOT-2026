## ТЕМА, МЕТА ТА МІСЦЕ РОЗТАШУВАННЯ

*   **Тема:** Створення бази даних у MySQL. Підключення Node.js до MySQL. Робота з ORM Sequelize.
*   **Мета:** 
    *   Навчитися створювати базу даних у MySQL.
    *   Освоїти виконання SQL-запитів (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
    *   Підключати серверну програму на Node.js до бази даних.
    *   Використовувати ORM Sequelize для роботи з БД.
    *   Реалізувати зв’язок One-to-Many між таблицями.
*   **Завдання:** 
* Створити базу даних 'cosmetics_shop_db' для власного вебдодатку.
* Створити таблиці.
* Виконати SQL-запити: SELECT, INSERT, UPDATE, DELETE.
* Підключити Node.js до MySQL через пакет `mysql2`.
* Використати ORM Sequelize для створення моделей та реалізації зв’язку One-to-Many.

*   **Місце розташування:**
    *   **Репозиторій власного веб-застосунку (GitHub):** [github.com/nataaach/glowandcare](https://github.com/nataaach/glowandcare)
    *   **Власний веб-застосунок (Жива сторінка):** [nataaach.github.io/glowandcare](https://nataaach.github.io/glowandcare/)
    *   **Репозиторій звітного HTML-документа:** [github.com/nataaach/IS-32_appRECORD...](https://github.com/nataaach/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026)
    *   **Звітний HTML-документ (Жива сторінка):** [nataaach.github.io/IS-32_appRECORD...](https://nataaach.github.io/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026/)


## Теоретичні відомості

* **MySQL** — реляційна система керування базами даних, що використовує SQL.
* **Node.js** — середовище виконання JavaScript для серверних застосунків.
* **Sequelize** — ORM бібліотека, яка відображає структуру БД у вигляді JavaScript-об’єктів.
* **mysql2** — драйвер, що забезпечує мережеве з’єднання між Node.js та MySQL.
* **Зв'язок One-to-Many** — тип зв'язку, де один запис першої таблиці пов'язаний з багатьма записами другої (наприклад, один тип косметики(тональні засоби) має багато продуктів).

## Реалізація таблиці БД 
Створення таблиці відбувалось за раніше побудованною ER моделлю. 
    ![ER-model](/assets/labs/lab-2/er-model.png)

### Структура проєкту (Backend)
* **`config/database.js`** — конфігурація підключення до MySQL.
    ![DB configuration](/assets/labs/lab-2/code1.png)
* **`models/`** — опис моделей `Category.js`, `Product.js`, і т.д.
    ![Module dir structure](/assets/labs/lab-2/models.png)
* **`models/index.js`** — опис зв'язків моделей.
    ![index.js code](/assets/labs/lab-2/code3.png)
* **`server.js`** — основний файл сервера та синхронізація моделей.
    ![Server db code](/assets/labs/lab-2/server.png)
* **`test-db.js`** — скрипт для покрокової демонстрації CRUD та SQL запитів (тестування підключення).

```
const { sequelize, Category, Product } = require('./models/index'); 
const mysql = require('mysql2/promise');
const readline = require('readline');

function pause(message) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(`\n>>> ${message}. Натисніть Enter...`, () => {
        rl.close();
        resolve();
    }));
}

async function rawSqlOperations(connection) {
    console.log('\n--- ЕТАП 1: RAW SQL ---');
    
    const [insertRes] = await connection.execute(
        'INSERT INTO Categories (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())', 
        ['Тестова Категорія SQL']
    );
    const catId = insertRes.insertId;
    console.log('SQL: Категорію додано. ID:', catId);

    const [rows] = await connection.execute('SELECT * FROM Categories WHERE id = ?', [catId]);
    console.log('SQL: Отримано дані:', rows[0]);

    await connection.execute('UPDATE Categories SET name = ? WHERE id = ?', ['Оновлена Категорія SQL', catId]);
    console.log('SQL: Назву оновлено.');

    return catId;
}


async function ormOperations(categoryId) {
    console.log('\n--- ЕТАП 2: SEQUELIZE ORM ---');

    const product = await Product.create({
        name: 'Тестовий Крем ORM',
        price: 450.00,
        composition: 'Натуральні компоненти',
        volume: '50 мл',
        categoryId: categoryId 
    });
    console.log('ORM: Продукт створено:', product.name);

    // READ with JOIN (SELECT + JOIN)
    const foundProduct = await Product.findByPk(product.id, {
        include: [{ model: Category, as: 'category' }]
    });
    console.log(`ORM: Знайдено товар "${foundProduct.name}" у категорії "${foundProduct.category.name}"`);

    await Product.update(
        { price: 399.99 },
        { where: { id: product.id } }
    );
    console.log('ORM: Ціну оновлено до 399.99');

    return product.id;
}


async function runDemo() {
    let rawConnection;
    try {
        rawConnection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', 
            database: 'cosmetics_shop_db'
        });

        console.log('З\'єднання встановлено. Починаємо тест...');

        await sequelize.sync({ alter: true });
        console.log('ORM: Моделі синхронізовано з БД.');

        await pause('Крок 1: Робота з Raw SQL (Категорії)');
        const categoryId = await rawSqlOperations(rawConnection);

        await pause('Крок 2: Робота з Sequelize (Продукти + Зв\'язок One-to-Many)');
        const productId = await ormOperations(categoryId);

        await pause('Крок 3: Очищення бази (DELETE)');
        
        await Product.destroy({ where: { id: productId } });
        console.log('ORM: Продукт видалено.');

        // SQL Delete
        await rawConnection.execute('DELETE FROM Categories WHERE id = ?', [categoryId]);
        console.log('SQL: Категорію видалено.');

        console.log('\nВсі операції виконано коректно.');

    } catch (error) {
        console.error('\nПОМИЛКА:', error.message);
    } finally {
        if (rawConnection) await rawConnection.end();
        await sequelize.close();
        process.exit(0);
    }
}

runDemo();
```
  ---

### Створені таблиці моделей `User.js`, `Category.js`,`Product.js`, `Order.js` 
1. User model
    ![User model code](/assets/labs/lab-2/code2.png)
    ![User table](/assets/labs/lab-2/user-table-1.png)
    ![User table](/assets/labs/lab-2/user-table-2.png)
2. Category model
    ![Category model code](/assets/labs/lab-2/code4.png)
    ![Category table](/assets/labs/lab-2/category-table-1.png)
    ![Category table](/assets/labs/lab-2/category-table-2.png)
3. Product model
    ![Product model code](/assets/labs/lab-2/code5.png)
    ![Product table](/assets/labs/lab-2/product-table-1.png)
    ![Product table](/assets/labs/lab-2/product-table-2.png)
4. Order model
    ![Order model code](/assets/labs/lab-2/code6.png)
    ![Order table](/assets/labs/lab-2/order-table-1.png)
    ![Order table](/assets/labs/lab-2/order-table-2.png)
---

### Реалізація **Зв'язку One-to-Many** між `Category.js``Product.js`, `User.js``Order.js`та  **Зв'язку Many-to-Many** між `Product.js``Order.js` 
    ![One-to-many (many-to-many)relation code](/assets/labs/lab-2/code7.png)

---
### Програмний код тестового сценарію (`test-db.js`)

#### 1. Робота з Raw SQL (Драйвер `mysql2`)
Демонстрація виконання прямих запитів без використання ORM. 
```
// Raw SQL (mysql2)
async function insertCategoryRaw(connection) {
    console.log('SQL: Виконую INSERT INTO Categories...');
    await connection.execute('INSERT INTO Categories (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())', ['Тестова Категорія']);
    console.log('Дані вставлено успішно.');
}

async function selectCategoryRaw(connection) {
    console.log('SQL: Виконую SELECT FROM Categories...');
    const [categories] = await connection.execute('SELECT * FROM Categories WHERE name = ?', ['Тестова Категорія']);
    console.log('Результат SELECT:', categories[0]);
    return categories[0]?.id;
}

async function updateCategoryRaw(connection, id) {
    console.log('SQL: Виконую UPDATE Categories...');
    await connection.execute('UPDATE Categories SET name = ? WHERE id = ?', ['Оновлена Категорія SQL', id]);
    console.log('Запис оновлено.');
}

async function deleteCategoryRaw(connection, id) {
    console.log('SQL: Виконую DELETE FROM Categories...');
    await connection.execute('DELETE FROM Categories WHERE id = ?', [id]);
    console.log('Запис видалено.');
}
```
#### 2. Робота з Sequelize

```
// Sequelize (ORM)
async function syncDatabase() {
    await sequelize.sync({ alter: true });
    console.log('ORM: Таблиці Glow&Care синхронізовано.');
}

// INSERT
async function insertProductSequelize(catId) {
    const product = await Product.create({
        name: 'Тестовий Крем ORM',
        price: 450.00,
        composition: 'Натуральні компоненти',
        volume: '50 мл',
        categoryId: catId
    });
    console.log('ORM: Товар створено через Product.create().');
    return product;
}

// SELECT
async function selectProductSequelize(productId) {
    const productData = await Product.findByPk(productId, { 
        include: { model: Category, as: 'category' } // Зв'язок One-to-Many
    });
    if (productData) {
        console.log(`ORM: Знайдено товар: ${productData.name}, Категорія: ${productData.category.name}`);
    }
    return productData;
}

// UPDATE
async function updateProductSequelize(productId) {
    await Product.update(
        { price: 399.99 }, 
        { where: { id: productId } }
    );
    console.log('ORM: Ціну товару оновлено через Product.update().');
}

// DELETE
async function deleteProductSequelize(productId) {
    await Product.destroy({ 
        where: { id: productId } 
    });
    console.log('ORM: Товар видалено через Product.destroy().');
}
```

## ВИСНОВКИ

1.  **Створення бази даних:** На локальному сервері MySQL було створено базу даних `cosmetics_shop_db` з відповідною структурою таблиць (`users`, `categories`, `products`, `orders`), що відповідає розробленій ER-моделі.
2.  **Робота з Raw SQL:** Освоєно виконання прямих SQL-запитів через драйвер `mysql2/promise`. Перевірено працездатність операцій `SELECT` та `INSERT` без використання ORM.
3.  **Інтеграція Node.js та Sequelize:** * Налаштовано підключення серверної частини на Node.js до MySQL.
    * Реалізовано опис моделей даних (`Category`, `Product` тощо) та встановлено зв'язки між ними.
4.  **Реалізація зв'язків:** Успішно впроваджено зв'язок **One-to-Many** (одна категорія — багато товарів), що дозволяє виконувати складні запити з об'єднанням таблиць (JOIN) засобами Sequelize.
5.  **Тестування:** За допомогою створеного скрипту `test-db.js` було проведено повне тестування. Результати в консолі підтвердили успішну аутентифікацію та коректне отримання даних з БД.
![Результат успішного тестування БД](/assets/labs/lab-2/test-success.png)