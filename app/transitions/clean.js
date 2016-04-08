// https://github.com/ember-animation/liquid-fire/issues/310
// This is just a proxy transition that cleans up memory leaks after transition.
export default function(animationName, ...args) {
  animationName = animationName || 'toLeft';
  return this.lookup(animationName)
    .apply(this, args)
    .then(() => {
      this.oldElement.removeData();
    });
}
