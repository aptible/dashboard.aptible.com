import GridironAdapter from './gridiron';

export default GridironAdapter.extend({
  updateRecord() {
    // Attestations are append only.  Overloading updateRecord with createRecord
    // forces attestation updates to POST rather than PUT
    return this.createRecord(...arguments);
  }
});
