import { create } from "zustand";

export const useActivitiesStore = create((set) => ({
    activities: [],
    setActivities: (newActivities) => set({ activities: newActivities }),
    clearActivities: () => {
      localStorage.removeItem("Latest Activity");
      set(() => ({ activities: [] }));
    },
  }));

export const useLeftStore = create((set) => ({
  left: false,
  setLeft: (newLeft) => set({ left: newLeft }),
}));


export const usePlayerNamesStore = create((set) => ({
  playerNames: ["","Lola","Meagan"],
  setPlayerNames: (newPlayerNames) => set({ playerNames: newPlayerNames }),
}));

export const useCurrentNameStore = create((set) => ({
  currentName: "",
  setCurrentName: (newCurrentName) => set({ currentName: newCurrentName }),
}));

// Names at each triangle
export const useTriangleNamesStore = create((set) => ({
  triangleNames: ["","Meagan","","","","Lola"],
  setTriangleNames: (newTriangleNames) => set({ triangleNames: newTriangleNames }),
}));

// Active Triangle Players
export const useActiveTrianglesStore = create((set) => ({
  activeTriangles: [],
  setActiveTriangles: (newActiveTriangles) => set({ activeTriangles: newActiveTriangles }),
}));

// Selectable Triangles 
export const useSelectableTrianglesStore = create((set) => ({
  selectableTriangles: [],
  setSelectableTriangles: (newSelectableTriangles) => set({ selectableTriangles: newSelectableTriangles }),
}));


// Current Action Picked
export const useActionStore = create((set) => ({
  action: "None",
  setAction: (newAction) => set({ action: newAction }),
}));

// Current Action Set in Place
export const useActionSelectedStore = create((set) => ({
  actionSelected: false,
  setActionSelected: (newActionSelected) => set({ actionSelected: newActionSelected }),
}));

// Deal for all players
export const useDealStore = create((set) => ({
  deal: [],
  setDeal: (newDeal) => set({ deal: newDeal }),
}));

// Deal for all players
export const useFlippedStore = create((set) => ({
  flipped: [],
  setFlipped: (newFlipped) => set({ flipped: newFlipped }),
}));

// Coins for all players 
export const usePlayerCoinsStore = create((set) => ({
  playerCoins: [],
  setPlayerCoins: (newPlayerCoins) => set({ playerCoins: newPlayerCoins }),
}));

// Remaining Deck
export const useDeckStore = create((set) => ({
  deck: [],
  setDeck: (newDeck) => set({ deck: newDeck }),
}));

// Keep track of turns 
export const usePlayerTurnStore = create((set) => ({
  playerTurn: 3,
  setPlayerTurn: (newPlayerTurn) => set({ playerTurn: newPlayerTurn }),
}));

// Keep track of possible actions for each player
export const useActionsAvailableStore = create((set) => ({
  actionsAvailable: [],
  setActionsAvailable: (newActionsAvailable) => set({ actionsAvailable: newActionsAvailable }),
}));

// Game Started ? 
export const useGameStartedStore = create((set) => ({
  gameStarted: false,
  setGameStarted: (newGameStarted) => set({ gameStarted: newGameStarted }),
}));

// Highlighted Triangles
export const useTriangleStore = create((set) => ({
  triangle: 3,
  setTriangle: (newTriangle) => set({ triangle: newTriangle }),
}));

// Chosen Triangle
export const useChosenTriangleStore = create((set) => ({
  chosenTriangle: null,
  setChosenTriangle: (newChosenTriangle) => set({ chosenTriangle: newChosenTriangle }),
}));

// Instructions
export const useScreenTextStore = create((set) => ({
  screenText: "These are your cards",
  setScreenText: (newScreenText) => set({ screenText: newScreenText})
}));

// Challenges
export const useChallengeStore = create((set) => ({
  challenge: false,
  setChallenge: (newChallenge) => set({ challenge: newChallenge})
}));

// Blocks
export const useBlockStore = create((set) => ({
  block: false,
  setBlock: (newBlock) => set({ block: newBlock})
}));