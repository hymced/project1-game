
/********/
/* Game */
/********/

class Game {

    name = "Lemming clone"

    constructor() {

        /*********************/
        /* Game > properties */
        /*********************/

        this.lemmingsArr = []
        this.floorsArr = []
        this.idLastSpawnLemming = 0 // 1+
        this.player = null
        this.boardDomElement = null
        this.exit = null
        this.idsLemmingsExitArr = []

        /*******************/
        /* Game > settings */
        /*******************/

        this.settings = {}
        this.settings.lemmingsMax = 20
        this.settings.spawnDelay = 2000
        this.settings.speedFactorWalk = 0.25
        this.settings.speedFactorFall = 1 // 1.5 closer to the original, but difficult to click to activate skills without the Player class...
        this.settings.scoreInMin = 12 // 60 %
        this.settings.disableDebugMode = true
        this.settings.iterationsMaxFallingNoSplash = 20

    }

    /******************/
    /* Game > methods */
    /******************/

    start() {
        if (this.settings.disableDebugMode === true) this.addDomElementDisableDebugMode()
        this.boardDomElement = document.getElementById("board")
        // this.player = new Player()
        // REMINDER: createGround(bottom, left, height, width)
        // this.floorsArr.push(this.createGround() // uses default values (0, 20, 5, 50)
        this.floorsArr.push(this.createGround(0, 30, 5, 30))
        this.exit = new Exit()
        // this.floorsArr.push(this.createFloor()) // uses default values (50, 40, 1, 50)
        // REMINDER: createFloor(bottom, left, height, width)
        this.floorsArr.push(this.createFloor(70, 30, 1, 40))
        this.floorsArr.push(this.createFloor(55, 10, 1, 22))
        // REMINDER: createFloorMultiLayers(bottom, left, height, width, numberLayers)
        this.floorsArr.push(...this.createFloorMultiLayers(40, 22, 1, 40, 2))
        this.floorsArr.push(...this.createFloorMultiLayers(40, 22, 1, 40, -2))
        // this.floorsArr.push(this.createRock()) // uses default values (51, 45, 5, 5)
        // REMINDER: createRock(bottom, left, height, width)
        this.floorsArr.push(this.createRock(56, 10, 5, 4))
        this.floorsArr.push(this.createRock(56, 28, 5, 4))
        this.attachEventListeners()

        function makeClosureFn() {
            let closedOverIntervalId = null
            function innerFn() {
                closedOverIntervalId = setInterval(() => {
                    if (this.idLastSpawnLemming < this.settings.lemmingsMax)
                        this.lemmingsArr.push(this.spawnLemming())
                    else clearInterval(closedOverIntervalId)
                }, this.settings.spawnDelay)
            }
            return innerFn
        }
        const closureFn = makeClosureFn()
        closureFn.bind(this)()

    }

    /*
    // EXAMPLE 5
    // recursiveMethodsetTimeout() {
    //     const self = this
    //     setTimeout(() => {
    //         if (self.lemmingsArr.length < self.settings.lemmingsMax) {
    //             self.lemmingsArr.push(self.spawnLemming())
    //             self.recursiveMethodsetTimeout()
    //         }
    //     }, 1000)
    // }
    //
    // EXAMPLE 6
    // recursiveIIFEsetTimeout = (() => {
    //     setTimeout(() => {
    //         if (this.lemmingsArr.length < this.settings.lemmingsMax) {
    //             this.lemmingsArr.push(this.spawnLemming())
    //             // not possible to call the callback function again here because it is anonymous...
    //         }
    //     }, 1000)
    // })()
    //
    // EXAMPLE 7
    // recursiveFunctionExpressionsetTimeout = function() { // equivalent to the method declaration syntax (ie without the "function" keyword): this === instance
    //     const self = this
    //     setTimeout(() => {
    //         if (self.lemmingsArr.length < self.settings.lemmingsMax) {
    //             self.lemmingsArr.push(self.spawnLemming())
    //             self.recursiveFunctionExpressionsetTimeout()
    //         }
    //     }, 1000)
    // }
    */

