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

  describe('when POST /comments', () => {
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
});
