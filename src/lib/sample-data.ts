import type {
  Category,
  ProjectWithRelations,
  Service,
  SiteSettings,
  StoreCategory,
  StoreProduct,
} from "@/types";

export const SITE_IMAGES = {
  hero: "/images/site/hero-interior.jpg",
  studio: "/images/site/about-studio.jpg",
  craftsmanship: "/images/site/craftsmanship.jpg",
} as const;

export const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  "residential-interior-design": {
    src: "/images/portfolio/ikoyi-penthouse-cover.jpg",
    alt: "Residential living room interior with custom curved linen sofa and walnut herringbone floor",
  },
  "bespoke-furniture-and-millwork": {
    src: "/images/site/craftsmanship.jpg",
    alt: "Close-up of sculpted African walnut furniture frame with precision brushed brass joinery",
  },
  "commercial-and-hospitality-spaces": {
    src: "/images/portfolio/vi-lounge-cover.jpg",
    alt: "Executive lounge and reception with travertine desk, brass inlay, and dark oak panelling",
  },
};

export const SAMPLE_SETTINGS: SiteSettings = {
  business_name: "Wura Interiors",
  tagline:
    "Bespoke residential, commercial, and hospitality interiors alongside custom-crafted furniture tailored to how you live and work.",
  whatsapp_number: null,
  email: null,
  phone: null,
  address: null,
  instagram_url: null,
  facebook_url: null,
  tiktok_url: null,
  logo_path: null,
  about_story:
    "Wura Interiors was founded on a quiet conviction: the spaces we inhabit every day shape our calm, our focus, and the way we gather. Working across residential homes, executive workplaces, and boutique hospitality spaces, our studio pairs spatial architecture with custom furniture making.\n\nEvery commission begins with listening—understanding how natural light moves through a room, how a family or team uses each corner, and which tactile materials will age with grace over decades rather than seasons.",
  design_philosophy:
    "We believe in warm minimalism grounded in honest materials: hand-rubbed African walnut and iroko timber, honed travertine stone, unlacquered brushed brass, and breathable natural linens.\n\nRather than filling rooms with ornament, we focus on proportion, joinery, and atmosphere—designing custom millwork and collectible pieces that belong unmistakably to their architecture.",
  founder_name: null,
  founder_bio: null,
};

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: "cat-residential",
    name: "Residential",
    slug: "residential",
    sort_order: 1,
  },
  {
    id: "cat-commercial",
    name: "Commercial",
    slug: "commercial",
    sort_order: 2,
  },
  {
    id: "cat-bespoke-furniture",
    name: "Bespoke Furniture",
    slug: "bespoke-furniture",
    sort_order: 3,
  },
  {
    id: "cat-hospitality",
    name: "Hospitality",
    slug: "hospitality",
    sort_order: 4,
  },
];

