import { useState, useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import HomeScreen from './screens/HomeScreen'
import StageScreen from './screens/StageScreen'
import GameScreen from './screens/GameScreen'
import ResultScreen from './screens/ResultScreen'
import PetScreen from './screens/PetScreen'
import ShopScreen from './screens/ShopScreen'
import DailyScreen from './screens/DailyScreen'
import BossScreen from './screens/BossScreen'
import AchievementScreen from './screens/AchievementScreen'
import AchievementToast from './components/AchievementToast'
import './index.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeStage, setActiveStage] = useState(null)
  const [activeBoss, setActiveBoss] = useState(null)
  const [gameResults, setGameResults] = useState(null)

  const initDaily = useGameStore(s => s.initDaily)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    initDaily(today)
  }, [initDaily])

  const handleStartStage = (id) => {
    setActiveStage(id)
    setGameResults(null)
    setScreen('game')
  }

  const handleGameFinish = (stageId, results) => {
    setGameResults(results)
    setScreen('result')
  }

  const handleBossChallenge = () => {
    setActiveBoss(activeStage)
    setScreen('boss')
  }

  return (
    <>
      <AchievementToast />

      {screen === 'home'         && <HomeScreen onNavigate={setScreen} />}
      {screen === 'stages'       && <StageScreen onNavigate={setScreen} onStartStage={handleStartStage} />}
      {screen === 'pets'         && <PetScreen onNavigate={setScreen} />}
      {screen === 'shop'         && <ShopScreen onNavigate={setScreen} />}
      {screen === 'daily'        && <DailyScreen onNavigate={setScreen} />}
      {screen === 'achievements' && <AchievementScreen onNavigate={setScreen} />}

      {screen === 'game' && activeStage && (
        <GameScreen
          key={`${activeStage}-${Date.now()}`}
          stageId={activeStage}
          onFinish={handleGameFinish}
        />
      )}

      {screen === 'result' && gameResults && (
        <ResultScreen
          stageId={activeStage}
          results={gameResults}
          onRetry={() => handleStartStage(activeStage)}
          onNext={() => handleStartStage(activeStage + 1)}
          onHome={() => setScreen('home')}
          onBoss={handleBossChallenge}
        />
      )}

      {screen === 'boss' && activeBoss && (
        <BossScreen
          key={`boss-${activeBoss}`}
          chapterId={activeBoss}
          onBack={() => setScreen('home')}
        />
      )}
    </>
  )
}
