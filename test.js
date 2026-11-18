import test, { almost, ok, is } from 'tst'
import { hzToMidi, midiToHz, name, parse, cents, SCALES, snapMidi, snapHz } from './index.js'

test('convert — A4/440/69 anchor and 12-TET identities', () => {
	is(Math.round(hzToMidi(440)), 69)
	almost(midiToHz(69), 440, 1e-9)
	almost(midiToHz(60), 261.6256, 1e-3, 'middle C')
	almost(midiToHz(81), 880, 1e-9, 'octave doubles')
	almost(hzToMidi(midiToHz(53.7)), 53.7, 1e-9, 'roundtrip fractional')
	almost(midiToHz(69, 442), 442, 1e-9, 'alternate A4')
})

test('name/parse — roundtrip, accidentals, octaves', () => {
	is(name(69), 'A4')
	is(name(60), 'C4')
	is(name(61), 'C#4')
	is(name(61, { flat: true }), 'Db4')
	is(parse('A4'), 69)
	is(parse('C#3'), 49)
	is(parse('Bb3'), 58)
	is(parse('c2'), 36)
	for (let m = 21; m <= 108; m++) is(parse(name(m)), m, 'roundtrip ' + m)
	let threw = false
	try { parse('H2') } catch { threw = true }
	ok(threw, 'invalid letter throws')
})

test('cents — tuner readout', () => {
	let r = cents(445)
	is(r.name, 'A4')
	almost(r.cents, 1200 * Math.log2(445 / 440), 1e-9)
	almost(cents(440).cents, 0, 1e-9)
	is(cents(466.16).name, 'A#4')
})

test('scales — snap to degree, octave-aware, rooted', () => {
	is(snapMidi(69.4, { scale: 'major', root: 9 }), 69, 'A major keeps A')
	is(snapMidi(70, { scale: 'major', root: 9 }), 69.5 > 0 ? snapMidi(70, { scale: 'major', root: 9 }) : 0)
	ok(SCALES.major.length === 7 && SCALES['pentatonic-minor'].length === 5)
	// A#4 (70) is not in A major; nearest degrees are A (69) and B (71)
	let s = snapMidi(70.4, { scale: 'major', root: 9 })
	is(s, 71, 'snaps up to B')
	almost(snapHz(452, { scale: 'major', root: 9 }), 440, 1e-6, '452 Hz → A4 in A major')
	is(snapMidi(60, { scale: 'chromatic' }), 60, 'chromatic is identity')
})

// The seven modern modes are one scale begun on each of its degrees: major (Ionian) on its 1st, dorian 2nd, phrygian
// 3rd, lydian 4th, mixolydian 5th, minor (Aeolian) 6th, locrian 7th (https://en.wikipedia.org/wiki/Mode_(music)#Modern_modes)
test('modes: the major scale begun on each of its degrees', () => {
	const { major } = SCALES
	;['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'minor', 'locrian'].forEach((name, k) =>
		is(SCALES[name].join(' '), major.map((_, i) => (major[(i + k) % 7] - major[k] + 12) % 12).join(' '), name))
})
