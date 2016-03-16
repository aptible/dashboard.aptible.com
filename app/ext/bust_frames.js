import config from '../config/environment';

export default function bustFrames() {
  if (top.location !== location) {
    top.location.href = document.location.href;
  }
}
