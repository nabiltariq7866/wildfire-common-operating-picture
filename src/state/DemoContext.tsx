import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { initialAircraft, initialAlerts, initialFeeds, initialGround, initialIncidents, initialTimeline } from '../data/mock'
import type {
  Aircraft,
  AssetLocateResult,
  FeedStatus,
  GroundResource,
  Incident,
  OperationalAlert,
  TimelineEvent,
  TrustResponse,
  UserRole
} from '../data/types'

type DemoContextValue={
  incidents:Incident[]
  aircraft:Aircraft[]
  ground:GroundResource[]
  alerts:OperationalAlert[]
  timeline:TimelineEvent[]
  feeds:FeedStatus[]
  role:UserRole
  selectedIncidentId:string
  running:boolean
  selectedAircraftId:string|null
  evaluationTargetId:string|null
  evaluationStartedAt:number|null
  evaluationBaselineSeconds:number
  assetLocateResults:AssetLocateResult[]
  trustResponses:TrustResponse[]
  setRole:(r:UserRole)=>void
  setSelectedIncidentId:(id:string)=>void
  setSelectedAircraftId:(id:string|null)=>void
  toggleSimulation:()=>void
  simulateWindShift:()=>void
  expandPerimeter:()=>void
  assignAircraft:(aircraftId:string,dropZoneId:string)=>void
  acknowledgeAlert:(id:string)=>void
  resolveAlert:(id:string)=>void
  delayGroundFeed:()=>void
  restoreFeeds:()=>void
  startAssetLocateTest:(aircraftId:string,baselineSeconds:number)=>void
  cancelAssetLocateTest:()=>void
  submitTrustResponse:(input:{wouldTrust:boolean;rating:number;notes:string})=>void
  resetDemo:()=>void
}

const DemoContext=createContext<DemoContextValue|null>(null)
const key=(name:string)=>`fireline-cop-v2-${name}`

const load=<T,>(name:string,fallback:T):T=>{
  try{
    const raw=localStorage.getItem(key(name))
    return raw?JSON.parse(raw):fallback
  }catch{return fallback}
}

const persist=(name:string,value:unknown)=>localStorage.setItem(key(name),JSON.stringify(value))
const nowTime=()=>new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})

const expandGeoJsonRing=(incident:Incident,factor:number)=>{
  const ring=incident.perimeterGeoJSON.geometry.coordinates[0]||[]
  const expanded=ring.map(([x,y])=>[
    incident.center.x+(x-incident.center.x)*factor,
    incident.center.y+(y-incident.center.y)*factor
  ])
  return {
    ...incident.perimeterGeoJSON,
    properties:{...incident.perimeterGeoJSON.properties,updatedAt:new Date().toISOString()},
    geometry:{type:'Polygon' as const,coordinates:[expanded]}
  }
}

