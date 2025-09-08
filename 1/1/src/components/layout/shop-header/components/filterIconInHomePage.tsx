'use client'
import { useRouter } from "next/navigation";
import React from 'react';

function FilterIconInHomePage() {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => {
          router.push("/shop-now");
        }}
        data-slot="sheet-trigger"
        className="[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 ml-auto hidden lg:flex size-9 shrink-0 items-center justify-center gap-2 rounded-md border text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="radix-«r1q»"
        data-state="closed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-sliders-horizontal"
          aria-hidden="true"
        >
          <line x1="21" x2="14" y1="4" y2="4"></line>
          <line x1="10" x2="3" y1="4" y2="4"></line>
          <line x1="21" x2="12" y1="12" y2="12"></line>
          <line x1="8" x2="3" y1="12" y2="12"></line>
          <line x1="21" x2="16" y1="20" y2="20"></line>
          <line x1="12" x2="3" y1="20" y2="20"></line>
          <line x1="14" x2="14" y1="2" y2="6"></line>
          <line x1="8" x2="8" y1="10" y2="14"></line>
          <line x1="16" x2="16" y1="18" y2="22"></line>
        </svg>
      </button>
    </div>
  );
}

export default FilterIconInHomePage;
