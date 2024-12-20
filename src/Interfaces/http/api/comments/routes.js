const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumapiapp_jwt',
    },
  },
];

module.exports = routes;
