'use strict';

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
get board size

initializeMap
drawMap
createMap
scrollMap

createPlayers
   Player, Health, Boss, Weapon, Enemies
handleKeyPress

canMove(x,y, direction)
getRandomNumber
flashLightMode
*/

var TILE = {
  earth: '.',
  wall: 'w',
  floor: 'f',
  player: 'p',
  boss: 'b',
  enemy: 'e',
  weapon: 'a',
  health: 'h'
};
var TitleMap = null;

var ActorInfo = {
  player: {
    name: 'player',
    icon: 'user',
    max: 1
  },
  boss: {
    name: 'boss',
    icon: 'frown-o',
    max: 1
  },
  enemy: {
    name: 'enemy',
    icon: 'truck',
    max: 10
  },
  weapon: {
    name: 'weapon',
    icon: 'scissors',
    max: 4
  },
  health: {
    name: 'health',
    icon: 'heart ',
    max: 4
  },
  earth: {
    name: 'earth',
    icon: 'square'
  },
  wall: {
    name: 'wall',
    icon: 'th'
  },
  floor: {
    name: 'floor',
    icon: 'circle-o'
  }
};

var ActorStats = []; //   [position.x+''+position.y],  position, actorInfo, health

var Actor = function Actor(y, x, actorInfo, health) {
  _classCallCheck(this, Actor);

  this.x = x;
  this.y = y;
  this.actorInfo = actorInfo;
  this.health = health;
};

var gameInfo = {};

var Key = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

// Helper function
var switchKeys = function switchKeys(data) {
  return Object.keys(data).reduce(function (obj, key) {
    obj[data[key]] = key;
    return obj;
  }, {});
};
var randomRange = function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var scoringSystem = function scoringSystem(props) {
  _classCallCheck(this, scoringSystem);
};

var actorManager = function actorManager(props) {
  _classCallCheck(this, actorManager);
};

var mapManager = function () {
  function mapManager(props) {
    _classCallCheck(this, mapManager);

    this.boardSize = {};
    this.mapSize = {};
    TitleMap = switchKeys(TILE);
  }

  mapManager.prototype.setBoardSize = function setBoardSize(size) {
    this.boardSize = size;
  };

  mapManager.prototype.getBoardSize = function getBoardSize() {
    return this.boardSize;
  };

  mapManager.prototype.getMapSize = function getMapSize() {
    return this.mapSize;
  };

  mapManager.prototype.getFreeTile = function getFreeTile(board, tileType) {
    var pos = {};
    while (true) {
      var row = Math.floor(Math.random() * this.boardSize.height);
      var col = Math.floor(Math.random() * this.boardSize.width);
      if (board[row][col] == tileType) {
        return {
          row: row,
          col: col
        };
      };
    }
  };

  mapManager.prototype.createBoard = function createBoard(board) {

    // Wall borders
    /*
    for (let y = 0; y < this.boardSize.height; y++) {
      board[y][0] = TILE.wall;
      board[y][this.boardSize.width-1] = TILE.wall;
    }
    for (let x = 0; x < this.boardSize.width; x++) {
      board[0][x] = TILE.wall;
      board[this.boardSize.height-1][x] = TILE.wall;
    }
    
    
    for (let y = 0; y < this.boardSize.height * this.boardSize.width; y++) {
      if (Math.random() > 0.8) {
        let tileSpot = this.getFreeTile(board, TILE.earth);
        board[tileSpot.row][tileSpot.col] = TILE.wall;
      }
      if (Math.random() > 0.4) {
        let tileSpot = this.getFreeTile(board, TILE.earth);
        board[tileSpot.row][tileSpot.col] = TILE.floor;
      }
    }
    */

    var map = new ROT.Map.Rogue(this.boardSize.width, this.boardSize.height);
    var display = new ROT.Display({
      width: this.boardSize.width,
      height: this.boardSize.height,
      fontSize: 6
    });
    map.create(display.DEBUG);

    for (var y = 0; y < this.boardSize.height; y++) {
      for (var x = 0; x < this.boardSize.width; x++) {
        board[y][x] = map.map[x][y] ? TILE.wall : TILE.floor;
      }
    }return board;
  };

  mapManager.prototype.createActors = function createActors(board) {
    var characters = [{
      who: TILE.player,
      count: 1,
      max: 1
    }, {
      who: TILE.boss,
      count: 1,
      max: 1
    }, {
      who: TILE.enemy,
      count: 2,
      max: 10
    }, {
      who: TILE.weapon,
      count: 1,
      max: 3
    }, {
      who: TILE.health,
      count: 2,
      max: 5
    }];

    var that = this;
    ActorStats = [];
    characters.forEach(function (element) {
      var count = element.max - element.count + 1;
      //console.log(element.who);
      for (var i = 0; i < count; i++) {
        var tileSpot = that.getFreeTile(board, TILE.floor),
            health = 0,
            actorInfo = ActorInfo[TitleMap[element.who]];
        //console.log(actorInfo);
        ActorStats.push(new Actor(tileSpot.row, tileSpot.col, actorInfo, health));
        board[tileSpot.row][tileSpot.col] = element.who;
      }
    });

    return board;
  };

  mapManager.prototype.initialize = function initialize() {
    var board = [];
    for (var y = 0; y < this.boardSize.height; y++) {
      var newRow = [];
      for (var x = 0; x < this.boardSize.width; x++) {
        newRow.push(TILE.earth);
      }
      board.push(newRow);
    }
    return board;
  };

  mapManager.prototype.makeMove = function makeMove(board, playerActor, next) {
    var validMove = false,
        bossKilled = false;
    switch (board[next.y][next.x]) {
      case TILE.floor:
        validMove = true;
        break;
      case TILE.weapon:
        validMove = true;
        gameInfo.Points++;
        break;
      case TILE.health:
        validMove = true;
        gameInfo.Points++;
        gameInfo.Health += 5;
        break;
      case TILE.enemy:
        gameInfo.Health--;
        if (Math.random() > 0.6) {
          validMove = true;
        }
        break;
      case TILE.boss:
        gameInfo.Health -= 2;
        if (Math.random() > 0.8) {
          validMove = true;
          bossKilled = true;
        }
        break;
    }

    if (validMove) {
      board[playerActor.y][playerActor.x] = TILE.floor;
      playerActor.y = next.y;
      playerActor.x = next.x;
      board[next.y][next.x] = TILE.player;
    }
    playerKilled;

    return {
      board: board,
      bossKilled: bossKilled
    };
  };

  return mapManager;
}();

