import log from 'loglevel';

// log.error(msg)
// log.warn(msg)
// log.info(msg)
// log.debug(msg)
// log.trace(msg)

log.setDefaultLevel(log.levels.INFO);

if (process.env.NODE_ENV === 'development') {
	log.setLevel(log.levels.TRACE);
} else {
	log.setLevel(log.levels.WARN);
}

export default log;
