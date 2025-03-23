import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { validateUser } from "../1_Server/productModule.js";


passport.use(
    new LocalStrategy(
      function (username, password, cb) {
        process.nextTick(async function () {
          
          console.log("Attempting login for:", username);

          const user = await validateUser(username, password);
          if (!user) { 
            console.log("Login failed: Invalid credentials");

            return cb(null, false, 
              { message: 'Incorrect username or password.' }); 
          }
          else {
            console.log("Login successful:", user.username);

            return cb(null, user);  
          }
    
        });
      }
    )
  );


// Serialize user information
passport.serializeUser((user, cb) => {
    console.log("Serialize", user);
    cb(null, {
      id: user.id,
      name: user.name,
      role: user.role
    });
  });
  
  // Deserialize user information
  passport.deserializeUser((obj, cb) => {
    console.log("DeSerialize", obj);
    cb(null, obj);
  });

export default passport;
