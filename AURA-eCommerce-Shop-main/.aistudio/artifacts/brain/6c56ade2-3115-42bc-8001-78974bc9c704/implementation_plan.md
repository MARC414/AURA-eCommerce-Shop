# Aura Storefront: Category Architecture, Authentic Lineages & Persistent Wishlist

An architectural blueprint for dedicated Category Pages, Navbar submenu navigation, authentic herbal and spiritual curation, and a persistent Wishlist system designed to maintain Aura's serene, editorial DTC aesthetic.

> [!IMPORTANT]
> **User Review & Critical Decisions**
>
> 1. **Category Taxonomy Mapping**:
>    - We propose standardizing the user's 5 core pillars into distinct, refined names:
>      - **Ayurvedic Botanicals & Pure Herbs** (Organic Clove, Neem powder, Shimul root, Ashwagandha)
>      - **Sacred Texts & Philosophy** (Sufi classics, Dr. Qalandar Baba Jahangir, Sadaruddin Chishti, Hazrat Ali, Nietzsche, Yoga scriptures)
>      - **Sacred Sound & Meditative Music** (432Hz Singing Bowls, Sufi Ney, Tanpura drones, Ney soundscapes)
>      - **Organic Quiet Tech** (Foundational analog mechanical timers, e-ink sanctuary tablets, brass hourglasses)
>      - **Yoga & Sacred Practice Materials** (Kusha grass meditation mats, pure hammered copper vessels, linen zafus)
> 2. **Wishlist Persistence & UX**:
>    - Saved in `localStorage` under `aura_wishlist_v1` for instant access and zero login friction.
>    - Accessible via a dedicated Wishlist Drawer and Header trigger next to the Cart icon.
>    - Includes 1-click "Move to Cart" and visual bookmark indicators on every product card and detail view.
> 3. **Navigation Architecture**:
>    - Desktop: Hover/click "Categories" dropdown in the Top Bar revealing the 5 sacred collections with descriptive subtext.
>    - Dedicated Category Page view with philosophical quote headers, category-specific background atmosphere, breadcrumb navigation, and filter controls.

---

## 1. Overview & Core Concept

### What It Does
This release transforms Aura from a single-grid storefront into a multi-dimensional philosophical sanctuary and retail experience. Visitors can navigate directly to dedicated category pages tailored to specific spiritual disciplines (such as pure dried botanicals or Sufi literature), bookmark cherished items into a persistent wishlist, and explore authentic procurement lineages.

### Target Persona
Mindful seekers, yogis, ascetics, and readers seeking authentic, unadulterated botanical roots (no chemical additives) and authentic philosophical works (free from commercialized markups).

### Key Value
- **Deep Exploration**: Dedicated category pages give each discipline breathing room and context (e.g. historical significance of Shimul root or spiritual lineage of Chishti literature).
- **Zero Friction Saving**: The Wishlist allows customers to curate their personal ascetic altar or reading list over time without losing their selections on refresh.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[ Top Navigation Bar ]
       │
       ├─── Hover/Click "Categories" Dropdown
       │          ├── 1. Ayurvedic Botanicals & Pure Herbs ──> [ Dedicated Category Page ]
       │          ├── 2. Sacred Texts & Philosophy           ──> [ Dedicated Category Page ]
       │          ├── 3. Sacred Sound & Meditative Music     ──> [ Dedicated Category Page ]
       │          ├── 4. Organic Quiet Tech                  ──> [ Dedicated Category Page ]
       │          └── 5. Yoga & Sacred Materials             ──> [ Dedicated Category Page ]
       │
       ├─── Click Heart Icon on Product Card / PDP ──────────> [ Added to Persistent Wishlist ]
       │                                                                  │
       └─── Click Wishlist Icon (Navbar) ────────────────────> [ Slide-out Wishlist Drawer ]
                                                                          │
                                                                   [ Move to Cart ]
```

### Visual Identity & Theme
- **Color Discipline**: Warm Cream canvas (`#F5F2EB`), Deep Charcoal typography (`#2C2A26`), Muted Amber/Gold accents (`#8C7355`), and Hairline dividers (`rgba(44, 42, 38, 0.08)`).
- **Anti-Slop Restraint**:
  - No static pill capsules or garish colored badges. Metadata displayed as quiet, unboxed text separated by subtle middots (`·`).
  - No artificial status dots or pulsing indicators.
  - Generous whitespace (`py-16 md:py-24`) allowing typography to breathe.
