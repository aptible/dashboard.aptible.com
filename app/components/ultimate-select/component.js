import Ember from 'ember';

Ember.Handlebars.helper('getItemByPropertyName', getItemByPropertyName);
Ember.Handlebars.helper('shouldBeSelected', shouldBeSelected);

function getItemByPropertyName(item, propertyName) {
  if(item && propertyName) {
    if(item.get) {
      return item.get(propertyName);
    }

    return item[propertyName];
  }

  return item;
}

function shouldBeSelected(selected, item, itemKey) {
  if(!selected) {
    return false;
  }

  if(itemKey) {
    if(item[itemKey] && selected[itemKey]) {
      return item[itemKey] === selected[itemKey];
    }

    if(item.get && selected.get) {
      return item.get(itemKey) === selected.get(itemKey);
    }
  }

  return item === selected;
}

export default Ember.Component.extend({
  initializeSelect: function() {
    let autofocus = this.get('autofocus');
    if(autofocus) {
      this.$('select').focus();
    }
  }.on('didInsertElement'),

  actions: {
    update: function() {
      const initialValue = this.$('select')[0];
      const selectedIndex = initialValue.selectedIndex;
      const items = Ember.A(this.get('items'));
      const promptOffset = this.get('prompt') ? 1 : 0;
      const selected = items.objectAt(selectedIndex - promptOffset);

      if(selected) {
        this.attrs.update(selected);
      }
    }
  }
});
