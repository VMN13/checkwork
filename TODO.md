# План очистки неиспользуемых компонентов и зависимостей

## Шаг 1: Интегрировать LanguageSwitcher в HeaderBar
- [x] Добавить кнопки переключения языка (EN/RU) в HeaderBar.tsx
- [x] Удалить LanguageSwitcher.tsx

## Шаг 2: Удалить неиспользуемые файлы
- [x] Удалить src/components/daypicker/
- [x] Удалить src/components/react-select/
- [x] Удалить src/components/tagcloud/
- [x] Удалить src/components/tanstacktable/
- [x] Удалить src/components/uppy/
- [x] Удалить src/components/chart/
- [x] Удалить src/hook-form/hookform.tsx
- [x] Удалить src/data/users.json
- [x] Удалить src/types/react-tagcloud.d.ts

## Шаг 3: Обновить package.json
- [x] Удалить неиспользуемые зависимости

## Шаг 4: Установить зависимости
- [x] npm install

## Шаг 5: Проверить сборку
- [x] Запустить `npm run build` для проверки — успешно, 71 модуль, 0 ошибок
