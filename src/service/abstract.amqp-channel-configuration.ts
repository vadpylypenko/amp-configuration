import { ConfirmChannel } from 'amqplib';
import { AmqpChannelConfigurationInterface } from '../interface/amqp-channel-configuration.interface';
import { AmqpExchangeConfigurationInterface } from '../interface/amqp-exchange-configuration.interface';
import { AmqpQueueConfigurationInterface } from '../interface/amqp-queue-configuration.interface';
import { AmqpBindingConfigurationInterface } from '../interface/amqp-binding-configuration.interface';

export abstract class AbstractAmqpChannelConfiguration
  implements AmqpChannelConfigurationInterface
{
  /**
   * @inheritdoc
   */
  async configure(channel: ConfirmChannel): Promise<void> {
    if (this.instanceOfConfigurationAware(this, 'getExchangeConfiguration')) {
      const exchangeConfigurations: AmqpExchangeConfigurationInterface[] =
        this['getExchangeConfiguration']();

      if (exchangeConfigurations.length) {
        await Promise.all(
          exchangeConfigurations.map((config) =>
            channel.assertExchange(config.name, config.type, config.options)
          )
        );
      }
    }

    if (this.instanceOfConfigurationAware(this, 'getQueueConfiguration')) {
      const queueConfigurations: AmqpQueueConfigurationInterface[] =
        this['getQueueConfiguration']();

      if (queueConfigurations.length) {
        await Promise.all(
          queueConfigurations.map((config) =>
            channel.assertQueue(config.name, config.options)
          )
        );
      }
    }

    if (this.instanceOfConfigurationAware(this, 'getBindingConfiguration')) {
      const bindConfigurations: AmqpBindingConfigurationInterface[] =
        this['getBindingConfiguration']();

      if (bindConfigurations) {
        await Promise.all(
          bindConfigurations.map((config) =>
            channel.bindQueue(
              config.queue,
              config.exchange,
              config.route,
              config.options
            )
          )
        );
      }
    }
  }

  /**
   * Checks whether the instance implements the interface.
   *
   * @param instance - The instance.
   * @param prop - The required property of the instance.
   *
   * @returns - The result of the instance check.
   */
  private instanceOfConfigurationAware(instance: any, prop) {
    return prop in instance;
  }
}
