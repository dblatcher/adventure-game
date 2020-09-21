export default function (ident) {
  if (ident) {
    if (ident == 'pc') { ident = this.pcId; }
    return this.thingRefs[ident]
  }

  return Object.assign({ pc: this.thingRefs[this.pcId] }, this.thingRefs)
}