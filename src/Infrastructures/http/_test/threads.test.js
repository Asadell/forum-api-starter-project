const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

// Arrange for all
const requestPayload = {
  title: 'newThreadTitle',
  body: 'newThreadBody',
};

const threadId = 'thread-123';
const commentId = 'comment-123';

describe('/threads endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessToken({ server });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    // Add Thread with Bad Payload
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      const failRequestPayload = {};
      const { accessToken } = await ServerTestHelper.getAccessToken({ server });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessToken({ server });

      const failRequestPayload = {
        title: ['newThreadTitle'],
        body: 'newThreadBody',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);

      const { userId } = await ServerTestHelper.getAccessToken({ server });
      await ThreadsTableTestHelper.addThread({
        ...requestPayload,
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
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    // Add Thread with Bad Payload
    it('should response 404 when threadId not found', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessToken({ server });
      const failThreadId = 'thread-321';

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${failThreadId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
