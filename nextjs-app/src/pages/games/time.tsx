import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  Active,
  Over,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ModernGameLayout from '../../components/layout/ModernGameLayout'
import WhyCard from '../../components/layout/WhyCard'
import confetti from 'canvas-confetti'
import styles from '../../styles/TimeGame.module.css'

interface Task {
  id: string
  name: string
  timeMinutes: number
  energyDrain: number
  category: 'essential' | 'healthy' | 'distraction'
  bookHint?: string
}

interface ScenarioOption {
  id: string
  description: string
  timeImpact: number
  energyImpact: number
  explanation: string
}

interface Scenario {
  id: string
  question: string
  quote: string
  options: ScenarioOption[]
}

interface SortableTaskProps {
  task: Task
  timeRemaining: number
  energyLevel: number
  disabled?: boolean
}

function SortableTask({ task, timeRemaining, energyLevel, disabled = false }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: timeRemaining < task.timeMinutes || energyLevel < task.energyDrain ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'grab'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.taskCard} ${styles[task.category]} ${isDragging ? styles.dragging : ''}`}
    >
      <div className={styles.taskName}>{task.name}</div>
      <div className={styles.taskInfo}>
        <span className={styles.taskTime}>{task.timeMinutes}min</span>
        <span className={styles.taskEnergy}>
          {task.energyDrain > 0 ? '-' : '+'}{Math.abs(task.energyDrain)} energy
        </span>
      </div>
      <div className={`${styles.categoryBadge} ${styles[task.category]}`}>
        {task.category}
      </div>
      {task.bookHint && (
        <div className={styles.bookHint}>💡 {task.bookHint}</div>
      )}
    </div>
  )
}

interface DroppableSlotProps {
  index: number
  task: Task | null
  onTaskRemove: (index: number) => void
}

function DroppableSlot({ index, task, onTaskRemove }: DroppableSlotProps) {
  const {
    setNodeRef,
    isOver,
  } = useSortable({
    id: `slot-${index}`,
    data: { type: 'slot', index }
  })

  return (
    <div
      ref={setNodeRef}
      className={`${styles.taskSlot} ${task ? styles.filled : styles.empty} ${isOver ? styles.dragOver : ''}`}
      onClick={() => task && onTaskRemove(index)}
    >
      {task ? (
        <div className={styles.slottedTask}>
          <span className={styles.taskName}>{task.name}</span>
          <span className={styles.taskEffects}>
            {task.timeMinutes}min | {task.energyDrain > 0 ? '-' : '+'}{Math.abs(task.energyDrain)} energy
          </span>
        </div>
      ) : (
        <div className={styles.emptySlot}>
          Drop task here
          <span className={styles.slotNumber}>Slot {index + 1}</span>
        </div>
      )}
    </div>
  )
}

const TASKS: Task[] = [
  { id: 'wake-exercise', name: 'Quick Morning Exercise', timeMinutes: 15, energyDrain: -20, category: 'healthy', bookHint: 'Physical activity energizes your body' },
  { id: 'meditation', name: 'Brief Meditation', timeMinutes: 10, energyDrain: -15, category: 'healthy', bookHint: 'Mental clarity improves efficiency' },
  { id: 'shower', name: 'Quick Shower', timeMinutes: 10, energyDrain: -10, category: 'essential', bookHint: 'Refreshing and necessary' },
  { id: 'healthy-breakfast', name: 'Nutritious Breakfast', timeMinutes: 20, energyDrain: -25, category: 'healthy', bookHint: 'Fuel for sustained energy' },
  { id: 'check-schedule', name: 'Review Daily Plan', timeMinutes: 5, energyDrain: 5, category: 'essential', bookHint: 'Planning prevents chaos' },
  { id: 'priority-task', name: 'Most Important Task', timeMinutes: 60, energyDrain: 40, category: 'essential', bookHint: 'Tackle big things when fresh' },
  { id: 'phone-scroll', name: 'Social Media Scrolling', timeMinutes: 30, energyDrain: 25, category: 'distraction', bookHint: 'Easy dopamine drain' },
  { id: 'random-youtube', name: 'Random YouTube Videos', timeMinutes: 45, energyDrain: 30, category: 'distraction', bookHint: 'Time waster in disguise' },
  { id: 'coffee-break', name: 'Extended Coffee Break', timeMinutes: 25, energyDrain: 15, category: 'distraction', bookHint: 'Procrastination in comfort' },
  { id: 'organize-workspace', name: 'Organize Workspace', timeMinutes: 15, energyDrain: 10, category: 'healthy', bookHint: 'Clear space, clear mind' },
  { id: 'urgent-emails', name: 'Handle Urgent Emails', timeMinutes: 20, energyDrain: 15, category: 'essential', bookHint: 'Communication is key' },
  { id: 'skill-learning', name: 'Learn New Skill', timeMinutes: 30, energyDrain: 20, category: 'healthy', bookHint: 'Investment in yourself' }
]

const SCENARIOS: Scenario[] = [
  {
    id: 'energy-choice',
    question: 'You wake up feeling groggy. What\'s your first move?',
    quote: '"Energy management is more important than time management." - Lead India 2020',
    options: [
      { id: 'exercise', description: 'Do light exercise to wake up', timeImpact: -5, energyImpact: 30, explanation: 'Physical activity boosts alertness and energy' },
      { id: 'coffee', description: 'Grab coffee immediately', timeImpact: 10, energyImpact: 10, explanation: 'Quick fix but temporary boost' },
      { id: 'snooze', description: 'Sleep 15 more minutes', timeImpact: 15, energyImpact: -10, explanation: 'Disrupts sleep cycle, makes you groggier' }
    ]
  },
  {
    id: 'distraction-choice',
    question: 'You feel overwhelmed by your task list. What do you do?',
    quote: '"When feeling overwhelmed, the lazy mind seeks easy distractions." - Lead India 2020',
    options: [
      { id: 'plan', description: 'Take 5 minutes to prioritize', timeImpact: -5, energyImpact: 20, explanation: 'Planning reduces mental load and increases efficiency' },
      { id: 'easy-task', description: 'Do the easiest task first', timeImpact: 0, energyImpact: -5, explanation: 'Avoids real priorities, builds false momentum' },
      { id: 'social-media', description: 'Check social media to relax', timeImpact: 20, energyImpact: -15, explanation: 'Escapism that drains mental energy' }
    ]
  }
]

export default function TimeTunnelGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  
  const [currentScenario, setCurrentScenario] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(240) // 4 hours in minutes
  const [energyLevel, setEnergyLevel] = useState(100)
  const [score, setScore] = useState(0)
  const [scheduledTasks, setScheduledTasks] = useState<(Task | null)[]>(Array(8).fill(null))
  const [availableTasks, setAvailableTasks] = useState<Task[]>(TASKS)
  const [feedback, setFeedback] = useState('')
  const [gameComplete, setGameComplete] = useState(false)
  const [totalEfficiencyScore, setTotalEfficiencyScore] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
    const sensors = useSensors(
    useSensor(PointerSensor),    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const startGame = () => {
    setShowInstructions(true)
  }

  const beginPlaying = () => {
    setShowInstructions(false)
    setGameStarted(true)
    // Start with first scenario
    setCurrentScenario(0)
  }

  const handleScenarioChoice = (option: ScenarioOption) => {
    // Apply time and energy impacts
    setTimeRemaining(prev => Math.max(0, prev + option.timeImpact))
    setEnergyLevel(prev => Math.min(100, Math.max(0, prev + option.energyImpact)))
    
    // Add score based on choice quality
    const scoreGain = option.energyImpact > 0 ? 25 : option.energyImpact < -10 ? -15 : 0
    setScore(prev => prev + scoreGain)
    
    setFeedback(option.explanation)
    
    // Move to next scenario or continue game
    setTimeout(() => {
      if (currentScenario !== null && currentScenario < SCENARIOS.length - 1) {
        setCurrentScenario(currentScenario + 1)
        setFeedback('')
      } else {
        setCurrentScenario(null)
        setFeedback('')
      }
    }, 3000)
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeTask = availableTasks.find(task => task.id === active.id)
    if (!activeTask) return

    // Check if dropping on a schedule slot
    if (over.id && typeof over.id === 'string' && over.id.startsWith('slot-')) {
      const slotIndex = parseInt(over.id.replace('slot-', ''))
      
      if (scheduledTasks[slotIndex] === null && 
          timeRemaining >= activeTask.timeMinutes && 
          energyLevel >= activeTask.energyDrain) {
        
        // Add task to schedule
        const newScheduled = [...scheduledTasks]
        newScheduled[slotIndex] = activeTask
        setScheduledTasks(newScheduled)
        
        // Remove from available tasks
        const newAvailable = availableTasks.filter(task => task.id !== activeTask.id)
        setAvailableTasks(newAvailable)
        
        // Apply time and energy costs
        setTimeRemaining(prev => prev - activeTask.timeMinutes)
        setEnergyLevel(prev => Math.max(0, prev + activeTask.energyDrain))
        
        // Calculate score
        let taskScore = 0
        if (activeTask.category === 'essential') taskScore = 20
        else if (activeTask.category === 'healthy') taskScore = 15
        else taskScore = -10
        
        // Bonus for placing essential tasks early
        if (activeTask.category === 'essential' && slotIndex < 3) taskScore += 10
        
        setScore(prev => prev + taskScore)
        setFeedback(`Added ${activeTask.name} to your schedule. ${taskScore > 0 ? '+' : ''}${taskScore} points`)
        setTimeout(() => setFeedback(''), 2000)
      }
    }
  }

  const removeTaskFromSchedule = (index: number) => {
    const task = scheduledTasks[index]
    if (task) {
      const newScheduled = [...scheduledTasks]
      newScheduled[index] = null
      setScheduledTasks(newScheduled)
      
      setAvailableTasks(prev => [...prev, task])
      
      // Restore time and energy
      setTimeRemaining(prev => prev + task.timeMinutes)
      setEnergyLevel(prev => Math.min(100, prev - task.energyDrain))
      
      setFeedback(`Removed ${task.name} from schedule`)
      setTimeout(() => setFeedback(''), 2000)
    }
  }

  const finishPlanning = () => {
    // Calculate final efficiency score
    const essentialTasks = scheduledTasks.filter(task => task?.category === 'essential').length
    const healthyTasks = scheduledTasks.filter(task => task?.category === 'healthy').length
    const distractionTasks = scheduledTasks.filter(task => task?.category === 'distraction').length
    
    const efficiencyScore = (essentialTasks * 30) + (healthyTasks * 20) - (distractionTasks * 15)
    const timeBonus = Math.floor(timeRemaining / 10) * 5
    const energyBonus = Math.floor(energyLevel / 10) * 3
    
    const finalScore = score + efficiencyScore + timeBonus + energyBonus
    setTotalEfficiencyScore(finalScore)
    setScore(finalScore)
    setGameComplete(true)
    
    // Celebration
    if (finalScore > 200) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    }
  }
  const getFoxMood = () => {
    if (energyLevel > 70) return { mood: 'energetic', message: 'Great energy management! Keep it up!' }
    if (energyLevel > 40) return { mood: 'normal', message: 'Good pace, watch your energy levels.' }
    return { mood: 'tired', message: 'You\'re burning out! Choose wisely.' }
  }
    const foxState = getFoxMood()

  if (showInstructions) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.instructionsModal}>
          <div className={styles.foxAvatar}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          <h2 className={styles.instructionsTitle}>Welcome to Time Tunnel Trials!</h2>
          <div className={styles.instructionsList}>
            <p><strong>🎯 Your Mission:</strong> Plan an efficient 4-hour morning schedule</p>
            <p><strong>⚡ Energy System:</strong> Tasks consume or restore energy (0-100)</p>
            <p><strong>⏰ Time Management:</strong> You have 240 minutes to allocate</p>
            <p><strong>🎮 Drag & Drop:</strong> Move tasks from the pool to your timeline</p>
            <p><strong>📚 Categories:</strong></p>
            <p>• <span style={{color: '#10b981'}}>Essential</span> - Must-do tasks (high points)</p>
            <p>• <span style={{color: '#3b82f6'}}>Healthy</span> - Energy-boosting activities</p>
            <p>• <span style={{color: '#ef4444'}}>Distraction</span> - Energy drains (point penalty)</p>
          </div>
          <div className={styles.bookQuote}>
            "The secret to defeating laziness is not willpower - it's intelligent planning." - Lead India 2020
          </div>
          <button className={styles.continueButton} onClick={beginPlaying}>
            Start Your Journey
          </button>
        </div>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <ModernGameLayout
        gameTitle="Time Tunnel Trials"
        gameIcon="🦊"
        whyCard={
          <WhyCard
            title="Why Time & Energy Management?"
            explanation="'Laziness is not about being tired - it's about poor energy allocation. Master your energy, master your time.' - Lead India 2020"
          />
        }
      >
        <div className={styles.gameContainer}>
          <div className={styles.tunnelEffect}></div>
          <div className={styles.header}>
            <h1 className={styles.title}>⏰ Time Tunnel Trials</h1>
            <p className={styles.subtitle}>Master the art of efficient scheduling and energy management</p>            <button 
              className={styles.startButton} 
              onClick={startGame}
              type="button"
            >
              Enter the Time Tunnel
            </button>
          </div>
        </div>
      </ModernGameLayout>
    )
  }

  if (showInstructions) {
    return (
      <div className={styles.modalOverlay}>        <div className={styles.instructionsModal}>
          <div className={styles.foxAvatar}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          <h2 className={styles.instructionsTitle}>Welcome to Time Tunnel Trials!</h2>
          <div className={styles.instructionsList}>
            <p><strong>🎯 Your Mission:</strong> Plan an efficient 4-hour morning schedule</p>
            <p><strong>⚡ Energy System:</strong> Tasks consume or restore energy (0-100)</p>
            <p><strong>⏰ Time Management:</strong> You have 240 minutes to allocate</p>
            <p><strong>🎮 Drag & Drop:</strong> Move tasks from the pool to your timeline</p>
            <p><strong>📚 Categories:</strong></p>
            <p>• <span style={{color: '#10b981'}}>Essential</span> - Must-do tasks (high points)</p>
            <p>• <span style={{color: '#3b82f6'}}>Healthy</span> - Energy-boosting activities</p>
            <p>• <span style={{color: '#ef4444'}}>Distraction</span> - Energy drains (point penalty)</p>
          </div>
          <div className={styles.bookQuote}>
            "The secret to defeating laziness is not willpower - it's intelligent planning." - Lead India 2020
          </div>
          <button className={styles.continueButton} onClick={beginPlaying}>
            Start Your Journey
          </button>
        </div>
      </div>
    )
  }

  if (currentScenario !== null) {
    const scenario = SCENARIOS[currentScenario]
    return (
      <div className={styles.modalOverlay}>        <div className={styles.scenarioModal}>
          <div className={styles.foxAvatar}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          <h2 className={styles.scenarioTitle}>Morning Dilemma</h2>
          <div className={styles.bookQuote}>{scenario.quote}</div>
          <p className={styles.scenarioQuestion}>{scenario.question}</p>
          {feedback ? (
            <div className={styles.feedback}>{feedback}</div>
          ) : (
            <div className={styles.scenarioOptions}>
              {scenario.options.map(option => (
                <button
                  key={option.id}
                  className={styles.scenarioButton}
                  onClick={() => handleScenarioChoice(option)}
                >
                  {option.description}
                  <div className={styles.effectsPreview}>
                    Time: {option.timeImpact > 0 ? '+' : ''}{option.timeImpact}min | 
                    Energy: {option.energyImpact > 0 ? '+' : ''}{option.energyImpact}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
  if (gameComplete) {
    return (
      <ModernGameLayout
        gameTitle="Time Tunnel Trials"
        gameIcon="🦊"
        whyCard={
          <WhyCard
            title="Efficiency Mastery"
            explanation="You've learned that beating laziness isn't about forcing yourself - it's about smart energy allocation and realistic planning."
          />
        }
      >
        <div className={styles.gameContainer}>
          <div className={styles.gameComplete}>
            <h1 className={styles.title}>Time Tunnel Complete!</h1>
            <div className={styles.finalScore}>{totalEfficiencyScore}</div>
            <p>Efficiency Points Earned</p>
            
            <div className={styles.scoreBreakdown}>
              <div className={styles.scoreItem}>
                <span>Task Planning</span>
                <span>+{score - Math.floor(timeRemaining / 10) * 5 - Math.floor(energyLevel / 10) * 3}</span>
              </div>
              <div className={styles.scoreItem}>
                <span>Time Bonus</span>
                <span>+{Math.floor(timeRemaining / 10) * 5}</span>
              </div>
              <div className={styles.scoreItem}>
                <span>Energy Bonus</span>
                <span>+{Math.floor(energyLevel / 10) * 3}</span>
              </div>
              <div className={styles.scoreItem}>
                <span>Total Score</span>
                <span>{totalEfficiencyScore}</span>
              </div>
            </div>

            <div className={styles.whyCard}>
              <h3 className={styles.whyTitle}>💡 Key Insight</h3>
              <p>"Time management is actually energy management. When you align your tasks with your energy levels, productivity flows naturally." - Lead India 2020</p>
            </div>

            <div className={styles.actionButtons}>
              <a href="/" className={styles.homeButton}>
                🏠 Home
              </a>
              <a href="/games/confidence" className={styles.nextGameButton}>
                Next Challenge →
              </a>
            </div>
          </div>
        </div>
      </ModernGameLayout>
    )
  }
  return (
    <ModernGameLayout
      gameTitle="Time Tunnel Trials"
      gameIcon="🦊"
      whyCard={
        <WhyCard
          title="Energy vs Time"
          explanation="Managing energy is more important than managing time. Plan according to when you'll have the most mental and physical energy."
        />
      }
    >
      <div className={styles.gameContainer}>
        <div className={styles.gameArea}>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Time Left</div>
              <div className={styles.statValue}>{timeRemaining}min</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Energy</div>
              <div className={styles.statValue}>{energyLevel}%</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Score</div>
              <div className={styles.statValue}>{score}</div>
            </div>
          </div>          <div className={styles.foxMood}>
            <span style={{ fontSize: '3rem', lineHeight: 1 }}>🦊</span>
            <div className={styles.foxSpeech}>{foxState.message}</div>
          </div>

          {feedback && <div className={styles.feedback}>{feedback}</div>}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.timelineSection}>
              <h3 className={styles.timelineTitle}>📅 Your Morning Schedule (Drag tasks here)</h3>
              <div className={styles.taskSlots}>
                <SortableContext items={scheduledTasks.map((_, index) => `slot-${index}`)} strategy={verticalListSortingStrategy}>
                  {scheduledTasks.map((task, index) => (
                    <DroppableSlot
                      key={`slot-${index}`}
                      index={index}
                      task={task}
                      onTaskRemove={removeTaskFromSchedule}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>

            <div className={styles.tasksSection}>
              <h3 className={styles.tasksTitle}>🎯 Available Tasks (Drag to schedule)</h3>
              <div className={styles.taskPool}>
                <SortableContext items={availableTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                  {availableTasks.map((task) => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      timeRemaining={timeRemaining}
                      energyLevel={energyLevel}
                      disabled={timeRemaining < task.timeMinutes || energyLevel < task.energyDrain}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>

            <DragOverlay>
              {activeId ? (
                <div className={`${styles.taskCard} ${styles.dragging}`}>
                  {availableTasks.find(task => task.id === activeId)?.name}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <button 
            className={styles.finishButton} 
            onClick={finishPlanning}
            disabled={scheduledTasks.filter(t => t !== null).length < 3}
          >
            Complete Time Tunnel Challenge
          </button>
        </div>
      </div>
    </ModernGameLayout>
  )
}
