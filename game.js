// postavljanje platna
kaboom({
  width: 900,
  height: 600,
  font: "sinko",
  canvas: document.querySelector("#mycanvas")
})

// učitavanje sličica
loadSprite("flappy", "sprites/flappy.png")
loadSprite("background", "sprites/background.png")
loadSprite("pipe", "sprites/pipe.png")

// učitavanje zvukova
loadSound("wooosh", "sounds/wooosh.mp3")
loadSound("score", "sounds/score.mp3")
loadSound("hit", "sounds/hit.mp3")


scene("game", () => {

  add([
    sprite("background", {
      width: width(),
      height: height()
    })
  ])

  score = 0
  scoreText = add([
    pos(10, 10),
    text(score, { size: 70 })
  ])

  // dodavanje ptičice u okviru platna
  bird = add([
    sprite("flappy"),
    scale(2),
    pos(80, 40),
    area(),
    body()
  ])

  // funkcija koja iscrtava cevi (gore i dole) na svakih 1.5 sekundu
  function producePipes() {
    PIPE_GAP = 150
    offset = rand(-50, 50)

    add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + PIPE_GAP / 2),
      //origin("topleft"),
      "pipe",
      area(),
      { passed: false }
    ])

    add([
      sprite("pipe", { flipY: true }),
      pos(width(), height() / 2 + offset - PIPE_GAP / 2),
      origin("botleft"),
      "pipe",
      area()
    ])
  }

  loop(1.5, () => {
    producePipes()
  })

  onUpdate("pipe", (pipe) => {
    pipe.move(-160, 0)

    if (pipe.passed == false && pipe.pos.x < bird.pos.x) {
      play("score")
      pipe.passed = true
      score += 1
      scoreText.text = score
    }
  })

  // ukoliko igrač udari u cev, igra se završava
  bird.collides("pipe", () => {
    play("hit")
    go("gameover", score)
  })

  // ukoliko igrač pređe malo preko vrha platna ili malo pri dnu platna, igra se završava
  bird.onUpdate(() => {
    if (bird.pos.y > height() + 30 || bird.pos.y < -30) {
      play("hit")
      go("gameover", score)
    }
  })

  // klikom na space taster naša ptičica skače za 400 (jačina skoka) uz prepoznatljiv zvuk zamaha
  onKeyPress("space", () => {
    play("wooosh")
    bird.jump(400)
  })
})

// praćenje najboljeg rezultata
highScore = 0

// scena za kraj igre prikazuje trenutni rezultat, kao i najbolji rezultat (bez lokalnog skladišta)
scene("gameover", (score) => {
  if (score > highScore) {
    highScore = score
  }

  // add([
  //   sprite("background", {
  //     width: width(),
  //     height: height()
  //   })
  // ])

  add([
    pos(10, 10),
    text(
      "kraj igre!\n"
      + "rezultat: " + score
      + "\nnajbolji rezultat: " + highScore,
      { size: 45 }
    )
  ])

  keyPress("space", () => {
    go("game")
  })
})

// započinjemo sa igrom
go("game")
