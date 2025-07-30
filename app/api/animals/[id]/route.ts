import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Animal } from "@/types/animal";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const animalId = parseInt(id, 10);

    if (isNaN(animalId)) {
      return NextResponse.json(
        { error: "Invalid ID format. ID must be a number." },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "data", "db.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const animals = JSON.parse(fileContents);

    const animal = animals.find((animal: Animal) => animal.id === animalId);

    if (!animal) {
      return NextResponse.json(
        { error: `Animal with ID ${animalId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: animal,
    });
  } catch (error) {
    console.error("Error fetching animal:", error);
    return NextResponse.json(
      { error: "Failed to fetch animal" },
      { status: 500 }
    );
  }
}
