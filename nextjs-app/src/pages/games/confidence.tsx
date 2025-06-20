import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import ModernGameLayout from '../../components/layout/ModernGameLayout'
import WhyCard from '../../components/layout/WhyCard'
import { UserContext } from '../../shared/UserContext'
import { notify } from '../../shared/notify'
import confetti from 'canvas-confetti'
import styles from '../../styles/ConfidenceGame.module.css'

interface AffirmationOption {
  text: string
  quality: 'best' | 'mediocre' | 'weak'
  feedback: string
}

interface Scenario {
  id: string
  challenge: string
  description: string
  affirmations: AffirmationOption[]
  bestQualities: ('best')[]
  bookQuote: string
}

interface Torch {
  id: string
  scenario: Scenario
  isLit: boolean
  selectedAffirmation?: AffirmationOption
  attempts: number
}

const SCENARIOS: Scenario[] = [
  {
    id: 'homework',
    challenge: 'I need to finish my homework',
    description: 'You have a lot of homework and feel overwhelmed. What empowering thought will help you succeed?',
    affirmations: [
      { text: "I can't do this, it's too hard.", quality: 'weak', feedback: "That's giving up before you start! Heroes face challenges head-on. Try a more empowering affirmation!" },
      { text: "I'll do my best, one step at a time.", quality: 'best', feedback: "Perfect! Breaking challenges into steps builds real confidence. Heroes know persistence wins!" },
      { text: "Maybe I'll get lucky and it will be easy.", quality: 'mediocre', feedback: "Luck is nice, but preparation and effort are what heroes rely on. Choose self-empowerment!" },
      { text: "I'll ask for help when I need it.", quality: 'best', feedback: "Excellent! Smart heroes know when to seek guidance. That's true wisdom and strength!" }
    ],
    bestQualities: ['best'],
    bookQuote: "'Always think highly and positively with a great vision.' - Lead India 2020"
  },  {
    id: 'new-friend',
    challenge: 'I want to talk to someone new',
    description: 'There is someone you would like to be friends with, but you feel nervous. Which affirmation empowers you most?',
    affirmations: [
      { text: "I'm too shy, they probably won't like me.", quality: 'weak', feedback: "That's fear talking! Heroes push through nervousness. Choose courage over fear!" },
      { text: "I'll smile and introduce myself confidently.", quality: 'best', feedback: "Amazing! Confidence grows with every brave action. Heroes start with simple, genuine gestures!" },
      { text: "I'll wait and see if they approach me first.", quality: 'weak', feedback: "Waiting puts your happiness in someone else's hands. Heroes take initiative!" },
      { text: "I'll find something we have in common to talk about.", quality: 'best', feedback: "Smart strategy! Finding connections makes friendship natural. That's hero-level thinking!" }
    ],
    bestQualities: ['best'],
    bookQuote: "'I will complete works regularly on a day-to-day basis.' - Lead India 2020"
  },  {
    id: 'new-subject',
    challenge: 'I need to learn something difficult',
    description: 'You are starting a challenging new subject. What mindset will help you thrive?',
    affirmations: [
      { text: "This is too hard, I'll never understand it.", quality: 'weak', feedback: "That's limiting yourself! Heroes see challenges as growth opportunities. Choose empowerment!" },
      { text: "I'll learn step by step and celebrate progress.", quality: 'best', feedback: "Perfect! Growth mindset is a hero's superpower. Every step forward builds strength!" },
      { text: "I'll just try to get by with minimum effort.", quality: 'mediocre', feedback: "That's playing small! Heroes aim higher and discover their true potential." },
      { text: "I'm curious to see what I can achieve.", quality: 'best', feedback: "Excellent! Curiosity turns challenges into adventures. That's how heroes discover greatness!" }
    ],
    bestQualities: ['best'],
    bookQuote: "'Always think highly and positively with a great vision.' - Lead India 2020"
  },
  {
    id: 'speak-class',
    challenge: 'I want to speak up in class',
    description: 'You have a question or idea but feel nervous about speaking up. What empowering thought serves you?',
    affirmations: [
      { text: "What if I say something wrong?", quality: 'weak', feedback: "Fear of mistakes stops growth! Heroes know that questions lead to learning. Choose courage!" },
      { text: "My question matters and helps my learning.", quality: 'best', feedback: "Absolutely! Heroes value their curiosity and know questions make everyone smarter!" },
      { text: "I'll stay quiet to be safe.", quality: 'weak', feedback: "Playing it safe limits your growth. Heroes speak up and expand their world!" },
      { text: "I have valuable thoughts to contribute.", quality: 'best', feedback: "Yes! Heroes recognize their worth and share their gifts with confidence!" }
    ],
    bestQualities: ['best'],
    bookQuote: "'Do not underestimate yourself.' - Lead India 2020"
  },
  {
    id: 'help-chores',
    challenge: 'I should help with household chores',
    description: 'You see chores that need doing but feel tired. What affirmation builds character?',
    affirmations: [
      { text: "Someone else can do it.", quality: 'weak', feedback: "That's avoiding responsibility! Heroes step up when help is needed. Choose action!" },
      { text: "I'll do my part to help my family.", quality: 'best', feedback: "Outstanding! Taking responsibility builds true character and family strength!" },
      { text: "I'll do it later when I feel like it.", quality: 'mediocre', feedback: "Later rarely comes! Heroes act now and build momentum through immediate action." },
      { text: "Helping others makes me feel good about myself.", quality: 'best', feedback: "Perfect! Heroes know that service to others builds genuine self-worth and joy!" }
    ],
    bestQualities: ['best'],
    bookQuote: "'I will complete works regularly on a day-to-day basis.' - Lead India 2020"
  },
  {
    id: 'wake-early',
    challenge: 'I want to wake up early',
    description: 'You want to start waking up earlier but struggle with motivation. What mindset empowers you?',
    affirmations: [
      { text: "I'm not a morning person, so why try?", quality: 'weak', feedback: "That's a limiting belief! Heroes shape their habits to serve their goals. You can change!" },
      { text: "I'll take control of my schedule and start fresh.", quality: 'best', feedback: "Excellent! Heroes own their choices and create the life they want through discipline!" },
      { text: "I'll try, but probably fail like before.", quality: 'weak', feedback: "Expecting failure creates failure! Heroes focus on possibility and past progress." },
      { text: "Early mornings give me time for what matters most.", quality: 'best', feedback: "Perfect! Heroes align actions with values and create time for their priorities!" }
    ],
    bestQualities: ['best'],
    bookQuote: "'Be regular and disciplined in your life.' - Lead India 2020"
  }
]

