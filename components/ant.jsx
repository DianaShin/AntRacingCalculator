import React from 'react';

const Ant = (props) => {
  const {calculating, name, length, weight, color, winLikelihood, imageSrc} = props;
  return (
    <li className="ant-card" key={name}>
      <div className="ant-info">
        <h2 className="ant-name" key="name">{name}</h2>
        <p key="length"> length: {length}mm</p>
        <p key="weight"> weight: {weight}mg</p>
        <p key="color"> color: {color}</p>
        <p key="odds"> Win likelihood: {winLikelihood}%</p>
      </div>
      <img  className={calculating? "ant-pic-run" : "ant-pic"} key="pic" src={imageSrc} alt={name}/>
    </li>
  )
}

//if the state is calculating and the ant's winLikelihood is not zero, put the classname as ant-pic-run
//
export default Ant;
