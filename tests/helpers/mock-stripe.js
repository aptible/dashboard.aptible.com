var oldStripe;

export var mockStripe = {
  card: {
    createToken: function(options, fn) {
      setTimeout(function(){
        fn(404, {});
      }, 2);
    }
  }
};

export function stubStripe(){
  oldStripe = window.Stripe;
  window.Stripe = mockStripe;
}

export function teardownStripe(){
  window.Stripe = oldStripe;
}
