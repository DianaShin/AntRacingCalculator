import React from 'react';
import { merge } from 'lodash';
import Ant from './ant';

export default class AntRace extends React.Component {
  constructor() {
    super();
    this.state = {
      ants: {},
      calculated: false,
      calculating: false
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
        ants[idx].imageSrc = require(`../antPics/ant${idx}.png`);
      })
    }).then(() => this.setState({ants}));
  }

  calculateOdds = () => {
    this.setState({
      calculating: true
    });
    let antOddsCalculatedCount = 0;
    Object.keys(this.state.ants).forEach(idx => {
      const callback = (likelihoodOfAntWinning) => {
        const newState = merge({}, this.state);
        newState.ants[idx].winLikelihood = likelihoodOfAntWinning;
        newState.ants = this.reorderByWinLikelihood(newState.ants);
        antOddsCalculatedCount++;
        if (antOddsCalculatedCount === Object.keys(this.state.ants).length) {
          newState.calculated = true;
          newState.calculating = false;
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
      calculated: false
    })
  }

  reorderByWinLikelihood = (antsObj) => {
    let antsArr = [];
    Object.keys(antsObj).forEach(idx => {
      antsArr.push(antsObj[idx])
    })
    antsArr.sort(function(a, b) {
      return b.winLikelihood - a.winLikelihood;
    })
    let newAntsObj = {};
    for (let i = 0; i < antsArr.length; i++) {
      newAntsObj[i] = antsArr[i];
    }
    return newAntsObj;
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
          <p className="winner-name"> {this.state.ants[winner].name}</p>
          <img  className="winner-pic" key="winnerPic" src={this.state.ants[winner].imageSrc} alt={this.state.ants[winner].name}/>
          <p className="winner-chance">{Math.floor(this.state.ants[winner].winLikelihood.toFixed(4)*100)}% chance</p>
        </div>
      )
    }
  }

  render() {

    let antsList =  Object.keys(this.state.ants).map(idx => {
      return (
        <Ant  key={idx}
              calculating={this.state.calculating}
              name={this.state.ants[idx].name}
              length={this.state.ants[idx].length}
              weight={this.state.ants[idx].weight}
              color={this.state.ants[idx].color.toLowerCase()}
              winLikelihood={Math.floor(this.state.ants[idx].winLikelihood.toFixed(4)*100)}
              imageSrc={this.state.ants[idx].imageSrc} />
      )
    })

    let mostLikelyWinner = this.mostLikelyWinner();

    return (
      <div>
        <div className="header">
          <div>
            <h2 className="title">Ant Racing Calculator</h2>
            <button className="calculate-button" onClick={this.calculateOdds}>
              calculate odds
            </button>
            <button className="reset-button" onClick={this.reset}>
              reset
            </button>
          </div>
          <div className="about-me">
            <h2 className="author">By Diana Shin</h2>
            <ul className="about-item">
              <li>
                <a href="https://github.com/dianashin">
                  <img src={require("../socialIcons/github-icon-01.png")} className="icon" />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/diana-shin/">
                  <img src={require("../socialIcons/linkedin-icon2-01.png")} className="icon" />
                </a>
              </li>
              <li>
                <a href="https://dianashin.github.io/">
                  <img src={require("../socialIcons/portfolio-icon-01.png")} className="icon" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="main">
          <ul>
            {antsList}
          </ul>
          {this.state.calculated &&
            <div className="most-likely-winner">
              <h2 className="winner-text">And the most likely winner is... {mostLikelyWinner} </h2>
            </div>}
        </div>
      </div>
    )
  }
}
