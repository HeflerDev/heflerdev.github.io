/** Tiny Web Audio SFX for the hero breakout easter egg (no asset files). */

let sharedCtx: AudioContext | null = null

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!AC) return null
  if (!sharedCtx) sharedCtx = new AC()
  if (sharedCtx.state === 'suspended') void sharedCtx.resume()
  return sharedCtx
}

function tone(
  frequency: number,
  duration: number,
  options: {
    type?: OscillatorType
    gain?: number
    slideTo?: number
    delay?: number
  } = {},
) {
  const audio = ctx()
  if (!audio) return
  const { type = 'square', gain = 0.05, slideTo, delay = 0 } = options
  const t0 = audio.currentTime + delay
  const osc = audio.createOscillator()
  const g = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, t0)
  if (slideTo != null) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, slideTo),
      t0 + duration,
    )
  }
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(g)
  g.connect(audio.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export const breakoutSfx = {
  /** Unlock / warm AudioContext on user gesture */
  unlock() {
    ctx()
  },
  start() {
    tone(220, 0.09, { type: 'triangle', gain: 0.045 })
    tone(330, 0.1, { type: 'triangle', gain: 0.05, delay: 0.07 })
    tone(440, 0.14, { type: 'square', gain: 0.04, delay: 0.14 })
    tone(660, 0.18, { type: 'square', gain: 0.035, delay: 0.22 })
  },
  hit() {
    tone(620, 0.06, { type: 'square', gain: 0.055 })
    tone(880, 0.08, { type: 'triangle', gain: 0.04, delay: 0.03 })
  },
  miss() {
    tone(180, 0.18, { type: 'sawtooth', gain: 0.04, slideTo: 70 })
    tone(90, 0.22, { type: 'triangle', gain: 0.035, delay: 0.04, slideTo: 40 })
  },
  close() {
    tone(400, 0.08, { type: 'triangle', gain: 0.03, slideTo: 180 })
    tone(200, 0.16, { type: 'square', gain: 0.025, delay: 0.08, slideTo: 80 })
  },
}
