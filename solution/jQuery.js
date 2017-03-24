class jQueryLib {
    // consider adding of jsdoc for each method
    constructor(selector) {
        // change to `typeof selector == string` and swap actions
        if (selector instanceof NodeList) {
            for (let i = 0; i < selector.length; i++) {
                this[i] = selector[i];
            }
            this.length = selector.length;
        } else {
            const a = document.querySelectorAll(selector);
            for (let i = 0; i < a.length; i++) {
                this[i] = a[i];
            }
            this.length = a.length;
        }
    }

    each (func) {
        for (let i = 0; i < this.length; i++) {
            if (func.call(this[i], i, this[i]) === false) return this;
        }
        return this;
    }

    addClass (newClass) {
        if (typeof newClass === 'function') {
            // use classList too
            this.each((index, element) => {element.className = element.className+' '+newClass(index, element.className)} );
            return this;
        }
        // this.each(_, el => el.className += newClass) 
        newClass.split(' ').map((cl) => { this.each((index, element) => {element.classList.add(cl)}) } );
        return this;
    }

    append (newNode) {
        if (newNode instanceof Node) {
            this.each((index, element) => { element.appendChild(newNode.cloneNode(true)) } );
        } else {
            // Element.insertAdjacentHTML('beforeend', newNode) would be better
            this.each((index, element) => { element.innerHTML = element.innerHTML + newNode} );
        }
        return this;
    }

    html (newContent) {
        // if arguments.length == 0
        // also, add else clause
        if (newContent === undefined) return this[0].innerHTML;
        this.each((index, element) => { element.innerHTML = newContent} );
        return this;
    }

    attr (...args) {
        if (args.length === 1) {
            if (args[0] instanceof Object) {
                // use Object.keys(args[0]).forEach
                for (let key in args[0]) {
                    this.each((index, element) => { element.setAttribute(key, args[0][key]) } );
                }
                return this;
            }
            // please use else-clauses
            return this[0].getAttribute(args[0]);
        }
        // please use else-clauses
        this.each((index, element) => { element.setAttribute(...args) } );
        return this;
    }

    children (selector) {
        if (selector === undefined) {
            // why window.$?
            return window.$(this[0].children);
        }
        return window.$(this[0].querySelectorAll(selector));
    }

    css (...args) { // same as attrs
        if (args.length === 1) {
            if (args[0] instanceof Object) {
                for (let key in args[0]) {
                    this.each((index, element) => {element.style[key] = args[0][key]} );
                }
                return this;
            }
            return this[0].style[args[0]];
        }
        this.each((index, element) => {element.style[args[0]] = args[1]} );
        return this;
    }

    data (...args) {
        if (args.length === 0) {
            return this[0].dataset;
        } // else if
        if (args.length === 1) {
            if (args[0] instanceof Object) { // set args[0] to meaningful const
                for (let key in args[0]) {
                    this.each((index, element) => {element.dataset[key] = args[0][key]} );
                }
                return this;
            } else {
                return this[0].dataset[args[0]];
            }
        } else {
            this.each((index, element) => {element.dataset[args[0]] = args[1]} );
            return this;
        }
    }

    on (...args) {
        // consider throwing error if args.length < 1
        if (args.length === 2) {
            this.each((index, element) => {element.addEventListener(...args)} );
            return this;
        } // if else
        if (args.length === 3) {
            function evoke(event) {
                // set args entries to consts with meaningful names
                const children = event.currentTarget.querySelectorAll(args[1]);
                for (let i = 0; i < children.length; i++) { // Array.of(children).forEach
                    if (children[i] === event.target) args[2]();
                }
            }
            this.each((index, element) => {element.addEventListener(args[0], evoke)} );
            return this;
        }
    }

    one (...args) { // why use args?
        function once(event) {
            args[1]();
            event.target.removeEventListener(args[0], once);
        }
        this.each((index, element) => {element.addEventListener(args[0], once)} );
        return this;
    }

}

window.$ = (selector) => new jQueryLib(selector);
window.jQuery = (selector) => new jQueryLib(selector);
