import React, { useEffect, useState } from 'react'
import { Button, Divider, Input, Tree } from 'antd'
import { uid } from 'uid'
import { findFolderById, swapFolders } from '../../helpers'
import { Folder, FolderVisibleRight } from '../../interfaces/Folder'
import { DataNode } from 'rc-tree/lib/interface'
import { FolderFilled, FolderOpenFilled } from '@ant-design/icons'
import SelectFolderNewFolder from './SelectFolderNewFolder'

const { Search } = Input

function isMatched(name: string, searchValue: string) {
  return searchValue && name.toLowerCase().includes(searchValue.toLowerCase())
}

function mapFoldersToTreeData(folders: Folder[], searchValue: string): DataNode[] {
  return folders.map((folder) => ({
    key: folder.id,
    icon: (params: any) => {
      return params.expanded ? <FolderOpenFilled /> : <FolderFilled />
    },
    title: (
      <>
        <h3 className={isMatched(folder.name, searchValue) ? 'highlighted' : ''}>{ folder.name }</h3>
        <p>
          {
            folder.visible === FolderVisibleRight.SPECIFIC_USERS
              ? `Visible to ${ !folder.visibleUsers || !folder.visibleUsers.length ? 'Noone' : folder.visibleUsers.map((user) => user.name).join(', ') }`
              : folder.visible.toString()
          }
        </p>
      </>
    ),
    children: folder.children ? mapFoldersToTreeData(folder.children, searchValue) : []
  }))
}

function mapMatchedFoldersToExpandedKeys(folders: Folder[], searchValue: string, keys: any[] = []): any[] {
  for (const folder of folders) {
    if (isMatched(folder.name, searchValue)) {
      if (!keys.includes(folder.id)) {
        keys.push(folder.id)
      }
    }
    if (folder.children) {
      mapMatchedFoldersToExpandedKeys(folder.children, searchValue, keys)
    }
  }
  return keys
}

interface Props {
  folders: Folder[]
  onUpdate: (folders: Folder[]) => void
  onSelect: (folder: Folder) => void
}

export default function SelectFolderOverlay(props: Props) {
  const [ newFolders, setNewFolders ] = useState<Folder[]>([])
  const [ searchValue, setSearchValue ] = useState('')
  const [ treeData, setTreeData ] = useState(mapFoldersToTreeData(props.folders, searchValue))
  const [ expandedKeys, setExpandedKeys ] = useState<any[]>([])

  useEffect(() => {
    setTreeData(mapFoldersToTreeData(props.folders, searchValue))
    setExpandedKeys(mapMatchedFoldersToExpandedKeys(props.folders, searchValue))
  }, [searchValue, props.folders])

  const handleDrop = (info: any) => {
    const newFolders = swapFolders(props.folders, info)
    props.onUpdate(newFolders)
  }

  const handleSelect = (selectedKeys: any[]) => {
    const foundFolder = findFolderById(props.folders, selectedKeys[0])
    if (props.onSelect && foundFolder) {
      props.onSelect(foundFolder)
    }
  }

  const startAddingNewFolder = () => {
    const newFolder: Folder = {
      id: uid(),
      name: '',
      visible: FolderVisibleRight.EVERYONE,
      visibleUsers: []
    }
    console.log([newFolder, ...newFolders])
    setNewFolders([newFolder, ...newFolders])
  }

  const handleDeleteNewFolder = (index: number) => {
    setNewFolders(newFolders.filter((_, i) => i !== index))
  }

  const handleSaveNewFolder = (index: number, folder: Folder) => {
    setNewFolders(newFolders.filter((_, i) => i !== index))
    props.onUpdate([
      folder,
      ...props.folders
    ])
  }

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value)
  }

  const handleExpand = (keys: any[]) => {
    setExpandedKeys(keys)
  }

  return (
    <div className="select-folder-overlay">
      <div className="select-folder-overlay-toolbar">
        <Search placeholder="Search" defaultValue={searchValue} onChange={handleSearch} />
        <Button type="link" onClick={startAddingNewFolder}>Add new folder</Button>
      </div>
      <Divider className="select-folder-overlay-divider" />
      {
        newFolders.length > 0
        &&
        newFolders.map((newFolder, index) => (
          <SelectFolderNewFolder
            key={index}
            defaultValue={newFolder}
            onSave={(folder: Folder) => handleSaveNewFolder(index, folder)}
            onDelete={() => handleDeleteNewFolder(index)}
          />
        ))
      }
      <Tree
        showIcon
        blockNode
        draggable
        expandedKeys={expandedKeys}
        autoExpandParent={true}
        onExpand={handleExpand}
        onDrop={handleDrop}
        onSelect={handleSelect}
        treeData={treeData}
      />
    </div>
  )
}
