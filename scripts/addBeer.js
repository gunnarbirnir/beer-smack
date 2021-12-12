const fs = require('fs');
const got = require('got');
const jsdom = require('jsdom');
const shortid = require('shortid');
const { JSDOM } = jsdom;

let args = process.argv.slice(2);
const EMPTY_BEERS_MODE = args.includes('-e');
if (EMPTY_BEERS_MODE) {
  args.splice(args.indexOf('-e'), 1);
}

const ATVR_ID = !EMPTY_BEERS_MODE && args[0] ? args[0] : '';
const FILE_PATH = args[1] || 'beers.json';
const EMPTY_BEERS = EMPTY_BEERS_MODE && isNumeric(args[0]) ? args[0] : 1;

const BEER_URL = `https://www.vinbudin.is/heim/vorur/stoek-vara.aspx/?productid=${ATVR_ID}`;
const NAME_ID = '#ctl01_ctl01_Label_ProductName';
const TYPE_QUERY = '.sub .taste2';
const ABV_ID = '#ctl01_ctl01_Label_ProductAlchoholVolume';
const BREWER_ID = '#ctl01_ctl01_Label_Producer';
const COUNTRY_ID = '#ctl01_ctl01_Label_ProductCountryOfOrigin';
const DESCRIPTION_QUERY = '#tabs1 p';

let beers = {};
try {
  beers = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
} catch {
  // File does not exist
}

if (ATVR_ID) {
  fetchBeerInfo();
} else {
  createEmptyBeers();
}

function fetchBeerInfo() {
  got(BEER_URL)
    .then((response) => {
      const dom = new JSDOM(response.body);
      const id = shortid.generate();
      const name = getDomElementContent(NAME_ID, dom);
      const type = getDomElementContent(TYPE_QUERY, dom);
      const abv = getDomElementContent(ABV_ID, dom);
      const brewer = getDomElementContent(BREWER_ID, dom);
      const country = getDomElementContent(COUNTRY_ID, dom);
      const description = getDomElementContent(DESCRIPTION_QUERY, dom);

      beers[id] = {
        id,
        name,
        type: type.replace('-', '').trim(),
        index: Object.keys(beers).length,
        active: true,
        abv: parseFloat(abv.replace(',', '.')),
        brewer,
        country,
        description,
      };
      writeToFile();
    })
    .catch((err) => {
      console.log(err);
    });
}

function createEmptyBeers() {
  for (let i = 0; i < EMPTY_BEERS; i++) {
    const id = shortid.generate();
    beers[id] = {
      id,
      name: '',
      type: '',
      index: Object.keys(beers).length,
      active: true,
      abv: 0,
      brewer: '',
      country: '',
      description: '',
    };
  }
  writeToFile();
}

function writeToFile() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(beers, null, 2));
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function getDomElementContent(query, dom) {
  const element = dom.window.document.querySelector(query);
  return element ? element.textContent : '';
}
