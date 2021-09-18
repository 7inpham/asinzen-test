import React, { useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import SelectFolderOverlay from './SelectFolderOverlay'
import { Folder } from '../../interfaces/Folder'

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

  const handleSelectedFolder = (folder: Folder) => {
    setDropdownVisible(false)
    if (onSelectFolder) {
      onSelectFolder(folder)
    }
  }

  const handleUpdatedFolders = (folders: Folder[]) => {
    if (onUpdateFolders) {
      onUpdateFolders(folders)
    }
  }

  return (
    <div>
      <Dropdown
        trigger={['click']}
        visible={dropdownVisible}
        onVisibleChange={handleDropdownVisibleChange}
        overlay={
          <SelectFolderOverlay
            folders={folders}
            onUpdate={handleUpdatedFolders}
            onSelect={handleSelectedFolder}
          />
        }
      >
        <Button>
          {
            value
              ? <span>{value.title}</span>
              : <span>Select folder</span>
          }
          <DownOutlined/>
        </Button>
      </Dropdown>
    </div>
  )
}