    createGround(bottom, left, height, width) {
        const ground = new Ground(bottom, left, height, width)
        return ground
    }

    createFloor(bottom, left, height, width) {
        const floor = new Floor(bottom, left, height, width)
        return floor
    }

    createFloorMultiLayers(bottom, left, height, width, numberLayers) { // support neg numberLayers to add floors below the bottom (bottom will be the top position of the top one)
        if (numberLayers === undefined) return []
        if (numberLayers === 0) return []
        const floors = []
        for (let i = 1; i <= Math.abs(numberLayers); i++) {
            const floor = new Floor(bottom + height * (Math.sign(numberLayers) * i - 1 + (Math.sign(numberLayers) === -1 ? 1 : 0)), left, height, width)
            floors.push(floor)
        }
        return floors
    }

    createRock(bottom, left, height, width) {
        const rock = new Rock(bottom, left, height, width)
        return rock
    }

    spawnLemming() {
        const lemming = new Lemming(++this.idLastSpawnLemming)
        // update spawned counter in scores
        this.boardDomElement.querySelector("div#scores p span#spawned").innerText = this.idLastSpawnLemming
        // increment out counter in scores
        let out = this.boardDomElement.querySelector("div#scores p span#out").innerText
        this.boardDomElement.querySelector("div#scores p span#out").innerText = ++out
        return lemming
    }

    isEnd() {
        return (this.idLastSpawnLemming === this.settings.lemmingsMax && this.lemmingsArr.length === 0)
    }

    end() {
        if (this.idsLemmingsExitArr.length >= this.settings.scoreInMin)
            alertTimeout("a job well done!")
        else {
            const scoreIn = game.idsLemmingsExitArr.length
            const scoreInPercent = Math.floor(game.idsLemmingsExitArr.length / game.idLastSpawnLemming * 100, 0)
            location.href = `./gameover.html?scoreIn=${scoreIn}&scoreInPercent=${scoreInPercent}`
        }
    }

    addDomElementDisableDebugMode() {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = './css/nodebug.css'
        var linkLast = document.querySelector('head link:last-of-type');
        linkLast.insertAdjacentElement('afterend', link);
    }
    
    attachEventListeners() {
        // listen for click to select lemming so the player can trigger a skill
        // not based on event bubbling to get the div container if img is cliked (which requires to register multiple event listener)
        document.addEventListener("click", eventClick => {
            let elementDiv = null
            if (eventClick.target.tagName === "DIV" && [...eventClick.target.classList].indexOf("lemming") !== -1) // tagName property returns uppercase even if actual html tag is lowercase
                elementDiv = eventClick.target
            else if (eventClick.target.tagName === "IMG" && [...eventClick.target.parentNode.classList].indexOf("lemming") !== -1)
                elementDiv = eventClick.target.parentNode

            if (elementDiv) {
                const lemming = game.lemmingsArr.filter(lemming => lemming.id === Number(elementDiv.id))[0]
                if (lemming.state === 'walk') {
                    clearInterval(lemming.intervalId)
                    lemming.intervalId = 0
                    lemming.block()
                } else if (lemming.state === 'block') {
                    clearInterval(lemming.intervalId)
                    lemming.intervalId = 0
                    lemming.bomb()
                } else if (lemming.state === 'fall') {
                    clearInterval(lemming.intervalId)
                    lemming.intervalId = 0
                    lemming.umbrella = true
                    lemming.umbrellaFall()
                }
            } else console.log("lemming missed!")
        })
        /* // player DISABLED FOR NOW
        if (this.player) {
            document.addEventListener("mousemove", eventMouseMove => {
                game.player.left = eventMouseMove.clientX - this.player.widthPx / 2
                game.player.top = eventMouseMove.clientY - this.player.heightPx / 2
                
                game.player.domElement.style.left =  game.player.left + 'px'
                game.player.domElement.style.top =  game.player.top + 'px'
            })
        }
        */
    }
}

