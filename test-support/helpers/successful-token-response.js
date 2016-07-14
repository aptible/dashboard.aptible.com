export default function successfulTokenResponse(server, userUrl) {
  // TODO: Deprecate usage, use createStubToken instead.
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
      },
      self: {
        href: '/tokens/my-id'
      }
    }
  });
}

