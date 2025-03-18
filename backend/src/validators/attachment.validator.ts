import Joi from 'joi';

export const attachmentSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    company_name: Joi.string().required(),
    application_link: Joi.string().uri().required(),
});