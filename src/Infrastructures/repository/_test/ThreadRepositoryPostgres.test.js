const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const thread = new AddThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        userId: 'user-V1StGXR8_Z5jdHi6B-myT',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // == Arrange ==
      const fakeIdGenerator = () => '123'; // stub!
      // User
      const registerUser = new RegisterUser({
        username: 'asadel',
        password: 'secret_password',
        fullname: 'AAsadel',
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Thread
      const registerThread = new AddThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        userId: registeredUser.id,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(
        registerThread
      );
      console.log(registeredUser);
      console.log(registeredThread);
      console.log(
        new AddedThread({
          id: 'thread-123',
          title: registerThread.title,
          owner: registeredUser.id,
        })
      );

      // Assert
      expect(registeredThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: registerThread.title,
          owner: registeredUser.id,
        })
      );
    });
  });
});
