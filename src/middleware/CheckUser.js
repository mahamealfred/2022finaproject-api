import Models from '../database/models';

const CheckUser = async (req, res, next) => {
	const { email } = req.body;
	const { users } = Models;
	const found = await users.findOne({ where: { email } });
	if (found) {
		 req.user = found
		 return next()
	}
   req.user = null
	next();
};

export default CheckUser;

// findOne({ where: { email } });