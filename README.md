Solution:
- Using choreography saga pattern to achieve consistency in transaction span over multiple services.
- Order service create order in CREATED status then push ORDER_CREATED event to payment service through message channel
- Payment service receive ORDER_CREATED event, then validate order and return result through message channel
- Order service get result by listening on message channel and change order status to DECLINED or CONFIRMED
- Each local transaction must include a event publishing opreration. Because of using kafka as external message queue, it is unsure that publish event operation and commit local transaction operation successfully at same time; transactional outbox pattern can solve this issue.
- Saga is distributed transaction pattern but it lack of Isolation property in ACID. In order to avoid dirty read between processing distributed transaction, it must be implemented a method as counter measurement.
- Each domain record (Order) has a version field. Multiple oprations of same transaction can check validity of record, and could abort processing.


Deployment:
- Using kubernetes as infrastructure for all backend and frontend services
- Each backend service can be deployed as a internal k8s service (ClusterIP)
- Frontend service can be packed inside a web server like nginx, then deployed as a internal k8s service (ClusterIP)
- Other infrastructure like database, message broker can be deployed by heml chart
- Deploy Nginx Ingress for handling and routing external requests to resources inside k8s
- Service environment variable should be manage by k8s configmap object
- Services secret like db password, 3rd token should be manage by k8s secret object
