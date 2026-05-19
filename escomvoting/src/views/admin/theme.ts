// Oceanic design tokens for admin chrome (per DESIGN.md v2.0)
export const NAVY = '#050C9C'
export const NAVY_DEEP = '#040A7A'
export const BLUE = '#3572EF'
export const CYAN = '#3ABEF9'
export const ICE = '#A7E6FF'
export const WHITE = '#ffffff'
export const BODY = '#3a4a6b'
export const MUTE = '#6b7a99'

export const HAIRLINE_CYAN = 'rgba(58,190,249,0.27)'
export const HAIRLINE_ICE = 'rgba(167,230,255,0.33)'
export const CYAN_SOFT = 'rgba(58,190,249,0.13)'
export const ICE_SOFT = 'rgba(167,230,255,0.33)'
export const NAVY_SOFT = 'rgba(5,12,156,0.10)'
export const BLUE_SOFT = 'rgba(53,114,239,0.13)'

export const ERROR_BG = '#fee'
export const ERROR_FG = '#c00'
export const SUCCESS_BG = 'rgba(58,190,249,0.13)'
export const SUCCESS_FG = '#050C9C'

export const FEATURE_CARD_BG =
  'linear-gradient(135deg, rgba(167,230,255,0.13) 0%, rgba(58,190,249,0.07) 100%)'
export const STEP_BUBBLE_BG = 'linear-gradient(135deg, #050C9C 0%, #3572EF 100%)'

// Status pill mapping
export const STATUS_PILL: Record<
  string,
  { bg: string; dot: string; color: string }
> = {
  DRAFT:   { bg: 'rgba(107,122,153,0.13)', dot: MUTE, color: NAVY },
  OPEN:    { bg: CYAN_SOFT,                dot: CYAN, color: NAVY },
  CLOSED:  { bg: ICE_SOFT,                 dot: CYAN, color: NAVY },
  TALLIED: { bg: BLUE_SOFT,                dot: BLUE, color: NAVY },
}

export const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Borrador',
  OPEN: 'En curso',
  CLOSED: 'Cerrada',
  TALLIED: 'Resultados',
}

export const ROLE_PILL: Record<string, { bg: string; dot: string }> = {
  STUDENT:   { bg: BLUE_SOFT, dot: BLUE },
  PROFESSOR: { bg: CYAN_SOFT, dot: CYAN },
  PAAE:      { bg: ICE_SOFT,  dot: NAVY },
}

export const ROLE_LABEL: Record<string, string> = {
  STUDENT: 'Estudiante',
  PROFESSOR: 'Profesor',
  PAAE: 'PAAE',
}
