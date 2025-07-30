import { Animal } from "../types/animal";
import animalsData from "../data/db.json";

describe("Animal Database Referential Integrity", () => {
  const animals: Animal[] = animalsData as Animal[];

  // Create a set of all valid animal IDs for fast lookup
  const validAnimalIds = new Set(animals.map((animal) => animal.id));

  describe("Data structure validation", () => {
    test("database should contain animals", () => {
      expect(animals).toBeDefined();
      expect(Array.isArray(animals)).toBe(true);
      expect(animals.length).toBeGreaterThan(0);
    });

    test("all animals should have required fields", () => {
      animals.forEach((animal) => {
        expect(animal).toHaveProperty("id");
        expect(animal).toHaveProperty("name");
        expect(animal).toHaveProperty("species");
        expect(animal).toHaveProperty("size");
        expect(animal).toHaveProperty("prey");
        expect(animal).toHaveProperty("predators");

        expect(typeof animal.id).toBe("number");
        expect(typeof animal.name).toBe("string");
        expect(typeof animal.species).toBe("string");
        expect(["small", "medium", "large"]).toContain(animal.size);
        expect(Array.isArray(animal.prey)).toBe(true);
        expect(Array.isArray(animal.predators)).toBe(true);
      });
    });

    test("all animal IDs should be unique", () => {
      const ids = animals.map((animal) => animal.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Referential integrity - Prey relationships", () => {
    test("all prey IDs should reference existing animals", () => {
      const brokenReferences: Array<{
        animalId: number;
        animalName: string;
        invalidPreyIds: number[];
      }> = [];

      animals.forEach((animal) => {
        const invalidPreyIds = animal.prey.filter(
          (preyId) => !validAnimalIds.has(preyId)
        );

        if (invalidPreyIds.length > 0) {
          brokenReferences.push({
            animalId: animal.id,
            animalName: animal.name,
            invalidPreyIds,
          });
        }
      });

      if (brokenReferences.length > 0) {
        const errorMessage = brokenReferences
          .map(
            (ref) =>
              `Animal ${ref.animalId} (${
                ref.animalName
              }) has invalid prey IDs: ${ref.invalidPreyIds.join(", ")}`
          )
          .join("\n");

        throw new Error(
          `Found ${brokenReferences.length} animals with broken prey references:\n${errorMessage}`
        );
      }

      expect(brokenReferences).toHaveLength(0);
    });

    test("no animal should prey on itself", () => {
      const selfPreyingAnimals = animals.filter((animal) =>
        animal.prey.includes(animal.id)
      );

      if (selfPreyingAnimals.length > 0) {
        const errorMessage = selfPreyingAnimals
          .map(
            (animal) => `Animal ${animal.id} (${animal.name}) preys on itself`
          )
          .join("\n");

        throw new Error(
          `Found animals that prey on themselves:\n${errorMessage}`
        );
      }

      expect(selfPreyingAnimals).toHaveLength(0);
    });
  });

  describe("Referential integrity - Predator relationships", () => {
    test("all predator IDs should reference existing animals", () => {
      const brokenReferences: Array<{
        animalId: number;
        animalName: string;
        invalidPredatorIds: number[];
      }> = [];

      animals.forEach((animal) => {
        const invalidPredatorIds = animal.predators.filter(
          (predatorId) => !validAnimalIds.has(predatorId)
        );

        if (invalidPredatorIds.length > 0) {
          brokenReferences.push({
            animalId: animal.id,
            animalName: animal.name,
            invalidPredatorIds,
          });
        }
      });

      if (brokenReferences.length > 0) {
        const errorMessage = brokenReferences
          .map(
            (ref) =>
              `Animal ${ref.animalId} (${
                ref.animalName
              }) has invalid predator IDs: ${ref.invalidPredatorIds.join(", ")}`
          )
          .join("\n");

        throw new Error(
          `Found ${brokenReferences.length} animals with broken predator references:\n${errorMessage}`
        );
      }

      expect(brokenReferences).toHaveLength(0);
    });

    test("no animal should be predator of itself", () => {
      const selfPredatingAnimals = animals.filter((animal) =>
        animal.predators.includes(animal.id)
      );

      if (selfPredatingAnimals.length > 0) {
        const errorMessage = selfPredatingAnimals
          .map(
            (animal) =>
              `Animal ${animal.id} (${animal.name}) is predator of itself`
          )
          .join("\n");

        throw new Error(
          `Found animals that are predators of themselves:\n${errorMessage}`
        );
      }

      expect(selfPredatingAnimals).toHaveLength(0);
    });
  });

  describe("Relationship consistency", () => {
    test("prey-predator relationships should be bidirectional", () => {
      const inconsistentRelationships: Array<{
        predatorId: number;
        predatorName: string;
        preyId: number;
        preyName: string;
        issue: "missing-reverse-prey" | "missing-reverse-predator";
      }> = [];

      animals.forEach((animal) => {
        // Check if this animal's prey list each other as predators
        animal.prey.forEach((preyId) => {
          const preyAnimal = animals.find((a) => a.id === preyId);
          if (preyAnimal && !preyAnimal.predators.includes(animal.id)) {
            inconsistentRelationships.push({
              predatorId: animal.id,
              predatorName: animal.name,
              preyId: preyAnimal.id,
              preyName: preyAnimal.name,
              issue: "missing-reverse-predator",
            });
          }
        });

        // Check if this animal's predators list each other as prey
        animal.predators.forEach((predatorId) => {
          const predatorAnimal = animals.find((a) => a.id === predatorId);
          if (predatorAnimal && !predatorAnimal.prey.includes(animal.id)) {
            inconsistentRelationships.push({
              predatorId: predatorAnimal.id,
              predatorName: predatorAnimal.name,
              preyId: animal.id,
              preyName: animal.name,
              issue: "missing-reverse-prey",
            });
          }
        });
      });

      if (inconsistentRelationships.length > 0) {
        const errorMessage = inconsistentRelationships
          .map((rel) => {
            if (rel.issue === "missing-reverse-predator") {
              return `${rel.predatorName} (${rel.predatorId}) preys on ${rel.preyName} (${rel.preyId}), but ${rel.preyName} doesn't list ${rel.predatorName} as a predator`;
            } else {
              return `${rel.predatorName} (${rel.predatorId}) should prey on ${rel.preyName} (${rel.preyId}), but doesn't list them as prey`;
            }
          })
          .join("\n");

        throw new Error(
          `Found ${inconsistentRelationships.length} inconsistent prey-predator relationships:\n${errorMessage}`
        );
      }

      expect(inconsistentRelationships).toHaveLength(0);
    });
  });
});
