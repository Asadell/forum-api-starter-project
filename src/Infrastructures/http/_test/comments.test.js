const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

// Arrange for all
let accessToken = null;
let userId = null;
const threadId = 'thread-123';
const commentId = 'comment-123';
const replyId = 'reply-123';

const requestPayloadThread = {
  title: 'newThreadTitle',
  body: 'newThreadBody',
};

describe('/comments endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const responseServer = await ServerTestHelper.getAccessToken({ server });
      accessToken = responseServer.accessToken;
      userId = responseServer.userId;
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });

      const requestPayloadComment = {
        content: 'content',
        userId,
        threadId,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const responseServer = await ServerTestHelper.getAccessToken({ server });
      accessToken = responseServer.accessToken;
      userId = responseServer.userId;
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });

      const requestPayloadComment = {
        content: 'content',
        userId,
        threadId,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const responseServer = await ServerTestHelper.getAccessToken({ server });
      accessToken = responseServer.accessToken;
      userId = responseServer.userId;
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });

      const failRequestPayload = {};

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: failRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const responseServer = await ServerTestHelper.getAccessToken({ server });
      accessToken = responseServer.accessToken;
      userId = responseServer.userId;
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });

      const requestPayloadComment = {
        content: ['content'],
        userId,
        threadId,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      );
    });

    it('should response 404 and persisted comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const responseServer = await ServerTestHelper.getAccessToken({ server });
      accessToken = responseServer.accessToken;
      userId = responseServer.userId;

      const requestPayloadComment = {
        content: 'content',
        userId,
        threadId,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'content',
        userId,
        threadId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'content',
        userId,
        threadId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when request payload comment not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      const failCommentId = 'comment-321';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${failCommentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 403 when request with another user', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
        username: 'asadel',
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      const { accessToken: accessToken2, userId: userId2 } =
        await ServerTestHelper.getAccessToken({
          server,
          username: 'asadell',
        });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'content',
        userId,
        threadId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'comment content',
        userId,
        threadId,
      });

      const requestPayloadComment = {
        content: 'content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'comment content',
        userId,
        threadId,
      });

      const requestPayloadComment = {
        content: 'content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayloadComment,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'comment content',
        userId,
        threadId,
      });

      const requestPayloadComment = {
        // content: 'content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'comment content',
        userId,
        threadId,
      });

      const requestPayloadComment = {
        content: 123,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena tipe data tidak sesuai'
      );
    });

    it('should response 404 and persisted comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      // await CommentsTableTestHelper.addComment({
      //   id: commentId,
      //   content: 'comment content',
      //   userId,
      //   threadId,
      // });

      const requestPayloadComment = {
        content: 'content',
      };

      const failCommentId = 'comment-321';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${failCommentId}/replies`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'comment content',
        userId,
        threadId,
      });
      await CommentsTableTestHelper.addReply({
        id: replyId,
        content: 'reply content',
        threadId,
        commentId,
        userId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'comment content',
        userId,
        threadId,
      });
      await CommentsTableTestHelper.addReply({
        id: replyId,
        content: 'reply content',
        threadId,
        commentId,
        userId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when request payload reply not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'comment content',
        userId,
        threadId,
      });
      await CommentsTableTestHelper.addReply({
        id: replyId,
        content: 'reply content',
        threadId,
        commentId,
        userId,
      });

      const failReplyId = 'reply-321';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${failReplyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 403 when request with another user', async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequiresite
      const { userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      const { accessToken: accessToken2 } =
        await ServerTestHelper.getAccessToken({
          server,
          username: 'AAsadel',
        });
      await ThreadsTableTestHelper.addThread({
        ...requestPayloadThread,
        id: threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'comment content',
        userId,
        threadId,
      });
      await CommentsTableTestHelper.addReply({
        id: replyId,
        content: 'reply content',
        threadId,
        commentId,
        userId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
