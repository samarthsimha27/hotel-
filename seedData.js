import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Import Mongoose Models
import Employee from './models/Employee.js';
import Attendance from './models/Attendance.js';
import Booking from './models/Booking.js';
import Bill from './models/Bill.js';
import Admin from './models/Admin.js';
import Menu from './models/Menu.js';

// Load configurations dynamically resolve absolute path to backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Seeding payload arrays
const SEED_EMPLOYEES = [
  { employeeId: "LGH-EM-101", name: "Shreedahar Kattimani", role: "General Manager", status: "Active" },
  { employeeId: "LGH-EM-102", name: "Puttraj Galagi", role: "Executive Head Chef", status: "Active" },
  { employeeId: "LGH-EM-103", name: "Samarthsimhaa", role: "Operations Director", status: "Active" },
  { employeeId: "LGH-EM-104", name: "Rakesh Naik", role: "Front Desk Supervisor", status: "Active" },
  { employeeId: "LGH-EM-105", name: "Ram Naik", role: "Head of Guest Relations", status: "On Leave" },
  { employeeId: "LGH-EM-106", name: "Varad Katnali", role: "Chief Concierge", status: "Active" },
  { employeeId: "LGH-EM-107", name: "Sakshat Hadli", role: "Executive Housekeeper", status: "Active" },
  { employeeId: "LGH-EM-108", name: "Amit", role: "Fine Dining Maitre D'", status: "Off Duty" },
  { employeeId: "LGH-EM-109", name: "Pratik Chalwadi", role: "Lead Sommelier", status: "Active" },
  { employeeId: "LGH-EM-110", name: "Manoj Mathad", role: "Luxury Transport Lead", status: "Active" }
];

const SEED_MENU = [
  { name: "Beluga Caviar Reserve", category: "Starters", price: 290.00 },
  { name: "Truffle Burrata & Prosciutto", category: "Starters", price: 32.00 },
  { name: "Foie Gras Poêlé", category: "Starters", price: 45.00 },
  { name: "Oysters Rockefeller Imperiale", category: "Starters", price: 38.00 },
  { name: "Truffle Wild Mushroom Soup", category: "Starters", price: 25.00 },
  { name: "Lobster Thermidor", category: "Mains", price: 88.00 },
  { name: "A5 Miyazaki Wagyu Ribeye", category: "Mains", price: 185.00 },
  { name: "Saffron & Seafood Paella", category: "Mains", price: 68.00 },
  { name: "24K Gold Leaf Risotto", category: "Mains", price: 75.00 },
  { name: "Pan-Seared Chilean Sea Bass", category: "Mains", price: 74.00 },
  { name: "Dry-Aged Tomahawk Gold (For Two)", category: "Mains", price: 215.00 },
  { name: "Valrhona Chocolate Grand Soufflé", category: "Desserts", price: 26.00 },
  { name: "Golden Opera Cake", category: "Desserts", price: 22.00 },
  { name: "Crème Brûlée Royale", category: "Desserts", price: 19.00 },
  { name: "Saffron Pistachio Kulfi", category: "Desserts", price: 18.00 },
  { name: "Dom Pérignon Vintage Champagne", category: "Beverages", price: 420.00 },
  { name: "Royal Golden Assam Tea", category: "Beverages", price: 18.00 },
  { name: "The Legacy Manhattan", category: "Beverages", price: 35.00 },
  { name: "Louis XIII de Rémy Martin (1oz)", category: "Beverages", price: 380.00 },
  { name: "Imperial Golden Espresso Martini", category: "Beverages", price: 28.00 }
];

const seedDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("ERROR: Seed script terminated. MONGO_URI in .env is vacant.");
    process.exit(1);
  }

  try {
    console.log("Connecting to Legacy Grand MongoDB cluster...");
    await mongoose.connect(mongoUri);
    console.log("Connection secured successfully.");

    // 1. FLUSH / CLEAR EXISTING RECORDS
    console.log("Flushing previous database logs...");
    await Employee.deleteMany();
    await Attendance.deleteMany();
    await Booking.deleteMany();
    await Bill.deleteMany();
    await Admin.deleteMany();
    await Menu.deleteMany();
    console.log("Database successfully cleared.");

    // 2. SEED EMPLOYEES
    console.log("Seeding staff roster directory...");
    await Employee.insertMany(SEED_EMPLOYEES);
    console.log(`Successfully seeded ${SEED_EMPLOYEES.length} employee records.`);

    // 3. SEED MENU ITEMS
    console.log("Seeding fine-dining gastronomy menus...");
    await Menu.insertMany(SEED_MENU);
    console.log(`Successfully seeded ${SEED_MENU.length} menu items.`);

    // 4. SEED ADMIN ACCOUNT (Password hashes automatically via Pre-save hook!)
    console.log("Seeding Administrative Clearance credentials...");
    const adminUser = new Admin({
      username: "admin",
      password: "admin123",
      role: "Admin"
    });
    await adminUser.save();
    console.log("Administrative credential 'admin' secured and saved successfully.");

    // 5. DISCONNECT
    console.log("Database seeding finalized successfully.");
    await mongoose.disconnect();
    console.log("Connection closed gracefully.");
    process.exit(0);

  } catch (error) {
    console.error("CRITICAL EXCEPTION during Database seeding operations:");
    console.error(error.message);
    process.exit(1);
  }
};

// Initiate Seed
seedDatabase();
