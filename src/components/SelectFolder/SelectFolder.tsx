import React, { useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import { Folder } from '../../interfaces/Folder'
import SelectFolderOverlay from './SelectFolderOverlay'
import './SelectFolder.css'

interface Props {
  value: Folder | null
  folders: Folder[]
  onSelectFolder?: (selectedFolder: Folder) => void
  onUpdateFolders?: (updatedFolders: Folder[]) => void
}

export default function SelectFolder(props: Props) {
  const { value, folders, onUpdateFolders, onSelectFolder } = props
  const [ dropdownVisible, setDropdownVisible ] = useState(false)

  const handleDropdownVisibleChange = (flag: boolean) => {
    setDropdownVisible(flag)
  }

  const handleSelecteFolder = (folder: Folder) => {
    setDropdownVisible(false)
    if (onSelectFolder) {
      onSelectFolder(folder)
    }
  }

  const handleUpdateFolders = (folders: Folder[]) => {
    if (onUpdateFolders) {
      onUpdateFolders(folders)
    }
  }

  return (
    <div className="select-folder">
      <Dropdown
        trigger={['click']}
        visible={dropdownVisible}
        onVisibleChange={handleDropdownVisibleChange}
        overlay={
          <SelectFolderOverlay
            folders={folders}
            onUpdate={handleUpdateFolders}
            onSelect={handleSelecteFolder}
          />
        }
      >
        <Button className="select-folder-trigger">
          {
            value
              ? <span>{value.name}</span>
              : <span>Select folder</span>
          }
          <DownOutlined/>
        </Button>
      </Dropdown>
    </div>
  )
}
