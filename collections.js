(function(exports){

    class ArrayCollection extends Privatizors.Privatizor{
        constructor(members=[]){
            super(members, )
        }
    }

    class SetCollection{
        constructor(members=[]){
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
        addMembers(members){
            const oldMembers = this._members;
            var newMembers = []
            members.forEach(function(pushMember){
                if (this._members.indexOf(pushMember) === -1){
                    this._members.push(pushMember);
                    newMembers.push(pushMember);
                }
            }, this);
            this.dispatchEvent('add', {details: {newMembers: newMembers, oldMembers: oldMembers, members: this._members}});
        }
        removeMembers(members){
            const oldMembers = this._members;
            var removedMembers = [];
            members.forEach(function(spliceMember){
                var index = this._members.indexOf(spliceMember);
                if (index != -1){
                    this._members.splice(index, 1);
                    removedMembers.push(spliceMember);
                }
            }, this);
            this.dispatchEvent('remove', {details: {removedMembers: removedMembers, oldMembers: oldMembers, members: this._members}});
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