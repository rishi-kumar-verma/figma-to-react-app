/**
 * Live Preview Runner Server
 * Runs on http://localhost:3001
 * Serves the dynamically generated project live with real-time interactivity.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;

// Default initial state for ThinkIIT project
let currentProjectState = {
  projectName: "ThinkIIT Learning & Operations Platform",
  brandName: "ThinkIIT",
  category: "edtech",
  screens: [
    {
      id: "batches",
      title: "Batch Management",
      subtitle: "Live academic cohorts, JEE/NEET test assignments and validity",
      badge: "Cohorts",
      columns: ["Batch Name", "Class", "Target Test", "Academic Year", "Valid Upto", "Status"],
      rows: [
        { "Batch Name": "Alpha JEE Advanced 2026", "Class": "12th Standard", "Target Test": "JEE Advanced", "Academic Year": "2025-2026", "Valid Upto": "30 Jun 2026", "Status": "Active" },
        { "Batch Name": "Bravo NEET Champions", "Class": "11th Standard", "Target Test": "NEET UG", "Academic Year": "2025-2026", "Valid Upto": "31 Jul 2026", "Status": "Active" },
        { "Batch Name": "Foundation Olympiad X", "Class": "10th Standard", "Target Test": "NTSE / Olympiad", "Academic Year": "2024-2025", "Valid Upto": "31 Mar 2025", "Status": "Completed" },
        { "Batch Name": "Weekend Crash Revision", "Class": "12th Pass", "Target Test": "JEE Main", "Academic Year": "2024-2025", "Valid Upto": "15 Apr 2025", "Status": "Active" },
      ],
    },
    {
      id: "users",
      title: "User Management",
      subtitle: "Student & faculty directory with access roles and batch assignments",
      badge: "Access Control",
      columns: ["Username", "Email", "Assigned Batch", "Access Role", "Status"],
      rows: [
        { "Username": "Aarav Sharma", "Email": "aarav.sharma@thinkiit.org", "Assigned Batch": "Alpha JEE 2026", "Access Role": "Student", "Status": "Active" },
        { "Username": "Priya Verma", "Email": "priya.verma@thinkiit.org", "Assigned Batch": "Bravo NEET", "Access Role": "Student", "Status": "Active" },
        { "Username": "Dr. S. K. Gupta", "Email": "skgupta@thinkiit.org", "Assigned Batch": "Physics Lead", "Access Role": "Faculty Head", "Status": "Active" },
        { "Username": "Rohan Mehra", "Email": "rohan.m@thinkiit.org", "Assigned Batch": "Foundation X", "Access Role": "Student", "Status": "Pending" },
      ],
    },
    {
      id: "content",
      title: "Content & Curriculum Hierarchy",
      subtitle: "Syllabus nodes, chapters, and question banks",
      badge: "Curriculum",
      columns: ["Parent Node", "Course", "Subject", "Chapter", "Topic", "Leaf Lessons"],
      rows: [
        { "Parent Node": "JEE Core", "Course": "Senior Secondary", "Subject": "Physics", "Chapter": "Electrodynamics", "Topic": "Gauss Law", "Leaf Lessons": "14 modules" },
        { "Parent Node": "JEE Core", "Course": "Senior Secondary", "Subject": "Mathematics", "Chapter": "Integral Calculus", "Topic": "Definite Integrals", "Leaf Lessons": "22 modules" },
        { "Parent Node": "NEET Core", "Course": "Senior Secondary", "Subject": "Biology", "Chapter": "Genetics & Evolution", "Topic": "Mendelian Principles", "Leaf Lessons": "18 modules" },
        { "Parent Node": "Foundation", "Course": "Secondary", "Subject": "Chemistry", "Chapter": "Periodic Properties", "Topic": "Atomic Radii", "Leaf Lessons": "8 modules" },
      ],
    },
    {
      id: "institutes",
      title: "Institute License Management",
      subtitle: "Multi-tenant institutional licensing & limits",
      badge: "Licensing",
      columns: ["Institute Name", "Domain", "License Key", "Max Admins", "Status"],
      rows: [
        { "Institute Name": "Apex Scholars Academy", "Domain": "apex.thinkiit.org", "License Key": "LIC-APX-8921-X", "Max Admins": "25 Admins", "Status": "Active" },
        { "Institute Name": "Zenith Science Campus", "Domain": "zenith.thinkiit.org", "License Key": "LIC-ZEN-4412-B", "Max Admins": "50 Admins", "Status": "Active" },
        { "Institute Name": "Pinnacle EduTech Center", "Domain": "pinnacle.thinkiit.org", "License Key": "LIC-PIN-1109-A", "Max Admins": "10 Admins", "Status": "Renewal Needed" },
      ],
    },
  ],
  metrics: [
    { id: "m-1", title: "Active Batches", value: "24 Batches", subtitle: "Class XII, JEE-MAIN...", trend: "+4 cohorts", isPositive: true },
    { id: "m-2", title: "Curriculum Nodes", value: "11,345", subtitle: "Physics, Chem, Maths DPP", trend: "+12.4%", isPositive: true },
    { id: "m-3", title: "Registered Students", value: "4,850", subtitle: "Active student portal logins", trend: "+18.2%", isPositive: true },
    { id: "m-4", title: "Partner Institutes", value: "18", subtitle: "aryan.ThinkIIT.in active", trend: "100% SLA", isPositive: true },
  ],
  isThinkIIT: true,
  filesCount: 15,
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
    </div>

    <div class="flex items-center gap-2">
      <button id="view-toggle-btn" class="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-sm">
        <span id="view-toggle-text">🔐 View Login Portal</span>
      </button>
      <a href="http://localhost:3001" target="_blank" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 border border-slate-700">
        <span>↗ Standalone Window</span>
      </a>
    </div>
  </header>

  <!-- Main View Container (Full Height, Unclipped) -->
  <main id="app-root" class="flex-1 flex flex-col w-full"></main>

  <script>
    const projectState = ${stateJson};
    let currentView = projectState.isThinkIIT ? "dashboard" : "dashboard";
    let activeScreenId = projectState.screens[0]?.id || "batches";
    let searchQuery = "";
    let role = "institute";

    const appRoot = document.getElementById("app-root");
    const viewToggleBtn = document.getElementById("view-toggle-btn");
    const viewToggleText = document.getElementById("view-toggle-text");

    function renderLoginPortal() {
      appRoot.innerHTML = \`
        <div class="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden"
             style="background: linear-gradient(135deg, #1ba3fc 0%, #2563eb 40%, #6366f1 70%, #581c87 100%); min-height: calc(100vh - 45px);">
          
          <div class="w-full max-w-[850px] bg-white rounded-[28px] shadow-2xl p-8 md:p-12 border border-white/20 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10 animate-fade-in text-slate-900">
            
            <!-- Left Brand Column -->
            <div class="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-4">
              <!-- ThinkIIT Authentic Logo SVG -->
              <div class="w-28 h-28 mb-4 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                  <!-- Foundation Book -->
                  <path d="M 22 75 Q 50 68 78 75 L 78 82 Q 50 75 22 82 Z" fill="#0096c7" />
                  <!-- Golden Lightbulb Outline -->
                  <path d="M 32 46 C 32 36 40 28 50 28 C 60 28 68 36 68 46 C 68 53 64 59 60 63 L 40 63 C 36 59 32 53 32 46 Z" fill="#facc15" stroke="#eab308" stroke-width="2"/>
                  <!-- Graduation Cap (Mortarboard) -->
                  <polygon points="50,33 65,39 50,45 35,39" fill="#1e293b" />
                  <!-- Radiating Rays -->
                  <line x1="50" y1="18" x2="50" y2="24" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
                  <line x1="28" y1="26" x2="33" y2="30" stroke="#0096c7" stroke-width="3" stroke-linecap="round"/>
                  <line x1="72" y1="26" x2="67" y2="30" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
                </svg>
              </div>

              <!-- Brand Name -->
              <div class="text-3xl font-extrabold tracking-tight">
                <span class="text-[#0096c7]">think</span><span class="text-[#f97316]">IIT</span>
              </div>
              <p class="text-xs text-slate-500 font-medium mt-1">Smart Learning & Institute Operations</p>
            </div>

            <!-- Vertical Divider -->
            <div class="hidden md:block w-px bg-slate-200 self-stretch my-2"></div>

            <!-- Right Form Column -->
            <div class="w-full md:w-1/2 flex flex-col space-y-5">
              <!-- Segmented Role Selector -->
              <div class="flex items-center justify-center gap-3">
                <button type="button" id="role-inst" class="px-5 py-2 rounded-full text-xs font-bold transition-all \${role === 'institute' ? 'bg-[#0096c7] text-white shadow-md' : 'bg-slate-100 text-slate-600 border border-slate-200'}">
                  Institute
                </button>
                <button type="button" id="role-stud" class="px-5 py-2 rounded-full text-xs font-bold transition-all \${role === 'student' ? 'bg-[#0096c7] text-white shadow-md' : 'bg-slate-100 text-slate-600 border border-slate-200'}">
                  Student
                </button>
              </div>

              <!-- Inputs with Underline Style -->
              <form id="login-form" class="space-y-4 pt-2">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Email ID</label>
                  <input type="email" required placeholder="admin@thinkiit.org" value="admin@thinkiit.org"
                         class="w-full px-2 py-2 border-b-2 border-slate-300 focus:border-[#0096c7] focus:outline-none text-sm transition-colors bg-transparent"/>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                  <input type="password" required placeholder="••••••••••••" value="••••••••••••"
                         class="w-full px-2 py-2 border-b-2 border-slate-300 focus:border-[#0096c7] focus:outline-none text-sm transition-colors bg-transparent"/>
                </div>

                <div class="flex justify-end">
                  <a href="#" class="text-xs text-slate-500 hover:text-[#0096c7] transition-colors">Forget Password?</a>
                </div>

                <button type="submit" class="w-full py-3 rounded-full text-white font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30 transition-all cursor-pointer">
                  Login to Dashboard
                </button>
              </form>

              <!-- Quick Login By -->
              <div class="pt-2 text-center">
                <span class="text-[11px] text-slate-400">Quick Login By</span>
                <div class="mt-2 flex justify-center">
                  <button type="button" id="google-login-btn" class="px-6 py-2 rounded-full text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm cursor-pointer">
                    Google
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      \`;

      document.getElementById("role-inst").addEventListener("click", () => { role = "institute"; renderLoginPortal(); });
      document.getElementById("role-stud").addEventListener("click", () => { role = "student"; renderLoginPortal(); });
      document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        currentView = "dashboard";
        renderApp();
      });
      document.getElementById("google-login-btn").addEventListener("click", () => {
        currentView = "dashboard";
        renderApp();
      });
    }

    function renderDashboard() {
      const activeScreen = projectState.screens.find(s => s.id === activeScreenId) || projectState.screens[0];
      const columns = activeScreen.columns || [];
      const rows = (activeScreen.rows || []).filter(r => {
        if (!searchQuery.trim()) return true;
        return Object.values(r).some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
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
                  <span class="text-[10px] font-semibold text-sky-400 uppercase tracking-wider">\${projectState.category.toUpperCase()} OPERATIONS</span>
                </div>
              </div>

              <!-- Navigation Menu -->
              <nav class="space-y-1.5">
                \${projectState.screens.map(s => \`
                  <button type="button" data-screen-id="\${s.id}" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer \${activeScreenId === s.id ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'}">
                    <span>\${s.title}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full \${activeScreenId === s.id ? 'bg-sky-800 text-sky-200' : 'bg-slate-800 text-slate-400'}">\${s.rows ? s.rows.length : 4}</span>
                  </button>
                \`).join('')}
              </nav>
            </div>

            <!-- Sidebar Footer -->
            <div class="pt-6 border-t border-slate-800/80 mt-6 text-xs text-slate-500">
              <div class="flex items-center justify-between">
                <span>Tenant: aryan.thinkiit.org</span>
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            </div>
          </aside>

          <!-- Main Stage Area (Full Height, Unclipped) -->
          <div class="flex-1 flex flex-col min-w-0 bg-[#070b14]">
            
            <!-- Dashboard Header Bar -->
            <header class="flex flex-wrap items-center justify-between gap-4 px-6 md:px-8 py-4 bg-[#0d1424]/90 border-b border-slate-800 sticky top-[45px] z-40 backdrop-blur-md">
              <div>
                <h1 class="text-lg font-bold text-white tracking-tight leading-none">\${projectState.brandName}</h1>
                <p class="text-xs text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active Session • Figma Synthesized Architecture</span>
                </p>
              </div>

              <div class="flex items-center gap-3">
                <input type="text" id="table-search" placeholder="Filter records..." value="\${searchQuery}"
                       class="px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 w-44 sm:w-60 transition-colors"/>
                <button type="button" id="new-action-btn" class="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/30 transition-all cursor-pointer">
                  + New Action
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

              <!-- Complete Data Table (Unclipped, Full Height) -->
              <div class="rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden mb-12">
                <div class="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h3 class="text-sm font-bold text-white tracking-tight uppercase">\${activeScreen.title} (\${rows.length})</h3>
                    <p class="text-xs text-slate-400 mt-0.5">\${activeScreen.subtitle || 'Synthesized from Figma AST auto-layout records'}</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
                    Live Feed
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
                              const isActive = val.toLowerCase().includes("active");
                              return \`
                                <td class="py-3.5 px-4">
                                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase \${isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}">
                                    \${val}
                                  </span>
                                </td>
                              \`;
                            }
                            return \`<td class="py-3.5 px-4">\${val}</td>\`;
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

                <!-- Complete Table Footer -->
                <div class="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 bg-slate-950/40">
                  <span>Showing \${rows.length} of \${activeScreen.rows ? activeScreen.rows.length : rows.length} entities</span>
                  <div class="flex items-center gap-1.5">
                    <button class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">Previous</button>
                    <button class="px-2.5 py-1 rounded bg-sky-600 text-white font-bold">1</button>
                    <button class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">Next</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      \`;

      // Wire events
      document.querySelectorAll(".nav-btn, .sub-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
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
          alert(\`Created new \${activeScreen.title} record!\`);
        });
      }
    }

    function renderApp() {
      if (currentView === "login") {
        viewToggleText.innerText = "📊 View Operations Dashboard";
        renderLoginPortal();
      } else {
        viewToggleText.innerText = "🔐 View Login Portal";
        renderDashboard();
      }
    }

    viewToggleBtn.addEventListener("click", () => {
      currentView = currentView === "login" ? "dashboard" : "login";
      renderApp();
    });

    renderApp();
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
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost:3001"}`);

  // Health endpoint
  if (url.pathname === "/health") {
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
    return;
  }

  // Update endpoint to receive new project data from generator
  if (url.pathname === "/update" && req.method === "POST") {
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
        if (payload.isThinkIIT !== undefined) currentProjectState.isThinkIIT = payload.isThinkIIT;
        currentProjectState.updatedAt = new Date().toISOString();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Project state updated", port: PORT }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API Project State
  if (url.pathname === "/api/project") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(currentProjectState));
    return;
  }

  // Serve full HTML
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(generateLiveAppHtml(currentProjectState));
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