/**********/
/* Player */
/**********/

class Player {
    constructor() {

        /***********************/
        /* Player > properties */
        /***********************/

        this.width = 5
        this.height = 5
        this.top = 0
        this.left = 0
        this.domElement = null

        this.widthPx = null
        this.heightPx = null

        /*****************/
        /* Player > init */
        /*****************/

        this.domElement = this.createDomElement()
        const playerRect = this.domElement.getBoundingClientRect()
        
        this.widthPx = playerRect.right - playerRect.left
        this.heightPx = playerRect.bottom - playerRect.top
         
    }

    /********************/
    /* Player > methods */
    /********************/

    createDomElement() {
        const playerDomElement = document.createElement("div")
        playerDomElement.classList.add("player")

        playerDomElement.style.width = this.width + "%"
        playerDomElement.style.height = this.height + "%"
        playerDomElement.style.top = this.top + "%"
        playerDomElement.style.left = this.left  + "%"

        playerDomElement.style.position = "absolute"
        playerDomElement.style.border = "1px solid white"
        playerDomElement.style.zIndex = 1

        const boardDomElement = document.getElementById("board")

        return boardDomElement.appendChild(playerDomElement)
    }

}

/*********/
/* Floor */
/*********/

class Floor {
    constructor(bottom = 50, left = 40, height = 1, width = 50) {

        /**********************/
        /* Floor > properties */
        /**********************/

        Object.assign(this, {bottom: bottom, left: left, height: height, width: width})

        this.domElement = null

        /****************/
        /* Floor > init */
        /****************/

        this.domElement = this.createDomElement()
    }

    /*******************/
    /* Floor > methods */
    /*******************/

    createDomElement() {
        const floorDomElement = document.createElement("div")
        floorDomElement.classList.add("floor")
        
        floorDomElement.style.width = this.width + "%"
        floorDomElement.style.height = this.height + "%"
        floorDomElement.style.bottom = this.bottom + "%"
        floorDomElement.style.left = this.left  + "%"

        const boardDomElement = document.getElementById("board")

        return boardDomElement.appendChild(floorDomElement)
    }

    /******************/
    /* Floor > skills */
    /******************/

    break(breakPosStart, breakPosEnd) {
        if(breakPosStart > this.left && breakPosEnd < this.left + this.width) { // floorPart2 needed
            const floorPart2 = game.createFloor(this.bottom, breakPosEnd, this.height, this.left + this.width - breakPosEnd)
            game.floorsArr.push(floorPart2)
            // floorPart1 (after floorPart2 because I need the dimensions in floorPart2 before changing them below, avoiding new variables...)
            this.width = breakPosStart - this.left
            this.domElement.style.width = this.width + "%"
        } else { // floorPart1 is enough (this logic to avoid having to implement a .remove() method for the Floor class)
            if(breakPosStart < this.left) {
                this.width -= breakPosEnd - this.left
                this.domElement.style.width = this.width + "%"
                this.left = breakPosEnd
                this.domElement.style.left = this.left + "%"
            } else if(breakPosEnd > this.left + this.width) {
                this.width = breakPosStart - this.left
                this.domElement.style.width = this.width + "%"
            } 
        }
    }

}

/**********/
/* Ground */
/**********/

class Ground extends Floor {
    constructor(bottom = 0, left = 20, height = 5, width = 50) {
        super()

        /***********************/
        /* Ground > properties */
        /***********************/

        // OVERRIDES
        this.bottom = bottom
        this.left = left
        this.height = height
        this.width = width

        /*****************/
        /* Ground > init */
        /*****************/

        this.domElement.remove()
        this.domElement = null
        this.domElement = super.createDomElement()
        this.domElement.classList.replace('floor', 'ground')
    }

    /********************/
    /* Ground > methods */
    /********************/

}

