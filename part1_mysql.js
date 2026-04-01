import mysql from 'mysql2/promise';

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root', 
        password: '', 
        database: 'cosmetics_shop_db'
    });

    console.log('З’єднано з базою даних!');

    try {
        const [insertResult] = await connection.execute(
            'INSERT INTO products (name, price, stars, image_url) VALUES (?, ?, ?, ?)',
            ['GLOW NIGHT CREAM', 850.00, 5, 'night_cream.jpg']
        );
        console.log(`Додано товар з ID: ${insertResult.insertId}`);

        const [rows] = await connection.execute('SELECT * FROM products');
        console.log('Список товарів у базі:', rows);

        await connection.execute(
            'UPDATE products SET price = ? WHERE name = ?',
            [450.00, 'LIP GLOSS AMOUR']
        );
        console.log('Ціну оновлено!');

    } catch (err) {
        console.error('Помилка при роботі з БД:', err);
    } finally {
        await connection.end();
        console.log('Підключення закрито.');
    }
}

main();