
import { AppRegistry } from 'react-native';
import App from './App';

// Register the app
AppRegistry.registerComponent('Main', () => App);

// Run the app on web
AppRegistry.runApplication('Main', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
