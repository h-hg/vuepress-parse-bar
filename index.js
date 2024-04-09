import path from 'node:path'
import fs from 'node:fs'
import url from 'node:url'

function parseLine(line) {
  let res = /^(\ *)- \[(.*)\]\((.*)\)/.exec(line)
  if(res) {
    return {
      space: res[1].length,
      text : res[2],
      link : res[3]
    }
  }
  res = /^(\ *)- (.*)/.exec(line)
  if(res) {
    return {
      space: res[1].length,
      text: res[2]
    }
  }
  return null
}
// mdPath: the path of markdown file
// rootPath: 
export function parseMd(mdPath, rootPath='/', autoSetCollapsible=true, indent=2) {
  const mdSrc = fs.readFileSync(mdPath, {encoding:'utf8'})
  const dummyNode = {
    items: []
  }
  // lastNodes[i] represent the last node of i-th level
  // - the 1-st level
  //   - the 2-nd level
  //     - the 3-rd level
  // - the 1-st level
  const lastNodes = [dummyNode]
  let lastLevel = 0
  for(let line of mdSrc.split('\n')) {
    // parse
    const res = parseLine(line)
    const level = res ? res.space / indent + 1 : null
    if(!level || !Number.isInteger(level) || level > lastLevel + 1) {
      console.log('Error Line: ', line)
      continue
    }
    const node = {
      text: res.text,
      items: []
    }
    if(res.link) {
      node.link = url.resolve(rootPath, res.link)
    } else if(autoSetCollapsible){
      node.collapsible = true
    }
    // process
    lastNodes[level - 1].items.push(node)
    if(lastNodes.length == level) {
      // create the new level
      lastNodes.push(node)
    } else {
      // remove the empty children
      if(lastNodes[level].items.length == 0) {
        delete lastNodes[level].items
      }
      // update the lastNodes
      lastNodes[level] = node
    }
    lastLevel = level
  }
  // remove the empty children
  for(let i = 1; i < lastNodes.length; ++i) {
    const node = lastNodes[i]
    if(node.items.length == 0) {
      delete node.items
    }
  }
  return dummyNode.items
}

export function scanMdFiles(workspace, rootPath, barFileName) {
  const ret = {} // logicalPath : content of physicalPath
  const helper = (physicalPath, logicalPath) => {
    for(let file of fs.readdirSync(physicalPath)) {
      const pPath = path.join(physicalPath, file),
            lPath = logicalPath + '/' + file
      if(fs.statSync(pPath).isDirectory()) {
        helper(pPath, lPath)
      } else if(file == barFileName) {
        // console.log(pPath, lPath)
        ret[logicalPath + '/'] = parseMd(pPath, logicalPath)
      }
    }
  }
  helper(workspace, rootPath)
  return ret
}