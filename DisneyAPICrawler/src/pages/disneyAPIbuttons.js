import React, {useState, useEffect} from 'react';

function getRandomInt() {
	let searchnumber = Math.floor(Math.random() * (7438 - 1) + 1);
	let searchqueryrandom = searchnumber.toString();
	return searchqueryrandom;
}

function DisneyAPIbuttons() {

  var character = "";
  var ch = "";
  var br = "";
  var deleteTest;
	
  async function apiFetchSearch() {
	let input = document.getElementById("userInput").value;
	let search = input.toString();
	const response = await fetch('https://api.disneyapi.dev/characters/' + search);
	const data = await response.json();
	const resultStringSearch = JSON.stringify(data);
	ch = document.createTextNode(resultStringSearch);
	ch.innerHTML = character;
	document.getElementById("ShowSearchedCharacter").appendChild(ch);
	br = document.createElement("br");
	document.getElementById("ShowSearchedCharacter").appendChild(br);
  }
  
  async function apiFetchRandom() {
	const response = await fetch('https://api.disneyapi.dev/characters/' + getRandomInt());
	const data = await response.json();
    const resultStringRandom = JSON.stringify(data);
	ch = document.createTextNode(resultStringRandom);
	ch.innerHTML = character;
	deleteTest = document.getElementById("ShowSearchedCharacter")
	deleteTest.appendChild(ch);
	br = document.createElement("br");
	document.getElementById("ShowSearchedCharacter").appendChild(br);
  }
  
  async function deleteEntry() {
	deleteTest.removeChild(deleteTest.childNodes[0]);
  }
  
  return (
	<div className="App">
		<p>
			<h4>Enter any Character ID number from 1 to 7438</h4>
			<h4>Or submit an empty entry to see all characters. You can try numbers higher than 7438 as the API is updated.</h4>
			<h4>Note that 112 is the minimum is the oldest entry accessible in the API. 
			<br></br>Many IDs no longer work so don't worry if you don't get a result the first time. </h4>
			<h4>Do NOT delete when there are no entries - site will crash. Under maintenance.</h4>
			<input id="userInput" type="text" placeholder="Character ID" />
			<button id="searchButton" onClick={apiFetchSearch}>Submit</button><div>
    </div>	
		</p>
		<p>
			<h3>OR<br></br></h3>
			<button onClick={apiFetchRandom}>FIND A RANDOM DISNEY CHARACTER</button>
			<br></br><br></br>
			<button onClick={deleteEntry}>DELETE ENTRY</button>
		</p>
		<label id="ShowSearchedCharacter" ></label>
    </div>
	);
}

export default DisneyAPIbuttons;
