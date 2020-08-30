# webventure
Webventure is a tool for making classic 2d point and click adventure games as [Vue.js](https://vuejs.org/) single-page webapps. 

You don't need to know any Vue (or that much javascript!) to make your own game - just provide the assets and write the data describing your game in an easy to follow (I hope!) pattern and webventure can do the rest. It's built on vue-cli, so compiling for development an production are easy.

Vue developers also have the option to enhance thier games by creating Vue component minigames that can be incorporated into the gameplay.

For an example of a webventure game, try https://webventure.z33.web.core.windows.net.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


## Games
Running webventure with the default configuration will launch the 'test game' included as part of the repository. It can be configured to run other games.
You can create your own games in the /games directory, which is git ignored by the webventure repo. Your game folder can be its own version controlled repo, allowing you to create and build games without needing to edit or fork webventure itself.

### Example - creating a new game folder:
1. copy make a copy of /games/test-game folder and rename the copy "game-copy"
2. open /games/game-copy/sequences.js
3. change the line:
    "new StandardOrder ('pc::Hello World, my name is {{pc.name}}.'),"
to
    "new StandardOrder ('pc::Hello everyone, my name is {{pc.name}}.'),"
4. If you feel so inclined, open /games/game-copy/custom.scss and change some color values.
5. Create a file call ".env.local" in the webventure project root.
6. Open .env.local, add the following line and save the file:
    VUE_APP_GAME_NAME=game-copy
7. In a terminal, run the command 'npm run serve' (from webventure's root) to start the development version of the modified game.
8. The terminal wil output the urls the app is running at - open either url in your browser and your modified version of the test game will be running.
The game-copy folder could then be initialised as its own git repository.

### Example - cloning an existing game from github
1. Run the following terminal command(from webventure's root):
    git clone https://github.com/dblatcher/webventure-steamed-hams.git ./games/steamed-hams
2. Create a file call ".env.local" in the webventure project root (if not already done so).
3. Edit .env.local so the first line is:
    VUE_APP_GAME_NAME=steamed-hams
4. run the terminal command 'npm run serve'
5. Open the url the App is running at in your browser.


## App Configuration
Create a ".env.local" file in the proect root (These are git ignored by default) and use it to set the app's environment variables:
* VUE_APP_GAME_NAME (string): Used in the path to the folder for the game you want to run(see 'Games' above). E.G. Setting to 'my-game' will make the relative path to the folder "/games/my-game".
* VUE_APP_DEBUG_ONSCREEN ('off'/'on'): Debug messages about in-game "orders" are printed to the screen to help debugging the script for your game. (Turn 'off' for production).
* VUE_APP_DEBUG_LOGGING ('off'/'on'): Debug messages about in-game "orders" are logged in the browser console.


## Game Building
### The gameIndex file
Webventure's aim is for games to have games acting as interchangable modules, while allowing the game designers as much freedom as possible to tell thier stories. 

A game's gameIndex.js consolidates everything about that game and exports them as a a collection of [named exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export). When Webventure builds, its /src/main.js (the entry point for the app) imports from the gameIndex.js file in the folder for the game choosen with the VUE_APP_GAME_NAME configuration option.

The supported exports for a gameIndex file are:
* gameData (required) - contains the objects, functions and data that define the game (see 'What's in a game?' below) 
* TitleScreen (optional) - A Vue component for a custom title screen - if present, this will be used by the App instead of the DefaultTitleScreen 
* EndingScreen (optional) - A Vue component for a custom ending screen - if present, this will be used by the App instead of the DefaultEndingScreen
* minigames (optional) - An object containing any Vue components that will be used as minigames.

In addition, the gameIndex can be used to import any custom stylesheets to change the look of the App and its interfaces. For example, the tasteful colour scheme and font combination for test-game is defined in /games/test-game/custom.scss. .css and [.scss](https://sass-lang.com/documentation/syntax) are supported.

### What's in a game?
In a point-and-click adventure game, the user uses the interface to issue commands to the character they control. Usually, the user has to solve puzzles and/or progress the story by figuring out the right commands.

The world of a webventure game contains the following 'concrete' objects:
* Rooms - places the Characters can go to.
* WorldItems - objects in rooms that can be interacted with.
* Characters - objects (usually people, animals, robots, ghosts and the like) that can move between rooms and be interacted with, one of which is the 'player character'(pc) that the user controls.
* InventoryItems - objects carried by the player character that can be used in interractions.

In addition, there are 'abstract' objects that determine how the 'concrete' objects behave:
* Verbs - representing categories of actions that the user can make the pc do. In a game, the user selects a Verb then a WorldItem, Character or InventoryItem (or two if the Verb needs two) to form a 'Command'.
* Interactions - describing what happens if the player uses a particular Command. An Interaction has three arguments:
    1. An array describing the Command it applies to
    2. An array of Conditions that must be true for the interaction to happen
    3. The Sequence that will be played if the user issues the Command and all the Conditions are true.
* Conversations
* Sequences - Arrays of Orders (see below) that are performed during the game - usually in response to an Interaction.
* Sprites - Objects representing the image files used to display WorldItems and Characters.
* Sounds - Objects representing the audio files used for sound effects and background music.

### All in Order
TO DO - desription of Orders