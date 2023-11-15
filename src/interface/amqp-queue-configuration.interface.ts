import { Options } from 'amqplib';

export interface AmqpQueueConfigurationInterface {
  name: string;
  options?: Options.AssertQueue;
}
