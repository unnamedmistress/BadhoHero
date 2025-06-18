export type AgeGroup = 'child' | 'teen' | 'adult' | 'senior'

export function getAgeGroup(age: number | null): AgeGroup {
  if (!age) return 'adult'
  if (age < 13) return 'child'
  if (age < 18) return 'teen'
  if (age < 65) return 'adult'
  return 'senior'
}
