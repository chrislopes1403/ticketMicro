
import { natsWrapper } from './nats-wrapper';
import {OrderCreatedListener} from './events/listeners/order-created-listener';
// we connect to the kubernetes container serivce. if the db doesnt exist create one
const start = async () => {

    if (!process.env.NATS_SERVICE_URL) {
        throw new Error('NATS_SERVICE_URL is undefined');
    }
    if (!process.env.NATS_TICKET_CLUSTER_ID) {
        throw new Error('NATS_TICKET_CLUSTER_ID is undefined');
    }

    if (!process.env.NATS_TICKET_CLIENT_ID) {
        throw new Error('NATS_TICKET_CLIENT_ID is undefined');
    }
    try {
        //clusterid clientid url
        await natsWrapper.connect(process.env.NATS_TICKET_CLUSTER_ID, process.env.NATS_TICKET_CLIENT_ID, process.env.NATS_SERVICE_URL);




        natsWrapper.client.on('close', () => {
            console.log(`Nats Wrapper Connection  closed! `);
            process.exit();
        });

        process.on('SIGINT', () => { natsWrapper.client.close() });
        process.on('SIGTERM', () => { natsWrapper.client.close() });


        /*Listeners*/
        new OrderCreatedListener(natsWrapper.client).listen();



    } catch (err) {
        console.error(err);
    }

};

start();
