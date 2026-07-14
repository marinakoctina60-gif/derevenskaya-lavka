# Как включить сохранение через админку на Cloudflare

Сейчас сайт в облаке **не может писать файлы на диск**. Поэтому админка и ломалась.
Нужно один раз подключить хранилище **KV**.

## Шаги в Cloudflare (один раз)

1. Откройте [Workers & Pages → KV](https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces)
2. Нажмите **Create a namespace**
3. Имя: `lavka-data` → Create
4. Откройте ваш Worker **derevenskaya-lavka** → вкладка **Bindings**
5. **Add** → **KV Namespace**
6. Variable name: `LAVKA_DATA` (именно так)
7. Namespace: выберите `lavka-data`
8. Сохраните и сделайте **Retry build** / Redeploy

После этого в админке можно менять товары, цены, тексты и принимать заявки.

## Фото товаров

Загрузка фото на Cloudflare пока может не сохраняться (нужен отдельный R2-бакет).
Пока можно присылать фото мне — добавлю в сайт вручную.