export function DemoProvider({children}:{children:ReactNode}){
  const [incidents,setIncidents]=useState<Incident[]>(()=>load('incidents',initialIncidents))
  const [aircraft,setAircraft]=useState<Aircraft[]>(()=>load('aircraft',initialAircraft))
  const [ground,setGround]=useState<GroundResource[]>(()=>load('ground',initialGround))
  const [alerts,setAlerts]=useState<OperationalAlert[]>(()=>load('alerts',initialAlerts))
  const [timeline,setTimeline]=useState<TimelineEvent[]>(()=>load('timeline',initialTimeline))
  const [feeds,setFeeds]=useState<FeedStatus[]>(()=>load('feeds',initialFeeds))
  const [roleState,setRoleState]=useState<UserRole>(()=>load('role','Dispatcher'))
  const [selectedIncidentId,setSelectedIncidentIdState]=useState(()=>load('selectedIncident','INC-204'))
  const [running,setRunning]=useState(true)
  const [selectedAircraftIdState,setSelectedAircraftIdState]=useState<string|null>(null)

  const [evaluationTargetId,setEvaluationTargetId]=useState<string|null>(()=>load('evaluationTargetId',null))
  const [evaluationStartedAt,setEvaluationStartedAt]=useState<number|null>(()=>load('evaluationStartedAt',null))
  const [evaluationBaselineSeconds,setEvaluationBaselineSeconds]=useState<number>(()=>load('evaluationBaselineSeconds',120))
  const [assetLocateResults,setAssetLocateResults]=useState<AssetLocateResult[]>(()=>load('assetLocateResults',[]))
  const [trustResponses,setTrustResponses]=useState<TrustResponse[]>(()=>load('trustResponses',[]))

  const addTimeline=(event:Omit<TimelineEvent,'id'|'time'>)=>{
    setTimeline(prev=>{
      const next=[{...event,id:`EV-${Date.now()}`,time:nowTime()},...prev].slice(0,100)
      persist('timeline',next)
      return next
    })
  }

  const setRole=(r:UserRole)=>{setRoleState(r);persist('role',r)}
  const setSelectedIncidentId=(id:string)=>{setSelectedIncidentIdState(id);persist('selectedIncident',id)}

  const setSelectedAircraftId=(id:string|null)=>{
    setSelectedAircraftIdState(id)
    if(id&&evaluationTargetId===id&&evaluationStartedAt){
      const aircraftItem=aircraft.find(a=>a.id===id)
      const seconds=Math.max(1,Math.round((Date.now()-evaluationStartedAt)/1000))
      const baseline=Math.max(1,evaluationBaselineSeconds)
      const result:AssetLocateResult={
        id:`LOC-${Date.now()}`,
        targetId:id,
        targetCallsign:aircraftItem?.callsign||id,
        seconds,
        baselineSeconds:baseline,
        improvementPercent:Math.round(((baseline-seconds)/baseline)*100),
        role:roleState,
        completedAt:new Date().toLocaleString()
      }
      setAssetLocateResults(prev=>{
        const next=[result,...prev].slice(0,25)
        persist('assetLocateResults',next)
        return next
      })
      setEvaluationTargetId(null)
      setEvaluationStartedAt(null)
      persist('evaluationTargetId',null)
      persist('evaluationStartedAt',null)
    }
  }

  useEffect(()=>{
    if(!running)return
    const timer=window.setInterval(()=>{
      setAircraft(prev=>prev.map(a=>{
        if(!a.incidentId||['Available','Refueling','Maintenance'].includes(a.status))return a
        const dx=a.targetX-a.x
        const dy=a.targetY-a.y
        const dist=Math.hypot(dx,dy)
        if(dist<2){
          return {...a,x:a.x+(Math.random()-.5)*1.1,y:a.y+(Math.random()-.5)*1.1,heading:(a.heading+8)%360,fuel:Math.max(8,a.fuel-.08)}
        }
        const step=.85
        return {
          ...a,
          x:a.x+(dx/dist)*step,
          y:a.y+(dy/dist)*step,
          heading:(Math.atan2(dx,-dy)*180/Math.PI+360)%360,
          fuel:Math.max(8,a.fuel-.08),
          etaMinutes:Math.max(1,Math.round(dist/4))
        }
      }))
    },2200)
    return()=>window.clearInterval(timer)
  },[running])

  const toggleSimulation=()=>setRunning(v=>!v)

  const simulateWindShift=()=>{
    const id=selectedIncidentId
    setIncidents(prev=>{
      const next=prev.map(i=>i.id===id?{
        ...i,
        weather:{...i.weather,windDirection:'WNW',windSpeed:i.weather.windSpeed+4,gusts:i.weather.gusts+5,risk:'High' as const,lastUpdated:'Just now'}
      }:i)
      persist('incidents',next)
      return next
    })
    const alert:OperationalAlert={
      id:`ALT-${Date.now()}`,
      incidentId:id,
      level:'Critical',
      title:'Wind shift toward active drop corridor',
      message:'Simulated wind vector shifted WNW. Review active drop-zone exposure before the next aviation cycle.',
      time:'Just now',
      acknowledged:false,
      relatedEntityId:incidents.find(i=>i.id===id)?.dropZones.find(z=>z.status==='Active')?.id,
      category:'Weather'
    }
    setAlerts(prev=>{const next=[alert,...prev];persist('alerts',next);return next})
    addTimeline({incidentId:id,title:'Wind shift detected',detail:'Weather simulation changed the active wind vector and generated a drop-zone warning.',actor:'Weather Feed',tone:'danger'})
  }

  const expandPerimeter=()=>{
    setIncidents(prev=>{
      const next=prev.map(i=>i.id===selectedIncidentId?{
        ...i,
        perimeterScale:Number((i.perimeterScale*1.045).toFixed(3)),
        perimeterGeoJSON:expandGeoJsonRing(i,1.045),
        acres:Math.round(i.acres*(1+i.growthRate/100/5))
      }:i)
      persist('incidents',next)
      return next
    })
    addTimeline({incidentId:selectedIncidentId,title:'GeoJSON fire perimeter expanded',detail:'Mock GeoJSON Polygon coordinates and incident acreage were updated by the simulated perimeter feed.',actor:'Fire Perimeter Feed',tone:'warning'})
  }

  const assignAircraft=(aircraftId:string,dropZoneId:string)=>{
    const incident=incidents.find(i=>i.id===selectedIncidentId)
    const dz=incident?.dropZones.find(z=>z.id===dropZoneId)
    const ac=aircraft.find(a=>a.id===aircraftId)
    if(!incident||!dz||!ac)return

    setAircraft(prev=>{
      const next=prev.map(a=>a.id===aircraftId?{
        ...a,
        incidentId:incident.id,
        status:'En Route' as const,
        targetX:dz.x,
        targetY:dz.y,
        etaMinutes:Math.max(2,Math.round(Math.hypot(dz.x-a.x,dz.y-a.y)/4))
      }:a)
      persist('aircraft',next)
      return next
    })
    addTimeline({incidentId:incident.id,title:`${ac.callsign} assigned to ${dz.name}`,detail:`Dispatcher assignment created. Aircraft target updated to ${dz.name}.`,actor:roleState,tone:'accent'})
  }

  const acknowledgeAlert=(id:string)=>{
    const alert=alerts.find(a=>a.id===id)
    setAlerts(prev=>{
      const next=prev.map(a=>a.id===id?{...a,acknowledged:true}:a)
      persist('alerts',next)
      return next
    })
    if(alert)addTimeline({incidentId:alert.incidentId,title:'Alert acknowledged',detail:alert.title,actor:roleState,tone:'success'})
  }

  const resolveAlert=(id:string)=>{
    const alert=alerts.find(a=>a.id===id)
    setAlerts(prev=>{
      const next=prev.filter(a=>a.id!==id)
      persist('alerts',next)
      return next
    })
    if(alert)addTimeline({incidentId:alert.incidentId,title:'Operational alert resolved',detail:alert.title,actor:roleState,tone:'success'})
  }

  const delayGroundFeed=()=>{
    setFeeds(prev=>{
      const next=prev.map(f=>f.id==='FD-GROUND'?{...f,state:'Queued' as const,queued:5,latency:'1m 18s',lastSync:'1m ago'}:f)
      persist('feeds',next)
      return next
    })
    addTimeline({incidentId:selectedIncidentId,title:'Ground feed connectivity degraded',detail:'Five updates are queued locally in the demo feed.',actor:'System',tone:'warning'})
  }

  const restoreFeeds=()=>{
    setFeeds(prev=>{
      const next=prev.map(f=>({...f,state:'Live' as const,queued:0,latency:f.id==='FD-AIR'?'1.8 sec':f.id==='FD-FIRE'?'8 sec':'12 sec',lastSync:'Just now'}))
      persist('feeds',next)
      return next
    })
    addTimeline({incidentId:selectedIncidentId,title:'Queued updates synchronized',detail:'Connectivity simulation restored all data feeds to live state.',actor:'System',tone:'success'})
  }

  const startAssetLocateTest=(aircraftId:string,baselineSeconds:number)=>{
    setEvaluationTargetId(aircraftId)
    setEvaluationStartedAt(Date.now())
    setEvaluationBaselineSeconds(baselineSeconds)
    persist('evaluationTargetId',aircraftId)
    persist('evaluationStartedAt',Date.now())
    persist('evaluationBaselineSeconds',baselineSeconds)
  }

  const cancelAssetLocateTest=()=>{
    setEvaluationTargetId(null)
    setEvaluationStartedAt(null)
    persist('evaluationTargetId',null)
    persist('evaluationStartedAt',null)
  }

  const submitTrustResponse=(input:{wouldTrust:boolean;rating:number;notes:string})=>{
    const response:TrustResponse={
      id:`TRUST-${Date.now()}`,
      role:roleState,
      wouldTrust:input.wouldTrust,
      rating:input.rating,
      notes:input.notes,
      createdAt:new Date().toLocaleString()
    }
    setTrustResponses(prev=>{
      const next=[response,...prev].slice(0,50)
      persist('trustResponses',next)
      return next
    })
  }

  const resetDemo=()=>{
    setIncidents(initialIncidents)
    setAircraft(initialAircraft)
    setGround(initialGround)
    setAlerts(initialAlerts)
    setTimeline(initialTimeline)
    setFeeds(initialFeeds)
    setRoleState('Dispatcher')
    setSelectedIncidentIdState('INC-204')
    setSelectedAircraftIdState(null)
    setEvaluationTargetId(null)
    setEvaluationStartedAt(null)
    setEvaluationBaselineSeconds(120)
    setAssetLocateResults([])
    setTrustResponses([])
    ;['incidents','aircraft','ground','alerts','timeline','feeds','role','selectedIncident','evaluationTargetId','evaluationStartedAt','evaluationBaselineSeconds','assetLocateResults','trustResponses'].forEach(k=>localStorage.removeItem(key(k)))
  }

  const value=useMemo(()=>({
    incidents,aircraft,ground,alerts,timeline,feeds,role:roleState,selectedIncidentId,running,
    selectedAircraftId:selectedAircraftIdState,evaluationTargetId,evaluationStartedAt,evaluationBaselineSeconds,
    assetLocateResults,trustResponses,setRole,setSelectedIncidentId,setSelectedAircraftId,toggleSimulation,
    simulateWindShift,expandPerimeter,assignAircraft,acknowledgeAlert,resolveAlert,delayGroundFeed,restoreFeeds,
    startAssetLocateTest,cancelAssetLocateTest,submitTrustResponse,resetDemo
  }),[
    incidents,aircraft,ground,alerts,timeline,feeds,roleState,selectedIncidentId,running,selectedAircraftIdState,
    evaluationTargetId,evaluationStartedAt,evaluationBaselineSeconds,assetLocateResults,trustResponses
  ])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(){
  const ctx=useContext(DemoContext)
  if(!ctx)throw new Error('useDemo must be used inside DemoProvider')
  return ctx
}
