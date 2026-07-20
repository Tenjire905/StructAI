/**
 * Point this at the bundled .riv once the file exists.
 *
 * 1. Export from Rive Editor as `structai-orb.riv`
 * 2. Place it next to this file: `assets/rive/structai-orb.riv`
 * 3. Uncomment the require below
 * 4. Rebuild the native dev client (Rive is not in Expo Go)
 */
// export const structAiOrbRiv = require('./structai-orb.riv') as number;
export const structAiOrbRiv: number | null = null;

export function isOrbRiveAssetConfigured(): boolean {
  return typeof structAiOrbRiv === 'number';
}
