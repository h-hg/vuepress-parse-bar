# VuePress-Parse-Bar

A simple plugin for vuepress to generate sidebar or navbar.

## Motivation

I used to use [docsify](https://docsify.js.org/) to generate my static web files.

In docsify, I can put a markdown file named _sidebar.md in the subdirectory of my documents to represent the sidebar.

However, I found that I need to use javascript to configure my sidebar when I use vuepress's default theme.
And it's trivial.

## How to use

1. install the package

```bash
npm i -D vuepress-parse-bar
```

2. config your vuepress

:::: code-group

::: code-group-item project structure
```text
docs
├── example1/
│   ├── example1-1.md
│   ├── example1-2.md
│   ├── index.md
│   └── sidebar.md
├── example2/
│   ├── example2-1.md
│   ├── example2-2.md
│   ├── index.md
│   └── sidebar.md
├── index.md
├── navbar.md
└── .vuepress/
    └── config.js
```
:::
::: code-group-item config.js
@[code js](./.vuepress/config.js)
::::
