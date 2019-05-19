/**
 * 참고 : https://thisdavej.com/using-winston-a-versatile-logging-library-for-node-js/
 * https://mungmungdog.tistory.com/34
 * https://lovemewithoutall.github.io/it/winston-example/
 * winston 버전업으로 인한 예제 작동안함 새롭게 작성 필요
 * */

const {createLogger, format, transports} = require('winston');

var logger = createLogger({
    level : 'debug',
    format : format.combine(format.colorize(), format.simple()),
    transports: [new transports.Console()]
});

logger.info('Hello world');
logger.debug('Debugging info');