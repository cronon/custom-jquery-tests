class jQueryLib {

    constructor(selector) {
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
            this.each((index, element) => {element.className = element.className+' '+newClass(index, element.className)} );
            return this;
        }
        newClass.split(' ').map((cl) => { this.each((index, element) => {element.classList.add(cl)}) } );
        return this;
    }

    append (newNode) {
        if (newNode instanceof Node) {
            this.each((index, element) => { element.appendChild(newNode.cloneNode(true)) } );
        } else {
            this.each((index, element) => { element.innerHTML = element.innerHTML + newNode} );
        }
        return this;
    }

    html (newContent) {
        if (newContent === undefined) return this[0].innerHTML;
        this.each((index, element) => { element.innerHTML = newContent} );
        return this;
    }

    attr (...args) {
        if (args.length === 1) {
            if (args[0] instanceof Object) {
                for (let key in args[0]) {
                    this.each((index, element) => { element.setAttribute(key, args[0][key]) } );
                }
                return this;
            }
            return this[0].getAttribute(args[0]);
        }
        this.each((index, element) => { element.setAttribute(...args) } );
        return this;
    }

    children (selector) {
        if (selector === undefined) {
            return window.$(this[0].children);
        }
        return window.$(this[0].querySelectorAll(selector));
    }

    css (...args) {
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
        }
        if (args.length === 1) {
            if (args[0] instanceof Object) {
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
        if (args.length === 2) {
            this.each((index, element) => {element.addEventListener(...args)} );
            return this;
        }
        if (args.length === 3) {
            function evoke(event) {
                const children = event.currentTarget.querySelectorAll(args[1]);
                for (let i = 0; i < children.length; i++) {
                    if (children[i] === event.target) args[2]();
                }
            }
            this.each((index, element) => {element.addEventListener(args[0], evoke)} );
            return this;
        }
    }

    one (...args) {
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
