import{s as p}from"./supabaseClient-BIyfXb2b.js";let f=[],h=await P();const g=JSON.parse(localStorage.getItem("loggedInUser")),v=await b();$(h,v);L(h);async function P(){try{const{data:s,error:r}=await p.from("project_qc_list").select("*");if(r){console.error("Error fetching data:",r);return}return f=s,s}catch(s){console.error("An unexpected error occurred:",s)}}async function b(){try{const{data:s,error:r}=await p.from("user_list").select("*");if(r)return console.error("Error fetching data:",r),null;const a=s.find(c=>c.username===g);return a?a.assignedProjects:null}catch(s){console.error("An unexpected error occurred:",s)}}async function $(s,r){const a=document.querySelector(".js-project-list");if(!a){console.error("Error: The container with class 'js-project-list' was not found in the DOM.");return}let c="";s.forEach(t=>{if(r.includes(t.ProjectName)){const n=t.ProjectQcList.split("; "),i=t.ProjectQcStatus.split("; ").map(e=>e==="true"),l=[];for(let e=0;e<n.length;e++){const j={name:n[e],isCompleted:i[e]};l.push(j)}const d=l.length,u=l.filter(e=>e.isCompleted).length,o=d>0?u/d*100:0;let m="";l.forEach(e=>{m+=`
                    <div class="milestone-item">
                        <input
                            type="checkbox"
                            ${e.isCompleted?"checked":""}
                            id="${t.ProjectID}-${e.name.replace(/\s/g,"-")}-checkbox"
                            data-project-id="${t.ProjectID}"
                            data-milestone-name="${e.name}"
                            class="milestone-checkbox" />
                        <label for="${t.ProjectID}-${e.name.replace(/\s/g,"-")}-checkbox">
                            ${e.name}
                        </label>
                    </div>
                `}),c+=`
                <div class="project-item" data-project-id="${t.ProjectID}">
                    <h3>${t.ProjectName}</h3>
                    <h4>Milestones:</h4>
                    <div class="progress-milestones-container">
                        <div class="milestone-list">
                            ${m}
                        </div>
                        <div class="progress-bar-wrapper">
                            <p>${t.ProjectName} QC Progress</p>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${o}%;">
                                    ${Math.round(o)}%
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="project-actions">
                        <button class="js-save-project-button" data-project-id="${t.ProjectID}">Save Changes</button>
                    </div>
                </div>
            `}}),a.innerHTML=c}function L(s,r){document.querySelectorAll(".js-save-project-button").forEach(c=>{c.addEventListener("click",()=>{const t=c.getAttribute("data-project-id"),n=s.find(i=>i.ProjectID===t);if(console.log(n),n){const i=n.ProjectQcList.split("; "),l=n.ProjectQcStatus.split("; ").map(o=>o==="true"),d=[];for(let o=0;o<i.length;o++){const m={name:i[o],isCompleted:l[o]};d.push(m)}document.querySelectorAll(`.milestone-checkbox[data-project-id="${t}"]`).forEach(o=>{const m=o.dataset.milestoneName;d.forEach(e=>{e.name===m&&(e.isCompleted=o.checked)})}),console.log(d)}})})}
