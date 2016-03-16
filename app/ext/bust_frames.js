//
// Dashboard should not be allowed in frames on other sites
//
export default function bustFrames() {
  if (top.location !== location) {
    top.location.href = document.location.href;
  }
}
