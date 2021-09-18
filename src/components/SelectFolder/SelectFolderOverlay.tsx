import React, { useState } from 'react'
import { Button, Divider, Input, Tree } from 'antd'
import { Folder, FolderVisibleRight } from '../../interfaces/Folder'
import SelectFolderNewFolder from './SelectFolderNewFolder'
import { uid } from 'uid'
import { findFolder, mapFoldersToTreeData, swapFolders } from './helpers'

const { Search } = Input

interface Props {
  folders: Folder[]
  onUpdate: (folders: Folder[]) => void
  onSelect: (folder: Folder) => void
}

export default function SelectFolderOverlay(props: Props) {
  const [ newFolders, setNewFolders ] = useState<Folder[]>([])

  const handleDrop = (info: any) => {
    const newFolders = swapFolders(props.folders, info)
    props.onUpdate(newFolders)
  }

  const handleSelect = (selectedKeys: any[]) => {
    console.log(selectedKeys)
    const selectedFolder = findFolder(props.folders, selectedKeys[0])
    if (props.onSelect && selectedFolder) {
      props.onSelect(selectedFolder)
    }
  }

  const startAddingNewFolder = () => {
    const newFolder = {
      id: uid(),
      title: '',
      visible: FolderVisibleRight.EVERYONE,
      visibleUsers: []
    }
    setNewFolders([...newFolders, newFolder])
  }

  const handleDeleteNewFolder = (folder: Folder) => {
    setNewFolders(newFolders.filter((f) => f.id !== folder.id))
  }

  const handleSaveNewFolder = (folder: Folder) => {
    handleDeleteNewFolder(folder)
    props.onUpdate([
      folder,
      ...props.folders
    ])
  }

  return (
    <div>
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" />
        <Button onClick={startAddingNewFolder}>Add new folder</Button>
      </div>
      <Divider style={{ margin: '4px 0' }} />
      {
        newFolders.length > 0
        &&
        newFolders.map((newFolder, index) => (
          <SelectFolderNewFolder
            key={index}
            defaultValue={newFolder}
            onSave={handleSaveNewFolder}
            onDelete={handleDeleteNewFolder}
          />
        ))
      }
      <Tree
        showIcon
        blockNode
        draggable
        onDrop={handleDrop}
        onSelect={handleSelect}
        treeData={mapFoldersToTreeData(props.folders)}
      />
    </div>
  )
}
