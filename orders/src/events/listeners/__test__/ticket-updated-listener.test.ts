import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {TicketUpdatedEvent} from '@ticket-micro-srv/common';
import {TicketUpdatedListener} from '../ticket-updated-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../models/ticket';


const setup = async () => {
    // Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
  
    // Create and save a ticket
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    });
    await ticket.save();
  
    // Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
      id: ticket.id,
      version: ticket.version + 1,
      title: 'new concert',
      price: 999,
      userId: 'ablskdjf',
    };
  
    
    //create a fake message object
    // we only want one attribute hence ts-ginore
    //@ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };
  
    // return all of this stuff
    return { msg, data, ticket, listener };
  };
  
  it('finds, updates, and saves a ticket', async () => {
    const { msg, data, ticket, listener } = await setup();
  
    await listener.onMessage(data, msg);
  
    const updatedTicket = await Ticket.findById(ticket.id);
  
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
  });

it('acks/acknowledges the message',async()=>{

    const {listener,data,msg} = await setup();
    //call the onMessage functionwith the data object
    //+ message object
    await listener.onMessage(data,msg);


    expect(msg.ack).toHaveBeenCalled();


});

it(' doenst not call ack if the version number is not current verion +1',async()=>{
    
    const {listener,data,msg} = await setup();
    //call the onMessage functionwith the data object
    //+ message object

    //symulate a out of order version
    data.version =20;

    try{
    await listener.onMessage(data,msg);
    } catch(err)
    {

    }

    expect(msg.ack).not.toHaveBeenCalled();

});