/********/
/* Rock */
/********/

class Rock extends Floor {
    constructor(bottom = 51, left = 45, height = 5, width = 5) {
        super()

        /*********************/
        /* Rock > properties */
        /*********************/

        // OVERRIDES
        this.bottom = bottom
        this.left = left
        this.height = height
        this.width = width

        /***************/
        /* Rock > init */
        /***************/

        this.domElement.remove()
        this.domElement = null
        this.domElement = super.createDomElement()
        this.domElement.classList.replace('floor', 'rock')
    }

    /******************/
    /* Rock > methods */
    /******************/

}

/********/
/* Exit */
/********/

class Exit {
    constructor() {

        /**********************/
        /* Exit > properties */
        /**********************/

        this.bottom = game.floorsArr[0].bottom + game.floorsArr[0].height
        this.left = 50
        this.height = 5
        this.width = 5
        
        this.domElement = null

        /***************/
        /* Exit > init */
        /***************/

        this.domElement = this.createDomElement()
    }

    /******************/
    /* Exit > methods */
    /******************/

    createDomElement() {
        const exitDomElement = document.createElement("div")
        exitDomElement.id = "exit"

        exitDomElement.style.width = this.width + "%"
        exitDomElement.style.height = this.height + "%"
        exitDomElement.style.bottom = this.bottom + "%"
        exitDomElement.style.left = this.left  + "%"

        exitDomElement.style.position = "absolute"
        exitDomElement.style.border = "dashed red"
        exitDomElement.style.borderBottomStyle = "hidden"
        exitDomElement.style.boxSizing = "border-box" 

        const urlImage = "./images/in-out v2/exit.gif"
        exitDomElement.innerHTML = `<img src="${urlImage}" alt="lemming-exit-anim">`;

        const boardDomElement = document.getElementById("board")

        return boardDomElement.appendChild(exitDomElement)
    }
}

/***********/
/* Lemming */
/***********/

class Lemming {
    constructor(id) {

        /************************/
        /* Lemming > properties */
        /************************/

        this.width = 2
        this.height = 2
        this.top = 10
        this.left = 50
        this.domElement = null
        this.state = null
        this.intervalId = null
        this.id = id
        this.direction = 'right'

        /******************/
        /* Lemming > init */
        /******************/

        this.left = this.left - this.width / 2
        this.domElement = this.createDomElement()
        this.fall() // all lemmings appear falling out of the hatch
        this.umbrella = false
    }
    
    /*********************/
    /* Lemming > methods */
    /*********************/

    createDomElement() {
        const lemmingDomElement = document.createElement("div")
        lemmingDomElement.classList.add("lemming")
        lemmingDomElement.id = this.id

        lemmingDomElement.style.width = this.width + "%"
        lemmingDomElement.style.height = this.height + "%"
        lemmingDomElement.style.top = this.top + "%"
        lemmingDomElement.style.left = this.left + "%"

        const boardDomElement = document.getElementById("board")

        return boardDomElement.appendChild(lemmingDomElement)
    }

    /********************/
    /* Lemming > skills */
    /********************/

