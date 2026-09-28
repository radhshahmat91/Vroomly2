import type { Car, Paginated } from "@/types";

export const DEMO_CARS: Car[] = [
  {
    "_id": "demo-car-01",
    "owner": {
      "_id": "demo-owner-owner1",
      "name": "Rahim Uddin",
      "avatar": "https://i.pravatar.cc/300?img=12",
      "phone": "+8801711111111",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Toyota",
    "model": "Corolla Altis",
    "year": 2022,
    "category": "Sedan",
    "pricePerDay": 45,
    "discountWeeklyPercent": 8,
    "discountMonthlyPercent": 20,
    "seats": 5,
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "location": {
      "address": "Road 11, Gulshan 2",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.4152,
          23.7936
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/2020_Toyota_Corolla_Altis_petrol_version_front.jpg/1280px-2020_Toyota_Corolla_Altis_petrol_version_front.jpg"
    ],
    "features": [
      "Air conditioning",
      "Bluetooth audio",
      "Reverse camera",
      "Cruise control"
    ],
    "description": "A dependable, fuel-sipping sedan that is equally at home in Dhaka traffic or on a highway run to Cox's Bazar. Recently serviced with new tyres.",
    "licensePlate": "DHA-1201",
    "isApproved": true,
    "title": "Toyota Corolla Altis",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.9,
    "ratingCount": 38,
    "totalBookings": 52,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-02",
    "owner": {
      "_id": "demo-owner-owner1",
      "name": "Rahim Uddin",
      "avatar": "https://i.pravatar.cc/300?img=12",
      "phone": "+8801711111111",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Honda",
    "model": "CR-V",
    "year": 2023,
    "category": "SUV",
    "pricePerDay": 70,
    "discountWeeklyPercent": 10,
    "discountMonthlyPercent": 22,
    "seats": 5,
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "location": {
      "address": "Road 27, Banani",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.4066,
          23.7936
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Facelift_2020_Honda_CR-V.jpg/1280px-Facelift_2020_Honda_CR-V.jpg"
    ],
    "features": [
      "Air conditioning",
      "Sunroof",
      "Apple CarPlay",
      "Reverse camera",
      "Leather seats"
    ],
    "description": "Nearly new CR-V with plenty of boot space — a comfortable pick for family trips or airport runs.",
    "licensePlate": "DHA-1202",
    "isApproved": true,
    "title": "Honda CR-V",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.8,
    "ratingCount": 31,
    "totalBookings": 41,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-03",
    "owner": {
      "_id": "demo-owner-owner1",
      "name": "Rahim Uddin",
      "avatar": "https://i.pravatar.cc/300?img=12",
      "phone": "+8801711111111",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Toyota",
    "model": "Premio",
    "year": 2019,
    "category": "Sedan",
    "pricePerDay": 38,
    "discountWeeklyPercent": 5,
    "discountMonthlyPercent": 15,
    "seats": 5,
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "location": {
      "address": "Gulshan 1 Circle",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.4078,
          23.7808
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Toyota_Premio%2C_Bangladesh._%2832038852164%29.jpg/1280px-Toyota_Premio%2C_Bangladesh._%2832038852164%29.jpg"
    ],
    "features": [
      "Air conditioning",
      "Bluetooth audio"
    ],
    "description": "Well-maintained Premio, a favourite for its smooth ride and low running costs.",
    "licensePlate": "DHA-1203",
    "isApproved": true,
    "title": "Toyota Premio",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.7,
    "ratingCount": 24,
    "totalBookings": 35,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-04",
    "owner": {
      "_id": "demo-owner-owner1",
      "name": "Rahim Uddin",
      "avatar": "https://i.pravatar.cc/300?img=12",
      "phone": "+8801711111111",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "BMW",
    "model": "3 Series",
    "year": 2022,
    "category": "Luxury",
    "pricePerDay": 110,
    "discountWeeklyPercent": 10,
    "discountMonthlyPercent": 25,
    "seats": 5,
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "location": {
      "address": "Road 11, Banani",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.403,
          23.7945
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/BMW_3-Series_%28G20%29_330_e_%282022%29_%2852569079269%29.jpg/1280px-BMW_3-Series_%28G20%29_330_e_%282022%29_%2852569079269%29.jpg"
    ],
    "features": [
      "Leather seats",
      "Sunroof",
      "Premium sound system",
      "Adaptive cruise control",
      "Heated seats"
    ],
    "description": "Turn heads on the way to your next meeting. Immaculately kept, garage stored.",
    "licensePlate": "DHA-1204",
    "isApproved": true,
    "title": "BMW 3 Series",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.9,
    "ratingCount": 19,
    "totalBookings": 29,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-05",
    "owner": {
      "_id": "demo-owner-owner1",
      "name": "Rahim Uddin",
      "avatar": "https://i.pravatar.cc/300?img=12",
      "phone": "+8801711111111",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Mercedes-Benz",
    "model": "C-Class",
    "year": 2021,
    "category": "Luxury",
    "pricePerDay": 130,
    "discountWeeklyPercent": 12,
    "discountMonthlyPercent": 25,
    "seats": 5,
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "location": {
      "address": "Gulshan Avenue",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.4145,
          23.792
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Mercedes-Benz_C_200_%28W206%2C_2025%29_%2854740572519%29.jpg/1280px-Mercedes-Benz_C_200_%28W206%2C_2025%29_%2854740572519%29.jpg"
    ],
    "features": [
      "Leather seats",
      "Panoramic sunroof",
      "Ambient lighting",
      "Premium sound system"
    ],
    "description": "A quiet, composed ride for weddings, airport pickups, or corporate events.",
    "licensePlate": "DHA-1205",
    "isApproved": true,
    "title": "Mercedes-Benz C-Class",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.8,
    "ratingCount": 17,
    "totalBookings": 24,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-06",
    "owner": {
      "_id": "demo-owner-owner2",
      "name": "Ayesha Karim",
      "avatar": "https://i.pravatar.cc/300?img=47",
      "phone": "+8801722222222",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Hyundai",
    "model": "Tucson",
    "year": 2021,
    "category": "SUV",
    "pricePerDay": 60,
    "discountWeeklyPercent": 8,
    "discountMonthlyPercent": 18,
    "seats": 5,
    "fuelType": "Diesel",
    "transmission": "Automatic",
    "location": {
      "address": "Road 8, Dhanmondi",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.3742,
          23.7461
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Hyundai_Tucson_%28NX4%29.png/1280px-Hyundai_Tucson_%28NX4%29.png"
    ],
    "features": [
      "Air conditioning",
      "Reverse camera",
      "Roof rails",
      "Bluetooth audio"
    ],
    "description": "Spacious diesel SUV, great for longer trips outside the city — good mileage and a smooth highway ride.",
    "licensePlate": "DHA-2101",
    "isApproved": true,
    "title": "Hyundai Tucson",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.7,
    "ratingCount": 28,
    "totalBookings": 38,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-07",
    "owner": {
      "_id": "demo-owner-owner2",
      "name": "Ayesha Karim",
      "avatar": "https://i.pravatar.cc/300?img=47",
      "phone": "+8801722222222",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Tesla",
    "model": "Model 3",
    "year": 2023,
    "category": "Electric",
    "pricePerDay": 95,
    "discountWeeklyPercent": 10,
    "discountMonthlyPercent": 20,
    "seats": 5,
    "fuelType": "Electric",
    "transmission": "Automatic",
    "location": {
      "address": "Sector 4, Uttara",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.3795,
          23.8759
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Tesla_Model3.jpg/1280px-Tesla_Model3.jpg"
    ],
    "features": [
      "Autopilot",
      "Premium sound system",
      "Glass roof",
      "Fast charging included"
    ],
    "description": "Silent, quick, and effectively free to run — comes with a home charger cable and a full battery at pickup.",
    "licensePlate": "DHA-2102",
    "isApproved": true,
    "title": "Tesla Model 3",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.9,
    "ratingCount": 22,
    "totalBookings": 31,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-08",
    "owner": {
      "_id": "demo-owner-owner2",
      "name": "Ayesha Karim",
      "avatar": "https://i.pravatar.cc/300?img=47",
      "phone": "+8801722222222",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Nissan",
    "model": "X-Trail",
    "year": 2020,
    "category": "SUV",
    "pricePerDay": 58,
    "discountWeeklyPercent": 7,
    "discountMonthlyPercent": 18,
    "seats": 5,
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "location": {
      "address": "Sector 10, Uttara",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.3958,
          23.87
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/T33_NISSAN_X-TRAIL.jpg/1280px-T33_NISSAN_X-TRAIL.jpg"
    ],
    "features": [
      "Air conditioning",
      "Third-row seating",
      "Reverse camera"
    ],
    "description": "Practical family SUV with a third row for the occasional extra passenger.",
    "licensePlate": "DHA-2103",
    "isApproved": true,
    "title": "Nissan X-Trail",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.6,
    "ratingCount": 16,
    "totalBookings": 22,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-09",
    "owner": {
      "_id": "demo-owner-owner2",
      "name": "Ayesha Karim",
      "avatar": "https://i.pravatar.cc/300?img=47",
      "phone": "+8801722222222",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Hyundai",
    "model": "Ioniq",
    "year": 2023,
    "category": "Electric",
    "pricePerDay": 75,
    "discountWeeklyPercent": 9,
    "discountMonthlyPercent": 20,
    "seats": 5,
    "fuelType": "Electric",
    "transmission": "Automatic",
    "location": {
      "address": "Satmasjid Road, Dhanmondi",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.373,
          23.75
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Hyundai_Ioniq.jpg/1280px-Hyundai_Ioniq.jpg"
    ],
    "features": [
      "Regenerative braking",
      "Apple CarPlay",
      "Lane assist"
    ],
    "description": "A calm, efficient electric hatchback-sedan crossover for city driving.",
    "licensePlate": "DHA-2104",
    "isApproved": false,
    "title": "Hyundai Ioniq",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.8,
    "ratingCount": 14,
    "totalBookings": 19,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-10",
    "owner": {
      "_id": "demo-owner-owner3",
      "name": "Tanvir Hasan",
      "avatar": "https://i.pravatar.cc/300?img=33",
      "phone": "+8801733333333",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Mitsubishi",
    "model": "Pajero",
    "year": 2020,
    "category": "SUV",
    "pricePerDay": 65,
    "discountWeeklyPercent": 8,
    "discountMonthlyPercent": 18,
    "seats": 7,
    "fuelType": "Diesel",
    "transmission": "Manual",
    "location": {
      "address": "Mirpur 10",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.3654,
          23.8069
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Mitsubishi_Pajero.jpg/1280px-Mitsubishi_Pajero.jpg"
    ],
    "features": [
      "4x4",
      "Roof rails",
      "Tow bar",
      "Air conditioning"
    ],
    "description": "Rugged 7-seater, well suited to weekend trips outside the city or a big group.",
    "licensePlate": "DHA-3101",
    "isApproved": true,
    "title": "Mitsubishi Pajero",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.7,
    "ratingCount": 21,
    "totalBookings": 27,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-11",
    "owner": {
      "_id": "demo-owner-owner3",
      "name": "Tanvir Hasan",
      "avatar": "https://i.pravatar.cc/300?img=33",
      "phone": "+8801733333333",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Suzuki",
    "model": "Alto",
    "year": 2021,
    "category": "Hatchback",
    "pricePerDay": 25,
    "discountWeeklyPercent": 5,
    "discountMonthlyPercent": 12,
    "seats": 4,
    "fuelType": "Petrol",
    "transmission": "Manual",
    "location": {
      "address": "Mirpur 2",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.359,
          23.818
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Suzuki_Alto.jpg/1280px-Suzuki_Alto.jpg"
    ],
    "features": [
      "Air conditioning",
      "Compact — easy to park"
    ],
    "description": "The cheapest way to get around town. Easy to drive, cheap on fuel, simple to park.",
    "licensePlate": "DHA-3102",
    "isApproved": true,
    "title": "Suzuki Alto",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.6,
    "ratingCount": 18,
    "totalBookings": 25,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-12",
    "owner": {
      "_id": "demo-owner-owner3",
      "name": "Tanvir Hasan",
      "avatar": "https://i.pravatar.cc/300?img=33",
      "phone": "+8801733333333",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Kia",
    "model": "Sportage",
    "year": 2023,
    "category": "SUV",
    "pricePerDay": 62,
    "discountWeeklyPercent": 8,
    "discountMonthlyPercent": 18,
    "seats": 5,
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "location": {
      "address": "Mirpur DOHS",
      "city": "Dhaka",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          90.369,
          23.828
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/2022_Kia_Sportage.jpg/1280px-2022_Kia_Sportage.jpg"
    ],
    "features": [
      "Apple CarPlay",
      "Android Auto",
      "Reverse camera",
      "Heated seats"
    ],
    "description": "Brand-new Sportage with all the modern conveniences.",
    "licensePlate": "DHA-3103",
    "isApproved": true,
    "title": "Kia Sportage",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.8,
    "ratingCount": 25,
    "totalBookings": 34,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-13",
    "owner": {
      "_id": "demo-owner-owner3",
      "name": "Tanvir Hasan",
      "avatar": "https://i.pravatar.cc/300?img=33",
      "phone": "+8801733333333",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Toyota",
    "model": "Hiace",
    "year": 2019,
    "category": "Van",
    "pricePerDay": 80,
    "discountWeeklyPercent": 10,
    "discountMonthlyPercent": 20,
    "seats": 12,
    "fuelType": "Diesel",
    "transmission": "Manual",
    "location": {
      "address": "Agrabad Access Road",
      "city": "Chattogram",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          91.8123,
          22.3255
        ]
      }
    },
    "images": [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Toyota_HiAce_Van_DX_%2720_%281%29.jpg/1280px-Toyota_HiAce_Van_DX_%2720_%281%29.jpg"
    ],
    "features": [
      "12 seats",
      "Luggage rack",
      "Air conditioning"
    ],
    "description": "Ideal for group travel — office outings, family functions, or airport transfers for a full team.",
    "licensePlate": "CTG-4101",
    "isApproved": true,
    "title": "Toyota Hiace",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.7,
    "ratingCount": 12,
    "totalBookings": 17,
    "createdAt": "2026-01-15T00:00:00.000Z"
  },
  {
    "_id": "demo-car-14",
    "owner": {
      "_id": "demo-owner-owner3",
      "name": "Tanvir Hasan",
      "avatar": "https://i.pravatar.cc/300?img=33",
      "phone": "+8801733333333",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "brand": "Honda",
    "model": "Civic",
    "year": 2022,
    "category": "Sedan",
    "pricePerDay": 42,
    "discountWeeklyPercent": 6,
    "discountMonthlyPercent": 15,
    "seats": 5,
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "location": {
      "address": "GEC Circle",
      "city": "Chattogram",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          91.8168,
          22.359
        ]
      }
    },
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/%2722_Honda_Civic.jpg/1280px-%2722_Honda_Civic.jpg"
    ],
    "features": [
      "Air conditioning",
      "Bluetooth audio",
      "Alloy wheels"
    ],
    "description": "Sharp-looking Civic that is equally comfortable in city traffic or on the highway to Cox's Bazar.",
    "licensePlate": "CTG-4102",
    "isApproved": false,
    "title": "Honda Civic",
    "unavailableDates": [],
    "isActive": true,
    "ratingAvg": 4.9,
    "ratingCount": 20,
    "totalBookings": 26,
    "createdAt": "2026-01-15T00:00:00.000Z"
  }
];

export function searchDemoCars(filters: Record<string, unknown> = {}): Paginated<Car> {
  let cars = [...DEMO_CARS];
  const text = String(filters.q ?? "").trim().toLowerCase();
  if (text) cars = cars.filter((c) => `${c.brand} ${c.model} ${c.title} ${c.location.city}`.toLowerCase().includes(text));
  if (filters.brand) cars = cars.filter((c) => c.brand.toLowerCase() === String(filters.brand).toLowerCase());
  if (filters.category) cars = cars.filter((c) => c.category === filters.category);
  if (filters.fuelType) cars = cars.filter((c) => c.fuelType === filters.fuelType);
  if (filters.transmission) cars = cars.filter((c) => c.transmission === filters.transmission);
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const seats = filters.seats;
  if (typeof minPrice === "number") cars = cars.filter((c) => c.pricePerDay >= minPrice);
  if (typeof maxPrice === "number") cars = cars.filter((c) => c.pricePerDay <= maxPrice);
  if (typeof seats === "number") cars = cars.filter((c) => c.seats >= seats);
  if (filters.city) cars = cars.filter((c) => c.location.city.toLowerCase() === String(filters.city).toLowerCase());
  if (filters.sort === "price_asc") cars.sort((a,b) => a.pricePerDay-b.pricePerDay);
  else if (filters.sort === "price_desc") cars.sort((a,b) => b.pricePerDay-a.pricePerDay);
  else if (filters.sort === "rating") cars.sort((a,b) => b.ratingAvg-a.ratingAvg);
  const page = Math.max(1, Number(filters.page ?? 1));
  const limit = Math.max(1, Number(filters.limit ?? 12));
  const total = cars.length;
  const start=(page-1)*limit;
  return { count: total, total, page, pages: Math.max(1, Math.ceil(total/limit)), cars: cars.slice(start,start+limit) };
}