export const SAMPLE_PROJECTS: ProjectWithRelations[] = [
  {
    id: "proj-ikoyi-penthouse",
    title: "Ikoyi Penthouse Residence",
    slug: "ikoyi-penthouse-residence",
    summary:
      "A full-floor lagoon-view residence anchored by warm walnut herringbone floors, travertine stonework, and custom linen upholstery.",
    description:
      "Overlooking the Lagos lagoon, this full-floor penthouse was reimagined from shell and core to create a serene sanctuary for entertaining and family life. We introduced warm walnut herringbone flooring throughout the living areas, paired with hand-trowelled ivory limewash walls that soften the equatorial sunlight.\n\nIn the main salon, a custom curved bouclé and linen sectional frames the water view while blackened steel and brushed brass shelving anchors the architectural volume. The formal dining room features a ten-seater solid iroko table beneath a sculptural linear brass chandelier, flowing seamlessly into a calm primary suite wrapped in sand-toned drapery.",
    category_id: "cat-residential",
    category: { name: "Residential", slug: "residential" },
    location: "Ikoyi, Lagos",
    completed_on: "2025-11-15",
    featured: true,
    status: "published",
    published_at: "2025-11-20T10:00:00Z",
    created_at: "2025-11-01T10:00:00Z",
    updated_at: "2025-11-20T10:00:00Z",
    images: [
      {
        id: "img-ikoyi-1",
        project_id: "proj-ikoyi-penthouse",
        storage_path: "/images/portfolio/ikoyi-penthouse-cover.jpg",
        caption:
          "Main living salon with custom curved linen sectional, brass shelving, and walnut herringbone floors.",
        alt_text:
          "Luxury penthouse living room overlooking the lagoon with cream sectional sofa and walnut herringbone floor",
        width: 1600,
        height: 1200,
        sort_order: 0,
        is_cover: true,
      },
      {
        id: "img-ikoyi-2",
        project_id: "proj-ikoyi-penthouse",
        storage_path: "/images/portfolio/ikoyi-penthouse-dining.jpg",
        caption:
          "Ten-seater solid iroko dining table paired with upholstered linen chairs and a sculptural brass pendant.",
        alt_text:
          "Formal dining room with solid wood table, linen chairs, and brushed brass linear chandelier",
        width: 1600,
        height: 1200,
        sort_order: 1,
        is_cover: false,
      },
      {
        id: "img-ikoyi-3",
        project_id: "proj-ikoyi-penthouse",
        storage_path: "/images/portfolio/ikoyi-penthouse-suite.jpg",
        caption:
          "Primary bedroom suite featuring a full-width upholstered sand linen headboard and floating walnut nightstands.",
        alt_text:
          "Serene primary bedroom with sand linen headboard, brass sconces, and sheer floor-to-ceiling curtains",
        width: 1600,
        height: 1200,
        sort_order: 2,
        is_cover: false,
      },
    ],
  },
  {
    id: "proj-vi-executive-lounge",
    title: "Victoria Island Executive Lounge",
    slug: "victoria-island-executive-lounge",
    summary:
      "A private executive floor and client reception crafted with dark stained oak, monolithic travertine, and saddle leather.",
    description:
      "Designed for a private investment firm in Victoria Island, this executive suite replaces conventional corporate austerity with hospitality-grade warmth and acoustic privacy.\n\nGuests arrive at a monolithic honed travertine reception desk detailed with brushed brass inlay, set against dark stained oak wall panelling and warm architectural cove lighting. The adjoining boardroom centres on a custom 14-foot stone and walnut conference table surrounded by cognac saddle-leather seating and slatted timber acoustic walls.",
    category_id: "cat-commercial",
    category: { name: "Commercial", slug: "commercial" },
    location: "Victoria Island, Lagos",
    completed_on: "2025-09-28",
    featured: true,
    status: "published",
    published_at: "2025-10-02T10:00:00Z",
    created_at: "2025-09-10T10:00:00Z",
    updated_at: "2025-10-02T10:00:00Z",
    images: [
      {
        id: "img-vi-1",
        project_id: "proj-vi-executive-lounge",
        storage_path: "/images/portfolio/vi-lounge-cover.jpg",
        caption:
          "Client reception and private lounge with travertine desk, brass inlay, and cognac leather armchairs.",
        alt_text:
          "Executive reception lounge with dark oak panelling, travertine desk, and cognac leather armchairs",
        width: 1600,
        height: 1200,
        sort_order: 0,
        is_cover: true,
      },
      {
        id: "img-vi-2",
        project_id: "proj-vi-executive-lounge",
        storage_path: "/images/portfolio/vi-lounge-boardroom.jpg",
        caption:
          "Acoustic slatted timber boardroom with a bespoke travertine and walnut conference table.",
        alt_text:
          "Executive boardroom with stone and walnut conference table and saddle-leather chairs",
        width: 1600,
        height: 1200,
        sort_order: 1,
        is_cover: false,
      },
    ],
  },
  {
    id: "proj-oyo-collection",
    title: "The Oyo Walnut & Brass Collection",
    slug: "oyo-walnut-and-brass-collection",
    summary:
      "A limited series of sculptural dining tables and fluted sideboards celebrating West African hardwood and precision brass joinery.",
    description:
      "Developed in our furniture workshop, the Oyo Collection explores the dialogue between heavy architectural timber and refined metalwork. Each piece is built to order from sustainably sourced African walnut, kiln-dried and finished with natural plant oils to preserve the open grain.\n\nExposed mortise-and-tenon joints are reinforced with hand-machined brushed brass collars and pulls, paired with honed cream marble and travertine surfaces that gain character with daily use.",
    category_id: "cat-bespoke-furniture",
    category: { name: "Bespoke Furniture", slug: "bespoke-furniture" },
    location: "Lagos Atelier",
    completed_on: "2025-08-12",
    featured: true,
    status: "published",
    published_at: "2025-08-18T10:00:00Z",
    created_at: "2025-08-01T10:00:00Z",
    updated_at: "2025-08-18T10:00:00Z",
    images: [
      {
        id: "img-oyo-1",
        project_id: "proj-oyo-collection",
        storage_path: "/images/portfolio/oyo-collection-cover.jpg",
        caption:
          "Oyo sculptural dining table in solid African walnut with brushed brass architectural leg joinery.",
        alt_text:
          "Sculptural solid walnut dining table with brushed brass joinery on travertine stone floor",
        width: 1600,
        height: 1200,
        sort_order: 0,
        is_cover: true,
      },
      {
        id: "img-oyo-2",
        project_id: "proj-oyo-collection",
        storage_path: "/images/portfolio/oyo-collection-credenza.jpg",
        caption:
          "Low-profile fluted walnut sideboard credenza topped with honed cream marble and aged brass hardware.",
        alt_text:
          "Fluted walnut sideboard credenza with cream marble top and brass pulls against limewash wall",
        width: 1600,
        height: 1200,
        sort_order: 1,
        is_cover: false,
      },
    ],
  },
  {
    id: "proj-lekki-coastal-villa",
    title: "Lekki Coastal Villa",
    slug: "lekki-coastal-villa",
    summary:
      "An airy double-height family villa balancing cool travertine stone, woven cane, and monolithic kitchen millwork.",
    description:
      "Conceived for effortless indoor-outdoor living near the Atlantic coast, this family villa embraces natural ventilation, abundant daylight, and cool underfoot textures. Honed travertine slabs run continuously from the double-height living room out to the terrace.\n\nCustom teak and woven cane lounge seating pairs with deep ivory linen sofas, while the open-plan kitchen is anchored by a monolithic fluted travertine island and floor-to-ceiling warm oak cabinetry.",
    category_id: "cat-residential",
    category: { name: "Residential", slug: "residential" },
    location: "Lekki Phase 1, Lagos",
    completed_on: "2025-06-20",
    featured: true,
    status: "published",
    published_at: "2025-06-25T10:00:00Z",
    created_at: "2025-06-01T10:00:00Z",
    updated_at: "2025-06-25T10:00:00Z",
    images: [
      {
        id: "img-lekki-1",
        project_id: "proj-lekki-coastal-villa",
        storage_path: "/images/portfolio/lekki-villa-cover.jpg",
        caption:
          "Double-height coastal living room with honed travertine floors, teak and cane seating, and sheer linen drapery.",
        alt_text:
          "Sunlit double-height villa living room with travertine floors, cane lounge chairs, and linen sofas",
        width: 1600,
        height: 1200,
        sort_order: 0,
        is_cover: true,
      },
      {
        id: "img-lekki-2",
        project_id: "proj-lekki-coastal-villa",
        storage_path: "/images/portfolio/lekki-villa-kitchen.jpg",
        caption:
          "Architectural kitchen centred on a monolithic fluted travertine island with brushed brass fixtures.",
        alt_text:
          "Minimalist luxury kitchen with fluted travertine island, oak cabinetry, and wooden bar stools",
        width: 1600,
        height: 1200,
        sort_order: 1,
        is_cover: false,
      },
    ],
  },
  {
    id: "proj-maitama-hotel-suite",
    title: "Maitama Boutique Hotel Suite",
    slug: "maitama-boutique-hotel-suite",
    summary:
      "A tranquil presidential suite and spa bath in Abuja crafted with dark walnut canopy millwork and carved stone.",
    description:
      "For an intimate boutique hotel in Maitama, we designed the flagship suites to feel like a private collector's residence rather than a transient hotel room. A custom four-poster canopy bed in dark walnut defines the sleeping zone, dressed in breathable earth-toned Belgian linens.\n\nThe adjoining en-suite bath is wrapped in book-matched travertine slabs, featuring a freestanding carved stone soaking tub, brushed brass floor-mounted brassware, and warm indirect lighting.",
    category_id: "cat-hospitality",
    category: { name: "Hospitality", slug: "hospitality" },
    location: "Maitama, Abuja",
    completed_on: "2025-04-10",
    featured: true,
    status: "published",
    published_at: "2025-04-14T10:00:00Z",
    created_at: "2025-04-01T10:00:00Z",
    updated_at: "2025-04-14T10:00:00Z",
    images: [
      {
        id: "img-maitama-1",
        project_id: "proj-maitama-hotel-suite",
        storage_path: "/images/portfolio/maitama-hotel-cover.jpg",
        caption:
          "Presidential suite with custom dark walnut four-poster canopy bed and warm brass pendant lighting.",
        alt_text:
          "Luxury boutique hotel suite with dark walnut four-poster canopy bed and earth-toned linen bedding",
        width: 1600,
        height: 1200,
        sort_order: 0,
        is_cover: true,
      },
      {
        id: "img-maitama-2",
        project_id: "proj-maitama-hotel-suite",
        storage_path: "/images/portfolio/maitama-hotel-bath.jpg",
        caption:
          "Spa-inspired en-suite bathroom with honed travertine walls and a freestanding stone soaking tub.",
        alt_text:
          "Spa bathroom with travertine walls, freestanding stone soaking tub, and brushed brass faucet",
        width: 1600,
        height: 1200,
        sort_order: 1,
        is_cover: false,
      },
    ],
  },
  {
    id: "proj-abuja-private-study",
    title: "Abuja Private Gallery & Study",
    slug: "abuja-private-gallery-and-study",
    summary:
      "A quiet-luxury home library and collector's study with floor-to-ceiling walnut joinery and integrated gallery lighting.",
    description:
      "Created for an art patron and avid reader, this private study combines museum-grade display lighting with the intimacy of a traditional timber-lined library. Floor-to-ceiling walnut shelving is custom-fitted with concealed warm LED channels to illuminate sculptures, rare books, and works on paper.\n\nA sculptural solid walnut writing desk commands the centre of the room, balanced by an intimate reading nook with a custom cream bouclé armchair and brushed brass floor lamp.",
    category_id: "cat-residential",
    category: { name: "Residential", slug: "residential" },
    location: "Asokoro, Abuja",
    completed_on: "2025-02-18",
    featured: true,
    status: "published",
    published_at: "2025-02-22T10:00:00Z",
    created_at: "2025-02-01T10:00:00Z",
    updated_at: "2025-02-22T10:00:00Z",
    images: [
      {
        id: "img-abuja-1",
        project_id: "proj-abuja-private-study",
        storage_path: "/images/portfolio/abuja-study-cover.jpg",
        caption:
          "Custom floor-to-ceiling walnut bookshelves with integrated warm display lighting and sculptural writing desk.",
        alt_text:
          "Private library and study with floor-to-ceiling walnut bookshelves, writing desk, and velvet lounge chair",
        width: 1600,
        height: 1200,
        sort_order: 0,
        is_cover: true,
      },
      {
        id: "img-abuja-2",
        project_id: "proj-abuja-private-study",
        storage_path: "/images/portfolio/abuja-study-nook.jpg",
        caption:
          "Reading corner with bespoke cream bouclé armchair, brushed brass floor lamp, and framed textile artwork.",
        alt_text:
          "Intimate reading nook with cream bouclé armchair, brass floor lamp, and framed textile art",
        width: 1600,
        height: 1200,
        sort_order: 1,
        is_cover: false,
      },
    ],
  },
];

