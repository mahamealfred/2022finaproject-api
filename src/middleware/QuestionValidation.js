import Joi from "joi";

const QuestionValidation = (req, res, next) => {
  const Schemas = Joi.object().keys({
    question: Joi.string().min(6).required(),
    options: Joi.array().min(6).required(),
    startDate:Joi.date().required(),
     
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



export default QuestionValidation;