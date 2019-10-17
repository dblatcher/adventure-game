export default function makeChain(orders, execute, that, checkIfHalted=function(){}, confirmHalt=function(){}) {

    function doStep(n, resolve, reject) {
        const nextOrEnd = () => {
            let wasHalted = checkIfHalted()
            if (n+1 >= orders.length || wasHalted) {
                if (wasHalted) {confirmHalt(n)}
                resolve (true);
                return;
            }
            doStep (n+1, resolve, reject)
        }
        const logRejections = (e) => {
            console.error('chain failure',e);
            reject (e)
        }

        if (Array.isArray(orders[n]) ) {
            let promiseSubset = orders[n].map( function(order) {
                return execute.apply (that, [order])
            } )
            Promise.all(promiseSubset)
            .catch(logRejections)
            .finally(nextOrEnd)
        } else {
            execute.apply (that, [orders[n]])
            .catch(logRejections)
            .finally(nextOrEnd)
        }
    }

    return new Promise(function (resolve, reject) {
     doStep (0, resolve, reject)
    })

}