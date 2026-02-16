# Mobile & iPad UX Review (1-page)

## Scope tested
- Pages: `/`, `/products`, `/blogs`
- Viewports: **iPhone 12** and **iPad Pro 11**
- Method: local Vite run + Playwright screenshots

## What I observed
1. **iPad typography and spacing are being globally downscaled too aggressively**.
   - On iPad width (834px), text/buttons/cards become unusually tiny and hard to scan.
   - Root cause is a broad media query (`769px–1023px`) that forcibly shrinks many Tailwind utility classes (`text-*`, spacing, button/input sizing, icon sizing, section padding, etc.).
2. **Home capability cards are not mobile-readable**.
   - Several card text styles are set to very small fixed px values (`6px–10px`) on small screens.
3. **Phase step labels on mobile are too small to parse quickly**.
   - Top/bottom phase labels are around `6px–9px` at small breakpoints.
4. **Sticky contact rail competes with content on small screens**.
   - Fixed right-side icon stack overlays body content and can distract from reading/forms.
5. **Products/Blogs pages are mostly placeholder states with excessive empty vertical space**.
   - On both mobile and iPad, users scroll through large blank sections before/after key messaging.

## Highest-impact improvements (priority order)
1. **Remove or heavily limit the 769–1023px global “shrink everything” CSS overrides**.
   - Keep tablet text near standard readable sizes (target body ~15–17px, controls >=14px).
   - Avoid broad `!important` overrides on utility classes.
2. **Set minimum readable text sizes for cards/labels**.
   - For capability cards: title >=14px, description >=13–14px on mobile.
   - For phase labels: avoid sub-12px in any interactive stepper.
3. **Make the sticky contact rail responsive by context**.
   - On mobile: collapse to 1 FAB / bottom sheet trigger / hide on deep scroll.
   - On tablet: reduce icon count or move to footer/sticky bottom action bar.
4. **Reduce empty-state whitespace and improve above-the-fold density**.
   - Products/Blogs: keep CTA + status + next action visible in first viewport.
   - Use tighter section min-heights for placeholder pages.
5. **Add responsive QA gates before release**.
   - Add visual checks for 390px, 768px, 834px, 1024px.
   - Add a short checklist: text legibility, tap target size, overlap/occlusion, and scroll length sanity.

## Suggested 7-day implementation plan
- **Day 1–2:** Remove tablet global override block and retune typography scale.
- **Day 3:** Refactor capability/phase text sizing to token-based min sizes.
- **Day 4:** Redesign sticky contact behavior for mobile/tablet.
- **Day 5:** Compress Products/Blogs empty-state layouts.
- **Day 6–7:** Screenshot regression pass + sign-off checklist.

## Success metrics
- No text below 12px on mobile/tablet UI.
- First viewport communicates value proposition + primary CTA without overlap.
- >25% reduction in unnecessary vertical scroll on placeholder pages.
