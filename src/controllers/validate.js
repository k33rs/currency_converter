const { celebrate } = require('celebrate')
const Joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'))

const validate = celebrate({
  query: Joi.object({
    amount: Joi.number().required(),
    src_currency: Joi.string().pattern(/^[A-Z]{3}$/).required(),
    dest_currency: Joi.string().pattern(/^[A-Z]{3}$/).required(),
    reference_date: Joi.date().format('YYYY-MM-DD').raw()
  })
})

module.exports = validate
