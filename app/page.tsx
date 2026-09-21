import React from "react";
import { getDatabase } from "@/lib/db";
import { PortfolioView } from "@/components/portfolio-view";

export const revalidate = 0; // Dynamic server rendering for live CMS updates

export default async function HomePage() {
  const db = await getDatabase();

  return <PortfolioView initialData={db} />;
}
