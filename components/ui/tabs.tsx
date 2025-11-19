"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

export function Tabs({ items, defaultTab }: { items: TabItem[]; defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? items[0]?.id);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              activeTab === item.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {items.map((item) => (
          <div key={item.id} className={cn(activeTab === item.id ? "block" : "hidden")}>{item.content}</div>
        ))}
      </div>
    </div>
  );
}
