# ChipFindr - UK Fish & Chip Shop Directory

🍟 **The Ultimate Directory for UK Fish & Chip Shops** 🐟

A modern, high-performance directory website built with Astro, featuring comprehensive business listings, advanced search capabilities, and location-based pages for fish and chip shops across the UK.

## 🌟 Features

### ✅ **Currently Implemented**
- **🏠 Homepage**: Modern design with featured listings and search functionality
- **🔍 Advanced Search**: Real-time client-side search with debouncing and filtering
- **📍 Location Pages**: Dynamic pages for towns, counties, and postcode areas (`/location/brixham/`, `/location/devon/`, etc.)
- **🏪 Business Profiles**: Individual business pages with comprehensive details, ratings, and contact information
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **⚡ High Performance**: Static site generation with Astro for optimal speed
- **🎯 SEO Optimized**: URL structure and metadata optimized for local search

### 🚧 **In Development** (Phase 3)
- Meta tags and structured data (JSON-LD)
- XML sitemap generation
- Performance optimization and Core Web Vitals
- Category-based pages (`/[category]/`, `/[category]/[location]/`)

## 🏗️ **Technology Stack**

- **Frontend**: [Astro](https://astro.build/) (SSG/SSR hybrid)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Backend**: [Supabase](https://supabase.com/) (planned)
- **Search**: Client-side with planned Algolia integration
- **Maps**: Mapbox GL JS (planned)
- **Data Source**: Google Places API

## 📊 **Project Status**

**Phase 2: 95% Complete** ✅
- Core functionality operational
- Real data from 11+ businesses across Devon
- Search and location systems fully functional

**Next Phase**: SEO & Performance Optimization

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kogumauk/chipfindr-directory.git

# Navigate to project directory
cd chipfindr-directory

# Install dependencies
npm install

# Generate data and start development server
npm run dev
```

### Available Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Generate data and start development server at `localhost:4321` |
| `npm run build` | Generate data and build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run generate:data` | Generate listings JSON from source data |
| `npm run process:listings` | Process and validate listing data |
| `npm run sync:supabase` | Sync data to Supabase (when configured) |

## 📁 **Project Structure**

```
chipfindr-directory/
├── data/listings/          # Source JSON data files (Google Places API)
├── docs/                   # Project documentation and roadmap
├── public/                 # Static assets and generated data
├── scripts/                # Data processing and build scripts
├── src/
│   ├── components/         # Reusable Astro components
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route pages (file-based routing)
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── astro.config.mjs       # Astro configuration
└── tailwind.config.cjs    # Tailwind CSS configuration
```

## 🎯 **Key Pages**

- **Homepage** (`/`): Featured listings and search
- **Search Results** (`/search`): Advanced filtering and sorting
- **Location Directory** (`/location/`): Browse all locations
- **Location Pages** (`/location/[area]/`): Town, county, and postcode specific pages
- **Business Profiles** (`/business/[slug]/`): Individual shop details

## 📈 **Performance Goals**

- **Page Load Speed**: < 2 seconds
- **Core Web Vitals**: All green scores
- **Lighthouse SEO**: 95+ score
- **Accessibility**: WCAG 2.1 compliant

## 🤝 **Contributing**

This project follows a structured implementation roadmap. See `docs/implementation_roadmap.md` for detailed development phases and current status.

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 **Goal**

To become the **go-to destination** for anyone interested in UK fish and chip shops, providing comprehensive, accurate, and up-to-date information in a modern, user-friendly format.

---

**Built with ❤️ for fish and chip lovers across the UK** 🇬🇧
