import db from '../models/index.js';
import jwt from 'jsonwebtoken';

const validateHeader = (AHeader) => {
    if (!AHeader) return new Error("No authorization header found!");
    const [type, token] = AHeader.split(" ");
    if (type !== "Bearer" || !token) return new Error("No credentials sent!");
    return null;
}

const isAuth = async (req, res, next) => {
    const AHeader = req.headers.authorization;

    const err = validateHeader(AHeader);
    if (err) {
        return res.status(401).json({ success: false, error: err.message });
    }

    const token = AHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_PKEY);
        const user = await db.users.findOne({ where: { id: payload.id } });

        if (!user) {
            return res.status(401).json({ success: false, error: "Must login to perform this action!" });
        }

        req.body.userid = payload.id;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, error: "Can't login, try later!" });
    }
}

export { isAuth };