- **Dedicated Category Page Anatomy**:
  - **Category Editorial Banner**: Large serif headline, Bengali script subtitle where appropriate, and a contemplative philosophical excerpt (e.g., Kabir or Rumi quote on the books page, Charaka Samhita excerpt on the herbal page).
  - **Category Breadcrumb**: `Home / Categories / Sacred Texts & Philosophy`.
  - **Curated Product Grid**: 3-column desktop layout (`gap-8`) with synchronized aspect ratios (`aspect-[4/5]`).
  - **Interactive Sorters**: Price (Low to High / High to Low), Alphabetical, and Format/Origin filters.
- **Persistent Wishlist Drawer**:
  - Mirrored design of the Cart Drawer using smooth slide-over transition.
  - Shows thumbnail, product name, category, price, and in-stock indicator.
  - Primary button: "Move to Cart" (automatically removes from wishlist and adds to cart with feedback toast).
  - Secondary action: "Remove" (soft icon trigger).
  - Empty state: Poetic message encouraging intentionality (*"Your sanctuary list is empty. Collect items that serve your journey."*).

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Trade-Off |
| :--- | :--- | :--- |
| **Category Navigation** | Custom Dropdown Menu with full sub-page routing via client state (`selectedCategoryPage`) | Avoids external URL routing dependencies in Vite while providing instantaneous, zero-latency transitions and breadcrumb navigation. |
| **Wishlist Persistence** | Client-side `localStorage` (`aura_wishlist_v1`) | Immediate zero-auth functionality for customers on any device without forcing an account creation barrier, maximizing retention and trust. |
| **New Herbal Additions** | Pure dried Clove (*Syzygium aromaticum*), Pure Neem leaf powder (*Azadirachta indica*), and Shimul root (*Bombax ceiba*) | Directly answers user's preference for raw, chemical-free roots and powders with transparent lineage and sourcing. |
| **Category Taxonomy** | 5 Focused Pillars: *Ayurvedic Botanicals*, *Sacred Texts & Philosophy*, *Sacred Sound & Music*, *Organic Quiet Tech*, *Yoga & Sacred Materials* | Balances the user's specific categories with Aura's signature Quiet Tech identity without overcrowding the menu. |

---

## 4. Technical Architecture & Data Strategy

### System Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│  State: activeCategoryView, wishlistItems, cart, selectedProduct, etc. │
└──────┬───────────────────────────────┬───────────────────────────┬─────┘
       │                               │                           │
┌──────▼──────────────┐   ┌────────────▼──────────────┐   ┌────────▼──────────────┐
│     Navbar.tsx      │   │     CategoryPage.tsx      │   │    WishlistDrawer.tsx │
│ ─────────────────── │   │ ───────────────────────── │   │ ───────────────────── │
│ - Categories Dropdown│   │ - Editorial Quote & Intro │   │ - Item List & Prices  │
│ - Submenu Links     │   │ - Filtered Product Grid   │   │ - "Move to Cart"      │
│ - Wishlist Counter  │   │ - Sort & Sourcing Details │   │ - Remove Item         │
│ - Cart Counter      │   │ - Breadcrumb Navigation   │   │ - LocalStorage Sync   │
└─────────────────────┘   └────────────┬──────────────┘   └───────────────────────┘
                                       │
                          ┌────────────▼──────────────┐
                          │     ProductCard.tsx       │
                          │ ───────────────────────── │
                          │ - Heart Wishlist Toggle   │
                          │ - Bengali Title Rendering │
                          │ - Image & Quick View      │
                          └───────────────────────────┘
```

### Data Structures & State Management

```typescript
// Wishlist item stored in localStorage:
export interface WishlistItem {
  productId: string;
  addedAt: number;
}

// Updated Category Page State:
export type CategorySlug = 
  | 'ayurvedic-botanicals' 
  | 'sacred-texts-philosophy' 
  | 'sacred-sound-music' 
  | 'organic-quiet-tech' 
  | 'yoga-materials';
```

### Persistence Service
- `storeService.getWishlist()`: Reads from `localStorage['aura_wishlist_v1']`.
- `storeService.toggleWishlist(productId)`: Adds or removes item and dispatches custom event for synchronized UI updates.
- `storeService.isWishlisted(productId)`: Fast $O(1)$ lookup using a Set of saved product IDs.