function ScoreBoard(props) {
  //console.log(props);
  return React.createElement(
    'div',
    { className: 'text-center' },
    React.createElement(
      'div',
      { id: 'score-board' },
      React.createElement(
        'h1',
        null,
        'Dungeon Crawler'
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          null,
          'Health'
        ),
        React.createElement(
          'span',
          null,
          'Points'
        ),
        React.createElement(
          'span',
          null,
          'Level'
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          null,
          props.gameInfo.Health
        ),
        React.createElement(
          'span',
          null,
          props.gameInfo.Points
        ),
        React.createElement(
          'span',
          null,
          props.gameInfo.Level
        )
      ),
      React.createElement(
        'button',
        { className: 'btn', onClick: props.handleFlashlightEvent },
        'FlashLight'
      ),
      React.createElement(
        'button',
        { className: 'btn', onClick: props.handleRestartEvent },
        'Restart'
      )
    )
  );
}

var GameBoard = function GameBoard(props) {

  if (props.fullGameMap.length == 0) return React.createElement(
    'div',
    null,
    ' '
  );

  var board = [],
      viewport = {
    rows: 20,
    cols: 39
  },
      style = ' fa fa-lock';

  var pointInCircle = function pointInCircle(x, y, cx, cy, radius) {
    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= radius * radius;
  };

  for (var y = 0; y < viewport.rows; y++) {
    var boardColumns = [];
    for (var x = 0; x < viewport.cols; x++) {
      style = ActorInfo[TitleMap[props.fullGameMap[y][x]]].icon;
      if (props.flashlight & !pointInCircle(x, y, ActorStats[0].x, ActorStats[0].y, 3)) {
        style += " flashlight";
      }
      boardColumns.push(React.createElement('span', { key: x + '' + y, className: "cell fa fa-2x fa-" + style, 'data-xy': x + ' ' + y }));
    }
    board.push(React.createElement(
      'div',
      { key: '' + y, className: 'row' },
      ' ',
      boardColumns,
      ' '
    ));
  }

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'board' },
      ' ',
      board
    )
  );
};

