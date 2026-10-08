import { FigmaNode, ExtractedFigmaDesign, DevScreenAsset, DevIconAsset } from "../../types";

export const thinkiitLoginPreset: FigmaNode = {
  id: "0:0",
  name: "thinkiit 2nd project",
  type: "DOCUMENT",
  children: [
    // Page 1: Style Guide
    {
      id: "0:1",
      name: "Style Guide",
      type: "CANVAS",
      children: [
        {
          id: "10:1",
          name: "Design System & Color Tokens",
          type: "FRAME",
          layoutMode: "HORIZONTAL",
          itemSpacing: 20,
          paddingLeft: 32,
          paddingRight: 32,
          paddingTop: 32,
          paddingBottom: 32,
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 900 },
          fills: [{ type: "SOLID", color: { r: 0.98, g: 0.99, b: 1, a: 1 } }],
          children: [
            {
              id: "11:1",
              name: "Primary Cyan Gradient (#1ba3fc -> #6366f1)",
              type: "VECTOR",
              fills: [{ type: "GRADIENT_LINEAR", color: { r: 0.1, g: 0.6, b: 0.98, a: 1 } }],
            },
            {
              id: "11:2",
              name: "thinkIIT Brand Typography",
              type: "TEXT",
              characters: "thinkIIT Learning Platform Design System",
              style: { fontFamily: "Inter", fontWeight: 700, fontSize: 32 },
              fills: [{ type: "SOLID", color: { r: 0.05, g: 0.1, b: 0.2, a: 1 } }],
            },
          ],
        },
      ],
    },

    // Page 2: login page
    {
      id: "0:2",
      name: "login page",
      type: "CANVAS",
      children: [
        {
          id: "1:2",
          name: "ThinkIIT Login Portal Screen",
          type: "FRAME",
          layoutMode: "HORIZONTAL",
          primaryAxisAlignItems: "CENTER",
          counterAxisAlignItems: "CENTER",
          paddingLeft: 48,
          paddingRight: 48,
          paddingTop: 48,
          paddingBottom: 48,
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 900 },
          fills: [{ type: "GRADIENT_LINEAR", color: { r: 0.1, g: 0.6, b: 0.98, a: 1 } }],
          children: [
            {
              id: "2:10",
              name: "Center Auth Card",
              type: "FRAME",
              layoutMode: "HORIZONTAL",
              itemSpacing: 36,
              paddingLeft: 48,
              paddingRight: 48,
              paddingTop: 48,
              paddingBottom: 48,
              cornerRadius: 28,
              fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 1 } }],
              absoluteBoundingBox: { x: 295, y: 190, width: 850, height: 520 },
              children: [
                {
                  id: "3:20",
                  name: "Brand Logo Column",
                  type: "FRAME",
                  layoutMode: "VERTICAL",
                  primaryAxisAlignItems: "CENTER",
                  counterAxisAlignItems: "CENTER",
                  itemSpacing: 20,
                  children: [
                    {
                      id: "4:30",
                      name: "ThinkIIT Lightbulb & Cap Icon",
                      type: "VECTOR",
                      fills: [{ type: "SOLID", color: { r: 0.98, g: 0.75, b: 0.15, a: 1 } }],
                    },
                    {
                      id: "4:31",
                      name: "thinkIIT Brand Typography",
                      type: "TEXT",
                      characters: "thinkIIT",
                      style: { fontFamily: "Inter", fontWeight: 700, fontSize: 38 },
                      fills: [{ type: "SOLID", color: { r: 0, g: 0.6, b: 0.78, a: 1 } }],
                    },
                  ],
                },
                {
                  id: "3:22",
                  name: "Login Form Column",
                  type: "FRAME",
                  layoutMode: "VERTICAL",
                  itemSpacing: 18,
                  children: [
                    {
                      id: "4:40",
                      name: "Form Heading Login As",
                      type: "TEXT",
                      characters: "Login As",
                      style: { fontFamily: "Inter", fontWeight: 500, fontSize: 20 },
                    },
                    {
                      id: "4:41",
                      name: "Role Selector: Institute vs Student",
                      type: "FRAME",
                      layoutMode: "HORIZONTAL",
                      itemSpacing: 12,
                      children: [
                        { id: "5:50", name: "Institute Active Pill", type: "FRAME", cornerRadius: 999 },
                        { id: "5:51", name: "Student Inactive Pill", type: "FRAME", cornerRadius: 999 },
                      ],
                    },
                    {
                      id: "4:42",
                      name: "Email ID Input Frame",
                      type: "FRAME",
                      children: [{ id: "5:52", name: "Email ID", type: "TEXT", characters: "Email ID" }],
                    },
                    {
                      id: "4:43",
                      name: "Password Input Frame",
                      type: "FRAME",
                      children: [{ id: "5:54", name: "Password", type: "TEXT", characters: "Password" }],
                    },
                    {
                      id: "4:44",
                      name: "Primary Login Pill Button",
                      type: "FRAME",
                      cornerRadius: 999,
                      children: [{ id: "5:56", name: "Login", type: "TEXT", characters: "Login" }],
                    },
                    {
                      id: "4:47",
                      name: "Quick Login By Google",
                      type: "FRAME",
                      children: [{ id: "5:59", name: "Google", type: "TEXT", characters: "Google" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // Page 3: dashboard home
    {
      id: "0:3",
      name: "dashboard home",
      type: "CANVAS",
      children: [
        {
          id: "30:1",
          name: "Dashboard Home Viewport",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 24,
          paddingLeft: 32,
          paddingRight: 32,
          paddingTop: 32,
          paddingBottom: 48,
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 1024 },
          fills: [{ type: "SOLID", color: { r: 0.97, g: 0.98, b: 0.99, a: 1 } }],
          children: [
            {
              id: "31:1",
              name: "Welcome Header & Stats Row",
              type: "FRAME",
              layoutMode: "HORIZONTAL",
              children: [
                { id: "32:1", name: "Greeting", type: "TEXT", characters: "Welcome, Administrator", style: { fontSize: 24, fontWeight: 700 } },
              ],
            },
            {
              id: "31:2",
              name: "Operations KPI Grid",
              type: "FRAME",
              layoutMode: "HORIZONTAL",
              itemSpacing: 16,
              children: [
                { id: "32:10", name: "KPI: Active Batches (24)", type: "FRAME", cornerRadius: 16 },
                { id: "32:11", name: "KPI: Total Students (4,850)", type: "FRAME", cornerRadius: 16 },
                { id: "32:12", name: "KPI: Curriculum Nodes (11,345)", type: "FRAME", cornerRadius: 16 },
                { id: "32:13", name: "KPI: Partner Campuses (18)", type: "FRAME", cornerRadius: 16 },
              ],
            },
          ],
        },
      ],
    },

    // Page 4: user management
    {
      id: "0:4",
      name: "user management",
      type: "CANVAS",
      children: [
        {
          id: "40:1",
          name: "User Management Viewport",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 24,
          paddingLeft: 32,
          paddingRight: 32,
          paddingTop: 32,
          paddingBottom: 48,
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 1024 },
          fills: [{ type: "SOLID", color: { r: 0.97, g: 0.98, b: 0.99, a: 1 } }],
          children: [
            {
              id: "41:1",
              name: "User Directory Heading & Roster Filter",
              type: "FRAME",
              layoutMode: "HORIZONTAL",
              children: [
                { id: "42:1", name: "Title", type: "TEXT", characters: "User Management Directory", style: { fontSize: 24, fontWeight: 700 } },
              ],
            },
            {
              id: "41:2",
              name: "User Profiles Roster Table",
              type: "FRAME",
              layoutMode: "VERTICAL",
              itemSpacing: 12,
              children: [
                { id: "42:10", name: "Row: Kunal Kapoor (Admin)", type: "FRAME", cornerRadius: 12 },
                { id: "42:11", name: "Row: Dr. Ramesh Sharma (Physics HOD)", type: "FRAME", cornerRadius: 12 },
                { id: "42:12", name: "Row: Priya Nair (Senior Faculty)", type: "FRAME", cornerRadius: 12 },
                { id: "42:13", name: "Row: Aarav Patel (Student)", type: "FRAME", cornerRadius: 12 },
              ],
            },
          ],
        },
      ],
    },

    // Page 5: CONTENT MANAGEMENT (Exact 8 frames from user screenshot)
    {
      id: "0:5",
      name: "CONTENT MANAGEMENT",
      type: "CANVAS",
      children: [
        // Frame 1: Parent node
        {
          id: "50:1",
          name: "Parent node",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 16,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 24,
          paddingBottom: 24,
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 900 },
          children: [
            { id: "51:1", name: "Header: Content Hierarchy", type: "TEXT", characters: "Content Hierarchy (Parent Nodes)", style: { fontSize: 20, fontWeight: 700 } },
            { id: "51:2", name: "Parent Node Table: Physics / Chemistry / Maths", type: "FRAME", cornerRadius: 12 },
          ],
        },
        // Frame 2: Parent Edit mode
        {
          id: "50:2",
          name: "Parent Edit mode",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 14,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 20,
          cornerRadius: 16,
          fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 1 } }],
          children: [
            { id: "51:10", name: "Edit Parent Title", type: "TEXT", characters: "Edit Parent Node", style: { fontSize: 18, fontWeight: 600 } },
            { id: "51:11", name: "Parent Type Input", type: "FRAME" },
            { id: "51:12", name: "Save Changes Button", type: "FRAME", cornerRadius: 8 },
          ],
        },
        // Frame 3: Parent add new parent type
        {
          id: "50:3",
          name: "Parent add new parent type",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 14,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 20,
          cornerRadius: 16,
          fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 1 } }],
          children: [
            { id: "51:20", name: "Modal Title: Add New Parent Type", type: "TEXT", characters: "Create New Parent Node", style: { fontSize: 18, fontWeight: 600 } },
            { id: "51:21", name: "Type Form Field", type: "FRAME" },
            { id: "51:22", name: "Submit Button", type: "FRAME", cornerRadius: 8 },
          ],
        },
        // Frame 4: Parent delete alert
        {
          id: "50:4",
          name: "Parent delete alert",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 12,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 24,
          paddingBottom: 24,
          cornerRadius: 16,
          fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 1 } }],
          children: [
            { id: "51:30", name: "Alert Icon", type: "VECTOR", fills: [{ type: "SOLID", color: { r: 0.9, g: 0.2, b: 0.2, a: 1 } }] },
            { id: "51:31", name: "Delete Confirmation Title", type: "TEXT", characters: "Delete Parent Node?", style: { fontSize: 16, fontWeight: 700 } },
            { id: "51:32", name: "Warning Message", type: "TEXT", characters: "Are you sure you want to delete this parent node? All connected leaf nodes will be removed." },
            { id: "51:33", name: "Confirm Delete Button", type: "FRAME", cornerRadius: 8, fills: [{ type: "SOLID", color: { r: 0.85, g: 0.15, b: 0.15, a: 1 } }] },
          ],
        },
        // Frame 5: Parent save alert
        {
          id: "50:5",
          name: "Parent save alert",
          type: "FRAME",
          layoutMode: "HORIZONTAL",
          itemSpacing: 10,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 12,
          paddingBottom: 12,
          cornerRadius: 12,
          fills: [{ type: "SOLID", color: { r: 0.9, g: 0.98, b: 0.92, a: 1 } }],
          children: [
            { id: "51:40", name: "Success Check Icon", type: "VECTOR", fills: [{ type: "SOLID", color: { r: 0.1, g: 0.7, b: 0.3, a: 1 } }] },
            { id: "51:41", name: "Success Text", type: "TEXT", characters: "Parent node successfully updated and synchronized.", style: { fontSize: 13, fontWeight: 500 } },
          ],
        },
        // Frame 6: leaf node
        {
          id: "50:6",
          name: "leaf node",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 16,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 24,
          paddingBottom: 24,
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 900 },
          children: [
            { id: "51:50", name: "Leaf Nodes Directory Table", type: "FRAME", cornerRadius: 12 },
            { id: "51:51", name: "DPP Practice Questions & Topics", type: "TEXT", characters: "Leaf Node Topics & DPP Sets", style: { fontSize: 20, fontWeight: 700 } },
          ],
        },
        // Frame 7: Leaf Node Edit mode
        {
          id: "50:7",
          name: "Leaf Node Edit mode",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 14,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 20,
          cornerRadius: 16,
          fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 1 } }],
          children: [
            { id: "51:60", name: "Edit Leaf Title", type: "TEXT", characters: "Edit Curriculum Leaf Node", style: { fontSize: 18, fontWeight: 600 } },
            { id: "51:61", name: "Subtopic & DPP Selector", type: "FRAME" },
          ],
        },
        // Frame 8: Leaf Node bulk mode
        {
          id: "50:8",
          name: "Leaf Node bulk mode",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 16,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 24,
          paddingBottom: 24,
          cornerRadius: 16,
          fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 1 } }],
          children: [
            { id: "51:70", name: "Bulk Upload Header", type: "TEXT", characters: "Bulk Upload & Map Curriculum Nodes", style: { fontSize: 20, fontWeight: 700 } },
            { id: "51:71", name: "CSV Drag & Drop Zone", type: "FRAME", cornerRadius: 12 },
            { id: "51:72", name: "Batch Mapping Table", type: "FRAME" },
          ],
        },
      ],
    },

    // Page 6: institute management
    {
      id: "0:6",
      name: "institute management",
      type: "CANVAS",
      children: [
        {
          id: "60:1",
          name: "Institute Operations Viewport",
          type: "FRAME",
          layoutMode: "VERTICAL",
          itemSpacing: 24,
          paddingLeft: 32,
          paddingRight: 32,
          paddingTop: 32,
          paddingBottom: 48,
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 1024 },
          fills: [{ type: "SOLID", color: { r: 0.97, g: 0.98, b: 0.99, a: 1 } }],
          children: [
            {
              id: "61:1",
              name: "Campus Multi-Tenant License Quota Matrix",
              type: "FRAME",
              layoutMode: "VERTICAL",
              itemSpacing: 16,
              children: [
                { id: "62:1", name: "Campus: Aryan Kota Center (1,500 seats)", type: "FRAME", cornerRadius: 16 },
                { id: "62:2", name: "Campus: Apex Hyderabad Hub (2,000 seats)", type: "FRAME", cornerRadius: 16 },
                { id: "62:3", name: "Campus: Momentum Mumbai Campus (1,350 seats)", type: "FRAME", cornerRadius: 16 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const thinkiitExtractedDesign: ExtractedFigmaDesign = {
  brandName: "thinkIIT",
  adminUser: "Institute Administrator",
  category: "EdTech Content Hierarchy & Operations",
  colors: [
    "#1ba3fc", // Cyan gradient start
    "#6366f1", // Purple gradient end
    "#ffffff", // Card white
    "#0096c7", // Think cyan
    "#f97316", // IIT orange
    "#334155", // Charcoal text
    "#cbd5e1", // Underline border
    "#c5221f", // Google red
    "#22c55e", // Lightbulb ray green
    "#fbbf24", // Lightbulb gold
  ],
  navItems: [
    { id: "style-guide", label: "Style Guide", icon: "Palette" },
    { id: "login-page", label: "login page", icon: "Lock" },
    { id: "dashboard-home", label: "dashboard home", icon: "Activity" },
    { id: "user-management", label: "user management", count: 4850, icon: "Users" },
    { id: "content-management", label: "CONTENT MANAGEMENT", count: 8, icon: "FileText" },
    { id: "institute-management", label: "institute management", count: 18, icon: "Building" },
  ],
  metrics: [
    { id: "m-1", title: "Parent Nodes", value: "348 Nodes", subtitle: "Physics, Chem, Maths Tree", trend: "+12.4%", isPositive: true },
    { id: "m-2", title: "Leaf Nodes", value: "11,345", subtitle: "Questions & DPP Modules", trend: "+8.6%", isPositive: true },
    { id: "m-3", title: "Registered Students", value: "4,850", subtitle: "Active student portal logins", trend: "+14.2%", isPositive: true },
    { id: "m-4", title: "Partner Campuses", value: "18", subtitle: "Kota, Hyderabad, Mumbai", trend: "100% SLA", isPositive: true },
  ],
  screens: [
    {
      id: "parent-node",
      title: "Parent node",
      subtitle: "Content hierarchy tree view with parent types, codes, and leaf lesson counts",
      badge: "CONTENT MANAGEMENT",
      type: "tree",
      columns: ["Parent Node", "Course", "Subject", "Chapter", "Topic", "Leaf Lessons", "Actions"],
      rows: [
        { "Parent Node": "11345 - /JEE/Physics/Projectile", Course: "JEE-MAIN", Subject: "Physics", Chapter: "Kinematics", Topic: "Projectile Motion", "Leaf Lessons": "8 Lessons", Actions: "Edit / Add Child" },
        { "Parent Node": "11346 - /JEE/Chemistry/Organic", Course: "JEE-MAIN", Subject: "Chemistry", Chapter: "Reaction Mechanisms", Topic: "Electrophiles", "Leaf Lessons": "12 Lessons", Actions: "Edit / Add Child" },
        { "Parent Node": "11347 - /NEET/Biology/Cell", Course: "NEET", Subject: "Biology", Chapter: "Cell Biology", Topic: "Mitochondria", "Leaf Lessons": "6 Lessons", Actions: "Edit / Add Child" },
        { "Parent Node": "11348 - /JEE/Maths/Calculus", Course: "JEE-MAIN", Subject: "Mathematics", Chapter: "Definite Integrals", Topic: "By Parts", "Leaf Lessons": "10 Lessons", Actions: "Edit / Add Child" },
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
        { Field: "Parent Type", Type: "Dropdown", "Current Value": "Chapter / Topic", Validation: "Required" },
        { Field: "Title", Type: "Text", "Current Value": "Kinematics - Projectile Motion", Validation: "Max 120 chars" },
        { Field: "Subject Code", Type: "Code String", "Current Value": "PHY-11-KIN-01", Validation: "Unique Code" },
        { Field: "Status", Type: "Toggle", "Current Value": "Active (Published)", Validation: "Required" },
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
        { "Leaf ID": "LF-401", "Topic Name": "Horizontal Range Formula & Derivation", "DPP Questions": "25 Questions", "Video Lectures": "45 Mins", Difficulty: "Moderate", Status: "Active" },
        { "Leaf ID": "LF-402", "Topic Name": "Maximum Height in Projectile Motion", "DPP Questions": "30 Questions", "Video Lectures": "50 Mins", Difficulty: "Easy", Status: "Active" },
        { "Leaf ID": "LF-403", "Topic Name": "Trajectory Equation & Numerical Drill", "DPP Questions": "40 Questions", "Video Lectures": "65 Mins", Difficulty: "Advanced", Status: "Active" },
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
        { Username: "Kunal Kapoor", Email: "kunal@thinkiit.in", "Assigned Center": "thinkIIT Central", "Access Role": "Administrator", Status: "Active" },
        { Username: "Dr. Ramesh Sharma", Email: "sharma.physics@thinkiit.in", "Assigned Center": "Kota Campus", "Access Role": "Head of Physics", Status: "Active" },
        { Username: "Priya Nair", Email: "priya.bio@thinkiit.in", "Assigned Center": "Hyderabad Hub", "Access Role": "Senior Faculty", Status: "Active" },
        { Username: "Aarav Patel", Email: "aarav.p@student.thinkiit.in", "Assigned Center": "Delhi Center", "Access Role": "Student (Rank 1)", Status: "Active" },
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
        { "Campus Name": "Aryan Kota Main Campus", Subdomain: "aryan.thinkiit.in", "Seat Allocation": "1,500 / 1,500 Seats", "License Tier": "Enterprise", "SLA Status": "99.99% Uptime" },
        { "Campus Name": "Apex Hyderabad Center", Subdomain: "apex.thinkiit.in", "Seat Allocation": "1,880 / 2,000 Seats", "License Tier": "Enterprise", "SLA Status": "99.98% Uptime" },
        { "Campus Name": "Momentum Mumbai Hub", Subdomain: "momentum.thinkiit.in", "Seat Allocation": "1,290 / 1,350 Seats", "License Tier": "Standard", "SLA Status": "100% Uptime" },
      ],
    },
  ],
};

export const thinkiitDevAssets: { screens: DevScreenAsset[]; icons: DevIconAsset[] } = {
  screens: [
    { id: "style-guide", name: "Page 1: Style Guide", imageUrl: "/dev-assets/thinkiit-login-screen.png", width: 1440, height: 900, format: "png", type: "screen" },
    { id: "login-page", name: "Page 2: login page", imageUrl: "/dev-assets/thinkiit-login-screen.png", width: 1440, height: 900, format: "png", type: "screen" },
    { id: "dashboard-home", name: "Page 3: dashboard home", imageUrl: "/dev-assets/thinkiit-login-screen.png", width: 1440, height: 1024, format: "png", type: "screen" },
    { id: "user-management", name: "Page 4: user management", imageUrl: "/dev-assets/thinkiit-login-screen.png", width: 1440, height: 1024, format: "png", type: "screen" },
    { id: "content-management", name: "Page 5: CONTENT MANAGEMENT", imageUrl: "/dev-assets/thinkiit-login-screen.png", width: 1440, height: 1024, format: "png", type: "screen" },
    { id: "institute-management", name: "Page 6: institute management", imageUrl: "/dev-assets/thinkiit-login-screen.png", width: 1440, height: 1024, format: "png", type: "screen" },
  ],
  icons: [
    { id: "thinkiit-logo", name: "ThinkIIT Brand Mark", format: "svg" },
    { id: "parent-node", name: "Parent Node Hierarchy Glyph", format: "svg" },
    { id: "leaf-node", name: "Leaf Node Practice Glyph", format: "svg" },
    { id: "user-roster", name: "User Roster Glyph", format: "svg" },
    { id: "campus-building", name: "Campus Building Glyph", format: "svg" },
  ],
};