    fall() {        
        this.state = 'fall'
        if (this.domElement.classList.length === 1) { // then new lemming
            this.domElement.classList.add('fall')
        }
        else this.domElement.classList.replace('walk', 'fall')
        const urlImage = "./images/lemming gifs v5 consolidated/lemming-fall-anim.gif"
        this.domElement.innerHTML = `<img src="${urlImage}" alt="lemming-fall-anim.gif">`;
        this.iterationsFalling = 0
        this.intervalId = setInterval(() => {
            ++this.iterationsFalling
            const floorBelow = this.willCollideFloor()
            const exitBelow = this.hasReachedExit()
            const splashBelow = this.willSplash() && floorBelow
            const umbrellaReady = this.hasUmbrella()
            if (!floorBelow && !splashBelow) {
                if (!umbrellaReady) {
                    this.top += 1 * game.settings.speedFactorFall
                    this.domElement.style.top = this.top + "%"
                    if (exitBelow) { // will walk towards it after reaching the floor
                        if (this.isRightOfExit())
                            this.direction = 'left'
                        else this.direction = 'right'
                    }
                } else if (umbrellaReady) {
                    clearInterval(this.intervalId)
                    this.intervalId = null
                    this.umbrellaFall()
                }
            } else if (splashBelow && !umbrellaReady) {
                this.top = (100 - floorBelow.bottom) - floorBelow.height - this.height
                this.domElement.style.top = this.top + "%"
                clearInterval(this.intervalId)
                this.intervalId = null
                this.splash()
            } else {
                this.top = (100 - floorBelow.bottom) - floorBelow.height - this.height
                this.domElement.style.top = this.top + "%"
                clearInterval(this.intervalId)
                this.intervalId = null
                this.walk()
            }
            if (this.isOut()) this.remove()
        }, 100)
    }

    walk() {
        this.state = 'walk'
        this.domElement.classList.replace('fall', 'walk')
        this.domElement.classList.replace('umbrella2', 'walk')
        const urlImage = "./images/lemming gifs v5 consolidated/lemming-walk-anim.gif"
        this.domElement.innerHTML = `<img src="${urlImage}" alt="lemming-walk-anim.gif">`;
        this.iterationsFalling = 0
        this.intervalId = setInterval(() => {
            const blockerFront = this.willCollideBlocker()
            const voidFront = this.willBeInVoid()
            const exitFront = this.willExit()
            const rockFront = this.willCollideRock()
            const voidBelow = this.isInVoid()
            const umbrellaReady = this.hasUmbrella()
            const floorBelow = this.willCollideFloor()
            if (!blockerFront && !voidFront && !exitFront && !rockFront && !voidBelow) {
                if (this.direction === 'right') {
                    if ([...this.domElement.firstChild.classList].indexOf('flip') !== -1)
                        this.domElement.firstChild.classList.remove("flip")
                    this.left += 1 * game.settings.speedFactorWalk
                } else if (this.direction === 'left') {
                    if ([...this.domElement.firstChild.classList].indexOf('flip') === -1)
                        this.domElement.firstChild.classList.add("flip")
                    this.left -= 1 * game.settings.speedFactorWalk
                }
                this.domElement.style.left = this.left + "%"
            } else if (blockerFront) {
                if (this.direction === 'right') {
                    this.direction = 'left'
                    this.left = blockerFront.left - this.width
                    this.domElement.style.left = this.left + "%"
                }
                else if (this.direction === 'left') {
                    this.direction = 'right'
                    this.left = blockerFront.left + blockerFront.width
                    this.domElement.style.left = this.left + "%"
                }
            } else if (voidBelow) {
                clearInterval(this.intervalId)
                this.intervalId = null
                if (!floorBelow) {
                    this.fall()
                }
            } else if (voidFront) {
                const floorBelow = this.willCollideFloor()
                if (this.direction === 'right') {
                    this.left = floorBelow.left + floorBelow.width
                }
                else if (this.direction === 'left') {
                    this.left = floorBelow.left - this.width
                }
                this.domElement.style.left = this.left + "%"
                clearInterval(this.intervalId)
                this.intervalId = null
                if (!umbrellaReady) this.fall()
                else this.umbrellaFall()
            } else if (exitFront) {
                this.left = game.exit.left + game.exit.width / 2 - this.width / 2
                this.domElement.style.left = this.left + "%"
                clearInterval(this.intervalId)
                this.intervalId = null
                this.exit()
            } else if (rockFront) {
                if (this.direction === 'right') {
                    this.direction = 'left'
                    this.left = rockFront.left - this.width
                    this.domElement.style.left = this.left + "%"
                }
                else if (this.direction === 'left') {
                    this.direction = 'right'
                    this.left = rockFront.left + rockFront.width
                    this.domElement.style.left = this.left + "%"
                }
            } 
            if (this.isOut()) this.remove()
        }, 100)
    }

