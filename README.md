# js-imdb-scraper

Scrapes *TV Show* data from the IMDB website.

- [js-imdb-scraper](#js-imdb-scraper)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
    - [Get IMDB Search Results](#get-imdb-search-results)
    - [Get a seasons ratings](#get-a-seasons-ratings)
    - [Get all seasons ratings](#get-all-seasons-ratings)
  - [License](#license)

## Getting Started

To install, use:

```bash
npm i js-imdb-scraper
```

Then either import the entire module, or whichever methods you need:

```js
const imdb = require("js-imdb-scraper");

// OR

const { getSearchResults, getSeasonRatings, getAllRatings } = require("js-imdb-scraper");
```

## Usage

### Get IMDB Search Results

The `getSearchResults(showName)` method uses the IMDB search page to list shows that mach the given input string.
The input string should contain letters, numbers and spaces only. This is usually enough to find the right shows.
This method will *only show TV Shows*, not movies.

```js
const imdb = require("js-imdb-scraper");

const example = async () => {
  const searchResults = await imdb.getSearchResults("westworld");
  retun searchResults;
}
```

This method gives us:

```js
[
  {
    title: 'Westworld (2016)',
    id: 'tt0475784',
    img: 'https://m.media-amazon.com/images/M/MV5BMTRmYzNmOTctZjMwOS00ODZlLWJiZGQtNDg5NDY5NjE3MTczXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_UX32_CR0,0,32,44_AL_.jpg'
  },
  {
    title: 'Beyond Westworld (1980)',
    id: 'tt0080198',
    img: 'https://m.media-amazon.com/images/M/MV5BMTU4NTIyMjM3Ml5BMl5BanBnXkFtZTgwMDk0OTQ0MzE@._V1_UX32_CR0,0,32,44_AL_.jpg'
  }
]
```

### Get a seasons ratings

Once we have the the show details, we can use the IMDB show ID to get a seasons ratings using `getSeasonRating(showId, season)`. Here, we select the 2016 westworld show and find season 1 ratings:

```js
const imdb = require("js-imdb-scraper");

const example = async () => {
  const searchResults = await imdb.getSearchResults("westworld");
  const selectedShowId = searchResults[0].id;
  const seasonOneRatings = await imdb.getSeasonRatings(selectedShowId, 1);
  return seasonOneRatings;
}
```

This gives us:

```js
[
  { episode: 1, rating: '8.9' },
  { episode: 2, rating: '8.6' },
  { episode: 3, rating: '8.4' },
  { episode: 4, rating: '8.7' },
  { episode: 5, rating: '8.7' },
  { episode: 6, rating: '8.9' },
  { episode: 7, rating: '9.5' },
  { episode: 8, rating: '8.8' },
  { episode: 9, rating: '9.4' },
  { episode: 10, rating: '9.7' }
]
```

### Get all seasons ratings

With the IMDB show ID we can receive all season ratings using `getAllRatings(showId)`:

```js
const imdb = require("js-imdb-scraper");

const example = async () => {
  const searchResults = await imdb.getSearchResults("westworld");
  const selectedShowId = searchResults[0].id;
  const allSeasonRatings = await imdb.getAllRatings(selectedShowId);
  return allSeasonRatings;
}
```

This gives us:

```js
{
  '1': [
    { episode: 1, rating: '8.9' },
    { episode: 2, rating: '8.6' },
    { episode: 3, rating: '8.4' },
    { episode: 4, rating: '8.7' },
    { episode: 5, rating: '8.7' },
    { episode: 6, rating: '8.9' },
    { episode: 7, rating: '9.5' },
    { episode: 8, rating: '8.8' },
    { episode: 9, rating: '9.4' },
    { episode: 10, rating: '9.7' }
  ],
  '2': [
    { episode: 1, rating: '8.2' },
    { episode: 2, rating: '8.1' },
    { episode: 3, rating: '8.0' },
    { episode: 4, rating: '9.0' },
    { episode: 5, rating: '7.9' },
    { episode: 6, rating: '8.2' },
    { episode: 7, rating: '8.6' },
    { episode: 8, rating: '9.2' },
    { episode: 9, rating: '8.8' },
    { episode: 10, rating: '8.8' }
  ],
  '3': [
    { episode: 1, rating: '8.5' },
    { episode: 2, rating: '8.4' },
    { episode: 3, rating: '8.4' },
    { episode: 4, rating: '9.0' },
    { episode: 5, rating: '8.2' },
    { episode: 6, rating: '8.5' },
    { episode: 7, rating: '8.1' },
    { episode: 8, rating: '7.4' }
  ]
}
```

## License

This project is licensed under the MIT license - see the [LICENSE](./LICENSE) file for details.
