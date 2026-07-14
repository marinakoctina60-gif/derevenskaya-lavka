# Загрузка фото на Cloudflare (R2)

Товары уже сохраняются в KV. Для **фото** нужно хранилище R2.

## Шаги (один раз)

1. Меню слева: **Storage & databases** → **R2 Object Storage**  
   или ссылка: https://dash.cloudflare.com/7661c978e41a0b007578bb3ab0e3272c/r2/overview
2. **Create bucket** → имя: `lavka-uploads` → Create
3. Откройте Worker **derevenskaya-lavka** → вкладка **Bindings**
4. **Add binding +** → тип **R2 bucket**
5. Variable name: `LAVKA_UPLOADS` (точно так)
6. R2 bucket: `lavka-uploads`
7. Save → **Deployments** → **Retry build**

После этого в админке загрузка фото будет работать.
