# VoteHub

Учебный сервис для сбора и голосования за проектные идеи.

Идея из каталога: [Create a Character Voting App with React, Node, MongoDB and SocketIO](http://www.sahatyalkabov.com/create-a-character-voting-app-using-react-nodejs-mongodb-and-socketio?from=@)

## Кратко

Пользователь может предложить идею, но она не попадает в общий список сразу. Сначала заявку проверяет администратор. После одобрения участники могут голосовать за идею, а повторный голос за один и тот же вариант блокируется.

## Функции

- вход и регистрация через Supabase;
- роли `admin` и `participant`;
- отправка идеи на модерацию;
- одобрение и удаление идеи администратором;
- голосование за опубликованные идеи;
- защита от повторного голосования;
- фильтр по категориям;
- профиль с идеями и голосами пользователя.

## Технический стек

Frontend: React, TypeScript, Vite, React Router, CSS.

Backend: Supabase Auth, Supabase REST API.

Database: PostgreSQL.

## Запуск проекта

```bash
npm install
npm run dev
```

В `.env.example` оставлены публичные Supabase-ключи для проверки. Для своего проекта заполните:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Схема базы: `supabase/schema.sql`.

## Доступы

```text
admin login: [admin@gmail.com]
admin password: [adminadmin]

participant login: [test@gmail.com]
participant password: [testtest]
```

## Страницы

- `/` - список идей, голосование и модерация;
- `/auth` - вход и регистрация;
- `/profile` - профиль пользователя.

## Ссылки

GitHub: `[URL]`

Деплой: `[URL]`

## Организация кода

Структура построена по FSD: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
