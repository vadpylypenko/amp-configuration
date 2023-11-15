import {
  AmqpConnectionManagerOptions,
  CreateChannelOpts,
} from 'amqp-connection-manager';

export interface AmqpOptionsInterface {
  urls: string[];
  connectionOptions?: AmqpConnectionManagerOptions;
  channelOptions?: CreateChannelOpts;
  prefetchCount?: number;
  isPrefetchGlobal?: boolean;
}
