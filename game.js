const { Client, Account, Databases, ID, Query } = Appwrite;
const projectId = '65041f48f3669d07e15e';
const databaseId = '650935a1ce697466675c';
const collectionId = '650935b9502e2c261255';
const modalElement = document.getElementById('modal');
const logoutButton = document.getElementById('logout-button');
const highScoreTag = document.getElementById('highscore-tag');
const highScoreElement = document.getElementById('highscore');
const usernameElement = document.getElementById('username');
const canvas = document.querySelector('canvas');

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(projectId);

const account = new Account(client);
const database = new Databases(client);

async function isLoggedIn() {
  return account
    .get()
    .then((response) => {
      if (response) {
        return true;
      }
      return false;
    })
    .catch((error) => console.error(error));
}

function register(event) {
  account
    .create(
      ID.unique(),
      event.target.elements['register-email'].value,
      event.target.elements['register-password'].value,
      event.target.elements['register-username'].value
    )
    .then((response) => {
      console.log(response);
      database.createDocument(databaseId, collectionId, response.$id, {
        userId: response.$id,
        highscore: 0,
      });

      account
        .createEmailSession(
          event.target.elements['register-email'].value,
          event.target.elements['register-password'].value
        )
        .then(() => {
          showDisplay();
        });
    })
    .catch((error) => console.error(error));
  event.preventDefault();
}

function login(event) {
  account
    .createEmailSession(
      event.target.elements['login-email'].value,
      event.target.elements['login-password'].value
    )
    .then(() => {
      showDisplay();
      client.subscribe('account'),
        (response) => {
          console.log(response);
        };
    })
    .catch((error) => console.error(error));
  event.preventDefault();
}

function logout() {
  account
    .deleteSessions()
    .then(() => {
      alert('Logged out');
      console.log('Current Session deleted');
      showDisplay();
      highScoreElement.textContent = '';
    })
    .catch((error) => console.error(error));
}

function showDisplay() {
  modalElement.classList.add('hidden');
  isLoggedIn()
    .then((isLogin) => {
      if (isLogin) {
        modalElement.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        highScoreTag.classList.remove('hidden');
        startGame();
      } else {
        modalElement.classList.remove('hidden');
        logoutButton.classList.add('hidden');
        highScoreTag.classList.add('hidden');
        usernameElement.textContent = '';
        if (canvas) canvas.remove();
      }
    })
    .catch((error) => console.error(error));
}

showDisplay();

