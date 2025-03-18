import joi from 'joi';

export const resourceSchema = joi.object({
    title: joi.string().min(2).required(),
    description: joi.string().min(10).required(),
    quantity: joi.number().integer().min(0).required(),
});