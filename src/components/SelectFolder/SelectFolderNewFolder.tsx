import React, { useState } from 'react'
import { DeleteFilled, FolderFilled, SaveFilled } from '@ant-design/icons'
import { Folder, FolderVisibleRight } from '../../interfaces/Folder'
import { Input, Select } from 'antd'
import { User } from '../../interfaces/User'
import { SampleUsers } from '../../sample'

const { Option } = Select

interface Props {
  defaultValue: Folder
  onSave: (value: Folder) => void
  onDelete: (value: Folder) => void
}

export default function SelectFolderNewFolder(props: Props) {
  const [ folder, setFolder ] = useState<Folder>(props.defaultValue)

  const handleChangeName = (e: any) => {
    setFolder({
      ...folder,
      name: e.target.value
    })
  }

  const handleChangeVisibleRight = (value: FolderVisibleRight) => {
    setFolder({
      ...folder,
      visible: value,
      visibleUsers: value === FolderVisibleRight.SPECIFIC_USERS ? folder.visibleUsers : []
    })
  }

  const handleChangeUsers = (userIds: string[]) => {
    const users: User[] = []
    for (const userId of userIds) {
      const user = SampleUsers.find((user) => user.id === userId)
      if (user) {
        users.push(user)
      }
    }
    setFolder({
      ...folder,
      visibleUsers: users
    })
  }

  const handleSave = () => {
    if (folder.name && props.onSave) {
      props.onSave(folder)
    }
  }

  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete(folder)
    }
  }

  return (
    <div className="select-folder-new-folder">
      <div className="select-folder-new-folder-icon">
        <FolderFilled />
      </div>
      <div className="select-folder-new-folder-form">
        <Input placeholder="Enter new folder name" defaultValue={folder.name} onChange={handleChangeName} />
        <Select
          style={{ width: '100%' }}
          defaultValue={folder.visible}
          onChange={handleChangeVisibleRight}
        >
          <Option value={FolderVisibleRight.EVERYONE}>{FolderVisibleRight.EVERYONE.toString()}</Option>
          <Option value={FolderVisibleRight.ONLY_ME}>{FolderVisibleRight.ONLY_ME.toString()}</Option>
          <Option value={FolderVisibleRight.SPECIFIC_USERS}>{FolderVisibleRight.SPECIFIC_USERS.toString()}</Option>
        </Select>
        {
          folder.visible === FolderVisibleRight.SPECIFIC_USERS
          &&
          <Select
            placeholder="Select users..."
            mode="multiple"
            style={{ width: '100%' }}
            defaultValue={folder.visibleUsers ? folder.visibleUsers.map((u) => u.id) : []}
            onChange={handleChangeUsers}
          >
            {
              SampleUsers.map((user) => (
                <Option value={user.id} key={user.id}>{user.name}</Option>
              ))
            }
          </Select>
        }
        <div className="select-folder-new-folder-form-action">
          <DeleteFilled onClick={handleDelete} className="action-delete" />
          <SaveFilled onClick={handleSave} className={`action-save${folder.name ? '' : ' disabled'}`} />
        </div>
      </div>
    </div>
  )
}
