import React, { useEffect, useState } from 'react';
import './board.scss';
import { useChallengeStore, useTriangleStore, useActionStore, useActionsAvailableStore, useActivitiesStore, useDealStore, useDeckStore, usePlayerCoinsStore, usePlayerTurnStore, useFlippedStore, useChosenTriangleStore, useActiveTrianglesStore, useScreenTextStore, usePlayerNamesStore, useSelectableTrianglesStore, useActionSelectedStore, useBlockStore, useTriangleNamesStore, useCurrentNameStore} from "../../activitiesStore";
import Assassin from "../../assets/Assassin.png";
import Contessa from "../../assets/Contessa.png";
import Duke from "../../assets/Duke.png";
import Captain from "../../assets/Captain.png";
import Ambassador from "../../assets/Ambassador.png";

let selected = 0;
let selectedCard = 0;
let selectedActions = ["Kill","Steal", "Swap", "Take 3","Coup"]
const Board = ({
  playerCount, 
  cardNames,
}) => { 

  // Players in Game
  var playerNames = usePlayerNamesStore((state) => state.playerNames);
  
  // Triangles with players 
  const setActiveTriangles = useActiveTrianglesStore((state) => state.setActiveTriangles);
  var activeTriangles = useActiveTrianglesStore((state) => state.activeTriangles);

  // Triangles with players left in the game
  const setSelectableTriangles = useSelectableTrianglesStore((state) => state.setSelectableTriangles);
  var selectableTriangles = useSelectableTrianglesStore((state) => state.selectableTriangles);

  // Triangles with players 
  const setTriangleNames = useTriangleNamesStore((state) => state.setTriangleNames);
  var triangleNames = useTriangleNamesStore((state) => state.triangleNames);


  // Current Action Picked
  const setAction = useActionStore((state) => state.setAction);
  var action = useActionStore((state) => state.action);

  // Current Action Selected
  const setActionSelected = useActionSelectedStore((state) => state.setActionSelected);
  var actionSelected = useActionSelectedStore((state) => state.actionSelected);
  
   // Deal of cards
   const setDeal = useDealStore((state) => state.setDeal);
   var deal = useDealStore((state) => state.deal);
 
   // Player Coins
   const setPlayerCoins = usePlayerCoinsStore((state) => state.setPlayerCoins);
   var playerCoins = usePlayerCoinsStore((state) => state.playerCoins);
 
   // Remaining Deck 
   const setDeck = useDeckStore((state) => state.setDeck);
   var deck = useDeckStore((state) => state.deck);
 
   // Keep track of turns 
   const setPlayerTurn = usePlayerTurnStore((state) => state.setPlayerTurn);
   var playerTurn = usePlayerTurnStore((state) => state.playerTurn);
 
   // Possible Actions 
   const setActionsAvailable = useActionsAvailableStore((state) => state.setActionsAvailable);
   var actionsAvailable = useActionsAvailableStore((state) => state.actionsAvailable);
 
  // Triangle (turn)
  const setTriangle = useTriangleStore((state) => state.setTriangle);
  const triangle = useTriangleStore((state) => state.triangle)

  // Chosen after action
  const setChosenTriangle = useChosenTriangleStore((state) => state.setChosenTriangle);
  var chosenTriangle = useChosenTriangleStore((state) => state.chosenTriangle);

  // Flipped cards
  const setFlipped = useFlippedStore((state) => state.setFlipped);
  var flipped = useFlippedStore((state) => state.flipped);

  // Screen Text 
  const setScreenText = useScreenTextStore((state) => state.setScreenText);
  var screenText = useScreenTextStore((state) => state.screenText)

  // Challenge
  const setChallenge = useChallengeStore((state) => state.setChallenge);
  var challenge = useChallengeStore((state) => state.challenge);

  // Block
  const setCurrentName = useCurrentNameStore((state) => state.setCurrentName);
  var currentName = useCurrentNameStore((state) => state.currentName);

  const [show1st, setShow1st] = useState(true)
  const [show2nd, setShow2nd] = useState(true)
  const [show3rd, setShow3rd] = useState(false)
  const [show4th, setShow4th] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  useEffect(()=>{
    let flippedCopy = flipped;
    flippedCopy[3] = [false, false]
    setTimeout(()=>{
      setFlipped(flippedCopy)
      setScreenText("Choose an action")
    }, 5000)
  },[])

  function liveBoard(playerCoinsCopy) {
    // console.log(" ")
    // console.log(flipped)
    // console.log(playerCoinsCopy)
    // console.log(deal)
    // console.log(deck)
  }

  async function addFakeDelay() {
    return await new Promise((resolve) => {
      let seconds =  Math.floor(Math.random() * 3) + 4; 
      function nextSecond() {
        setTimeout(() => {
          seconds -= 1;
          if (seconds <= 1) {
            resolve()
          } else (
            nextSecond()
          )
      }, 1000)}
      nextSecond();
    });
  }

  async function displayAction(initialPlayer, actionToDisplay, selectedPlayer, role) {
    return await new Promise((resolve) => {
      let seconds = 4;
      setScreenText(initialPlayer + " " + actionToDisplay + " " + selectedPlayer + role)
      function nextSecond() {
        setTimeout(() => {
          seconds -= 1;
          if (seconds <= 1) {
            resolve()
          } else (
            nextSecond()
          )
      }, 1000)}
      nextSecond();
    });
  }

  function determineChallengeWinner(player1, player2, decision) {
    console.log(decision)
    let card = "";
    if (decision === "Kill") {card = "Assassin"}
    else if (decision = "Swap") {card = "Ambassador"}
    else if (decision = "Steal") {card = "Captain"}
    else if (decision = "Take 3") {card = "Duke"}

    if (card === deal[player2][0] || card === deal[player2][1]) {
      return true
    } else {return false}
  }

  async function performChallenge(player1, player2, challenge, turn, decision) {
    console.log(challenge)
    let flippedCopy = flipped
    if (challenge === "Challenge") {
      await displayAction(triangleNames[player1], "has challenged", triangleNames[player2], "")
      let result = determineChallengeWinner(player1, player2, decision) 
      if (!result) {
        await displayAction(triangleNames[player1], "has won the challenge!", "", "")
        await choseCardToLose(flippedCopy, player2)
        return true 
      } else {
        await displayAction(triangleNames[player1], "has lost the challenge", "", "")
        await choseCardToLose(flippedCopy, player1)
        return false
      }
    } else if (challenge === "Block as Duke") {
      await displayAction(triangleNames[player1], "has blocked", triangleNames[player2], " as Duke")
      let result = await waitForChallenge(3, challenge, actionsAvailable);
    } else if (challenge === "Block as Captain") {
      await displayAction(triangleNames[player1], "has blocked", triangleNames[player2], " as Captain")
      let result = await waitForChallenge(3, challenge, actionsAvailable);
    } else if (challenge === "Block as Ambassador") {
      await displayAction(triangleNames[player1], "has blocked", triangleNames[player2], " as Ambassador")
      let result = await waitForChallenge(3, challenge, actionsAvailable);
    } else if (challenge === "Block as Contessa") {
      await displayAction(triangleNames[player1], "has blocked", triangleNames[player2], " as Contessa")
      let result = await waitForChallenge(3, challenge, actionsAvailable);
    }

    return true
  }


  async function choseCardToLose(flippedCopy, selectedTriangle) {
    setScreenText("Choose card to flip")
    let current = currentName;
    setCurrentName(triangleNames[selectedTriangle]);
    let flippedCopy2 = flippedCopy;
    if (selectedTriangle === 3) {
      setAction("Swap")
      if (flippedCopy[3][0]) {flippedCopy[3][1] = true; setShow2nd(false)}
      else if (flippedCopy[3][1]) {flippedCopy[3][0] = true; setShow1st(false)}
      else {
        const selectedCardToLose = await new Promise((resolve) => {
          const onCardSelect = () => {
            if (!flippedCopy[3][selectedCard-1]) {
              if (selectedCard === 1) {setShow1st(false); resolve(0)}
              if (selectedCard === 2) {setShow2nd(false); resolve(1)}
            }
            document.removeEventListener("cardSelected", onCardSelect);
          };
          document.addEventListener("cardSelected", onCardSelect);
        });

        flippedCopy[3][selectedCardToLose] = true;
      }
    } else {
      // Computer flips
      if (flippedCopy[selectedTriangle][0]) {
        flippedCopy[selectedTriangle][1] = true;
      } else if (flippedCopy[selectedTriangle][1]) {
        flippedCopy[selectedTriangle][0] = true;
      } else {
        flippedCopy[selectedTriangle][Math.floor(Math.random() * 2) ] = true;
      }
    }
    setFlipped(flippedCopy)
    setAction("None")
    setCurrentName(current);
  }


  async function waitForChallenge(turn, decision, actionsAvailableArray) {
    setScreenText("Challenges?");
    return new Promise((resolve) => {
      let seconds = 6;
      let challenge = "";
      let actionsArray = actionsAvailableArray[3]
      console.log(actionsArray)
      const onFirstSelected = () => {challenge = actionsAvailableArray[3][0]}
      const onSecondSelected = () => {challenge = actionsAvailableArray[3][1]}
      const onThirdSelected = () => {challenge = actionsAvailableArray[3][2]}
      
      function nextSecond() {
        setTimeout(async () => {
          if (seconds < 1) {
            setScreenText(null)   
            resolve(false)
          } else if (challenge !== "") {
            setActionSelected(true)
            setScreenText(null) 
            let winningChallenge = await performChallenge(3, activeTriangles[(turn % playerCount) - 1], challenge, turn, decision)
            document.removeEventListener("firstSelected", onFirstSelected);
            document.removeEventListener("secondSelected", onSecondSelected);
            document.removeEventListener("thirdSelected", onThirdSelected);
            resolve(winningChallenge)
          } else {
          seconds -= 1
          setScreenText("Challenges? " + seconds);
          nextSecond()
          }
        }, 1000);
      } 

      document.addEventListener("firstSelected", onFirstSelected);
      document.addEventListener("secondSelected", onSecondSelected);
      document.addEventListener("thirdSelected", onThirdSelected);
      nextSecond()
    });
  }


  function checkGameOver() {
    let playersLeft = 0;
    // check other players
    for (let i=0;i<activeTriangles.length;i++) {
      if (!flipped[activeTriangles[i]][0] || !flipped[activeTriangles[i]][1]) {
        playersLeft += 1;
      } 
    }
    if (!flipped[3][0] || !flipped[3][1]) {playersLeft += 1}
    if (playersLeft <= 1) {return true }
    else { return false }
  }

  async function computerAction(turn, triangle, playerCoinsCopy) {
    let random = Math.random();
    let decidedAction = "is taking 1 coin"
    let decision = "1"
    let role = "";
    let decider = 0;
    let selectable = []
    for (let i=0;i<activeTriangles.length;i++) {
      if (flipped[activeTriangles[i]][0] === false || flipped[activeTriangles[i]][1] === false) {
        if (activeTriangles[i] !== activeTriangles[(turn % playerCount) - 1]) {selectable.push(activeTriangles[i])}
      }
    }
    if (flipped[3][0] === false || flipped[3][1] === false) {
      selectable.push(3)
    }
    if (playerCoinsCopy[triangle] >= 7) {
      decider = Math.floor(Math.random() * selectable.length)
      decision = "Coup"
      decidedAction = "chose to coup " + triangleNames[selectable[decider]]
    } else {
      if (random > 0.6) {
        // going to take coins
        if (random > 0.85) {decidedAction = "is taking 1 coin"; decision = "1"}
        else {decidedAction = "is taking 2 coins"; decision = "2"}
      } else {
        // going to perform an action -> 1/3 is a lie
        random = Math.random();
        let possibility1 = deal[triangle][0]
        if (possibility1 === "Assassin") {possibility1 = "Kill"}
        else if (possibility1 === "Duke") {possibility1 = "Take 3"}
        else if (possibility1 === "Ambassador") {possibility1 = "Swap"}
        else if (possibility1 === "Captain") {possibility1 = "Steal"}
        let possibility2 = deal[triangle][1]
        if (possibility2 === "Assassin") {possibility2 = "Kill"}
        else if (possibility2 === "Duke") {possibility2 = "Take 3"}
        else if (possibility2 === "Ambassador") {possibility2 = "Swap"}
        else if (possibility2 === "Captain") {possibility2 = "Steal"}
       
       // Make a decision
        if (random < 0.66) {
          // truth will be told 
          random = Math.random()
          if (possibility1 === "Kill" || possibility2 === "Kill") {
            if (playerCoinsCopy[triangle] >= 3) { decision = "Kill" } 
            else {
              if (possibility1 !== "Kill") { decision = possibility1 }
              else if (possibility2 !== "Kill") {decision = possibility2}
              else {decision = "Take 3"}
            }
          } else {
            if (random > 0.5) { decision = possibility1 }
            else {decision = possibility2}
          }
        } else {
          // a lie will be told
          random = Math.floor(Math.random() * 4)
          let possibleActions = ["Kill", "Steal", "Swap", "Take3"]
          let possibleActions2 = []
          for (let i=0;i<possibleActions.length;i++) {
            if (possibleActions[i] !== possibility1 && possibleActions[i] !== possibility2) {possibleActions2.push(possibleActions[i])}
          }
          random = Math.random()
          if (possibleActions2[0] === "Kill" || possibleActions2[1] === "Kill") {
            if (playerCoinsCopy[triangle] >= 3) {decision = "Kill"}
            else {decision = "Take 3"}
          } else {
            if (possibility1 !== "Kill") { decision = possibility1 }
            else if (possibility2 !== "Kill") {decision = possibility2}
            else {decision = "Take 3"}
          }
        }
        let stealable = []
        if (decision = "Steal") {
          for (let j=0;j<selectable.length;j++) {
            if (playerCoinsCopy[selectable[j]] >= 2) {stealable.push(selectable[j])} 
          }
          if (stealable.length >= 1) {
            decider = Math.floor(Math.random() * stealable.length)
            decidedAction = "is stealing from " + triangleNames[stealable[decider]]; role = " as Captain"
          } else {
            decision = "Take 3"
          }
        } else {

          decider = Math.floor(Math.random() * selectable.length)
          if (flipped[selectable[decider]][0] && flipped[selectable[decider]][1]) {decider = selectable.length - 1}
          console.log(selectable)
          console.log(decider)
          console.log(selectable[decider])
          if (decision === "Take 3") {decidedAction = "is taking 3 coins"; role = " as Duke"}
          else if (decision === "Swap") {decidedAction = "is swapping cards"; role = " as Ambassador"}
          else if (decision === "Kill") {decidedAction = "is killing " + triangleNames[selectable[decider]]; role = " as Assassin"}
        }
      }
    }

    await displayAction(playerNames[turn % playerCount], decidedAction, "", role)

    return [decision, selectable[decider]];
  }


  async function simulateComputerMove(turn, coinCount, playerCoinsCopy) {

    setScreenText("Choose an action")
    setAction("None")
    setActionSelected(false)
    if (checkGameOver()) {
      setGameOver(true)
      setScreenText("")
      return true
    }

    // liveBoard(playerCoinsCopy);
    
    let triangle = 3;
    if (playerCount === 2) {
      if (turn % playerCount === 1) {
        triangle = 0
      } 
    }

    if (playerCount === 3) {
      if (turn % playerCount === 1) {
        triangle = 5
      } else if (turn % playerCount === 2) {
        triangle = 1
      } 
    }

    if (playerCount === 4) {
      if (turn % playerCount === 1) {
        triangle = 5
      } else if (turn % playerCount === 2) {
        triangle = 0
      } else if (turn % playerCount === 3) {
        triangle = 1
      } 
    }

    if (playerCount === 5) {
      if (turn % playerCount === 1) {
        triangle = 5
      } else if (turn % playerCount === 2) {
        triangle = 0
      } else if (turn % playerCount === 3) {
        triangle = 1
      } else if (turn % playerCount === 4) {
        triangle = 2
      } 
    }

    if (playerCount === 6) {
      if (turn % playerCount === 1) {
        triangle = 4
      } else if (turn % playerCount === 2) {
        triangle = 5
      } else if (turn % playerCount === 3) {
        triangle = 0
      } else if (turn % playerCount === 4) {
        triangle = 1
      } else if (turn % playerCount === 5) {
        triangle = 2
      } 
    }

    let actionsAvailableArray = actionsAvailable;
    let nextTriangle = activeTriangles[(turn % playerCount) - 1]
    if (nextTriangle === undefined ) {nextTriangle = 3}
    let nextTriangleName = triangleNames[nextTriangle]
    let playerCoinsArray = playerCoinsCopy;
    setCurrentName(nextTriangleName)
    setTriangle(nextTriangle)
    if (flipped[nextTriangle][0] && flipped[nextTriangle][1]) { 
      // player is out
      let nextTurn = turn + 1;
      setPlayerTurn(nextTurn);
      actionsAvailableArray[3] = []
      setActionsAvailable(actionsAvailableArray)
      await simulateComputerMove(nextTurn, coinCount, playerCoinsCopy);
    } else {
      if (turn % playerCount !== 0) {
        await addFakeDelay();
        let decision = await computerAction(turn, triangle, playerCoinsCopy);
        let challengeWon;
        if (decision[0] === "1") {playerCoinsArray[triangle] += 1} 
        else if (decision[0] === "Coup") {
          actionsAvailableArray[3] = []; 
          selectedActions = [];
          playerCoinsArray[triangle] -= 7;
          setActionsAvailable(actionsAvailableArray)
          await choseCardToLose(flipped, decision[1])
        } else {
          if (decision[0] === "2") {actionsAvailableArray[3] = ["Block as Duke"]; selectedActions = ["Block as Duke"]}
          else if (decision[0] === "Steal") {
            if (decision[1] === 3) {
              actionsAvailableArray[3] = ["Challenge", "Block as Captain", "Block as Ambassador"]; 
              selectedActions = ["Challenge", "Block as Captain", "Block as Ambassador"]
            } else {
              actionsAvailableArray[3] = ["Challenge"]; 
              selectedActions = ["Challenge"]
            }
          } else if (decision[0] === "Kill") {actionsAvailableArray[3] = ["Challenge", "Block as Contessa"]; selectedActions = ["Challenge", "Block as Contessa"]}
          else {actionsAvailableArray[3] = ["Challenge"]; selectedActions = ["Challenge"]}
          setActionsAvailable(actionsAvailableArray)
          
          challengeWon = await waitForChallenge(turn, decision[0], actionsAvailableArray);
          actionsAvailableArray[3] = []
          setActionsAvailable(actionsAvailableArray)
          if (!challengeWon) {
            if (decision[0] === "2") {
              playerCoinsArray[triangle] += 2
            } else  if (decision[0] === "Take 3") {
              playerCoinsArray[triangle] += 3
            } else if (decision[0] === "Kill") {
              playerCoinsArray[triangle] -= 3
              await choseCardToLose(flipped, decision[1])
            } else if (decision[0] === "Steal") {
              playerCoinsArray[triangle] += 2
              playerCoinsArray[decision[1]] -= 2
            } 
          }
        }
        setPlayerCoins(playerCoinsArray)
        const nextTurn = turn + 1;
        setPlayerTurn(nextTurn);
        actionsAvailableArray[3] = []
        setActionsAvailable(actionsAvailableArray)
        await simulateComputerMove(nextTurn, coinCount, playerCoinsCopy);

      } else { 
        setCurrentName(triangleNames[3]);
        selectedActions = ["Kill","Steal", "Swap", "Take 3","Coup"]
        setActionSelected(false)
        if (playerCoinsArray[3] >= 10) {
          actionsAvailableArray[3] = ["Coup"] 
        } else if (playerCoinsArray[3] >= 7) {
          actionsAvailableArray[3] = ["Kill", "Steal", "Swap", "Take 3", "Coup"]
        } else if (playerCoinsArray[3] >= 3) {
          actionsAvailableArray[3] = ["Kill", "Steal", "Swap", "Take 3"]
        } else {
          actionsAvailableArray[3] = ["Steal", "Swap", "Take 3"]
        }
        setActionsAvailable(actionsAvailableArray)
      }

    } 
  }
  

  async function handleAction(chosenAction) {

    // Determine other players in game
    let selectable = []
    for (let i=0;i<activeTriangles.length;i++) {
      if (flipped[activeTriangles[i]][0] === false || flipped[activeTriangles[i]][1] === false) {
        selectable.push(activeTriangles[i])
      }
    }
   
    let playerCoinsCopy = [...playerCoins];
    let flippedCopy = flipped;
    
    // If it is your turn
    if (playerTurn % playerCount === 0) {
      let coinCount = playerCoins[3];
      let selectedTriangle;

      if (chosenAction === "1" || chosenAction === "2" || chosenAction === "Take 3") {
        if (coinCount < 10) {
          let actionHere = chosenAction;
          setActionSelected(true);
          let plural = "s"
          if (chosenAction === "1") {plural = ''}
          if (chosenAction === "Take 3") {
            actionHere = "3"
            await displayAction(playerNames[0], "is taking " + actionHere + " coin" + plural, '', " as Duke");
          } else {
            await displayAction(playerNames[0], "is taking " + actionHere + " coin" + plural, '', '');
          }
          if (chosenAction === "2" || chosenAction === "Take 3") {await waitForChallenge(0, chosenAction, actionsAvailable);}
          coinCount += Number(actionHere);
          playerCoinsCopy[3] += Number(actionHere);
          setPlayerCoins(playerCoinsCopy);
        } 
      } 
      else if (chosenAction === "Kill") {
        setScreenText("Select a player");
        setShow3rd(false)
        setShow4th(false)
        setSelectableTriangles(selectable);
        selectedTriangle = await new Promise((resolve) => {
          const onTriangleSelected = () => {
            if (activeTriangles.includes(selected)) {
              console.log(selected)
              resolve(selected);
              setSelectableTriangles([]);
            }
            document.removeEventListener("triangleSelected", onTriangleSelected);
          };
  
          document.addEventListener("triangleSelected", onTriangleSelected);
        });

        setActionSelected(true);
        let person = 0;
        for (let i=0;i<activeTriangles.length;i++) {
          if (activeTriangles[i] === selectedTriangle) {person = i + 1}
        }
        await displayAction(playerNames[0], "is killing", playerNames[person], " as Assassin");
        let result = await waitForChallenge(0, chosenAction, actionsAvailable); 
        if (!result) {
          await choseCardToLose(flippedCopy, selectedTriangle)
          coinCount -= 3;
          playerCoinsCopy[3] -= 3;
          setPlayerCoins(playerCoinsCopy);
          setSelectableTriangles([])
        }
      } else if (chosenAction === "Steal") {
        //STEAL 
        // Select a person
        setScreenText("Select a player");
        setShow3rd(false)
        setShow4th(false)
        setSelectableTriangles(selectable);
        selectedTriangle = await new Promise((resolve) => {
          const onTriangleSelected = () => {
            if (activeTriangles.includes(selected) && playerCoins[selected] >= 2) {
              console.log(selected)
              resolve(selected);
              setSelectableTriangles([]);
            }
            document.removeEventListener("triangleSelected", onTriangleSelected);
          };
          document.addEventListener("triangleSelected", onTriangleSelected);
        });

        setActionSelected(true);
        let person = 0; 
        for (let i=0;i<activeTriangles.length;i++) {
          if (activeTriangles[i] === selectedTriangle) {person = i + 1}
        }
        await displayAction(playerNames[0], "is stealing from", playerNames[person], " as Captain");
        await waitForChallenge(0, chosenAction, actionsAvailable); 

        // Perform exchange of currency
        coinCount += 2;
        playerCoinsCopy[3] += 2;
        for (let i=0;i<activeTriangles.length;i++) {
          if (activeTriangles[i] === selected) {
            playerCoinsCopy[selected] -= 2;
          }
        }
        setPlayerCoins(playerCoinsCopy);

      } else if (chosenAction === "Swap") {
        setSelectableTriangles([]);
        //SWAP

        setActionSelected(true);
        await displayAction(playerNames[0], "is swapping cards", "", " as Ambassador");
        await waitForChallenge(0, chosenAction, actionsAvailable); 
        
        if (!flipped[3][0] && !flipped[3][1]) {

          setScreenText("Select 2 to discard");
          let swaps = [deal[3][0], deal[3][1], deck[0], deck[1]]
          let dealCopy = deal
          dealCopy[3] = swaps
          setDeal(dealCopy)
          setShow2nd(true)
          setShow3rd(true)
          setShow4th(true)

          // Choose first card
          const selectedCard1 = await new Promise((resolve) => {
            const onCardSelect1 = () => {
              if (selectedCard === 1) {resolve(swaps[0])}
              if (selectedCard === 2) {resolve(swaps[1])}
              if (selectedCard === 3) {resolve(swaps[2])}
              if (selectedCard === 4) {resolve(swaps[3])}
            
              document.removeEventListener("cardSelected", onCardSelect1);
            };
            document.addEventListener("cardSelected", onCardSelect1);
          });
        
          // Update Deal
          if (swaps[0] === selectedCard1) {swaps = [swaps[1],swaps[2],swaps[3]]}
          else if (swaps[1] === selectedCard1) {swaps = [swaps[0],swaps[2],swaps[3]]}
          else if (swaps[2] === selectedCard1) {swaps = [swaps[0],swaps[1],swaps[3]]}
          else if (swaps[3] === selectedCard1) {swaps = [swaps[0],swaps[1],swaps[2]]}
          dealCopy[3] = swaps
          setDeal(dealCopy)
          setShow4th(false)
          setScreenText("Select 1 to discard");

          const selectedCard2 = await new Promise((resolve) => {
            const onCardSelect = () => {
              if (selectedCard === 1) {resolve(swaps[0])}
              if (selectedCard === 2) {resolve(swaps[1])}
              if (selectedCard === 3) {resolve(swaps[2])}
            
              document.removeEventListener("cardSelected", onCardSelect);
            };
            document.addEventListener("cardSelected", onCardSelect);
          });
    
          if (swaps[0] === selectedCard2) {swaps = [swaps[1],swaps[2]]}
          else if (swaps[1] === selectedCard2) {swaps = [swaps[0],swaps[2]]}
          else if (swaps[2] === selectedCard2) {swaps = [swaps[0],swaps[1]]}
          dealCopy[3] = swaps
          setDeal(dealCopy)
          setShow3rd(false)
          console.log(swaps)

        
          // Update Deck
          let deckCopy = []
          for (let i=2;i<deck.length;i++) { deckCopy.push(deck[i])}
          deckCopy.push(selectedCard1)
          deckCopy.push(selectedCard2)
          setDeck(deckCopy)
        } else {
         




          setScreenText("Select 2 to discard");
          let swaps = [deal[3][0], deck[0], deck[1]]
          if (flipped[3][0]) {swaps[0] = deal[3][1]}
          let dealCopy = deal
          dealCopy[3] = swaps
          setDeal(dealCopy)
          setShow2nd(true)
          setShow3rd(true)
          setShow4th(false)

          // Choose first card
          const selectedCard1 = await new Promise((resolve) => {
            const onCardSelect1 = () => {
              if (selectedCard === 1) {resolve(swaps[0])}
              if (selectedCard === 2) {resolve(swaps[1])}
              if (selectedCard === 3) {resolve(swaps[2])}
            
              document.removeEventListener("cardSelected", onCardSelect1);
            };
            document.addEventListener("cardSelected", onCardSelect1);
          });
        
          // Update Deal
          if (swaps[0] === selectedCard1) {swaps = [swaps[1],swaps[2]]}
          else if (swaps[1] === selectedCard1) {swaps = [swaps[0],swaps[2]]}
          else if (swaps[2] === selectedCard1) {swaps = [swaps[0],swaps[1]]}
          dealCopy[3] = swaps
          setDeal(dealCopy)
          setShow3rd(false)
          setScreenText("Select 1 to discard");

          const selectedCard2 = await new Promise((resolve) => {
            const onCardSelect = () => {
              if (selectedCard === 1) {resolve(swaps[0])}
              if (selectedCard === 2) {resolve(swaps[1])}
            
              document.removeEventListener("cardSelected", onCardSelect);
            };
            document.addEventListener("cardSelected", onCardSelect);
          });
    
          if (swaps[0] === selectedCard2) {swaps = [swaps[1]]}
          else if (swaps[1] === selectedCard2) {swaps = [swaps[0]]}
          dealCopy[3] = swaps
          setDeal(dealCopy)
          setShow2nd(false)
        
          // Update Deck
          let deckCopy = []
          for (let i=2;i<deck.length;i++) { deckCopy.push(deck[i])}
          deckCopy.push(selectedCard1)
          deckCopy.push(selectedCard2)
          setDeck(deckCopy)

        }

      } else if (chosenAction === "Coup") {
        setScreenText("Select a player");
        setShow3rd(false)
        setShow4th(false)
        setSelectableTriangles(selectable);
        selectedTriangle = await new Promise((resolve) => {
          const onTriangleSelected = () => {
            if (activeTriangles.includes(selected)) {
              console.log(selected)
              resolve(selected);
              setSelectableTriangles([]);
            }
            document.removeEventListener("triangleSelected", onTriangleSelected);
          };
  
          document.addEventListener("triangleSelected", onTriangleSelected);
        });

        let person = 0;
        for (let i=0;i<activeTriangles.length;i++) {
          if (activeTriangles[i] === selectedTriangle) {person = i + 1}
        }
        await displayAction(playerNames[0], "chose to coup", playerNames[person], "");
        await choseCardToLose(flippedCopy, selectedTriangle)
        coinCount -= 7;
        playerCoinsCopy[3] -= 7;
        setPlayerCoins(playerCoinsCopy);
  
        // Set the chosen triangle after the promise resolves
        setChosenTriangle(selectedTriangle);
      } 
            

      // Turn is over
      setActionSelected(false)
      setSelectableTriangles([]);
      setShow3rd(false)
      setShow4th(false)

      setAction(null)
      let actionsAvailableArray = actionsAvailable;
      actionsAvailableArray[3] = []
      setActionsAvailable(actionsAvailableArray)

      if (checkGameOver()) {
        console.log("Game Over!")
        return
      }

      let turn = playerTurn + 1;
      setPlayerTurn(turn);
      
      // Simulate computer moves for other players
      simulateComputerMove(turn, coinCount, playerCoinsCopy);
    }
  }

  let screenSize = window.innerHeight * 0.521;

  function returnSRC(triangle, order) {
    if (deal[triangle][order] === "Assassin") {return Assassin}
    if (deal[triangle][order] === "Contessa") {return Contessa}
    if (deal[triangle][order] === "Captain") {return Captain}
    if (deal[triangle][order] === "Duke") {return Duke}
    if (deal[triangle][order] === "Ambassador") {return Ambassador}
    return Contessa
  }

  return (
    <div className="board">

      <div className="board-live">
        <Hexagon/>

        {activeTriangles.includes(0) && <div className="cards-container" style={{marginTop: "9px", transform: "rotate(180deg)"}}>
          <div className="playercard"> {flipped[0][0]? <img src={returnSRC(0,0)} alt=""/> : <></>} </div>
          <div className="playercard">  {flipped[0][1]? <img src={returnSRC(0,1)} alt=""/> : <></>}  </div>
          <div className="coins" style={{transform: "rotate(-180deg)"}}> <div className="coins2">{playerCoins[0]}</div></div>
        </div>}

        <div className="cards-container" style={{marginTop: "311px"}}>
          <div className="playercard">  {flipped[3][0]? <img src={returnSRC(3,0)} alt=""/> : <></>}  </div>
          <div className="playercard">  {flipped[3][1]? <img src={returnSRC(3,1)} alt=""/> : <></>}  </div>
          <div className="coins"> <div className="coins2">{playerCoins[3]}</div></div>
        </div>
      
        {activeTriangles.includes(4) && <div className="cards-container bottomLeft" style={{marginTop: "235px", transform: "rotate(60deg)", marginLeft: "-262px"}}>
          <div className="playercard">  {flipped[4][0]? <img src={returnSRC(4,0)} alt=""/> : <></>}  </div>
          <div className="playercard">  {flipped[4][1]? <img src={returnSRC(4,1)} alt=""/> : <></>}  </div>
          <div className="coins" style={{transform: "rotate(-60deg)"}}> <div className="coins2">{playerCoins[4]}</div></div>
        </div>}

        {activeTriangles.includes(2) && <div className="cards-container bottomRight" style={{marginTop: "235px", transform: "rotate(-60deg)", marginLeft: "262px"}}>
          <div className="playercard">  {flipped[2][0]? <img src={returnSRC(2,0)} alt=""/> : <></>}  </div>
          <div className="playercard">  {flipped[2][1]? <img src={returnSRC(2,1)} alt=""/> : <></>}  </div>
          <div className="coins" style={{transform: "rotate(60deg)"}}> <div className="coins2">{playerCoins[2]}</div></div>
        </div>}

        {activeTriangles.includes(5) && <div className="cards-container topLeft" style={{marginTop: "86px", transform: "rotate(120deg)", marginLeft: "-262px"}}>
          <div className="playercard">  {flipped[5][0]? <img src={returnSRC(5,0)} alt=""/> : <></>}  </div>
          <div className="playercard">  {flipped[5][1]? <img src={returnSRC(5,1)} alt=""/> : <></>}  </div>
          <div className="coins" style={{transform: "rotate(-120deg)"}}> <div className="coins2">{playerCoins[5]}</div></div>
        </div>}

        {activeTriangles.includes(1) && <div className="cards-container topRight" style={{marginTop: "86px", transform: "rotate(-120deg)", marginLeft: "262px"}}>
          <div className="playercard">  {flipped[1][0]? <img src={returnSRC(1,0)} alt=""/> : <></>}  </div>
          <div className="playercard">  {flipped[1][1]? <img src={returnSRC(1,1)} alt=""/> : <></>}  </div>
          <div className="coins" style={{transform: "rotate(120deg)"}}> <div className="coins2">{playerCoins[1]}</div></div>
        </div>}

        <div 
          className="screenTextDiv"
          style={{
            width: "100vw",
            height: `${screenSize}px`,
            position: "absolute",
            zIndex: 11,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}>
            <div className="screenText" 
              style={{
                marginTop: `${screenSize * 0.2}px`,
                height: `${screenSize * 0.6}px`,
                width: `${screenSize * 0.6}px`,
                borderRadius: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                zIndex: 12,
                userSelect: "none",
                textAlign: "center",
            }}>
               <p style={{fontSize: "20px", fontWeight: 500, userSelect: "none"}}>
                {gameOver? "Game Over!" : currentName}
              </p>
              <div className="screenTextLine" style={{height: "2px", width: "65%", borderRadius: "2px", opacity: 0.7}}></div>
              <p style={{fontSize: "16px", maxWidth: "75%", userSelect: "none"}}>
                {screenText}
              </p>
            </div>
        </div>
      </div>

      <div 
        className="take-coins" 
        style={{
          opacity: playerTurn % playerCount === 0 && !(playerCoins[0] >= 10)? 1 : 0.5,
          pointerEvents: playerTurn % playerCount === 0 && !(playerCoins[0] >= 10)? actionSelected? "none" : "all" : "none",
       }}>
        <div id="take1" className="take take1" onClick={() => {setAction("1");   handleAction("1") }}>
          <p>Take 1</p>
        </div>
        <div id="take1" className="take take2" onClick={() => {setAction("2");   handleAction("2") }}>
          <p>Take 2</p>
        </div>
      </div>

      <div className="cards">
        {show1st && <div className="card card1"
            onClick={()=>{  
              selectedCard = 1
              document.dispatchEvent(new Event("cardSelected"));
            }}
            style={{
              cursor: action === "Swap" ? "pointer" : "default"
            }}>
           <p>{deal[3][0]}</p>
         </div>}

         {show2nd && <div className="card card2"
            onClick={()=>{  
              selectedCard = 2
              document.dispatchEvent(new Event("cardSelected"));
            }}
            style={{
            cursor: action === "Swap" ? "pointer" : "default"
          }}>
           <p>{deal[3][1]}</p>
          </div>}

          {show3rd && <div className="card"
            onClick={()=>{  
              selectedCard = 3
              document.dispatchEvent(new Event("cardSelected"));
            }}
            style={{
            cursor: action === "Swap" ? "pointer" : "default"
          }}>
           <p>{deal[3][2]}</p>
          </div>}

          {show4th && <div className="card"    
            onClick={()=>{  
              selectedCard = 4
              document.dispatchEvent(new Event("cardSelected"));
            }}
            style={{
            cursor: action === "Swap" ? "pointer" : "default"
          }}>
           <p>{deal[3][3]}</p>
          </div>}

          <div className="coins" style={{marginTop: action === "Swap" ? "-60px" : "-3px"}}>
           <div className="coins2">
             {playerCoins[3]}
           </div>
         </div>
       </div>

      <div 
        className="board-actions">
        {actionsAvailable[3][0] &&  <div 
          className="action action1" 
          
          onClick={()=> {
            selectedActions = [actionsAvailable[3][0]]
            setAction(actionsAvailable[3][0]); 
            handleAction(actionsAvailable[3][0])
            document.dispatchEvent(new Event("firstSelected")); 
          }}
          style={{
            filter: selectedActions.includes(actionsAvailable[3][0]) ? "none" : "brightness(0.5)",
            boxShadow: action === actionsAvailable[3][0] ? "0 0 6px rgba(52, 152, 219, 0.9), 0 0 6px rgba(52, 152, 219, 0.6)" : "none",
            pointerEvents: actionSelected? "none" : "all"
          }}>
          {actionsAvailable[3][0]}
        </div>}

        {actionsAvailable[3][1] && <div 
          className="action action2" 
          onClick={()=> {
            selectedActions = [actionsAvailable[3][1]]
            setAction(actionsAvailable[3][1]); 
            handleAction(actionsAvailable[3][1])
            document.dispatchEvent(new Event("secondSelected")); 
          }}
          style={{
            filter: selectedActions.includes(actionsAvailable[3][1]) ? "none" : "brightness(0.5)",
            boxShadow: action === actionsAvailable[3][1] ? "0 0 6px rgba(52, 152, 219, 0.9), 0 0 6px rgba(52, 152, 219, 0.6)" : "none",
            pointerEvents: actionSelected? "none" : "all"
          }}>
          {actionsAvailable[3][1]}
        </div>}

        {actionsAvailable[3][2] && <div 
          className="action action3" 
          onClick={()=> {
            selectedActions = [actionsAvailable[3][2]]
            setAction(actionsAvailable[3][2]); 
            handleAction(actionsAvailable[3][2])
            document.dispatchEvent(new Event("thirdSelected"))
          }}
          style={{
            filter: selectedActions.includes(actionsAvailable[3][2]) ? "none" : "brightness(0.5)",
            boxShadow: action === actionsAvailable[3][2] ? "0 0 6px rgba(52, 152, 219, 0.9), 0 0 6px rgba(52, 152, 219, 0.6)" : "none",
            pointerEvents: actionSelected? "none" : "all"
         }}>
          {actionsAvailable[3][2]}
        </div>}

        {actionsAvailable[3][3] && <div 
          className="action action4" 
          onClick={()=> {
            selectedActions = [actionsAvailable[3][3]];
            setAction(actionsAvailable[3][3]); 
            handleAction(actionsAvailable[3][3])}}
          style={{
            filter: selectedActions.includes(actionsAvailable[3][3]) ? "none" : "brightness(0.5)",
            boxShadow: action === actionsAvailable[3][3] ? "0 0 6px rgba(52, 152, 219, 0.9), 0 0 6px rgba(52, 152, 219, 0.6)" : "none",
            pointerEvents: actionSelected? "none" : "all"
          }}>
          {actionsAvailable[3][3]}
        </div>}

        {actionsAvailable[3][4] && <div 
          className="action action4" 
          onClick={()=> {
            selectedActions = [actionsAvailable[3][4]];
            setAction(actionsAvailable[3][4]); 
            handleAction(actionsAvailable[3][4])}}
          style={{
            filter: selectedActions.includes(actionsAvailable[3][4]) ? "none" : "brightness(0.5)",
            boxShadow: action === actionsAvailable[3][4] ? "0 0 6px rgba(52, 152, 219, 0.9), 0 0 6px rgba(52, 152, 219, 0.6)" : "none",
            pointerEvents: actionSelected? "none" : "all"
          }}>
          {actionsAvailable[3][4]}
        </div>}
      
      </div>

    </div>
  );
};



const Hexagon = () => {
  const size = window.innerHeight * 0.3;
  const height = Math.sqrt(3) * size;
  const width = 2 * size;

  // Calculate the angle between triangles
  const angle = 60; // degrees

  return (
    <>
      <svg width={width} height={height} style={{ display: 'block', margin: '1px' }}>
        <polygon
          points={`${size / 2},0 ${size * 1.5},0 ${width},${height / 2} ${size * 1.5},${height} ${size / 2},${height} 0,${
            height / 2
          }`}
          style={{
            fill: 'none',
            stroke: 'transparent',
            strokeWidth: '1px',
            strokeLinecap: 'round',
            fill: 'lightgrey',
          }}
        />
      </svg>

      {/* Render six triangles */}
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <Triangle
          key={index}
          rotate={`rotate(${angle * index}deg)`} 
          val={index}
        />
      ))}
    </>
  );
};


