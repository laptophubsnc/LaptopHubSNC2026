const KEY="laptophub_reservations_v1";
const laptops=Array.from({length:10},(_,i)=>`Laptop ${String(i+1).padStart(2,"0")}`);
const hourlySlots=["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"];
const $=id=>document.getElementById(id);
const today=new Date().toISOString().slice(0,10);
$("availabilityDate").value=today;
$("date").value=today;

function getReservations(){return JSON.parse(localStorage.getItem(KEY)||"[]")}
function saveReservations(x){localStorage.setItem(KEY,JSON.stringify(x))}
function timesToMinutes(t){const [h,m]=t.split(":").map(Number);return h*60+m}
function overlaps(aStart,aEnd,bStart,bEnd){return aStart<bEnd && bStart<aEnd}
function isReserved(laptop,date,type,start,end){
  return getReservations().some(r=>r.laptop===laptop&&r.date===date&&r.type===type&&overlaps(r.startMin,r.endMin,start,end))
}
function renderAvailability(){
  const date=$("availabilityDate").value;
  const type=$("availabilityType").value;
  const start=type==="overnight"?1020:timesToMinutes("08:00");
  const end=type==="overnight"?1920:timesToMinutes("17:00");
  $("laptopGrid").innerHTML=laptops.map(l=>{
    const used=isReserved(l,date,type,start,end);
    return `<div class="laptop-card"><strong>${l}</strong><span class="status ${used?"reserved":"ready"}">${used?"RESERVED":"READY FOR RENT"}</span></div>`
  }).join("");
}
function fillLaptopChoices(){
  const date=$("date").value,type=$("type").value;
  const start=type==="overnight"?1020:timesToMinutes($("startTime").value||"08:00");
  const end=type==="overnight"?1920:Math.min(start+(Number($("hours").value||1)*60),1020);
  $("laptop").innerHTML=laptops.map(l=>{
    const used=isReserved(l,date,type,start,end);
    return `<option value="${l}" ${used?"disabled":""}>${l}${used?" — RESERVED":""}</option>`
  }).join("");
  if([...$("laptop").options].every(o=>o.disabled)) $("laptop").innerHTML='<option value="">No laptop available</option>';
}
function fillTimes(){
  $("startTime").innerHTML=hourlySlots.map(t=>`<option value="${t}">${t.replace(":00","")}:00 ${Number(t.slice(0,2))<12?"AM":"PM"}</option>`).join("");
  $("hours").innerHTML=Array.from({length:9},(_,i)=>`<option value="${i+1}">${i+1} hour${i?"s":""}</option>`).join("");
}
function updateForm(){
  const overnight=$("type").value==="overnight";
  $("startWrap").classList.toggle("hidden",overnight);
  $("hoursWrap").classList.toggle("hidden",overnight);
  $("overnightNotice").classList.toggle("hidden",!overnight);
  $("ageCheck").checked=overnight?$("ageCheck").checked:false;
  $("ageCheck").parentElement.style.display=overnight?"flex":"none";
  const date=$("date").value||today;
  let period,total,startMin,endMin;
  if(overnight){period="5:00 PM – 8:00 AM";total=0;startMin=1020;endMin=1920}
  else{
    const start=$("startTime").value||"08:00"; const hours=Number($("hours").value||1);
    startMin=timesToMinutes(start); endMin=startMin+hours*60;
    if(endMin>1020){endMin=1020}
    period=`${formatTime(startMin)} – ${formatTime(endMin)} (${Math.round((endMin-startMin)/60)} hour${endMin-startMin===60?"":"s"})`;
    total=Math.round((endMin-startMin)/60)*50;
  }
  $("summaryPeriod").textContent=period;
  $("summaryTotal").textContent=overnight?"Overnight rate to be confirmed":"₱"+total.toLocaleString();
  fillLaptopChoices();
}
function formatTime(min){const h=Math.floor(min/60),m=min%60;return `${((h+11)%12)+1}:${String(m).padStart(2,"0")} ${h<12?"AM":"PM"}`}
function refresh(){renderAvailability();updateForm()}
$("availabilityDate").addEventListener("change",renderAvailability);
$("availabilityType").addEventListener("change",renderAvailability);
$("type").addEventListener("change",updateForm);
["date","startTime","hours"].forEach(id=>$(id).addEventListener("change",updateForm));
$("reservationForm").addEventListener("submit",e=>{
  e.preventDefault();
  const type=$("type").value,date=$("date").value,laptop=$("laptop").value;
  if(!laptop){$("formMessage").textContent="Please choose an available laptop.";return}
  if(type==="overnight"&&!$("ageCheck").checked){$("formMessage").textContent="Overnight take-home requires 18+ and a valid ID.";return}
  const startMin=type==="overnight"?1020:timesToMinutes($("startTime").value);
  const endMin=type==="overnight"?1920:startMin+Number($("hours").value)*60;
  if(isReserved(laptop,date,type,startMin,endMin)){ $("formMessage").textContent="That laptop was just reserved. Please choose another."; refresh(); return; }
  const reservations=getReservations();
  reservations.push({id:Date.now(),name:$("name").value.trim(),phone:$("phone").value.trim(),date,type,laptop,payment:$("payment").value,startMin,endMin,createdAt:new Date().toISOString()});
  saveReservations(reservations);
  $("formMessage").textContent=`Reservation saved for ${laptop}. Please contact 09628637697 to confirm payment/booking.`;
  e.target.reset();$("date").value=date;fillTimes();refresh();
});
fillTimes();refresh();$("ageCheck").parentElement.style.display="none";
