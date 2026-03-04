
## ТЕМА, МЕТА ТА МІСЦЕ РОЗТАШУВАННЯ

* **Тема:** Веб-орієнтований застосунок магазину косметики «Glow & Care».
* **Мета:** Сформулювати ключові складові опису інформаційної системи та на основі досвіду розроблення адаптивного інтерфейсу створити веб-застосунок для коректного відображення на різних пристроях.
* **Місце розташування:**
    * **Репозиторій власного веб-застосунку (GitHub):** https://github.com/nataaach/glowandcare
    * **Власний веб-застосунок (Жива сторінка):** https://nataaach.github.io/glowandcare/
    * **Репозиторій звітного HTML-документа:** https://github.com/nataaach/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026
    * **Звітний HTML-документ (Жива сторінка):** https://nataaach.github.io/IS-32_appRECORD-CherviakovaNataliia-FIOT-2026/

---

## АНАЛІЗ ТА МОДЕЛЮВАННЯ СИСТЕМИ

### Актуальність теми
Актуальність зумовлена розвитком б'юті-індустрії та потребою користувачів у зручному доступі до засобів догляду. Адаптивність інтерфейсу дозволяє охопити мобільну аудиторію, забезпечуючи комфортну взаємодію з сайтом незалежно від типу пристрою.

###  Об’єкт та предмет роботи
* **Об’єкт роботи:** програмний продукт у вигляді веб-застосунку для онлайн-продажу косметики.
* **Предмет роботи:** властивості адаптивності, функціональні характеристики та логічна структура даних магазину «Glow & Care».

### Бізнес-логіка
Система реалізує наступні бізнес-процеси:
1. **Вибір товару:** користувач переглядає каталог та фільтрує продукцію за категоріями.
2. **Валідація:** оформлення замовлення можливе лише при заповненні контактних даних (ПІБ та телефон).
3. **Обробка:** після відправлення форми дані передаються менеджеру для підтвердження наявності товару.

### Функціональні та нефункціональні вимоги
**Функціональні вимоги:**
* Відображення карток товарів із фото, ціною та описом складу.
* Наявність форми для оформлення замовлення та додавання відгуків.
* Навігаційне меню для переходу між розділами сайту.

**Нефункціональні вимоги:**
Коректне відображення на екранах (ПК, планшет, смартфон).
Час завантаження сторінки до 3 секунд.
Інтуїтивно зрозумілий інтерфейс та семантична верстка.
Підтримка сучасних браузерів (Chrome, Firefox, Edge, Safari).
Використання якісних зображень товарів.

