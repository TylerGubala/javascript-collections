(function(exports){
    
    const Collection = function(){
        const collectionArray = new Array();
        const Factory = new Events.Factory();
        collectionArray.addEventListener = collectionArray.addListener = collectionArray.on = Factory.addEventListener;
        collectionArray.removeEventListener = collectionArray.removeListener = Factory.removeEventListener;
        return new Proxy(collectionArray, {
            set: function(target, property, value, reciever){
                const oldValue = target[property];
                target[property] = value;
                target.dispatchEvent('set', {detail: {target: target, property: property, oldValue: oldValue, newValue: value, value: target[property]}});
                if (oldValue === value){
                    return true;
                }
                target.dispatchEvent('change', {detail: {target: target, property: property, oldValue: oldValue, newValue: value, value: target[property]}});
                return true;
            }
        });
    }
    exports.Collection = Collection;

})(typeof exports === 'undefined'? this['Collections']={}: exports);