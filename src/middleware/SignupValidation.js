import Joi from "joi";

const SignupValidation = (req, res, next) => {
  const Schemas = Joi.object().keys({
    fullname: Joi.string().min(6).required(),
    //role: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
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



export default SignupValidation;