# barrabes-polymer-styles-loader

Replace Polymer Component tag `<style>` content with `postcss` processed styles.

- input:

```html
// my-custom-loader.html
<link rel='import' href='./bower_components/polymer/polymer-element.html'>

<dom-module id="my-custom-loader">
  <template>
    <style>
      :host {
        flex: 1;
      }
    </style>
    <h1>Loading: {{loading}}</h1>
  </template>

  <script>
  class MyCustomLoader extends Polymer.Element {
    static get is() {
      return 'my-custom-loader';
    }

    static get properties() {
      return {
        loading: {
          type: Boolean,
          notify: true,
        },
      };
    }

    ready() {
      super.ready();
      console.log('ready!!!');
      setTimeout(()=>{
        this.set('loading', false);
      }, 2000)
    }
  }
  customElements.define(MyCustomLoader.is, MyCustomLoader);
  </script>
</dom-module>

```

- output:

```html
// my-custom-loader.html
<link rel='import' href='./bower_components/polymer/polymer-element.html'>

<dom-module id="my-custom-loader">
  <template>
    <style>
      :host {
        -webkit-box-flex: 1;
            -ms-flex: 1;
                flex: 1;
      }
    </style>
    <h1>Loading: {{loading}}</h1>
  </template>

  <script>
  class MyCustomLoader extends Polymer.Element {
    static get is() {
      return 'my-custom-loader';
    }

    static get properties() {
      return {
        loading: {
          type: Boolean,
          notify: true,
        },
      };
    }

    ready() {
      super.ready();
      console.log('ready!!!');
      setTimeout(()=>{
        this.set('loading', false);
      }, 2000)
    }
  }
  customElements.define(MyCustomLoader.is, MyCustomLoader);
  </script>
</dom-module>

```

## Getting Started

First thing's first, install the module:

```
npm install barrabes-polymer-styles-loader --save-dev
```

## Use Cases

```js

// webpack.config.js file
module.exports = {
  // { ... previous config }
  // loaders
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          'barrabes-polymer-styles-loader',
        ],
      }
    ],
  },
  //{...}
}
```

## Use with polymer-webpack-loader

```js

module.exports = {
  // { ... previous config }
  // loaders
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          // https://github.com/babel/babel-loader
          'babel-loader',
          // https://github.com/webpack-contrib/polymer-webpack-loader
          'polymer-webpack-loader',
          'barrabes-polymer-styles-loader',
        ],
      }
    ]
  }
};
``