    block() {
        this.state = 'block'
        this.domElement.classList.replace('walk', 'block')
        const urlImage = "./images/lemming gifs v5 consolidated/lemming-stop-anim.gif"
        this.domElement.innerHTML = `<img src="${urlImage}" alt="lemming-stop-anim.gif">`;
        clearInterval(this.intervalId)
        this.intervalId = null
    }

    exit() {
        this.state = 'exit'
        this.intervalId = setTimeout(() => {
            game.idsLemmingsExitArr.push(this.id)
            this.remove()
            console.log(`lemming id ${game.idsLemmingsExitArr[game.idsLemmingsExitArr.length - 1]} has found the exit!`)
        }, 100)
    }

    bomb() {
        this.state = 'bomb'
        this.domElement.classList.replace('block', 'bomb')
        const urlImage = "./images/lemming gifs v6.explosion/lemming-explosion-3.gif"
        this.domElement.innerHTML = `<img src="${urlImage}" alt="lemming-explosion-anim.gif">`;
        this.domElement.innerHTML = `<img src="${urlImage}?id=${this.id}" alt="lemming-explosion-anim.gif">`; // ok restarts gif
        this.explodeTimeout(1000)
        clearInterval(this.intervalId)
        this.intervalId = null
        this.intervalId = setTimeout(() => {
            const floorBelow = this.willCollideFloor()
            if (!(floorBelow instanceof Ground || floorBelow instanceof Rock)) // to disable ground and rock breaking
                floorBelow.break(this.left, this.left + this.width)
            setTimeout(this.remove.bind(this), 2000)
        }, 1000) 
    }

    explodeTimeout(delay) {
        setTimeout(() => {
            this.state = 'explosion'
            this.domElement.classList.replace('bomb', 'explosion')
            const urlImage = "./images/lemming gifs v5 consolidated/lemming-explosion-2.gif"
            this.domElement.innerHTML = `<img src="${urlImage}?a=${Math.random()}" alt="lemming-explosion-2-anim.gif">`;
        }, delay)
    }

    splash() {
        this.state = 'splash'
        this.domElement.classList.replace('fall', 'splash')
        const urlImage = "./images/lemming gifs v5 consolidated/lemming-explosion-2.gif"
        this.domElement.innerHTML = `<img src="${urlImage}?id=${this.id}"" alt="lemming-explosion-2-anim.gif">`;
        clearInterval(this.intervalId)
        this.intervalId = null
        this.intervalId = setTimeout(this.remove.bind(this), 1000)
    }

    umbrellaOpen() {
        this.state = 'umbrella1'
        this.domElement.classList.replace('fall', 'umbrella2')
        const urlImage = "./images/lemming gifs fall with umbrella/lemming-fall-opening-umbrella.gif.gif"
        this.domElement.innerHTML = `<img src="${urlImage}" alt="lemming-umbrella1-anim.gif">`;
        clearInterval(this.intervalId)
        this.intervalId = null
    }

    umbrellaFall() {
        this.state = 'umbrella2'
        this.domElement.classList.replace('fall', 'umbrella2')
        this.domElement.classList.replace('walk', 'umbrella2')
        const urlImage = "./images/lemming gifs fall with umbrella/lemming-fall-umbrella.gif"
        this.domElement.innerHTML = `<img src="${urlImage}" alt="lemming-umbrella2-anim.gif">`;
        this.intervalId = setInterval(() => {
            ++this.iterationsFalling
            const floorBelow = this.willCollideFloor()
            const exitBelow = this.hasReachedExit()
            const splashBelow = this.willSplash() && floorBelow
            const umbrellaReady = this.hasUmbrella() // should be always true here...
            if (!floorBelow && !splashBelow) {
                this.top += 1 * game.settings.speedFactorFall * 0.5
                this.domElement.style.top = this.top + "%"
                if (exitBelow) { // will walk towards it after reaching the floor
                    if (this.isRightOfExit())
                        this.direction = 'left'
                    else this.direction = 'right'
                }
            } else {
                this.top = (100 - floorBelow.bottom) - floorBelow.height - this.height
                this.domElement.style.top = this.top + "%"
                clearInterval(this.intervalId)
                this.intervalId = null
                this.walk()
            }
            if (this.isOut()) this.remove()
        }, 100)
    }

