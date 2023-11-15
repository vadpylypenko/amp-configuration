import { LoggerService } from '@nestjs/common';
import { ConfirmChannel, Options } from 'amqplib';
import {
  AmqpConnectionManager,
  ChannelWrapper,
  connect,
} from 'amqp-connection-manager';
import { format } from 'util';
import {
  AMQP_DISCONNECT_MSG,
  AMQP_RECONNECT_MSG,
  AMQP_CHANNEL_ERROR_MSG,
  AMQP_PUBLISH_ERROR_MSG,
} from '../util/message.helper';
import {
  AMQP_CONNECT_EVENT,
  AMQP_DISCONNECT_EVENT,
} from '../constant/amqp.constant';
import { AbstractAmqpChannelConfiguration } from './abstract.amqp-channel-configuration';
import { AmqpOptionsInterface } from '../interface/amqp-options.interface';
import { AmqpChannelConfigurationInterface } from '../interface/amqp-channel-configuration.interface';

export class AmqpService {
  /**
   * The instance of the AMQP connection manager.
   */
  private connectionManager: AmqpConnectionManager;

  /**
   * The instance of the AMQP channel wrapper.
   */
  private channel: ChannelWrapper;

  /**
   * Constructor.
   *
   * @param options - Amqp configurations.
   * @param channelConfigs - Configurations
   * @param logger - The Nest logger
   */
  constructor(
    private readonly options: AmqpOptionsInterface,
    private readonly channelConfigs: AmqpChannelConfigurationInterface[] = [],
    private readonly logger: LoggerService
  ) {}

  /**
   * Creates Amqp connection and channel.
   * Applies all configurations which creates exchanger, queue and bindings.
   */
  public connect(): void {
    this.connectionManager = connect(
      this.options.urls,
      this.options.connectionOptions
    );

    this.connectionManager.on(AMQP_DISCONNECT_EVENT, (arg: { err: Error }) => {
      this.logger.error(
        format(AMQP_DISCONNECT_MSG, arg.err.message),
        arg.err.stack,
        AmqpService.name
      );
      this.logger.log(AMQP_RECONNECT_MSG, AmqpService.name);
    });

    this.connectionManager.on(AMQP_CONNECT_EVENT, async () => {
      if (this.channel) {
        return;
      }

      this.channel = this.connectionManager.createChannel({
        ...this.options.channelOptions,
        setup: (channel: ConfirmChannel) => this.setupChannel(channel),
      });

      this.logger.log(`The AMQP was connected`);
    });
  }

  /**
   * Applies the configuration to the channel.
   *
   * @param channel - RabbitMQ confirmation channel.
   */
  private async setupChannel(channel: ConfirmChannel): Promise<void> {
    this.options.prefetchCount = this.options.prefetchCount || 0;

    try {
      await channel.prefetch(
        this.options.prefetchCount,
        this.options.isPrefetchGlobal
      );
      /**
       * This should take care about sequence.
       */
      await this.channelConfigs.reduce(async (prev, curr) => {
        await prev;

        return curr.configure(channel);
      }, Promise.resolve());
    } catch (err) {
      this.logger.error(
        AMQP_CHANNEL_ERROR_MSG(err),
        err.stack,
        AmqpService.name
      );
      this.connectionManager.close();
      this.channel = null;
      this.logger.error(
        format(AMQP_DISCONNECT_MSG, err.message),
        err.stack,
        AmqpService.name
      );
      this.connect();
    }
  }

  /**
   * Publish the message to an exchange.
   *
   * @param exchange - The exchange name.
   * @param routingKey - The routing
   * @param content - The message
   * @param options - RabbitMQ options
   */
  public publish(
    exchange: string,
    routingKey: string,
    content: Buffer | Record<string, unknown>,
    options?: Options.Publish
  ): Promise<boolean> {
    if (!this.channel) {
      throw new Error('Please connect to AMQP before publish message');
    }

    return this.channel.publish(exchange, routingKey, content, options);
  }

  /**
   * Adds the channel configuration.
   * Configuration must be added before AMQP connection.
   *
   * @param channelConfig
   */
  public addChannelConfig(
    channelConfig: AmqpChannelConfigurationInterface
  ): void {
    this.channelConfigs.push(channelConfig);
  }
}
