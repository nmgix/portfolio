---
    id: 0
    title: Свои собственные компоненты
    subtitle: История длиной в полгода
    authors_favorites: true
    ttr: 5
    date: 15.03.22
    type: article
    backgroundColor: ["#000"]
    color: ["#FFFFFF"]
    linkedImages: ["/images/articles/nmgix-components/components-preview1.png", "/images/articles/nmgix-components/components-preview2.png", "/images/articles/nmgix-components/figma.png", "/images/articles/nmgix-components/git-preview.png"
    ]
    techStack: ['Typescript', 'React']
    usefulLinks: [
        {
            name: 'Гитхаб', url: 'https://github.com/nmgix'
        }
    ]
    locale: ru
---

<b>Осознание в необходимости своих собственных компонентов появилось после того, как я в 5-й раз писал с нуля компоненты для очередного проекта</b>

> мы опускаем всякие bootstrap, хотелось накостылять что-то свое :)

### О компонентах

Начал разрабатывать компоненты в параллели со своим сайтом, вот так выглядит фигма файл

![figma](/images/articles/nmgix-components/figma.png)

Начали появляться разные идеи, например `HTIV` (Highlight Text In View).
Суть очень простая, тот текст что находится в середине экрана (используется `Intersection Observer`) выделяется жирным текстом.

Ну или, например, клетки. Сколько же ~~геморроя~~ проблем было с этими компонентами (обёрткой и самой клеткой), я из-за них забрасывал разработку компонентов. Суть такая-же простая, под капотом используется накостыленый `алгоритм упаковки в контейнер`.

### О проблемах и пр.

Быстро пришла идея создать небольшие пнгшки для отображения прогресса создания компонентов в README.md, ну и к тому-же классно выглядит.

![git-preview](/images/articles/nmgix-components/git-preview.png)

Одно но, там не хватает ещё одного поля, про процент тестирования :)
Идея быстро отвалилась т.к. я пришёл к выводу что мне проще брут-форсить тестирование, хоть в долгосроке это и `ужасное` решение, я, наверное, исправлюсь.
