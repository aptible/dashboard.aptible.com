let history = [];
import Title from '../../utils/title-route-extensions';

let originalReplace;

export default {
  setup(){
    originalReplace = Title.replace;
    Title.replace = (title) => history.push(title);
  },
  teardown(){
    Title.replace = originalReplace;
    history = [];
  },

  last(){
    return history[ history.length - 1 ];
  }
};
