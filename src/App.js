import "./app.scss";
import {createBrowserRouter, RouterProvider, Outlet, Navigate} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import "./style.scss";
import { useContext, useState, useEffect, useRef} from "react";
import { useActionsAvailableStore, useActiveTrianglesStore, useActivitiesStore, useCurrentNameStore, useDealStore, useDeckStore, useFlippedStore, useGameStartedStore, usePlayerCoinsStore, usePlayerNamesStore, usePlayerTurnStore, useTriangleNamesStore} from "./activitiesStore";
import Board from "./components/board/Board";
import Bottom from "./components/bottom/Bottom";

function App() {

  // Game Variables 
  let playerCount = 3;
  const cardNames = ["Assassin", "Contessa", "Duke", "Captain", "Ambassador"] 

  // Intialial State 
  const setGameStarted = useGameStartedStore((state) => state.setGameStarted);

  // Deal of cards
  const setDeal = useDealStore((state) => state.setDeal);
  // var deal = useDealStore((state) => state.deal);

  // Player Coins
  const setPlayerCoins = usePlayerCoinsStore((state) => state.setPlayerCoins);
  // var playerCoins = usePlayerCoinsStore((state) => state.playerCoins);

  // Remaining Deck 
  const setDeck = useDeckStore((state) => state.setDeck);
  // var deck = useDeckStore((state) => state.deck);

  // Keep track of turns 
  const setPlayerTurn = usePlayerTurnStore((state) => state.setPlayerTurn);
  // var playerTurn = usePlayerTurnStore((state) => state.playerTurn);

  // Possible Actions 
  const setActionsAvailable = useActionsAvailableStore((state) => state.setActionsAvailable);
  // var actionsAvailable = useActionsAvailableStore((state) => state.actionsAvailable);

  // Flipped cards
  const setFlipped = useFlippedStore((state) => state.setFlipped);

  // Active Player Triangles
  const setActiveTriangles = useActiveTrianglesStore((state) => state.setActiveTriangles);

  const setPlayerNames = usePlayerNamesStore((state) => state.setPlayerNames)
  var playerNames = usePlayerNamesStore((state) => state.playerNames)

  const setCurrentName = useCurrentNameStore((state) => state.setCurrentName)
  const setTriangleNames = useTriangleNamesStore((state) => state.setTriangleNames)
  var triangleNames = useTriangleNamesStore((state) => state.triangleNames)

  const inputRef = useRef(null);
  // Initialize Game 
  function initializeGame() {
    // Deal Cards
    let newDeal = []
    let playerCoinsArray = [2,2,2,2,2,2];
    let flipppedArray = [[false, false],[false, false],[false, false],[true, true],[false, false],[false, false]]
    let actionsAvailableArray = [[],[],[],["Steal","Swap","Take 3"],[],[]]
    for (let i=0;i<playerCount;i++) {
      // For each player -> Deal cards
      newDeal.push([cardNames[Math.floor(Math.random() * 5)], cardNames[Math.floor(Math.random() * 5)]])
    }

    // index 3 is always current player 
    let boardDeal = [[],[],[],[newDeal[0][0],newDeal[0][1]],[],[]]
    let activeTrianglesCopy = []
    if (playerCount === 2) {activeTrianglesCopy = [0]}
    else if (playerCount === 3) {activeTrianglesCopy = [5,1]}
    else if (playerCount === 4) {activeTrianglesCopy = [5,0,1]}
    else if (playerCount === 5) {activeTrianglesCopy = [5,0,1,2]}
    else if (playerCount === 6) {activeTrianglesCopy = [4,5,0,1,2]}

    let j=1;
    for (let i=4;i<=5;i++) { 
      if (activeTrianglesCopy.includes(i)) {boardDeal[i] = newDeal[j]; j+= 1;}
    }
    for (let i=0;i<=2;i++) { 
      if (activeTrianglesCopy.includes(i)) {boardDeal[i] = newDeal[j]; j+= 1;}
    }

    setActiveTriangles(activeTrianglesCopy)
    setDeal(boardDeal);
    setPlayerCoins(playerCoinsArray);
    setActionsAvailable(actionsAvailableArray)
    setFlipped(flipppedArray)

    // Keep track of counts of cards dealt
    let cardTracker = [0,0,0,0,0]
    for (let i=0;i<playerCount;i++) {
      for (let k=0;k<2;k++) {
        for (let j=0;j<cardNames.length;j++) {
          if (newDeal[i][k] === cardNames[j]) {
            cardTracker[j] += 1;
          }
        }
      }
    }

    // Intialize Remaining Deck
    let fullDeck = []
    for (let i=0;i<5;i++) {
      for (let j=0;j<4-cardTracker[i];j++) {
        fullDeck.push(cardNames[i])
      }
    }
    fullDeck = shuffleArray(fullDeck);
    setDeck(fullDeck);
  }

  function shuffleArray(array) {
    const shuffledArray = [...array]; // Create a copy of the original array
  
    for(let j=0;j<5;j++) {
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // Swap elements at randomIndex and i
        const temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[randomIndex];
        shuffledArray[randomIndex] = temp;
      }
    }

    return shuffledArray;
  }

  useEffect(() => {
    // Focus the input element when the component mounts
    inputRef.current.focus();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      initializeGame();
      setGameStarted(true);
    }
  };

  const Layout = () => {

  var gameStarted = useGameStartedStore((state) => state.gameStarted);
    
    return (
      <div className="body">
        <div className="theme-dark"  id="body">
          <Navbar/>
         
          {!gameStarted?
          (<div className="waitingRoom">
            <div><input 
              ref={inputRef}
              autoComplete="off"
              type="text" 
              placeholder="First Name"
              onKeyPress={handleKeyPress}
              onChange={(e) => {if (e.target.value !== null) {
                let playerArray = playerNames
                playerArray[0] = e.target.value
                setPlayerNames(playerArray);
                let triangleArray = triangleNames;
                triangleArray[3] = e.target.value
                setTriangleNames(triangleArray);
                setCurrentName(e.target.value)
              }}}>
              </input>
              </div>
            <div className="play" 
              style={{pointerEvents: playerNames[0] !== ""? "none" : "all"}}
              onClick={()=>{
              if (playerNames[0] !== "") {
                initializeGame();
                setGameStarted(true);
              }
            }}>
              Play
            </div>
          </div>
          
          ) : (
          
          <>
            <Board 
              playerCount={playerCount} 
              cardNames={cardNames}
            />
            <Bottom/>
          </>)}

        </div>
      </div>
    );
  };


  const router = createBrowserRouter([
    {
      path: "/",
      element: (
          <Layout />
      ),
      children: [
   
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
