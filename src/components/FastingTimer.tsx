import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'
import './FastingTimer.css'

interface FastingTimerProps {
  targetHours?: number
}

export default function FastingTimer({ targetHours = 16 }: FastingTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const targetSeconds = targetHours * 60 * 60

  useEffect(() => {
    let interval: number | undefined

    if (isRunning && startTime) {
      interval = window.setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - startTime) / 1000)
        setElapsedSeconds(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, startTime])

  const handleStart = useCallback(() => {
    setStartTime(Date.now())
    setIsRunning(true)
    setElapsedSeconds(0)
  }, [])

  const handlePause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleResume = useCallback(() => {
    if (startTime) {
      const pausedDuration = elapsedSeconds * 1000
      setStartTime(Date.now() - pausedDuration)
      setIsRunning(true)
    }
  }, [startTime, elapsedSeconds])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setStartTime(null)
    setElapsedSeconds(0)
  }, [])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100)
  const isCompleted = elapsedSeconds >= targetSeconds

  return (
    <div className={`fasting-timer ${isCompleted ? 'completed' : ''}`}>
      <div className="timer-header">
        <Clock size={20} />
        <span>Fasting Timer</span>
        <span className="timer-target">{targetHours}:00 goal</span>
      </div>

      <div className="timer-display">
        <div className="timer-ring">
          <svg viewBox="0 0 100 100">
            <circle
              className="timer-ring-bg"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
            />
            <circle
              className="timer-ring-progress"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeDasharray={`${progress * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="timer-value">
            <span className="timer-time">{formatTime(elapsedSeconds)}</span>
            <span className="timer-label">
              {isCompleted ? 'Goal reached!' : isRunning ? 'Fasting' : startTime ? 'Paused' : 'Ready to start'}
            </span>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {!startTime ? (
          <button className="timer-btn primary" onClick={handleStart}>
            <Play size={20} />
            <span>Start Fast</span>
          </button>
        ) : (
          <>
            {isRunning ? (
              <button className="timer-btn secondary" onClick={handlePause}>
                <Pause size={18} />
                <span>Pause</span>
              </button>
            ) : (
              <button className="timer-btn primary" onClick={handleResume}>
                <Play size={18} />
                <span>Resume</span>
              </button>
            )}
            <button className="timer-btn outline" onClick={handleReset}>
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
