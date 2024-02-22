/**
 * Enum representing different types of swipe effects.
 */
export enum SwipingType {
  Appear,
  Jump,
  Slide,
  Flip,
  Rotate,
  Erase,
}

/**
 * Configuration for a single swipe effect.
 */
interface SwipeConfig {
  shadow?: boolean;
  translate?: [string | number, string | number, string | number];
  rotate?: [number, number, number];
  origin?: string;
}

/**
 * Configuration for the previous and next elements in a swipe effect.
 */
interface SwiperEffectConfig {
  prev: SwipeConfig;
  next: SwipeConfig;
}

/**
 * Generates configurations for different swipe effects based on the specified type.
 * @param {SwipingType} type - The type of swipe effect.
 * @returns {SwiperEffectConfig} Configurations for the previous and next elements in the swipe effect.
 */
export function SwiperEffect(type: SwipingType = SwipingType.Appear): SwiperEffectConfig {
  const defaultConfig: SwipeConfig = { translate: [0, 0, -400] };

  switch (type) {
    case SwipingType.Appear:
      return {
        prev: { ...defaultConfig, shadow: true },
        next: { translate: ['100%', 0, 0] },
      };
    case SwipingType.Jump:
      return {
        prev: { ...defaultConfig, shadow: true, translate: ['-120%', 0, -500] },
        next: { shadow: true, translate: ['120%', 0, -500] },
      };
    case SwipingType.Slide:
      return {
        prev: { ...defaultConfig, shadow: true, translate: ['-20%', 0, -1] },
        next: { translate: ['100%', 0, 0] },
      };
    case SwipingType.Flip:
      return {
        prev: { ...defaultConfig, shadow: true, rotate: [180, 0, 0] },
        next: { shadow: true, rotate: [-180, 0, 0] },
      };
    case SwipingType.Rotate:
      return {
        prev: { translate: ['-125%', 0, -800], rotate: [0, 0, -90] },
        next: { translate: ['125%', 0, -800], rotate: [0, 0, 90] },
      };
    case SwipingType.Erase:
      return {
        prev: { ...defaultConfig, shadow: true, origin: 'left center', rotate: [0, 100, 0] },
        next: { origin: 'right center', translate: ['5%', 0, -200], rotate: [0, -100, 0] },
      };
    default:
      return { prev: { ...defaultConfig, shadow: true }, next: { translate: ['100%', 0, 0] } };
  }
}
