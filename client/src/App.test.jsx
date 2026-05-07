import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders starter content and increments counter', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Get started' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore Vite' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument()

    const counterButton = screen.getByRole('button', { name: /count is/i })
    expect(counterButton).toHaveTextContent('Count is 0')

    fireEvent.click(counterButton)
    expect(counterButton).toHaveTextContent('Count is 1')
  })
})
