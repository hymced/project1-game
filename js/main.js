
/********/
/* Game */
/********/

class Game {
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

        this.lemmingsMax = 3
        this.speedFactor = 1

    }

    /******************/
    /* Game > methods */
    /******************/

    start() {
        this.boardDomElement = document.getElementById("board")
        //this.player = new Player()
        this.floorsArr.push(this.createGround())
        this.exit = new Exit()
        this.floorsArr.push(this.createFloor())
        this.attachEventListeners()

        this.intervalId = setInterval(() => {
            if (this.lemmingsArr.length < this.lemmingsMax)
                this.lemmingsArr.push(this.spawnLemming())
            else clearInterval(this.intervalId)
        }, 1000)
    }

    createGround() {
        const ground = new Ground()        
        return ground
    }

    createFloor() {
        const floor = new Floor()        
        return floor
    }

    spawnLemming() {
        const lemming = new Lemming(++this.idLastSpawnLemming)
        return lemming
    }
    
    attachEventListeners() {
        // listen for click to select lemming so the player can trigger a skill
        document.addEventListener("click", eventClick => {
            const lemming = game.lemmingsArr.filter(lemming => lemming.id === Number(eventClick.target.id))[0]
            if (lemming.state === 'walk') {
                clearInterval(lemming.intervalId)
                lemming.intervalId = 0
                lemming.block()
            }
        })
        if (this.player) {
            document.addEventListener("mousemove", eventMouseMove => {            
                game.player.left = eventMouseMove.clientX - this.player.widthPx / 2
                game.player.top = eventMouseMove.clientY - this.player.heightPx / 2
                
                game.player.domElement.style.left =  game.player.left + 'px'
                game.player.domElement.style.top =  game.player.top + 'px'
            })
        }
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

        // or vh / vw
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
    constructor() {

        /**********************/
        /* Floor > properties */
        /**********************/

        this.width = 50
        this.height = 1
        this.bottom = 50
        this.left = 40
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

        // or vh / vw
        floorDomElement.style.width = this.width + "%"
        floorDomElement.style.height = this.height + "%"
        floorDomElement.style.bottom = this.bottom + "%"
        floorDomElement.style.left = this.left  + "%"

        const boardDomElement = document.getElementById("board")

        return boardDomElement.appendChild(floorDomElement)
    }
}

/**********/
/* Ground */
/**********/

class Ground extends Floor {
    constructor() {
        super()

        /***********************/
        /* Ground > properties */
        /***********************/

        // OVERRIDES
        this.width = 50
        this.height = 5
        this.bottom = 0
        this.left = 10

        /*****************/
        /* Ground > init */
        /*****************/

        this.domElement = super.createDomElement()
    }

    /********************/
    /* Ground > methods */
    /********************/

}

/********/
/* Exit */
/********/

