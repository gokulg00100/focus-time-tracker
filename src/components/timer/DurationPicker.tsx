import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { formatSeconds } from '../../utils/time'
import { parseDurationToSecs } from '../../utils/time'
import { clsx } from 'clsx'

const PRESETS = [
  { label: '25 min', secs: 25 * 60 },
  { label: '30 min', secs: 30 * 60 },
  { label: '45 min', secs: 45 * 60 },
  { label: '1 hour', secs: 60 * 60 },
  { label: '1.5h', secs: 90 * 60 },
  { label: '2 hours', secs: 120 * 60 },
  { label: '3 hours', secs: 180 * 60 },
  { label: '5 hours', secs: 300 * 60 },
  { label: '24 hours', secs: 24 * 3600 },
]

interface DurationPickerProps {
  value: number // seconds
  onChange: (secs: number) => void
  disabled?: boolean
}

export function DurationPicker({ value, onChange, disabled }: DurationPickerProps) {
  const [customInput, setCustomInput] = useState('')
  const [customError, setCustomError] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const handleCustomSubmit = () => {
    const secs = parseDurationToSecs(customInput)
    if (!secs || secs <= 0) {
      setCustomError('Enter a valid duration (e.g. 90, 1.5h, 45m, 1:30:00)')
      return
    }
    if (secs > 86400) {
      setCustomError('Maximum duration is 24 hours')
      return
    }
    setCustomError('')
    onChange(secs)
    setShowCustom(false)
    setCustomInput('')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {PRESETS.map((p) => (
          <button
            key={p.secs}
            disabled={disabled}
            onClick={() => onChange(p.secs)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
              value === p.secs
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {p.label}
          </button>
        ))}
        <button
          disabled={disabled}
          onClick={() => setShowCustom((v) => !v)}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
            showCustom
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary-100 dark:hover:bg-primary-900/30',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          Custom
        </button>
      </div>

      {showCustom && (
        <div className="flex gap-2 items-start">
          <Input
            value={customInput}
            onChange={(e) => { setCustomInput(e.target.value); setCustomError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
            placeholder="e.g. 90m, 1.5h, 1:30:00"
            error={customError}
            hint="Format: 90m, 2h, 1.5h, or 1:30:00"
            className="flex-1"
          />
          <Button onClick={handleCustomSubmit} size="md" className="mt-0.5">
            Set
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Selected: <span className="font-semibold text-primary-600 dark:text-primary-400">{formatSeconds(value)}</span>
      </p>
    </div>
  )
}
