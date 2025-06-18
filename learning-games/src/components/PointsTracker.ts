class PointsTracker {
  private points = 0

  addPoints(p: number) {
    this.points += p
  }

  getPoints() {
    return this.points
  }
}

export default new PointsTracker()
