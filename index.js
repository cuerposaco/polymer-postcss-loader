const { getOptions } = require('loader-utils');
const parse5 = require('parse5');
const postcss = require('postcss');
const postcssSyntax = require('postcss-html');

const showedInfo = false;

module.exports = function polymerPostcssLoader(source) {
  
  // Loader configuration
  this.cacheable = false;
  const loaderCallback = this.async();
  const htmlFilePath = this.resourcePath;
  const options = getOptions(this);
  const postcssPlugins = (options && options.plugins) || [];

  if (options.verbose && !showedInfo) {
    const autoprefixerInfo = postcssPlugins.slice().find(plugin => plugin.postcssPlugin === 'autoprefixer').info();
    console.log(`------------------- [Autoprefixer INFO] -------------------------`);
    console.log(autoprefixerInfo);
    console.log(`-------------------------------------------------------------`);
    showedInfo = true;
  }

  // Loader Helpers
  const getDomModule = parsed => parsed.childNodes
    .find(child => child.nodeName === 'html').childNodes
    .find(child => child.nodeName === 'body').childNodes
    .find(child => child.nodeName === 'dom-module');

  const getStyleTag = (_domModule) => {
    return _domModule.childNodes.reduce((acc, item) => {
      if (item.nodeName !== 'style') { return acc; }
      if (item.attrs && item.attrs.length > 0) { return acc; }
      return [
        ...acc,
        item.childNodes[0].value,
      ];
    }, []);
  };
  
  const styleParser = styleValue => (
    postcss(postcssPlugins)
      .process(
        styleValue,
        { syntax: options.syntax || postcssSyntax }
      )
      .then(result => result.content)
      .catch(err => {
        this.emitWarning(err);
        loaderCallback(null, source);
      })
  );

  const fixTemplate = (result, mainSource) => {
    const newStyles = `<style>${result}</style>`;
    return mainSource
      .replace(/<style>[\s\S]+<\/style>/g, newStyles);
  };

  // Loader Processor
  const parsed = parse5.parse(source);
  const domModule = getDomModule(parsed);
  if (!domModule) { return loaderCallback(null, source); }

  const template = domModule.childNodes
    .find(child => child.nodeName === 'template');
  if (!template) { return loaderCallback(null, source); }

  const styles = getStyleTag(template.content)[0];
  if (!styles || !styles.length) { return loaderCallback(null, source); }
  
  styleParser(styles)
    .then(_styles => {
      loaderCallback(null, fixTemplate(_styles, source));
    })
    .catch((err) => {
      this.emitWarning(err);
      loaderCallback(null, source);
    });
};
