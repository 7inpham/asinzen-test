import { User } from './User'

export enum FolderVisibleRight {
  EVERYONE = 'Visible to Everyone',
  ONLY_ME = 'Visible to only Me',
  SPECIFIC_USERS = 'Visible to specific Users'
}

export interface Folder {
  id: string
  title: string
  visible: FolderVisibleRight
  visibleUsers?: User[]
  children?: Folder[]
}
