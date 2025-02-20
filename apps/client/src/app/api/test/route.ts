import { usersTable } from "@/db/schema";
import { dbClient } from "@/utils/drizzle";

export const dynamic = "force-static";

export async function GET() {
  const users = await dbClient.select().from(usersTable);

  return Response.json({
    users,
  });
}
