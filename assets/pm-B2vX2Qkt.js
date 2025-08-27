import{s as m}from"./supabaseClient-BIyfXb2b.js";const g=JSON.parse(sessionStorage.getItem("loggedInUser")),j=await _();document.querySelector(".js-title").innerHTML=`<h3 class="js-title">${g} QC Dashboard</h3>`;f(j);v(j);async function _(){try{const{data:{user:c},error:d}=await m.auth.getUser();if(d||!c)return console.error("User not logged in or auth error",d),[];const l=c.id,{data:n,error:e}=await m.from("project_assignments").select("project_id").eq("uid",l);if(e)return console.error("Error fetching project assignments:",e),[];const o=n.map(i=>i.project_id);if(o.length===0)return[];const{data:r,error:a}=await m.from("project_qc_list").select("*").in("project_id",o).order("project_id",{ascending:!0});return a?(console.error("Error fetching project details:",a),[]):r}catch(c){return console.error("Unexpected error fetching user projects:",c),[]}}async function f(c,d){const l=document.querySelector(".js-project-list");if(!l){console.error("Error: The container with class 'js-project-list' was not found in the DOM.");return}let n="";c.forEach(e=>{const o=e.project_qc_list.split(";"),r=e.project_qc_status.split(";").map(t=>t==="true"),a=[];for(let t=0;t<o.length;t++){const h={name:o[t],isCompleted:r[t]};a.push(h)}const i=a.length,u=a.filter(t=>t.isCompleted).length,s=i>0?u/i*100:0;let p="";a.forEach(t=>{p+=`
                <div class="milestone-item">
                    <input
                        type="checkbox"
                        ${t.isCompleted?"checked":""}
                        id="${e.project_id}-${t.name.replace(/\s/g,"-")}-checkbox"
                        data-project-id="${e.project_id}"
                        data-milestone-name="${t.name}"
                        class="milestone-checkbox" />
                    <label for="${e.project_id}-${t.name.replace(/\s/g,"-")}-checkbox">
                        ${t.name}
                    </label>
                </div>
            `}),n+=`
            <div class="project-item" data-project-id="${e.project_id}">
                <h3>Project Name: ${e.project_name}</h3>
                <h3 class="project-id-label">ID: ${e.project_id}</h3>
                <h4>Milestones:</h4>
                <div class="progress-milestones-container">
                    <div class="milestone-list">
                        ${p}
                    </div>
                    <div class="progress-info-container">
                        <p>${e.project_name} QC Progress</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${s}%;">
                                ${Math.round(s)}%
                            </div>
                        </div>
                        <div class="last-update-stats">
                            <p>Last Update: ${e.last_update_name}, ${e.last_update_time}</p>
                        </div>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="js-save-project-button" data-project-id="${e.project_id}">Save Changes</button>
                </div>
            </div>
        `}),l.innerHTML=n}function v(c,d){document.querySelectorAll(".js-save-project-button").forEach(n=>{n.addEventListener("click",()=>{const e=n.getAttribute("data-project-id"),o=c.find(r=>r.project_id===e);if(o){const r=o.project_qc_list.split(";"),a=o.project_qc_status.split(";").map(s=>s==="true"),i=[];for(let s=0;s<r.length;s++){const p={name:r[s],isCompleted:a[s]};i.push(p)}document.querySelectorAll(`.milestone-checkbox[data-project-id="${e}"]`).forEach(s=>{const p=s.dataset.milestoneName;i.forEach(t=>{t.name===p&&(t.isCompleted=s.checked)})}),$(i,o)}})})}async function $(c,d){const l=d.project_id,{data:{user:n}}=await m.auth.getUser();if(!n){alert("You must be logged in to save");return}let o=c.map(s=>s.isCompleted).toString().replace(/,/g,";");const r=new Date,a=r.toLocaleDateString()+" "+r.toLocaleTimeString(),{data:i,error:u}=await m.from("project_qc_list").update({project_qc_status:o,last_update_name:n.email,last_update_time:a}).eq("project_id",l);alert(`Project: ${l} saved updates`)}
