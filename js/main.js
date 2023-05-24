
/********/
/* Game */
/********/

class Game {

    // public class field initialized before constructor is called (available with this.name later on)
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
        this.settings.lemmingsMax = 10
        this.settings.speedFactorWalk = 0.25
        this.settings.speedFactorFall = 1.5
        this.settings.scoreInMin = 8 // 80 %
        this.settings.disableDebugMode = true

    }

    /******************/
    /* Game > methods */
    /******************/

    testParserCommentBlockCollapseExpand() {
        /* 
        // a
        // b
        // c
        */

        // abc
        // abc
        // abc

        // 0;           // numeric literal: simplest valid statement but will make the comments after as a comment block that can be collapsed/expanded
        // 0 + 0;       // operation: same
        // let zero;    // declaration: simplest valid statement that will break comments into 2 blocks that can be collapsed/expanded (seems like the parser goes backwards for splitting comments)
        /* */           // ok

        // abc
        // abc
        // abc

        /* 
        // a
        // b
        // c
        */

        /* 
        // a
        // b
        // c
        */
    }

    start() {
        if (this.settings.disableDebugMode === true) this.addDomElementDisableDebugMode()
        this.boardDomElement = document.getElementById("board")
        // this.player = new Player()
        this.floorsArr.push(this.createGround())
        this.exit = new Exit()
        this.floorsArr.push(this.createFloor())
        this.attachEventListeners()

        // 
        // EXAMPLE 1
        // this.intervalId = setInterval(() => {
        //     if (this.lemmingsArr.length < this.settings.lemmingsMax)
        //         this.lemmingsArr.push(this.spawnLemming())
        //     else clearInterval(this.intervalId)
        // }, 1000)
        // requires another property to store the intervalId
        // 
        // EXAMPLE 2
        // setInterval(() => {
        //     if (this.lemmingsArr.length < this.settings.lemmingsMax)
        //         this.lemmingsArr.push(this.spawnLemming())
        // }, 1000)
        // or don't clear the interval, the callback function will continue to the called but will do nothing...
        // this also makes closures that close over (hold/keep/retain) the variables returned by the properties of this

        /* */
        // # {START} NOTES: CLOSURES
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
        // # Lexical scoping
        // Lexical scoping describes how a parser resolves variable names when functions are nested. 
        // The word lexical refers to the fact that lexical scoping uses the location where a variable is declared within the source code to determine where that variable is available. 
        // Nested functions have access to variables declared in their outer scope.
        // In this case, the scope is called a function scope, because the variable is accessible and only accessible within the function body where it's declared.
        // Traditionally (before ES6), JavaScript only had two kinds of scopes: function scope and global scope. 
        // Variables declared with var are either function-scoped or global-scoped, depending on whether they are declared within a function or outside a function. 
        // This can be tricky, because blocks with curly braces do not create scopes
        // In ES6, JavaScript introduced the let and const declarations, which, among other things like temporal dead zones, allow you to create block-scoped variables.
        // # Closure
        // A closure is the combination of a function and the lexical environment within which that function was declared. 
        // This environment consists of any local variables that were in-scope at the time the closure was created
        // It needs a reference to an instance of an inner/bundled/enclosed function created when its outer function is run. 
        // This instance maintains a reference to its lexical environment, within which the variable name exists.
        // # Emulating private methods with closures
        // Languages such as Java allow you to declare methods as private, meaning that they can be called only by other methods in the same class
        // JavaScript, prior to classes, didn't have a native way of declaring private methods, but it was possible to emulate private methods using closures. 
        // Private methods aren't just useful for restricting access to code. They also provide a powerful way of managing your global namespace.
        // The following code illustrates how to use closures to define public functions that can access private functions and variables. Note that these closures follow the Module Design Pattern.
        // const counter = (function () {
        //     let privateCounter = 0;
        //     function changeBy(val) {
        //         privateCounter += val;
        //     }
        //     return {
        //         increment() {
        //             changeBy(1);
        //         },
        //         decrement() {
        //             changeBy(-1);
        //         },
        //         value() {
        //             return privateCounter;
        //         },
        //     };
        // })();
        // console.log(counter.value()); // 0
        // counter.increment();
        // counter.increment();
        // console.log(counter.value()); // 2
        // counter.decrement();
        // console.log(counter.value()); // 1
        // In previous examples, each closure had its own lexical environment. Here though, there is a single lexical environment that is shared by the three functions: counter.increment, counter.decrement, and counter.value.
        // The shared lexical environment is created in the body of an anonymous function, which is executed as soon as it has been defined (also known as an IIFE). 
        // The lexical environment contains two private items: a variable called privateCounter, and a function called changeBy. 
        // You can't access either of these private members from outside the anonymous function. Instead, you can access them using the three public functions that are returned from the anonymous wrapper.
        // Those three public functions form closures that share the same lexical environment. Thanks to JavaScript's lexical scoping, they each have access to the privateCounter variable and the changeBy function.
        // Notice how the two counters maintain their independence from one another. Each closure references a different version of the privateCounter variable through its own closure. 
        // Each time one of the counters is called, its lexical environment changes by changing the value of this variable. Changes to the variable value in one closure don't affect the value in the other closure.
        // # Closure scope chain
        // Every closure has three scopes:
        // - Local scope (Own scope)
        // - Enclosing scope (can be block, function, or module scope) *
        // - Global scope
        // * In the case where the outer function is itself a nested function, access to the outer function's scope includes the enclosing scope of the outer function—effectively creating a chain of function scopes.
        // Example with anonymous functions:
        // global scope
        // const e = 10;
        // function sum(a) {
        //   return function (b) {
        //     return function (c) {
        //       // outer functions scope
        //       return function (d) {
        //         // local scope
        //         return a + b + c + d + e;
        //       };
        //     };
        //   };
        // }
        // console.log(sum(1)(2)(3)(4)); // 20
        // In the example above, there's a series of nested functions, all of which have access to the outer functions' scope. In this context, we can say that closures have access to all outer function scopes.
        // Closures can capture variables in block scopes and module scopes as well. For example, the following creates a closure over the block-scoped variable y:
        // function outer() {
        //   const x = 5;
        //   if (Math.random() > 0.5) {
        //     const y = 6;
        //     return () => console.log(x, y);
        //   }
        // }
        // outer()(); // returns 5 6 or not a function
        // # Creating closures in loops: A common mistake
        // https://stackoverflow.com/questions/31285911/why-let-and-var-bindings-behave-differently-using-settimeout-function
        // (function timer() {
        //     for (var i=0; i<=5; i++) {
        //         setTimeout(function clog() {console.log(i)}, i*1000);
        //     }
        // })();
        // // returns 6 times 6
        // (function timer() {
        //     for (let i=0; i<=5; i++) {
        //         setTimeout(function clog() {console.log(i)}, i*1000);
        //     }
        // })();
        // // returns 0, 1, 2, 3, 4, 5, 6
        // With var you have a function scope, and only one shared binding for all of your loop iterations - i.e. the i in every setTimeout callback means the same variable that finally is equal to 6 after the loop iteration ends.
        // With let you have a block scope and when used in the for loop you get a new binding for each iteration - i.e. the i in every setTimeout callback means a different variable, each of which has a different value: the first one is 0, the next one is 1 etc.
        // So this:
        // (function timer() {
        //     for (let i = 0; i <= 5; i++) {
        //         setTimeout(function clog() { console.log(i); }, i * 1000);
        //     }
        // })();
        // is equivalent to this using only var:
        // (function timer() {
        //     for (var j = 0; j <= 5; j++) {
        //         (function () {
        //             var i = j;
        //             setTimeout(function clog() { console.log(i); }, i * 1000);
        //         }());
        //     }
        // })();
        // using immediately invoked function expression to use function scope in a similar way as the block scope works in the example with let.
        // It could be written shorter without using the j name, but perhaps it would not be as clear:
        // (function timer() {
        //     for (var i = 0; i <= 5; i++) {
        //         (function (i) {
        //             setTimeout(function clog() { console.log(i); }, i * 1000);
        //         }(i));
        //     }
        // })();
        // And even shorter with arrow functions:
        // (() => {
        //     for (var i = 0; i <= 5; i++) {
        //         (i => setTimeout(() => console.log(i), i * 1000))(i);
        //     }
        // })();
        // (But if you can use arrow functions, there's no reason to use var.)
        // OTHER EXAMPLE "EMULATING PRIVATE METHODS" (as called by MDN, but I would rather says private variable, because they are actually **public** functions that can access private functions and variables...)
        // function createPrivateVarMethods(initialValue) {
        //     let privateVar = initialValue;
        //     function getPrivateVar() {
        //       return privateVar;
        //     }
        //     function setPrivateVar(newValue) {
        //       return privateVar = newValue;
        //     }
        //     return {
        //       getPrivateVar,
        //       setPrivateVar
        //     };
        //   }
        //   const {getPrivateVar, setPrivateVar} = createPrivateVarMethods(1);
        //   console.log(getPrivateVar()); // 1
        //   console.log(setPrivateVar(2)); // 2
        //   console.log(getPrivateVar(1)); // 2
        // # {END} NOTES: CLOSURES
        /* */

        /*
        // EXAMPLE 0
        // let secondsEllapsed = 0
        // setInterval(() => {
        //     console.log(`seconds ellapsed since game start: ${++secondsEllapsed} sec`)
        // }, 1000)
        // setTimeout/setInterval create closures over the variables that are used in their callback functions and that are declared outside of their callback functions scope
        // the closure is formed by the callback function and the variables it references (setInterval creates multiple closures each storing different lexical environment in this case, while setTimeout only one (if no recursion))
        // the callback function closes over the variables, it keep a reference to the outer variables even if out of their scope (aftert the outer scope has finished executing)
        // setTimeout/setInterval also maintain references to the callback functions and their associated closures
        //
        // EXAMPLE 3
        // using recursion (the function must be named in this case, so no arrow function or anonymous function)
        // in function methods, this refers to the object that is on the left of the dot, at the time of invocation. (this.methodName()
        // in free function invocations, this refers to the global object Window (this === window) (EXCEPT IF INSIDE A CLASS METHOD OR AN IIFE ANYWHERE IN CLASS (ANONYMOUS OR NOT)), BINDING IS LOST, this === undefined, SEE BELOW)
        // https://stackoverflow.com/questions/4011793/this-is-undefined-in-javascript-class-methods
        //      happens because a function has been used as a high order function (passed as an argument) and then the scope of this got lost. In such cases, I would recommend passing such function bound to this:
        //      this.myFunction.bind(this);
        // so in the example below, in the callback function argument of the setTimeout call, the this value changes, but we can bind it to a specific value to override the meaning of this, and we need to bind the this context of each function down the chain of call to the instance of the class
        // function recursiveFunctionTimeout() {
        //     setTimeout(function callback() {
        //         if (this.lemmingsArr.length < this.settings.lemmingsMax) {
        //             this.lemmingsArr.push(this.spawnLemming())
        //             recursiveFunctionTimeout.bind(this)() 
        //         }
        //     }.bind(this), 1000) 
        // }
        // recursiveFunctionTimeout.bind(this)() 
        //
        // EXAMPLE 4
        // /!\ there is also a global variable window.self! (which is refered by a standalone self in another self variable is not declared down in the scope chain...)
        // const self = this; // semi-colon is required before IIFE otherwise error "this is not a function"...
        // (function recursiveFunctionTimeout() {
        //     // at this point: this === undefined !== window, but self is available in scope chain
        //     setTimeout(() => {
        //         // at this point: this === undefined !== window, but self is available in scope chain
        //         if (self.lemmingsArr.length < self.settings.lemmingsMax) {
        //             self.lemmingsArr.push(self.spawnLemming())
        //             recursiveFunctionTimeout()
        //         }
        //     }, 1000) // in ()=> arrow function/method, this takes its value from the scope in which it is created.
        // })() // IIFE (rules does not change for the value of this, IIFE or not)
        //
        // EXAMPLE 5
        // this.recursiveMethodsetTimeout()
        //
        // EXAMPLE 7
        // this.recursiveFunctionExpressionsetTimeout()
        //
        // EXAMPLE 8
        // function recursiveMethodsetTimeout2() {
        //     // setTimeout(callback = () => { // this function expression syntax to assign an anonymous arrow function to a variable exists (assignment expression), but not valid for the setTimeout callback argument (named functionRef in MDN)
        //     // (assignment expression is valid for the initialization expression of a for loop for example...)            
        //     setTimeout(function callback() { 
        //         if (this.lemmingsArr.length < this.settings.lemmingsMax) {
        //             this.lemmingsArr.push(this.spawnLemming())
        //             recursiveMethodsetTimeout2.call(this)
        //         }
        //     // }.call(this), 1000) // no because this bypass the delay, and make the call immediately (no further call scheduled after the delay)
        //     }.bind(this), 1000)
        // }
        // recursiveMethodsetTimeout2.call(this)
        // (note: call() can also be used with built-in function/methods: setTimeout.call())
        //
        // EXAMPLE 9
        // forEach allows to pass and explicitly attach the this keyword to its anonymous function argument, via the thisArg argument
        // (There's no option to pass a thisArg to setTimeout as there is in Array methods such as forEach() and reduce())
        //
        // EXAMPLE 10
        // recursion with anonymous function (but still requires a variable for the function expression...)
        // const self = this
        // const recursiveFunctionExpressionsetTimeout = function() { // not a method this time <> EXAMPLE 7
        //     setTimeout(() => {
        //         if (self.lemmingsArr.length < self.settings.lemmingsMax) {
        //             self.lemmingsArr.push(self.spawnLemming())
        //             recursiveFunctionExpressionsetTimeout()
        //         }
        //     }, 1000)
        // }
        // recursiveFunctionExpressionsetTimeout()
        */

        function makeClosureFn() {
            let closedOverIntervalId = null
            function innerFn() {
                closedOverIntervalId = setInterval(() => {
                    if (this.idLastSpawnLemming < this.settings.lemmingsMax)
                        this.lemmingsArr.push(this.spawnLemming())
                    else clearInterval(closedOverIntervalId)
                }, 1000)
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
        // update spawned counter in scores
        this.boardDomElement.querySelector("div#scores p span#spawned").innerText = this.idLastSpawnLemming
        // increment out counter in scores (NOT STORED, SO PLAYER CAN MODIFY THE HTML, BUT IT'S NOT CHEATING BECAUSE THIS VALUE WON'T HELP TO WIN!...)
        let out = this.boardDomElement.querySelector("div#scores p span#out").innerText // cannot be const because of ++out otherwise error assignment to constant variable
        this.boardDomElement.querySelector("div#scores p span#out").innerText = ++out
        return lemming
    }

    isEnd() {
        return (this.idLastSpawnLemming === this.settings.lemmingsMax && this.lemmingsArr.length === 0)
    }

    end() {
        // if (Math.floor(this.idsLemmingsExitArr.length / this.settings.lemmingsMax * 100) >= (this.settings.scoreInMin / this.settings.lemmingsMax * 100))
        if (this.idsLemmingsExitArr.length >= this.settings.scoreInMin)
            alertTimeout("a job well done!")
        else location.href = './gameover.html';
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
            // console.log(eventClick.currentTarget); // document
            // console.log(eventClick.target); // div or img
            
            // if (eventClick.currentTarget.tagName === "div")
            //     const elementDiv = eventClick.currentTarget // not valid: 'const' declarations can only be declared inside a block
            // else if (eventClick.currentTarget.tagName === "img")
            //     const elementDiv = eventClick.currentTarget.parentNode // not valid: 'const' declarations can only be declared inside a block
            
            // if (eventClick.currentTarget.tagName === "div") {
            //     const elementDiv = eventClick.currentTarget
            // } else if (eventClick.currentTarget.tagName === "img") {
            //     const elementDiv = eventClick.currentTarget.parentNode
            // }

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
                    console.log("lemming has no skill when falling! maybe it will have an umbrella one day...")
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

    /******************/
    /* Floor > skills */
    /******************/

    break(breakPosStart, breakPosEnd) {
        if(breakPosStart > this.left && breakPosEnd < this.left + this.width) { // floorPart2 needed
            const floorPart2 = game.createFloor()
            game.floorsArr.push(floorPart2)
            floorPart2.left = breakPosEnd
            floorPart2.domElement.style.left = floorPart2.left + "%"
            floorPart2.width = this.left + this.width - breakPosEnd
            floorPart2.domElement.style.width = floorPart2.width + "%"
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
        // this simplify the calculation of the center of the exit (border width is included in height/width sizing dimensions)
        // default box-sizing: content-box;

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

    // DEBUG
    // game.lemmingsArr.filter(lemming => lemming.id === 1)[0].left
    // game.lemmingsArr.filter(lemming => lemming.id === 1)[0].domElement.style.left

    fall() {        
        this.state = 'fall'
        if (this.domElement.classList.length === 1) { // then new lemming
            this.domElement.classList.add('fall')
        }
        else this.domElement.classList.replace('walk', 'fall')
        const urlImage = "./images/lemming gifs v1/lemming-fall-anim.gif"
        this.domElement.innerHTML = `<img src="${urlImage}" alt="lemming-fall-anim.gif">`;
        this.intervalId = setInterval(() => {
        const floorBelow = this.willCollideFloor()
        const exitBelow = this.hasReachedExit()
        if (!floorBelow) {
            this.top += 1 * game.settings.speedFactorFall
            this.domElement.style.top = this.top + "%"
            if (exitBelow) { // will walk towards it after reaching the floor
                if (this.isRightOfExit())
                    this.direction = 'left'
                else this.direction = 'right'
            }
        } else {
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
        this.domElement.classList.replace('fall', 'walk')
        const urlImage = "./images/lemming gifs v1/lemming-walk-anim.gif"
        this.domElement.innerHTML = `<img src="${urlImage}" alt="lemming-walk-anim.gif">`;
        this.intervalId = setInterval(() => {
            const blockerFront = this.willCollideBlocker()
            const voidFront = this.willBeInVoid()
            const exitFront = this.willExit()
            if (!blockerFront && !voidFront && !exitFront) {  
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
        this.domElement.classList.replace('walk', 'block')
        const urlImage = "./images/lemming gifs v2/lemming-stop-anim.gif"
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
        clearInterval(this.intervalId)
        this.intervalId = null
        // this.intervalId = setTimeout(this.remove.bind(this), 2000) 
        // needs explicit binding, otherwise this context references window (free function invocation of a declared non-anonymous function), 
        // setTimeout is weird in this case, it should perform a method call, not a free function invocation, so no idea how it calls the callback function provided, maybe callbackName.bind(window)() by default?...
        this.intervalId = setTimeout(() => {
            const floorBelow = this.willCollideFloor()
            // if (floorBelow instanceof Floor) // a Ground instance returns true
            if (!(floorBelow instanceof Ground)) // to disable ground breaking
                floorBelow.break(this.left, this.left + this.width)
            this.remove() // ok, default binding to this context
        }, 2000) 
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
        // game.lemmingsArr.splice(game.lemmingsArr.indexOf(game.lemmingsArr.filter(lemming => lemming.id === this.id)[0]), 1)
        game.lemmingsArr.splice(game.lemmingsArr.indexOf(this), 1) // directly...
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
                if(spaceBelow / boardRect.height * 100 < 1 * game.settings.speedFactorFall && spaceBelow >= 0) { // 1 to anticipate other values for freefall or walk speed in game settings
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

    willBeInVoid() {
        const floorBelow = this.willCollideFloor()
        if (floorBelow) {
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
    }
    
    hasReachedExit() {
        if ((this.top + this.height) <= (100 - game.exit.bottom) && this.top >= (100 - (game.exit.bottom + game.exit.height)) // lemming must be entirely within exit vertical bounderies (border width included with box-sizing: border-box;)
            && (this.left + this.width) <= (game.exit.left + game.exit.width) && this.left >= game.exit.left // lemming must be entirely within exit horizontal bounderies (border width included with box-sizing: border-box;)
        ) return true
        else return false
    }

    willExit() {
        if ((this.top + this.height) <= (100 - game.exit.bottom) && this.top >= (100 - (game.exit.bottom + game.exit.height))) { // lemming must be entirely within exit vertical bounderies (border width included with box-sizing: border-box;)     
            if (this.direction === 'right') {
                const spaceFront = (game.exit.left + game.exit.width / 2) - (this.left + this.width / 2) // lemming must reach the center of exit
                if(spaceFront < 1 * game.settings.speedFactorWalk && spaceFront >= 0) {
                    return true
                }
            } else if (this.direction === 'left') {
                const spaceFront = (this.left + this.width / 2) - (game.exit.left + game.exit.width / 2) // lemming must reach the center of exit
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

}

/********/
/* main */
/********/

const game = new Game() // assignment to a variable of the instance created from a declared class (also possible to make instances from a class expression (anonymous or named), without declaring it)
game.start()

// window.alert("Welcome to Lemming's world!"); 
// when the modal dialog box appears, the page is still blank
// js is synchronous, as is DOM manipulation, but the rendering of changes in the DOM by the browser is no (illusion of an asynchronous DOM update)
// so when the modal dialog box is visible, browser cannot perform renderings tasks, but it resumes once user dismisses it 

function alertTimeout(text) {
    setTimeout(function() {
        window.alert(text);
    }, 100);
}
const rules = `
    Welcome to Lemming's world!
    
    Your goal is to have at least ${Math.floor(game.settings.scoreInMin / game.settings.lemmingsMax * 100)} % of lemmings **IN** the **EXIT** at the bottom.

    Click on them to activate their **skills**!

    Pssst...! You have all the time in the world, the game will finish only when there is no more lemmings **OUT**...
` 
// multi line strings is possible only with backticks (template literals)
// alertTimeout(rules); 
// FIX: if user is too long to dismiss the alert, lemmings are spawned simultaneously

// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation right before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
// Note: Your callback routine must itself call requestAnimationFrame() again if you want to animate another frame at the next repaint. requestAnimationFrame() is 1 shot.
function alertAfterBrowserRendering(text) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        window.alert(text);
      })
    });
  }
  alertAfterBrowserRendering(rules)

function round(float, digits) {
    return Math.round(float * 10 ** digits) / 10 ** digits // no parenthesis needed for divisor because exponentiation operator has higher precedence than division operator
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
    // https://www.w3schools.com/js/js_precedence.asp

    // or

    return +float.toFixed(digits)
}
