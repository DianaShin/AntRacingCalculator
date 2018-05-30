import React from 'react';
import { merge } from 'lodash';
import Ant from './ant';

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

  mostLikelyWinner = () => {
    let mostLikely = 0;
    let winner;
    Object.keys(this.state.ants).forEach(idx => {
      if (this.state.ants[idx].winLikelihood > mostLikely) {
        mostLikely = this.state.ants[idx].winLikelihood;
        winner = idx;
      }
    })
    if (typeof this.state.ants[winner] === 'undefined' ) {
      return [];
    } else {
      return (
        <div>
          <p> {this.state.ants[winner].name}</p>
          <img  className="ant-pic" key="winnerPic" src={require(`../antPics/ant${winner}.png`)} alt={this.state.ants[winner].name}/>
        </div>
      )
    }
  }

  render() {
    let antsList =  Object.keys(this.state.ants).map(idx => {
      return (
        <Ant  key={idx}
              name={this.state.ants[idx].name}
              length={this.state.ants[idx].length}
              weight={this.state.ants[idx].weight}
              color={this.state.ants[idx].color.toLowerCase()}
              winLikelihood={Math.floor(this.state.ants[idx].winLikelihood.toFixed(4)*100)}
              imageSrc={require(`../antPics/ant${idx}.png`)} />
      )
    })
    let mostLikelyWinner = this.mostLikelyWinner();

    return (
      <div>
        <h2 className="title">Ant Racing Calculator</h2>
        <button className="calculate-button" onClick={this.calculateOdds}>
          calculate odds
        </button>
        <button className="reset-button" onClick={this.reset}>
          reset
        </button>
        <div className="main">
          <ul>
            { antsList }
          </ul>
          <div>
            And the most likely winner is... {mostLikelyWinner}
          </div>
        </div>
      </div>
    )
  }
}
