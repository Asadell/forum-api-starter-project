const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');

// Arrange for all
const requestPayload = {
  title: 'newThreadTitle',
  body: 'newThreadBody',
};

describe('/threads endpoint', () => {
  afterEach(async () => {
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
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
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
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });
  });
});
