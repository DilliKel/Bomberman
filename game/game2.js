// Modo em Dupla
kaboom({
  global: true,
  fullscreen: true,
  scale: 1.7,
  debug: true,
  clearColor: [0,0,0,1]
})
const MOVE_SPEED = 120;
const ENEMY_SPEED = 60;

loadRoot('./game/img/');

loadSprite('wall-steel', './wall-steel.png');
loadSprite('brick-red', './brick-red.png');   
loadSprite('door', './door.png');             
loadSprite('kaboom', './kaboom.png');        
loadSprite('bg', './bg.png');                 
loadSprite('wall-gold', './wall-gold.png');  
loadSprite('brick-wood', './brick-wood.png'); 

loadSprite('bomberman', './bomberman.png', {
  sliceX: 7,
  sliceY: 4,
  anims: {
    //Parado Player1
    idleLeft: { from: 21, to: 21 },
    idleRight: { from: 7, to: 7 },
    idleUp: { from: 0, to: 0 },
    idleDown: { from: 14, to: 14 },

    //Em movimento Player1
    moveLeft: { from: 22 , to: 27  },
    moveRigth: { from: 8, to: 13 },
    moveUp: { from: 1, to: 6 },
    moveDown: { from: 15, to: 20 },    
  }
});

loadSprite('bomberman2', './bomberman2.png', {
  sliceX: 7,
  sliceY: 4,
  anims: {
    //Parado Player2
    idleLeft: { from: 21, to: 21 },
    idleRight: { from: 7, to: 7 },
    idleUp: { from: 0, to: 0 },
    idleDown: { from: 14, to: 14 },

    //Em movimento Player2
    moveLeft: { from: 22 , to: 27  },
    moveRigth: { from: 8, to: 13 },
    moveUp: { from: 1, to: 6 },
    moveDown: { from: 15, to: 20 },    
  }
});

loadSprite('boomber', './boomber.png', { 
  sliceX: 3,

  anims: {
    move: { from: 0, to: 2 },
  }
})

loadSprite('baloon', 'baloon.png', { sliceX: 3 })
loadSprite('ghost', 'ghost.png', { sliceX: 3 })
loadSprite('slime', 'slime.png', { sliceX: 3 })

loadSprite('explosion', 'explosion.png', { 
  sliceX: 5,
  sliceY: 5,
})
// Uma "redundância" aqui, pois temos duas sprites de explosão, me perdi no meio do código e fiquei usando as duas. Vulgo Gambiarra.
loadSprite('kaboom', 'kaboom.png', { 
  sliceX: 5,
  sliceY: 5,
})

scene('game', ({level, score}) => {
  layers(['bg', 'obj', 'ui'], 'obj');  //As camadas são definidas aqui

  const maps = [
    [
      'aaaaaaaaaaaaaaa',
      'azzzz  *zz    a',
      'azazazazazazaza',
      'azzzzzzzzzzzzza',
      'azazazazazaza a',
      'azzzz* zzzzzz}a',
      'azazazazazaza a',
      'a zzzzzzzzzzz a',
      'a azazazazazaza',
      'a  zzzdzzzzzzza',
      'a azazazazazaza',
      'azzzzzzzzzzzzza',
      'azazazazazazaza',
      'azzzzz   &   za',
      'aaaaaaaaaaaaaaa',
    ],
    [
      'bbbbbbbbbbbbbbb',
      'bwwww  *ww    b',
      'bwbwbwbwbwbwbwb',
      'b      *      b',
      'bwbwbwbwbwbwb b',
      'bwwww* wwwwwwwb',
      'bwbwbwbwb bwb b',
      'b wwwpwww}www b',
      'b bwbwbwb bwbwb',
      'b  wwwwwwwwwwwb',
      'b bwbwbwbwbwbwb',
      'bwww  &   wwwwb',
      'bwbwbwbwbwbwbwb',
      'bwwwww   &   wb',
      'bbbbbbbbbbbbbbb',
    ]
  ]

  const levelCfg = {
    width: 26,
    height: 26,
    a: [sprite('wall-steel'), 'wall-steel', solid(), 'wall'],
    z: [sprite('brick-red'), 'wall-brick', solid(), 'wall'],
    d: [sprite('brick-red'), 'wall-brick-dool', solid(), 'wall'],
    b: [sprite('wall-gold'), 'wall-gold', solid(), 'wall'],
    w: [sprite('brick-wood'), 'wall-brick', solid(), 'wall'],
    p: [sprite('brick-wood'), 'wall-brick-dool', solid(), 'wall'],
    t: [sprite('door'), 'door', 'wall'],    
    '}': [sprite('ghost'), 'dangerous', 'ghost', { dir: -1, timer: 0 }],
    '&': [sprite('slime'), 'slime', { dir: -1 }, 'dangerous', { timer: 0 }],    
    '*': [sprite('baloon'), 'baloon', { dir: -1 }, 'dangerous', { timer: 0 }],
  }

  const gameLevel = addLevel(maps[level], levelCfg);

  add([sprite('bg'), layer('bg')])

  const scoreLabel = add([
    text('Score: ' + score),
    pos(400, 30),
    layer('ui'),
    {
      value: score,
    },
    scale(1)
  ])

  add([text('Level: ' + parseInt(level + 1)), pos(400, 60), scale(1)])

  const player = add([
    sprite('bomberman', {
      animeSpeed: 0.1,
      frame: 14,
    }),
    pos(20,190), // Modifique as coordenadas para a posição desejada para o jogador 1
    { dir: vec2(1,0) },
  ])

  const player2 = add([
    sprite('bomberman2', {
      animeSpeed: 0.1,
      frame: 14,
    }),
    pos(290, 10),  // Modifique as coordenadas para a posição desejada para o jogador 2
    { dir: vec2(1, 0) },
  ]);

  //------- Movimentação do Jogador 1 -------
  player.action(() => {
    player.pushOutAll()
  })

  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0);
    player.dir = vec2(-1, 0);
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0);
    player.dir = vec2(1, 0);
  })

  keyDown('up', () => {
    player.move(0, -MOVE_SPEED);
    player.dir = vec2(0, -1);
  })  

  keyDown('down', () => {
    player.move(0, MOVE_SPEED);
    player.dir = vec2(0, 1);
  })   

