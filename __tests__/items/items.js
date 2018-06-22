const axios = require('axios');

const transferItems = require('../../src/items');
const request = require('../../src/request');
const WTError = require('../../src/error');

jest.mock('axios');

describe('Transfer module', () => {
  describe('Items', () => {
    describe('addItems method', () => {
      let items = [];
      let createdItems = [];

      beforeEach(() => {
        axios.mockImplementation(() => Promise.resolve({}));

        request.apiKey = 'secret-api-key';
        request.jwt = 'json-web-token';

        items = [
          {
            filename: 'item-01.txt',
            filesize: 1024,
            content_identifier: 'file',
            local_identifier: 'item-01.txt'
          }
        ];

        createdItems = [
          {
            id: 'random-hash',
            content_identifier: 'file',
            local_identifier: 'item-01.txt',
            meta: {
              multipart_parts: 2,
              multipart_upload_id: 'some.random-id--'
            },
            name: 'item-01.txt',
            size: 195906
          }
        ];
      });

      it('should create an add items request', async () => {
        axios.mockImplementation(() => Promise.resolve({ data: createdItems }));
        await transferItems.addItems('transfer-id', items);
        expect(axios).toHaveBeenLastCalledWith({
          data: {
            items: [
              {
                content_identifier: 'file',
                filename: 'item-01.txt',
                filesize: 1024,
                local_identifier: 'item-01.txt'
              }
            ]
          },
          headers: {
            'Authorization': 'Bearer json-web-token',
            'Content-Type': 'application/json',
            'x-api-key': 'secret-api-key'
          },
          url: '/v1/transfers/transfer-id/items'
        });
      });

      it('should return created items', async () => {
        axios.mockImplementation(() => Promise.resolve({ data: createdItems }));
        const newItems = await transferItems.addItems('transfer-id', items);
        expect(newItems).toEqual(createdItems);
      });

      it('should throw a WTError if request fails', async () => {
        try {
          axios.mockImplementation(() =>
            Promise.reject(new Error('Network error.'))
          );
          await transferItems.addItems('transfer-id', items);
        } catch (error) {
          expect(error).toBeInstanceOf(WTError);
        }
      });
    });

    describe('uploadFile method', () => {
      let file;
      beforeEach(() => {
        request.apiKey = 'secret-api-key';
        request.jwt = 'json-web-token';

        file = {
          id: 'file-id',
          meta: {
            multipart_parts: 1,
            multipart_upload_id: 'multipart-upload-id'
          }
        };
      });

      it('should create a multipart request', async () => {
        axios.mockImplementation(() => Promise.resolve({ data: {} }));
        await transferItems.uploadFile(file, []);
        expect(axios).toHaveBeenCalledWith({
          data: null,
          headers: {
            'Authorization': 'Bearer json-web-token',
            'Content-Type': 'application/json',
            'x-api-key': 'secret-api-key'
          },
          method: 'get',
          url: '/v1/files/file-id/uploads/1/multipart-upload-id'
        });
      });

      it('should create a file complete request', async () => {
        axios.mockImplementation(() =>
          Promise.resolve({
            data: {}
          })
        );
        await transferItems.uploadFile(file, []);
        expect(axios).toHaveBeenCalledWith({
          data: null,
          headers: {
            'Authorization': 'Bearer json-web-token',
            'Content-Type': 'application/json',
            'x-api-key': 'secret-api-key'
          },
          url: '/v1/files/file-id/uploads/complete'
        });
      });

      it('should throw a WTError if something fails', async () => {
        try {
          axios.mockImplementation(() => Promise.resolve({}));
          await transferItems.uploadFile(file, []);
        } catch (error) {
          expect(error).toBeInstanceOf(WTError);
        }
      });
    });

    describe('completeFileUpload method', () => {
      beforeEach(() => {
        request.apiKey = 'secret-api-key';
        request.jwt = 'json-web-token';
      });

      it('should create an upload complete request', async () => {
        axios.mockImplementation(() => Promise.resolve({}));
        await transferItems.completeFileUpload({
          id: 'item-id'
        });
        expect(axios).toHaveBeenLastCalledWith({
          data: null,
          headers: {
            'Authorization': 'Bearer json-web-token',
            'Content-Type': 'application/json',
            'x-api-key': 'secret-api-key'
          },
          url: '/v1/files/item-id/uploads/complete'
        });
      });
    });
  });
});
