(function(exports){
    (typeof Set.prototype.includes === "undefined"? Set.prototype.includes = Set.prototype.has: null);
    (typeof Array.prototype.remove === "undefined"? Array.prototype.remove = function(){
        for (let argument of arguments){
            while (this.includes(argument)){
                this.splice(this.indexOf(argument), 1);
            }
        }
    }: null)
    class ArrayCollection extends Array{
        constructor(members=[]){
            super(...members);

            const Factory = new Events.Factory();

            this.addEventListeners = this.addListeners = this.on = Factory.addEventListeners;
            this.removeEventListeners = this.removeListeners = Factory.removeListeners;
            this.once = Factory.once;
            this.dispatchEvent = Factory.dispatchEvent;

            this.add = this.push;
        }
        get first(){
            return this[0];
        }
        get last(){
            return this[this.length - 1];
        }
        clear(){
            const oldMembers = new Array(...this);
            this.length = 0;
            this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: [], addedMembers: [], removedMembers: oldMembers}});
        }
        copyWithin(){
            if (arguments[0] >= this.length){
                // nothing is copied
            }
            else{
                const oldMembers = new Array(...this);
                super.copyWithin(...arguments);
                this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: new Array(...this)}});
            }
        }
        fill(){
            const oldMembers = new Array(...this);
            super.fill(...arguments);
            this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: new Array(...this)}});
        }
        push(){
            const oldMembers = new Array(...this);
            const addedMembers = new Array(...arguments);
            super.push(...arguments);
            this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: new Array(...this), addedMembers: addedMembers, removedMembers: []}})
        }
        pop(){
            const oldMembers = new Array(...this);
            const removedMember = super.pop();
            this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: new Array(...this), addedMembers: [], removedMembers: [removedMember]}});
            return removedMember;
        }
        remove(){
            const oldMembers = new Array(...this);
            const removedMembers = [];
            for (let argument of arguments){
                if (this.includes(argument)){
                    removedMembers.push(argument);
                    super.remove(argument);
                }
            }
            if (removedMembers.length > 0){
                this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: new Array(...this), addedMembers: [], removedMembers: removedMembers}})
            }
        }
        update(){
            const oldMembers = new Array(...this);
            var addedMembers = [];
            for (let argument of arguments){
                if (!(typeof argument[Symbol.iterator] === "function")){
                    throw new TypeError('Arguments of update should be iterables');
                }
                else{
                    for (let subArg of argument){
                        super.push(subArg);
                        addedMembers.push(subArg);
                    }
                }
            }
            if (addedMembers.length > 0){
                this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: new Array(...this), addedMembers: addedMembers, removedMembers: []}});
            }
        }
        intersection_update(){
            const oldMembers = new Array(...this);
            const removedMembers = [];
            for (let member of this){
                for(let argument of arguments){
                    if (!(argument.includes(member))){
                        removedMembers.push(member);
                        super.splice(this.indexOf(member), 1);
                    }
                }
            }
            this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: new Array(...this), addedMembers: [], removedMembers: removedMembers}})
        }
        difference_update(){
            const oldMembers = new Array(...this);
            const removedMembers = [];
            for (let argument of arguments){
                if (!(typeof argument[Symbol.iterator] === "function")){
                    throw new TypeError("Arguments of difference update should be iterators.");
                }
                else{
                    for (let subArg of argument){
                        if (this.includes(subArg)){
                            removedMembers.push(subArg);
                            super.splice(this.indexOf(subArg), 1);
                        }
                    }
                }
            }
            this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: new Array(...this), addedMembers: [], removedMembers: removedMembers}})
        }
        symmetric_difference_update(){
            const oldMembers = new Array(...this);
            const addedMembers = [];
            const removedMembers = [];
            for (let member in this){
                for (let argument of arguments){
                    while (argument.includes(member)){
                        argument.remove(member)
                        this.remove(member);
                        removedMembers.push(member);
                    }
                }
            }
            for (let argument of arguments){
                for (let subArg of argument){
                    super.push(subArg);
                    addedMembers.push(subArg);
                }
            }
            this.dispatchEvent('change', {details: {oldMembers: oldMembers, members: new Array(...this), addedMembers: addedMembers, removedMembers: removedMembers}})
        }
        is_sub(){
            for (let member of this){
                for (let argument of arguments){
                    if (!(argument.includes(member))) return false;
                }
            }
            return arguments.length > 0;
        }
        is_super(){
            for (let argument of arguments){
                for (let subArg of argument){
                    if (!(this.includes(subArg))) return false;
                }
            }
            return arguments.length > 0;
        }
        is_disjoint(){
            for (let member of this){
                for (let argument of arguments){
                    if (argument.includes(member)) return false;
                }
            }
            return arguments.length > 0;
        }
    }

    class SetCollection{
        constructor(members = new Set()){
            if (not(typeof members === "set")){
                throw new TypeError("Members must be type of set");
                delete this;
                return;
            }
            this._members = members;

            const Factory = new Events.Factory();
            this.addEventListeners = this.addListeners = this.on = Factory.addEventListeners;
            this.removeEventListeners = this.removeListeners = Factory.removeEventListeners;
            this.once = Factory.once;
            this.dispatchEvent = this.emit = Factory.dispatchEvent;
        }
        set members(members){
            const oldMembers = 
            this._members = members;
            this.dispatchEvent('set', {details: {members: this._members}});
        }
        get members(){
            this.dispatchEvent('get', {details: {members: this._members}})
            return this._members;
        }
        clear(){
            const oldMembers = removedMembers = this._members;
            this._members = [];
            this.dispatchEvent('remove', {details: {removedMembers: removedMembers, oldMembers: oldMembers, members: this._members}});
        }
        get first(){
            return this._members[0];
        }
        get last(){
            return this._members[this._members.length - 1];
        }
        get mid(){
            return this._members[Math.floor(((this._members.length - 1) / 2))];
        }
    }

    exports.Collection = Collection;

})(typeof exports === 'undefined'? this['Collections']={}: exports);