# games folder
Any game repos go in this folder. Its contents (aside from this note file and the test-game folder) are git ignored by the adventure-game repo.

## setting which game to serve or build
By default, the test-game will be used since the .env file sets VUE_APP_GAME_NAME=test-game. ./src/main.js uses this value to require ./games/test-game/gameIndex.js (which exports all the data which makes up the test-game).
To change this:
1. create a .env.local file in the root of adventure-game folder (these files are git ignored by default)
2. add a value for VUE_APP_GAME_NAME in .env.local which is the same as the folder name of your target game. E.g. if your game was in "adventure-game/games/my-awesome-game", add the line VUE_APP_GAME_NAME=my-awesome-game
3. run the npm run build or npm run serve command

## how to write your own games
[big TO DO for this...]