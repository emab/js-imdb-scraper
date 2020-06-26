import fetch from 'node-fetch';
import cheerio from 'cheerio';

const HEADER = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
};

// Converts a string to a friendly query
const convertToQueryString = (showName) => {
  return showName.replace(' ', '+');
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
    return null;
  }
};

// Scrapes the IMDB html page for TV Show titles and ID
// Returns a { title, id, img } object from html page
const getImdbResults = (resultBody) => {
  const $ = cheerio.load(resultBody);
  return $('table.findList > tbody > tr')
    .map((i, e) => {
      const url = $(e).children('td').find('a').attr('href');
      const title = $(e).text().trim();
      if (
        // Only return titles
        url.includes('/title/') &&
        // Only return tv shows
        title.includes(' (TV Series)') &&
        // Don't show individual episodes
        !title.includes('(TV Episode)')
      ) {
        return {
          title: $(e).text().trim().replace(' (TV Series)', ''),
          id: $(e).children('td').find('a').attr('href').substr(7, 9),
          img: getHighQualityImage(
            $(e).children('td.primary_photo').find('img').attr('src')
          ),
        };
      }
    })
    .get();
};

// Takes an image url and gets larger version
// Returns higher quality image url
const getHighQualityImage = (imgUrl) => {
  return imgUrl.split('@.')[0] + '@._V1_UY268_CR8,0,182,268_AL_.jpg';
};

// Get all of the ratings for all seasons of a show
// Returns a map of season number to an array of { episode, rating }
const getAllRatings = async (imdbId) => {
  let ratings = {};

  // First we get the page using the imdbId
  try {
    const page = await fetchShowImdbPage(imdbId);
    const $ = cheerio.load(page);
    // The page defaults to showing latest season, so we can use this to determine total number of seasons.
    const seasons = parseInt($('#bySeason option:selected').text().trim());

    // Iterate through all seasons and populate ratings object
    for (let i = 1; i <= seasons; i++) {
      const seasonRatings = await getSeasonRatings(imdbId, i);
      ratings[i] = seasonRatings;
    }

    return ratings;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Gets a single seasons ratings from the IMDB page
// Returns each episode and its rating
// { episode, rating }
const getSeasonRatings = async (imdbId, season) => {
  try {
    const result = await fetch(
      `https://www.imdb.com/title/${imdbId}/episodes?season=${season}`
    );
    const resultText = await result.text();
    const $ = cheerio.load(resultText);

    let seasonRatings = $(
      'div.eplist > div > div.info > div.ipl-rating-widget > div.ipl-rating-star'
    )
      .map(function (e, i) {
        return {
          episode: e + 1,
          rating: $(this).children('span.ipl-rating-star__rating').text(),
        };
      })
      .get();
    return seasonRatings;
  } catch (err) {
    console.error(err);
    return null;
  }
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
    console.error(err);
    return null;
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

// Gets the number of seasons of a show
// Returns integer
const getNumSeasons = async (imdbId) => {
  const page = await fetch(`http://imdb.com/title/${imdbId}`);
  const pageBody = await page.text();
  const $ = cheerio.load(pageBody);
  return $('div.seasons-and-year-nav > div').find('a').first().text();
};

export default {
  getSearchResults,
  getAllRatings,
  getSeasonRatings,
  getNumSeasons,
};
