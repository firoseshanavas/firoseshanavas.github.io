import {useEffect,useRef,useState} from 'react'

const TARGET = new Date('2026-12-20T11:30:00+05:30').getTime()
const CAL='https://calendar.google.com/calendar/render?action=TEMPLATE&text=Firose+%26+Mehrin+Wedding+Reception&dates=20261220T060000Z/20261220T090000Z&location=SEEMA+Auditorium%2C+Perumbavoor%2C+Kochi'
const MAP = 'https://maps.app.goo.gl/YqkhBSAk72qoAVp3A?g_st=iw'
const SONG = '/1000-years.mp3'          // put your mp3 in /public
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzB7gS4TgDX1HmvSh9uFBAT_KcweOaueckWj_Q7JXvzslKn_RaNOnEGEr18RcvBJWEt/exec'   // Google Sheet (Apps Script web app)
const WHATSAPP = ''                     // e.g. '919XXXXXXXXX' → also sends RSVP to your WhatsApp

// Photos live in /public/photos (faces centred, square crops). Outfit colours are spaced so similar ones never sit side by side.
const MAIN = '/photos/p-main.jpg'          // centre
const ORBITS = [
  [{s:'/photos/p-b.jpg',a:0},{s:'/photos/p-a.jpg',a:180}],                                  // inner ring
  [{s:'/photos/p-d.jpg',a:30},{s:'/photos/p-c.jpg',a:150},{s:'/photos/p-e.jpg',a:270}]      // outer ring
]

