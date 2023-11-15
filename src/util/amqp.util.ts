import { IllegalOperationError } from 'amqplib';

/**
 * Checks whether AMQP error or not.
 *
 * @param error - The error instance.
 *
 * @returns - Returns true if error is AMQP error.
 */
export function isAmqpError(error: Error): boolean {
  return error instanceof IllegalOperationError;
}
