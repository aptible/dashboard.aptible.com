//
// Dashboard should not be allowed in frames on other sites
//
// Preferred method to address this would be setting an X-Frame-Options header,
// but this is not currently supported by S3
// https://forums.aws.amazon.com/thread.jspa?threadID=149569
//
export default function bustFrames() {
  if (top.location !== location) {
    top.location.href = document.location.href;
  }
}
