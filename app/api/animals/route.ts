import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "db.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const animals = JSON.parse(fileContents);

    return NextResponse.json({
      data: animals,
      count: animals.length,
    });
  } catch (error) {
    console.error("Error fetching animals:", error);
    return NextResponse.json(
      { error: "Failed to fetch animals" },
      { status: 500 }
    );
  }
}
