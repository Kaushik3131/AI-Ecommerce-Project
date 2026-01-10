const fs = require("fs");

// Product templates for variety
const categories = [
  { id: "category-sofas", name: "Sofas", ref: "category-sofas" },
  { id: "category-chairs", name: "Chairs", ref: "category-chairs" },
  { id: "category-tables", name: "Tables", ref: "category-tables" },
  { id: "category-beds", name: "Beds", ref: "category-beds" },
  { id: "category-storage", name: "Storage", ref: "category-storage" },
  { id: "category-lighting", name: "Lighting", ref: "category-lighting" },
];

const materials = ["fabric", "leather", "wood", "metal", "glass"];
const colors = ["grey", "white", "black", "walnut", "oak", "natural"];

const productNames = {
  sofas: [
    "Sectional",
    "Loveseat",
    "Sleeper",
    "Chesterfield",
    "Mid-Century",
    "Modular",
    "Curved",
    "Tufted",
    "Velvet",
    "Linen",
  ],
  chairs: [
    "Dining",
    "Office",
    "Accent",
    "Lounge",
    "Rocking",
    "Wingback",
    "Gaming",
    "Bar Stool",
    "Folding",
    "Swivel",
  ],
  tables: [
    "Dining",
    "Coffee",
    "Console",
    "Side",
    "Nesting",
    "Pedestal",
    "Extending",
    "Live Edge",
    "Glass Top",
    "Marble",
  ],
  beds: [
    "Platform",
    "Canopy",
    "Storage",
    "Sleigh",
    "Four Poster",
    "Upholstered",
    "Bunk",
    "Loft",
    "Daybed",
    "Murphy",
  ],
  storage: [
    "Wardrobe",
    "Bookshelf",
    "Media Console",
    "Sideboard",
    "Dresser",
    "Cabinet",
    "Shelving Unit",
    "Chest",
    "Armoire",
    "Credenza",
  ],
  lighting: [
    "Floor Lamp",
    "Table Lamp",
    "Pendant",
    "Chandelier",
    "Wall Sconce",
    "Desk Lamp",
    "Arc Lamp",
    "LED Strip",
    "Track Lighting",
    "Ceiling Light",
  ],
};

const adjectives = [
  "Modern",
  "Classic",
  "Contemporary",
  "Vintage",
  "Rustic",
  "Industrial",
  "Scandinavian",
  "Minimalist",
  "Luxury",
  "Premium",
  "Elegant",
  "Stylish",
  "Sleek",
  "Artisan",
  "Handcrafted",
];

const images = {
  sofas: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
  chairs: "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200",
  tables: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=1200",
  beds: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
  storage:
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200",
  lighting:
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200",
};

function generateProduct(id, category) {
  const categoryKey = category.name.toLowerCase();
  const nameOptions = productNames[categoryKey];
  const productType =
    nameOptions[Math.floor(Math.random() * nameOptions.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const material = materials[Math.floor(Math.random() * materials.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const name = `${adjective} ${productType} ${category.name.slice(0, -1)}`;
  const slug = name.toLowerCase().replace(/\s+/g, "-") + `-${id}`;

  // Realistic pricing based on category (in INR)
  let minPrice, maxPrice;
  switch (categoryKey) {
    case "sofas":
      minPrice = 15000;
      maxPrice = 80000;
      break;
    case "chairs":
      minPrice = 5000;
      maxPrice = 40000;
      break;
    case "tables":
      minPrice = 8000;
      maxPrice = 60000;
      break;
    case "beds":
      minPrice = 20000;
      maxPrice = 75000;
      break;
    case "storage":
      minPrice = 10000;
      maxPrice = 50000;
      break;
    case "lighting":
      minPrice = 3000;
      maxPrice = 25000;
      break;
    default:
      minPrice = 5000;
      maxPrice = 30000;
  }

  const basePrice =
    Math.floor(Math.random() * (maxPrice - minPrice)) + minPrice;
  const price = Math.round(basePrice / 100) * 100 - 0.01; // Round to nearest 100, subtract 0.01

  const stock = Math.floor(Math.random() * 50);
  const featured = Math.random() > 0.8;
  const assemblyRequired = Math.random() > 0.5;

  const descriptions = [
    `Premium ${material} construction with exceptional attention to detail. Perfect for modern living spaces.`,
    `Handcrafted with sustainable materials, this piece combines form and function beautifully.`,
    `Contemporary design meets timeless elegance in this stunning furniture piece.`,
    `Expertly crafted to provide both comfort and style for years to come.`,
    `A statement piece that transforms any room with its unique character.`,
    `Designed with both aesthetics and durability in mind, built to last.`,
    `Features superior craftsmanship and premium materials throughout.`,
    `The perfect blend of modern design and practical functionality.`,
  ];

  const description =
    descriptions[Math.floor(Math.random() * descriptions.length)];

  const dimensions = [
    `${Math.floor(Math.random() * 150) + 100}cm x ${Math.floor(Math.random() * 100) + 50}cm x ${Math.floor(Math.random() * 100) + 50}cm`,
    `${Math.floor(Math.random() * 200) + 150}cm x ${Math.floor(Math.random() * 120) + 80}cm x ${Math.floor(Math.random() * 90) + 60}cm`,
    `${Math.floor(Math.random() * 100) + 50}cm x ${Math.floor(Math.random() * 80) + 40}cm x ${Math.floor(Math.random() * 120) + 70}cm`,
  ];

  return {
    _id: `prod-${String(id).padStart(3, "0")}`,
    _type: "product",
    name,
    slug: { _type: "slug", current: slug },
    description,
    price,
    category: { _type: "reference", _ref: category.ref },
    material,
    color,
    dimensions: dimensions[Math.floor(Math.random() * dimensions.length)],
    stock,
    featured,
    assemblyRequired,
    images: [{ _type: "image", _sanityAsset: `image@${images[categoryKey]}` }],
  };
}

// Generate category documents
const categoryDocs = categories.map((cat) => ({
  _id: cat.id,
  _type: "category",
  title: cat.name,
  slug: { _type: "slug", current: cat.name.toLowerCase() },
  image: {
    _type: "image",
    _sanityAsset: `image@${images[cat.name.toLowerCase()]}`,
  },
}));

// Generate 500 products
const products = [];
for (let i = 1; i <= 500; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  products.push(generateProduct(i, category));
}

// Combine and write to file
const allDocs = [...categoryDocs, ...products];
const ndjson = allDocs.map((doc) => JSON.stringify(doc)).join("\n") + "\n";

fs.writeFileSync("sample-data-500.ndjson", ndjson, "utf8");

console.log(
  `✅ Generated ${products.length} products across ${categories.length} categories`,
);
console.log(`📦 Total documents: ${allDocs.length}`);
console.log(`📄 File: sample-data-500.ndjson`);
console.log(`\nTo import to Sanity, run:`);
console.log(
  `sanity dataset import sample-data-500.ndjson production --replace`,
);
