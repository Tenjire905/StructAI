// [Architect]: SF UI Design System — SwiftUI-Look für React
// Wird automatisch von allen Orchestrator-generierten Apps genutzt

import React from 'react'

const SF = {
  blue:   '#007AFF',
  green:  '#34C759',
  red:    '#FF3B30',
  gray6:  '#F2F2F7',
  sep:    'rgba(60,60,67,0.12)',
  font:   '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif',
  ease:   'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}

export const SFView = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
  <div style={{ fontFamily: SF.font, background: SF.gray6, minHeight: '100vh', ...style }}>
    {children}
  </div>
)

export const SFLargeTitle = ({ children }: { children: React.ReactNode }) => (
  <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.4, padding: '16px 16px 4px', margin: 0, fontFamily: SF.font }}>
    {children}
  </h1>
)

export const SFCard = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
  <div style={{
    background: '#fff', borderRadius: 12, margin: '0 16px 12px',
    border: `0.5px solid ${SF.sep}`, overflow: 'hidden', ...style
  }}>
    {children}
  </div>
)

export const SFButton = ({ children, onPress, variant = 'primary' }: {
  children: React.ReactNode
  onPress?: () => void
  variant?: 'primary' | 'secondary' | 'destructive'
}) => {
  const colors = { primary: SF.blue, secondary: SF.gray6, destructive: SF.red }
  const textColors = { primary: '#fff', secondary: SF.blue, destructive: '#fff' }
  return (
    <button
      onClick={onPress}
      style={{
        background: colors[variant], color: textColors[variant],
        border: 'none', borderRadius: 10, height: 50, padding: '0 24px',
        fontSize: 17, fontWeight: 600, fontFamily: SF.font,
        cursor: 'pointer', transition: `all 0.2s ${SF.ease}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {children}
    </button>
  )
}

export const SFInput = ({ placeholder, value, onChange }: {
  placeholder?: string, value?: string, onChange?: (v: string) => void
}) => (
  <input
    placeholder={placeholder}
    value={value}
    onChange={e => onChange?.(e.target.value)}
    style={{
      height: 44, background: SF.gray6, border: 'none',
      borderRadius: 10, padding: '0 16px', fontSize: 17,
      fontFamily: SF.font, width: '100%', boxSizing: 'border-box',
      outline: 'none',
    }}
  />
)

export const SFListRow = ({ label, value, chevron }: {
  label: string, value?: string, chevron?: boolean
}) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px', height: 44, background: '#fff',
    borderBottom: `0.5px solid ${SF.sep}`,
  }}>
    <span style={{ fontSize: 17, fontFamily: SF.font }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {value && <span style={{ fontSize: 17, color: SF.gray6.replace('F2F2F7', '8E8E93'), fontFamily: SF.font }}>{value}</span>}
      {chevron && <span style={{ color: 'rgba(60,60,67,0.3)', fontSize: 17 }}>›</span>}
    </div>
  </div>
)

export { SF }
