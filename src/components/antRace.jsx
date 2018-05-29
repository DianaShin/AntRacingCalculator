import React from 'react';
import { merge } from 'lodash';

export default class AntRace extends React.Component {
  constructor() {
    super();
    this.state = {
      ants: {},
      calculated: false,
      calculating: false,
      message: ''
    }
  }

  componentDidMount() {
    const ants = {};
    let endpoint = 'https://antserver-blocjgjbpw.now.sh/graphql?query={ants{name,length,weight,color}}';
    fetch(endpoint)
    .then(results => {
      return results.json();
    }).then(data => {
      data.data.ants.forEach((ant, idx) => {
        ants[idx] = ant;
        ants[idx].winLikelihood = 0;
      })
    }).then(() => this.setState({ants}))
  }

  calculateOdds = () => {
    this.setState({
      calculating: true,
      message: 'Calcuating Odds!'
    });
    console.log(this.state);
    let antOddsCalculatedCount = 0;
    Object.keys(this.state.ants).forEach(idx => {
      const callback = (likelihoodOfAntWinning) => {
        const newState = merge({}, this.state);
        newState.ants[idx].winLikelihood = likelihoodOfAntWinning;
        antOddsCalculatedCount++;
        if (antOddsCalculatedCount === Object.keys(this.state.ants).length) {
          newState.calculated = true;
          newState.calculating = false;
          newState.message = 'Odds are calculated!';
          console.log(newState);
        }
        this.setState(newState);
      };
      this.generateAntWinLikelihoodCalculator()(callback);
    })
  }

  generateAntWinLikelihoodCalculator() {
    var delay = 1000 + Math.random()*7000;
    var likelihoodOfAntWinning = Math.random();
    return function(callback) {
      setTimeout(function() {
        callback(likelihoodOfAntWinning);
      }, delay);
    };
  }

  reset = () => {
    const ants = this.state.ants;
    Object.keys(ants).forEach(idx => {
      ants[idx].winLikelihood = 0;
    });
    this.setState({
      ants: ants,
      calculating: false,
      calculated: false,
      message: 'Want to calculate odds?'
    })
  }

  render() {
    let antsList =  Object.keys(this.state.ants).map(idx => {
      let odds = this.state.ants[idx].winLikelihood;
      return (
        <li key={idx}>
          <h2 className="ant-name" key="name">{this.state.ants[idx].name}</h2>
          <p key="length"> length: {this.state.ants[idx].length}mm</p>
          <p key="weight"> weight: {this.state.ants[idx].weight}mg</p>
          <p key="color"> color: {this.state.ants[idx].color.toLowerCase()}</p>
          <p key="odds"> Win likelihood: {Math.floor(this.state.ants[idx].winLikelihood.toFixed(4)*100)}%</p>
          <img  className="ant-pic" key="pic" src={require(`../antPics/ant${idx}.png`)} alt={`ant-${idx}`}/>
        </li>
      )
    })

    return (
      <div>
        <button className="calculate-button" onClick={this.calculateOdds}>
          calculate odds
        </button>
        <button className="reset-button" onClick={this.reset}>
          reset
        </button>
        <ul>
          { antsList }
        </ul>
      </div>
    )
  }
}
