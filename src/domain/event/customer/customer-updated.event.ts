import EventInterface from "../@shared/event.interface";

export default class CustomerUpdateEvent implements EventInterface {
    dateTimeOccurred: Date;
    eventData: any;

    constructor(eventData: any) {
        this.dateTimeOccurred = new Date();
        this.eventData = eventData;
    }

}