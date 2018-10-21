const request = require('../../request');
const routes = require('../../config/routes');

const createBoard = require('./create')({ request, routes });
const findBoard = require('./find')({ request, routes });
const getUploadUrl = require('../../actions/get-upload-url')({
  request,
  multipartRoute: routes.boards.multipart,
});
const completeFileUpload = require('../../actions/complete-file-upload')({
  request,
  uploadCompleteRoute: routes.boards.uploadComplete,
});
const uploadFileToBoard = require('../../actions/upload-file')({
  request,
  getUploadUrl,
  completeFileUpload,
});
const addFilesToBoard = require('./add-files')({
  request,
  routes,
  uploadFileToBoard,
});
const addLinksToBoard = require('./add-links')({ request, routes });

module.exports = {
  createBoard,
  findBoard,
  addFilesToBoard,
  addLinksToBoard,
  getFileUploadURLToBoard: getUploadUrl,
  completeFileUploadToBoard: completeFileUpload,
};
