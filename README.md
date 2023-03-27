# test-project-warships-mvp

Автор: eugennizamutdinov@gmail.com
Время: ~16 часов

######Тестовое задание:
><small>Требуется создать веб-страницу, на которой можно посмотреть список кораблей, доступных в игре World of Warships.
UI/UX и стэк на ваше усмотрение, следование стилистике игры приветствуется.
Данные для отображения можно получить отсюда:
https://vortex.worldofwarships.eu/api/encyclopedia/en/vehicles/;
https://vortex.worldofwarships.eu/api/encyclopedia/en/nations/;
https://vortex.worldofwarships.eu/api/encyclopedia/en/vehicle_types_common/;
https://vortex.worldofwarships.eu/api/encyclopedia/en/media_path/.
</small>

####
Проект написан на vue со сборкой на vite.
#####Зависимости:
```axios``` — запросы
```vue-i18n``` — интернационализация. тут можно было сделать без нее, но использовал как стандарный для этого инструмент
```swiper``` — слайдер галлереи
```vue-virtual-scroll-grid``` — вирутальный скролл


###
*при необходимости могу написать свои варианты используемых зависимостей, не успел, тк подзастрял с дизайном. 





## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

<!-- ### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
``` -->

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
### Stylelint css/sass

```sh
npm run stylelint
```

### Generate CHANGELOG.md

```sh
npm run release
```
