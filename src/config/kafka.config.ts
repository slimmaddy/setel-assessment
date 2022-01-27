export default (): Record<string, any> => ({
  kafkaBroker: process.env.KAFKA_BROKER.split(',') || [],
  kafkaClientId: process.env.KAFKA_CLIENT_ID,
  kafkaGroupId: process.env.KAFKA_GROUP_ID,
  kafkaOrderSendTopic: process.env.KAFKA_ORDER_SEND_TOPIC,
  kafkaOrderReceiveTopic: process.env.KAFKA_ORDER_RECEIVE_TOPIC,
});
