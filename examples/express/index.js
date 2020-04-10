const express = require("express")
const redisCacheMiddleware = require("../../index.js")

/**
 * The middleware passes options variable to redis.createClient().
 * If you use fresh redis installation on your host machine, empty variable should be enough.
 * @see https://github.com/NodeRedis/node-redis#rediscreateclient
 */
const options = {}
const { cacheMiddleware, flushEndpoint } = redisCacheMiddleware(options)

const app = express()

// flushes the cache
app.get("/flush", flushEndpoint)

app.get("/", cacheMiddleware, (req, res) => {
	// simulated delay, shouldn't happen on second request
	setTimeout(() => {
		res.json({ hello: "world" })
	}, 3000)
})
app.listen(3000)
