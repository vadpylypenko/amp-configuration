export interface AmqpBindingConfigurationInterface {
  queue: string;
  exchange: string;
  route: string;
  options?: unknown;
}
