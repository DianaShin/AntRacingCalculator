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
  //  this.calculateOdds = this.calculateOdds.bind(this);
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

  click = (e) => console.log(this.state);

  calculateOdds = () => {
    this.setState({
      calculating: true,
      message: 'Calcuating Odds!'
    });
    let antOddsCalculatedCount = 0;
    Object.keys(this.state.ants).forEach((ant, idx) => {
      const callback = (winLikelihood) => {
        const newState = merge({}, this.state);
        newState.ants[ant].winLikelihood = winLikelihood;
        antOddsCalculatedCount++;
        if (antOddsCalculatedCount === Object.keys(this.state.ants).length) {
          newState.calculated = true;
          newState.calculating = false;
          newState.calculated = 'Odds are calculated!';
        }
        this.setState(newState);
      }
    })
  }

  generateAntWinLikelihoodCalculator() {
    var delay = 7000 + Math.random()*7000;
    var likelihoodOfAntWinning = Math.random();
    return function(callback) {
      setTimeout(function() {
        callback(likelihoodOfAntWinning);
      }, delay);
    };
  }

  render() {
    let antsList =  Object.keys(this.state.ants).map(idx => {
      let odds = this.state.ants[idx].winLikelihood;
      return (
        <li key={idx}>
          <p key="name"> name: {this.state.ants[idx].name}</p>
          <p key="length"> length: {this.state.ants[idx].length}mm</p>
          <p key="weight"> weight: {this.state.ants[idx].weight}mg</p>
          <p key="color"> color: {this.state.ants[idx].color.toLowerCase()}</p>
          <p key="odds"> Win likelihood: {this.state.ants[idx].winLikelihood}</p>
          <img  className="ant-pic" key="pic" src={require(`../antPics/ant${idx}.png`)} alt={`ant-${idx}`}/>
        </li>
      )
    })

    return (
      <div>
        <button onClick={this.calculateOdds}>
          checking out the endpoint
        </button>
        <ul>
          { antsList }
        </ul>
      </div>
    )
  }
}
