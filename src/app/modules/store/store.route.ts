import express from 'express';
import { authentication } from '../../middleware/authentication';
import { createProductController, getAllProductController } from './store.controller';

export const productRoute = express.Router();

// Route for creating a new store item
productRoute.post('/add-product', authentication, createProductController);
productRoute.get('/get-all-product', authentication, getAllProductController);

 
 