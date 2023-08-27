import ReactOnRails from 'react-on-rails';

import HelloWorld from '../bundles/HelloWorld/components/HelloWorld';
import Counter from '../bundles/HelloWorld/components/Counter';
import App from '../react/src/app';
// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  App,
  Counter,
  HelloWorld,
});
