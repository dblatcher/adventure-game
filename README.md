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
4. Create a file call ".env.local" in the webventure project root.
5. Open .env.local, add the following line and save the file:
    VUE_APP_GAME_NAME=game-copy
6. In a terminal, run the command 'npm run serve' (from webventure's root) to start the development version of the modified game.
7. The terminal wil output the urls the app is running at - open either url in your browser and your modified version of the test game will be running.
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
1. VUE_APP_GAME_NAME (string): Used in the path to the folder for the game you want to run(see 'Games' above). E.G. Setting to 'my-game' will make the relative path to the folder "/games/my-game".
1. VUE_APP_DEBUG_ONSCREEN ('off'/'on'): Debug messages about in-game "orders" are printed to the screen to help debugging the script for your game. (Turn 'off' for production).
1. VUE_APP_DEBUG_LOGGING ('off'/'on'): Debug messages about in-game "orders" are logged in the browser console.