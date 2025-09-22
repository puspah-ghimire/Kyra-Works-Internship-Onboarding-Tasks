import { useState } from 'react'
import DataLakeApp from './components/DataLakeApp'
import Tutorial from './components/Tutorial'

function App() {
  const [forceShowTutorial, setForceShowTutorial] = useState(false)

  const restartTutorial = () => {
    localStorage.removeItem('tutorial-completed')
    setForceShowTutorial(true)
  }

  return (
    <>
      <DataLakeApp />
      <Tutorial 
        forceShow={forceShowTutorial} 
        onComplete={() => setForceShowTutorial(false)} 
      />

      {/* Tutorial restart button */}
      <button onClick={restartTutorial} className="restart-tutorial-btn">
        Restart Tutorial
      </button>
    </>
  )
}

export default App
