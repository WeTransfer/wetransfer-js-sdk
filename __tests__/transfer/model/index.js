const { normalizeItem, normalizeTransfer } = require('../../../src/transfer/model');

describe('Transfer model', () => {
  describe('normalizeItem function', () => {
    let item = {};
    beforeEach(() => {
      item = {
        filename: 'filename.txt',
        filesize: 1024,
        content_identifier: 'file',
        local_identifier: 'filename.txt'
      };
    });

    it('should return a normalized file item', () => {
      const file = normalizeItem(item);
      expect(file).toEqual(item);
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, item, { path: '/path/to/file.txt' });
      const file = normalizeItem(extraProps);
      expect(file).toEqual(item);
    });

    it('should add default values', () => {
      const file = normalizeItem({});
      expect(file).toEqual({
        filename: '',
        filesize: 0,
        content_identifier: '',
        local_identifier: ''
      });
    });
  });

  describe('normalizeTransfer function', () => {
    let transfer = {};
    beforeEach(() => {
      transfer = {
        name: 'WeTransfer rocks',
        description: null
      };
    });

    it('should return a normalized transfer', () => {
      const normalized = normalizeTransfer(transfer);
      expect(normalized).toEqual(transfer);
    });

    it('should remove extra properties', () => {
      const extraProps = Object.assign({}, transfer, { date: new Date() });
      const normalized = normalizeTransfer(extraProps);
      expect(normalized).toEqual(transfer);
    });

    it('add default values', () => {
      const normalized = normalizeTransfer({});
      expect(normalized).toEqual({
        name: '',
        description: null
      });
    });
  });
});
