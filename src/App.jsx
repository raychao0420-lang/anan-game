import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
import HomeRoomScreen from './screens/HomeRoomScreen'
import ExamBossScreen from './screens/ExamBossScreen'
import MaketenScreen from './screens/MaketenScreen'
import MakeTwentyScreen from './screens/MakeTwentyScreen'
import MakeHundredScreen from './screens/MakeHundredScreen'
import CrossEqualsScreen from './screens/CrossEqualsScreen'
import WordProblemScreen from './screens/WordProblemScreen'
import MultiplyScreen from './screens/MultiplyScreen'
import GachaScreen from './screens/GachaScreen'
import ArcadeScreen from './screens/ArcadeScreen'
import AchievementToast from './components/AchievementToast'
import './index.css'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.15 } },
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeStage, setActiveStage] = useState(null)
  const [activeBoss, setActiveBoss] = useState(null)
  const [gameResults, setGameResults] = useState(null)

  const initDaily = useGameStore(s => s.initDaily)
  const checkMoodDecay = useGameStore(s => s.checkMoodDecay)
  const claimDailyGift = useGameStore(s => s.claimDailyGift)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    initDaily(today)
    checkMoodDecay()
    claimDailyGift(today, yesterday)
  }, [initDaily, checkMoodDecay, claimDailyGift])

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

  const wrap = (key, node) => (
    <motion.div key={key} variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      {node}
    </motion.div>
  )

  const wrapFixed = (key, node) => (
    <motion.div key={key} variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {node}
    </motion.div>
  )

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden' }}>
      <AchievementToast />

      <AnimatePresence mode="wait">
        {screen === 'home'         && wrap('home', <HomeScreen onNavigate={setScreen} />)}
        {screen === 'stages'       && wrap('stages', <StageScreen onNavigate={setScreen} onStartStage={handleStartStage} />)}
        {screen === 'pets'         && wrap('pets', <PetScreen onNavigate={setScreen} />)}
        {screen === 'shop'         && wrap('shop', <ShopScreen onNavigate={setScreen} />)}
        {screen === 'daily'        && wrap('daily', <DailyScreen onNavigate={setScreen} />)}
        {screen === 'achievements' && wrap('achievements', <AchievementScreen onNavigate={setScreen} />)}
        {screen === 'homeroom'     && wrap('homeroom', <HomeRoomScreen onNavigate={setScreen} />)}
        {screen === 'examboss'    && wrap('examboss', <ExamBossScreen  onBack={() => setScreen('home')} />)}
        {screen === 'maketen'     && wrap('maketen',  <MaketenScreen    onBack={() => setScreen('home')} />)}
        {screen === 'maketwenty'  && wrap('maketwenty', <MakeTwentyScreen onBack={() => setScreen('home')} />)}
        {screen === 'makehundred' && wrap('makehundred', <MakeHundredScreen onBack={() => setScreen('home')} />)}
        {screen === 'crossequals' && wrap('crossequals', <CrossEqualsScreen onBack={() => setScreen('home')} />)}
        {screen === 'wordproblem' && wrap('wordproblem', <WordProblemScreen onBack={() => setScreen('home')} />)}
        {screen === 'multiply'    && wrap('multiply', <MultiplyScreen  onBack={() => setScreen('home')} />)}
        {screen === 'gacha'       && wrap('gacha',    <GachaScreen     onBack={() => setScreen('home')} />)}
        {screen === 'arcade'      && wrap('arcade',   <ArcadeScreen    onBack={() => setScreen('home')} />)}

        {screen === 'game' && activeStage && wrapFixed(`game-${activeStage}`,
          <GameScreen
            key={`${activeStage}-${Date.now()}`}
            stageId={activeStage}
            onFinish={handleGameFinish}
            onExit={() => setScreen('stages')}
          />
        )}

        {screen === 'result' && gameResults && wrap('result',
          <ResultScreen
            stageId={activeStage}
            results={gameResults}
            onRetry={() => handleStartStage(activeStage)}
            onNext={() => handleStartStage(activeStage + 1)}
            onHome={() => setScreen('home')}
            onBoss={handleBossChallenge}
          />
        )}

        {screen === 'boss' && activeBoss && wrap(`boss-${activeBoss}`,
          <BossScreen
            key={`boss-${activeBoss}`}
            chapterId={activeBoss}
            onBack={() => setScreen('home')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
