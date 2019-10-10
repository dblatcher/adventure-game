export default function makeChain(orders, execute, that) {

    function doStep(n, resolve, reject) {

        execute.apply (that, [orders[n]])
        .then(() => {
            if (n+1 >= orders.length) {
                resolve (true);
                return;
            }
            doStep (n+1, resolve, reject)
        })
        .catch((e) => {
            console.warn('chain failure',e);
            reject (e)
        })

    }

    return new Promise(function (resolve, reject) {
     doStep (0, resolve, reject)
    })

}