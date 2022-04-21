import Models from '../database/models';

const CheckDistrict = async (req, res, next) => {
	const { name } = req.body;
	const { districts } = Models;
	const found = await districts.findOne({ where: { name:name } });
	if (found) {
		 req.district = found
		 return next()
	}
   req.district = null
	next();
};

export default CheckDistrict;

// findOne({ where: { email } });