// INÍCIO Animação do jogador 1
  keyPress('left', () => {
    player.play('moveLeft')
  })

  keyPress('right', () => {
    player.play('moveRigth')
  })

  keyPress('up', () => {
    player.play('moveUp')
  })  

  keyPress('down', () => {
    player.play('moveDown')
  }) 
  
  keyRelease('left', () => {
    player.play('idleLeft')
  })

  keyRelease('right', () => {
    player.play('idleRight')
  })
  
  keyRelease('up', () => {
    player.play('idleUp')
  })

  keyRelease('down', () => {
    player.play('idleDown')
  })
// FIM Animação do jogador 1

  keyPress('space', () => {
    spawnBomber(player.pos.add(player.dir.scale(0))) // Spawn Bomba do jogador 1
  })

// --------- Fim Movimentação do Jogador 1 ---------

// --------- Movimentação do Jogador 2 --------- 
player2.action(() => {
  player2.pushOutAll();
});

keyDown('a', () => {
  player2.move(-MOVE_SPEED, 0);
  player2.dir = vec2(-1, 0);
});

keyDown('d', () => {
  player2.move(MOVE_SPEED, 0);
  player2.dir = vec2(1, 0);
});

keyDown('w', () => {
  player2.move(0, -MOVE_SPEED);
  player2.dir = vec2(0, -1);
});

keyDown('s', () => {
  player2.move(0, MOVE_SPEED);
  player2.dir = vec2(0, 1);
});

// INÍCIO Animação do jogador 2
keyPress('a', () => {
  player2.play('moveLeft')
})

keyPress('d', () => {
  player2.play('moveRigth')
})

keyPress('w', () => {
  player2.play('moveUp')
})  

keyPress('s', () => {
  player2.play('moveDown')
}) 

keyRelease('a', () => {
  player2.play('idleLeft')
})

keyRelease('d', () => {
  player2.play('idleRight')
})

keyRelease('w', () => {
  player2.play('idleUp')
})

keyRelease('s', () => {
  player2.play('idleDown')
})
// FIM Animação do jogador 2

keyPress('enter', () => {
  spawnBomber(player2.pos.add(player2.dir.scale(0)), 'move'); // Spawn Bomba do jogador 2
});
//--------- FIM INFORMAÇÕES DO JOGADOR 2 ------------

//----------- UM TESTE QUE DEU CERTO AQUI

function spawnKaboom(p, frame) {
  // Verifica se a posição desejada está bloqueada por um bloco inquebrável
  if (gameLevel.get(p).is('wall-steel')) {
    return;
  }

  const obj = add([
    sprite('kaboom', {
      animeSpeed: 0.1,
      frame: frame,
    }),
    pos(p),
    scale(1.5),
    'kaboom',
  ]);

  obj.pushOutAll();
  wait(0.5, () => {
    destroy(obj);
  });
}