export const SAMPLE_SERVICES: Service[] = [
  {
    id: "srv-residential-design",
    title: "Residential Interior Design",
    slug: "residential-interior-design",
    summary:
      "End-to-end spatial planning, material specification, custom millwork, and turnkey furnishing for private homes and penthouses.",
    description:
      "We guide residential projects from initial architectural review through to final styling and handover. Our team develops comprehensive spatial layouts, lighting plans, wall and floor finishes, kitchen and bath cabinetry, and room-by-room furniture selections.\n\nBy coordinating directly with contractors, artisans, and our in-house furniture workshop, we ensure every detail—from concealed drapery tracks to custom stone thresholds—is executed with quiet precision.",
    sort_order: 1,
    status: "published",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "srv-bespoke-furniture",
    title: "Bespoke Furniture & Millwork",
    slug: "bespoke-furniture-and-millwork",
    summary:
      "Made-to-measure dining tables, credenzas, upholstered seating, and architectural joinery crafted from kiln-dried hardwoods, brass, and stone.",
    description:
      "Our furniture atelier designs and builds heirloom-grade pieces tailored to the exact proportions of your space. Working with sustainably sourced African walnut, iroko, oak, honed travertine, and brushed brass, we craft freestanding furniture as well as integrated wardrobes, libraries, and reception desks.\n\nEach commission includes technical shop drawings, timber and textile sampling, and white-glove delivery and installation.",
    sort_order: 2,
    status: "published",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "srv-commercial-hospitality",
    title: "Commercial & Hospitality Spaces",
    slug: "commercial-and-hospitality-spaces",
    summary:
      "Executive offices, private lounges, boutique hotels, and gallery spaces designed for durability, acoustic comfort, and brand presence.",
    description:
      "We partner with founders, developers, and hospitality operators to create spaces that leave a lasting impression on guests and teams. Our commercial scope covers concept development, FF&E procurement, acoustic panelling, custom reception and boardroom furniture, and ambient lighting design.\n\nEvery material is selected to withstand high-traffic use while maintaining the warmth and refinement of a private residence.",
    sort_order: 3,
    status: "published",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

export const STORE_CATEGORIES: StoreCategory[] = [
  "Seating",
  "Dining",
  "Tables",
  "Storage",
  "Lighting",
  "Objects & Decor",
];

export const SAMPLE_PRODUCTS: StoreProduct[] = [
  {
    id: "prod-oyo-dining-table",
    name: "Oyo Sculptural Walnut Dining Table",
    slug: "oyo-sculptural-walnut-dining-table",
    category: "Dining",
    price: 3850000,
    summary:
      "Eight-to-ten seater architectural dining table crafted from solid kiln-dried African walnut with hand-machined brushed brass leg collars.",
    description:
      "Built to anchor formal dining rooms and executive hospitality spaces, the Oyo Dining Table pairs thick book-matched planks of sustainably harvested African walnut with exposed mortise-and-tenon joinery.\n\nEach monolithic trestle leg is fitted with hand-brushed unlacquered brass collars that develop a warm patina over time. Finished with three coats of natural hardwax oil for water and heat resistance while preserving the tactile open grain.",
    dimensions: "280 cm L × 110 cm W × 76 cm H (Custom lengths 220–360 cm available)",
    materials: "Solid African Walnut, Unlacquered Brushed Brass",
    finish: "Hand-rubbed matte natural hardwax oil",
    lead_time: "Made to order · 6–8 weeks",
    availability: "made_to_order",
    featured: true,
    image_path: "/images/portfolio/oyo-collection-cover.jpg",
    alt_text:
      "Oyo Sculptural Walnut Dining Table with brushed brass joinery on a travertine floor",
    gallery_paths: [
      {
        path: "/images/portfolio/ikoyi-penthouse-dining.jpg",
        alt: "Dining room installation of the solid hardwood table with upholstered linen chairs",
        caption: "Installed in the Ikoyi Penthouse dining room.",
      },
      {
        path: "/images/site/craftsmanship.jpg",
        alt: "Macro detail of precision walnut and brushed brass joinery in our studio",
        caption: "Hand-fitted brass and timber joinery detail from the Wura Atelier.",
      },
    ],
  },
  {
    id: "prod-adire-boucle-chair",
    name: "Adire Bouclé & Walnut Lounge Chair",
    slug: "adire-boucle-and-walnut-lounge-chair",
    category: "Seating",
    price: 1450000,
    summary:
      "Low-slung architectural lounge chair featuring a sculpted solid walnut frame, precision brass arm joints, and Belgian cream bouclé upholstery.",
    description:
      "Designed for quiet reading corners and formal living salons, the Adire Lounge Chair balances generous seating proportions with a sculptural timber silhouette that looks refined from every angle.\n\nThe solid African walnut frame is shaped by hand and joined with brushed brass dowels at the armrest knuckles. Deep high-resilience cushions are upholstered in heavyweight ivory Belgian bouclé.",
    dimensions: "82 cm W × 86 cm D × 74 cm H (Seat height: 41 cm)",
    materials: "Solid African Walnut, Brushed Brass, Heavyweight Cream Bouclé (72% Wool, 18% Linen, 10% Cotton)",
    finish: "Satin walnut oil & brushed brass",
    lead_time: "In stock · Delivers in 5–7 business days",
    availability: "in_stock",
    featured: true,
    image_path: "/images/store/boucle-chair.jpg",
    alt_text:
      "Adire Bouclé and Walnut Lounge Chair with brushed brass joints on a travertine floor",
    gallery_paths: [
      {
        path: "/images/site/craftsmanship.jpg",
        alt: "Close-up of the sculpted walnut frame and brushed brass joinery",
        caption: "Precision brass knuckle joinery on the solid walnut frame.",
      },
      {
        path: "/images/portfolio/abuja-study-nook.jpg",
        alt: "Adire bouclé armchair styled in an intimate reading nook with a brass floor lamp",
        caption: "Styled in the Abuja Private Gallery & Study.",
      },
    ],
  },
  {
    id: "prod-eko-travertine-table",
    name: "Eko Monolithic Travertine Coffee Table",
    slug: "eko-monolithic-travertine-coffee-table",
    category: "Tables",
    price: 1850000,
    summary:
      "Low-profile architectural coffee table carved from honed cream travertine with a subtly fluted plinth base and bevelled edge.",
    description:
      "Celebrating the quiet permanence of natural stone, the Eko Coffee Table is fabricated from select-grade honed cream travertine with unfilled pores that showcase the stone's organic veining.\n\nA recessed fluted plinth base gives the tabletop a floating silhouette while distributing weight evenly across hardwood or stone floors. Sealed with a breathable matte stone penetrator to guard against everyday spills.",
    dimensions: "140 cm L × 90 cm W × 36 cm H",
    materials: "Honed Natural Cream Travertine Stone",
    finish: "Unfilled matte honed finish with breathable protective sealer",
    lead_time: "In stock · Delivers in 5–7 business days",
    availability: "in_stock",
    featured: true,
    image_path: "/images/store/travertine-table.jpg",
    alt_text:
      "Eko Monolithic Travertine Coffee Table with fluted plinth base on an ivory wool rug",
    gallery_paths: [
      {
        path: "/images/site/hero-interior.jpg",
        alt: "Travertine coffee table styled in a sunlit living room with walnut and bouclé seating",
        caption: "Paired with the Ife Modular Sofa and Adire Lounge Chairs.",
      },
    ],
  },
  {
    id: "prod-oyo-fluted-credenza",
    name: "Oyo Fluted Walnut & Marble Credenza",
    slug: "oyo-fluted-walnut-and-marble-credenza",
    category: "Storage",
    price: 2950000,
    summary:
      "Four-door low sideboard with hand-fluted walnut fascia, honed cream marble top, soft-close cabinetry, and aged brass pulls.",
    description:
      "Equally suited to dining rooms, media lounges, and executive offices, the Oyo Credenza conceals generous storage behind seamless rhythmically fluted walnut doors.\n\nA inset slab of honed cream marble rests atop the carcass with a shadow-gap reveal, complemented by solid turned brass pulls and adjustable interior walnut shelving with discreet cable management.",
    dimensions: "220 cm L × 50 cm D × 78 cm H",
    materials: "Solid & Veneered African Walnut, Honed Cream Marble, Aged Brushed Brass",
    finish: "Natural matte timber oil & honed stone",
    lead_time: "Made to order · 5–6 weeks",
    availability: "made_to_order",
    featured: true,
    image_path: "/images/portfolio/oyo-collection-credenza.jpg",
    alt_text:
      "Oyo Fluted Walnut and Marble Credenza against a warm limewash wall",
    gallery_paths: [
      {
        path: "/images/site/about-studio.jpg",
        alt: "Material palette of honed stone, brass hardware, and walnut timber",
        caption: "Timber, stone, and solid brass hardware selections.",
      },
    ],
  },
  {
    id: "prod-zaria-brass-chandelier",
    name: "Zaria Brushed Brass Linear Chandelier",
    slug: "zaria-brushed-brass-linear-chandelier",
    category: "Lighting",
    price: 1150000,
    summary:
      "Architectural linear pendant crafted from hand-brushed unlacquered brass and warm opal alabaster glass diffusers.",
    description:
      "The Zaria Linear Chandelier casts a warm, glare-free ambient glow across dining tables, kitchen islands, and boardrooms. Hand-brazed in small batches from solid brass tubing, its balanced geometry pairs crisp horizontal lines with softly illuminated diffusers.\n\nSupplied with adjustable drop rods and warm-dimmable 2700K LED lamps.",
    dimensions: "160 cm L × 24 cm W × 35 cm H (Custom drop height 60–180 cm)",
    materials: "Solid Unlacquered Brushed Brass, Honed Opal Glass Diffusers",
    finish: "Hand-brushed satin brass",
    lead_time: "Made to order · 3–4 weeks",
    availability: "made_to_order",
    featured: false,
    image_path: "/images/store/brass-chandelier.jpg",
    alt_text:
      "Zaria Brushed Brass Linear Chandelier with warm glowing opal cylinders",
    gallery_paths: [
      {
        path: "/images/portfolio/ikoyi-penthouse-dining.jpg",
        alt: "Linear brass chandelier suspended above a ten-seater dining table",
        caption: "Suspended above a 10-seater dining table in Ikoyi.",
      },
    ],
  },
  {
    id: "prod-ife-linen-sofa",
    name: "Ife Curved Linen Modular Sofa",
    slug: "ife-curved-linen-modular-sofa",
    category: "Seating",
    price: 4200000,
    summary:
      "Three-seater architectural curved sofa upholstered in heavyweight sand Belgian linen over a kiln-dried iroko plinth.",
    description:
      "Designed to encourage conversation and soften rectilinear rooms, the Ife Curved Sofa combines a sweeping organic backrest with tailored bolster cushions and a recessed dark walnut/iroko timber plinth.\n\nConstructed with a kiln-dried hardwood frame, webbed suspension, and multi-density feather-wrapped foam cores for enduring structure and sink-in comfort.",
    dimensions: "310 cm W × 115 cm D × 76 cm H (Seat height: 42 cm)",
    materials: "100% Heavyweight Belgian Linen, Kiln-Dried Iroko & Walnut Base, Feather-Wrapped High-Resilience Foam",
    finish: "Warm Sand Linen & Dark Stained Timber Plinth",
    lead_time: "Made to order · 4–6 weeks",
    availability: "made_to_order",
    featured: false,
    image_path: "/images/store/linen-sofa.jpg",
    alt_text:
      "Ife Curved Linen Modular Sofa in warm sand Belgian linen with dark wood base",
    gallery_paths: [
      {
        path: "/images/portfolio/ikoyi-penthouse-cover.jpg",
        alt: "Curved linen sofa installed in the Ikoyi Penthouse living room",
        caption: "Custom configuration in the Ikoyi Penthouse Residence.",
      },
    ],
  },
  {
    id: "prod-kano-cane-daybed",
    name: "Kano Woven Cane & Teak Daybed",
    slug: "kano-woven-cane-and-teak-daybed",
    category: "Seating",
    price: 1950000,
    summary:
      "Minimalist architectural daybed in solid plantation teak with a handwoven rattan cane backrest and ivory linen cushion.",
    description:
      "Inspired by tropical modernist verandahs, the Kano Daybed brings airy texture to sunlit living rooms, galleries, and primary bedroom suites.\n\nThe solid teak frame is mortised by hand and accented with brushed brass foot caps, supporting a breathable handwoven natural cane backrest panel and a piped ivory linen mattress with bolster.",
    dimensions: "205 cm L × 85 cm W × 68 cm H (Seat height: 40 cm)",
    materials: "Solid Plantation Teak, Natural Rattan Cane, Ivory Linen, Brushed Brass",
    finish: "Natural matte teak oil",
    lead_time: "Made to order · 4–5 weeks",
    availability: "made_to_order",
    featured: false,
    image_path: "/images/store/cane-daybed.jpg",
    alt_text:
      "Kano Woven Cane and Teak Daybed with tailored ivory linen cushion and brass leg caps",
    gallery_paths: [
      {
        path: "/images/portfolio/lekki-villa-cover.jpg",
        alt: "Teak and woven cane seating in the Lekki Coastal Villa",
        caption: "Coastal living room styling with travertine flooring.",
      },
    ],
  },
  {
    id: "prod-benin-ceramic-vessels",
    name: "Benin Stoneware & Brass Vessels (Set of 3)",
    slug: "benin-stoneware-and-brass-vessels",
    category: "Objects & Decor",
    price: 380000,
    summary:
      "Trio of wheel-thrown architectural stoneware vessels in matte ivory and warm terracotta with hand-fitted brushed brass neck rings.",
    description:
      "Created in collaboration with master ceramicists, this graduated trio of architectural vessels is wheel-thrown from coarse stoneware clay and fired to a tactile unglazed matte finish.\n\nEach vessel is crowned with a removable hand-spun brushed brass collar, designed to style consoles, dining tables, and open shelving as standalone sculptures or with dried botanicals.",
    dimensions: "Tall: 42 cm H · Medium: 31 cm H · Low: 22 cm H",
    materials: "Wheel-Thrown Stoneware Clay, Hand-Spun Brushed Brass",
    finish: "Raw matte ivory & warm terracotta with satin brass",
    lead_time: "In stock · Delivers in 3–5 business days",
    availability: "in_stock",
    featured: false,
    image_path: "/images/store/ceramic-vessels.jpg",
    alt_text:
      "Set of three matte ivory and terracotta stoneware vases with brushed brass neck rings on travertine",
    gallery_paths: [
      {
        path: "/images/portfolio/oyo-collection-cover.jpg",
        alt: "Ceramic vessels styled on the Oyo walnut dining table",
        caption: "Styled atop the Oyo Sculptural Walnut Dining Table.",
      },
    ],
  },
];