class Exit {
    constructor() {

        /**********************/
        /* Exit > properties */
        /**********************/

        this.width = 5
        this.height = 5
        this.bottom = game.floorsArr[0].bottom + game.floorsArr[0].height
        this.left = 50
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
        this.fall() // all lemmings appears falling out of the hatch
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

    /**************************/
    /* Lemming > basic skills */
    /**************************/

    // DEBUG
    // game.lemmingsArr.filter(lemming => lemming.id === 1)[0].left
    // game.lemmingsArr.filter(lemming => lemming.id === 1)[0].domElement.style.left

    fall() {        
        this.state = 'fall'
        this.intervalId = setInterval(() => {
        const below = this.willCollideFloor()
        if (!below) {
            this.top += 1 * game.speedFactor
            this.domElement.style.top = this.top + "%"
        } else {
            const floorBelow = below
            // this.top = round(
            //     floorBelow.domElement.offsetTop / game.boardDomElement.clientHeight * 100 - this.height, 
            //     1) // not precise enough because offsetTop is already a rounded value
            // this.top = round(
            //     floorBelow.domElement.getBoundingClientRect().top / game.boardDomElement.getBoundingClientRect().height * 100 - this.height, 
            //     1) // better precision with subpixel values
            this.top = (100 - floorBelow.bottom) - floorBelow.height - this.height // (100 - bottom) to revert Y axis
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
        this.intervalId = setInterval(() => {
            const blockerFront = this.willCollideBlocker()
            const voidFront = this.willBeInVoid()
            const exitFront = this.willExit()
            if (!blockerFront && !voidFront && !exitFront) {                
                if (this.direction === 'right') {
                    this.left += 1 * game.speedFactor
                } else if (this.direction === 'left') {
                    this.left -= 1 * game.speedFactor
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
                this.fall()
            } else if (exitFront) {
                this.left = game.exit.left + game.exit.width / 2 - this.width / 2
                this.domElement.style.left = this.left + "%"
                clearInterval(this.intervalId)
                this.intervalId = null
                this.exit()
            }
            if (this.isOut()) this.remove()
        }, 100)
    }

    block() {
        this.state = 'block'
        this.domElement.classList.replace('lemming', 'blocker')
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

    }

    /****************************/
    /* Lemming > methods > misc */
    /****************************/

    remove() {
        game.lemmingsArr.filter(lemming => lemming.id === this.id)[0].domElement.remove()
        // game.lemmingsArr.splice(game.lemmingsArr.indexOf(game.lemmingsArr.filter(lemming => lemming.id === this.id)[0]), 1)
        game.lemmingsArr.splice(game.lemmingsArr.indexOf(this), 1) // directly...
        clearInterval(this.intervalId)
        this.intervalId = null // not necessary, instance will be garbage collected at the end of this block scope anyway because this keyword is the only reference to it at this point
        this.state = null // dito
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

    // UNUSED POST-COLLISION DETECTION
    hasCollidedFloor() {
        let floorCollided = null
        floorsArr.forEach(floor => {
            // METHOD 1: use the collision detection formula with the width and height
            // METHOD 2: use the collision detection formula with left, right, top, and bottom
            //           (prone to error since a DOM element can have both top and bottom defined and forced (vs top defined + bottom computed), but if there is a conflict, bottom is skipped)
            // METHOD 3: convert a measure from bottom to a measure from top (or I could just have used top also for floor obstacles...)
            const floorRect = floor.domElement.getBoundingClientRect() 
            const lemmingRect = this.domElement.getBoundingClientRect() 
            if(
                floorRect.bottom > lemmingRect.top && 
                floorRect.right > lemmingRect.left && 
                floorRect.top < lemmingRect.bottom && 
                floorRect.left < lemmingRect.right
            ) {
                floorCollided = floor;
            }
        })
        if (floorCollided !== null) return floorCollided
        else return false
    }

    // REMINDER: floors have bottom set, but not top
    willCollideFloor() {
        const boardRect = game.boardDomElement.getBoundingClientRect()
        let floorBelow = null
        game.floorsArr.forEach(floor => {
            const floorRect = floor.domElement.getBoundingClientRect() 
            const lemmingRect = this.domElement.getBoundingClientRect() 
            const spaceBelow = floorRect.top - lemmingRect.bottom
            if ((this.left + this.width) > floor.left && this.left < (floor.left + floor.width)) {
                if(spaceBelow / boardRect.height * 100 < 1 * game.speedFactor && spaceBelow >= 0) { // 1 to anticipate other values for freefall or walk speed in game settings
                    floorBelow = floor
                }
            }
        })
        if (floorBelow === null) return false
        else return floorBelow
    }

    willCollideBlocker() {
        const boardRect = game.boardDomElement.getBoundingClientRect()
        let blockerFront = null
        game.lemmingsArr.filter(lemming => lemming.state === 'block').forEach(blocker => {
            if ((this.top + this.height) > blocker.top && this.top < (blocker.top + blocker.height)) {
                if (this.direction === 'right') {
                    const spaceFront = blocker.left - (this.left + this.width)
                    if(spaceFront < 1 * game.speedFactor && spaceFront >= 0) {
                        blockerFront = blocker
                    }
                } else if (this.direction === 'left') {
                    const spaceFront = this.left - (blocker.left + blocker.width)
                    if(spaceFront < 1 * game.speedFactor && spaceFront >= 0) {
                        blockerFront = blocker
                    }
                }
            }
        })
        if (blockerFront === null) return false
        else return blockerFront
    }

    willBeInVoid() {
        const floorBelow = this.willCollideFloor()
        if (floorBelow) {
            if (this.direction === 'right') {
                const spaceFront = (floorBelow.left + floorBelow.width) - this.left
                if(spaceFront <= 1 * game.speedFactor && spaceFront >= 0) {
                    return true
                } else return false
            } else if (this.direction === 'left') {
                const spaceFront = (this.left + this.width) - floorBelow.left
                if(spaceFront <= 1 * game.speedFactor && spaceFront >= 0) {
                    return true
                } else return false
            }
        } else return false
    }

    willExit() {
        if ((this.top + this.height) <= (100 - game.exit.bottom) && this.top >= (100 - (game.exit.bottom + game.exit.height))) { // lemming must be entirely within exit vertical bounderies            
            if (this.direction === 'right') {
                const spaceFront = (game.exit.left + game.exit.width / 2) - (this.left + this.width / 2) // lemming must reach the center of exit
                if(spaceFront < 1 * game.speedFactor && spaceFront >= 0) {
                    return true
                }
            } else if (this.direction === 'left') {
                const spaceFront = (this.left + this.width / 2) - (game.exit.left + game.exit.width / 2) // lemming must reach the center of exit
                if(spaceFront < 1 * game.speedFactor && spaceFront >= 0) {
                    return true
                }
            }
        }
        return false
    }

}

/********/
/* main */
/********/

const game = new Game()
game.start()

function round(float, digits) {
    return Math.round(float * 10 ** digits) / 10 ** digits // no parenthesis needed for divisor because exponentiation operator has higher precedence than division operator
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
    // https://www.w3schools.com/js/js_precedence.asp

    // or

    return +float.toFixed(digits)
}
