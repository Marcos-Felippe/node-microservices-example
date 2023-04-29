import express, {Request, Response, } from "express";
import { PurchaseProductController } from "../../../application/controllers/purchaseProductController";

const router = express.Router()

const purchaseProduct = new PurchaseProductController();

router.post("/purchases", purchaseProduct.handle);

router.get("/", (req: Request, res: Response, next: Function): void => {
    res.status(200).json({
        user: {
            name: "Felippe"
        }
    })
});

export default router;