export const CANVAS_CONFIG = {
  SIZE: 410,
  MIN_DURATION: 5,
  MAX_DURATION: 30,
  MAX_TEXT_LENGTH: 10,
  DEFAULT_DURATION: 16,
} as const;

export const WHEEL_STYLES = {
  strokeStyle: '#333',
  lineWidth: 2,
} as const;

export const CENTER_ELEMENT_STYLES = {
  fillStyle: '#98d399',
  strokeStyle: '#fff',
  lineWidth: 3,
  radius: 30,
} as const;

export const CURSOR_STYLES = {
  fillStyle: '#000',
  strokeStyle: '#000',
  lineWidth: 2,
  tipOffset: 25,
  baseOffset: 10,
  width: 15,
} as const;

export const TEXT_STYLES = {
  fillStyle: 'white',
  font: '16px Arial',
  textAlign: 'center' as const,
  textBaseline: 'middle' as const,
  strokeStyle: 'black',
  lineWidth: 2,
} as const;

export const STORAGE_KEYS = {
  SOUND_STATE: 'soundState',
} as const;

export const ASSETS = {
  FINISH_SOUND: '/finish-sound.mp3',
} as const;
