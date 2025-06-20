import { useContext, useState, useEffect } from "react";
import { notify } from "../../shared/notify";
import confetti from "canvas-confetti";
import { useRouter } from "next/router";
import { UserContext } from "../../shared/UserContext";
import ModernGameLayout from "../../components/layout/ModernGameLayout";
import WhyCard from "../../components/layout/WhyCard";
import styles from "../../styles/TriumphGame.module.css";

interface Badge {
  id: string;
  name: string;
  game: string;
  earned: boolean;
  planted: boolean;
  watered: boolean;
  color: string;
  emoji: string;
  whyCard: string;
  description: string;
}

interface PlantingSpot {
  id: string;
  x: number;
  y: number;
  occupied: boolean;
  badgeId?: string;
}

interface TreeState {
  branches: number;
  fruits: number;
  fullBloom: boolean;
  height: number;
}

const BADGES: Badge[] = [
  {
    id: 'fogland',
    name: 'Fogland Explorer',
    game: 'fogland',
    earned: false,
    planted: false,
    watered: false,
    color: '#9C27B0',
    emoji: '�️',
    whyCard: "Laziness is just a habit. Every action you take makes you stronger.",
    description: "Cleared the fog of confusion and found your path"
  },
  {
    id: 'willpower',
    name: 'Willpower Warrior',
    game: 'willpower',
    earned: false,
    planted: false,
    watered: false,
    color: '#F44336',
    emoji: '⚡',
    whyCard: "Willpower isn't magic—it's practice! Lazy habits sneak in when you're not watching.",
    description: "Built inner strength through consistent effort"
  },
  {
    id: 'goals',
    name: 'Goal-Orb Master',
    game: 'goals',
    earned: false,
    planted: false,
    watered: false,
    color: '#4CAF50',
    emoji: '🎯',
    whyCard: "When you know what matters most, you make faster progress. Too many goals in one place can get stuck!",
    description: "Mastered the art of focused goal achievement"
  },
  {
    id: 'time',
    name: 'Time Tunnel Champion',
    game: 'time',
    earned: false,
    planted: false,
    watered: false,
    color: '#FF9800',
    emoji: '⏰',
    whyCard: "Doing things in order saves time and makes you feel ready. Laziness means doing easy things first—even if they don't help!",
    description: "Conquered time management and prioritization"
  },
  {
    id: 'confidence',
    name: 'Confidence Cavern Hero',
    game: 'confidence',
    earned: false,
    planted: false,
    watered: false,
    color: '#2196F3',
    emoji: '🔥',
    whyCard: "Confidence is built by action and words. Laziness makes your inner voice weak—hero words make it strong!",
    description: "Lit the torches of empowering self-talk"
  }
]

const PLANTING_SPOTS: PlantingSpot[] = [
  { id: 'spot1', x: 20, y: 80, occupied: false },
  { id: 'spot2', x: 35, y: 85, occupied: false },
  { id: 'spot3', x: 50, y: 80, occupied: false },
  { id: 'spot4', x: 65, y: 85, occupied: false },
  { id: 'spot5', x: 80, y: 80, occupied: false }
]

const LESSON_CHOICES = [
  { id: 'action', text: "Clear laziness with small actions." },
  { id: 'willpower', text: "Strengthen willpower every morning." },
  { id: 'goals', text: "Set and sort my goals with care." },
  { id: 'time', text: "Plan my time and do first things first." },
  { id: 'confidence', text: "Use positive words and actions every day." }
]

