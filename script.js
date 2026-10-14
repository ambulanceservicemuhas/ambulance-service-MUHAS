/* Edit this list to change the navbar. Each entry: S(number, title, page).
   The section id is built automatically: "1.0" -> s-1-0, "9.10" -> s-9-10,
   and entries with no number use the title, e.g. s-preface. */
const S=(n,t,p)=>({n,t,p,id:"s-"+(n||t).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"")});
const toc=[
  {label:"Preface",items:[S("","Preface",5)]},
  {label:"Definitions",items:[S("","Operational Definitions",6)]},
  {label:"Introduction",items:[
    S("1.0","Introduction",9),S("1.1","Principles of Emergency Medical Dispatch",9),
    S("1.2","Emergency Medical Dispatch Protocols",11),S("1.3","Emergency Medical Dispatchers",12),
    S("1.4","Role and Responsibilities of Emergency Medical Dispatchers",13)]},
  {label:"Dispatch Process",items:[
    S("2.0","Caller Interrogation",16),S("3.0","Priority Determination",18),
    S("4.0","Dispatching Emergency Medical Services (EMS)",20),S("4.1","Ambulance Response Modes",21),
    S("5.0","Dispatch Pre-Arrival Instructions (DPAI)",24),S("6.0","Emergency Medical Response Protocols",26),
    S("7.0","Coordination with Other Emergency Services and Incident Management",28),S("8.0","Communication",32)]},
  {label:"Guide Cards",mega:true,items:[
    
    S("9.0","EMD Protocol Guide Cards",34),S("9.0.1","EMD Categories and Types",35),S("9.0.2","General Pre-Arrival Instructions/Interventions",36),
    S("9.0.3","Mass Casualty/Major Incident",36),S("9.1","Abdominal Pain",38),S("9.2","Allergies / Stings",39),
    S("9.3","Altered Mental State",40),S("9.4","Animal Bites",41),S("9.5","Assault - Domestic, Sexual",42),
    S("9.6","Back Pain",43),S("9.7","Bleeding",44),S("9.8","Breathing Problems",45),S("9.9","Burns",46),
    S("9.10","Cardiac Arrest",47),S("9.11","Chest Pain / Heart Problems",51),S("9.12","Choking",52),
    S("9.13","Cord Prolapse",53),S("9.14","Diabetic Complications",54),S("9.15","Drowning",55),
    S("9.16","Electrical Injury",56),S("9.17","Epistaxis",57),S("9.18","Explosion",58),S("9.19","Eye Injuries",59),
    S("9.20","Falls",60),S("9.21","Febrile Child",61),S("9.22","Fractures",62),S("9.23","Hanging / Strangulation",62),
    S("9.24","Headache",63),S("9.25","Heat / Cold Exposure",64),S("9.26","Industrial Accidents",65),
    S("9.27","Infectious Disease",66),S("9.28","Persistent Vomiting and Diarrhea in Children",67),
    S("9.29","Poisoning – Ingestions / Overdose",68),S("9.30","Poisoning - Inhalation / Carbon Monoxide",69),
    S("9.31","Pregnancy / Childbirth",70),S("9.32","Psychiatric / Behavioral Problems",71),
    S("9.33","Road Traffic Crash",72),S("9.34","Seizures / Convulsions",73),S("9.35","Sprains",74),
    S("9.36","Stabbing / Gunshot / Assault",75),S("9.37","Stroke / CVA",76),S("9.38","Traumatic Injury",77),
    S("9.39","Unknown Illness",78),S("9.40","Unknown Person Down",79),S("9.41","Unresponsive Patient",79),
    S("9.42","Vaginal Bleeding",80),S("9.43","Weakness of Extremities",81)]}
];

const $=s=>document.querySelector(s), navbar=$("#navbar"), menu=$("#menu");

const row = i => `
  <a href="#${i.id}" data-id="${i.id}">
    <span>
      ${i.n ? `<span class="num">${i.n}</span>` : ""}
      ${i.t}
    </span>
  </a>
`;


toc.forEach(g=>{
  const li=document.createElement("li"); li.className="item";
  li.innerHTML=g.items.length===1
    ? `<a href="#${g.items[0].id}" data-id="${g.items[0].id}">${g.label}</a>`
    : `<button aria-haspopup="true" aria-expanded="false">${g.label}<span class="caret"></span></button>
       <div class="dropdown${g.mega?" mega":""}">${g.items.map(row).join("")}</div>`;
  menu.appendChild(li);
});

const items=[...document.querySelectorAll(".item")];
const closeAll=except=>items.forEach(t=>{if(t!==except){t.classList.remove("open");const b=t.querySelector("button");b&&b.setAttribute("aria-expanded","false")}});
items.forEach(t=>{const b=t.querySelector("button");if(!b)return;
  b.addEventListener("click",e=>{e.stopPropagation();const o=t.classList.toggle("open");b.setAttribute("aria-expanded",o);closeAll(t)})});
const closeMobile=()=>{navbar.classList.remove("open");$("#burger").setAttribute("aria-expanded","false")};
menu.addEventListener("click",e=>{if(e.target.closest("a")){closeAll();closeMobile()}});
$("#burger").addEventListener("click",()=>{const o=navbar.classList.toggle("open");$("#burger").setAttribute("aria-expanded",o)});
document.addEventListener("click",e=>{if(!e.target.closest(".item"))closeAll();if(!e.target.closest(".search"))$("#results").classList.remove("show")});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAll();closeMobile();$("#results").classList.remove("show")}});

// Search
const all=toc.flatMap(g=>g.items), q=$("#q"), res=$("#results");
q.addEventListener("input",()=>{
  const v=q.value.trim().toLowerCase();
  if(!v){res.classList.remove("show");return}
  const hits=all.filter(i=>(i.n+" "+i.t).toLowerCase().includes(v)).slice(0,12);
  res.innerHTML=hits.length?hits.map(row).join(""):"<p>No matching protocol.</p>";
  res.classList.add("show");
});
res.addEventListener("click",e=>{if(e.target.closest("a")){res.classList.remove("show");q.value="";closeMobile()}});

// Highlight the link for the section currently on screen (works once your sections have ids)
const spy=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){
  document.querySelectorAll(".active").forEach(a=>a.classList.remove("active"));
  document.querySelectorAll(`[data-id="${en.target.id}"]`).forEach(a=>{a.classList.add("active");
    const b=a.closest(".item")?.querySelector(":scope>button");b&&b.classList.add("active")})}}),
  {rootMargin:"-20% 0px -70% 0px"});
all.forEach(i=>{const el=document.getElementById(i.id);el&&spy.observe(el)});