import { ConsumeMessage, Channel } from 'amqplib';

export interface AmqpConsumerInterface {
  /**
   * The message handling.
   *
   * @param channel - The AMQP channel.
   * @param msg - The message which sends to exchanger.
   */
  consume(channel: Channel, msg: ConsumeMessage | null): Promise<void>;
}
