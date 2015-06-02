export default function successfulTokenResponse(server, userUrl) {
  return server.success({
    id: 'my-id',
    access_token: 'my-token',
    token_type: 'bearer',
    expires_in: 2,
    scope: 'manage',
    type: 'token',
    _links: {
      user: {
        href: userUrl
      }
    }
  });
}

