# Component Reference

This document summarizes the main React components in the `learning-games` application and how to integrate them after the recent theme update and game module refactor.

## Core Game Modules

- **GameOrchestrator** – sequences the mini games. It reads the `ageGroup` from `UserContext`, renders each game component and advances when a game calls `onComplete`.
- **WillpowerWarrior** (`ageGroup: string`, `onComplete: () => void`) – fetches the `willpowerWarrior` challenge and awards points when the player finishes.
- **GoalOrbQuest** (`ageGroup: string`, `onComplete: () => void`) – similar flow for the goal setting challenge.
- **TimeTunnelTracker** (`ageGroup: string`, `onComplete: () => void`) – time management mini game.
- **ConfidenceCavern** (`ageGroup: string`, `onComplete: () => void`) – confidence building challenge.
- **TreeOfTriumph** (`ageGroup: string`, `onComplete: () => void`) – success tracking challenge.
- **PointsTracker** – singleton object with `addPoints(p: number)` and `getPoints()` methods.
- **BadgesStore** – singleton with `earn(badge)` and `getBadges()`.

## Layout Components

- **NavBar** – main responsive navigation with expandable menus.
- **NavBarSimple** – condensed navigation used on small pages.
- **Footer** – footer links and brand imagery.
- **ProgressSidebar** (`points?: Record<string, number>`, `badges?: string[]`) – shows totals, leaderboard snippets and confetti when goals are met.
- **GamePageLayout** (`imageSrc`, `imageAlt`, `infoCardContent`, `instructions`, `onCTAClick`, `ctaText`, `children`) – two‑column layout for game pages.
- **ThemeToggle** – toggles the high contrast theme and stores the preference in `localStorage`.
- **SkipLink** – accessibility link allowing users to jump to `#main-content`.
- **WhyCard** (`title`, `explanation`, `quote?`, `tip?`, `className?`, `children?`) – sidebar callout used on informational pages.

## Shared and Utility Components

- **AnalyticsTracker** – posts page view data to the server in React Router apps.
- **AnalyticsTrackerNext** – Next.js version of the analytics tracker.
- **CommunityPage** – simple forum page allowing visitors to post short messages.
- **CourseOverview** – lists courses from `data/courses` with progress bars.
- **Post** (`post: PostData`, `onFlag: (id: number) => void`) – displays a community post and allows flagging.
- **ProgressSummary** (`totalPoints?`, `badges?`, `goalPoints`) – fetches progress or uses provided values to show totals and a `ProgressRing`.
- **RobotChat** – floating chat icon that opens a modal for AI practice questions.
- **ScrollToTop** – scrolls the window to the top on route changes.

### Icon Components

`WillpowerBadge`, `GoalOrb`, `TimeClock`, `ConfidenceTorch`, and `TriumphTree` render SVG icons used by the games.

### UI Components

- **CompletionModal** (`imageSrc`, `buttonHref`, `buttonLabel`, `children?`) – modal shown at the end of activities.
- **InfoButton** (`message`) – animated info icon that shows a `Tooltip`.
- **InstructionBanner** (`children`) – dismissible banner for quick instructions.
- **IntroOverlay** (`onClose`) – overlay explaining rules before starting a game.
- **NotificationModal** (`message`, `isOpen`, `onClose`, `autoClose?`, `autoCloseDelay?`) – accessible temporary notification dialog.
- **ProgressBar** (`percent: number`) – simple horizontal progress indicator.
- **ProgressRing** (`progress: number`, `size?`) – circular progress indicator used in dashboards.
- **TimerBar** (`timeLeft`, `TOTAL_TIME`) – countdown bar that turns red when time is short.
- **Tooltip** (`message`, `children`) – wrapper that displays text on hover or focus.
- **Card** (`children`, `className?`, `onClick?`, `style?`) – basic styled container used across lists and forms.

## Integration Guide

The project now uses a small theme system powered by `styled-components`. Install the package in both `learning-games` and `nextjs-app`:

```bash
cd learning-games && npm install styled-components
cd ../nextjs-app && npm install styled-components
```

Wrap your application in a `<ThemeProvider>` and use the new `ThemeToggle` component to switch the high‑contrast mode. Game logic has been refactored so each mini game exports a component accepting `ageGroup` and `onComplete`. Import them into `GameOrchestrator` (or your own flow manager) to sequence the challenges.

For further details on individual components consult this document in the `docs/` folder.
