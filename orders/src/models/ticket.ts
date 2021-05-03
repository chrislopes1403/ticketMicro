import mongoose from 'mongoose';
import {Order,OrderStatus} from './order';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';


interface TicketAttrs {
  id:string;
  title:string;
  price: number;
}


export interface TicketDoc extends mongoose.Document {
    title:string;
    price: number;
    version: number;
    //custom method
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event:{id:string,version:number}): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true,
      },
   
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);


ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

// optional way to handle version update if you want 
// to update date the version by 100 or by a timestamp
/*
ticketSchema.pre('save',function(done){
  //@ts-ignore
  this.$where = {
    version:this.get('version') -1
  }
});
*/

ticketSchema.statics.findByEvent = (data:{id:string,version:number}) => {
 
  return Ticket.findOne({
    _id:data.id,
    version: data.version - 1 // remember that the service only wants update the next closest version
});

};


ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id:attrs.id,
    title:attrs.title,
    price: attrs.price
  }); // we do this to get the id back to _id
};


ticketSchema.methods.isReserved = async function()
{
    //this === the ticket document that we just called 'isReserved' 
    const existingOrder = await Order.findOne({
        ticket:this,
        status:{
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    //null === false ===undefined
    //if null ! => true
    //then true ! => false
    
    // oposite of defined is undefined
    // defined ! => false 
    //then false ! => true
    return !!existingOrder;
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };