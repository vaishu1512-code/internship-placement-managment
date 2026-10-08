const internships = [
  {id:1, role:"Frontend Developer Intern", company:"TechNova Labs", domain:"Frontend", mode:"Hybrid", skills:["HTML","CSS","JavaScript"], stipend:"₹12,000 / month"},
  {id:2, role:"React.js Intern", company:"Ascend Digital", domain:"Frontend", mode:"Remote", skills:["React","JavaScript","Git"], stipend:"₹15,000 / month"},
  {id:3, role:"Node.js Developer Intern", company:"CodeCraft Systems", domain:"Backend", mode:"On-site", skills:["Node.js","Express","MongoDB"], stipend:"₹14,000 / month"},
  {id:4, role:"Full Stack Developer Intern", company:"WebOrbit", domain:"Full Stack", mode:"Hybrid", skills:["React","Node.js","MongoDB"], stipend:"₹18,000 / month"},
  {id:5, role:"Python Developer Intern", company:"DataBridge AI", domain:"Python", mode:"Remote", skills:["Python","Django","SQL"], stipend:"₹16,000 / month"},
  {id:6, role:"Software Testing Intern", company:"QualityWorks", domain:"Testing", mode:"Hybrid", skills:["Manual Testing","SQL","Jira"], stipend:"₹10,000 / month"}
];

let applications = JSON.parse(localStorage.getItem("interntrackApplications") || "[]");
let user = JSON.parse(localStorage.getItem("interntrackUser") || "null");

const $ = id => document.getElementById(id);

function showToast(message){
  $("toast").textContent = message;
  $("toast").classList.add("show");
  setTimeout(()=>$("toast").classList.remove("show"),2200);
}

function save(){
  localStorage.setItem("interntrackApplications", JSON.stringify(applications));
}

function init(){
  if(user) showApp();
  else $("loginPage").classList.remove("hidden");
  renderAll();
}

$("loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  user = {name:$("studentName").value.trim(), email:$("studentEmail").value.trim()};
  localStorage.setItem("interntrackUser", JSON.stringify(user));
  showApp();
  showToast("Welcome to InternTrack!");
});

$("logoutBtn").addEventListener("click", ()=>{
  localStorage.removeItem("interntrackUser");
  user = null;
  $("app").classList.add("hidden");
  $("loginPage").classList.remove("hidden");
});

function showApp(){
  $("loginPage").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("welcomeUser").textContent = `Hi, ${user.name}`;
  renderAll();
}

function renderJobs(){
  const search = $("searchInput").value.toLowerCase().trim();
  const mode = $("modeFilter").value;
  const domain = $("domainFilter").value;

  const filtered = internships.filter(job=>{
    const text = [job.role,job.company,job.domain,...job.skills].join(" ").toLowerCase();
    return (!search || text.includes(search)) &&
           (mode==="All" || job.mode===mode) &&
           (domain==="All" || job.domain===domain);
  });

  $("resultCount").textContent = `${filtered.length} found`;
  $("internshipGrid").innerHTML = filtered.length ? filtered.map(job=>{
    const applied = applications.some(a=>a.id===job.id);
    return `<article class="job-card">
      <div class="job-top"><div class="company-logo">${job.company.charAt(0)}</div><span class="tag">${job.mode}</span></div>
      <h3>${job.role}</h3>
      <p class="company">${job.company}</p>
      <div class="tags">${job.skills.map(s=>`<span class="tag">${s}</span>`).join("")}</div>
      <div class="job-footer">
        <span class="stipend">${job.stipend}</span>
        <button class="apply-btn" ${applied?"disabled":""} onclick="applyJob(${job.id})">${applied?"Applied":"Apply Now"}</button>
      </div>
    </article>`;
  }).join("") : `<div class="empty">No internships match your search.</div>`;
}

function applyJob(id){
  if(applications.some(a=>a.id===id)) return;
  const job = internships.find(j=>j.id===id);
  applications.push({id:job.id, role:job.role, company:job.company, status:"Applied", date:new Date().toLocaleDateString()});
  save();
  renderAll();
  showToast(`Applied to ${job.company} successfully!`);
}

function renderApplications(){
  $("applicationList").innerHTML = applications.length ? applications.map(a=>`
    <div class="application-row">
      <div><div class="role">${a.role}</div><small>${a.company} • Applied on ${a.date}</small></div>
      <span class="status">${a.status}</span>
      <small>Application #${String(a.id).padStart(3,"0")}</small>
    </div>
  `).join("") : `<div class="empty">You have not applied to any internship yet.</div>`;
}

function renderStats(){
  $("availableCount").textContent = internships.length;
  $("appliedCount").textContent = applications.length;
  $("shortlistedCount").textContent = applications.filter(a=>a.status==="Shortlisted").length;
  $("selectedCount").textContent = applications.filter(a=>a.status==="Selected").length;
}

function renderAll(){ renderJobs(); renderApplications(); renderStats(); }

$("searchInput").addEventListener("input",renderJobs);
$("modeFilter").addEventListener("change",renderJobs);
$("domainFilter").addEventListener("change",renderJobs);

init();
