import { prisma } from "../lib/prisma";

async function seed() {
  await prisma.game.createMany({
    data: [
      // 🎰 Evolution
      { name: "Roulette Live", provider: "Evolution", category: "Live Casino" },
      { name: "Lightning Roulette", provider: "Evolution", category: "Live Casino" },
      { name: "Blackjack VIP", provider: "Evolution", category: "Table Games" },
      { name: "Infinite Blackjack", provider: "Evolution", category: "Table Games" },
      { name: "Baccarat Control Squeeze", provider: "Evolution", category: "Live Casino" },

      // 🎰 Pragmatic Play
      { name: "Sweet Bonanza", provider: "Pragmatic Play", category: "Slots" },
      { name: "Gates of Olympus", provider: "Pragmatic Play", category: "Slots" },
      { name: "The Dog House", provider: "Pragmatic Play", category: "Slots" },
      { name: "Big Bass Bonanza", provider: "Pragmatic Play", category: "Slots" },
      { name: "Wolf Gold", provider: "Pragmatic Play", category: "Slots" },

      // 🎰 NetEnt
      { name: "Starburst", provider: "NetEnt", category: "Slots" },
      { name: "Gonzo's Quest", provider: "NetEnt", category: "Slots" },
      { name: "Dead or Alive 2", provider: "NetEnt", category: "Slots" },

      // 🎰 Play'n GO
      { name: "Book of Dead", provider: "Play'n GO", category: "Slots" },
      { name: "Reactoonz", provider: "Play'n GO", category: "Slots" },
      { name: "Fire Joker", provider: "Play'n GO", category: "Slots" },

      // 🎰 Microgaming
      { name: "Mega Moolah", provider: "Microgaming", category: "Slots" },
      { name: "Immortal Romance", provider: "Microgaming", category: "Slots" },

      // 🎰 Live Casino Mixed
      { name: "Crazy Time", provider: "Evolution", category: "Live Casino" },
      { name: "Monopoly Live", provider: "Evolution", category: "Live Casino" },
      { name: "Dream Catcher", provider: "Evolution", category: "Live Casino" },

      // 🎰 Table Games
      { name: "European Roulette", provider: "NetEnt", category: "Table Games" },
      { name: "Classic Blackjack", provider: "Microgaming", category: "Table Games" },
      { name: "Casino Hold’em", provider: "Evolution", category: "Table Games" },
    ],
  });

  console.log("✅ Casino games seeded successfully");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
