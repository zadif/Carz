import Joi from "joi";

export const carSchemaJoi=Joi.object({
    name:Joi.string().required(),
    description:Joi.string().required(),
    image:Joi.string().required(),
    price:Joi.number().required().min(0),
    country:Joi.string(),
    location:Joi.string().required(),
    year:Joi.number().required().min(2000).max(new Date().getFullYear())
});

export const reviewSchemaJoi=Joi.object({
   
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required(),
    author:Joi.string()
});
