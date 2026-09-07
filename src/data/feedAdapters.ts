import type {Aircraft,GeoJSONPolygonFeature,Weather} from './types'

/**
 * Real-source adapter boundary for the portfolio demo.
 * These functions deliberately normalize external-style payloads into the
 * internal UI contracts used by Fireline COP. Replacing mock sources later
 * does not require a component/page redesign.
 */

export type AdsbLikeRecord={
  hex:string
  flight:string
  lat:number
  lon:number
  alt_baro:number
  gs:number
  track:number
  fuel_pct?:number
}

export type WeatherApiLikeRecord={
  temperature_c:number
  wind_speed_kt:number
  gust_kt:number
  wind_direction:string
  humidity_pct:number
  visibility_km:number
  observed_at:string
}

export const adapterCatalog=[
  {feed:'Aircraft Position Feed',mock:'Mock ADS-B JSON',future:'ADS-B Exchange / approved aircraft feed',contract:'AdsbLikeRecord → Aircraft'},
  {feed:'Weather / Wind Feed',mock:'Mock weather JSON',future:'NOAA / BOM / approved weather API',contract:'WeatherApiLikeRecord → Weather'},
  {feed:'Fire Perimeter Feed',mock:'Mock GeoJSON Feature',future:'Satellite / agency GeoJSON perimeter feed',contract:'GeoJSON Polygon Feature → GeoJSONPolygonFeature'},
  {feed:'Ground Resource Feed',mock:'Mock resource JSON',future:'Agency resource-status service',contract:'Normalized resource record → GroundResource'}
] as const

const projectCoordinate=(value:number,min:number,max:number)=>Math.max(3,Math.min(97,((value-min)/(max-min))*94+3))

export function normalizeAdsbRecord(record:AdsbLikeRecord,incidentId:string|null):Pick<Aircraft,'id'|'callsign'|'incidentId'|'x'|'y'|'altitude'|'speed'|'heading'|'fuel'> {
  return {
    id:`ADS-${record.hex}`,
    callsign:record.flight.trim()||record.hex,
    incidentId,
    x:projectCoordinate(record.lon,-125,-114),
    y:100-projectCoordinate(record.lat,31,43),
    altitude:record.alt_baro,
    speed:record.gs,
    heading:record.track,
    fuel:record.fuel_pct??70
  }
}

export function normalizeWeatherRecord(record:WeatherApiLikeRecord):Weather{
  const highRisk=record.wind_speed_kt>=20||record.humidity_pct<=20
  const elevated=record.wind_speed_kt>=12||record.humidity_pct<=30
  return {
    temperature:record.temperature_c,
    windSpeed:record.wind_speed_kt,
    gusts:record.gust_kt,
    windDirection:record.wind_direction,
    humidity:record.humidity_pct,
    visibility:record.visibility_km,
    risk:highRisk?'High':elevated?'Elevated':'Low',
    lastUpdated:record.observed_at
  }
}

export function normalizePerimeterGeoJSON(input:unknown,incidentId:string,incidentName:string):GeoJSONPolygonFeature{
  const value=input as {type?:string;geometry?:{type?:string;coordinates?:unknown}}
  if(value?.type!=='Feature'||value?.geometry?.type!=='Polygon'||!Array.isArray(value.geometry.coordinates)){
    throw new Error('Expected a GeoJSON Feature with Polygon geometry')
  }
  return {
    type:'Feature',
    id:`PERIM-${incidentId}`,
    properties:{incidentId,incidentName,source:'external-geojson-adapter',updatedAt:new Date().toISOString()},
    geometry:{type:'Polygon',coordinates:value.geometry.coordinates as number[][][]}
  }
}
