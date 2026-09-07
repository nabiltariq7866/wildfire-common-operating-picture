import { CheckCircle2, Clock3, Gauge, Search, ShieldCheck, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, CustomSelect, FieldLabel, PageHeader, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function Evaluation(){
  const navigate=useNavigate()
  const {
    aircraft,role,evaluationTargetId,evaluationStartedAt,assetLocateResults,trustResponses,
    startAssetLocateTest,cancelAssetLocateTest,submitTrustResponse
  }=useDemo()
  const candidates=aircraft.filter(a=>a.incidentId)
  const [target,setTarget]=useState(candidates[0]?.id||'')
  const [baseline,setBaseline]=useState('120')
  const [wouldTrust,setWouldTrust]=useState<boolean|null>(null)
  const [rating,setRating]=useState(4)
  const [notes,setNotes]=useState('')
  const [saved,setSaved]=useState(false)

  const start=()=>{
    if(!target)return
    startAssetLocateTest(target,Math.max(1,Number(baseline)||120))
    navigate('/map')
  }

  const saveTrust=()=>{
    if(wouldTrust===null)return
    submitTrustResponse({wouldTrust,rating,notes})
    setSaved(true)
    setNotes('')
  }

  const latest=assetLocateResults[0]
  const yesResponses=trustResponses.filter(r=>r.wouldTrust).length
  const trustRate=trustResponses.length?Math.round((yesResponses/trustResponses.length)*100):0

  return <>
    <PageHeader eyebrow="Success Metrics" title="Usability & trust evaluation" description="Built-in instrumentation for the brief's two human success metrics: time-to-locate an asset and whether users would trust the COP as a secondary operational reference."/>

    <div className="grid gap-4 xl:grid-cols-[1fr_390px]">
      <div className="space-y-4">
        <SectionCard title="Asset location usability test" description="Compare COP locate time with a manually entered radio/process baseline">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label="Target aircraft">
              <CustomSelect value={target} onChange={setTarget} options={candidates.map(a=>({value:a.id,label:a.callsign,description:`${a.type} · ${a.status}`}))}/>
            </FieldLabel>
            <FieldLabel label="Radio / current-process baseline" hint="seconds">
              <input className="field h-[42px]" type="number" min="1" value={baseline} onChange={e=>setBaseline(e.target.value)}/>
            </FieldLabel>
          </div>

          {evaluationTargetId&&evaluationStartedAt?(
            <div className="mt-4 rounded-xl border ui-border-warning bg-warning/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink"><Clock3 size={16} className="text-warning"/>Test in progress</div>
              <div className="mt-2 text-xs leading-5 text-muted">Open the Live Operations Map and select the target aircraft marker. The timer stops automatically when the correct aircraft is selected.</div>
              <button onClick={cancelAssetLocateTest} className="secondary-btn mt-3">Cancel test</button>
            </div>
          ):<button onClick={start} className="primary-btn mt-4"><Search size={15}/>Start locate test on live map</button>}

          {latest&&<div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="soft-panel p-3"><div className="text-[8px] text-faint">Target</div><div className="mt-1 text-sm font-semibold text-ink">{latest.targetCallsign}</div></div>
            <div className="soft-panel p-3"><div className="text-[8px] text-faint">COP locate time</div><div className="mt-1 text-lg font-semibold text-accent">{latest.seconds}s</div></div>
            <div className="soft-panel p-3"><div className="text-[8px] text-faint">Baseline</div><div className="mt-1 text-lg font-semibold text-ink">{latest.baselineSeconds}s</div></div>
            <div className="soft-panel p-3"><div className="text-[8px] text-faint">Difference</div><div className={`mt-1 text-lg font-semibold ${latest.improvementPercent>=0?'text-success':'text-danger'}`}>{latest.improvementPercent>=0?'+':''}{latest.improvementPercent}%</div></div>
          </div>}
        </SectionCard>

        <SectionCard title="Recorded locate tests" description="Demo evaluation history persists locally">
          <div className="space-y-2">{assetLocateResults.slice(0,8).map(r=><div key={r.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border ui-border-subtle bg-panel/40 p-3"><div><div className="text-xs font-semibold text-ink">{r.targetCallsign}</div><div className="mt-1 text-[9px] text-faint">{r.role} · {r.completedAt}</div></div><div className="text-right"><div className="text-[9px] text-faint">Locate</div><div className="text-xs font-semibold text-accent">{r.seconds}s</div></div><Badge tone={r.improvementPercent>=0?'success':'warning'}>{r.improvementPercent>=0?'+':''}{r.improvementPercent}%</Badge></div>)}{!assetLocateResults.length&&<div className="rounded-xl border border-dashed ui-border-subtle p-5 text-center text-xs text-muted">No usability tests recorded yet.</div>}</div>
        </SectionCard>
      </div>

      <div className="space-y-4">
        <SectionCard title="Secondary-reference trust survey" description={`Current evaluator role: ${role}`}>
          <div className="text-xs font-semibold text-ink">Would you trust this COP as a secondary reference during an incident?</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={()=>{setWouldTrust(true);setSaved(false)}} className={`rounded-xl border p-3 text-xs font-semibold ${wouldTrust===true?'ui-border-success bg-success/10 text-success':'ui-border-subtle bg-panel/40 text-muted'}`}>Yes</button>
            <button onClick={()=>{setWouldTrust(false);setSaved(false)}} className={`rounded-xl border p-3 text-xs font-semibold ${wouldTrust===false?'ui-border-danger bg-danger/10 text-danger':'ui-border-subtle bg-panel/40 text-muted'}`}>No</button>
          </div>

          <div className="mt-4 text-[10px] font-semibold text-ink">Confidence / usefulness rating</div>
          <div className="mt-2 flex gap-1.5">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>{setRating(n);setSaved(false)}} className={`grid h-9 w-9 place-items-center rounded-lg border ${n<=rating?'ui-border-warning bg-warning/10 text-warning':'ui-border-subtle bg-panel/40 text-faint'}`}><Star size={14} fill={n<=rating?'currentColor':'none'}/></button>)}</div>

          <textarea value={notes} onChange={e=>{setNotes(e.target.value);setSaved(false)}} className="field mt-4 min-h-[92px]" placeholder="Optional evaluator notes…"/>
          <button disabled={wouldTrust===null} onClick={saveTrust} className="primary-btn mt-3 w-full"><CheckCircle2 size={15}/>{saved?'Saved':'Save evaluation'}</button>
        </SectionCard>

        <div className="card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink"><Gauge size={16} className="text-accent"/>Evaluation snapshot</div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="soft-panel p-3"><div className="text-[8px] text-faint">Locate tests</div><div className="mt-1 text-xl font-semibold text-ink">{assetLocateResults.length}</div></div>
            <div className="soft-panel p-3"><div className="text-[8px] text-faint">Trust rate</div><div className="mt-1 text-xl font-semibold text-success">{trustResponses.length?`${trustRate}%`:'—'}</div></div>
          </div>
          <div className="mt-3 flex gap-3 rounded-xl border ui-border-accent bg-accent/5 p-3"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-accent"/><div className="text-[10px] leading-5 text-muted">These metrics require real evaluators for meaningful results. The app now captures the data; it does not invent user-study outcomes.</div></div>
        </div>
      </div>
    </div>
  </>
}
