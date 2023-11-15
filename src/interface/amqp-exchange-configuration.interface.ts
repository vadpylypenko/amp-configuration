import { Options } from 'amqplib';
import { ExchangeType } from '../constant/amqp.constant';

export interface AmqpExchangeConfigurationInterface {
  name: string;
  type: ExchangeType;
  options?: Options.AssertExchange;
}
