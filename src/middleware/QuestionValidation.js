import Joi from "joi";

const QuestionValidation = (req, res, next) => {
  const Schemas = Joi.object().keys({
    question: Joi.string().min(6).required(),
    correct_answer: Joi.string().required(),
    incorrect_answer: Joi.array().min(1).required()
    
   
     
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