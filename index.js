const cheerio = require('cheerio');
const postcss = require('postcss');
const postcssSyntax = require('postcss-html');
const autoprefixer = require('autoprefixer');

module.exports = function polymerPostcssLoader(source) {

  const loaderCallback = this.async();

  const $domSource = cheerio.load(source);

  const domModuleElement = $domSource('dom-module');
  const $dom2 = cheerio.load(domModuleElement.html());

  const $domTemplate = cheerio.load($dom2('template').html());
  const styleTag = $domTemplate('style');

  const styleParser = ($element, callback) => {
    return postcss([
      autoprefixer()
    ]).process(
      $element.html(),
      { syntax: postcssSyntax }
    ).then(function (result) {
      loaderCallback(null, result.content);
    });
  };
  
  styleParser($domTemplate).catch(err => {
    console.log(error);
    loaderCallback(null, source);
  });
}