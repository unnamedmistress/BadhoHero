import { render, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import GlassCard from '../ui/GlassCard'

describe('GlassCard', () => {
  afterEach(() => {
    cleanup()
  })
  it('applies blur style and variant class', () => {
    const { getByTestId } = render(
      <GlassCard blur={5} variant="dark">Content</GlassCard>
    )
    const card = getByTestId('glass-card')
    expect(card.style.backdropFilter).toBe('blur(5px)')
    expect(card.className).toContain('dark')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    const { getByTestId } = render(
      <GlassCard onClick={handleClick}>Click</GlassCard>
    )
    fireEvent.click(getByTestId('glass-card'))
    expect(handleClick).toHaveBeenCalled()
  })
})