const Triangle = ({ rotate, val }) => {
  const setChosenTriangle = useChosenTriangleStore((state) => state.setChosenTriangle);
  var selectableTriangles = useSelectableTrianglesStore((state) => state.selectableTriangles);
  var flipped = useFlippedStore((state) => state.flipped);
  var triangle = useTriangleStore((state) => state.triangle);

  const size = window.innerHeight * 0.3;
  const centerX = size / 2;
  const centerY = (size / 2) * Math.sqrt(3);

  // Calculate the position of the red rectangles within the triangle
  const rectWidth = 25;
  const rectHeight = 40;

  // Calculate the position of the red rectangle perfectly centered inside the triangle
  const rectX = centerX - rectWidth / 2;
  const rectY = centerY - (rectHeight * Math.sqrt(3)) / 2;

  return (
      <svg
        width={size}
        height={size}
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          transformOrigin: "50% 87%",
          transform: `${rotate}`,
        }}
        viewBox="0 0 100 100"
      >
        <polygon
          points="0,0 100,0 50,87"
          fill={triangle === val ? "grey" : selectableTriangles.includes(val) ? "lightblue" : "#A5A5A5"}
          stroke={triangle === val ? "transparent" : "lightgrey"}
          strokeWidth="0.1px"
          onClick={() => {
            selected = val;
            console.log(selected)
            setChosenTriangle(val); 
            document.dispatchEvent(new Event("triangleSelected")); 
          }}
        >
        </polygon>
      </svg>
  );
};

export default Board;