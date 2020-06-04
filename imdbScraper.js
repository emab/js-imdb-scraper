const fetch = require("node-fetch");
const cheerio = require("cheerio");

const HEADER = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
};

// Converts a string to a friendly query
const convertToQueryString = (showName) => {
  return showName.replace(" ", "+");
};

// Searches IMDB for a show name
// Returns html page
const getImdbSearchPage = async (showName) => {
  const showNameQuery = convertToQueryString(showName);
  try {
    const result = await fetch(`https://www.imdb.com/find?q=${showNameQuery}`, {
      headers: HEADER,
    });
    const resultBody = await result.text();
    return resultBody;
  } catch (err) {
    console.error(err);
  }
};

// Scrapes the IMDB html page for TV Show titles and ID
// Returns a { title, id, img } object from html page
const getImdbResults = (resultBody) => {
  const $ = cheerio.load(resultBody);
  return $("table.findList > tbody > tr")
    .map(function () {
      const url = $(this).children("td").find("a").attr("href");
      const title = $(this).text().trim();
      if (url.includes("/title/") && title.includes(" (TV Series)")) {
        return {
          title: $(this).text().trim().replace(" (TV Series)", ""),
          id: $(this).children("td").find("a").attr("href").substr(7, 9),
          img: $(this).children("td.primary_photo").find("img").attr("src"),
        };
      }
    })
    .get();
};

// Get all of the ratings for all seasons of a show
// Returns a map of season number to an array of { episode, rating }
const getAllRatings = async (imdbId) => {
  let ratings = {};
  // First we get the page using the imdbId
  const page = await fetchShowImdbPage(imdbId);
  const $ = cheerio.load(page);
  // The page defaults to showing latest season, so we can use this to determine total number of seasons.
  const seasons = parseInt($("#bySeason option:selected").text().trim());
  // Iterate through all seasons and populate ratings object
  for (i = 1; i <= seasons; i++) {
    const seasonRatings = await getSeasonRatings(imdbId, i);
    ratings[i] = seasonRatings;
  }
  return ratings;
};

// Gets a single seasons ratings from the IMDB page
// Returns each episode and its rating
// { episode, rating }
const getSeasonRatings = async (imdbId, season) => {
  const result = await fetch(
    `https://www.imdb.com/title/${imdbId}/episodes?season=${season}`
  );
  const resultText = await result.text();
  const $ = cheerio.load(resultText);

  let seasonRatings = $(
    "div.eplist > div > div.info > div.ipl-rating-widget > div.ipl-rating-star"
  )
    .map(function (e, i) {
      return {
        episode: e + 1,
        rating: $(this).children("span.ipl-rating-star__rating").text(),
      };
    })
    .get();
  return seasonRatings;
};

// Gets the IMDB show episodes page
// Returns the html page
const fetchShowImdbPage = async (imdbId) => {
  try {
    const result = await fetch(
      `https://www.imdb.com/title/${imdbId}/episodes`,
      {
        headers: HEADER,
      }
    );
    const resultBody = await result.text();
    return resultBody;
  } catch (err) {
    console.error(error);
  }
};

// Gets the search results for a show from IMDB
// Returns an array of search results
// { title, id, img }
const getSearchResults = async (show) => {
  const page = await getImdbSearchPage(show);
  const showDetails = getImdbResults(page);
  return showDetails;
};

module.exports = { getSearchResults, getAllRatings, getSeasonRatings };
