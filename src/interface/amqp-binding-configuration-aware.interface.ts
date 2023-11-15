import { AmqpBindingConfigurationInterface } from './amqp-binding-configuration.interface';

export interface AmqpBindingConfigurationAwareInterface {
  /**
   * Retrieve configuration to bind queue to exchanger.
   *
   * @returns - The binding configuration.
   */
  getBindingConfiguration(): AmqpBindingConfigurationInterface[];
}