### Моделювання (Use-case та ER)
**Use-case діаграма:** Описує сценарії взаємодії користувача з функціями каталогу та замовлення.
![Use-case діаграма «Glow & Care»](/assets/labs/lab-1/diagram.png)
**ER-діаграма:** Відображає логічну структуру бази даних (Товари, Категорії, Замовлення, Користувач).
![ER діаграма «Glow & Care»](/assets/labs/lab-1/diagram2.png)
## Структура документа
### Структура сторінки `index.html` (Головна)
```
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glow & Care | Український бренд косметики</title>
    
    <link rel="stylesheet" href="css/style.css">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Montserrat:wght@300;500;700&display=swap" rel="stylesheet">
</head>
<body>

    <div class="announcement-bar">
        <p>Безкоштовна доставка від 1500 грн по Україні </p>
    </div>
<header class="header">
    <div class="container header-flex">
        <button class="burger-icon" aria-label="Меню">
            <span></span>
        </button>
        
        <div class="logo">
            <a href="/">GLOW & CARE</a>
        </div>

        <div class="header-links">
            <a href="#" class="text-link">ПОШУК</a>
            <a href="#" class="text-link">
                КОШИК (<span class="cart-count">0</span>)
            </a>
        </div>
    </div>
</header>

    <main id="MainContent">
        
        <section class="hero">
            <div class="hero-image-wrapper">
                <div class="hero-content">
                    <p class="hero-subtitle">Тільки з 1 по 20 квітня</p>
                    <h1 class="hero-title">IT’S TIME TO SHINE</h1>
                    <a href="#favorites" class="btn-primary">Переглянути</a>
                </div>
            </div>
        </section>

        <section class="products-section container" id="favorites">
            <h2 class="section-heading">ФАВОРИТИ</h2>
            
            <div class="product-grid">
                <article class="product-item">
                    <div class="product-media">
                        <span class="badge-sale">Sale</span>
                        <img src="scrin/product-1.png" alt="LIP GLOSS AMOUR" loading="lazy">
                    </div>
                    <div class="product-meta">
                        <h3 class="product-title">LIP GLOSS AMOUR</h3>
                        <div class="product-rating">⭐⭐⭐⭐⭐ (42)</div>
                        <p class="product-price">₴490.00 UAH</p>
                        <button class="btn-atc">В кошик</button>
                    </div>
                </article>

                <article class="product-item">
                    <div class="product-media">
                        <img src="scrin/product-2.png" alt="LIP GLOSS JAM" loading="lazy">
                    </div>
                    <div class="product-meta">
                        <h3 class="product-title">LIP GLOSS JAM</h3>
                        <div class="product-rating">⭐⭐⭐⭐⭐ (55)</div>
                        <p class="product-price">₴590.00 UAH</p>
                        <button class="btn-atc">В кошик</button>
                    </div>
                </article>

                <article class="product-item">
                    <div class="product-media">
                        <img src="scrin/product-3.png" alt="LIP GLOSS DREAM" loading="lazy">
                    </div>
                    <div class="product-meta">
                        <h3 class="product-title">LIP GLOSS DREAM</h3>
                        <div class="product-rating">⭐⭐⭐⭐☆ (104)</div>
                        <p class="product-price">₴520.00 UAH</p>
                        <button class="btn-atc">В кошик</button>
                    </div>
                </article>
            </div>
        </section>

        <section class="categories-grid container">
            <a href="#" class="category-card" style="background-image: url('scrin/multitaskers.png');">
                <span class="category-name">Мультитаскери</span>
            </a>
            <a href="#" class="category-card" style="background-image: url('scrin/care.png');">
                <span class="category-name">Доглядова косметика</span>
            </a>
        </section>

    </main>

   <footer class="footer">
    <div class="container footer-grid">
        <div class="footer-col footer-brand">
            <div class="footer-logo">GLOW & CARE</div>
            <div class="footer-socials">
                <a href="#">instagram</a>
                <a href="#">tiktok</a>
                <a href="#">facebook</a>
            </div>
        </div>

        <div class="footer-col">
            <h4 class="footer-title">ПОСИЛАННЯ</h4>
            <ul class="footer-links">
                <li><a href="#">ГАРАНТІЇ ТА ПОВЕРНЕННЯ</a></li>
                <li><a href="#">ПЕРСОНАЛЬНІ ДАНІ</a></li>
                <li><a href="#">ПУБЛІЧНА ОФЕРТА</a></li>
            </ul>
        </div>

        <div class="footer-col">
            <h4 class="footer-title">КАТАЛОГ</h4>
            <ul class="footer-links">
                <li><a href="#">ТОВАРИ</a></li>
                <li><a href="#">БЛОГ</a></li>
                <li><a href="#">ДОСТАВКА ТА ОПЛАТА</a></li>
                <li><a href="#">КОНТАКТИ</a></li>
            </ul>
        </div>

        <div class="footer-col footer-newsletter-col">
            <h4 class="footer-title">ПІДПИСКА</h4>
            <p class="footer-text">Лишай пошту та підписуйся на новини </p>
            <form class="newsletter-form">
                <input type="email" placeholder="Email" required>
                <button type="submit">→</button>
            </form>
        </div>
    </div>

    <div class="footer-bottom container">
        <small>© 2026, Glow & Care. Всі права захищені.</small>
        <small>На основі власної розробки</small>
    </div>
</footer>

    <script src="js/main.js"></script>
</body>
</html>
```
### Структура сторінки `style.css` 
```
:root {
    --primary-black: #202223;
    --accent-red: #E84C3D;
    --unico-pink: #f8dcdc;
    --soft-bg: #fceeee;
    --font-main: 'Montserrat', sans-serif;
    --container-width: 1200px;
    --header-height: 70px;
}


* { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
}

body {
    font-family: var(--font-main);
    color: var(--primary-black);
    background-color: #fff;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

.container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 20px;
}

.announcement-bar {
    background-color: var(--unico-pink);
    text-align: center;
    padding: 10px 0;
    font-size: 12px;
    letter-spacing: 1.5px;
    font-weight: 500;
}

.header {
    height: var(--header-height);
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.98);
    z-index: 1000;
}

.header-flex {
    display: grid;

    grid-template-columns: 1fr auto 1fr; 
    align-items: center;
    width: 100%;
}

.burger-icon {
    grid-column: 1;
    background: none;
    border: none;
    width: 22px;
    height: 14px;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
}

.burger-icon span, 
.burger-icon span::before, 
.burger-icon span::after {
    display: block;
    width: 100%;
    height: 1.5px;
    background: var(--primary-black);
    position: absolute;
    transition: all 0.3s ease;
}

.burger-icon span::before { content: ""; top: -6px; }
.burger-icon span::after { content: ""; top: 6px; }

.burger-icon:hover span::before { width: 70%; }
.burger-icon:hover span::after { width: 45%; }

.logo { grid-column: 2; }
.logo a {
    text-decoration: none;
    color: var(--primary-black);
    font-weight: 700;
    letter-spacing: 4px;
    font-size: 22px;
}

.header-links {
    grid-column: 3;
    display: flex;
    gap: 25px;
    justify-content: flex-end;
}

.text-link {
    text-decoration: none;
    color: var(--primary-black);
    font-size: 11px;
    letter-spacing: 1px;
    font-weight: 600;
}

.hero {
    height: 80vh;
    background-color: var(--soft-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.hero-title {
    font-size: clamp(32px, 8vw, 64px);
    font-weight: 700;
    margin-bottom: 20px;
}

.btn-primary {
    display: inline-block;
    padding: 16px 45px;
    background: var(--primary-black);
    color: #fff;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.4s ease;
}

.btn-primary:hover {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
}

.products-section { padding: 80px 0; }
.section-heading { text-align: center; letter-spacing: 4px; margin-bottom: 50px; }

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 40px;
}

.product-item { text-align: center; }
.product-media { position: relative; aspect-ratio: 1/1.2; overflow: hidden; background: #f9f9f9; }
.product-media img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.product-item:hover img { transform: scale(1.05); }

.product-media {
    position: relative; 
    overflow: hidden;
    background: #f9f9f9;
}


.badge-sale {
    position: absolute;
    top: 15px;        
    left: 15px;         
    z-index: 10;        

    background-color: var(--accent-red); 
    color: #fff;
    padding: 5px 15px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    border-radius: 50px; 
    pointer-events: none; 
}


.btn-atc {
    width: 100%;
    padding: 14px;
    border: 1px solid var(--primary-black);
    background: transparent;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 15px;
    transition: all 0.4s ease;
}

.btn-atc:hover {
    background: var(--primary-black);
    color: #fff;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
}


.categories-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding-bottom: 80px; }
.category-card {
    height: 450px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: flex-end;
    padding: 35px;
    text-decoration: none;
    color: #fff;
    font-weight: 700;
    font-size: 22px;
    position: relative;
    transition: 0.4s;
}
.category-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
}
.category-name { position: relative; z-index: 2; letter-spacing: 2px; }

.footer {
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    padding: 80px 0 30px;
}

.footer-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 2fr;
    gap: 40px;
    margin-bottom: 50px;
}

.footer-logo { font-weight: 800; letter-spacing: 4px; margin-bottom: 25px; font-size: 20px; }
.footer-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; margin-bottom: 25px; color: #999; }
.footer-links { list-style: none; }
.footer-links li { margin-bottom: 12px; }
.footer-links a {
    text-decoration: none;
    color: var(--primary-black);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: 0.3s;
}
.footer-links a:hover { opacity: 0.5; }

.newsletter-form {
    display: flex;
    border-bottom: 1px solid var(--primary-black);
    max-width: 300px;
}
.newsletter-form input { border: none; outline: none; flex-grow: 1; padding: 10px 0; font-family: inherit; }
.newsletter-form button { background: none; border: none; font-size: 20px; cursor: pointer; }

.footer-bottom { 
    display: flex; 
    justify-content: space-between; 
    padding-top: 20px; 
    border-top: 1px solid #f8f8f8; 
    color: #aaa; 
    font-size: 10px; 
}

@media (max-width: 990px) {
    .footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
    .categories-grid { grid-template-columns: 1fr; }
    .header-links { display: none; }
}
```
### Скріншоти головної сторінки
(/assets/labs/lab-1/1.png)
(/assets/labs/lab-1/2.png)
(/assets/labs/lab-1/3.png)
(/assets/labs/lab-1/4.png)
---
---
## ВИСНОВКИ
У ході виконання лабораторної роботи було проведено комплексний аналіз предметної області магазину косметики «Glow & Care» та розроблено архітектуру адаптивного веб-застосунку. Побудовані Use-case та ER-діаграми дозволили чітко формалізувати функціональні можливості системи та спроектувати логічну структуру бази даних для ефективного зберігання інформації про товари та замовлення. Практична реалізація інтерфейсу за допомогою сучасних засобів верстки забезпечила повну адаптивність сторінок для коректного відображення на десктопних та мобільних пристроях. Застосування семантичних тегів HTML5 та оптимізація нефункціональних параметрів дозволили створити інтуїтивно зрозумілий та швидкий інтерфейс. Отримані навички роботи з системою контролю версій Git та репозиторієм GitHub підтвердили важливість дотримання професійних стандартів розробки для забезпечення якості та масштабованості програмного продукту.