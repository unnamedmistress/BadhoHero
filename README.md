# BadhoHero - Defeat Laziness Through Action Games

BadhoHero is a gamified platform designed to help you overcome laziness, build momentum, and develop discipline through engaging action games. Built with **React**, **TypeScript**, **Next.js**, and **Vite**, the platform transforms personal development into an exciting adventure.

## 🦊 About BadhoHero

BadhoHero is aligned with Lead India's principles and focuses on practical action-taking to defeat procrastination and build lasting habits. Each game teaches valuable lessons about:

- **Building Momentum**: Start with small actions that lead to bigger changes
- **Overcoming Procrastination**: Learn practical strategies to defeat laziness  
- **Developing Discipline**: Build habits that support your personal growth
- **Taking Action**: Move from planning to doing with confidence

## 🎮 Games Available

### 1. Fogland Awakening
Interactive introduction to breaking free from mental fog and confusion. Players reveal fog tiles and answer questions about overcoming laziness while collecting WHY cards.

### 2. Willpower Warrior  
Morning routine challenges where players choose between healthy and lazy options. Features sneaky traps, scoring system, and feedback on building strong morning habits.

### 3. Goal-Orb Discovery
Strategic goal-setting game using SMART objectives. Players navigate through goal orbs while learning effective goal-setting techniques and avoiding common pitfalls.

### 4. Time Tunnel Trials
Time management and prioritization challenges. Players answer questions under time pressure to build urgency and learn effective time management strategies.

### 5. Confidence Cavern
Self-confidence building through positive action choices. Players make decisions that either build or diminish confidence while learning about self-belief.

### 6. Tree of Triumph
Final victory celebration and reflection game. Players plant their achievement tree and reflect on their growth journey through the BadhoHero platform.

## 🚀 Age-Adaptive Features
- Players can enter their age and name for personalized experiences
- Games adapt difficulty and tips based on age groups
- Younger players get more visual feedback, older players get more strategic content
- Points and progress sync across devices through local storage
- Badge system tracks achievements and milestones
- Community features for sharing progress and motivation

## 🛠️ Getting Started

### NextJS App (Main Platform)
1. Install dependencies and start the dev server:
   ```bash
   cd nextjs-app
   npm install
   npm run dev
   ```

### Legacy Vite App (Optional)
1. Install dependencies and start the dev server:
   ```bash
   cd learning-games
   npm install  
   npm run dev
   ```

### API Server (Optional for Community Features)
2. In a separate terminal start the API server:
   ```bash
   cd server
   npm install
   npm start
   ```

3. Open the printed URL in your browser.

Node **18+** is recommended. Major dependencies include React 19, Next.js 14, React Router 7, Vite 6 and TypeScript.## 🎯 Development Features

- **Point System**: Earn points for correct answers and good choices
- **Badge Collection**: Unlock achievements for reaching milestones  
- **Community Integration**: Share progress and connect with other heroes
- **Progress Tracking**: Local storage maintains progress across sessions
- **Mobile Responsive**: Play anywhere, anytime on any device
- **WHY Cards**: Learn the reasoning behind each lesson from Lead India
- **Modern UI**: Clean, engaging interface with smooth animations
- **Gamification**: Progressive difficulty and reward systems

## 💻 Development Tips
- `npm run lint` checks code style with ESLint
- `npm run test` runs the Vitest unit tests (Vite app)
- `npm run build` creates a production build
- `npm run dev` starts the development server

### Running Tests (Vite App)

Before executing the test suite make sure dependencies are installed:

```bash
cd learning-games
npm install
npm test
```

## 🔧 Environment Variables

### NextJS App Configuration
Create `.env.local` in `nextjs-app/`:

```bash
# Optional: For community features and API integration
NEXT_PUBLIC_API_BASE=http://localhost:3001

# Optional: For AI-powered features (if using legacy components)
NEXT_PUBLIC_OPENAI_API_KEY=your-key

# Optional: Firebase Analytics
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Vite App Configuration (Legacy)
Create `.env` in `learning-games/`:

```bash
VITE_API_BASE=http://localhost:3001
VITE_OPENAI_API_KEY=your-key
```

### Server Configuration (Optional)
Create `.env` in `server/`:

```bash
OPENAI_API_KEY=your-key
FIREBASE_SERVICE_ACCOUNT=path-to-service-account.json
# OR
GOOGLE_APPLICATION_CREDENTIALS=path-to-credentials.json
```

## 🌟 Key Features

- **Lead India Integration**: All content aligned with Lead India's anti-laziness principles
- **Progressive Journey**: Games build on each other for complete transformation
- **Community Support**: Share progress and get motivated by other heroes
- **Mobile-First Design**: Optimized for smartphones and tablets
- **Offline Capable**: Core games work without internet connection
- **Achievement System**: Badges and points system motivates continued engagement
- **Age-Appropriate Content**: Adapts messaging and difficulty for different age groups

## 📁 Project Structure

```
BadhoHero/
├── nextjs-app/          # Main Next.js platform
│   ├── src/pages/       # Game pages and routes  
│   ├── src/components/  # Reusable UI components
│   ├── src/styles/      # CSS modules for styling
│   └── public/          # Static assets and images
├── learning-games/      # Legacy Vite app (optional)
├── server/              # API server for community features
├── docs/                # Documentation and guides
└── shared/              # Shared utilities and types
```

## 📚 Documentation
Detailed component props and usage can be found in:
- [`docs/Component_Reference.md`](docs/Component_Reference.md) - UI component documentation
- [`docs/UX-Changes.md`](docs/UX-Changes.md) - User experience improvements
- [`docs/ImageIntegrationPlan.md`](docs/ImageIntegrationPlan.md) - Visual asset strategy
- [`COMMUNITY_LEADERBOARD_IMPLEMENTATION.md`](COMMUNITY_LEADERBOARD_IMPLEMENTATION.md) - Community features

## 🚀 Deployment

### Vercel (Recommended)
The NextJS app is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set the root directory to `nextjs-app` 
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment
```bash
cd nextjs-app
npm run build
npm run export  # for static hosting
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Areas for Contribution:
- New game mechanics and challenges
- UI/UX improvements and animations
- Performance optimizations
- Accessibility enhancements
- Mobile experience improvements
- Additional Lead India content integration

## 🎯 Roadmap

- [ ] Advanced analytics and progress tracking
- [ ] Social features and team challenges  
- [ ] Additional games and content
- [ ] Mobile app development
- [ ] Integration with Lead India's main platform
- [ ] Advanced gamification features
- [ ] Offline-first architecture improvements

## 📜 License
This project is released under the [MIT License](LICENSE). Contributions are welcome under the same terms.

---

**Start your journey to defeat laziness today! 🦊⚡**

*BadhoHero - Where Heroes Rise and Laziness Dies*
