
let machineSequence = []
let userSequence = []
let round = 0

const sound1 = new Audio("Sounds/1.mp3")
const sound2 = new Audio("Sounds/2.mp3")
const sound3 = new Audio("Sounds/3.mp3")
const sound4 = new Audio("Sounds/4.mp3")


document.querySelector("#start").onclick = startGame

function startGame() {
    resetStatus()
    handleRound()
}

function updateStatus (status, error = false){
    const $status = document.querySelector("#status")
    $status.textContent = status
    if (error) {
        $status.className = "alert alert-danger"
    }
    else {
        $status.className = "alert alert-primary"
    }
}

function updateRoundNumber(round){
    document.querySelector("#round").textContent = `Ronda Nº ${round}`
}

updateRoundNumber("0")
updateStatus("Toca en [COMENZAR] para jugar!")

function resetStatus (){
    machineSequence = []
    userSequence = []
    round = 0
}

function handleRound(){
    updateStatus("Es turno de la maquina")
    blockUserInput()
    
    const $newColor = getRandomColor()
    machineSequence.push($newColor)

    const delayUserTurn = (machineSequence.length + 1) * 1000
    machineSequence.forEach(function($color, i){
        const delayInMs = (i + 1) * 1000
        setTimeout(function(){
            highlight($color)
        }, delayInMs)
    })

    setTimeout(function(){
        updateStatus("Es turno del jugador")
        unBlockUserInput()
    }, delayUserTurn)

    userSequence = []
    round++
    updateRoundNumber(round)
}

function getRandomColor() {
    const $colors = document.querySelectorAll(".color")
    const i = Math.floor(Math.random() * $colors.length)
    return $colors[i]
}

function highlight($color){
    $color.style.opacity = 1.5
    if ($color.id === "green"){
        sound1.play()
    }
    if ($color.id === "red"){
        sound2.play()
    }
    if ($color.id === "blue"){
        sound4.play()
    }
    if ($color.id === "yellow"){
        sound3.play()
    }

    setTimeout(function() {
        $color.style.opacity = 0.5
    }, 500)
}

function blockUserInput () {
    document.querySelectorAll(".color").forEach(function($color){
        $color.onclick = function(){
            document.querySelector("#status").classList.add("trembles")
            setTimeout(function(){
                document.querySelector("#status").classList.remove("trembles")
            }, 175);
        }
    })
}

function unBlockUserInput () {
    document.querySelectorAll(".color").forEach(function($color){
        $color.onclick = handleUserInput
    })
}

function lose() {
    blockUserInput()
    updateStatus("¡Has perdido! Toca en [COMENZAR] para jugar de nuevo", true)
}

function handleUserInput(e) {
    const $color = e.target
    highlight($color)
    userSequence.push($color)

    const $colorMachine = machineSequence[userSequence.length - 1]
    if ($color.id !== $colorMachine.id) {
    lose()
    return
    }

    if (userSequence.length === machineSequence.length){
        blockUserInput()
        setTimeout(handleRound, 1000)
    }
}
