# Redis cache middleware

Express middleware that caches routes' sent response to redis and intercepts routes if it can find cached results for a request. The package also comes with optional endpoint to flush the cache.

## Usage

```
const express = require("express")
const redisCacheMiddleware = require("express-redis-cache-middleware")

/**
 * The middleware passes options variable to redis.createClient().
 * If you use fresh installation on your host machine, empty variable should be enough.
 * @see https://github.com/NodeRedis/node-redis#rediscreateclient
 */
const options = {}
const { cacheMiddleware, flushEndpoint } = redisCacheMiddleware(options)

const app = express()

// flushes the cache
app.get("/flush", flushEndpoint)

app.get("/", cacheMiddleware, (req, res) => {
    // simulated delay. It shouldn't happen on second request
	setTimeout(() => {
		res.json({ hello: "world" })
	}, 3000)
})
app.listen(3000)
```
