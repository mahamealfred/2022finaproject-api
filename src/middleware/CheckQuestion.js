import Models from '../database/models';

const CheckQuestion = async (req, res, next) => {
	const { question } = req.body;
	const { questions } = Models;
	const found = await questions.findOne({ where: { question } });
	if (found) {
		 req.question= found
		 return next()
	}
   req.question = null
	next();
};

export default CheckQuestion;

