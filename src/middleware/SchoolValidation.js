import Joi from "joi";

const SchoolValidation = (req, res, next) => {
  const Schemas = Joi.object().keys({
    name: Joi.string().min(3).required(),
    province: Joi.string().min(3).required(),
    district: Joi.string().min(3).required(),
    sector: Joi.string().min(3).required(),
    cell: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    fullname: Joi.string().min(3).required(),
    level: Joi.array().min(1).required()
   
  });

  const { error } = Schemas.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message,
    });
  }
  next();
};



export default SchoolValidation;