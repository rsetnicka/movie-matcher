import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors()); // allow frontend requests

// Proxy route
app.get("/api/movies", async (req, res) => {
  const query = req.query.q;

  try {
    const data = await queryTMDB(
      "search/movie",
      `query=${encodeURIComponent(query)}`
    );
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }

  // try {
  //   const response = await fetch(
  //     `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
  //       query
  //     )}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  //       },
  //     }
  //   );

  //   if (!response.ok) {
  //     return res.status(response.status).json({ error: "TMDB request failed" });
  //   }

  //   const data = await response.json();
  //   res.json(data.results);
  // } catch (err) {
  //   res.status(500).json({ error: "Internal Server Error" });
  // }
});

app.get("/api/movie/:id", async (req, res) => {
  const movieId = req.params.id;

  let data;
  try {
    data = await queryTMDB(`movie/${movieId}`, null);
    console.log(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }

  // try {
  //   const response = await fetch(
  //     `https://api.themoviedb.org/3/movie/${movieId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  //       },
  //     }
  //   );

  //   if (!response.ok) {
  //     return res.status(response.status).json({ error: "TMDB request failed" });
  //   }

  //   const data = await response.json();
  // console.log(data);

  let videosData;
  try {
    videosData = await queryTMDB(`movie/${movieId}/videos`, "language=en-US");

    const trailerKey = videosData.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    )?.key;

    res.json({ ...data, trailerKey });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }

  // Get videos
  // const videosResponse = await fetch(
  //   `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  //     },
  //   }
  // );

  // if (!videosResponse.ok) {
  //   return res
  //     .status(videosResponse.status)
  //     .json({ error: "TMDB video request failed" });
  // }

  // const videosData = await videosResponse.json();
  // console.log(videosData);

  //   const trailerKey = videosData.results.find(
  //     (video) => video.type === "Trailer" && video.site === "YouTube"
  //   )?.key;

  //   res.json({ ...data, trailerKey });
  // } catch (err) {
  //   res.status(500).json({ error: "Internal Server Error" });
  // }
});

app.get("/api/genres", async (req, res) => {
  // const query = req.query.q;

  try {
    const data = await queryTMDB("genre/movie/list", "language=en");
    res.json(data.genres);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function queryTMDB(endpoint, query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    }
  );
  if (!response.ok) throw new Error("Network response was not ok");

  return await response.json();
}

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
