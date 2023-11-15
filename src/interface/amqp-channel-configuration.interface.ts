import { ConfirmChannel } from 'amqplib';

export interface AmqpChannelConfigurationInterface {
  /**
   * Configure the channel depends on needs.
   *
   * @param channel - Amqp confirm channel.
   */
  configure(channel: ConfirmChannel): Promise<void>;
}
