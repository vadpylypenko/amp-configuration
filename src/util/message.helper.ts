export const AMQP_DISCONNECT_MSG = 'AMQP was disconnected due to %s.';
export const AMQP_RECONNECT_MSG = 'Re-connecting';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const AMQP_PUBLISH_ERROR_MSG = (error: any): string => `AMQP publish error ${error}`;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const AMQP_CHANNEL_ERROR_MSG = (error: any): string => `AMQP channel error ${error}`;