function Stars(){
  const ref = useRef()
  useEffect(()=>{
    const c=ref.current, x=c.getContext('2d'), R=Math.random
    let w,h,raf,s=[],sh=[],pt=[],px=0,py=0,tx=0,ty=0,lt=0,rn=[],cl=[]
    const init=()=>{
      w=c.width=innerWidth; h=c.height=innerHeight;cl=Array.from({length:12},()=>R()*w);rn=Array.from({length:Math.min(90,(w/5)|0)},()=>({x:cl[(R()*12)|0]+(R()+R()+R()-1.5)*26,y:R()*h*.8,vy:.25+R()*.6,r:R()*1.8+.5,z:R()*.6+.2}))
      s=Array.from({length:Math.min(380,(w*h/4200)|0)},()=>({x:R()*w,y:R()*h,r:R()*1.6+.3,p:R()*6.3,v:R()*.02+.005,z:R()*.8+.2,c:R()<.35?'#F0E8D8':'#fff'}))
      const d=Math.hypot(w,h), y0=h/2+.273*w
      for(let i=0;i<Math.min(700,(w*h/1500)|0);i++){           // milky way dust
        const t=(R()*1.2-.1)*d, o=(R()+R()+R()-1.5)*h*.2
        s.push({x:t*.877+o*.479,y:y0-t*.479+o*.877,r:R()*.7+.2,p:R()*6.3,v:R()*.015+.003,z:R()*.5+.2,c:R()<.3?'#C5CBD5':'#b9c8ff'})
      }
    }
    const spark=(X,Y,n,sp=3)=>{for(let i=0;i<n;i++){const a=R()*6.28,v=R()*sp+.4;pt.push({x:X,y:Y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:0,m:40+R()*30,r:R()*2+.8,c:R()<.5?'#fff':'#C5CBD5'})}}
    const move=e=>{tx=(e.clientX/w-.5)*2;ty=(e.clientY/h-.5)*2;if(e.timeStamp-lt>45){lt=e.timeStamp;spark(e.clientX,e.clientY,1,.8)}}
    const down=e=>spark(e.clientX,e.clientY,14)
    const ev=e=>spark(e.detail.x,e.detail.y,e.detail.n,7)
    const draw=()=>{
      x.clearRect(0,0,w,h); px+=(tx-px)*.05; py+=(ty-py)*.05
      x.save();x.setLineDash([1,6]);x.strokeStyle='rgba(185,165,129,.5)';x.lineWidth=1.2;x.globalAlpha=.25;for(const X of cl){x.beginPath();x.moveTo(X+px*10,0);x.lineTo(X+px*10,h*(.3+((X|0)%10)/30));x.stroke()}x.restore()
      for(const q of rn){q.y+=q.vy;if(q.y>h*.85)q.y=-5;x.globalAlpha=Math.max(0,1-q.y/(h*.85))*.9;x.fillStyle=q.r>1.8?'#F0E8D8':'#B9A581';x.shadowBlur=0;x.beginPath();x.arc(q.x+px*q.z*22,q.y,q.r,0,6.28);x.fill()}x.shadowBlur=0
      for(const a of s){a.p+=a.v;x.globalAlpha=.5+.5*Math.abs(Math.sin(a.p));x.fillStyle=a.c;x.beginPath();x.arc(a.x+px*a.z*22,a.y+py*a.z*22,a.r,0,6.28);x.fill();x.shadowBlur=0;if(a.r>1.6){const L=a.r*5,X=a.x+px*a.z*22,Y=a.y+py*a.z*22;x.fillStyle=a.c;x.beginPath();x.moveTo(X,Y-L);x.quadraticCurveTo(X,Y,X+L,Y);x.quadraticCurveTo(X,Y,X,Y+L);x.quadraticCurveTo(X,Y,X-L,Y);x.quadraticCurveTo(X,Y,X,Y-L);x.fill()}}
      if(sh.length<3&&R()<.011){const t=R()*6.283,v=7+R()*6;sh.push({x:R()*w,y:R()*h,vx:Math.cos(t)*v,vy:Math.sin(t)*v,l:0,m:45+R()*35,c:R()<.4?'240,232,216':'197,203,213'})}
      sh=sh.filter(q=>{q.x+=q.vx;q.y+=q.vy;q.l++
        const k=Math.hypot(q.vx,q.vy),tl=90,g=x.createLinearGradient(q.x,q.y,q.x-q.vx/k*tl,q.y-q.vy/k*tl)
        g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,`rgba(${q.c},0)`)
        x.globalAlpha=Math.min(1,(q.m-q.l)/20);x.strokeStyle=g;x.lineWidth=2;x.beginPath();x.moveTo(q.x,q.y);x.lineTo(q.x-q.vx/k*tl,q.y-q.vy/k*tl);x.stroke()
        return q.l<q.m&&q.x<w+100&&q.x>-100&&q.y>-100&&q.y<h+100})
      pt=pt.filter(q=>{q.x+=q.vx;q.y+=q.vy;q.vx*=.97;q.vy*=.97;q.l++;x.globalAlpha=1-q.l/q.m;x.fillStyle=q.c;x.beginPath();x.arc(q.x,q.y,q.r,0,6.28);x.fill();return q.l<q.m})
      raf=requestAnimationFrame(draw)}
    init();draw()
    addEventListener('resize',init);addEventListener('pointermove',move);addEventListener('pointerdown',down);addEventListener('sparkle',ev)
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',init);removeEventListener('pointermove',move);removeEventListener('pointerdown',down);removeEventListener('sparkle',ev)}
  },[])
  return <><canvas ref={ref} className="stars" aria-hidden="true"/></>
}

function useCountdown(){
  const [n,setN]=useState(Date.now())
  useEffect(()=>{const i=setInterval(()=>setN(Date.now()),1000);return()=>clearInterval(i)},[])
  const d=Math.max(0,TARGET-n)
  return [['Days',d/864e5],['Hours',d/36e5%24],['Mins',d/6e4%60],['Secs',d/1e3%60]].map(([l,v])=>[l,String(Math.floor(v)).padStart(2,'0')])
}

function Reveal({children,delay=0}){
  const r=useRef(); const [v,setV]=useState(false)
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect()}},{threshold:.15});o.observe(r.current);return()=>o.disconnect()},[])
  return <div ref={r} className={'rv'+(v?' in':'')} style={{transitionDelay:delay+'s'}}>{children}</div>
}

