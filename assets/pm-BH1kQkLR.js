import{s as u}from"./supabaseClient-BLHyOY-m.js";const h=await g(),m=await f();document.querySelector(".js-title").innerHTML=`<h3 class="js-title">${h} QC Dashboard</h3>`;_(m);v(m);async function g(){const s=JSON.parse(sessionStorage.getItem("loggedInUser"));return s||(alert("Must be logged in"),window.location.href="/index.html",!1)}async function f(){try{const{data:{user:s},error:l}=await u.auth.getUser();if(l||!s)return console.error("User not logged in or auth error",l),[];const i=s.id,{data:e,error:r}=await u.from("project_assignments").select("project_id").eq("uid",i);if(r)return console.error("Error fetching project assignments:",r),[];const a=e.map(p=>p.project_id);if(a.length===0)return[];const{data:n,error:c}=await u.from("project_qc_list").select("*").in("project_id",a).order("project_id",{ascending:!0});return c?(console.error("Error fetching project details:",c),[]):n}catch(s){return console.error("Unexpected error fetching user projects:",s),[]}}async function _(s){const l=document.querySelector(".js-project-list");if(!l){console.error("Error: The container with class 'js-project-list' was not found in the DOM.");return}let i="";s.forEach(e=>{const r=e.project_qc_list.split(";"),a=e.project_qc_status.split(";").map(t=>t==="true"),n=[];for(let t=0;t<r.length;t++){const j={name:r[t],isCompleted:a[t]};n.push(j)}const c=n.length,p=n.filter(t=>t.isCompleted).length,o=c>0?p/c*100:0;let d="";n.forEach(t=>{d+=`
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
            `}),i+=`
            <div class="project-item" data-project-id="${e.project_id}">
                <h3>Project Name: ${e.project_name}</h3>
                <h3 class="project-id-label">ID: ${e.project_id}</h3>
                <h4>Milestones:</h4>
                <div class="progress-milestones-container">
                    <div class="milestone-list">
                        ${d}
                    </div>
                    <div class="progress-info-container">
                        <p>${e.project_name} QC Progress</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${o}%;">
                                ${Math.round(o)}%
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
        `}),l.innerHTML=i}function v(s){document.querySelectorAll(".js-save-project-button").forEach(i=>{i.addEventListener("click",()=>{const e=i.getAttribute("data-project-id"),r=s.find(a=>a.project_id===e);if(r){const a=r.project_qc_list.split(";"),n=r.project_qc_status.split(";").map(o=>o==="true"),c=[];for(let o=0;o<a.length;o++){const d={name:a[o],isCompleted:n[o]};c.push(d)}document.querySelectorAll(`.milestone-checkbox[data-project-id="${e}"]`).forEach(o=>{const d=o.dataset.milestoneName;c.forEach(t=>{t.name===d&&(t.isCompleted=o.checked)})}),$(c,r)}})})}async function $(s,l){const i=l.project_id,{data:{user:e}}=await u.auth.getUser();if(!e){alert("You must be logged in to save");return}let a=s.map(d=>d.isCompleted).toString().replace(/,/g,";");const n=new Date,c=n.toLocaleDateString()+" "+n.toLocaleTimeString(),{data:p,error:o}=await u.from("project_qc_list").update({project_qc_status:a,last_update_name:e.email,last_update_time:c}).eq("project_id",i);alert(`Project: ${i} saved updates`)}