    /****************************/
    /* Lemming > methods > misc */
    /****************************/

    remove() { 
        // decrement out counter in scores 
        let out = game.boardDomElement.querySelector("div#scores p span#out").innerText
        game.boardDomElement.querySelector("div#scores p span#out").innerText = --out
        // update in counter in scores
        if (this.state === 'exit') {
            game.boardDomElement.querySelector("div#scores p span#in").innerText = game.idsLemmingsExitArr.length
            game.boardDomElement.querySelector("div#scores p span#in-percent").innerText = Math.floor(game.idsLemmingsExitArr.length / game.idLastSpawnLemming * 100, 0)
        }

        game.lemmingsArr.filter(lemming => lemming.id === this.id)[0].domElement.remove()
        game.lemmingsArr.splice(game.lemmingsArr.indexOf(this), 1)
        clearInterval(this.intervalId)
        this.intervalId = null // not necessary, instance will be garbage collected at the end of this block scope anyway because this keyword is the only reference to it at this point
        this.state = null // dito

        if (game.isEnd()) game.end()
    }

    isOut() {
        if (
            this.top >= 100 || 
            this.left >= 100 || 
            this.left <= - this.width || 
            this.top <= this.height
        ) return true
        else return false
    }

    // REMINDER: floors have bottom set, but not top
    willCollideFloor() { // also works to detect rock below lemming
        const boardRect = game.boardDomElement.getBoundingClientRect()
        let floorBelowClosest = null
        game.floorsArr.forEach(floor => {
            const floorRect = floor.domElement.getBoundingClientRect()
            const lemmingRect = this.domElement.getBoundingClientRect()
            const spaceBelow = floorRect.top - lemmingRect.bottom
            if ((this.left + this.width) > floor.left && this.left < (floor.left + floor.width)) {
                if(spaceBelow / boardRect.height * 100 < 1 * game.settings.speedFactorFall && spaceBelow >= 0) {
                    if (!floorBelowClosest) floorBelowClosest = floor
                    if (floorBelowClosest.bottom < floor.bottom) floorBelowClosest = floor
                }
            }
        })
        if (floorBelowClosest === null) return false
        else return floorBelowClosest
    }

    willCollideBlocker() {
        const boardRect = game.boardDomElement.getBoundingClientRect()
        let blockerFront = null
        game.lemmingsArr.filter(lemming => lemming.state === 'block').forEach(blocker => {
            if ((this.top + this.height) > blocker.top && this.top < (blocker.top + blocker.height)) {
                if (this.direction === 'right') {
                    const spaceFront = blocker.left - (this.left + this.width)
                    if(spaceFront < 1 * game.settings.speedFactorWalk && spaceFront >= 0) {
                        blockerFront = blocker
                    }
                } else if (this.direction === 'left') {
                    const spaceFront = this.left - (blocker.left + blocker.width)
                    if(spaceFront < 1 * game.settings.speedFactorWalk && spaceFront >= 0) {
                        blockerFront = blocker
                    }
                }
            }
        })
        if (blockerFront === null) return false
        else return blockerFront
    }