function Rsvp(){
  const [f,setF]=useState({name:'',phone:'',attend:'yes',guests:1,msg:''}), [st,setSt]=useState('idle'), [err,setErr]=useState(false)
  const set=k=>e=>setF({...f,[k]:e.target.value})
  const send=async()=>{
    if(!f.name.trim()){setErr(true);return}
    setErr(false);setSt('sending')
    const p={...f,at:new Date().toISOString()}
    if(!RSVP_ENDPOINT&&!WHATSAPP){setSt('unconfigured');return}
    try{if(RSVP_ENDPOINT)await fetch(RSVP_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(p)})}catch(e){setSt('error');return}
    if(WHATSAPP)window.open(`https://wa.me/${WHATSAPP}?text=`+encodeURIComponent(`RSVP – ${p.name}\n${p.attend==='yes'?`Attending (${p.guests})`:'Unable to attend'}\n${p.msg}`),'_blank')
    setSt('done')
  }
  if(st==='done')return <div className="card rsvp"><h3>Thank you, {f.name}</h3><p className="p">{f.attend==='yes'?'We can’t wait to celebrate with you.':'You will be missed. Thank you for letting us know.'}</p><button className="btn" onClick={()=>setSt('idle')}>Edit response</button></div>
  return <div className="card rsvp">
    <input placeholder="Your name *" value={f.name} onChange={set('name')} className={err?'bad':''}/>
    <input placeholder="Phone (optional)" inputMode="tel" value={f.phone} onChange={set('phone')}/>
    <div className="tog">
      <button className={f.attend==='yes'?'on':''} onClick={()=>setF({...f,attend:'yes'})}>Joyfully accept</button>
      <button className={f.attend==='no'?'on':''} onClick={()=>setF({...f,attend:'no'})}>Regretfully decline</button>
    </div>
    {f.attend==='yes'&&<select value={f.guests} onChange={set('guests')}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} {n>1?'guests':'guest'} (including you)</option>)}</select>}
    <textarea rows="3" placeholder="A message for us (optional)" value={f.msg} onChange={set('msg')}/>
    <button className="btn" onClick={send} disabled={st==='sending'}>{st==='sending'?'Sending…':'Send RSVP'}</button>
    {st==='unconfigured'&&<p className="note">RSVP isn’t connected yet. Set RSVP_ENDPOINT or WHATSAPP in App.jsx.</p>}
    {st==='error'&&<p className="note">Couldn’t send your RSVP. Please try again.</p>}
  </div>
}

