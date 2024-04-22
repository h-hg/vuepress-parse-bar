import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import path from 'node:path'
import url from 'url'
import {parseBar, scanBarFile} from 'vuepress-parse-bar'

const __filename = url.fileURLToPath(new url.URL(import.meta.url));
const workspace = path.resolve(__filename, '..', '..');

export default defineUserConfig({
  bundler: viteBundler(),
  title: 'VuePress-Parse-Bar',
  base: '/vuepress-parse-bar/',
  repo: 'h-hg/vuepress-parse-bar',
  theme: defaultTheme({
    navbar: parseBar(path.join(workspace, 'navbar.md'), '/', false),
    sidebar: {
      '/example1/': parseBar(path.join(workspace, 'example1', 'sidebar.md'), '/example1'),
      '/example2/': parseBar(path.join(workspace, 'example2', 'sidebar.md'), '/example2'),
    }
    // Alternative, you can use the following configuration,
    // and it will scan all the sidebar.md automatically
    // sidebar: scanBarFile(workspace, '/', 'sidebar.md')
  }),
})