import Dexie from "dexie";

export const db = new Dexie("fishPondDB");
db.version(2).stores({
  ponds: "++id, name, slug, stock, createdAt", // Primary key and indexed props
  badges: "++id, fkey, name, createdAt",
  water_qualities: "++id, fkey, ph, oxygen_level, temparature, createdAt",
  stocking_densities: "++id, fkey, stocks, mortality, createdAt",
  feedings: "++id, fkey, feed_type, size, quantity, fcr, createdAt ",
  sortings: "++id, fkey, size, pondNumber, createdAt",
  archive:
    "++id, fkey, ar_joinFkey, name , *waterQuality, *stockDensity, *feeding, *sorting, createdAt",

  archive_join: "++id,  fkey, name, stock, createdAt",
});