function spawnBomber(p, animation) {
  const obj = add([
    sprite('boomber', { anims: { move: { from: 0, to: 2 } } }),
    animation,
    pos(p),
    scale(1.5),
    'bomber',
  ]);
  
  // Adiciona uma propriedade 'isAlive' para verificar se o objeto ainda está ativo
  obj.isAlive = true;

  obj.action(() => {
    if (!obj.isAlive) return; // Verifica se o objeto ainda está ativo
    obj.pushOutAll();
  });

  obj.play(animation);

  wait(1, () => {
    if (!obj.isAlive) return; // Verifica se o objeto ainda está ativo
    obj.isAlive = false; // Define o objeto como não mais ativo
    destroy(obj);

    obj.dir = vec2(1, 0);
    spawnKaboom(obj.pos.add(obj.dir.scale(0)), 12); // do centro

    obj.dir = vec2(0, -1);
    spawnKaboom(obj.pos.add(obj.dir.scale(20)), 2); // cima

    obj.dir = vec2(0, 1);
    spawnKaboom(obj.pos.add(obj.dir.scale(20)), 22); // baixo

    obj.dir = vec2(-1, 0);
    spawnKaboom(obj.pos.add(obj.dir.scale(20)), 10); // esquerda

    obj.dir = vec2(1, 0);
    spawnKaboom(obj.pos.add(obj.dir.scale(20)), 14); // direita
  });
}

//Ações dos inimigos
  action('baloon', (s) => {
    s.pushOutAll();
    s.move(s.dir * ENEMY_SPEED, 0)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  })

  action('slime', (s) => {
    s.pushOutAll();
    s.move(s.dir * ENEMY_SPEED, 0)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  })  

  action('ghost', (s) => {
    s.pushOutAll();
    s.move(0 , s.dir * ENEMY_SPEED)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  }) 
  
//--------- Funções ---------
  function spawnKaboom(p, frame){ // Função pra soltar a bomba
    const obj = add([
      sprite('kaboom', {
        animeSpeed: 0.1,
        frame: frame,
      }),
      pos(p),
      scale(1.5),
      'kaboom'
    ])

    obj.pushOutAll();
    wait(0.5, () => {
      destroy(obj);
    })
  }

  function spawnBomber(p){
    const obj = add([sprite('boomber'), ('move'), pos(p), scale(1.5), 'bomber']);
    obj.pushOutAll();
    obj.play("move");

    wait(1, () => {  //Tempo de espera pra bomba bombar
      destroy(obj);

      obj.dir = vec2(1,0)
      spawnKaboom(obj.pos.add(obj.dir.scale(0)), 12) // do centro

      obj.dir = vec2(0, -1)
      spawnKaboom(obj.pos.add(obj.dir.scale(20)), 2) // cima

      
      obj.dir = vec2(0, 1)
      spawnKaboom(obj.pos.add(obj.dir.scale(20)), 22) // baixo

      
      obj.dir = vec2(-1, 0)
      spawnKaboom(obj.pos.add(obj.dir.scale(20)), 10) // esquerda

      obj.dir = vec2(1, 0)
      spawnKaboom(obj.pos.add(obj.dir.scale(20)), 14) // direita
    })
  }

//--------- Colisões ---------

// Verificar colisão entre o jogador e a explosão = (Morte Instantânea)
player.overlaps('kaboom', () => {
  go('lose', { score: scoreLabel.value });
}); // Explosão - Jogador 1

player2.overlaps('kaboom', () => {
  go('lose', { score: scoreLabel.value });
}); // Explosão - Jogador 2

  player.collides('door', (d) => {
    go("game", {
      level: (level + 1) % maps.length,
      score: scoreLabel.value
    })
  }) // Entrar na porta - Jogador 1

  player2.collides('door', () => {
    go("game", {
      level: (level + 1) % maps.length,
      score: scoreLabel.value,
    });
  }); // Entrar na porta - Jogador 2

  // Verificar colisão entre o jogador e a explosão = (Morte Instantânea)
collides('kaboom', 'dangerous', (k,s) => {
  camShake(4);
   wait(1, () => {
     destroy(k)
   })
   destroy(s);
   scoreLabel.value++
   scoreLabel.text = 'Score: ' + scoreLabel.value
})

// Colisão do Jogador 2 com os inimigos
player2.overlaps('dangerous', () => {
  go('lose', { score: scoreLabel.value });
});

  collides('kaboom', 'wall-brick', (k,s) => {
    camShake(4);
     wait(1, () => {
       destroy(k)
     })
     destroy(s);
  })

  collides('baloon', 'wall', (s) => {
    s.dir = -s.dir;
  })

  collides('slime', 'wall', (s) => {
    s.dir = -s.dir;
  })

  collides('ghost', 'wall', (s) => {
    s.dir = -s.dir;
  })

  collides('kaboom', 'wall-brick-dool', (k,s) => {
    camShake(4);
    wait(1, () => {
      destroy(k);
    })
    destroy(s);
    gameLevel.spawn('t', s.gridPos.sub(0,0))
  })
  
  player.collides('dangerous', () => {
    go('lose', {score: scoreLabel.value})
  })
})

scene('lose', ( { score } ) => {
  add([text('Score: '+ score, 32), origin('center'), pos(width() / 2, height() / 2)])

  keyPress('space', () => {
    go('game', { level: 0, score: 0 });
  })
})

go('game', { level: 0, score: 0 });
// FIM :)
