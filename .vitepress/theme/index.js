// https://vitepress.dev/guide/custom-theme
import { h, onMounted, onUnmounted, ref, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import './custom.css'

/*
 * Отметка «Пройдено ✅» в боковом меню.
 * Когда учитель дочитал урок до конца (или просто открыл его), пункт сайдбара
 * получает зелёную галочку — по курсу видно, где вы уже были.
 * Данные хранятся только в браузере посетителя (localStorage), никуда не отправляются.
 */
const DONE_KEY = 'astra-guide-done-v1'

function getDoneList() {
  try { return JSON.parse(localStorage.getItem(DONE_KEY)) || [] } catch { return [] }
}
function markDone(path) {
  const list = getDoneList()
  if (!list.includes(path)) {
    list.push(path)
    try { localStorage.setItem(DONE_KEY, JSON.stringify(list)) } catch {}
  }
}

/*
 * ВАЖНО: здесь намеренно нет DOM-обсерверов и слушателей, работающих постоянно.
 * Прежняя версия темы добавляла MutationObserver, который отслеживал смену
 * класса <html> (переключение темы, роутинг, оверлеи меню) и на КАЖДУЮ такую
 * смену навешивал transition со !important на все крупные компоненты сайта.
 * В сочетании с тяжёлыми градиентами и тенями это вызывало заметные подвисания
 * и «залипание» интерфейса — особенно на слабых ПК в школьных кабинетах.
 * Сейчас интерфейс лёгкий: анимация полосы прогресса идёт через requestAnimationFrame,
 * остальные эффекты — только CSS без обсерверов.
 */

/** Тонкая полоса прогресса чтения вверху страницы урока */
function setupReadingProgress() {
  if (typeof document === 'undefined') return
  let raf = 0
  let running = false
  let tipTimer = null

  const update = () => {
    raf = 0
    const doc = document.documentElement
    let bar = document.querySelector('.read-progress')
    if (!bar) {
      bar = document.createElement('div')
      bar.className = 'read-progress'
      bar.setAttribute('aria-hidden', 'true')
      // «пузырёк»-подсказка: появляется, когда урок дочитан до конца
      const tip = document.createElement('span')
      tip.className = 'rp-tip'
      tip.textContent = '✅ Урок дочитан — так держать!'
      bar.appendChild(tip)
      document.body.appendChild(bar)
    }
    const total = doc.scrollHeight - doc.clientHeight
    const scrolled = total > 0 ? (doc.scrollTop || document.body.scrollTop) / total : 0
    // Полоса видна только на страницах с содержимым урока
    const isDocPage = !!document.querySelector('.VPDoc')
    const pct = Math.min(100, Math.max(0, scrolled * 100))
    bar.style.width = isDocPage ? `${pct}%` : '0%'
    bar.style.opacity = isDocPage && scrolled > 0.01 ? '1' : '0'
    // Урок дочитан до конца — полоса «зеленеет» + показываем подсказку
    const done = isDocPage && pct >= 99.5
    bar.classList.toggle('done', done)
    const tipEl = bar.querySelector('.rp-tip')
    if (tipEl) {
      tipEl.classList.toggle('show', done)
      clearTimeout(tipTimer)
      if (done) tipTimer = setTimeout(() => tipEl.classList.remove('show'), 3200)
    }
  }

  const onScroll = () => {
    // троттлинг через requestAnimationFrame — не чаще одного кадра
    if (running) return
    running = true
    raf = requestAnimationFrame(() => {
      running = false
      update()
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  update()

  // сохраняем обработчик для снятия при размонтировании
  setupReadingProgress._cleanup = () => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
    clearTimeout(tipTimer)
  }
}

/** Кнопка «Наверх» — появляется после прокрутки, ведёт плавно к началу урока */
function setupBackToTop() {
  if (typeof document === 'undefined') return
  let btn = null
  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const y = window.scrollY || document.documentElement.scrollTop
      if (!btn && y > 600) {
        btn = document.createElement('button')
        btn.className = 'back-to-top'
        btn.setAttribute('aria-label', 'Наверх')
        btn.title = 'К началу страницы'
        btn.textContent = '↑'
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
        document.body.appendChild(btn)
      }
      if (btn) btn.classList.toggle('show', y > 600)
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  setupBackToTop._cleanup = () => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
    if (btn) btn.remove()
    btn = null
  }
}

/** Отметки «Пройдено ✅» в боковом меню (localStorage браузера посетителя) */
function setupSidebarDone(route) {
  const apply = () => {
    try {
      const done = getDoneList()
      document.querySelectorAll('.VPSidebarItem .link span.text').forEach((span) => {
        const linkEl = span.closest('a')
        if (!linkEl) return
        const href = linkEl.getAttribute('href') || ''
        // нормализуем: /unix-guide/lessons/files.html -> /lessons/files
        let key = href.replace(/^\/unix-guide/, '').replace(/\.html$/, '')
        if (key === '/') return
        const base = span.dataset.base || (span.dataset.base = span.textContent.trim())
        if (done.includes(key)) {
          if (!span.classList.contains('is-done')) {
            span.classList.add('is-done')
            span.textContent = base + ' ✅'
          }
        } else if (span.classList.contains('is-done')) {
          span.classList.remove('is-done')
          span.textContent = base
        }
      })
    } catch {}
  }
  if (route) watch(() => route.path, () => setTimeout(apply, 80), { immediate: false })
  apply()
  setupSidebarDone._refresh = apply
}

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // доп. виджеты подключаются ниже через setup()
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  setup() {
    const route = useRoute()
    onMounted(() => {
      setupReadingProgress()
      setupBackToTop()
      setupSidebarDone(route)
      // отмечаем урок пройденным при заходе и при дочитывании до конца
      const markCurrent = () => {
        const p = route.path.replace(/^\/unix-guide/, '').replace(/\.html$/, '')
        if (/^\/lessons\//.test(p)) { markDone(p); if (setupSidebarDone._refresh) setupSidebarDone._refresh() }
      }
      markCurrent()
      watch(() => route.path, markCurrent)
      window.addEventListener('scroll', () => {
        const doc = document.documentElement
        const total = doc.scrollHeight - doc.clientHeight
        if (total > 0 && (doc.scrollTop || document.body.scrollTop) / total >= 0.995) markCurrent()
      }, { passive: true })
    })
    onUnmounted(() => {
      if (setupReadingProgress._cleanup) setupReadingProgress._cleanup()
      if (setupBackToTop._cleanup) setupBackToTop._cleanup()
    })
  }
}
