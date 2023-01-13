// to test in postman: add content-type application/json - cookie is seen on top right of postman in cookie manager
// using with aT, add header Authorization and then Bearer space aT to use the verifyJWT and tets other routes
// User data model
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// login, /auth - post, access public
const login = async (req, res) => {
  // req.body - this is the body from authApiSlice on front end
  const { username, password } = req.body;
  if (!username || !password) {
    // if no username or password, send bad req status (400)
    return res.status(400).json({ message: "All fields are required" });
  }

  // look for user in mongodb database
  const foundUser = await User.findOne({ username }).exec();
  // if didnt find that user, or the foundUser isnt active (employee deactivated for some reason etc)
  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // using bcrypt to compare passwords
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });

  // IF MATCH

  // const roles = Object.values(foundUser.roles);

  // first we are passing in a payload (userInfo object) into the jwt - 'signing' the jwt the the info
  // will have to destructure this aT on the front end
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    // change to 15m for production
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // CLIENT refers to the application that is running on the users device (website/app) thats making req to server
  // hence we send the frontend/client app the aT and the rT inside a cookie
  // RES to be sent back to client
  // sending client rT via cookie (making it secure via httpOnly - which makes this not available to js),
  // cookie is sent with every req and gets automatically applied to all paths, and it is stored in clients web browser
  res.cookie("jwt", refreshToken, {
    //accessible only by web server
    httpOnly: true,
    // https, secure only for production, otherwise i cant test in postman, the rT wont re issue a new accessToken
    // secure: true,
    // cross-site cookie, want cross site availability to be possible if hosting rest api on one server and app on other server
    sameSite: "None",
    // cookie expiry: set to match rT - 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // sending a aT as a js object to be used on front end
  // json data is returned from an Api endpoint, .json() takes the raw res from server
  // and converts to a js object to be easily manipulated and accessed
  res.json({ accessToken });
};

// refresh, /auth/refresh - get, access public - because token has expired
const refresh = (req, res) => {
  // the cookie contains the jwt
  const cookies = req.cookies;
  // optional chaining, if we dont have cookie, and also if we do have cookie but not named jwt
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  // if we do have cookies, set rT to that cookie
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    // rT secret
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      // decoded username should be inside rT
      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      // if we do, create new access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

// reminder on front end when we logout we also need to delete the access token
// extra layer of security so when someone logs out, we remove the token instead of letting it expire
// delete access token on front end and refresh token on backend
// logout, /auth/logout - post, access public - to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  // user carries cookies around
  // if no cookies, or if cookie but no jwt
  if (!cookies?.jwt) return res.sendStatus(204);
  // have to pass in same options when creating cookie (except max age), add secure: true in prod
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
