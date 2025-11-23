---
# try also 'default' to start simple
theme: 'slidev-theme-hal'
# theme: ../theme
themeConfig:
  company: 株式会社LIXIL
  author: Hal
  logo: './images/tskaigi.svg'
  logoWidth: '180px'

# some information about your slides (markdown enabled)
title: |
  "TSのAPI型安全"の対価は誰が払う？
  不公平なスキーマ駆動に終止符を打つ
  ハイブリッド戦略
info: |
  TSKaigi Hokurikuで発表するスライドです
# apply UnoCSS classes to the current slide
class: 'text-center font-bold'
# https://sli.dev/features/drawing
drawings:
  persist: true
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: blur-transition
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
# duration of the presentation
duration: 30min
---

---

## 本日のスライド

<div class="pa-0 flex justify-center items-center">
  <img class="h-100" src="/images/qr_slide.png"/>
</div>

Powered by [Slidev](https://sli.dev/)

---
level: 1
src: ./pages/section1.md
---

---
level: 1
src: ./pages/section2.md
---

---
level: 1
src: ./pages/section3.md
---

---
level: 1
src: ./pages/section4.md
---

---
level: 1
src: ./pages/section5.md
---

---
level: 1
src: ./pages/section6.md
---

---
level: 1
src: ./pages/section7.md
transition: fade
---

---

<img v-drag="[629,307,286,194]" src="/images/end.webp"/>

<SectionTitle title="ご清聴ありがとうございました！"/>
