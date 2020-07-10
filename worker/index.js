const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
	try{
		const x = parseInt(index);
		if (index < 2) return 1;
			return fib(index - 1) + fib(index - 2);
	}catch(err){	
		console.log("error in fib(x)" + err);
		return 0;
		}
  
}

sub.on('message', (channel, message) => {
	try{
		const x= parseInt(message);
		redisClient.hset('values', message, fib(x));
	}
		catch(err){
			console.log("error at sub:" + err);
		}
	
  
});
sub.subscribe('insert');
