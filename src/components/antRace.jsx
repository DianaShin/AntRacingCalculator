import React from 'react';

export default class AntRace extends React.Component {
  constructor() {
    super();
    this.state = {
      ants: {},
      calculated: false,
      calculating: false
    }
    this.click = this.click.bind(this);
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
      })
    }).then(() => this.setState({ants}))
  }

  click(e) {
    console.log(this.state)
  }

  render() {
    let antsList =  Object.keys(this.state.ants).map(idx => {
      return (
        <li key={idx}>
          <p key="name"> name: {this.state.ants[idx].name}</p>
          <p key="length"> length: {this.state.ants[idx].length}mm</p>
          <p key="weight"> weight: {this.state.ants[idx].weight}mg</p>
          <p key="color"> color: {this.state.ants[idx].color.toLowerCase()}</p>
          <img  className="ant-pic" key="pic" src={require(`../antPics/ant${idx}.png`)} alt={`ant-${idx}`}/>
        </li>
      )
    })

    return (
      <div>
        <button onClick={this.click}>
          checking out the endpoint
        </button>
        <ul>
          { antsList }
        </ul>
      </div>
    )
  }
}
