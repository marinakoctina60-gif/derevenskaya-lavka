# Как включить сохранение через админку на Cloudflare

## Почему не было видно KV

Раздел **KV** находится не в списке сайтов, а в меню слева:
**Storage & databases** → **KV**.

Или откройте прямую ссылку (подставьте свой аккаунт, если попросит войти):

https://dash.cloudflare.com/7661c978e41a0b007578bb3ab0e3272c/workers/kv/namespaces

## Шаги (один раз)

1. Откройте ссылку выше
2. **Create namespace** → имя `lavka-data` → Create
3. Вернитесь в Worker **derevenskaya-lavka**
4. Вкладка **Bindings** → **Add** → **KV Namespace**
5. Variable name: `LAVKA_DATA` (точно так)
6. Namespace: `lavka-data`
7. Save → **Deployments** → **Retry build**

После этого админка сможет сохранять товары и настройки.
