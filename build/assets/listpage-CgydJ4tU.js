import{r as a,i as u,j as e}from"./index-DKsfywk3.js";import{c as h,t as m}from"./api-Y8g4qh9J.js";import{L as y,y as n}from"./index-DE0YnFUq.js";/* empty css                      */const S=()=>{const[i,d]=a.useState([]),[o,x]=a.useState(""),[l,f]=a.useState(!0),c=u(),s=localStorage.getItem("token");a.useEffect(()=>{(async()=>{try{const r=await h(s);d(r.data)}catch{n.error("Failed to fetch pages")}finally{f(!1)}})()},[s]);const g=async t=>{if(window.confirm("Are you sure you want to delete this page?"))try{await m(s,t),d(i.filter(r=>r._id!==t)),n.success("Page deleted successfully")}catch{n.error("Failed to delete page")}},p=i.filter(t=>t.title.toLowerCase().includes(o.toLowerCase())||t.slug.toLowerCase().includes(o.toLowerCase())),b=t=>t==="Draft"?{bg:"#fef3c7",text:"#d97706"}:{bg:"#dcfce7",text:"#16a34a"};return e.jsxs("div",{style:{padding:"20px 0",minHeight:"100vh"},children:[e.jsx(y,{}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"40px"},children:[e.jsxs("div",{children:[e.jsx("h1",{style:{fontSize:"1.75rem",fontWeight:700,color:"#1e293b",margin:0},children:"Pages Management"}),e.jsx("p",{style:{color:"#64748b",fontSize:"1rem",marginTop:"4px"},children:"Create and manage your website's dynamic content."})]}),e.jsx("button",{onClick:()=>c("/create-page"),className:"create-btn",children:"+ Create New Page"})]}),e.jsx("div",{style:{marginBottom:"30px"},children:e.jsx("input",{type:"text",placeholder:"Search by title or slug...",value:o,onChange:t=>x(t.target.value),className:"search-input"})}),l?e.jsx("div",{style:{textAlign:"center",padding:"100px"},children:"Loading pages..."}):e.jsx("div",{className:"pages-grid",children:p.map(t=>{const r=b(t.status);return e.jsxs("div",{className:"page-card",children:[e.jsxs("div",{style:{padding:"24px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"16px"},children:[e.jsx("span",{style:{background:r.bg,color:r.text,padding:"4px 12px",borderRadius:"100px",fontSize:"0.7rem",fontWeight:700,textTransform:"uppercase"},children:t.status||"Published"}),e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.75rem",fontFamily:"monospace"},children:new Date(t.updatedAt).toLocaleDateString()})]}),e.jsx("h3",{style:{fontSize:"1.2rem",fontWeight:700,color:"#1e293b",margin:"0 0 8px"},children:t.title}),e.jsxs("div",{style:{color:"#64748b",fontSize:"0.85rem",display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("span",{style:{opacity:.5},children:"URL:"}),e.jsxs("span",{style:{fontWeight:500},children:["/",t.slug]})]})]}),e.jsxs("div",{className:"card-actions",children:[e.jsx("button",{onClick:()=>window.open(`/page/${t.slug}`,"_blank"),className:"action-btn view",children:"View"}),e.jsx("button",{onClick:()=>c(`/edit-page/${t._id}`),className:"action-btn edit",children:"Edit"}),e.jsx("button",{onClick:()=>g(t._id),className:"action-btn delete",children:"Delete"})]})]},t._id)})}),!l&&p.length===0&&e.jsxs("div",{style:{textAlign:"center",padding:"80px",background:"#fff",borderRadius:"20px",border:"1px solid #e2e8f0"},children:[e.jsx("div",{style:{fontSize:"2.5rem",marginBottom:"16px"},children:"📄"}),e.jsx("h3",{style:{color:"#1e293b",margin:0},children:"No pages found"}),e.jsx("p",{style:{color:"#64748b",marginTop:"8px"},children:"Try a different search or create a new page."})]}),e.jsx("style",{children:`
        .pages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .page-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #eef2f6;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .page-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }
        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 12px 20px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          outline: none;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .create-btn {
          background: #1e293b;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .create-btn:hover {
          background: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .card-actions {
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid #eef2f6;
          display: flex;
          gap: 10px;
        }
        .action-btn {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .action-btn.view { background: #fff; border-color: #e2e8f0; color: #1e293b; }
        .action-btn.edit { background: #fff; border-color: #e2e8f0; color: #1e293b; }
        .action-btn.delete { background: #fff; border-color: #fee2e2; color: #ef4444; }
        .action-btn:hover { transform: translateY(-1px); background: #f1f5f9; }
        .action-btn.delete:hover { background: #fef2f2; }
      `})]})};export{S as default};
