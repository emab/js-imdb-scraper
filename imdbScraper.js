const fetch = require("node-fetch");
const cheerio = require("cheerio");

const getShowResults = show => {
  return getImdbResults(getImdbSearchPage(show));
};

// Converts a string to a friendly query
const convertToQueryString = (showName) => {
  return showName.replace(" ", "+");
};

// Searches IMDB for a show name, returns html page
const getImdbSearchPage = async (showName) => {
  const showNameQuery = convertToQueryString(showName);
  const result = await fetch(`https://www.imdb.com/find?q=${showNameQuery}`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
    },
  });
  resultBody = await result.text();
  return resultBody;
};

// Scrapes the IMDB html page for titles and id
const getImdbResults = (resultBody) => {
  const $ = cheerio.load(resultBody);
  return $("table.findList > tbody > tr > td.result_text")
    .map(function () {
      const url = $(this).children("a").attr("href");
      if (url.includes("/title/")) {
        return {
          title: $(this).text().trim(),
          id: $(this).children("a").attr("href").substr(7, 9),
        };
      }
    })
    .get();
};

module.exports = getShowResults;