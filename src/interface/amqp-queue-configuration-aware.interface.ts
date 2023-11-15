import { AmqpQueueConfigurationInterface } from './amqp-queue-configuration.interface';

export interface AmqpQueueConfigurationAwareInterface {
  /**
   * Retrieve queue configuration.
   *
   * @returns - The queue configuration.
   */
  getQueueConfiguration(): AmqpQueueConfigurationInterface[];
}
