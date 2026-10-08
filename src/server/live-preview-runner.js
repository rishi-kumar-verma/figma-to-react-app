/**
 * Live Preview Runner Server
 * Runs on http://localhost:3001
 * Serves the dynamically generated project live with real-time interactivity.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;

// Default initial state synced from real Figma document
let currentProjectState = {
  projectName: "thinkiit 2nd project",
  brandName: "thinkIIT",
  category: "EdTech Content Hierarchy & Operations",
  screens: [
    {
      id: "parent-node",
      title: "Parent node",
      subtitle: "Content hierarchy tree view with parent types, codes, and leaf lesson counts",
      badge: "CONTENT MANAGEMENT",
      type: "tree",
      columns: ["Parent Node", "Course", "Subject", "Chapter", "Topic", "Leaf Lessons", "Actions"],
      rows: [
        { "Parent Node": "11345 - /JEE/Physics/Projectile", "Course": "JEE-MAIN", "Subject": "Physics", "Chapter": "Kinematics", "Topic": "Projectile Motion", "Leaf Lessons": "8 Lessons", "Actions": "Edit / Add Child" },
        { "Parent Node": "11346 - /JEE/Chemistry/Organic", "Course": "JEE-MAIN", "Subject": "Chemistry", "Chapter": "Reaction Mechanisms", "Topic": "Electrophiles", "Leaf Lessons": "12 Lessons", "Actions": "Edit / Add Child" },
        { "Parent Node": "11347 - /NEET/Biology/Cell", "Course": "NEET", "Subject": "Biology", "Chapter": "Cell Biology", "Topic": "Mitochondria", "Leaf Lessons": "6 Lessons", "Actions": "Edit / Add Child" },
        { "Parent Node": "11348 - /JEE/Maths/Calculus", "Course": "JEE-MAIN", "Subject": "Mathematics", "Chapter": "Definite Integrals", "Topic": "By Parts", "Leaf Lessons": "10 Lessons", "Actions": "Edit / Add Child" },
      ],
    },
    {
      id: "parent-edit-mode",
      title: "Parent Edit mode",
      subtitle: "Form editor modal to update parent node title, subject code, and course mapping",
      badge: "CONTENT MANAGEMENT",
      type: "form",
      columns: ["Field", "Type", "Current Value", "Validation"],
      rows: [
        { "Field": "Parent Type", "Type": "Dropdown", "Current Value": "Chapter / Topic", "Validation": "Required" },
        { "Field": "Title", "Type": "Text", "Current Value": "Kinematics - Projectile Motion", "Validation": "Max 120 chars" },
        { "Field": "Subject Code", "Type": "Code String", "Current Value": "PHY-11-KIN-01", "Validation": "Unique Code" },
        { "Field": "Status", "Type": "Toggle", "Current Value": "Active (Published)", "Validation": "Required" },
      ],
    },
    {
      id: "leaf-node",
      title: "leaf node",
      subtitle: "Leaf curriculum node directory with DPP practice sets and question banks",
      badge: "CONTENT MANAGEMENT",
      type: "table",
      columns: ["Leaf ID", "Topic Name", "DPP Questions", "Video Lectures", "Difficulty", "Status"],
      rows: [
        { "Leaf ID": "LF-401", "Topic Name": "Horizontal Range Formula & Derivation", "DPP Questions": "25 Questions", "Video Lectures": "45 Mins", "Difficulty": "Moderate", "Status": "Active" },
        { "Leaf ID": "LF-402", "Topic Name": "Maximum Height in Projectile Motion", "DPP Questions": "30 Questions", "Video Lectures": "50 Mins", "Difficulty": "Easy", "Status": "Active" },
        { "Leaf ID": "LF-403", "Topic Name": "Trajectory Equation & Numerical Drill", "DPP Questions": "40 Questions", "Video Lectures": "65 Mins", "Difficulty": "Advanced", "Status": "Active" },
      ],
    },
    {
      id: "leaf-node-bulk-mode",
      title: "Leaf Node bulk mode",
      subtitle: "Bulk CSV curriculum node ingestion and batch hierarchy mapping",
      badge: "CONTENT MANAGEMENT",
      type: "grid",
      columns: ["Batch Column", "Target Mapping", "Validation Status", "Records Count"],
      rows: [
        { "Batch Column": "Column A: Subject", "Target Mapping": "Root Curriculum Node", "Validation Status": "100% Matched", "Records Count": "120 Rows" },
        { "Batch Column": "Column B: Chapter", "Target Mapping": "Parent Node Level 1", "Validation Status": "100% Matched", "Records Count": "120 Rows" },
        { "Batch Column": "Column C: Leaf Topic", "Target Mapping": "Leaf Node Question Bank", "Validation Status": "Valid", "Records Count": "120 Rows" },
      ],
    },
    {
      id: "user-management",
      title: "user management",
      subtitle: "Faculty, student directory, batch assignments, and account statuses",
      badge: "user management",
      type: "table",
      columns: ["Username", "Email", "Assigned Center", "Access Role", "Status"],
      rows: [
        { "Username": "Kunal Kapoor", "Email": "kunal@thinkiit.in", "Assigned Center": "thinkIIT Central", "Access Role": "Administrator", "Status": "Active" },
        { "Username": "Dr. Ramesh Sharma", "Email": "sharma.physics@thinkiit.in", "Assigned Center": "Kota Campus", "Access Role": "Head of Physics", "Status": "Active" },
        { "Username": "Priya Nair", "Email": "priya.bio@thinkiit.in", "Assigned Center": "Hyderabad Hub", "Access Role": "Senior Faculty", "Status": "Active" },
        { "Username": "Aarav Patel", "Email": "aarav.p@student.thinkiit.in", "Assigned Center": "Delhi Center", "Access Role": "Student (Rank 1)", "Status": "Active" },
      ],
    },
    {
      id: "institute-management",
      title: "institute management",
      subtitle: "Sub-domain multi-tenancy, partner center licensing, and SLA monitors",
      badge: "institute management",
      type: "table",
      columns: ["Campus Name", "Subdomain", "Seat Allocation", "License Tier", "SLA Status"],
      rows: [
        { "Campus Name": "Aryan Kota Main Campus", "Subdomain": "aryan.thinkiit.in", "Seat Allocation": "1,500 / 1,500 Seats", "License Tier": "Enterprise", "SLA Status": "99.99% Uptime" },
        { "Campus Name": "Apex Hyderabad Center", "Subdomain": "apex.thinkiit.in", "Seat Allocation": "1,880 / 2,000 Seats", "License Tier": "Enterprise", "SLA Status": "99.98% Uptime" },
        { "Campus Name": "Momentum Mumbai Hub", "Subdomain": "momentum.thinkiit.in", "Seat Allocation": "1,290 / 1,350 Seats", "License Tier": "Standard", "SLA Status": "100% Uptime" },
      ],
    },
  ],
  metrics: [
    { id: "m-1", title: "Parent Nodes", value: "348 Nodes", subtitle: "Physics, Chem, Maths Tree", trend: "+12.4%", isPositive: true },
    { id: "m-2", title: "Leaf Nodes", value: "11,345", subtitle: "Questions & DPP Modules", trend: "+8.6%", isPositive: true },
    { id: "m-3", title: "Registered Students", value: "4,850", subtitle: "Active student portal logins", trend: "+14.2%", isPositive: true },
    { id: "m-4", title: "Partner Campuses", value: "18", subtitle: "Kota, Hyderabad, Mumbai", trend: "100% SLA", isPositive: true },
  ],
  filesCount: 16,
  updatedAt: new Date().toISOString(),
};

function generateLiveAppHtml(state) {
  const stateJson = JSON.stringify(state).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${state.projectName} - Live on Port 3001</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.6); }
    .custom-scroll::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.3); border-radius: 9999px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.6); }
  </style>
</head>
<body class="bg-[#0b1120] text-slate-100 min-h-screen flex flex-col selection:bg-sky-500 selection:text-white">

  <!-- Top Port 3001 Live Indicator Bar -->
  <header class="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sticky top-0 z-50 backdrop-blur-md">
    <div class="flex items-center gap-2.5">
      <span class="flex h-2.5 w-2.5 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <span class="font-bold text-white tracking-wide">LIVE APP RUNNING ON PORT 3001</span>
      <span class="hidden sm:inline text-slate-500">•</span>
      <span class="text-sky-400 font-medium truncate max-w-xs">${state.projectName}</span>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">${state.screens.length} Screens Synced</span>
    </div>

    <div class="flex items-center gap-2">
      <a href="http://localhost:3001" target="_blank" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 border border-slate-700">
        <span>↗ Standalone Window</span>
      </a>
    </div>
  </header>

  <!-- Main View Container (Full Height, Unclipped) -->
  <main id="app-root" class="flex-1 flex flex-col w-full"></main>

  <script>
    const projectState = ${stateJson};
    let activeScreenId = projectState.screens[0]?.id || "parent-node";
    let searchQuery = "";
    let formAlert = false;

    const appRoot = document.getElementById("app-root");

    function renderDashboard() {
      const activeScreen = projectState.screens.find(s => s.id === activeScreenId) || projectState.screens[0];
      const columns = activeScreen.columns || [];
      const rows = (activeScreen.rows || []).filter(r => {
        if (!searchQuery.trim()) return true;
        return Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()));
      });

      appRoot.innerHTML = \`
        <div class="flex-1 flex flex-col md:flex-row min-h-screen bg-[#070b14] text-slate-100">
          
          <!-- Left Navigation Sidebar -->
          <aside class="w-full md:w-64 bg-[#0d1424] border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
            <div>
              <!-- Brand Header -->
              <div class="flex items-center gap-3 px-2 mb-6">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-sky-500/20">
                  \${projectState.brandName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 class="text-sm font-bold text-white tracking-tight leading-tight">\${projectState.brandName}</h2>
                  <span class="text-[10px] font-semibold text-sky-400 uppercase tracking-wider">\${projectState.category.toUpperCase()}</span>
                </div>
              </div>

              <!-- Navigation Menu -->
              <nav class="space-y-1.5">
                \${projectState.screens.map(s => \`
                  <button type="button" data-screen-id="\${s.id}" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer \${activeScreenId === s.id ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'}">
                    <span class="truncate">\${s.title}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full \${activeScreenId === s.id ? 'bg-sky-800 text-sky-200' : 'bg-slate-800 text-slate-400'}">\${s.rows ? s.rows.length : 0}</span>
                  </button>
                \`).join('')}
              </nav>
            </div>

            <!-- Sidebar Footer -->
            <div class="pt-6 border-t border-slate-800/80 mt-6 text-xs text-slate-500">
              <div class="flex items-center justify-between">
                <span>Figma Synced App</span>
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            </div>
          </aside>

          <!-- Main Stage Area (Full Height, Unclipped) -->
          <div class="flex-1 flex flex-col min-w-0 bg-[#070b14]">
            
            <!-- Dashboard Header Bar -->
            <header class="flex flex-wrap items-center justify-between gap-4 px-6 md:px-8 py-4 bg-[#0d1424]/90 border-b border-slate-800 sticky top-[45px] z-40 backdrop-blur-md">
              <div>
                <h1 class="text-lg font-bold text-white tracking-tight leading-none">\${activeScreen.title}</h1>
                <p class="text-xs text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active Screen • Figma AST Synced Architecture</span>
                </p>
              </div>

              <div class="flex items-center gap-3">
                <input type="text" id="table-search" placeholder="Filter records..." value="\${searchQuery}"
                       class="px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 w-44 sm:w-60 transition-colors"/>
                <button type="button" id="new-action-btn" class="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/30 transition-all cursor-pointer">
                  + New Record
                </button>
              </div>
            </header>

            <!-- Dashboard Content Container (Expansive Scroll) -->
            <div class="p-6 md:p-8 space-y-6 flex-1 custom-scroll overflow-y-auto">
              
              <!-- Metrics Cards Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                \${projectState.metrics.map(m => \`
                  <div class="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg">
                    <div class="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                      <span>\${m.title}</span>
                      <span class="p-1 rounded bg-sky-950 text-sky-400">❖</span>
                    </div>
                    <div class="text-2xl font-extrabold text-white tracking-tight">\${m.value}</div>
                    <div class="flex items-center gap-2 mt-2 text-xs">
                      <span class="px-1.5 py-0.5 rounded font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">\${m.trend}</span>
                      <span class="text-slate-500 text-[11px] truncate">\${m.subtitle || ''}</span>
                    </div>
                  </div>
                \`).join('')}
              </div>

              <!-- Screen Sub-Tabs -->
              <div class="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                \${projectState.screens.map(s => \`
                  <button type="button" data-screen-id="\${s.id}" class="sub-tab-btn px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer \${activeScreenId === s.id ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'}">
                    \${s.title}
                  </button>
                \`).join('')}
              </div>

              \${activeScreen.type === 'form' ? renderFormContent(activeScreen) : renderTableContent(activeScreen, columns, rows)}

            </div>
          </div>
        </div>
      \`;

      // Wire events
      document.querySelectorAll(".nav-btn, .sub-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          activeScreenId = btn.getAttribute("data-screen-id");
          renderDashboard();
        });
      });

      const searchInput = document.getElementById("table-search");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          searchQuery = e.target.value;
          renderDashboard();
          const fresh = document.getElementById("table-search");
          if (fresh) {
            fresh.focus();
            fresh.setSelectionRange(searchQuery.length, searchQuery.length);
          }
        });
      }

      const actionBtn = document.getElementById("new-action-btn");
      if (actionBtn) {
        actionBtn.addEventListener("click", () => {
          alert("Add Record modal activated for: " + activeScreen.title);
        });
      }

      const formEl = document.getElementById("screen-form");
      if (formEl) {
        formEl.addEventListener("submit", (e) => {
          e.preventDefault();
          formAlert = true;
          renderDashboard();
          setTimeout(() => { formAlert = false; renderDashboard(); }, 3000);
        });
      }
    }

    function renderFormContent(screen) {
      return \`
        <div class="rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl p-6 space-y-5">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-950 text-amber-300 border border-amber-800">
                \${screen.badge || 'Form Mode'}
              </span>
              <h3 class="text-sm font-bold text-white mt-1">\${screen.title} Configuration</h3>
              <p class="text-xs text-slate-400">\${screen.subtitle || 'Direct form field editing'}</p>
            </div>
          </div>

          \${formAlert ? \`
            <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-300 font-semibold flex items-center gap-2">
              <span>✓ Form values saved and synced with live preview AST.</span>
            </div>
          \` : ''}

          <form id="screen-form" class="space-y-4">
            \${(screen.rows || []).map((row, idx) => \`
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800/60 last:border-b-0">
                <div>
                  <label class="block text-xs font-bold text-slate-300 uppercase mb-1">
                    \${row.Field || row.Name || Object.keys(row)[0] || ('Field ' + (idx + 1))}
                  </label>
                  <input type="text" value="\${row['Current Value'] || row.Value || Object.values(row)[0] || ''}"
                         class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 transition-colors"/>
                </div>
                <div>
                  <span class="block text-xs font-semibold text-slate-500 mb-1">Type & Validation</span>
                  <div class="text-xs text-slate-400 py-2">
                    Type: \${row.Type || 'Text'} • Validation: \${row.Validation || 'Required'}
                  </div>
                </div>
              </div>
            \`).join('')}

            <div class="flex justify-end pt-2">
              <button type="submit" class="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/30 transition-all cursor-pointer">
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      \`;
    }

    function renderTableContent(screen, columns, rows) {
      return \`
        <div class="rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden mb-12">
          <div class="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h3 class="text-sm font-bold text-white tracking-tight uppercase">\${screen.title} (\${rows.length})</h3>
              <p class="text-xs text-slate-400 mt-0.5">\${screen.subtitle || 'Synthesized from Figma AST records'}</p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
              \${screen.badge || 'Live View'}
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 bg-slate-950/60 uppercase text-[10px] tracking-wider">
                  \${columns.map(col => \`<th class="py-3 px-4 font-semibold">\${col}</th>\`).join('')}
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 text-slate-200">
                \${rows.length === 0 ? \`
                  <tr>
                    <td colspan="\${columns.length + 1}" class="py-8 text-center text-slate-500">
                      No records matching query "\${searchQuery}"
                    </td>
                  </tr>
                \` : rows.map((r, i) => \`
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    \${columns.map(col => {
                      const val = r[col] || "—";
                      const isStatus = col.toLowerCase().includes("status");
                      if (isStatus) {
                        const isActive = String(val).toLowerCase().includes("active");
                        return \`
                          <td class="py-3.5 px-4">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase \${isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}">
                              \${val}
                            </span>
                          </td>
                        \`;
                      }
                      return \`<td class="py-3.5 px-4 \${col === columns[0] ? 'font-bold text-white' : 'text-slate-300'}">\${val}</td>\`;
                    }).join('')}
                    <td class="py-3.5 px-4 text-right">
                      <button class="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer">
                        Edit
                      </button>
                    </td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>

          <!-- Table Footer -->
          <div class="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 bg-slate-950/40">
            <span>Showing \${rows.length} of \${screen.rows ? screen.rows.length : rows.length} entities</span>
            <div class="flex items-center gap-1.5">
              <button class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">Previous</button>
              <button class="px-2.5 py-1 rounded bg-sky-600 text-white font-bold">1</button>
              <button class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">Next</button>
            </div>
          </div>
        </div>
      \`;
    }

    renderDashboard();
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
  } else if (req.url === "/health" || req.url?.startsWith("/health")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "running",
        port: PORT,
        projectName: currentProjectState.projectName,
        brandName: currentProjectState.brandName,
        screensCount: currentProjectState.screens.length,
        timestamp: Date.now(),
      })
    );
  } else if (req.url === "/update" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        if (payload.projectName) currentProjectState.projectName = payload.projectName;
        if (payload.brandName) currentProjectState.brandName = payload.brandName;
        if (payload.category) currentProjectState.category = payload.category;
        if (payload.screens && Array.isArray(payload.screens)) currentProjectState.screens = payload.screens;
        if (payload.metrics && Array.isArray(payload.metrics)) currentProjectState.metrics = payload.metrics;
        currentProjectState.updatedAt = new Date().toISOString();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Project state updated", port: PORT }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (req.url === "/api/project" || req.url?.startsWith("/api/project")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(currentProjectState));
  } else {
    // Serve full HTML
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(generateLiveAppHtml(currentProjectState));
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[LiveRunner] 🚀 Server running at http://localhost:${PORT}`);
  console.log(`[LiveRunner] Serving live generated project: "${currentProjectState.projectName}"`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.warn(`[LiveRunner] Port ${PORT} already in use. Live server is active.`);
  } else {
    console.error("[LiveRunner Error]", err);
  }
});
