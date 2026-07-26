"use client";

import {
  Accordion,
  AccordionItem,
  AccordionHeading,
  AccordionTrigger,
  AccordionIndicator,
  AccordionPanel,
} from "@heroui/react";

export type FilterGroup = { id: string; title: string; options: string[] };

export default function FilterAccordion({
  groups,
  selected,
  onChange,
}: {
  groups: FilterGroup[];
  selected: Record<string, string[]>;
  onChange: (groupId: string, values: string[]) => void;
}) {
  return (
    <Accordion allowsMultipleExpanded className="flex w-full flex-col gap-1.5">
      {groups.map((g) => {
        const cur = selected[g.id] ?? [];
        return (
          <AccordionItem key={g.id} id={g.id} className="w-full">
            <AccordionHeading>
              <AccordionTrigger className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left outline-none transition-colors hover:bg-[rgba(144,138,134,0.08)]">
                <span className="flex-1 text-[16px] font-semibold leading-[20px] text-[#8f8579]">
                  {g.title}
                </span>
                <AccordionIndicator>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-[#8f8579] transition-transform duration-200 group-data-[expanded]:rotate-180"
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </AccordionIndicator>
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel className="px-3 pb-2 pt-1">
              {/* Кастомные чекбоксы — визуал строго с макета (галочка), состояние
                  через selected. HeroUI Checkbox v3 не стилизуется под макет. */}
              <div className="flex flex-col gap-2">
                {g.options.map((o) => {
                  const checked = cur.includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() =>
                        onChange(g.id, checked ? cur.filter((x) => x !== o) : [...cur, o])
                      }
                      className="flex cursor-pointer select-none items-center gap-2.5 text-left text-[15px] leading-[20px] text-carbon outline-none"
                    >
                      <span
                        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                          checked ? "border-green bg-green" : "border-[#b2a79b] bg-white"
                        }`}
                      >
                        {checked && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-white">
                            <path d="M2.5 6.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {o}
                    </button>
                  );
                })}
              </div>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
