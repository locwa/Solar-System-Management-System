"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert("Planets", [
            {
                PlanetID: 1,
                Name: "Alpha Centauri Bb",
                Status: "Habitable",
                Population: 1000000,
                Gravity: 1.2,
                AtmosphericComposition: "Nitrogen, Oxygen",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                PlanetID: 2,
                Name: "Kepler-186f",
                Status: "Terraforming",
                Population: 0,
                Gravity: 0.9,
                AtmosphericComposition: "Carbon Dioxide, Nitrogen",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("Planets", {}, {});
    },
};
