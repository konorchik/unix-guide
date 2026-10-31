// https://vitepress.dev/guide/custom-theme
import { h, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

/** Тонкая полоса прогресса чтения вверху страницы урока */
function setupReadingProgress() {
  if (typeof document === 'undefined') return
  let bar = document.querySelector('.read-progress')
  if (!bar) {
    bar = document.createElement('div')
    bar.className = 'read-progress'
    bar.setAttribute('aria-hidden', 'true')
    document.body.appendChild(bar)
  }

  const update = () => {
    const doc = document.documentElement
    const total = doc.scrollHeight - doc.clientHeight
    const scrolled = total > 0 ? (doc.scrollTop || document.body.scrollTop) / total : 0
    // Полоса видна только на страницах с содержимым урока
    const isDocPage = !!document.querySelector('.VPDoc')
    bar.style.width = isDocPage ? `${Math.min(100, Math.max(0, scrolled * 100))}%` : '0%'
    bar.style.opacity = isDocPage ? '1' : '0'
  }

  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  update()
}

/** Плавная анимация смены светлой/тёмной темы */
function setupThemeTransition() {
  if (typeof MutationObserver === 'undefined') return
  const html = document.documentElement
  const observer = new MutationObserver(() => {
    html.classList.add('theme-transition')
    setTimeout(() => html.classList.remove('theme-transition'), 400)
  })
  observer.observe(html, { attributes: true, attributeFilter: ['class'] })
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
      setupThemeTransition()
    })
  }
}
