import Models from '../database/models';

const CheckExam = async (req, res, next) => {
	const { name } = req.body;
	const { exams } = Models;
	const found = await exams.findOne({ where: { name } });
	if (found) {
		 req.exam = found
		 return next()
	}
   req.exam = null
	next();
};

export default CheckExam;

// findOne({ where: { email } });