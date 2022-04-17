import * as Joi from 'joi'

export const configValidatioSchema = Joi.object({
  PORT: Joi.number().default(8080),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().required()
})
