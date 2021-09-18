import { uid } from 'uid'
import { Folder, FolderVisibleRight } from './interfaces/Folder'
import { User } from './interfaces/User'

export const SampleUsers: User[] = [
  {
    id: uid(),
    name: 'Nick M'
  },
  {
    id: uid(),
    name: 'Quynh Kim'
  },
  {
    id: uid(),
    name: 'John Doe'
  }
]

export const SampleFolders: Folder[] = [
  {
    id: uid(),
    name: 'My folder name 1',
    visible: FolderVisibleRight.EVERYONE,
    children: [
      {
        id: uid(),
        name: 'My folder name 1-a',
        visible: FolderVisibleRight.EVERYONE,
      },
      {
        id: uid(),
        name: 'My folder name 1-b',
        visible: FolderVisibleRight.EVERYONE,
      }
    ]
  },
  {
    id: uid(),
    name: 'My folder name 2',
    visible: FolderVisibleRight.ONLY_ME,
    children: [
      {
        id: uid(),
        name: 'My folder name 2-a',
        visible: FolderVisibleRight.EVERYONE,
      }
    ]
  },
  {
    id: uid(),
    name: 'My folder name 3',
    visible: FolderVisibleRight.SPECIFIC_USERS,
    visibleUsers: [
      SampleUsers[0],
      SampleUsers[1]
    ],
    children: [
      {
        id: uid(),
        name: 'My folder name 3-a',
        visible: FolderVisibleRight.EVERYONE,
      }
    ]
  }
]