//Kaboom game
function startGame() {
  kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    clearColor: [0, 0, 0, 1],
  });

  // Speed identifiers
  const moveSpeed = 120;
  const jumpForce = 360;
  const bigJumpForce = 550;
  let currentJumpForce = jumpForce;
  const fallDeath = 400;
  const enemySpeed = 20;

  // Game logic
  let isJumping = true;

  loadRoot('https://i.imgur.com/');
  loadSprite('coin', 'wbKxhcd.png');
  loadSprite('evil-shroom', 'KPO3fR9.png');
  loadSprite('brick', 'pogC9x5.png');
  loadSprite('block', 'M6rwarW.png');
  loadSprite('mario', 'Wb1qfhK.png');
  loadSprite('mushroom', '0wMd92p.png');
  loadSprite('surprise', 'gesQ1KP.png');
  loadSprite('unboxed', 'bdrLpi6.png');
  loadSprite('pipe-top-left', 'ReTPiWY.png');
  loadSprite('pipe-top-right', 'hj2GK4n.png');
  loadSprite('pipe-bottom-left', 'c1cYSbt.png');
  loadSprite('pipe-bottom-right', 'nqQ79eI.png');
  loadSprite('blue-block', 'fVscIbn.png');
  loadSprite('blue-brick', '3e5YRQd.png');
  loadSprite('blue-steel', 'gqVoI2b.png');
  loadSprite('blue-evil-mushroom', 'SvV4ueD.png');
  loadSprite('blue-surprise', 'RMqCc1G.png');

  //Game scene
  scene('game', ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const maps = [
      [
        '                                      ',
        '                                      ',
        '                                      ',
        '                                      ',
        '                                      ',
        '       %   =*=%=                      ',
        '                                      ',
        '                            -+        ',
        '                  ^    ^    ()        ',
        '==============================   =====',
      ],
      [
        '£                                          £',
        '£                                          £',
        '£                                          £',
        '£                                          £',
        '£                                x         £',
        '£        @@@*@@                 xx         £',
        '£                              xxx         £',
        '£                             xxxx   x   -+£',
        '£                 z    z  z  xxxxx   x   ()£',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      ],
      [
        '=                                                                               =',
        '=                                                                               =',
        '=                                                                               =',
        '=                                                                               =',
        '=                                                                               =',
        '=      %%=*=@                  xx                                               =',
        '=                             xxx               @=@=          x   %%            =',
        '=                            xxxx   x                        x x       -+       =',
        '=                ^    z  ^  xxxxx   x               ^    ^ x x x       ^()      =',
        '=========================================================================     ===',
      ],
    ];

    const levelCfg = {
      width: 20,
      height: 20,
      '=': [sprite('block'), solid()],
      $: [sprite('coin'), 'coin'],
      '%': [sprite('surprise'), solid(), 'coin-surprise'],
      '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
      '}': [sprite('unboxed'), solid()],
      '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
      ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
      '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
      '+': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
      '^': [sprite('evil-shroom'), solid(), 'dangerous'],
      '#': [sprite('mushroom'), solid(), 'mushroom', body()],
      '!': [sprite('blue-block'), solid(), scale(0.5)],
      '£': [sprite('blue-brick'), solid(), scale(0.5)],
      z: [sprite('blue-evil-mushroom'), solid(), scale(0.5), 'dangerous'],
      '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
      x: [sprite('blue-steel'), solid(), scale(0.5)],
    };

    const gameLevel = addLevel(maps[level], levelCfg);

    const scoreLabel = add([
      text(`Your score: ${score}`),
      pos(30, 25),
      layer('ui'),
      {
        value: score,
      },
    ]);

    add([text(' Level ' + parseInt(level + 1)), pos(22, 6)]);

    // Mario and his moves
    const player = add([
      sprite('mario', solid()),
      pos(30, 0),
      body(),
      big(),
      origin('bot'),
    ]);

    function big() {
      let timer = 0;
      let isBig = false;
      return {
        update() {
          if (isBig) {
            currentJumpForce = bigJumpForce;
            timer -= dt();
            if (timer <= 0) {
              this.smallify();
            }
          }
        },
        isBig() {
          return isBig;
        },
        smallify() {
          this.scale = vec2(1);
          currentJumpForce = jumpForce;
          timer = 0;
          isBig = false;
        },
        biggify(time) {
          this.scale = vec2(2);
          timer = time;
          isBig = true;
        },
      };
    }

    player.on('headbump', (obj) => {
      if (obj.is('coin-surprise')) {
        gameLevel.spawn('$', obj.gridPos.sub(0, 1));
        destroy(obj);
        gameLevel.spawn('}', obj.gridPos.add(0, 0));
      }
      if (obj.is('mushroom-surprise')) {
        gameLevel.spawn('#', obj.gridPos.sub(0, 1));
        destroy(obj);
        gameLevel.spawn('}', obj.gridPos.add(0, 0));
      }
    });

    action('mushroom', (m) => {
      m.move(20, 0);
    });

    player.collides('mushroom', (m) => {
      destroy(m);
      player.biggify(8);
    });

    player.collides('coin', (c) => {
      destroy(c);
      scoreLabel.value++;
      scoreLabel.text = `Your score: ${scoreLabel.value}`;
    });

    action('dangerous', (d) => {
      d.move(-enemySpeed, 0);
    });

    player.collides('dangerous', (d) => {
      if (isJumping) {
        destroy(d);
      } else {
        go('lose', { score: scoreLabel.value });
      }
    });

    player.action(() => {
      camPos(player.pos);
      if (player.pos.y >= fallDeath) {
        go('lose', { score: scoreLabel.value });
      }
    });

    player.collides('pipe', () => {
      keyPress('down', () => {
        if (level == 2) {
          go('win', { score: scoreLabel.value });
        } else {
          go('game', {
            level: (level + 1) % maps.length,
            score: scoreLabel.value,
          });
        }
      });
    });

    keyDown('left', () => {
      player.move(-moveSpeed, 0);
    });

    keyDown('right', () => {
      player.move(moveSpeed, 0);
    });

    player.action(() => {
      if (player.grounded()) {
        isJumping = false;
      }
    });

    keyPress('space', () => {
      if (player.grounded()) {
        isJumping = true;
        player.jump(currentJumpForce);
      }
    });

    scene('lose', ({ score }) => {
      add([
        text(`Game Over! Score: ${score}`, 32),
        origin('center'),
        pos(width() / 2, height() / 2),
      ]);
    });

    scene('win', ({ score }) => {
      add([
        text(`You won! Score: ${score}`, 32),
        origin('center'),
        pos(width() / 2, height() / 2),
      ]);
    });
  });

  start('game', { level: 0, score: 0 });
}

//startGame();