const Flourish=()=><svg className="fl" viewBox="0 0 300 60" fill="none" stroke="url(#gg)" strokeWidth="1.4"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stopColor="#7d8798"/><stop offset=".5" stopColor="#E4E8EF"/><stop offset="1" stopColor="#7d8798"/></linearGradient></defs><path d="M150 6v10M150 16c-8 10-20 14-34 10-12-3-14-16-4-18 9-2 12 8 4 10M150 16c8 10 20 14 34 10 12-3 14-16 4-18-9-2-12 8-4 10M116 26C96 40 70 42 40 34M184 26c20 14 46 16 76 8M40 34c-14-4-24-2-32 4M260 34c14-4 24-2 32 4"/><path d="M150 30l4 6-4 6-4-6z" fill="#E4E8EF"/></svg>
const Divider=()=><div className="dv"><i/><Star8 s={14}/><i/></div>
const COUPLE_IMG = '/photos/couple.png'
const MOON_IMG = '/photos/moon.png'
const HERO_MOON = '/photos/moon-crescent.png'
const FLOWER_IMG = '/photos/flower.png'
const st=(x,y,r)=>`M${x} ${y-r}Q${x} ${y} ${x+r} ${y}Q${x} ${y} ${x} ${y+r}Q${x} ${y} ${x-r} ${y}Q${x} ${y} ${x} ${y-r}Z`
const CL=[[12,14,9],[40,9,5],[22,42,6],[66,24,4],[9,70,4],[52,54,7],[92,12,4],[30,86,3],[80,60,3],[110,30,3]]
const Corner=({c})=><svg className={'cn '+c} viewBox="0 0 130 130" aria-hidden="true">{CL.map(([x,y,r],i)=><path key={i} d={st(x,y,r)} fill={i%2?'#ffffff':'#C5CBD5'} className="tw" style={{animationDelay:i*.3+'s'}}/>)}<g fill="none" stroke="#cfd9f2" strokeWidth="1" opacity=".75"><path d="M3 3C3 42 30 66 66 60M3 3C42 3 66 30 60 66M13 13C13 34 28 46 46 44M13 13C34 13 46 28 44 46"/></g>{Array.from({length:26},(_,i)=>{const x=(i*37)%120;return <circle key={'d'+i} cx={x+4} cy={((i*53)%100)*(1-x/150)+4} r={.6+(i%3)*.4} fill="#C5CBD5" opacity=".65"/>})}</svg>
const Ribbons=({flip})=><svg className={'rbn'+(flip?' flip':'')} viewBox="0 0 360 200" fill="none" aria-hidden="true"><path d="M-10 70C50 10 110 110 180 55S310 10 370 60"/><path className="d" d="M-10 95C60 40 120 135 190 80S320 40 370 85"/><path d="M-10 40C40 -10 100 70 170 25"/><path className="d" d="M370 30C320 -10 270 60 220 20"/></svg>
const Strands=({edge})=><div className="sts" aria-hidden="true">{(edge?[4,10,17,83,90,96]:[6,14,22,31,42,53,63,72,82,91]).map((x,i)=><span key={i} style={{left:x+'%',height:(40+(i*37)%90)+'px'}}><b className={i%2?'orb':'cr'} style={{animationDelay:i*.4+'s'}}/></span>)}</div>
const Lamps=()=><div className="lps" aria-hidden="true">{[[4,90],[11,60],[18,40]].map(([x,h],i)=><i key={i} style={{left:x+'%',height:h+'px'}}/>)}</div>
const Star8=({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="#C5CBD5" strokeWidth="1.2"><rect x="5" y="5" width="14" height="14"/><rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)"/></g></svg>
const Crescent=()=><svg className="cres" viewBox="0 0 80 60" aria-hidden="true"><path d="M44 6A24 24 0 1 0 44 54 19 19 0 1 1 44 6Z" fill="none" stroke="#C5CBD5" strokeWidth="1.4"/><g fill="none" stroke="#C5CBD5" strokeWidth="1"><rect x="56" y="22" width="10" height="10"/><rect x="56" y="22" width="10" height="10" transform="rotate(45 61 27)"/></g></svg>
export default function App(){
  const [caught,setCaught]=useState(false), [gone,setGone]=useState(false), [on,setOn]=useState(false), [pos,setPos]=useState(null), [zoom,setZoom]=useState(null), [atEnd,setAtEnd]=useState(false), [shown,setShown]=useState(false)
  const a=useRef(), m=useRef(), cd=useCountdown()
  useEffect(()=>{document.body.style.overflow=gone?'':'hidden'},[gone])
  useEffect(()=>{                       // hide the down-arrow once the visitor reaches the very bottom
    if(!gone)return
    const f=()=>setAtEnd(scrollY>=document.documentElement.scrollHeight-innerHeight-60)
    f();addEventListener('scroll',f,{passive:true});addEventListener('resize',f)
    return()=>{removeEventListener('scroll',f);removeEventListener('resize',f)}
  },[gone])
  const grab=()=>{
    if(caught)return
    const r=m.current.getBoundingClientRect(), X=r.left+r.width/2, Y=r.top+r.height/2
    setPos({left:X,top:Y}); setCaught(true)
    dispatchEvent(new CustomEvent('sparkle',{detail:{x:X,y:Y,n:110}}))
    a.current.volume=.6; a.current.play().then(()=>setOn(true)).catch(()=>{})
    setTimeout(()=>setShown(true),500)
    setTimeout(()=>setGone(true),2500)
  }
  const toggle=()=>{if(a.current.paused){a.current.play().then(()=>setOn(true)).catch(()=>{})}else{a.current.pause();setOn(false)}}

  return (<>
    <audio ref={a} src={SONG} loop preload="auto"/>
    <Stars/>
    {zoom&&<div className="lb" onClick={()=>setZoom(null)}><img src={zoom} alt="Firose and Mehrin"/></div>}
    {!gone&&<div className={'intro'+(caught?' caught':'')}>
      <div className="ih"><p className="cap">You are invited</p><h2 className="script gold">Catch the moon<br/>to begin our story</h2></div>
      <div ref={m} role="button" tabIndex={0} aria-label="Catch the moon" className="catch" style={pos||undefined} onClick={grab} onKeyDown={e=>e.key==='Enter'&&grab()}><img src={MOON_IMG} alt=""/><span className="tm">Tap to catch me</span></div>
      <p className="tap">{caught?'You caught the moon':'Tap the glowing moon'}</p>
    </div>}
    {gone&&!atEnd&&<button className="down" aria-label="Scroll down" onClick={()=>scrollBy({top:innerHeight*.85,behavior:'smooth'})}><i/><i/></button>}
    {gone&&<button className={'music'+(on?' on':'')} onClick={toggle} aria-label="Toggle music">♪</button>}

    {caught&&<main className={shown?'in':''}>
      
      <section className="hero gx"><img className="bm1" src={HERO_MOON} alt=""/><Strands/><img className="hc" src={COUPLE_IMG} alt="Firose and Mehrin"/>
        <p className="bis">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="cap">Together with our families</p>
        <h1 className="names"><span>Firose</span><em>and</em><span>Mehrin</span></h1>
        <Divider/>
        <p className="cap sm">request the pleasure of your company at our wedding reception</p>
        
      </section>

      <section className="gx">
        <Strands edge/>
        <Reveal><p className="cap">With the blessings of</p><h2 className="script gold">Our Families</h2>
          <div className="fam3">
            <p className="cap">The Groom</p><h3 className="pn3 gold">Firose K Shanavas</h3><p className="it">son of</p><p className="par">Shanavas KP<br/>&amp; Aneesa Shanavas</p>
            <div className="stmid"><i/><b className="gold">F ✦ M</b><i/></div>
            <p className="cap">The Bride</p><h3 className="pn3 gold">Amal Mehrin Sunil</h3><p className="it">daughter of</p><p className="par">Mohamed Sunil<br/>&amp; Suffana Sunil</p>
          </div></Reveal>
      </section>

      <section className="cdsec">
        <Reveal><p className="cap">Until we celebrate together</p><h2 className="script goldy">Counting the Stars</h2>
          <div className="orbs">{cd.map(([l,v],i)=><div key={l} className="orb" style={{'--d':i,'--h':[0,26,8,38][i]+'px'}}><span className="str"/><div className="ball"><b>{v}</b></div><small className="cap">{l}</small></div>)}</div>
          <p className="it">Sunday, 20th December 2026 · 11:30 AM</p></Reveal>
      </section>

      <section>
        <Strands edge/><Reveal><p className="cap">The Reception</p><h2 className="script gold">Wedding Reception</h2>
          <div className="rcw"><div className="rcL"><p className="cap">Sunday</p><div className="big">20</div><p className="cap">December 2026</p>
          <span className="vl"/><p className="time2">11:30 AM</p><Divider/></div><div className="rcR">
          <p className="cap">Venue</p><h3 className="vn">SEEMA Auditorium</h3><p className="addr">Perumbavoor, Kochi</p>
          <div className="acts">
            <a className="act pri" href={MAP} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.6"/></svg><span>View Location<small>Open in Google Maps</small></span></a>
            <a className="act" href={CAL} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v3M17 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM12 12.5v5M9.5 15h5"/></svg><span>Add to Calendar<small>Save the date to your phone</small></span></a>
          </div></div></div></Reveal>
      </section>

      <section>
        <Reveal><p className="cap">Our universe</p>
          <div className="solar">
            <div className="sun"><img src={MAIN} alt="Firose and Mehrin" onClick={()=>setZoom(MAIN)}/></div>
            {ORBITS.map((ps,i)=><div key={i} className={'orbit o'+(i+1)}>
              {ps.map((p,j)=><div key={j} className="arm" style={{'--a':p.a+'deg'}}><img className="pl" src={p.s} alt="Firose and Mehrin" onClick={()=>setZoom(p.s)}/></div>)}
            </div>)}
          </div>
          <h2 className="script gold">Two souls, one orbit</h2></Reveal>
      </section>

      <section>
        <Reveal><Divider/><div className="qm">“</div>
          <p className="quote">Among His signs is that He created for you companions from among yourselves, that you may find tranquillity in them.</p>
          <p className="cap">Ar-Rum · 30:21</p><Divider/></Reveal>
      </section>

      
      <section>
        <Reveal><p className="cap">Kindly respond</p><h2 className="script gold">RSVP</h2><Rsvp/></Reveal>
      </section>

      <footer><img className="flw" src={FLOWER_IMG} alt=""/><p className="script gold">Your presence is the greatest gift</p><p className="cap">Firose &amp; Mehrin · 2026</p></footer>
    </main>}
  </>)
}
