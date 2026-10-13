# Gen22 Fitness Center: Website

A complete, responsive website for **Gen22 Fitness Center**, a modern gym with group classes and personal training. Plain HTML, CSS and JavaScript. No installation or build step needed.

## How to open it
1. On GitHub, click **Code → Download ZIP** (or `git clone`).
2. Extract the folder and double-click **`index.html`**. It opens in your browser. (The Google fonts and map need internet.)

## Pages & features
| Page | Features |
|------|----------|
| `index.html` | Hero, scrolling ticker, animated stats, "Why Gen22", popular classes, pricing, **BMI calculator**, testimonials |
| `about.html` | Story, mission/vision/promise, values, facilities |
| `classes.html` | 9 class formats with duration and intensity, personal-training packages, first-class guide |
| `schedule.html` | Weekly timetable with **class-type filter**, today highlighted, day tabs on mobile |
| `membership.html` | Basic / Plus / Elite plans with **monthly/annual toggle** (20% annual saving), passes & discounts, comparison table, FAQ |
| `trainers.html` | Coach profiles, careers section |
| `contact.html` | **Free day-pass booking form** with validation, contact form, live "open now" hours, Google Map, WhatsApp |
| `404.html` | Not-found page |

Also: sticky header with mobile menu, WhatsApp chat button, back-to-top button, newsletter signup, scroll animations, accessibility (skip link, keyboard support, reduced motion) and print styles.

## Customising
- **Phone, WhatsApp, email, address, map location, currency, social links, opening hours:** edit `js/config.js`. Every page updates.
- **Colours:** edit the variables at the top of `css/style.css` (`--primary`, `--accent`).
- **Prices:** in `membership.html`, `index.html` and `classes.html`, edit the `data-monthly` / `data-price` numbers. The annual price (20% off) is calculated automatically.
- **Content:** names, prices, coaches, stats and testimonials are **sample data**. Replace them with Gen22's real information.
- **Editing pages:** each page is a normal HTML file; edit it directly. The header and footer are repeated in every page, so a menu change must be made in all of them.

## Going live
Forms currently save submissions only in the visitor's browser (demo). To receive them by email, connect a form service such as **Formspree** or **Netlify Forms**. Host the folder for free on **GitHub Pages** (Settings → Pages → deploy from branch) or **Netlify**.
