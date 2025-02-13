import { db } from "@/drizzle/db"


export const fetchPackaging = async () => {
    const packaging = await db.query.packagingTable.findMany();
    return packaging;
  };