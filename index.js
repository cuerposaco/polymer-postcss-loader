/*
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
  // const styleTag = $domTemplate('style');

  const styleParser = $element => postcss([
    autoprefixer(),
  ]).process(
    source,
    { syntax: postcssSyntax },
  ).then((result) => {
    console.log(`\n\n${result.content}\n\n`);
    loaderCallback(null, result.content);
  });

  styleParser($domSource).catch((err) => {
    console.log(err);
    loaderCallback(null, source);
  });
};*/

const parse5 = require('parse5');
const postcss = require('postcss');
const postcssSyntax = require('postcss-html');
const autoprefixer = require('autoprefixer');

module.exports = function polymerPostcssLoader(source) {
  const loaderCallback = this.async();
  
  const getDomModule = parsed => parsed.childNodes
    .find(child => child.nodeName === 'html').childNodes
    .find(child => child.nodeName === 'body').childNodes
    .find(child => child.nodeName === 'dom-module');

  const getStyleTag = _domModule => {
    return _domModule.childNodes.reduce((acc, item) => {
      // console.log(`_domModule ${item.nodeName} - attrs: ${item.attrs}`)
      if (item.nodeName !== 'style') { return acc; }
      if (item.attrs && item.attrs.length > 0) { return acc; }
      // console.log(`item ${item.nodeName} - nodes: ${item.childNodes.length}`)
      acc = acc.concat(item.childNodes[0].value);
      return acc;
    }, []);
  };

  const fixTemplate = (postcssRes, _source) => {
    const template = `<style>${postcssRes}</style>`;
    return _source
      .replace(/<style>[\s\S]+<\/style>/g, template);
  };

  const styleParser = styleValue => postcss([
    autoprefixer(),
  ]).process(
    styleValue,
    { syntax: postcssSyntax },
  ).then(result => result.content);


  const parsed = parse5.parse(source);
  
  const domModule = getDomModule(parsed);
  if (!domModule) {
    return loaderCallback(null, source);
  }

  const template = domModule.childNodes
    .find(child => child.nodeName === 'template').content  
  
  const styles = getStyleTag(template)[0];
  styleParser(styles)
    .then(_styles => loaderCallback(null, fixTemplate(_styles, source)))
    .catch(err => {
      console.log(`[polymerPostcssLoader] Error: ${err}`);
      loaderCallback(null, source);
    });
}
