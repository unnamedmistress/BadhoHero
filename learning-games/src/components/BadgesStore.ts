export type Badge = 'willpower' | 'goal' | 'timekeeper' | 'confidence' | 'triumph'

class BadgesStore {
  private badges = new Set<Badge>()

  earn(badge: Badge) {
    this.badges.add(badge)
  }

  getBadges(): Badge[] {
    return Array.from(this.badges)
  }
}

export default new BadgesStore()
