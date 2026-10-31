// https://vitepress.dev/guide/custom-theme
import { h, onMounted, onUnmounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

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

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // слоты можно расширить позже (баннер, доп. виджеты)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  setup() {
    onMounted(() => {
      setupReadingProgress()
    })
    onUnmounted(() => {
      if (setupReadingProgress._cleanup) setupReadingProgress._cleanup()
    })
  }
}
