import Address from "../../../entity/address";
import Customer from "../../../entity/customer";
import CustomerCreatedEvent from "../../customer/customer-created.event";
import CustomerUpdateEvent from "../../customer/customer-updated.event";
import SendConsoleLogHandler from "../../customer/handler/send-console-log-when-customer-address-is-updated.handler";
import SendConsoleLog1Handler from "../../customer/handler/send-console-log1-when-customer-is-created.handler";
import SendConsoleLog2Handler from "../../customer/handler/send-console-log2-when-customer-is-created.handler";
import EventDispatcher from "../event-dispatcher";

describe("Domain event dispatcher test", () => {

    it("should create an event dispatcher when a customer is created", () => {
        const eventDispatcher = new EventDispatcher();

        const eventHandler1 = new SendConsoleLog1Handler();
        const eventHandler2 = new SendConsoleLog2Handler();

        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        const customer = new Customer("123", "Customer 1");

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: customer.id,
            name: customer.name,
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should create an event dispatcher when a customer address is changed", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerUpdateEvent", eventHandler);

        const customer = new Customer("123", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));

        const customerUpdateEvent = new CustomerUpdateEvent({
            id: customer.id,
            name: customer.name,
            address: customer.Address
        });

        eventDispatcher.notify(customerUpdateEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

});