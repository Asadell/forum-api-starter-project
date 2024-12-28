const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putLikesCommenthandler,
    options: {
      auth: 'forumapiapp_jwt',
    },
  },
];

module.exports = routes;
