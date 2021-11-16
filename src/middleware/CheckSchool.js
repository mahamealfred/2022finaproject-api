import Models from '../database/models';

const CheckSchool = async (req, res, next) => {
	const { name } = req.body;
	const { schools } = Models;
	const found = await schools.findOne({ where: { name } });
	if (found) {
		 req.school = found
		 return next()
	}
   req.school = null
	next();
};

export default CheckSchool;

// findOne({ where: { email } });