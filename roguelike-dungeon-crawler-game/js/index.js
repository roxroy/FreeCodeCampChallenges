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

var ActorInfo = {
  player: { id: 1, name: 'player', icon: 'user', max: 1 },
  boss: { id: 2, name: 'boss', icon: 'frown-o', max: 1 },
  enemy: { id: 3, name: 'enemy', icon: 'truck', max: 10 },
  weapon: { id: 4, name: 'weapon', icon: 'scissors', max: 4 },
  health: { id: 5, name: 'health', icon: 'heart ', max: 4 },
  earth: { id: 10, name: 'earth', icon: 'square' },
  wall: { id: 11, name: 'wall', icon: 'th' },
  floor: { id: 12, name: 'wall', icon: 'circle-o' }
};

var ActorInfoMap = [];
Object.keys(ActorInfo).map(function (e) {
  //console.log(`key=${e}  value=${BuildInfo[e]}`);
  ActorInfoMap[ActorInfo[e].id] = ActorInfo[e];
  //console.log(ActorInfoMap);
});

var gameInfo = {
  Attack: 0,
  Level: 0,
  NextXP: 0,
  Boss: 0,
  Enemy: 0,
  Weapon: 0,
  Health: 5
};

var actorManager = function () {
  function actorManager(props) {
    _classCallCheck(this, actorManager);
  }

  actorManager.prototype.create = function create(board) {
    for (var y = 0; y < this.boardSize.height * this.boardSize.width; y++) {
      if (Math.random() > 0.5) {
        // board[Math.floor(Math.random() * this.boardSize.height)][Math.floor(Math.random() * this.boardSize.width)] =  BuildInfo.wall.id;
      }
    }
    return board;
  };

  return actorManager;
}();

var mapManager = function () {
  function mapManager(props) {
    _classCallCheck(this, mapManager);

    this.boardSize = {};
    this.mapSize = {};
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

  mapManager.prototype.create = function create(board) {
    for (var y = 0; y < this.boardSize.height * this.boardSize.width; y++) {
      if (Math.random() > 0.90) {
        board[Math.floor(Math.random() * this.boardSize.height)][Math.floor(Math.random() * this.boardSize.width)] = ActorInfo.wall.id;
      }
    }
    return board;
  };

  mapManager.prototype.initialize = function initialize() {
    var board = [];
    for (var y = 0; y < this.boardSize.height; y++) {
      var newRow = [];
      for (var x = 0; x < this.boardSize.width; x++) {
        newRow.push(ActorInfo.earth.id);
      }
      board.push(newRow);
    }
    return board;
  };

  return mapManager;
}();

var GameBoard = function GameBoard(props) {

  if (props.fullGameMap.length == 0) return React.createElement(
    'div',
    null,
    ' '
  );

  var board = [],
      style = ' fa fa-lock';

  for (var y = 0; y < 12; y++) {
    var boardColumns = [];
    for (var x = 0; x < 20; x++) {
      //style = props.gameMap[y][x] == BuildInfo.earth.id ? 'align-justify' : '';
      //if (props.gameMap[y][x] == BuildInfo.earth.id) {                                                     }
      style = ActorInfoMap[props.fullGameMap[y][x]].icon;
      //console.log( BuildInfoMap[props.gameMap[y][x]].icon );

      boardColumns.push(React.createElement('span', { key: x + '' + y, className: "cell fa fa-" + style, 'data-xy': x + ' ' + y }));
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
      fullGameMap: []
    };
    return _this;
  }

  DungeonCrawlerApp.prototype.readyGameBoard = function readyGameBoard() {
    var board = this.mapManager.initialize();
    board = this.mapManager.create(board);

    this.setState({
      fullGameMap: board
    });
  };

  DungeonCrawlerApp.prototype.componentDidMount = function componentDidMount() {
    this.readyGameBoard();
  };

  DungeonCrawlerApp.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'div',
        null,
        'Dashboard'
      ),
      React.createElement(
        'div',
        null,
        'Map'
      ),
      React.createElement(GameBoard, { fullGameMap: this.state.fullGameMap })
    );
  };

  return DungeonCrawlerApp;
}(React.Component);

ReactDOM.render(React.createElement(DungeonCrawlerApp, { mapWidth: '200', mapHeight: '300' }), document.getElementById("app-root"));

//http://www.evilscience.co.uk/creating-a-roguelike-game-view/