    willCollideRock() { // also works to detect floor in front of lemming
        const boardRect = game.boardDomElement.getBoundingClientRect()
        let rockFront = null
        game.floorsArr.forEach(rock => {
            const rockRect = rock.domElement.getBoundingClientRect()
            const lemmingRect = this.domElement.getBoundingClientRect()
            if ((this.top + this.height) > (100 - (rock.bottom + rock.height)) && this.top < (100 - rock.bottom)) {
                if (this.direction === 'right') {
                    const spaceFront = rock.left - (this.left + this.width)
                    if(spaceFront < 1 * game.settings.speedFactorWalk && spaceFront >= 0) {
                        rockFront = rock
                    }
                } else if (this.direction === 'left') {
                    const spaceFront = this.left - (rock.left + rock.width)
                    if(spaceFront < 1 * game.settings.speedFactorWalk && spaceFront >= 0) {
                        rockFront = rock
                    }
                }
            }
        })
        if (rockFront === null) return false
        else return rockFront
    }

    willBeInVoid() {
        const floorBelow = this.willCollideFloor()
        if (floorBelow) {
            if ((100 - (floorBelow.bottom + floorBelow.height)) === (this.top + this.height)) {
                if (this.direction === 'right') {
                    const spaceFront = (floorBelow.left + floorBelow.width) - this.left
                    if(spaceFront <= 1 * game.settings.speedFactorWalk && spaceFront >= 0) {
                        return true
                    } else return false
                } else if (this.direction === 'left') {
                    const spaceFront = (this.left + this.width) - floorBelow.left
                    if(spaceFront <= 1 * game.settings.speedFactorWalk && spaceFront >= 0) {
                        return true
                    } else return false
                }
            } else return false
        } else return true
    }

    isInVoid() {
        const floorBelow = this.willCollideFloor()
        if (floorBelow) {
            return (this.top + this.height) < (100 - (floorBelow.bottom + floorBelow.height))
        } else return true
    }
    
    hasReachedExit() {
        if ((this.top + this.height) <= (100 - game.exit.bottom) && this.top >= (100 - (game.exit.bottom + game.exit.height))
            && (this.left + this.width) <= (game.exit.left + game.exit.width) && this.left >= game.exit.left
        ) return true
        else return false
    }

    willExit() {
        if ((this.top + this.height) <= (100 - game.exit.bottom) && this.top >= (100 - (game.exit.bottom + game.exit.height))) {
            if (this.direction === 'right') {
                const spaceFront = (game.exit.left + game.exit.width / 2) - (this.left + this.width / 2)
                if(spaceFront < 1 * game.settings.speedFactorWalk && spaceFront >= 0) {
                    return true
                }
            } else if (this.direction === 'left') {
                const spaceFront = (this.left + this.width / 2) - (game.exit.left + game.exit.width / 2)
                if(spaceFront < 1 * game.settings.speedFactorWalk && spaceFront >= 0) {
                    return true
                }
            }
        }
        return false
    }

    isRightOfExit() {
        return this.left + this.width / 2 > game.exit.left + game.exit.width / 2
    }

    willSplash() {
        return this.iterationsFalling > game.settings.iterationsMaxFallingNoSplash / game.settings.speedFactorFall
    }

    hasUmbrella() {
        return this.umbrella
    }

}

/********/
/* main */
/********/

const game = new Game()
game.start()

function alertTimeout(text) {
    setTimeout(function() {
        window.alert(text);
    }, 100);
}
const rules = `
    Welcome to Lemming's world!

    Your goal is to have at least ${Math.floor(game.settings.scoreInMin / game.settings.lemmingsMax * 100)} % of lemmings **IN** the **EXIT** at the bottom.

    Click on them to activate their **skills**!

    Pssst...! You have all the time in the world, the game will finish only when there are no more lemmings **OUT**...
`

function alertAfterBrowserRendering(text) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        window.alert(text);
      })
    });
  }
  alertAfterBrowserRendering(rules)

function round(float, digits) {
    return Math.round(float * 10 ** digits) / 10 ** digits
    // or
    return +float.toFixed(digits)
}

function restartGifAnimTimeout(imgDomElement){
    let imgSrc = imgDomElement.src;
    imgDomElement.src = ""
    setTimeout(() => {
        imgDomElement.src = imgSrc;
    }, 0)
}
