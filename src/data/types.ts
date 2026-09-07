export type UserRole='Dispatcher'|'Incident Command'|'Operations Leadership'
export type IncidentSeverity='Critical'|'High'|'Moderate'
export type AircraftStatus='Available'|'En Route'|'On Station'|'Dropping'|'Water Pickup'|'Refueling'|'Maintenance'
export type GroundStatus='Deployed'|'Active'|'Staging'|'Assigned'|'Unavailable'
export type AlertLevel='Critical'|'Warning'|'Info'
export type FeedState='Live'|'Delayed'|'Queued'|'Offline'

export interface Point{x:number;y:number}

export interface GeoJSONPolygonGeometry{
  type:'Polygon'
  coordinates:number[][][]
}

export interface GeoJSONPolygonFeature{
  type:'Feature'
  id:string
  properties:{
    incidentId:string
    incidentName:string
    source:string
    updatedAt:string
  }
  geometry:GeoJSONPolygonGeometry
}

export interface DropZone{
  id:string
  name:string
  x:number
  y:number
  status:'Active'|'Standby'|'Suspended'
  risk:'Low'|'Elevated'|'High'
}

export interface Hazard{
  id:string
  type:'Powerline'|'Smoke'|'Terrain'|'Wind'|'Restricted'
  label:string
  x:number
  y:number
  severity:'Low'|'Medium'|'High'
}

export interface Weather{
  temperature:number
  windSpeed:number
  gusts:number
  windDirection:string
  humidity:number
  visibility:number
  risk:'Low'|'Elevated'|'High'
  lastUpdated:string
}

export interface Incident{
  id:string
  name:string
  location:string
  severity:IncidentSeverity
  status:'Active'|'Monitoring'
  acres:number
  containment:number
  growthRate:number
  perimeterScale:number
  perimeter:Point[]
  perimeterGeoJSON:GeoJSONPolygonFeature
  center:Point
  dropZones:DropZone[]
  hazards:Hazard[]
  weather:Weather
  commander:string
  started:string
}

export interface Aircraft{
  id:string
  callsign:string
  type:'Large Air Tanker'|'Helitanker'|'Lead Plane'|'Air Attack'
  model:string
  status:AircraftStatus
  incidentId:string|null
  x:number
  y:number
  targetX:number
  targetY:number
  altitude:number
  speed:number
  fuel:number
  load:number
  loadType:string
  etaMinutes:number
  base:string
  heading:number
}

export interface GroundResource{
  id:string
  name:string
  type:'Crew'|'Engine'|'Dozer'|'Water Tender'
  status:GroundStatus
  incidentId:string|null
  x:number
  y:number
  personnel:number
}

export interface OperationalAlert{
  id:string
  incidentId:string
  level:AlertLevel
  title:string
  message:string
  time:string
  acknowledged:boolean
  relatedEntityId?:string
  category:'Weather'|'Aircraft'|'Fire Growth'|'Ground'|'Connectivity'
}

export interface TimelineEvent{
  id:string
  incidentId:string
  time:string
  title:string
  detail:string
  actor:string
  tone:'accent'|'success'|'warning'|'danger'|'muted'
}

export interface FeedStatus{
  id:string
  label:string
  state:FeedState
  latency:string
  lastSync:string
  queued:number
}

export interface AssetLocateResult{
  id:string
  targetId:string
  targetCallsign:string
  seconds:number
  baselineSeconds:number
  improvementPercent:number
  role:UserRole
  completedAt:string
}

export interface TrustResponse{
  id:string
  role:UserRole
  wouldTrust:boolean
  rating:number
  notes:string
  createdAt:string
}
