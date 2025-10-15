import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class SendConsoleLogHandler implements EventHandlerInterface<CustomerCreatedEvent> {
    handle(event: CustomerCreatedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData["id"]}, ${event.eventData["name"]} alterado para: ${event.eventData["address"]}`);
    }
}