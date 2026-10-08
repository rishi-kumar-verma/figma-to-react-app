import { FigmaNode } from "../../types";

export const fintechAnalyticsPreset: FigmaNode = {
  id: "0:0",
  name: "Document",
  type: "DOCUMENT",
  children: [
    {
      id: "0:1",
      name: "Apex Trading & Wealth Canvas",
      type: "CANVAS",
      children: [
        {
          id: "1:2",
          name: "Fintech Dashboard Shell",
          type: "FRAME",
          layoutMode: "HORIZONTAL",
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 960 },
          children: [
            {
              id: "2:10",
              name: "Fintech Navigation Rail",
              type: "FRAME",
              layoutMode: "VERTICAL",
              itemSpacing: 20,
              children: [
                { id: "2:11", name: "Fintech Logo", type: "TEXT", characters: "APEX // TRADING" },
                { id: "2:12", name: "Nav: Portfolio", type: "FRAME", characters: "Portfolio" },
                { id: "2:13", name: "Nav: Markets", type: "FRAME", characters: "Market Depth" },
                { id: "2:14", name: "Nav: Transactions", type: "FRAME", characters: "Ledger" },
              ],
            },
            {
              id: "3:30",
              name: "Fintech Main Stage",
              type: "FRAME",
              layoutMode: "VERTICAL",
              itemSpacing: 24,
              children: [
                {
                  id: "4:1",
                  name: "Total Assets Under Management",
                  type: "COMPONENT",
                  characters: "$2,845,920.40 (+18.4% APY)",
                },
                {
                  id: "4:2",
                  name: "Crypto & Stock Allocation Chart",
                  type: "FRAME",
                  characters: "BTC 42%, ETH 28%, NVDA 20%, Cash 10%",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
