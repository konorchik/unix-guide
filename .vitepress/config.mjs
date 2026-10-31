import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Astra Linux для учителя',
  description: 'Практический курс и справочник по работе с операционной системой',
  lang: 'ru-RU',

  // База для GitHub Pages (проектный сайт konorchik.github.io/unix-guide/).
  // Если позже подключите собственный домен — установите base: '/' и CNAME.
  base: '/unix-guide/',

  // Тема включена; выбор посетителя (светлая/тёмная) запоминается
  appearance: true,
  appearanceText: 'Тема',

  // Иконка сайта и мета-теги для соцсетей/поисковиков
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/unix-guide/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0b5cad', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#171226', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Astra Linux для учителя' }],
    ['meta', { property: 'og:description', content: 'Практический курс и справочник по работе с Astra Linux: без сложной терминологии, только то, что нужно на уроках.' }]
  ],

  // Настройки темы
  themeConfig: {
    // Логотип и заголовок в левом верхнем углу
    logo: '/favicon.svg',
    siteTitle: 'Astra Linux для учителя',

    // Верхнее навигационное меню
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Начать курс', link: '/lessons/intro' },
      { text: 'Шпаргалки', link: '/lessons/shortcuts' },
      { text: 'FAQ', link: '/lessons/faq' }
    ],

    // Оглавление справа на страницах уроков
    outline: {
      level: [2, 3],
      label: 'На этой странице'
    },

    // Отметка «обновлено» внизу страниц
    lastUpdated: {
      text: 'Обновлено',
      formatOptions: { dateStyle: 'long', timeStyle: 'short' }
    },

    // Боковое меню со всеми уроками и модулями
    sidebar: [
      {
        text: '🔧 Модуль 0. Подготовка техники',
        collapsed: true,
        items: [
          { text: 'Модуль 1. Развертывание и установка', link: '/lessons/01-installation' }
        ]
      },
      {
        text: '📘 Модуль 1. Основы работы',
        collapsed: false,
        items: [
          { text: '1.0. Переезд с Windows', link: '/lessons/windows-switch' },
          { text: '1.1. Интерфейс Fly и Рабочий стол', link: '/lessons/intro' },
          { text: '1.2. Работа с файлами и флешками', link: '/lessons/files' },
          { text: '1.3. Учётные записи и вход в систему', link: '/lessons/accounts' },
          { text: '1.4. Интернет и браузер', link: '/lessons/internet' }
        ]
      },
      {
        text: '📙 Модуль 2. Документы и Офис',
        collapsed: false,
        items: [
          { text: '2.1. Офис, шрифты PT Astra и .docx', link: '/lessons/office' },
          { text: '2.2. Таблицы Calc и диаграммы', link: '/lessons/calc' },
          { text: '2.3. Impress: презентации классу', link: '/lessons/impress' }
        ]
      },
      {
        text: '🖨️ Модуль 3. Оборудование в классе',
        collapsed: false,
        items: [
          { text: '3.1. Принтеры, проектор и звук', link: '/lessons/peripherals' },
          { text: '3.2. Сканирование, камера и микрофон', link: '/lessons/media' }
        ]
      },
      {
        text: '🛡️ Модуль 4. Безопасность и помощь',
        collapsed: false,
        items: [
          { text: '4.1. Безопасность и сбои программ', link: '/lessons/security' },
          { text: '4.2. Терминал и установка программ', link: '/lessons/terminal' },
          { text: '4.3. Резервные копии и восстановление', link: '/lessons/backup' }
        ]
      },
      {
        text: '📄 Шпаргалки, FAQ и словари',
        collapsed: false,
        items: [
          { text: 'Шпаргалки и горячие клавиши', link: '/lessons/shortcuts' },
          { text: 'Частые вопросы (FAQ)', link: '/lessons/faq' },
          { text: 'Словарь терминов', link: '/lessons/glossary' },
          { text: 'Чек-листы для печати', link: '/lessons/checklists' },
          { text: 'Планы уроков 40/90 минут', link: '/lessons/lesson-plan' }
        ]
      }
    ],

    // Встроенный локальный поиск по сайту
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Поиск по сайту',
                buttonAriaLabel: 'Поиск по сайту'
              },
              modal: {
                noResultsText: 'Ничего не найдено по вашему запросу',
                resetButtonTitle: 'Сбросить поиск',
                footer: {
                  selectText: 'для выбора',
                  navigateText: 'для навигации',
                  closeText: 'закрыть'
                }
              }
            }
          }
        }
      }
    },

    // Текст внизу страниц (футер)
    footer: {
      message: 'Создано для учителей и образовательных организаций 🧡',
      copyright: 'Практическое руководство по Astra Linux — 2026'
    },

    // Ссылка на репозиторий в навигации
    socialLinks: [
      { icon: 'github', link: 'https://github.com/konorchik/unix-guide' }
    ],

    // Возможность предложить правку урока прямо на GitHub
    editLink: {
      pattern: 'https://github.com/konorchik/unix-guide/edit/main/:path',
      text: '✏️ Предложить правку этого урока'
    },

    // 404-страница по-русски
    notFound: {
      title: 'Страница не найдена',
      quote: 'Похоже, такой урок ещё не написан — или ссылка устарела.',
      linkText: 'Вернуться на главную',
      linkLabel: 'На главную'
    },

    // Настройка текста кнопок пагинации (предыдущий/следующий урок)
    docFooter: {
      prev: 'Предыдущий урок',
      next: 'Следующий урок'
    },

    // Кнопка переключения темы (темная/светлая)
    darkModeSwitchLabel: 'Тема',
    lightModeSwitchTitle: 'Переключить на светлую тему',
    darkModeSwitchTitle: 'Переключить на темную тему',
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Наверх'
  }
})