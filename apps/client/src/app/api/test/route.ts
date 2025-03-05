import { usersTable } from "@/db/schema";
import { getDbClient } from "@/utils/drizzle";

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDbClient();
  const users = await db.select().from(usersTable);

  return Response.json({
    users,
  });
}
