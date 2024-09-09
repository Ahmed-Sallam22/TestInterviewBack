import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signup=joi.object({
    userName:joi.string().min(2).max(20).required().messages({
        'string.base': `userName should be a type of 'text'`,
        'string.empty': `userName cannot be an empty field`,
        'string.min': `userName should have a minimum length of {#limit}`,
        'string.max': `userName should have a max length of {#limit}`,
        'any.required': `userName is a required field`}),
        pass:generalFields.password.messages({
        // 'string.pattern.base': `Password should be include A capital letter, a small letter, and a number `,
        // 'string.empty': `Password cannot be an empty field`,
        'any.required': `Password is a required field`
      }),
      confirmPassword:generalFields.cPassword.valid(joi.ref('pass')).messages({
        'string.empty': `confirmPassword cannot be an empty field`,
        'any.only': `confirmPassword Not match the password`,
        'any.required': `confirmPassword is a required field`   })
       , role: joi.string().valid('client', 'admin').required().messages({
          'string.base': `role should be a type of 'text'`,
          'any.only': `role must be one of 'client' or 'admin'`,
          'any.required': `role is a required field`,
      }),
}).required()


export const login = joi.object({
  userName:joi.string().min(2).max(20).required().messages({
    'string.base': `userName should be a type of 'text'`,
    'string.empty': `userName cannot be an empty field`,

    'any.required': `userName is a required field`}),
  
    pass:generalFields.password.messages({
      // 'string.pattern.base': `Password should be include A capital letter, a small letter, and a number `,
      // 'string.empty': `Password cannot be an empty field`,
      'any.required': `Password is a required field`
    }),
})




export const token=joi.object({
  token:joi.string().required(),
}).required()