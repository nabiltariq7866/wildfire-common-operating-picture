import { Check, ChevronDown, Search, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

export function PageHeader({eyebrow,title,description,actions}:{eyebrow?:string;title:string;description?:string;actions?:ReactNode}){
  return <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div>{eyebrow&&<div className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-accent">{eyebrow}</div>}<h1 className="text-2xl font-semibold tracking-[-.035em] text-ink">{title}</h1>{description&&<p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>}</div>{actions&&<div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}</div>
}
export function Badge({children,tone='muted'}:{children:ReactNode;tone?:'success'|'accent'|'warning'|'danger'|'purple'|'muted'}){
  const cls={success:'ui-border-success bg-success/10 text-success',accent:'ui-border-accent bg-accent/10 text-accent',warning:'ui-border-warning bg-warning/10 text-warning',danger:'ui-border-danger bg-danger/10 text-danger',purple:'ui-border-purple bg-purple/10 text-purple',muted:'ui-border-subtle bg-panel/70 text-muted'}[tone]
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${cls}`}>{children}</span>
}
export function SectionCard({title,description,action,children,className=''}:{title:string;description?:string;action?:ReactNode;children:ReactNode;className?:string}){
  return <section className={`card overflow-hidden ${className}`}><div className="flex items-start justify-between gap-4 border-b ui-border-faint px-4 py-3.5"><div><h2 className="text-sm font-semibold text-ink">{title}</h2>{description&&<p className="mt-1 text-[11px] leading-4 text-muted">{description}</p>}</div>{action}</div><div className="p-4">{children}</div></section>
}
export function Modal({open,onClose,title,description,children,footer}:{open:boolean;onClose:()=>void;title:string;description?:string;children:ReactNode;footer?:ReactNode}){
  if(!open)return null
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-2xl overflow-hidden rounded-2xl border ui-border-subtle bg-elevated shadow-2xl"><div className="flex items-start justify-between gap-3 border-b ui-border-subtle px-5 py-4"><div><div className="text-base font-semibold text-ink">{title}</div>{description&&<div className="mt-1 text-xs leading-5 text-muted">{description}</div>}</div><button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-panel hover:text-ink"><X size={16}/></button></div><div className="max-h-[70vh] overflow-y-auto p-5 scrollbar-thin">{children}</div>{footer&&<div className="flex justify-end gap-2 border-t ui-border-subtle px-5 py-4">{footer}</div>}</div></div>
}
export function FieldLabel({label,hint,children}:{label:string;hint?:string;children:ReactNode}){return <label className="block"><div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink"><span>{label}</span>{hint&&<span className="text-[10px] font-normal text-faint">{hint}</span>}</div>{children}</label>}

export function SearchField({
  value,onChange,placeholder,className=''
}:{
  value:string
  onChange:(value:string)=>void
  placeholder:string
  className?:string
}){
  return <div className={`relative ${className}`}>
    <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-faint"/>
    <input
      className="field search-input h-11"
      value={value}
      onChange={e=>onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
}

type SelectOption={value:string;label:string;description?:string}
export function CustomSelect({value,onChange,options,placeholder='Select',disabled=false}:{value:string;onChange:(value:string)=>void;options:Array<string|SelectOption>;placeholder?:string;disabled?:boolean}){
  const normalized:SelectOption[]=options.map(o=>typeof o==='string'?{value:o,label:o}:o)
  const selected=normalized.find(o=>o.value===value)
  const buttonRef=useRef<HTMLButtonElement|null>(null),menuRef=useRef<HTMLDivElement|null>(null)
  const [open,setOpen]=useState(false),[rect,setRect]=useState<DOMRect|null>(null),[above,setAbove]=useState(false)
  const position=()=>{const r=buttonRef.current?.getBoundingClientRect()||null;setRect(r);if(r)setAbove(window.innerHeight-r.bottom<260&&r.top>260)}
  useLayoutEffect(()=>{if(open)position()},[open])
  useEffect(()=>{if(!open)return;const onDoc=(e:MouseEvent)=>{const t=e.target as Node;if(buttonRef.current?.contains(t)||menuRef.current?.contains(t))return;setOpen(false)};const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};const onScroll=()=>position();document.addEventListener('mousedown',onDoc);document.addEventListener('keydown',onKey);window.addEventListener('resize',onScroll);window.addEventListener('scroll',onScroll,true);return()=>{document.removeEventListener('mousedown',onDoc);document.removeEventListener('keydown',onKey);window.removeEventListener('resize',onScroll);window.removeEventListener('scroll',onScroll,true)}},[open])
  return <><button ref={buttonRef} type="button" disabled={disabled} onClick={()=>{if(!disabled)setOpen(v=>!v)}} className={`field flex h-[42px] items-center justify-between gap-3 text-left ${disabled?'cursor-not-allowed opacity-50':''}`}><span className={`min-w-0 truncate text-sm ${selected?'text-ink':'text-faint'}`}>{selected?.label||placeholder}</span><ChevronDown size={15} className={`shrink-0 text-faint transition ${open?'rotate-180':''}`}/></button>{open&&rect&&createPortal(<div ref={menuRef} className="fixed z-[160] max-h-[260px] overflow-y-auto rounded-xl border ui-border-subtle bg-elevated p-1.5 shadow-2xl scrollbar-thin" style={{left:Math.min(rect.left,window.innerWidth-rect.width-12),width:rect.width,top:above?undefined:rect.bottom+6,bottom:above?window.innerHeight-rect.top+6:undefined}}>{normalized.map(o=>{const active=o.value===value;return <button key={o.value} type="button" onClick={()=>{onChange(o.value);setOpen(false)}} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition ${active?'bg-accent/10':'hover:bg-panel'}`}><div className="min-w-0"><div className={`text-xs font-semibold ${active?'text-accent':'text-ink'}`}>{o.label}</div>{o.description&&<div className="mt-0.5 text-[9px] leading-4 text-faint">{o.description}</div>}</div>{active&&<Check size={14} className="shrink-0 text-accent"/>}</button>})}</div>,document.body)}</>
}
