import path from 'node:path'
import fs from 'node:fs'

function parseLine(line) {
  let res = /^(\ *)- \[(.*)\]\((.*)\)/.exec(line)
  if (res) {
    return {
      space: res[1].length,
      text: res[2],
      link: res[3]
    }
  }
  res = /^(\ *)- (.*)/.exec(line)
  if (res) {
    return {
      space: res[1].length,
      text: res[2]
    }
  }
  return null
}
// mdPath: the path of markdown file
// rootPath: 
export function parseBar(mdPath, rootPath = '/', autoSetCollapsible = true, indent = 2) {
  const lines = fs.readFileSync(mdPath, { encoding: 'utf8' }).split('\n')
  const dummyNode = {
    children: []
  }
  // lastNodes[i] represent the last node of i-th level
  // - the 1-st level
  //   - the 2-nd level
  //     - the 3-rd level
  // - the 1-st level
  const lastNodes = [dummyNode]
  let lastLevel = 0
  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i]
    if (line.length === 0) {
      continue
    }
    // parse
    const res = parseLine(line)
    const level = res ? res.space / indent + 1 : null
    if (!level || !Number.isInteger(level) || level > lastLevel + 1) {
      console.log(`vitepress-parse-bar: error ${i}-th line ('${line}') of ${mdPath}`)
      continue
    }
    const node = {
      text: res.text,
      children: []
    }
    if (res.link) {
      if (res.link.indexOf("://") !== -1) {
        node.link = res.link
      } else {
        res.link = res.link.replace('\\', '/') // preprocess
        node.link = path.posix.resolve(rootPath, res.link)
        if (res.link.endsWith('/') && node.link !== '/') {
          node.link += '/'
        }
      }
    }
    // process
    lastNodes[level - 1].children.push(node)
    if (lastNodes.length == level) {
      // create the new level
      lastNodes.push(node)
    } else {
      // remove the empty children
      if (lastNodes[level].children.length == 0) {
        delete lastNodes[level].children
      } else if (autoSetCollapsible) {
        node.collapsible = true
      }
      // update the lastNodes
      lastNodes[level] = node
    }
    lastLevel = level
  }
  // remove the empty children
  for (let i = 1; i < lastNodes.length; ++i) {
    const node = lastNodes[i]
    if (node.children.length == 0) {
      delete node.children
    } else if (autoSetCollapsible) {
      node.collapsible = true
    }
  }
  return dummyNode.children
}

export function scanBarFile(workspace, rootPath, barFileName) {
  const ret = {} // logicalPath : content of physicalPath
  const helper = (physicalPath, logicalPath) => {
    for (let file of fs.readdirSync(physicalPath)) {
      const pPath = path.join(physicalPath, file),
        lPath = path.posix.join(logicalPath, file)
      if (fs.statSync(pPath).isDirectory()) {
        helper(pPath, lPath)
      } else if (file == barFileName) {
        const key = logicalPath === '/' ? logicalPath : logicalPath + '/'
        ret[key] = parseMd(pPath, logicalPath)
      }
    }
  }
  helper(workspace, rootPath)
  return ret
}