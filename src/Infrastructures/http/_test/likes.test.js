const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

const threadId = 'thread-123';
const commentId = 'comment-123';

const requestPayloadThread = {
  title: 'newThreadTitle',
  body: 'newThreadBody',
};

let server = null,
  accessToken = null,
  userId = null;

describe('likes endpoint', () => {
  beforeAll(async () => {
    // Arrange
    server = await createServer(container);

    // Prerequiresite
    ({ accessToken, userId } = await ServerTestHelper.getAccessToken({
      server,
    }));
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
  });

  afterAll(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });
  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when like comment', async () => {
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 when unlike comment', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
