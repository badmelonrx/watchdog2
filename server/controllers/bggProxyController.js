import axios from "axios";
import * as cheerio from "cheerio";
import vm from "vm";


/**
 * Proxy to search games from BGG.
 * @param {Request} req
 * @param {Response} res
 */
export const getBggSearch = async (req, res) => {
  const { q } = req.query; // Extract the search query

  if (!q) {
    return res.status(400).json({ error: "Missing 'q' query parameter." });
  }

  try {
    const response = await axios.get(
      `https://boardgamegeek.com/api/market/products/search`,
      {
        params: {
          ajax: 1,
          marketdomain: "boardgame",
          q,
        },
      }
    );

    // Respond with the BGG API data
    res.json(response.data);
  } catch (error) {
    console.log(q);
    console.error("Error fetching BGG search:", error.message);
    res.status(500).json({ error: "Failed to fetch search results from BGG." });
  }
};

/**
 * Proxy to fetch versions of a game from BGG.
 * @param {Request} req
 * @param {Response} res
 */
export const getBggVersions = async (req, res) => {
  const { objectId } = req.query; // Extract the object ID

  if (!objectId) {
    return res.status(400).json({ error: "Missing 'objectId' query parameter." });
  }

  try {
    const response = await axios.get(
      `https://boardgamegeek.com/api/market/products/versions`,
      {
        params: {
          ajax: 1,
          objectid: objectId,
          objecttype: "thing",
        },
      }
    );

    // Respond with the BGG API data
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching BGG versions:", error.message);
    res.status(500).json({ error: "Failed to fetch versions from BGG." });
  }
};


export const getGameInfo = async (req, res) => {
  const { href } = req.query;

  if (!href) {
    return res.status(400).json({ error: "Href is required." });
  }

  const url = `https://boardgamegeek.com${decodeURIComponent(href)}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let geekItemPreloadScript = "";
    $("script").each((i, script) => {
      const scriptContent = $(script).html();
      if (scriptContent.includes("GEEK.geekitemPreload")) {
        geekItemPreloadScript = scriptContent;
      }
    });

    if (!geekItemPreloadScript) {
      return res.status(500).json({ error: "Could not find game data in the page." });
    }

    const context = {};
    vm.createContext(context);
    vm.runInContext(geekItemPreloadScript, context);

    const geekItemPreload = context.GEEK?.geekitemPreload;

    if (!geekItemPreload) {
      return res.status(500).json({ error: "Failed to extract game data." });
    }

    const item = geekItemPreload.item;

    // Extract necessary fields
    const rawDescription = item.description || "";
    const cleanDescription = cheerio.load(`<div>${rawDescription}</div>`)("div").text();

    const publishers = item.links?.boardgamepublisher?.map((link) => link.name) || [];
    const minPlayers = item.minplayers || null;
    const maxPlayers = item.maxplayers || null;

    const result = {
      description: cleanDescription,
      publishers,
      minPlayers,
      maxPlayers,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching game info:", error.message);
    res.status(500).json({ error: "Failed to fetch game info." });
  }
};
