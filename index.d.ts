export const NAMES_SHARP: string[]
export const NAMES_FLAT: string[]
export function hzToMidi(hz: number, a4?: number): number
export function midiToHz(midi: number, a4?: number): number
export function name(midi: number, options?: { flat?: boolean }): string
/** Parse a note name such as A4 or Bb2; throws RangeError for invalid names. */
export function parse(note: string): number
export function cents(hz: number, options?: { a4?: number; flat?: boolean }): {
  midi: number; name: string; hz: number; cents: number
}
export type ScaleName = 'chromatic' | 'major' | 'minor' | 'harmonic-minor' | 'melodic-minor'
  | 'pentatonic-major' | 'pentatonic-minor' | 'blues' | 'dorian' | 'mixolydian' | 'whole'
export const SCALES: Record<ScaleName, number[]>
export interface SnapOptions { scale?: ScaleName | readonly number[]; root?: number }
export function snapMidi(midi: number, options?: SnapOptions): number
export function snapHz(hz: number, options?: SnapOptions & { a4?: number }): number
