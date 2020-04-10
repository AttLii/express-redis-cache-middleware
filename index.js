const redis = require("redis")
const { promisify } = require("util")

const fn = (opts = {}) => {
	const client = redis.createClient(opts)

	client.on("error", error => {
		console.error("redisCacheMiddleware couldn't connect to redis server")
		console.error(error)
	})

	// promisify needed methods from redis-library
	const set = promisify(client.set).bind(client)
	const get = promisify(client.get).bind(client)
	const flushall = promisify(client.flushall).bind(client)

	const cacheMiddleware = (req, res, next) => {
		// key we are asking from redis
		const key = req.originalUrl
		get(key)
			.then(results => {
				if (results === null) {
					// https://stackoverflow.com/a/56651503
					const originalSend = res.send

					// this needs to be regular function
					res.send = function () {
						set(key, arguments[0])
						originalSend.apply(res, arguments)
					}
					next()
				} else {
					// if it exists, send it directly to client
					res.send(results)
				}
			})
			.catch(e => {
				console.error(
					`redisCacheMiddleware encountered an error while getting key ${key}:`,
					e
				)
				next()
			})
	}

	const flushEndpoint = (req, res) => {
		// https://redis.io/commands/flushall
		flushall("ASYNC").then(message => res.send(message))
	}

	return {
		cacheMiddleware,
		flushEndpoint
	}
}

module.exports = fn
