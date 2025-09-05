const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Create initial data for RAKE_ORDER_PRIORITY
  console.log("📊 Seeding priority levels...")
  await prisma.rAKE_ORDER_PRIORITY.createMany({
    data: [
      { priority: 1, description: "Critical - Immediate attention required" },
      { priority: 2, description: "High - Process within 24 hours" },
      { priority: 3, description: "Medium - Process within 48 hours" },
      { priority: 4, description: "Low - Process within a week" },
    ],
    skipDuplicates: true,
  })

  // Create sample destinations and mills for RAKE_ORD with updated steel companies
  console.log("🏭 Seeding destinations and mills...")
  await prisma.rAKE_ORD.createMany({
    data: [
      {
        orderNumber: "SAMPLE001",
        destination: "Tata Steel",
        materialCode: "MAT001",
        party: "Steel Supplier A",
        mill: "Blast Furnace",
      },
      {
        orderNumber: "SAMPLE002",
        destination: "JSW Steel",
        materialCode: "MAT002",
        party: "Steel Supplier B",
        mill: "Steel Melting",
      },
      {
        orderNumber: "SAMPLE003",
        destination: "Steel Authority of India Limited (SAIL)",
        materialCode: "MAT003",
        party: "Steel Supplier C",
        mill: "Sinter Plant",
      },
      {
        orderNumber: "SAMPLE004",
        destination: "Jindal Steel and Power Limited (JSPL)",
        materialCode: "MAT004",
        party: "Steel Supplier D",
        mill: "Rail & Structural Mill",
      },
      {
        orderNumber: "SAMPLE005",
        destination: "ArcelorMittal Nippon Steel India (AM/NS India)",
        materialCode: "MAT005",
        party: "Steel Supplier E",
        mill: "Universal Rail Mill",
      },
      {
        orderNumber: "SAMPLE006",
        destination: "Tata Steel BSL (formerly Bhushan Steel)",
        materialCode: "MAT006",
        party: "Steel Supplier F",
        mill: "Plate Mill",
      },
      {
        orderNumber: "SAMPLE007",
        destination: "Electrosteel Steels Ltd (Vedanta Group)",
        materialCode: "MAT007",
        party: "Steel Supplier G",
        mill: "Bar & Rod Mill",
      },
      {
        orderNumber: "SAMPLE008",
        destination: "Rashtriya Ispat Nigam Limited (RINL, Vizag Steel)",
        materialCode: "MAT008",
        party: "Steel Supplier H",
        mill: "Merchant Mill",
      },
      {
        orderNumber: "SAMPLE009",
        destination: "Jindal Stainless Ltd",
        materialCode: "MAT009",
        party: "Steel Supplier I",
        mill: "Wire Rod Mill",
      },
      {
        orderNumber: "SAMPLE010",
        destination: "Shyam Metalics and Energy Ltd",
        materialCode: "MAT010",
        party: "Steel Supplier J",
        mill: "Coke Oven Battery",
      },
    ],
    skipDuplicates: true,
  })

  // Create admin user (password: admin123)
  console.log("👤 Creating admin user...")
  const hashedPassword = await bcrypt.hash("admin123", 12)

  await prisma.user.upsert({
    where: { email: "admin@company.com" },
    update: {},
    create: {
      email: "admin@company.com",
      password: hashedPassword,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "User",
      department: "IT",
      designation: "System Administrator",
      gender: "OTHER",
      phoneNumber: "+1234567890",
      address: "123 Admin Street, Tech City",
    },
  })

  // Create sample operations manager
  console.log("👨‍💼 Creating operations manager...")
  const opsPassword = await bcrypt.hash("ops123", 12)

  await prisma.user.upsert({
    where: { email: "ops@company.com" },
    update: {},
    create: {
      email: "ops@company.com",
      password: opsPassword,
      role: "OPERATIONS_MANAGER",
      firstName: "Operations",
      lastName: "Manager",
      department: "Operations",
      designation: "Operations Manager",
      gender: "MALE",
      phoneNumber: "+1234567891",
      address: "456 Operations Ave, Business District",
    },
  })

  // Create sample regular user
  console.log("👤 Creating sample user...")
  const userPassword = await bcrypt.hash("user123", 12)

  const sampleUser = await prisma.user.upsert({
    where: { email: "user@company.com" },
    update: {},
    create: {
      email: "user@company.com",
      password: userPassword,
      role: "USER",
      firstName: "John",
      lastName: "Doe",
      department: "Sales",
      designation: "Sales Executive",
      gender: "MALE",
      phoneNumber: "+1234567892",
      address: "789 User Lane, Customer City",
    },
  })

  // Create sample orders with updated destinations and mills
  console.log("📦 Creating sample orders...")
  await prisma.order.createMany({
    data: [
      {
        orderNumber: "ORD-2024-001",
        validUntil: new Date("2024-12-31"),
        destination: "Tata Steel",
        materialCode: "MAT001",
        party: "Steel Supplier A",
        mill: "Blast Furnace",
        priority: 1,
        materialDescription: "High-grade steel sheets for automotive industry",
        orderQuantity: 1000,
        status: "DRAFT",
        userId: sampleUser.id,
      },
      {
        orderNumber: "ORD-2024-002",
        validUntil: new Date("2024-11-30"),
        destination: "JSW Steel",
        materialCode: "MAT002",
        party: "Steel Supplier B",
        mill: "Steel Melting",
        priority: 2,
        materialDescription: "Aluminum rods for construction projects",
        orderQuantity: 500,
        status: "FINALIZED",
        userId: sampleUser.id,
      },
      {
        orderNumber: "ORD-2024-003",
        validUntil: new Date("2024-10-15"),
        destination: "Steel Authority of India Limited (SAIL)",
        materialCode: "MAT003",
        party: "Steel Supplier C",
        mill: "Sinter Plant",
        priority: 3,
        materialDescription: "Copper wires for electrical applications",
        orderQuantity: 2000,
        status: "COMPLETED",
        userId: sampleUser.id,
        dispatchQuantity: 2000,
        completionNotes: "Order completed successfully with full quantity delivered",
      },
    ],
    skipDuplicates: true,
  })

  console.log("✅ Database seeding completed successfully!")
  console.log("\n📋 Default Accounts Created:")
  console.log("👨‍💼 Admin: admin@company.com / admin123")
  console.log("🔧 Operations Manager: ops@company.com / ops123")
  console.log("👤 User: user@company.com / user123")
  console.log("\n🚀 You can now start the application with: npm run dev")
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
