joker_enabled = true
magsize = 15
focused = true
window.onfocus = function() {
    focused = true
}
window.onblur = function() {
    focused = false
}
window.onload = function() {
    if (!window.chrome) {
        document.body.style.background = "#626668"
        changeview("start", "incompatible")
    }
}
document.addEventListener("keypress", 
function(event) {
    var player = document.getElementById("player")
    var game = document.getElementById("game")
    if (game.style.display != "none") {
    var x = player.getBoundingClientRect()["x"]
    if (event.keyCode == 97 && x > 75 ) {
        player.style.left = x - 30 + "px"
		player.style.transform = "scale(1, 1)"
    } else if (event.keyCode == 100 && x < window.innerWidth - 150) {
        player.style.left = x + 30 + "px"
		player.style.transform = "scale(-1, 1)"
    } else if (event.keyCode == 114) {
        reload()
    } else if (event.keyCode == 32) {
        shoot(event)
    }}})

function startgame() {
    document.getElementById("player").style.left = window.innerWidth/2+"px"
    var jokerb = document.getElementById("joker")
    changeview("start", "")
    setTimeout(function(){changeview("", "game");updateTick()}, 200)
    if (joker_enabled == false) {
        jokerb.style.textDecoration = "line-through"
    } else {
        jokerb.style.textDecoration = "none"
    }
    zinterval = setInterval(newZombie, 1000)
    ticks = 1000
    shoot_able = true
    document.getElementById("ammolbl").innerHTML = magsize
    document.getElementById("maxammo").innerHTML = magsize
    document.getElementById("scorelbl").innerHTML = 0
    document.getElementById("healthlbl").innerHTML = 100
}
function getcenter(o) {
    return [o.getBoundingClientRect()["x"] + o.getBoundingClientRect()["width"] / 2, o.getBoundingClientRect()["y"] + o.getBoundingClientRect()["height"] / 2]
}
function joker() {
    var jokerb = document.getElementById("joker")
    if (jokerb.style.textDecoration == "none" && joker_enabled == true) {
        jokerb.style.textDecoration = "line-through"
        document.querySelectorAll(".zombie").forEach(z => {z.remove()})
    }
}
function changeview(oldv, newv) {
    var apps = document.querySelectorAll(".newapp")
    apps.forEach(app => {
        app.classList.remove("visuallyvisible")
        app.classList.add("visuallyhidden")
    });
    if (oldv != "" && oldv != "game") {
        var o = document.getElementById(oldv)
        o.classList.remove("visuallyvisible")
        o.classList.add("visuallyhidden")
        setTimeout(function(){o.style.display="none"},200)
    } else if (oldv == "game") {
        var o = document.getElementById(oldv)
        o.style.display = "none"
    }
    if (newv != "" && newv != "game") {
        var n = document.getElementById(newv)
        n.style.display="block"
        setTimeout(function(){n.classList.remove("visuallyhidden");n.classList.add("visuallyvisible")},1)
    } else if (newv == "game") {
        var n = document.getElementById(newv)
        n.style.display = "block"
    }
}
function shoot(event) {
    var ammo = document.getElementById("ammolbl")
    var game = document.getElementById("game")
    if (parseInt(ammo.innerHTML, 10) > 0 && shoot_able == true) {
        var laser = document.createElement("DIV")
        laser.className = "laser"
        game.appendChild(laser)
        laser.style.left = getcenter(player)[0]+"px"
        laser.style.top = "50px"
        laser.style.transition = "0.1s"
        ammo.innerHTML = parseInt(ammo.innerHTML, 10) - 1
        setTimeout(function(laser) {
            var score = document.getElementById("scorelbl")
            laser.style.top = window.innerHeight + "px"
            var zombies = document.querySelectorAll(".zombie")
            zombies.forEach(z => {
                var zx = getcenter(z)[0]
                var px = getcenter(player)[0]
                if (zx + 50 > px && px > zx - 50) {
                    z.remove()
                    score.innerHTML = parseInt(score.innerHTML, 10) + 1
                    if (parseInt(score.innerHTML, 10) == 100) {
                        stop("wonscreen")
                    }
                }            
            });
            setTimeout(function(laser) {
                laser.remove()
            }, 100, laser)
        }, 1, laser)
    }
}
function reload() {
    var ammo = document.getElementById("ammolbl")
    shoot_able = false
    setTimeout(() => {ammo.innerHTML = magsize; shoot_able = true}, 1000);
}
function newZombie() {
    if (focused == true) {
        var game = document.getElementById("game")
        var pos = (window.innerWidth - 300) * Math.random() + 100
        var zombie = document.createElement("DIV")
        zombie.className = "zombie"
        zombie.style.left = pos + "px"
        zombie.style.bottom = "0px"
        game.appendChild(zombie)
    }
}
function updateTick() {
    var game = document.getElementById("game")
    var score = document.getElementById("scorelbl")
    if (focused == true && game.style.display != "none") {
        var health = document.getElementById("healthlbl")
        var zombies = document.querySelectorAll(".zombie")
        zombies.forEach(current => {
            current.style.bottom = parseInt(current.style.bottom.slice(0,-2), 10)+10+"px"
            if (current.getBoundingClientRect()["y"] <= 225) {
                current.remove()
                health.innerHTML = parseInt(health.innerHTML, 10) - 10
                if (health.innerHTML == "0") {
                    stop("deathscreen")
                    document.getElementById("scored").innerHTML = score.innerHTML
                }
            }
        })
    }
    if (game.style.display != "none") {
        var x = parseInt(score.innerHTML, 10)
        ticks = 1000 - (95 * Math.sqrt(x))
        setTimeout(updateTick, ticks)
    }
}
function stop(where) {
    var score = document.getElementById("scorelbl")
    clearInterval(zinterval)
    document.querySelectorAll(".zombie").forEach(z => {z.remove()})
    changeview("game", where)
    if (where == "stopscreen") {
        document.getElementById("sscored").innerHTML = score.innerHTML
    }
}
function updatejoker() {
    var jokerstate = document.getElementById("jokerstate")
    var convdict = {"true":"Enabled","false":"Disabled"}
    joker_enabled = !joker_enabled
    jokerstate.innerHTML = convdict[joker_enabled]
}
function updatemag() {
    var magstate = document.getElementById("magstate")
    var states = [1, 5, 10, 15, 20, 25, 30]
    if (magsize == 30) {
        magsize = 1
    } else {
        magsize = states[states.indexOf(magsize)+1]
    }
    magstate.innerHTML = magsize
}