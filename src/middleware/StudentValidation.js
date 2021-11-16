import Joi from "joi";

const StudentValidation = (req, res, next) => {
  const Schemas = Joi.object().keys({
    firstname: Joi.string().min(6).required(),
    fastname: Joi.string().min(6).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
      dob:Joi.date().required(),
      gender:Join.string().min(4).required(),
      schoolId:Joi.number(),
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



export default StudentValidation;