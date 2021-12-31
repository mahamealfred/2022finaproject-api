import Models from '../database/models';

const CheckStudent = async (req, res, next) => {
	const { email } = req.body;
	const { students } = Models;
	const found = await students.findOne({ where: { email } });
	if (found) {
		 req.student = found
		 return next()
	}
   req.student = null
	next();
};

export default CheckStudent;

