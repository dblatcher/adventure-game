
// to do - modularise this
export default function resetObject() {
	var keyList = Object.keys(this.initialState);
	var namedProps = false;
	if (arguments.length) { namedProps = [...arguments] }
	keyList.forEach( (propName) => {
		if (namedProps && !namedProps.includes(propName)) {return}
		this[propName] = this.initialState[propName];
	});
	return this;
}
