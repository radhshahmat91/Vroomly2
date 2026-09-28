/**
 * Real vehicle photographs matched to each demo model.
 * Images are Wikimedia Commons files with reuse-friendly licenses.
 * 1280px thumbnails are used to keep the site lighter than loading originals.
 */
export const CAR_IMAGE_MAP: Record<string, string> = {
  "Toyota Corolla Altis": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/2020_Toyota_Corolla_Altis_petrol_version_front.jpg/1280px-2020_Toyota_Corolla_Altis_petrol_version_front.jpg",
  "Honda CR-V": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Facelift_2020_Honda_CR-V.jpg/1280px-Facelift_2020_Honda_CR-V.jpg",
  "Toyota Premio": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Toyota_Premio%2C_Bangladesh._%2832038852164%29.jpg/1280px-Toyota_Premio%2C_Bangladesh._%2832038852164%29.jpg",
  "BMW 3 Series": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/BMW_3-Series_%28G20%29_330_e_%282022%29_%2852569079269%29.jpg/1280px-BMW_3-Series_%28G20%29_330_e_%282022%29_%2852569079269%29.jpg",
  "Mercedes-Benz C-Class": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Mercedes-Benz_C_200_%28W206%2C_2025%29_%2854740572519%29.jpg/1280px-Mercedes-Benz_C_200_%28W206%2C_2025%29_%2854740572519%29.jpg",
  "Hyundai Tucson": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Hyundai_Tucson_%28NX4%29.png/1280px-Hyundai_Tucson_%28NX4%29.png",
  "Tesla Model 3": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Tesla_Model3.jpg/1280px-Tesla_Model3.jpg",
  "Nissan X-Trail": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/T33_NISSAN_X-TRAIL.jpg/1280px-T33_NISSAN_X-TRAIL.jpg",
  "Hyundai Ioniq": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Hyundai_Ioniq.jpg/1280px-Hyundai_Ioniq.jpg",
  "Mitsubishi Pajero": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Mitsubishi_Pajero.jpg/1280px-Mitsubishi_Pajero.jpg",
  "Suzuki Alto": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Suzuki_Alto.jpg/1280px-Suzuki_Alto.jpg",
  "Kia Sportage": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/2022_Kia_Sportage.jpg/1280px-2022_Kia_Sportage.jpg",
  "Toyota Hiace": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Toyota_HiAce_Van_DX_%2720_%281%29.jpg/1280px-Toyota_HiAce_Van_DX_%2720_%281%29.jpg",
  "Honda Civic": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/%2722_Honda_Civic.jpg/1280px-%2722_Honda_Civic.jpg",
};

export function getCarImage(brand: string, model: string, current?: string) {
  return CAR_IMAGE_MAP[`${brand} ${model}`] ?? current ?? "/media/car-placeholder.svg";
}

export function getCarImages(brand: string, model: string, images?: string[]) {
  const mapped = CAR_IMAGE_MAP[`${brand} ${model}`];
  if (mapped) return [mapped];
  return images?.length ? images : ["/media/car-placeholder.svg"];
}
