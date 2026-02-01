# PlasmoAI Design Inspo

This folder contains the high-fidelity UI designs for the PlasmoAI restyling, generated based on the "MVP Completo" specifications.

Due to current environment constraints with the external "Google Stitch" service, these designs have been generated directly as production-ready React/Tailwind components. You can copy these directly into your `app/` or `components/` directory to implement the new design.

## Files

1.  **`Dashboard.tsx`**: The main user dashboard featuring:
    *   Real-time statistics (Videos, Credits, Gen Time).
    *   Recent project grid with status indicators.
    *   Sidebar navigation with "Pro" plan upselling.
    *   Dark/Premium aesthetic using the requested color palette (`#090a0f`).

2.  **`VideoGenerator.tsx`**: The core creation interface featuring:
    *   Prompt input (Text/Image) with AI enhancement button.
    *   Settings sidebar (Aspect Ratio, Resolution, Duration, Style).
    *   Credit cost calculation.
    *   Empty state/Preview area.

3.  **`Gallery.tsx`**: The community showcase featuring:
    *   Masonry grid layout for mixed aspect ratios.
    *   Filtering and search.
    *   Hover effects with "Use Template" actions.

## Usage

These components use `lucide-react` for icons and standard `tailwindcss` classes. 
To use them, ensure you have the dependencies installed:

```bash
npm install lucide-react
```

You can then import them into your Next.js pages.
