import{s as $}from"./supabaseClient-BLHyOY-m.js";await b();const k=await I();M(k);P(k);async function b(){const a=JSON.parse(sessionStorage.getItem("loggedInUser"));if(!a)return alert("Must be logged in"),window.location.href="/index.html",!1;const d=JSON.parse(sessionStorage.getItem("loggedInUserNameOnly"));return document.querySelector(".js-title").innerHTML=`<h3 class="js-title">${d}'s QC Dashboard</h3>`,a}async function I(){try{const{data:{user:a},error:d}=await $.auth.getUser();if(d||!a)return console.error("User not logged in or auth error",d),[];const c=a.id,{data:r,error:o}=await $.from("project_assignments").select("project_id").eq("uid",c);if(o)return console.error("Error fetching project assignments:",o),[];const l=r.map(f=>f.project_id);if(l.length===0)return[];const{data:g,error:h}=await $.from("project_qc_list").select("*").in("project_id",l).order("project_id",{ascending:!0});return h?(console.error("Error fetching project details:",h),[]):g}catch(a){return console.error("Unexpected error fetching user projects:",a),[]}}async function M(a){const d=document.querySelector(".js-project-list");if(!d){console.error("Error: The container with class 'js-project-list' was not found in the DOM.");return}let c=0,r=0,o=0,l=0;const g=new Date;a.forEach(s=>{const v=s.end_dates.split(";"),m=s.task_status.split(";");for(let p=0;p<m.length;p++){const i=new Date(v[p]);m[p]==="Not Started"?(g>i?l+=1:E(g,i)<30,c+=1):m[p]==="In Progress"?(g>i&&(l+=1),r+=1):m[p]==="Completed"&&(o+=1)}});let f=`
        <div class = "kpi-container">
            <div class = "kpi-box">
                <p class = "kpi-label">In Progress</p>
                <h3 class = "kpi-value">${r}</h3>
            </div>
            <div class = "kpi-box">
                <p class = "kpi-label">Overdue</p>
                <h3 class = "kpi-value">${l}</h3>
            </div>
            <div class = "kpi-box">
                <p class = "kpi-label">Completed</p>
                <h3 class = "kpi-value">${o}</h3>
            </div>
            <div class = "kpi-box">
                <p class = "kpi-label">Not Started</p>
                <h3 class = "kpi-value">${c}</h3>
            </div>
        </div>
    `;a.forEach(s=>{const v=s.project_qc_list.split(";"),m=s.assigned_to.split(";"),p=s.start_dates.split(";"),i=s.end_dates.split(";"),y=s.completed_date.split(";"),_=s.task_status.split(";"),D=s.percent_complete.split(";"),S=s.priority.split(";"),u=[];for(let t=0;t<v.length;t++){const w={name:v[t],assignedTo:m[t],startDate:p[t],endDate:i[t],completedDate:y[t],taskStatus:_[t],percComplete:D[t],priority:S[t]};u.push(w)}const j=u.length,T=u.filter(t=>t.taskStatus==="Completed").length,e=j>0?T/j*100:0;let n=`
        <table class = "milestones-table">
            <thead>
                <tr>
                    <th>Milestone</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Completed Date</th>
                    <th>Priority</th>
                </tr>
            </thead>
            <tbody>
        `;u.forEach(t=>{n+=`
                    <tr data-project-id="${s.project_id}">
                        <td>
                            <input
                                type="text"
                                value = "${t.name}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${t.name}"
                                class = "milestone-name-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${t.assignedTo}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${t.name}"
                                class = "milestone-assigned-to-input"
                            />
                        </td>
                        <td>
                            <select
                                class = "milestone-status-input"
                                data-project-id="${s.project_id}"
                                data-milestone-name="${t.name}"
                            >
                                <option value = "Not Started" ${t.taskStatus==="Not Started"?"selected":""}>Not Started</option>
                                <option value = "In Progress" ${t.taskStatus==="In Progress"?"selected":""}>In Progress</option>
                                <option value = "Completed" ${t.taskStatus==="Completed"?"selected":""}>Completed</option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${t.startDate}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${t.name}"
                                class = "milestone-start-date-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${t.endDate}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${t.name}"
                                class = "milestone-end-date-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value = "${t.completedDate}"
                                data-project-id = "${s.project_id}"
                                data-milestone-name = "${t.name}"
                                class = "milestone-completed-date-input"
                            />
                        </td>
                        <td>
                            <select
                                class = "milestone-priority-input"
                                data-project-id="${s.project_id}"
                                data-milestone-name="${t.name}"
                            >
                                <option value = "Urgent" ${t.priority==="Urgent"?"selected":""}>Urgent</option>
                                <option value = "Important" ${t.priority==="Important"?"selected":""}>Important</option>
                                <option value = "Mediume" ${t.priority==="Medium"?"selected":""}>Medium</option>
                                <option value = "Low" ${t.priority==="Low"?"selected":""}>Low</option>
                            </select>
                        </td>
                    </tr>
            `}),n+=`
            </tbody>
        </table>
        `,f+=`
            <div class="project-item" data-project-id="${s.project_id}">
                <h3>Project Name: ${s.project_name}</h3>
                <h3 class="project-id-label">ID: ${s.project_id}</h3>
                <div class="progress-milestones-container">
                    <div class="milestone-list">
                        ${n}
                    </div>
                    <div class="progress-info-container">
                        <p>${s.project_name} % Complete</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${e}%;">
                                ${Math.round(e)}%
                            </div>
                        </div>
                        <div class="last-update-stats">
                            <p>Last Update: ${s.last_update_name}, ${s.last_update_time}</p>
                        </div>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="js-save-project-button" data-project-id="${s.project_id}">Save Changes</button>
                </div>
            </div>
        `}),d.innerHTML=f}function P(a){document.querySelectorAll(".js-save-project-button").forEach(c=>{c.addEventListener("click",()=>{const r=c.getAttribute("data-project-id"),o=a.find(l=>l.project_id===r);if(o){const l=o.project_qc_list.split(";"),g=o.assigned_to.split(";"),h=o.start_dates.split(";"),f=o.end_dates.split(";"),s=o.completed_date.split(";"),v=o.task_status.split(";"),m=o.percent_complete.split(";"),p=o.priority.split(";"),i=[];for(let e=0;e<l.length;e++){const n={name:l[e],assignedTo:g[e],startDate:h[e],endDate:f[e],completedDate:s[e],taskStatus:v[e],percComplete:m[e],priority:p[e]};i.push(n)}const y=document.querySelectorAll(`.milestone-name-input[data-project-id="${r}"]`),_=document.querySelectorAll(`.milestone-assigned-to-input[data-project-id="${r}"]`),D=document.querySelectorAll(`.milestone-status-input[data-project-id="${r}"]`),S=document.querySelectorAll(`.milestone-start-date-input[data-project-id="${r}"]`),u=document.querySelectorAll(`.milestone-end-date-input[data-project-id="${r}"]`),j=document.querySelectorAll(`.milestone-completed-date-input[data-project-id="${r}"]`),T=document.querySelectorAll(`.milestone-priority-input[data-project-id="${r}"]`);for(let e=0;e<l.length;e++)i[e].name=y[e].value,i[e].assignedTo=_[e].value,i[e].taskStatus=D[e].value,i[e].startDate=S[e].value,i[e].endDate=u[e].value,i[e].completedDate=j[e].value,i[e].priority=T[e].value;C(i,o)}})})}async function C(a,d){const c=d.project_id,{data:{user:r}}=await $.auth.getUser();if(!r){alert("You must be logged in to save");return}let l=a.map(n=>n.name).toString().replace(/,/g,";"),h=a.map(n=>n.assignedTo).toString().replace(/,/g,";"),s=a.map(n=>n.startDate).toString().replace(/,/g,";"),m=a.map(n=>n.endDate).toString().replace(/,/g,";"),i=a.map(n=>n.completedDate).toString().replace(/,/g,";"),_=a.map(n=>n.priority).toString().replace(/,/g,";"),S=a.map(n=>n.taskStatus).toString().replace(/,/g,";");const u=new Date,j=u.toLocaleDateString()+" "+u.toLocaleTimeString(),{data:T,error:e}=await $.from("project_qc_list").update({project_qc_list:l,task_status:S,assigned_to:h,start_dates:s,end_dates:m,completed_date:i,priority:_,last_update_name:r.email,last_update_time:j}).eq("project_id",c);alert(`Project: ${c} saved updates`)}function E(a,d){const c=d.getTime()-a.getTime(),r=1e3*60*60*24,o=c/r;return Math.floor(o)}
