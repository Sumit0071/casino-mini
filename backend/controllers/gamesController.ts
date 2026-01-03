import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * GET /games
 * Optional filter: ?provider=Evolution OR ?category=Slots
 */
export const showGames = async (req: Request, res: Response) => {
  try {
    const {
      provider,
      category,
      favorites,
      search,
      page = "1",
      limit = "10",
    } = req.query;

    const userId = (req as any).userId;

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Number(limit), 50); // prevent abuse
    const skip = (pageNumber - 1) * pageSize;

    const whereClause: any = {
      provider: provider ? String(provider) : undefined,
      category: category ? String(category) : undefined,
      favorites:
        favorites === "true"
          ? { some: { userId } }
          : undefined,
    };

    // 🔍 Search by game name
    if (search) {
      whereClause.name = {
        contains: String(search),
        mode: "insensitive",
      };
    }

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          favorites: {
            where: { userId },
            select: { id: true },
          },
        },
      }),
      prisma.game.count({ where: whereClause }),
    ]);

    const formatted = games.map((game) => ({
      id: game.id,
      name: game.name,
      provider: game.provider,
      category: game.category,
      isFavorite: game.favorites.length > 0,
    }));

    res.status(200).json({
      success: true,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch games",
    });
  }
};


/**
 * POST /favorites/:gameId
 */
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const gameId = Number(req.params.gameId);

    await prisma.favorite.create({
      data: { userId, gameId },
    });

    res.status(201).json({ success: true, message: "Added to favorites" });
  } catch {
    res.status(400).json({ success: false, message: "Already favorited" });
  }
};

/**
 * DELETE /favorites/:gameId
 */
export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const gameId = Number(req.params.gameId);

    await prisma.favorite.delete({
      where: {
        userId_gameId: { userId, gameId },
      },
    });

    res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch {
    res.status(400).json({ success: false, message: "Favorite not found" });
  }
};

/**
 * GET /favorites
 */
export const getFavorites = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { game: true },
  });

  res.status(200).json({
    success: true,
    data: favorites.map((f) => f.game),
  });
};
