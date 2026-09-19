import HouseScene from './HouseScene'
import ApartmentScene from './ApartmentScene'
import LandScene from './LandScene'

export { default as HeroScene } from './HeroScene'
export { HouseScene, ApartmentScene, LandScene }

/** Ilustração por categoria — usada nos banners da Home e nos cards das páginas internas. */
export const SCENE_BY_KIND = {
  house: HouseScene,
  apartment: ApartmentScene,
  land: LandScene,
}
