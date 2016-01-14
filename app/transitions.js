import { SETUP_STEPS } from 'sheriff/models/organization-profile';

export function buildSPDTransition(context, from, to) {
  context.transition(
    context.fromRoute(from),
    context.toRoute(to),
    context.use('toLeft'),
    context.reverse('toRight')
  );
}

export default function() {
  SETUP_STEPS.forEach((current, index) => {
    if(index < SETUP_STEPS.length) {
      let next = SETUP_STEPS[index + 1];
      buildSPDTransition(this, `setup.${current}`, `setup.${next}`);
    }
  });

  this.transition(
    this.inHelper('liquid-modal'),
    this.use('fade')
  );

  this.transition(
    this.hasClass('fadeIn'),
    this.use('fade')
  );
}