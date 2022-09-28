import { defaultTheme } from 'vuepress'
import path from 'node:path'
import { URL } from 'url'
import {parseBar, scanBarFile} from 'vuepress-parse-bar'

const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;
const workspace = path.resolve(__dirname, '..')

export default {
  title: 'VuePress-Parse-Bar',
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
}