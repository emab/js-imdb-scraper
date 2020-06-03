# js-imdb-scraper

Scrapes IMDB for a given string.

Example of the return format (search string was "The office"):

```
[
  { title: 'The Office (2005) (TV Series)', id: 'tt0386676' },
  { title: 'The Office (2001) (TV Series)', id: 'tt0290978' },
  { title: 'The Office (2019) (TV Series)', id: 'tt8305218' },
  {
    title: 'The Office: The Accountants (2006) (TV Series)',
    id: 'tt0840149'
  }
]
```

## Usage

Initially returns a `Promise`. Use `then()` to wait for the asynchronous function to finish.

```
const imdbs = require("js-imdb-scraper");

imdbs("the office").then((result) => console.log(result));
```