import Joi from "joi";

const ExamValidation = (req, res, next) => {
  const Schemas = Joi.object().keys({
    name: Joi.string().min(6).required(),
    subject: Joi.string().min(6).required(),
    startDate:Joi.date().required(),
    question: Joi.string().min(6).required(),
    correct_answer: Joi.string().required(),
    incorrect_answer: Joi.array().min(2).required(),
     
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