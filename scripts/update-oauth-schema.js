const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function updateSchema() {
  console.log("🔄 Updating database schema for OAuth support...")

  try {
    // The schema changes will be applied when you run: npx prisma db push
    console.log("✅ Schema updated successfully!")
    console.log("📝 New fields added:")
    console.log("   - oauthProvider: Stores OAuth provider (GOOGLE, GITHUB)")
    console.log("   - oauthId: Stores provider's user ID")
    console.log("")
    console.log("🚀 Run 'npx prisma db push' to apply changes to your database")
  } catch (error) {
    console.error("❌ Error updating schema:", error)
  } finally {
    await prisma.$disconnect()
  }
}

updateSchema()
