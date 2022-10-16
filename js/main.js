const hitBtn = document.getElementById('hit-btn')
const stayBtn = document.getElementById('stay-btn')

let url = 'https://deckofcardsapi.com/api/deck/new/draw/?count=52'
requestDeck (url)

function requestDeck (url){
	const urlResponse = fetch (url)
	urlResponse
	.then (response => {
		return response.json()
	})
	.then (data => {
		//console.log(data);
		playGame(data)
	})
	.catch (err => {
		console.error (err)
	})
}

function playGame(deck) {
	let dealerPoints = 0
	let hiddenPoints = 0
	let dealerAce = 0
	let playerPoints = 0
	let playerAce = 0 
	let cardCounter = 0
	
	let dealer_points = document.getElementById('dealer-points')
	let player_points = document.getElementById('player-points')

	handDealer(deck)
	handPlayer(deck)

	stayBtn.addEventListener('click', () => {
		if (playerPoints > 21){
			checkWinner()
		} else {
			while (hiddenPoints < 17){
				dealDealerCard(deck)
			}
			checkWinner()
		}
	})
	
	function handDealer (deck) {
		dealDealerCard(deck)
		dealDealerCard(deck)
		dealer_points.textContent = `Dealer: ${dealerPoints}`
	}
	
	
	function dealDealerCard(deck) {
		let card = document.createElement('img')
		if (cardCounter == 0) { 
			card.src = 'https://deckofcardsapi.com/static/img/back.png'
			card.setAttribute("id", "first-card")
			hiddenPoints += getCardValue(deck.cards[cardCounter].value)
		} else {
			card.src = deck.cards[cardCounter].images.png
			hiddenPoints += getCardValue(deck.cards[cardCounter].value)
			dealerPoints += getCardValue(deck.cards[cardCounter].value)
		}
		if ((deck.cards[cardCounter].value) == 'ACE') dealerAce++
		if (dealerAce >= 1 && hiddenPoints > 21) {
			dealerAce--
			hiddenPoints -= 10
		}
		document.getElementById("dealer-cards").append(card)
		cardCounter++
	}

	function handPlayer(deck) {
		dealPlayerCard(deck)
		dealPlayerCard(deck)
		player_points.textContent = `Player: ${playerPoints}`
		hitBtn.addEventListener('click', () => {
			if (playerPoints < 21) {
				dealPlayerCard(deck)
			}
			player_points.textContent = `Player: ${playerPoints}`
		})
	}
	
	function dealPlayerCard(deck) {
		playerPoints += getCardValue(deck.cards[cardCounter].value)
		if ((deck.cards[cardCounter].value) == 'ACE') playerAce++
		if (playerAce >= 1 && playerPoints > 21) {
			playerAce--
			playerPoints -= 10
		}
		let card = document.createElement('img')
		card.src = deck.cards[cardCounter].images.png
		document.getElementById("player-cards").append(card)	
		cardCounter++
	}

	function getCardValue(value){
		//console.log(value)
		if (value == "JACK" || value == "QUEEN" || value == "KING"){
			return 10
		} 
		else 
		if (value == "ACE"){
			return 11
		} 
		else {
			return parseInt(value)
		}	
	}
	
	function checkWinner() {
		document.getElementById('first-card').src = deck.cards[0].images.png
		dealer_points.textContent = `Dealer: ${hiddenPoints}`

		setTimeout(function (){
			document.querySelector('.modal').style.display = 'block'
		}, 1200)
		
		let winner = document.getElementById('winner')

		if (hiddenPoints == playerPoints){
			winner.textContent = 'Tie'
		} else if (playerPoints > 21){
			winner.textContent = 'Dealer Wins';
		} else if (hiddenPoints > 21){
			winner.textContent = 'Player Wins';
		} else if (hiddenPoints > playerPoints){
			winner.textContent = 'Dealer Wins';
		} else if (hiddenPoints < playerPoints){
			winner.textContent = 'Player Wins';
		}
	}
}

document.getElementById('play-again').addEventListener('click', () => {
	location.reload()
	// Originally I did not planned to put a location.reload()
	// But some problems came up when I played with a new deck
	// My code might not be the best, this was the easy solution.
})