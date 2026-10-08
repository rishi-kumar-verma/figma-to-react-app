import { FigmaNode } from "../../types";

export const healthcareDashboardPreset: FigmaNode = {
  id: "0:0",
  name: "Document",
  type: "DOCUMENT",
  children: [
    {
      id: "0:1",
      name: "PulseCare Healthcare Portal",
      type: "CANVAS",
      children: [
        {
          id: "1:2",
          name: "Main Clinical App Shell",
          type: "FRAME",
          layoutMode: "HORIZONTAL",
          primaryAxisAlignItems: "MIN",
          counterAxisAlignItems: "MIN",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          fills: [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.99, a: 1 } }],
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 960 },
          children: [
            // Sidebar
            {
              id: "2:10",
              name: "Sidebar Navigation",
              type: "FRAME",
              layoutMode: "VERTICAL",
              itemSpacing: 24,
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 32,
              paddingBottom: 32,
              fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 1 } }],
              strokes: [{ type: "SOLID", color: { r: 0.9, g: 0.92, b: 0.95, a: 1 } }],
              strokeWeight: 1,
              absoluteBoundingBox: { x: 0, y: 0, width: 280, height: 960 },
              children: [
                {
                  id: "2:11",
                  name: "Brand Logo Frame",
                  type: "FRAME",
                  layoutMode: "HORIZONTAL",
                  itemSpacing: 12,
                  children: [
                    {
                      id: "2:12",
                      name: "Logo Icon",
                      type: "VECTOR",
                      absoluteBoundingBox: { x: 24, y: 32, width: 36, height: 36 },
                      fills: [{ type: "SOLID", color: { r: 0.05, g: 0.55, b: 0.85, a: 1 } }],
                    },
                    {
                      id: "2:13",
                      name: "Logo Text",
                      type: "TEXT",
                      characters: "PulseCare AI",
                      style: { fontFamily: "Inter", fontWeight: 700, fontSize: 20 },
                      fills: [{ type: "SOLID", color: { r: 0.08, g: 0.12, b: 0.2, a: 1 } }],
                    },
                  ],
                },
                {
                  id: "2:14",
                  name: "Navigation Links Group",
                  type: "FRAME",
                  layoutMode: "VERTICAL",
                  itemSpacing: 8,
                  children: [
                    { id: "2:15", name: "Nav: Dashboard (Active)", type: "FRAME", characters: "Clinical Overview" },
                    { id: "2:16", name: "Nav: Appointments", type: "FRAME", characters: "Appointments" },
                    { id: "2:17", name: "Nav: Patients", type: "FRAME", characters: "Patient Records" },
                    { id: "2:18", name: "Nav: Diagnostics", type: "FRAME", characters: "Lab & Diagnostics" },
                    { id: "2:19", name: "Nav: Settings", type: "FRAME", characters: "Settings & Compliance" },
                  ],
                },
              ],
            },
            // Main Content Area
            {
              id: "3:30",
              name: "Dashboard Body Frame",
              type: "FRAME",
              layoutMode: "VERTICAL",
              itemSpacing: 32,
              paddingLeft: 36,
              paddingRight: 36,
              paddingTop: 32,
              paddingBottom: 40,
              absoluteBoundingBox: { x: 280, y: 0, width: 1160, height: 960 },
              children: [
                // Top Header Frame
                {
                  id: "3:31",
                  name: "Top Bar Header",
                  type: "FRAME",
                  layoutMode: "HORIZONTAL",
                  primaryAxisAlignItems: "SPACE_BETWEEN",
                  children: [
                    {
                      id: "3:32",
                      name: "Greeting & Subtitle",
                      type: "FRAME",
                      layoutMode: "VERTICAL",
                      itemSpacing: 4,
                      children: [
                        {
                          id: "3:33",
                          name: "Header Title",
                          type: "TEXT",
                          characters: "Good Morning, Dr. Aris Thorne",
                          style: { fontFamily: "Inter", fontWeight: 700, fontSize: 26 },
                        },
                        {
                          id: "3:34",
                          name: "Header Subtitle",
                          type: "TEXT",
                          characters: "Here is your hospital unit status and incoming patient queue today.",
                          style: { fontFamily: "Inter", fontWeight: 400, fontSize: 14 },
                        },
                      ],
                    },
                    {
                      id: "3:35",
                      name: "Header Actions",
                      type: "FRAME",
                      layoutMode: "HORIZONTAL",
                      itemSpacing: 16,
                      children: [
                        { id: "3:36", name: "Search Input Bar", type: "FRAME" },
                        { id: "3:37", name: "Notification Bell Button", type: "FRAME" },
                        { id: "3:38", name: "Emergency Admit Button", type: "FRAME" },
                      ],
                    },
                  ],
                },
                // Metric Stats Row
                {
                  id: "4:50",
                  name: "Key Clinical Metrics Row",
                  type: "FRAME",
                  layoutMode: "HORIZONTAL",
                  itemSpacing: 20,
                  children: [
                    {
                      id: "4:51",
                      name: "Metric: Total Admitted Patients",
                      type: "COMPONENT",
                      characters: "1,248 (+12% vs last month)",
                    },
                    {
                      id: "4:52",
                      name: "Metric: Surgery Success Rate",
                      type: "COMPONENT",
                      characters: "99.4% (+0.8% optimal)",
                    },
                    {
                      id: "4:53",
                      name: "Metric: Critical ICU Bed Occupancy",
                      type: "COMPONENT",
                      characters: "82% (4 beds available)",
                    },
                    {
                      id: "4:54",
                      name: "Metric: Average Triage Wait Time",
                      type: "COMPONENT",
                      characters: "14 mins (-4 mins reduced)",
                    },
                  ],
                },
                // Main Grid: Appointments Table & Vitals Monitor
                {
                  id: "5:70",
                  name: "Analytics & Appointment Schedule Grid",
                  type: "FRAME",
                  layoutMode: "HORIZONTAL",
                  itemSpacing: 24,
                  children: [
                    {
                      id: "5:71",
                      name: "Today's Patient Schedule Table",
                      type: "FRAME",
                      layoutMode: "VERTICAL",
                      itemSpacing: 16,
                      absoluteBoundingBox: { x: 280, y: 300, width: 720, height: 500 },
                    },
                    {
                      id: "5:72",
                      name: "Vitals & ICU Telemetry Panel",
                      type: "FRAME",
                      layoutMode: "VERTICAL",
                      itemSpacing: 16,
                      absoluteBoundingBox: { x: 1024, y: 300, width: 380, height: 500 },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
