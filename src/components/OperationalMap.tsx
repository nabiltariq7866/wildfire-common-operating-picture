import { AlertTriangle, Crosshair, Flame, Navigation, UsersRound } from 'lucide-react'
import type {Aircraft,GroundResource,Incident} from '../data/types'

export default function OperationalMap({
  incident,
  aircraft,
  ground,
  selectedAircraftId,
  onSelectAircraft
}:{
  incident:Incident
  aircraft:Aircraft[]
  ground:GroundResource[]
  selectedAircraftId:string|null
  onSelectAircraft:(id:string)=>void
}){
  const geoRing=incident.perimeterGeoJSON.geometry.coordinates[0]||[]
  const points=geoRing.map(([x,y])=>`${x*10},${y*6.2}`).join(' ')

  return (
    <div className="operational-map relative h-full min-h-[520px] overflow-hidden rounded-2xl border ui-border-subtle">
      <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="fireGlow">
            <stop offset="0%" stopColor="#FF6B5F" stopOpacity=".24"/>
            <stop offset="100%" stopColor="#FF6B5F" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="fireFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F2A65A" stopOpacity=".32"/>
            <stop offset="100%" stopColor="#FF6B5F" stopOpacity=".20"/>
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="5"/></filter>
        </defs>

        <rect width="1000" height="620" fill="var(--map-bg)"/>

        {Array.from({length:22}).map((_,i)=>
          <line key={`v-${i}`} x1={i*48} y1="0" x2={i*48} y2="620"
            stroke="var(--map-grid)" strokeOpacity="var(--map-grid-opacity)" strokeWidth="1"/>
        )}
        {Array.from({length:15}).map((_,i)=>
          <line key={`h-${i}`} x1="0" y1={i*44} x2="1000" y2={i*44}
            stroke="var(--map-grid)" strokeOpacity="var(--map-grid-opacity)" strokeWidth="1"/>
        )}

        <path d="M20 480 C180 410 220 500 350 430 S570 330 720 390 S870 500 990 420"
          fill="none" stroke="var(--map-road)" strokeWidth="7" strokeOpacity=".34"/>
        <path d="M40 135 C190 70 300 150 430 95 S650 90 795 145 S930 160 990 105"
          fill="none" stroke="var(--map-contour-soft)" strokeWidth="2" strokeOpacity=".68"/>
        <path d="M140 40 C120 160 175 250 125 365 S80 520 165 610"
          fill="none" stroke="var(--map-water)" strokeWidth="5" strokeOpacity=".42"/>
        <path d="M15 300 C160 280 270 310 400 265 S720 235 980 300"
          fill="none" stroke="var(--map-contour)" strokeDasharray="10 10" strokeOpacity=".36"/>

        {Array.from({length:9}).map((_,i)=>
          <path
            key={`c-${i}`}
            d={`M${90+i*92} ${80+i%3*55} C${150+i*83} ${40+i%4*60}, ${235+i*73} ${160+i%2*70}, ${320+i*64} ${105+i%5*32}`}
            fill="none"
            stroke="var(--map-contour)"
            strokeWidth="1.3"
            strokeOpacity=".56"
          />
        )}

        <circle cx={incident.center.x*10} cy={incident.center.y*6.2} r="160" fill="url(#fireGlow)" filter="url(#glow)"/>
        <polygon points={points} fill="url(#fireFill)" stroke="#FF7A5E" strokeWidth="3" strokeDasharray="8 5"/>
        <polygon points={points} fill="none" stroke="#F2A65A" strokeWidth="1.4" strokeOpacity=".82"/>

        {incident.dropZones.map(z=>
          <g key={z.id} transform={`translate(${z.x*10} ${z.y*6.2})`}>
            <circle
              r="18"
              fill={z.risk==='High'?'rgba(255,107,95,.13)':'rgba(57,198,216,.12)'}
              stroke={z.risk==='High'?'#FF6B5F':'#23AFC1'}
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <circle r="5" fill={z.risk==='High'?'#FF6B5F':'#23AFC1'}/>
            <text x="25" y="4" fill="var(--map-label-strong)" fontSize="11" fontWeight="700">{z.name}</text>
          </g>
        )}

        {incident.hazards.map(h=>
          <g key={h.id} transform={`translate(${h.x*10} ${h.y*6.2})`}>
            <path d="M0 -9 L9 8 L-9 8 Z" fill={h.severity==='High'?'#FF6B5F':'#F2A65A'} opacity=".94"/>
            <text x="14" y="4" fill="var(--map-label)" fontSize="10">{h.label}</text>
          </g>
        )}

        {ground.map(g=>
          <g key={g.id} transform={`translate(${g.x*10} ${g.y*6.2})`}>
            <rect x="-8" y="-8" width="16" height="16" rx="4"
              fill="var(--map-ground-fill)" stroke="var(--map-ground-stroke)" strokeWidth="1.5"/>
            <circle r="3" fill="var(--map-ground-stroke)"/>
            <text x="13" y="4" fill="var(--map-label)" fontSize="10" fontWeight="600">{g.name}</text>
          </g>
        )}

        {aircraft.map(a=>{
          const selected=a.id===selectedAircraftId
          return (
            <g key={a.id} transform={`translate(${a.x*10} ${a.y*6.2})`} onClick={()=>onSelectAircraft(a.id)} style={{cursor:'pointer'}}>
              {selected&&<circle r="24" fill="rgba(57,198,216,.10)" stroke="#23AFC1" strokeWidth="1.5" strokeDasharray="4 4"/>}
              <g transform={`rotate(${a.heading})`}>
                <path
                  d="M0 -12 L5 4 L14 8 L13 11 L4 8 L2 14 L-2 14 L-4 8 L-13 11 L-14 8 L-5 4 Z"
                  fill={a.type==='Helitanker'?'#F2A65A':'#39C6D8'}
                  stroke="var(--map-aircraft-outline)"
                  strokeWidth=".7"
                />
              </g>
              <rect x="14" y="-15" width={a.callsign.length*6+16} height="21" rx="6"
                fill="var(--map-label-box)" stroke="var(--map-label-box-border)"/>
              <text x="22" y="0" fill="var(--map-label-strong)" fontSize="10" fontWeight="700">{a.callsign}</text>
            </g>
          )
        })}
      </svg>

      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
        <div className="map-glass rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold">TACTICAL VIEW</div>
        <div className="rounded-lg border ui-border-danger bg-danger/10 px-2.5 py-1.5 text-[9px] font-semibold text-danger backdrop-blur">
          {incident.acres.toLocaleString()} ACRES
        </div>
        <div className="rounded-lg border ui-border-success bg-success/10 px-2.5 py-1.5 text-[9px] font-semibold text-success backdrop-blur">
          {incident.containment}% CONTAINED
        </div>
      </div>

      <div className="map-glass absolute bottom-3 left-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-[9px]">
        <Flame size={12} className="text-danger"/> Perimeter
        <Navigation size={12} className="ml-2 text-accent"/> Aircraft
        <UsersRound size={12} className="ml-2 text-success"/> Ground
        <AlertTriangle size={12} className="ml-2 text-warning"/> Hazard
      </div>

      <div className="map-glass absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-xl border text-accent">
        <Crosshair size={16}/>
      </div>
    </div>
  )
}
