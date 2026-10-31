# 📘 Astra Linux для учителя

Практический курс и справочник по работе с операционной системой **Astra Linux** для учителей-предметников. Сайт построен на [VitePress](https://vitepress.dev).

## 🚀 Запуск локально

```bash
npm install        # установка зависимостей
npm run dev        # локальный сервер разработки (http://localhost:5173)
```

## 🏗️ Сборка и просмотр

```bash
npm run build      # сборка статического сайта в .vitepress/dist
npm run preview    # локальный просмотр собранного сайта
```

## 📂 Структура проекта

```
.vitepress/
  config.mjs       # конфигурация сайта: навигация, боковое меню, поиск, футер
  theme/           # кастомная тема (светлая/тёмная палитра Astra)
index.md           # главная страница курса
lessons/           # уроки курса
  01-installation.md  # Модуль 0: развертывание и установка системы (для администраторов)
  intro.md            # 1.1 Интерфейс Fly и рабочий стол
  files.md            # 1.2 Работа с файлами и флешками
  office.md           # 2.1 Офис, шрифты PT Astra и .docx
  peripherals.md      # 3.1 Принтеры, проектор и звук
  security.md         # 4.1 Безопасность и сбои программ
  shortcuts.md        # Шпаргалки и горячие клавиши для печати
```

## 🛠️ Как добавить новый урок

1. Создайте файл `lessons/<имя>.md` с frontmatter (`title`, `description`).
2. Добавьте ссылку на него в `sidebar` (и при необходимости в `nav`) файла `.vitepress/config.mjs`.
3. Проверьте сборку командой `npm run build` — VitePress сам сообщит о «битых» ссылках.

## 🌐 Публикация на GitHub Pages

Сайт автоматически публикуется через GitHub Actions: файл `.github/workflows/deploy.yml` собирает VitePress и деплоит результат в Pages при каждом пуше в `main`.

**Одноразовая настройка (через веб-интерфейс GitHub):**
1. Откройте **Settings → Pages** репозитория.
2. В разделе **Build and deployment** выберите **Source: GitHub Actions**.
3. Сделайте любой пуш в `main` (или запустите workflow вручную: Actions → Deploy VitePress site to GitHub Pages → Run workflow).

После завершения сборки сайт будет доступен по адресу:
**https://konorchik.github.io/unix-guide/**

> Важно: в `.vitepress/config.mjs` уже настроен `base: '/unix-guide/'`. Если смените имя репозитория или подключите свой домен — обновите `base` (для собственного домена: `base: '/'` + файл `CNAME`).