export default function TreeOfTriumph() {
  const { user, setPoints, addBadge } = useContext(UserContext) as any;
  const router = useRouter();
  
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const [plantingSpots, setPlantingSpots] = useState<PlantingSpot[]>(PLANTING_SPOTS);
  const [treeState, setTreeState] = useState<TreeState>({
    branches: 0,
    fruits: 0,
    fullBloom: false,
    height: 0
  });
  
  const [gamePhase, setGamePhase] = useState<'intro' | 'planting' | 'watering' | 'reflection' | 'celebration' | 'complete'>('intro');
  const [draggedBadge, setDraggedBadge] = useState<string | null>(null);
  const [showWhyCard, setShowWhyCard] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [foxMessage, setFoxMessage] = useState<string>('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Initialize badges based on user's completed games/badges
    const updatedBadges = badges.map(badge => ({
      ...badge,
      earned: user.badges?.includes(badge.id) || user.points?.[badge.game] > 0 || false
    }));
    setBadges(updatedBadges);
    
    // Calculate score from all games
    const totalScore = (user.points?.fogland || 0) + 
                      (user.points?.willpower || 0) + 
                      (user.points?.goals || 0) + 
                      (user.points?.time || 0) + 
                      (user.points?.confidence || 0);
    setScore(totalScore);
  }, [user]);

  const earnedBadges = badges.filter(badge => badge.earned);
  const plantedBadges = badges.filter(badge => badge.planted);
  const wateredBadges = badges.filter(badge => badge.watered);
  
  const allPlanted = earnedBadges.every(badge => badge.planted);
  const allWatered = earnedBadges.every(badge => badge.watered);

  const startGrowing = () => {
    if (earnedBadges.length === 0) {
      notify("Complete some mini-games first to earn badges for your tree!");
      return;
    }
    setGamePhase('planting');
    setFoxMessage("Drag your badges to the soil to plant them! Every achievement deserves to grow!");
  };

  const handleDragStart = (badgeId: string) => {
    setDraggedBadge(badgeId);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent, spotId: string) => {
    event.preventDefault();
    
    if (!draggedBadge) return;
    
    const badge = badges.find(b => b.id === draggedBadge);
    const spot = plantingSpots.find(s => s.id === spotId);
    
    if (!badge || !spot || spot.occupied || badge.planted || !badge.earned) {
      notify("That spot is taken or the badge can't be planted there!");
      return;
    }

    // Plant the badge
    setBadges(prev => prev.map(b => 
      b.id === draggedBadge ? { ...b, planted: true } : b
    ));
    
    setPlantingSpots(prev => prev.map(s => 
      s.id === spotId ? { ...s, occupied: true, badgeId: draggedBadge } : s
    ));
    
    setDraggedBadge(null);
    setFoxMessage(`${badge.name} planted! Great work!`);
    
    // Trigger confetti for planting
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
    
    // Check if all badges are planted
    const newPlantedCount = plantedBadges.length + 1;
    if (newPlantedCount === earnedBadges.length) {
      setTimeout(() => {
        setGamePhase('watering');
        setFoxMessage("All badges planted! Now tap the watering can to help them grow!");
      }, 1500);
    }
  };

  const handleWatering = (badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge || !badge.planted || badge.watered) return;

    // Water the badge
    setBadges(prev => prev.map(b => 
      b.id === badgeId ? { ...b, watered: true } : b
    ));
    
    // Grow the tree
    setTreeState(prev => ({
      ...prev,
      branches: prev.branches + 1,
      fruits: prev.fruits + 1,
      height: Math.min(100, prev.height + 20)
    }));
    
    // Show WHY card
    setShowWhyCard(badgeId);
    setFoxMessage(`${badge.name} is growing! Look how beautiful!`);
    
    // Trigger growth confetti
    confetti({ 
      particleCount: 40, 
      spread: 60, 
      origin: { x: 0.5, y: 0.3 },
      colors: [badge.color, '#4CAF50', '#8BC34A']
    });
    
    // Check if all are watered
    const newWateredCount = wateredBadges.length + 1;
    if (newWateredCount === earnedBadges.length) {
      setTimeout(() => {
        setTreeState(prev => ({ ...prev, fullBloom: true }));
        setGamePhase('reflection');
        setFoxMessage("Your Tree of Triumph is in full bloom! Choose your focus lesson!");
      }, 2000);
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLesson(lessonId);
  };

  const finishJourney = () => {
    if (!selectedLesson) {
      notify("Choose a lesson to focus on first!");
      return;
    }
    
    setPoints('triumph', score + 100);
    
    const earned: string[] = [];
    if (!user.badges.includes('tree-grower')) {
      addBadge('tree-grower');
      earned.push('tree-grower');
    }
    if (earnedBadges.length >= 5 && !user.badges.includes('badge-collector')) {
      addBadge('badge-collector');
      earned.push('badge-collector');
    }
    if (!user.badges.includes('badhohero-champion')) {
      addBadge('badhohero-champion');
      earned.push('badhohero-champion');
    }

    // Epic finale confetti
    confetti({ 
      particleCount: 150, 
      spread: 120, 
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    });
    
    const msg = earned.length
      ? `Journey Complete! Earned ${earned.length} badge${earned.length > 1 ? 's' : ''}!`
      : 'BadhoHero Journey Complete!';
    
    notify(msg);
    setGamePhase('celebration');
    setFoxMessage("You are now a true BadhoHero! Your tree will keep growing with every action you take!");
  };

  const playAgain = () => {
    // Reset all states
    setBadges(prev => prev.map(badge => ({
      ...badge,
      planted: false,
      watered: false
    })));    setPlantingSpots(PLANTING_SPOTS);
    setTreeState({ branches: 0, fruits: 0, fullBloom: false, height: 0 });
    setGamePhase('intro');
    setSelectedLesson(null);
    setFoxMessage('');
  };

  return (
    <>      <ModernGameLayout
        gameTitle="Tree of Triumph"
        gameIcon="🌳"
        whyCard={
          <WhyCard
            title="Why Your Efforts Add Up to Triumph"
            explanation="Every small action you took in each mini-game was like planting a seed. Now you get to see your Tree of Triumph grow from all your efforts combined. Heroes know that consistency creates compound growth."
            lesson={
              <div>
                <p><strong>Tree of Triumph Formula:</strong></p>
                <ul>
                  <li><strong>Plant Your Wins:</strong> Every achievement deserves recognition</li>
                  <li><strong>Water With Action:</strong> Reflection turns experience into wisdom</li>
                  <li><strong>Choose Your Focus:</strong> One lesson practiced deeply beats many practiced lightly</li>
                  <li><strong>Compound Growth:</strong> Small consistent efforts create massive results</li>
                </ul>
              </div>
            }
            examples={[
              {
                good: "I'll practice one lesson deeply every day",
                bad: "I'll try to remember everything at once"
              },
              {
                good: "My small efforts are building something big",
                bad: "These little actions don't really matter"
              }
            ]}
            tip="Complete the work taken up. Visualize 'what next' and plan tomorrow's work as a leader!"
          />
        }
        nextGameButton={
          gamePhase === 'complete' ? (
            <button className="btn-primary" onClick={() => router.push('/profile')}>
              View Your BadhoHero Profile →
            </button>
          ) : null
        }
      >
        <div className={styles.gameContainer}>          <div className={styles.header}>
            <span style={{
              fontSize: '4rem', 
              lineHeight: 1,
              filter: `brightness(${100 + (wateredBadges.length * 20)}%) saturate(${100 + (wateredBadges.length * 10)}%)`
            }}>🦊</span>
            <h2>Tree of Triumph</h2>
            <p>Plant your badges and watch your Tree of Triumph grow!</p>
            <div className={styles.scoreBoard}>
              <span>Score: {score}</span>
              <span>Badges: {earnedBadges.length}</span>
              <span>Tree Height: {treeState.height}%</span>
            </div>
          </div>

          {foxMessage && (
            <div className={styles.foxMessage}>
              <div className={styles.foxAvatar}>🦊</div>
              <div className={styles.message}>{foxMessage}</div>
            </div>
          )}

          {gamePhase === 'intro' && (
            <div className={styles.introSection}>
              <div className={styles.introContent}>
                <h3>🌳 Welcome to Your Tree of Triumph!</h3>
                <p>
                  Every challenge you've completed, every victory you've earned - they're all seeds waiting to grow into something beautiful.
                </p>
                <p>
                  <strong>Your Mission:</strong> Plant the badges you've earned, water them with reflection, and watch your Tree of Triumph bloom!
                </p>
                <div className={styles.badgePreview}>
                  <h4>Your Earned Badges:</h4>
                  {earnedBadges.length > 0 ? (
                    <div className={styles.earnedBadgeGrid}>
                      {earnedBadges.map(badge => (
                        <div key={badge.id} className={styles.earnedBadgeItem}>
                          <div className={styles.badgeIcon} style={{ color: badge.color }}>
                            {badge.emoji}
                          </div>
                          <div className={styles.badgeName}>{badge.name}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Complete some mini-games to earn badges for your tree!</p>
                  )}
                </div>
                <button 
                  className={styles.startButton} 
                  onClick={startGrowing}
                  disabled={earnedBadges.length === 0}
                >
                  {earnedBadges.length > 0 ? 'Grow My Tree of Triumph! 🌳' : 'Earn Badges First'}
                </button>
              </div>
            </div>
          )}

          {(gamePhase === 'planting' || gamePhase === 'watering') && (
            <div className={styles.treeSection}>
              <div className={styles.treeContainer}>
                <div className={styles.tree}>
                  <div className={styles.treeTrunk}></div>
                  <div 
                    className={styles.treeFoliage}
                    style={{
                      transform: `scale(${0.5 + (treeState.height / 200)})`,
                      opacity: treeState.fullBloom ? 1 : 0.3 + (treeState.height / 200)
                    }}
                  >
                    {Array.from({ length: treeState.branches }).map((_, i) => (
                      <div 
                        key={i} 
                        className={styles.branch}
                        style={{
                          '--delay': `${i * 0.3}s`,
                          animationDelay: `${i * 0.3}s`
                        } as React.CSSProperties}
                      >
                        <div className={styles.fruit} style={{ backgroundColor: earnedBadges[i]?.color || '#4CAF50' }}>
                          {earnedBadges[i]?.emoji || '🍎'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.soil}>
                  {plantingSpots.map(spot => (
                    <div
                      key={spot.id}
                      className={`${styles.plantingSpot} ${spot.occupied ? styles.occupied : ''}`}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, spot.id)}
                    >
                      {spot.occupied && spot.badgeId && (
                        <div className={styles.plantedBadge}>
                          <div className={styles.seed}>
                            {badges.find(b => b.id === spot.badgeId)?.emoji}
                          </div>
                          {gamePhase === 'watering' && (
                            <button
                              className={styles.waterButton}
                              onClick={() => handleWatering(spot.badgeId!)}
                              disabled={badges.find(b => b.id === spot.badgeId)?.watered}
                            >
                              {badges.find(b => b.id === spot.badgeId)?.watered ? '🌱' : '💧'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {gamePhase === 'planting' && (
                <div className={styles.badgeInventory}>
                  <h4>Drag Your Badges to Plant Them:</h4>
                  <div className={styles.badgeGrid}>
                    {earnedBadges.filter(badge => !badge.planted).map(badge => (
                      <div
                        key={badge.id}
                        className={styles.badge}
                        style={{ borderColor: badge.color }}
                        draggable
                        onDragStart={() => handleDragStart(badge.id)}
                      >
                        <div className={styles.badgeIcon} style={{ color: badge.color }}>
                          {badge.emoji}
                        </div>
                        <div className={styles.badgeName}>{badge.name}</div>
                      </div>
                    ))}
                  </div>
                  {allPlanted && (
                    <div className={styles.nextPhaseMessage}>
                      All badges planted! Time to water them! 💧
                    </div>
                  )}
                </div>
              )}

              {gamePhase === 'watering' && (
                <div className={styles.wateringInstructions}>
                  <h4>💧 Tap the watering can to help each badge grow!</h4>
                  <div className={styles.wateringProgress}>
                    {wateredBadges.length} of {plantedBadges.length} badges watered
                  </div>
                  {allWatered && (
                    <div className={styles.nextPhaseMessage}>
                      Your tree is in full bloom! 🌳✨
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {gamePhase === 'reflection' && (
            <div className={styles.reflectionSection}>
              <div className={styles.fullBloomTree}>
                <h3>🌳 Your Tree of Triumph is Complete! 🌳</h3>
                <p>Every effort you made has blossomed into something beautiful. Now choose the lesson you want to keep growing:</p>
                
                <div className={styles.lessonChoices}>
                  {LESSON_CHOICES.map(lesson => (
                    <button
                      key={lesson.id}
                      className={`${styles.lessonChoice} ${selectedLesson === lesson.id ? styles.selected : ''}`}
                      onClick={() => handleLessonSelect(lesson.id)}
                    >
                      {lesson.text}
                    </button>
                  ))}
                </div>

                <div className={styles.wisdomQuote}>
                  <strong>Lead India 2020 Wisdom:</strong>
                  <p>"Complete the work taken up. You yourself visualize 'what next' and plan tomorrow's work as a leader."</p>
                </div>

                <button 
                  className={styles.finishButton} 
                  onClick={finishJourney}
                  disabled={!selectedLesson}
                >
                  Complete My Hero Journey! 👑
                </button>
              </div>
            </div>
          )}

          {gamePhase === 'celebration' && (
            <div className={styles.celebrationSection}>
              <div className={styles.celebration}>
                <div className={styles.crownIcon}>👑</div>
                <h3>🎉 BadhoHero Journey Complete! 🎉</h3>
                <p>You've planted, watered, and grown your Tree of Triumph. You are now a true BadhoHero!</p>
                <div className={styles.finalStats}>
                  <div>🌳 Tree Height: {treeState.height}%</div>
                  <div>🏆 Total Score: {score + 100}</div>
                  <div>🎖️ Badges Earned: {earnedBadges.length}</div>
                </div>
                <div className={styles.selectedLesson}>
                  <strong>Your Focus Lesson:</strong>
                  <p>{LESSON_CHOICES.find(l => l.id === selectedLesson)?.text}</p>
                </div>
                <div className={styles.celebrationButtons}>
                  <button className="btn-primary" onClick={() => router.push('/profile')}>
                    View Your Profile →
                  </button>
                  <button className={styles.playAgainButton} onClick={playAgain}>
                    Plant Another Tree 🌳
                  </button>
                </div>
              </div>
            </div>
          )}

          {showWhyCard && (
            <div className={styles.whyCardModal}>
              <div className={styles.whyCardContent}>
                <h4>Why This Badge Matters</h4>
                <p>{badges.find(b => b.id === showWhyCard)?.whyCard}</p>
                <button 
                  className={styles.closeWhyCard} 
                  onClick={() => setShowWhyCard(null)}
                >
                  Continue Growing 🌱
                </button>
              </div>
            </div>
          )}
        </div>      </ModernGameLayout>
    </>
  );
}

export function Head() {
  return (
    <>
      <title>Tree of Triumph - BadhoHero</title>
      <meta
        name="description"
        content="Plant your badges and watch your Tree of Triumph grow! The ultimate celebration of your BadhoHero journey."
      />
      <link rel="canonical" href="https://badhohero.vercel.app/games/triumph" />
    </>
  );
}

export const getStaticProps = async () => ({ props: {} });
