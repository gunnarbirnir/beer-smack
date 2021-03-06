const fs = require('fs');
const got = require('got');
const jsdom = require('jsdom');
const shortid = require('shortid');
const { JSDOM } = jsdom;

const FILE_PATH = 'beers.json';
const BASE_URL =
  'https://www.vinbudin.is/heim/vorur/stoek-vara.aspx/?productid=';
const NAME_ID = '#ctl01_ctl01_Label_ProductName';
const TYPE_QUERY = '.sub .taste2';
const ABV_ID = '#ctl01_ctl01_Label_ProductAlchoholVolume';
const BREWER_ID = '#ctl01_ctl01_Label_Producer';
const COUNTRY_ID = '#ctl01_ctl01_Label_ProductCountryOfOrigin';
const DESCRIPTION_QUERY = '#tabs1 p';

const atvrId = process.argv[2] || '';
const beerUrl = `${BASE_URL}${atvrId}`;
const beers = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

if (atvrId) {
  got(beerUrl)
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
      fs.writeFileSync(FILE_PATH, JSON.stringify(beers));
    })
    .catch((err) => {
      console.log(err);
    });

  function getDomElementContent(query, dom) {
    const element = dom.window.document.querySelector(query);
    return element ? element.textContent : '';
  }
} else {
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
  fs.writeFileSync(FILE_PATH, JSON.stringify(beers));
}
