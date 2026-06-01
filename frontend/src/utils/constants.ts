// Colores disponibles para el selector de auto (con su swatch).
export const CAR_COLORS: { name: string; hex: string }[] = [
  { name: 'Rojo', hex: '#ef4444' },
  { name: 'Azul', hex: '#3b82f6' },
  { name: 'Negro', hex: '#1f2937' },
  { name: 'Blanco', hex: '#f3f4f6' },
  { name: 'Gris', hex: '#9ca3af' },
  { name: 'Plata', hex: '#cbd5e1' },
  { name: 'Verde', hex: '#22c55e' },
  { name: 'Amarillo', hex: '#eab308' },
]

export const CAR_BRANDS = [
  'Toyota',
  'Honda',
  'Mazda',
  'Chevrolet',
  'Nissan',
  'Volkswagen',
  'Ford',
  'Hyundai',
  'Kia',
  'Otra',
]

export function colorHex(name: string): string {
  return CAR_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase())?.hex ?? '#9ca3af'
}

// Imagen por defecto cuando el auto no tiene foto cargada.
export const DEFAULT_CAR_IMAGE =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=160&q=60'
