-- =============================================================================
-- Wura Interiors — optional seed data for categories, portfolio projects,
-- project images (served from /public/images/portfolio/*), services, and settings.
-- Run after 0001_init.sql in the Supabase SQL Editor if you want the initial
-- portfolio and services editable in /admin.
-- =============================================================================

begin;

-- 1. Categories
insert into public.categories (id, name, slug, sort_order)
values
  ('11111111-1111-4111-8111-111111111101', 'Residential', 'residential', 1),
  ('11111111-1111-4111-8111-111111111102', 'Commercial', 'commercial', 2),
  ('11111111-1111-4111-8111-111111111103', 'Bespoke Furniture', 'bespoke-furniture', 3),
  ('11111111-1111-4111-8111-111111111104', 'Hospitality', 'hospitality', 4)
on conflict (slug) do nothing;

-- 2. Projects (inserted as 'draft' first so images can be attached before publishing)
insert into public.projects (
  id, title, slug, summary, description, category_id, location, completed_on, featured, status
)
values
  (
    '22222222-2222-4222-8222-222222222201',
    'Ikoyi Penthouse Residence',
    'ikoyi-penthouse-residence',
    'A full-floor lagoon-view residence anchored by warm walnut herringbone floors, travertine stonework, and custom linen upholstery.',
    E'Overlooking the Lagos lagoon, this full-floor penthouse was reimagined from shell and core to create a serene sanctuary for entertaining and family life. We introduced warm walnut herringbone flooring throughout the living areas, paired with hand-trowelled ivory limewash walls that soften the equatorial sunlight.\n\nIn the main salon, a custom curved bouclé and linen sectional frames the water view while blackened steel and brushed brass shelving anchors the architectural volume. The formal dining room features a ten-seater solid iroko table beneath a sculptural linear brass chandelier, flowing seamlessly into a calm primary suite wrapped in sand-toned drapery.',
    '11111111-1111-4111-8111-111111111101',
    'Ikoyi, Lagos',
    '2025-11-15',
    true,
    'draft'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'Victoria Island Executive Lounge',
    'victoria-island-executive-lounge',
    'A private executive floor and client reception crafted with dark stained oak, monolithic travertine, and saddle leather.',
    E'Designed for a private investment firm in Victoria Island, this executive suite replaces conventional corporate austerity with hospitality-grade warmth and acoustic privacy.\n\nGuests arrive at a monolithic honed travertine reception desk detailed with brushed brass inlay, set against dark stained oak wall panelling and warm architectural cove lighting. The adjoining boardroom centres on a custom 14-foot stone and walnut conference table surrounded by cognac saddle-leather seating and slatted timber acoustic walls.',
    '11111111-1111-4111-8111-111111111102',
    'Victoria Island, Lagos',
    '2025-09-28',
    true,
    'draft'
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    'The Oyo Walnut & Brass Collection',
    'oyo-walnut-and-brass-collection',
    'A limited series of sculptural dining tables and fluted sideboards celebrating West African hardwood and precision brass joinery.',
    E'Developed in our furniture workshop, the Oyo Collection explores the dialogue between heavy architectural timber and refined metalwork. Each piece is built to order from sustainably sourced African walnut, kiln-dried and finished with natural plant oils to preserve the open grain.\n\nExposed mortise-and-tenon joints are reinforced with hand-machined brushed brass collars and pulls, paired with honed cream marble and travertine surfaces that gain character with daily use.',
    '11111111-1111-4111-8111-111111111103',
    'Lagos Atelier',
    '2025-08-12',
    true,
    'draft'
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    'Lekki Coastal Villa',
    'lekki-coastal-villa',
    'An airy double-height family villa balancing cool travertine stone, woven cane, and monolithic kitchen millwork.',
    E'Conceived for effortless indoor-outdoor living near the Atlantic coast, this family villa embraces natural ventilation, abundant daylight, and cool underfoot textures. Honed travertine slabs run continuously from the double-height living room out to the terrace.\n\nCustom teak and woven cane lounge seating pairs with deep ivory linen sofas, while the open-plan kitchen is anchored by a monolithic fluted travertine island and floor-to-ceiling warm oak cabinetry.',
    '11111111-1111-4111-8111-111111111101',
    'Lekki Phase 1, Lagos',
    '2025-06-20',
    true,
    'draft'
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    'Maitama Boutique Hotel Suite',
    'maitama-boutique-hotel-suite',
    'A tranquil presidential suite and spa bath in Abuja crafted with dark walnut canopy millwork and carved stone.',
    E'For an intimate boutique hotel in Maitama, we designed the flagship suites to feel like a private collector''s residence rather than a transient hotel room. A custom four-poster canopy bed in dark walnut defines the sleeping zone, dressed in breathable earth-toned Belgian linens.\n\nThe adjoining en-suite bath is wrapped in book-matched travertine slabs, featuring a freestanding carved stone soaking tub, brushed brass floor-mounted brassware, and warm indirect lighting.',
    '11111111-1111-4111-8111-111111111104',
    'Maitama, Abuja',
    '2025-04-10',
    true,
    'draft'
  ),
  (
    '22222222-2222-4222-8222-222222222206',
    'Abuja Private Gallery & Study',
    'abuja-private-gallery-and-study',
    'A quiet-luxury home library and collector''s study with floor-to-ceiling walnut joinery and integrated gallery lighting.',
    E'Created for an art patron and avid reader, this private study combines museum-grade display lighting with the intimacy of a traditional timber-lined library. Floor-to-ceiling walnut shelving is custom-fitted with concealed warm LED channels to illuminate sculptures, rare books, and works on paper.\n\nA sculptural solid walnut writing desk commands the centre of the room, balanced by an intimate reading nook with a custom cream bouclé armchair and brushed brass floor lamp.',
    '11111111-1111-4111-8111-111111111101',
    'Asokoro, Abuja',
    '2025-02-18',
    true,
    'draft'
  )
on conflict (slug) do nothing;

-- 3. Project images
insert into public.project_images (
  id, project_id, storage_path, caption, alt_text, width, height, sort_order, is_cover
)
values
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222201', '/images/portfolio/ikoyi-penthouse-cover.jpg', 'Main living salon with custom curved linen sectional, brass shelving, and walnut herringbone floors.', 'Luxury penthouse living room overlooking the lagoon with cream sectional sofa and walnut herringbone floor', 1600, 1200, 0, true),
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222201', '/images/portfolio/ikoyi-penthouse-dining.jpg', 'Ten-seater solid iroko dining table paired with upholstered linen chairs and a sculptural brass pendant.', 'Formal dining room with solid wood table, linen chairs, and brushed brass linear chandelier', 1600, 1200, 1, false),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222201', '/images/portfolio/ikoyi-penthouse-suite.jpg', 'Primary bedroom suite featuring a full-width upholstered sand linen headboard and floating walnut nightstands.', 'Serene primary bedroom with sand linen headboard, brass sconces, and sheer floor-to-ceiling curtains', 1600, 1200, 2, false),
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222202', '/images/portfolio/vi-lounge-cover.jpg', 'Client reception and private lounge with travertine desk, brass inlay, and cognac leather armchairs.', 'Executive reception lounge with dark oak panelling, travertine desk, and cognac leather armchairs', 1600, 1200, 0, true),
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222202', '/images/portfolio/vi-lounge-boardroom.jpg', 'Acoustic slatted timber boardroom with a bespoke travertine and walnut conference table.', 'Executive boardroom with stone and walnut conference table and saddle-leather chairs', 1600, 1200, 1, false),
  ('33333333-3333-4333-8333-333333333306', '22222222-2222-4222-8222-222222222203', '/images/portfolio/oyo-collection-cover.jpg', 'Oyo sculptural dining table in solid African walnut with brushed brass architectural leg joinery.', 'Sculptural solid walnut dining table with brushed brass joinery on travertine stone floor', 1600, 1200, 0, true),
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222203', '/images/portfolio/oyo-collection-credenza.jpg', 'Low-profile fluted walnut sideboard credenza topped with honed cream marble and aged brass hardware.', 'Fluted walnut sideboard credenza with cream marble top and brass pulls against limewash wall', 1600, 1200, 1, false),
  ('33333333-3333-4333-8333-333333333308', '22222222-2222-4222-8222-222222222204', '/images/portfolio/lekki-villa-cover.jpg', 'Double-height coastal living room with honed travertine floors, teak and cane seating, and sheer linen drapery.', 'Sunlit double-height villa living room with travertine floors, cane lounge chairs, and linen sofas', 1600, 1200, 0, true),
  ('33333333-3333-4333-8333-333333333309', '22222222-2222-4222-8222-222222222204', '/images/portfolio/lekki-villa-kitchen.jpg', 'Architectural kitchen centred on a monolithic fluted travertine island with brushed brass fixtures.', 'Minimalist luxury kitchen with fluted travertine island, oak cabinetry, and wooden bar stools', 1600, 1200, 1, false),
  ('33333333-3333-4333-8333-333333333310', '22222222-2222-4222-8222-222222222205', '/images/portfolio/maitama-hotel-cover.jpg', 'Presidential suite with custom dark walnut four-poster canopy bed and warm brass pendant lighting.', 'Luxury boutique hotel suite with dark walnut four-poster canopy bed and earth-toned linen bedding', 1600, 1200, 0, true),
  ('33333333-3333-4333-8333-333333333311', '22222222-2222-4222-8222-222222222205', '/images/portfolio/maitama-hotel-bath.jpg', 'Spa-inspired en-suite bathroom with honed travertine walls and a freestanding stone soaking tub.', 'Spa bathroom with travertine walls, freestanding stone soaking tub, and brushed brass faucet', 1600, 1200, 1, false),
  ('33333333-3333-4333-8333-333333333312', '22222222-2222-4222-8222-222222222206', '/images/portfolio/abuja-study-cover.jpg', 'Custom floor-to-ceiling walnut bookshelves with integrated warm display lighting and sculptural writing desk.', 'Private library and study with floor-to-ceiling walnut bookshelves, writing desk, and velvet lounge chair', 1600, 1200, 0, true),
  ('33333333-3333-4333-8333-333333333313', '22222222-2222-4222-8222-222222222206', '/images/portfolio/abuja-study-nook.jpg', 'Reading corner with bespoke cream bouclé armchair, brushed brass floor lamp, and framed textile artwork.', 'Intimate reading nook with cream bouclé armchair, brass floor lamp, and framed textile art', 1600, 1200, 1, false)
on conflict (id) do nothing;

-- 4. Publish the seeded projects now that images are attached
update public.projects
set status = 'published',
    published_at = coalesce(published_at, now())
where id in (
  '22222222-2222-4222-8222-222222222201',
  '22222222-2222-4222-8222-222222222202',
  '22222222-2222-4222-8222-222222222203',
  '22222222-2222-4222-8222-222222222204',
  '22222222-2222-4222-8222-222222222205',
  '22222222-2222-4222-8222-222222222206'
);

-- 5. Services
insert into public.services (id, title, slug, summary, description, sort_order, status)
values
  (
    '44444444-4444-4444-8444-444444444401',
    'Residential Interior Design',
    'residential-interior-design',
    'End-to-end spatial planning, material specification, custom millwork, and turnkey furnishing for private homes and penthouses.',
    E'We guide residential projects from initial architectural review through to final styling and handover. Our team develops comprehensive spatial layouts, lighting plans, wall and floor finishes, kitchen and bath cabinetry, and room-by-room furniture selections.\n\nBy coordinating directly with contractors, artisans, and our in-house furniture workshop, we ensure every detail—from concealed drapery tracks to custom stone thresholds—is executed with quiet precision.',
    1,
    'published'
  ),
  (
    '44444444-4444-4444-8444-444444444402',
    'Bespoke Furniture & Millwork',
    'bespoke-furniture-and-millwork',
    'Made-to-measure dining tables, credenzas, upholstered seating, and architectural joinery crafted from kiln-dried hardwoods, brass, and stone.',
    E'Our furniture atelier designs and builds heirloom-grade pieces tailored to the exact proportions of your space. Working with sustainably sourced African walnut, iroko, oak, honed travertine, and brushed brass, we craft freestanding furniture as well as integrated wardrobes, libraries, and reception desks.\n\nEach commission includes technical shop drawings, timber and textile sampling, and white-glove delivery and installation.',
    2,
    'published'
  ),
  (
    '44444444-4444-4444-8444-444444444403',
    'Commercial & Hospitality Spaces',
    'commercial-and-hospitality-spaces',
    'Executive offices, private lounges, boutique hotels, and gallery spaces designed for durability, acoustic comfort, and brand presence.',
    E'We partner with founders, developers, and hospitality operators to create spaces that leave a lasting impression on guests and teams. Our commercial scope covers concept development, FF&E procurement, acoustic panelling, custom reception and boardroom furniture, and ambient lighting design.\n\nEvery material is selected to withstand high-traffic use while maintaining the warmth and refinement of a private residence.',
    3,
    'published'
  )
on conflict (slug) do nothing;

-- 6. Site settings
update public.site_settings
set tagline = coalesce(tagline, 'Bespoke residential, commercial, and hospitality interiors alongside custom-crafted furniture tailored to how you live and work.'),
    about_story = coalesce(about_story, E'Wura Interiors was founded on a quiet conviction: the spaces we inhabit every day shape our calm, our focus, and the way we gather. Working across residential homes, executive workplaces, and boutique hospitality spaces, our studio pairs spatial architecture with custom furniture making.\n\nEvery commission begins with listening—understanding how natural light moves through a room, how a family or team uses each corner, and which tactile materials will age with grace over decades rather than seasons.'),
    design_philosophy = coalesce(design_philosophy, E'We believe in warm minimalism grounded in honest materials: hand-rubbed African walnut and iroko timber, honed travertine stone, unlacquered brushed brass, and breathable natural linens.\n\nRather than filling rooms with ornament, we focus on proportion, joinery, and atmosphere—designing custom millwork and collectible pieces that belong unmistakably to their architecture.')
where id = 1;

commit;
