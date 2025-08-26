import{s as m}from"./supabaseClient-BIyfXb2b.js";let g=[],j=await v();const h=JSON.parse(localStorage.getItem("loggedInUser")),P=await b();document.querySelector(".js-title").innerHTML=`<h3 class="js-title">${h} QC Dashboard</h3>`;D(j,P);$(j);async function v(){try{const{data:s,error:r}=await m.from("project_qc_list").select("*").order("ProjectID",{ascending:!0});if(r){console.error("Error fetching data:",r);return}return g=s,s}catch(s){console.error("An unexpected error occurred:",s)}}async function b(){try{const{data:s,error:r}=await m.from("user_list").select("*");if(r)return console.error("Error fetching data:",r),null;const c=s.find(a=>a.username===h);return c?c.assignedProjects:null}catch(s){console.error("An unexpected error occurred:",s)}}async function D(s,r){const c=document.querySelector(".js-project-list");if(!c){console.error("Error: The container with class 'js-project-list' was not found in the DOM.");return}let a="";s.forEach(t=>{if(r.includes(t.ProjectName)){const n=t.ProjectQcList.split(";"),l=t.ProjectQcStatus.split(";").map(e=>e==="true"),i=[];for(let e=0;e<n.length;e++){const f={name:n[e],isCompleted:l[e]};i.push(f)}const d=i.length,p=i.filter(e=>e.isCompleted).length,o=d>0?p/d*100:0;let u="";i.forEach(e=>{u+=`
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
                `}),a+=`
                <div class="project-item" data-project-id="${t.ProjectID}">
                    <h3>Name: ${t.ProjectName}</h3>
                    <h3 class = "project-id-label">ID: ${t.ProjectID}<h3>
                    <h4>Milestones:</h4>
                    <div class="progress-milestones-container">
                        <div class="milestone-list">
                            ${u}
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
            `}}),c.innerHTML=a}function $(s,r){document.querySelectorAll(".js-save-project-button").forEach(a=>{a.addEventListener("click",()=>{const t=a.getAttribute("data-project-id"),n=s.find(l=>l.ProjectID===t);if(n){const l=n.ProjectQcList.split(";"),i=n.ProjectQcStatus.split(";").map(o=>o==="true"),d=[];for(let o=0;o<l.length;o++){const u={name:l[o],isCompleted:i[o]};d.push(u)}document.querySelectorAll(`.milestone-checkbox[data-project-id="${t}"]`).forEach(o=>{const u=o.dataset.milestoneName;d.forEach(e=>{e.name===u&&(e.isCompleted=o.checked)})}),S(d,n)}})})}const S=async(s,r)=>{const c=r.ProjectID;let t=s.map(i=>i.isCompleted).toString().replace(/,/g,";");const{data:n,error:l}=await m.from("project_qc_list").update({ProjectQcStatus:t}).eq("ProjectID",c);alert(`Project: ${c} saved updates`)};
