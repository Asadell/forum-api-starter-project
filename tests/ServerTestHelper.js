/* istanbul ignore file */

const ServerTestHelper = {
  async getAccessToken({ server, username = 'asadel' }) {
    const userPayload = {
      username,
      password: 'secret',
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: 'Dicoding Indonesia',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });
    // console.log('responseUser');
    // console.log(JSON.parse(responseUser.payload).data);
    // console.log('responseAuth');
    // console.log(JSON.parse(responseAuth.payload).data);

    const { id: userId } = JSON.parse(responseUser.payload).data.addedUser;
    const { accessToken } = JSON.parse(responseAuth.payload).data;

    return { userId, accessToken };
  },
};

module.exports = ServerTestHelper;
