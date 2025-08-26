import{s as p}from"./supabaseClient-BIyfXb2b.js";let g=[],h=await v();const j=JSON.parse(localStorage.getItem("loggedInUser")),P=await D();document.querySelector(".js-title").innerHTML=`<h3 class="js-title">${j} QC Dashboard</h3>`;L(h,P);$(h,j);async function v(){try{const{data:s,error:r}=await p.from("project_qc_list").select("*").order("ProjectID",{ascending:!0});if(r){console.error("Error fetching data:",r);return}return g=s,s}catch(s){console.error("An unexpected error occurred:",s)}}async function D(){try{const{data:s,error:r}=await p.from("user_list").select("*");if(r)return console.error("Error fetching data:",r),null;const i=s.find(a=>a.username===j);return i?i.assignedProjects:null}catch(s){console.error("An unexpected error occurred:",s)}}async function L(s,r){const i=document.querySelector(".js-project-list");if(!i){console.error("Error: The container with class 'js-project-list' was not found in the DOM.");return}let a="";s.forEach(e=>{if(r.includes(e.ProjectName)){const c=e.ProjectQcList.split(";"),n=e.ProjectQcStatus.split(";").map(t=>t==="true"),l=[];for(let t=0;t<c.length;t++){const f={name:c[t],isCompleted:n[t]};l.push(f)}const d=l.length,u=l.filter(t=>t.isCompleted).length,o=d>0?u/d*100:0;let m="";l.forEach(t=>{m+=`
                    <div class="milestone-item">
                        <input
                            type="checkbox"
                            ${t.isCompleted?"checked":""}
                            id="${e.ProjectID}-${t.name.replace(/\s/g,"-")}-checkbox"
                            data-project-id="${e.ProjectID}"
                            data-milestone-name="${t.name}"
                            class="milestone-checkbox" />
                        <label for="${e.ProjectID}-${t.name.replace(/\s/g,"-")}-checkbox">
                            ${t.name}
                        </label>
                    </div>
                `}),a+=`
                <div class="project-item" data-project-id="${e.ProjectID}">
                    <h3>Project Name: ${e.ProjectName}</h3>
                    <h3 class="project-id-label">ID: ${e.ProjectID}</h3>
                    <h4>Milestones:</h4>
                    <div class="progress-milestones-container">
                        <div class="milestone-list">
                            ${m}
                        </div>
                        <div class="progress-info-container">
                            <p>${e.ProjectName} QC Progress</p>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${o}%;">
                                    ${Math.round(o)}%
                                </div>
                            </div>
                            <div class="last-update-stats">
                                <p>Last Update: ${e.LastUpdateName}, ${e.LastUpdateTime}</p>
                            </div>
                        </div>
                    </div>
                    <div class="project-actions">
                        <button class="js-save-project-button" data-project-id="${e.ProjectID}">Save Changes</button>
                    </div>
                </div>
            `}}),i.innerHTML=a}function $(s,r){document.querySelectorAll(".js-save-project-button").forEach(a=>{a.addEventListener("click",()=>{const e=a.getAttribute("data-project-id"),c=s.find(n=>n.ProjectID===e);if(c){const n=c.ProjectQcList.split(";"),l=c.ProjectQcStatus.split(";").map(o=>o==="true"),d=[];for(let o=0;o<n.length;o++){const m={name:n[o],isCompleted:l[o]};d.push(m)}document.querySelectorAll(`.milestone-checkbox[data-project-id="${e}"]`).forEach(o=>{const m=o.dataset.milestoneName;d.forEach(t=>{t.name===m&&(t.isCompleted=o.checked)})}),S(d,c,r)}})})}const S=async(s,r,i)=>{const a=r.ProjectID;let c=s.map(o=>o.isCompleted).toString().replace(/,/g,";");const n=new Date,l=n.toLocaleDateString()+" "+n.toLocaleTimeString(),{data:d,error:u}=await p.from("project_qc_list").update({ProjectQcStatus:c,LastUpdateName:i,LastUpdateTime:l}).eq("ProjectID",a);alert(`Project: ${a} saved updates`)};
