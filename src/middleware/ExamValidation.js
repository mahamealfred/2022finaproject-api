import Joi from "joi";

const ExamValidation = (req, res, next) => {
  const Schemas = Joi.object().keys({
    name: Joi.string().min(6).required(),
    subject: Joi.string().min(6).required(),
    level: Joi.string().min(2).required(),
    startDate:Joi.date().required(),
    endDate:Joi.date().required(),
     
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



export default ExamValidation;