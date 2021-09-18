import { FolderFilled, FolderOpenFilled } from "@ant-design/icons"
import { DataNode } from "rc-tree/lib/interface"
import { Folder, FolderVisibleRight } from "../../interfaces/Folder"

function mapFoldersToTreeData(folders: Folder[]): DataNode[] {
  return folders.map((folder) => ({
    key: folder.id,
    icon: (params: any) => {
      return params.expanded ? <FolderOpenFilled /> : <FolderFilled />
    },
    title: (
      <span>
        <h3>{ folder.title }</h3>
        <p>
          {
            folder.visible === FolderVisibleRight.SPECIFIC_USERS
              ? `Visible to ${ !folder.visibleUsers || !folder.visibleUsers.length ? 'Noone' : folder.visibleUsers.map((user) => user.name).join(', ') }`
              : folder.visible.toString()
          }
        </p>
      </span>
    ),
    children: folder.children ? mapFoldersToTreeData(folder.children) : []
  }))
}

function swapFolders(folders: Folder[], info: any): Folder[] {
  const dropKey = info.node.key
  const dragKey = info.dragNode.key
  const dropPos = info.node.pos.split('-')
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

  const loop = (data: Folder[] | undefined, key: string, callback: any) => {
    if (!data) {
      return
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === key) {
        return callback(data[i], i, data)
      }
      if (data[i].children) {
        loop(data[i].children, key, callback)
      }
    }
  }
  const data = [...folders]

  // Find dragObject
  let dragObj: Folder = {
    id: '',
    title: '',
    visible: FolderVisibleRight.EVERYONE
  }
  loop(data, dragKey, (item: Folder, index: number, arr: DataNode[]) => {
    arr.splice(index, 1)
    dragObj = item
  })

  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item: Folder) => {
      item.children = item.children || []
      // where to insert
      item.children.unshift(dragObj)
    })
  } else if (
    (info.node.props.children || []).length > 0 && // Has children
    info.node.props.expanded && // Is expanded
    dropPosition === 1 // On the bottom gap
  ) {
    loop(data, dropKey, (item: Folder) => {
      item.children = item.children || []
      // where to insert
      item.children.unshift(dragObj)
      // in previous version, we use item.children.push(dragObj) to insert the
      // item to the tail of the children
    })
  } else {
    let ar: Folder[] = []
    let i: number = 0
    loop(data, dropKey, (item: Folder, index: number, arr: Folder[]) => {
      ar = arr
      i = index
    })
    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj)
    } else {
      ar.splice(i + 1, 0, dragObj)
    }
  }

  return data
}

const findFolder = (folders: Folder[], key: string): Folder | undefined => {
  const findNode = (current: Folder, key: string): Folder | undefined => {
    let result: Folder | undefined
    if (current.id === key) {
      return current
    }
    if (current.children) {
      for (const child of current.children) {
        result = findNode(child, key)
        if (result) {
          return result
        }
      }
    }
    return undefined
  }
  let result: Folder | undefined
  for (const current of folders) {
    result = findNode(current, key)
    if (result) {
      return result
    }
  }
  return undefined
}

export {
  mapFoldersToTreeData,
  swapFolders,
  findFolder
}
