import { natsWrapper } from "../../../nats-singleton"
import { OrderCanceledListener } from "../order-cancelled-listener"

const setup = async() => {
    const listener = new OrderCanceledListener(natsWrapper.client)
}