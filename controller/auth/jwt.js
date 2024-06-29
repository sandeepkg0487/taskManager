
const jwt = require('jsonwebtoken');
const { usermodel } = require('../../model/userSchema');
const secretKey = "hi iam key";

// authenticate  jwt
const authMiddleware = (req, res, next) => {
    console.log('reqhitting auth middleware authenticate');
    const secretKey = "hi iam key";
    const authorizationHeader = req.header("Authorization")
    console.log(authorizationHeader);
    // This header typically contains the JWT
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid authorization header" });
    }
    // extract the actual token from the header.remove the Bearer
    const token = authorizationHeader.replace("Bearer ", "")

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Authorization token not found" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log('decoded:', decoded)
        if (decoded.userId) {
            req.jwt = decoded

        }
        if (decoded.bookingId) {
            // req.userId = decoded.userId
            // req.userName = decoded.username
        }
        next();
        // return res.status(200).json({ success: true, message: "valid token" });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}



//   create JWT token

function generateJWT(payload) {
    console.log("payload:", payload);
    // JWT payload containing user information



    // JWT options: expiresIn specifies the token's expiration time (e.g., 1 hour)
    const options = {
        expiresIn: '1d',
    };
    // Generate and return the JWT
    console.log(options);
    const token = jwt.sign(payload, secretKey, options);
    return token;

}
function generateRefreshJWT(payload) {
    console.log("payload:", payload);
    // JWT payload containing user information



    // JWT options: expiresIn specifies the token's expiration time (e.g., 1 hour)
    const options = { expiresIn: '7d' }
    // Generate and return the JWT
    const token = jwt.sign(payload, secretKey, options);
    return token;

}


const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const decoded = jwt.verify(refreshToken, secretKey);
    const { email } = decoded;

    // Retrieve user_id from your database based on the email
    const user = await usermodel.findOne({ email })
    console.log("userfind for checking:", user);

    if (!user) {
        return res.sendStatus(404); // User not found
    }


    const options = {
        expiresIn: '1d',
    };
    const payload = {
        userId: user._id,
        email: user.email,
    }
    // Generate a new access token including user_id
    const accessToken = jwt.sign(payload, secretKey, options);
    res.json({ accessToken });

}




module.exports = { generateJWT, authMiddleware,refreshToken ,generateRefreshJWT }