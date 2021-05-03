import express, { Request, Response } from 'express';
import { Ticket } from './../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId:undefined,
  }); // find all the tickets that dont have an order

  res.send(tickets);
});

export { router as indexTicketRouter };
