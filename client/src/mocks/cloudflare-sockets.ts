interface CloudflareSocketOptions {
  secureTransport?: 'starttls' | 'off'
}

interface CloudflareSocket {
  // Add any other methods you need to mock
  close: () => void
}

export const connect = (
  // Mock implementation - parameters intentionally unused
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hostPort: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: CloudflareSocketOptions
): CloudflareSocket => {
  throw new Error(
    'Cloudflare sockets are not available in this environment.\n' +
    'If you need PostgreSQL access, consider:\n' +
    '1. Using API routes for database operations\n' +
    '2. Switching to a browser-compatible database solution\n' +
    '3. Using the Node.js version of pg in a server environment'
  )
}

export default {
  connect
}
