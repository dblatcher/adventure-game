export default function makeChain(orders, execute, evaluate, that) {

    let results = []

    function doStep(n, resolve, reject) {
        const nextOrEnd = (result) => {
            results.push(result)
            let evaluation = evaluate.apply(that, [orders[n], result])
            if (evaluation === false) {
                resolve ({ finished:false, results:results, failedOrder:orders[n]});
                return;
            }
            if (n+1 >= orders.length ) { // last order
                resolve ({ finished:true, results:results});
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
            .then(nextOrEnd)
            .catch(logRejections)
        } else {
            execute.apply (that, [orders[n]])
            .then(nextOrEnd)
            .catch(logRejections)
        }
    }

    return new Promise(function (resolve, reject) {
     doStep (0, resolve, reject)
    })

}