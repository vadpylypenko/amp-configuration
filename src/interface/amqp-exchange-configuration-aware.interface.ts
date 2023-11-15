import { AmqpExchangeConfigurationInterface } from './amqp-exchange-configuration.interface';

export interface AmqpExchangeConfigurationAwareInterface {
  /**
   * Retrieve exchange configuration.
   *
   * @returns - The exchange configuration.
   */
  getExchangeConfiguration(): AmqpExchangeConfigurationInterface[];
}
