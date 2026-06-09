import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Lazy initializer so the build does not crash when DATABASE_URL is missing
// (e.g. during `next build` page-data collection on Vercel before env vars
// are applied). The actual neon() call is deferred until the first request.
let _sql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not configured. Set it in the Vercel project environment variables.',
    );
  }
  _sql = neon(url);
  return _sql;
}

// Forward both tagged-template calls (sql`SELECT ...`) and any property access
// (sql.transaction, etc.) to the lazily-instantiated neon client.
const sql = new Proxy(function noop() {}, {
  apply(_target, thisArg, args: unknown[]) {
    return Reflect.apply(getSql() as unknown as (...a: unknown[]) => unknown, thisArg, args);
  },
  get(_target, prop, receiver) {
    return Reflect.get(getSql() as unknown as object, prop, receiver);
  },
}) as unknown as NeonQueryFunction<false, false>;

export default sql;
