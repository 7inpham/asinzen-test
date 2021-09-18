import React, { useState } from 'react'
import './App.css'
import { SelectFolder } from './components/SelectFolder'
import { Folder } from './interfaces/Folder'
import { SampleFolders } from './sample'

function App() {
  const [ folders, setFolders ] = useState(SampleFolders)
  const [ selectedFolder, setSelectedFolder ] = useState<Folder | null>(null)

  const handleSelectFolder = (selectedFolder: Folder) => {
    setSelectedFolder(selectedFolder)
  }

  const handleUpdateFolders = (updatedFolders: Folder[]) => {
    setFolders(updatedFolders)
  }

  return (
    <div className="app-container">
      <h2>Copy Data to Folder</h2>
      <SelectFolder
        value={selectedFolder}
        folders={folders}
        onSelectFolder={handleSelectFolder}
        onUpdateFolders={handleUpdateFolders}
      />
    </div>
  )
}

export default App
