This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Ant Racing Calculator

## [live link](https://dianashin.github.io/AntRacingCalculator/)

Credit: The original svg file that was altered for the ant icons comes from: http://www.clker.com/clipart-white-ant.html.

This is a very special app for purveyors of the competitive ant racing scene, who wish to view statistics related to competing ants before races take place.

specifications:
- Information about competing ants must be acquired from a GraphQL API located at the following endpoint: https://antserver-blocjgjbpw.now.sh/graphql (if this link is down for some reason, there is a backup at https://guarded-shore-81814.herokuapp.com/graphql)
- All available information on the ants should be displayed in a pleasing UI designed at your discretion.
- You must provide a way for users to calculate the odds of each ant winning.
	- We have provided the function which provides the means to calculate the likelihood of an ant winning below (see 'Ant-win likelihood algorithm'), which you must use as-is.
	- Users must be able to begin running calculations on all ants simultaneously.
	- The UI must reflect the state of each ant's win likelihood calculation (not yet run, in progress, calculated, etc.)
	- In addition, the UI must display the state of _all_ tests together (not yet run, in progress, all calculated).
	- As the results come in, ants must be ordered by their calculated likelihood of winning.
- The app should be written in Javascript, but how you implement the app is up to your discretion.
- When you're done, please send us a link to your submission's GitHub repo, and instructions on how to run it.

## Ant-win likelihood algorithm

```js
function generateAntWinLikelihoodCalculator() {
  var delay = 7000 + Math.random() * 7000;
  var likelihoodOfAntWinning = Math.random();

  return function(callback) {
    setTimeout(function() {
      callback(likelihoodOfAntWinning);
    }, delay);
  };
}
```
