import { render, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import NeumorphicButton from '../ui/NeumorphicButton'

describe('NeumorphicButton', () => {
  afterEach(() => {
    cleanup()
  })
  it('applies variant class', () => {
    const { getByTestId } = render(
      <NeumorphicButton variant="inset">Hi</NeumorphicButton>
    )
    expect(getByTestId('neumorphic-button').className).toContain('inset')
  })

  it('handles click when enabled', () => {
    const handleClick = vi.fn()
    const { getByTestId } = render(
      <NeumorphicButton onClick={handleClick}>Click</NeumorphicButton>
    )
    fireEvent.click(getByTestId('neumorphic-button'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('does not fire click when disabled', () => {
    const handleClick = vi.fn()
    const { getByTestId } = render(
      <NeumorphicButton disabled onClick={handleClick}>Click</NeumorphicButton>
    )
    const button = getByTestId('neumorphic-button') as HTMLButtonElement
    expect(button.disabled).toBe(true)
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
})