var DungeonCrawlerApp = function (_React$Component) {
  _inherits(DungeonCrawlerApp, _React$Component);

  function DungeonCrawlerApp(props) {
    _classCallCheck(this, DungeonCrawlerApp);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.mapManager = new mapManager();

    _this.boardSize = {
      height: props.mapHeight,
      width: props.mapWidth
    };
    _this.mapManager.setBoardSize(_this.boardSize);
    _this.mapSize = _this.mapManager.getMapSize();

    _this.state = {
      fullGameMap: [],
      gameInfo: gameInfo
    };

    _this.handleKeyboardEvent = _this.handleKeyboardEvent.bind(_this);
    _this.handleFlashlightEvent = _this.handleFlashlightEvent.bind(_this);
    _this.handleRestartEvent = _this.handleRestartEvent.bind(_this);
    return _this;
  }

  DungeonCrawlerApp.prototype.generateGameBoard = function generateGameBoard() {
    var board = this.mapManager.initialize();
    board = this.mapManager.createBoard(board);
    board = this.mapManager.createActors(board);
    return board;
  };

  DungeonCrawlerApp.prototype.readyGameBoard = function readyGameBoard() {
    var board = this.generateGameBoard();

    this.setState({
      fullGameMap: board
    });
  };

  DungeonCrawlerApp.prototype.startGameBoard = function startGameBoard() {
    gameInfo = {
      Health: 10,
      Points: 0,
      Level: 1,
      NextXP: 0,
      Boss: 0,
      Enemy: 0,
      Weapon: 0,
      flashlight: true
    };

    this.readyGameBoard();

    this.setState({
      gameInfo: gameInfo
    });
  };

  DungeonCrawlerApp.prototype.componentDidMount = function componentDidMount() {
    this.startGameBoard();
    document.addEventListener('keydown', this.handleKeyboardEvent);
  };

  DungeonCrawlerApp.prototype.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyboardEvent);
  };

  DungeonCrawlerApp.prototype.handleRestartEvent = function handleRestartEvent() {
    this.startGameBoard();
  };

  DungeonCrawlerApp.prototype.handleFlashlightEvent = function handleFlashlightEvent() {
    gameInfo.flashlight = !gameInfo.flashlight;

    this.setState({
      gameInfo: gameInfo
    });
  };

  DungeonCrawlerApp.prototype.handleKeyboardEvent = function handleKeyboardEvent(evt) {
    var x = 0,
        y = 0,
        keycode = evt.keyCode;
    switch (keycode) {
      case Key.LEFT:
        x--;
        break;
      case Key.UP:
        y--;
        break;
      case Key.RIGHT:
        x++;
        break;
      case Key.DOWN:
        y++;
        break;
    }

    var playerActor = ActorStats[0];

    //console.log(playerActor);
    var board = this.state.fullGameMap;
    var xPosition = playerActor.x + x;
    var yPosition = playerActor.y + y;

    var moveState = this.mapManager.makeMove(board, playerActor, {
      x: xPosition,
      y: yPosition
    });

    if (moveState.playerKilled) {
      gameInfo.Health = 10;
    }

    if (moveState.bossKilled) {
      gameInfo.Level++;
      moveState.board = this.generateGameBoard();
    }

    this.setState({
      fullGameMap: moveState.board,
      gameInfo: gameInfo
    });
  };

  DungeonCrawlerApp.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'div',
        null,
        React.createElement(ScoreBoard, { gameInfo: this.state.gameInfo,
          handleFlashlightEvent: this.handleFlashlightEvent,
          handleRestartEvent: this.handleRestartEvent }),
        React.createElement(GameBoard, { fullGameMap: this.state.fullGameMap,
          flashlight: this.state.gameInfo.flashlight })
      )
    );
  };

  return DungeonCrawlerApp;
}(React.Component);

ReactDOM.render(React.createElement(DungeonCrawlerApp, { mapWidth: '39', mapHeight: '20' }), document.getElementById("app-root"));

//http://www.evilscience.co.uk/creating-a-roguelike-game-view/