const WHY_CARDS = [
  {
    question: "Why do affirmations work better than positive thinking?",
    answer: "Affirmations are action-oriented thoughts that direct behavior, while positive thinking is passive. Heroes use affirmations to shape their actions.",
    points: 25
  },
  {
    question: "Why do heroes light torches of empowerment?",
    answer: "Each torch represents mastery over self-doubt. Heroes illuminate their path by choosing empowering thoughts that lead to confident action.",
    points: 25
  },
  {
    question: "Why does confidence grow through choice, not chance?",
    answer: "Confidence is built through evidence of capability. Every empowering choice creates proof of your strength, building unshakeable self-trust.",
    points: 25
  }
]

export default function ConfidenceCavern() {
  const { user, setPoints, addBadge } = useContext(UserContext) as any;
  const router = useRouter();
  
  // Initialize torches from scenarios
  const [torches, setTorches] = useState<Torch[]>(() => 
    SCENARIOS.map(scenario => ({
      id: scenario.id,
      scenario,
      isLit: false,
      attempts: 0
    }))
  );
  
  const [currentTorchIndex, setCurrentTorchIndex] = useState(0);
  const [selectedAffirmation, setSelectedAffirmation] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gamePhase, setGamePhase] = useState<'intro' | 'lighting' | 'why' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const [foxBrightness, setFoxBrightness] = useState(0);
  const [whyAnswered, setWhyAnswered] = useState<boolean[]>([false, false, false]);
  const [showComplete, setShowComplete] = useState(false);

  const litTorches = torches.filter(torch => torch.isLit).length;
  const totalTorches = torches.length;
  const progressPercent = (litTorches / totalTorches) * 100;

  const startGame = () => {
    setGamePhase('lighting');
    setCurrentTorchIndex(0);
    setSelectedAffirmation(null);
    setShowFeedback(false);
  };

  const handleAffirmationSelect = (affirmationIndex: number) => {
    if (selectedAffirmation !== null) return;
    
    setSelectedAffirmation(affirmationIndex);
    const currentTorch = torches[currentTorchIndex];
    const selectedAff = currentTorch.scenario.affirmations[affirmationIndex];
    
    // Update attempts
    const updatedTorches = [...torches];
    updatedTorches[currentTorchIndex].attempts += 1;
    
    // Check if it's a "best" affirmation
    if (selectedAff.quality === 'best') {
      // Light the torch!
      updatedTorches[currentTorchIndex].isLit = true;
      updatedTorches[currentTorchIndex].selectedAffirmation = selectedAff;
      
      // Update score and fox brightness
      setScore(prev => prev + 50);
      setFoxBrightness(prev => Math.min(100, prev + (100 / totalTorches)));
      
      // Trigger confetti for torch lighting
      confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
    } else {
      // Wrong choice - no torch lighting, but still record attempt
      setScore(prev => prev + 10); // Small consolation points
    }
    
    setTorches(updatedTorches);
    setShowFeedback(true);

    // Auto-advance after feedback
    setTimeout(() => {
      if (selectedAff.quality === 'best') {
        // Move to next torch or complete if all lit
        if (currentTorchIndex < totalTorches - 1) {
          setCurrentTorchIndex(prev => prev + 1);
          setSelectedAffirmation(null);
          setShowFeedback(false);
        } else {
          // All torches lit!
          setGamePhase('why');
        }
      } else {
        // Allow retry for the same torch
        setSelectedAffirmation(null);
        setShowFeedback(false);
      }
    }, 3000);
  };

  const handleWHYAnswer = (cardIndex: number) => {
    if (whyAnswered[cardIndex]) return;

    const newWhyAnswered = [...whyAnswered];
    newWhyAnswered[cardIndex] = true;
    setWhyAnswered(newWhyAnswered);

    const cardPoints = WHY_CARDS[cardIndex].points;
    setScore(prev => prev + cardPoints);

    if (newWhyAnswered.every(answered => answered)) {
      setTimeout(() => {
        handleGameComplete();
      }, 2000);
    }
  };

  const handleGameComplete = () => {
    setPoints('confidence', score);
    
    const earned: string[] = [];
    if (score >= 400 && !user.badges.includes('torch-master')) {
      addBadge('torch-master');
      earned.push('torch-master');
    }
    if (litTorches === totalTorches && !user.badges.includes('confidence-champion')) {
      addBadge('confidence-champion');
      earned.push('confidence-champion');
    }
    if (foxBrightness >= 80 && !user.badges.includes('fox-illuminator')) {
      addBadge('fox-illuminator');
      earned.push('fox-illuminator');
    }

    const msg = earned.length
      ? `Confidence Mastered! Earned ${earned.length} badge${earned.length > 1 ? 's' : ''}.`
      : 'Confidence Mastered!';
    
    if (earned.length > 0) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    notify(msg);
    setGamePhase('complete');
    setShowComplete(true);
  };

  if (showComplete) {
    return (
      <div className={styles.completePage}>
        <div className={styles.congratsOverlay}>
          <div className={styles.congratsModal} role="dialog" aria-modal="true">
            <img
              src="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%2018%2C%202025%2C%2004_20_17%20PM.png"
              alt="BadhoHero fox radiating confidence with lit torches"
              style={{ 
                width: '200px', 
                display: 'block', 
                margin: '0 auto',
                filter: `brightness(${100 + foxBrightness}%)`
              }}
            />
            <h2>� All Torches Lit! Confidence Unleashed!</h2>
            <p>You've mastered the art of empowering affirmations and built unshakeable confidence!</p>
            <p><strong>Final Score: {score} points</strong></p>
            <p><strong>Torches Lit: {litTorches}/{totalTorches}</strong></p>
            <p><strong>Fox Brightness: {Math.round(foxBrightness)}%</strong></p>
            <button
              className="btn-primary"
              onClick={() => router.push('/games/triumph')}
              style={{ display: 'block', marginTop: '1rem' }}
            >
              Final Challenge: Tree of Triumph →
            </button>
            <a
              className="coffee-link"
              href="https://coff.ee/badhohero"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', marginTop: '0.5rem' }}
            >
              ☕ Buy me a coffee
            </a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <ModernGameLayout
        gameTitle="Confidence Cavern"
        gameIcon="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%2018%2C%202025%2C%2004_20_17%20PM.png"
        whyCard={
          <WhyCard
            title="Why Affirmations Light the Fire of Confidence"
            explanation="Confidence isn't built through wishful thinking - it's built through empowering thoughts that drive empowering actions. Each positive affirmation you choose lights a torch of possibility in your mind."
            lesson={
              <div>
                <p><strong>Affirmation Power Formula:</strong></p>
                <ul>
                  <li><strong>Empowering Language:</strong> Choose words that inspire action</li>
                  <li><strong>Growth Focus:</strong> See challenges as opportunities</li>
                  <li><strong>Action Orientation:</strong> Link thoughts to behaviors</li>
                  <li><strong>Self-Compassion:</strong> Speak to yourself with kindness</li>
                </ul>
              </div>
            }
            examples={[
              {
                good: "I'll learn step by step and celebrate progress",
                bad: "This is too hard, I'll never understand it"
              },
              {
                good: "I have valuable thoughts to contribute",
                bad: "What if I say something wrong?"
              }
            ]}
            tip="Heroes choose thoughts that empower action. Light your torches with wisdom!"
          />
        }
        nextGameButton={
          gamePhase === 'complete' ? (
            <button className="btn-primary" onClick={() => router.push('/games/triumph')}>
              Final Challenge: Tree of Triumph →
            </button>
          ) : null
        }
      >
        <div className={styles.gameContainer}>
          <div className={styles.header}>
            <img
              src="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%2018%2C%202025%2C%2004_20_17%20PM.png"
              alt="BadhoHero fox with increasing brightness as torches are lit"
              className={styles.heroImg}
              style={{ 
                filter: `brightness(${100 + foxBrightness}%) contrast(${100 + foxBrightness/2}%)`
              }}
            />
            <h2>Confidence Cavern - Torch Challenge</h2>
            <p>Light torches by choosing the most empowering affirmations!</p>
            <div className={styles.scoreBoard}>
              <span>Score: {score}</span>
              <span>Torches: {litTorches}/{totalTorches}</span>
              <span>Fox Power: {Math.round(foxBrightness)}%</span>
            </div>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressLabel}>Torch Progress</div>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className={styles.progressText}>{litTorches} of {totalTorches} torches lit</div>
          </div>

          {gamePhase === 'intro' && (
            <div className={styles.introSection}>
              <div className={styles.introContent}>
                <h3>🔥 Welcome to the Confidence Cavern!</h3>
                <p>
                  In this mystical cavern, six ancient torches await your empowering thoughts. 
                  Each torch represents a life challenge that requires confident thinking.
                </p>
                <p>
                  <strong>Your Mission:</strong> Choose the most empowering affirmations to light each torch. 
                  Only the best choices will ignite the flame and increase your fox's inner light!
                </p>
                <div className={styles.torchPreview}>
                  {torches.map((torch, index) => (
                    <div key={torch.id} className={styles.torchPreviewItem}>
                      <div className={styles.torchIcon}>
                        {torch.isLit ? '🔥' : '🕯️'}
                      </div>
                      <div className={styles.torchLabel}>{torch.scenario.challenge}</div>
                    </div>
                  ))}
                </div>
                <button className={styles.startButton} onClick={startGame}>
                  Begin Lighting Torches! �
                </button>
              </div>
            </div>
          )}

          {gamePhase === 'lighting' && (
            <div className={styles.challengeSection}>
              <div className={styles.challengeHeader}>
                <h3>Torch {currentTorchIndex + 1} of {totalTorches}</h3>
                <div className={styles.torchStatus}>
                  {torches[currentTorchIndex].isLit ? '🔥 LIT' : '🕯️ UNLIT'}
                </div>
              </div>

              <div className={styles.scenario}>
                <div className={styles.scenarioTitle}>Challenge:</div>
                <h4>{torches[currentTorchIndex].scenario.challenge}</h4>
                <p>{torches[currentTorchIndex].scenario.description}</p>
              </div>

              <div className={styles.affirmationPrompt}>
                <div className={styles.promptTitle}>Choose the most empowering affirmation:</div>
              </div>

              <div className={styles.affirmations}>
                {torches[currentTorchIndex].scenario.affirmations.map((affirmation, index) => (
                  <button
                    key={index}
                    className={`${styles.affirmationButton} ${styles[affirmation.quality]} ${
                      selectedAffirmation === index ? styles.selected : ''
                    }`}
                    onClick={() => handleAffirmationSelect(index)}
                    disabled={selectedAffirmation !== null}
                  >
                    <div className={styles.affirmationText}>"{affirmation.text}"</div>
                    {showFeedback && selectedAffirmation === index && (
                      <div className={styles.affirmationFeedback}>
                        <div className={styles.feedbackText}>{affirmation.feedback}</div>
                        {affirmation.quality === 'best' && (
                          <div className={styles.torchLit}>🔥 TORCH LIT! +50 points</div>
                        )}
                        {affirmation.quality !== 'best' && (
                          <div className={styles.torchNotLit}>Try again! +10 points</div>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {showFeedback && selectedAffirmation !== null && (
                <div className={styles.wisdomQuote}>
                  <strong>Lead India 2020 Wisdom:</strong>
                  <p>{torches[currentTorchIndex].scenario.bookQuote}</p>
                </div>
              )}
            </div>
          )}

          {gamePhase === 'why' && (
            <div className={styles.whySection}>
              <h3>🧠 WHY Understanding - Final Challenge</h3>
              <p>Light the final flames of wisdom by understanding the power of affirmations:</p>
              <div className={styles.whyCards}>
                {WHY_CARDS.map((card, index) => (
                  <div
                    key={index}
                    className={`${styles.whyCard} ${whyAnswered[index] ? styles.answered : ''}`}
                    onClick={() => handleWHYAnswer(index)}
                  >
                    <div className={styles.whyQuestion}>{card.question}</div>
                    {whyAnswered[index] && (
                      <div className={styles.whyAnswer}>
                        <strong>Answer:</strong> {card.answer}
                        <div className={styles.whyPoints}>+{card.points} points!</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.completionMessage}>
                <p>Answer all questions to complete your confidence transformation!</p>
              </div>
            </div>
          )}
        </div>
      </ModernGameLayout>
    </>
  );
}

export function Head() {
  return (
    <>
      <title>Confidence Cavern - Torch Challenge | BadhoHero</title>
      <meta
        name="description"
        content="Light torches of confidence by choosing empowering affirmations for real-life challenges. Transform self-doubt into unshakeable strength!"
      />
      <link rel="canonical" href="https://badhohero.vercel.app/games/confidence" />
    </>
  );
}

export const getStaticProps = async () => ({ props: {} });
