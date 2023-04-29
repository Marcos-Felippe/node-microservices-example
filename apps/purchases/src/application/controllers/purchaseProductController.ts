import { Request, Response } from "express";

import { PurchaseProduct } from "../usecases/purchase-product";

import { PrismaCustomersRepository } from "../../infra/database/prisma/repositories/prisma-customers-repository";
import { PrismaPurchasesRepository } from "../../infra/database/prisma/repositories/prisma-purchases-repository";
import { PrismaProductsRepository } from "../../infra/database/prisma/repositories/prisma-products-repository";
import { KafkaMessagingAdapter } from "../../infra/messaging/kafka/adapters/kafka-messaging-adapter";

export class PurchaseProductController {
    async handle(req: Request, res: Response) {

        const { productId, name, email } = req.body;

        if(!productId){
            res.status(400).json('You need to pass productId')
        }
         
        const prismaCustomersRepository = new PrismaCustomersRepository();
        const prismaProductsRepository = new PrismaProductsRepository();
        const prismaPurchasesRepository = new PrismaPurchasesRepository();
        const kafkaMessagingAdapter = new KafkaMessagingAdapter()
     
        const purchaseProductUseCase = new PurchaseProduct(
            prismaCustomersRepository, 
            prismaProductsRepository,
            prismaPurchasesRepository,
            kafkaMessagingAdapter
        )
     
        try {
            await purchaseProductUseCase.execute({
                name,
                email,
                productId,
            })
     
            return res.status(201).send();
            
        } catch (err) {
            console.error(err);
     
            return res.status(400).json({
                error: 'Error while creating a new purchase'
            })
        }
     
    }
}