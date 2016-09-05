//import { SETUP_STEPS } from 'diesel/models/organization-profile';

export function buildSPDTransition(context, from, to) {
  context.transition(
    context.fromRoute(from),
    context.toRoute(to),
    context.use('clean', 'toLeft', {duration: 500})
  );

  context.transition(
    context.fromRoute(to),
    context.toRoute(from),
    context.use('clean', 'toRight', {duration: 500})
  );
}

export default function() {
  this.transition(
    this.outletName('sidebar'),
  this.use('toLeft')
  );
  // Sadly, these transitions are causing massive performance issues when exiting
  // the security controls step.  I suspect there is a rendering issue with
  // ember-json-schema-views that is exacerbated by ember-liquid fire.

  // See https://github.com/ember-animation/liquid-fire/issues/441

  // SETUP_STEPS.forEach((current, index) => {
  //   if(index < SETUP_STEPS.length) {
  //     let next = SETUP_STEPS[index + 1];
  //     buildSPDTransition(this, `setup.${current}`, `setup.${next}`);
  //   }
  // });

  // this.transition(
  //   this.fromRoute('setup.data-environments'),
  //   this.toRoute('setup.security-controls.index'),
  //   this.use('toLeft'),
  //   this.reverse('toRight')
  // );

  // this.transition(
  //   this.fromRoute('setup.security-controls.index'),
  //   this.toRoute('setup.security-controls.show'),
  //   this.use('toLeft'),
  //   this.reverse('toRight')
  // );

  // this.transition(
  //   this.fromRoute('setup.security-controls.show'),
  //   this.toRoute('setup.finish'),
  //   this.use('toLeft'),
  //   this.reverse('toRight')
  // );

  // this.transition(
  //   this.fromRoute('settings.security-controls.index'),
  //   this.toRoute('settings.security-controls.show'),
  //   this.use('toLeft'),
  //   this.reverse('toRight')
  // );

  // this.transition(
  //   this.fromRoute('settings.security-controls.show'),
  //   this.toRoute('settings.finish'),
  //   this.use('toLeft'),
  //   this.reverse('toRight')
  // );

  this.transition(
    this.inHelper('liquid-modal'),
    this.use('fade')
  );

  this.transition(
    this.hasClass('fadeIn'),
    this.use('fade')
  );
}
