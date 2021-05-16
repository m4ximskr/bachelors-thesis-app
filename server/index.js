const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {mongoose} = require('./db/mongoose');
const {List} = require('./db/models/list.model');
const {User} = require('./db/models/user.model');
const {Answer} = require('./db/models/answer.model');
const {Star} = require('./db/models/star.model');

const moment = require('moment');
const _ = require('lodash');



app.use('*',(req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
  res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
  next();
});


const authenticate = (req, res, next) => {
  let token = req.header('x-access-token');

  // verify the JWT
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) {
      // there was an error
      // jwt is invalid - * DO NOT AUTHENTICATE *
      res.status(401).send(err);
    } else {
      // jwt is valid
      req.user_id = decoded._id;
      next();
    }
  });
}

// Verify Refresh Token Middleware (which will be verifying the session)
const verifySession = (req, res, next) => {
  // grab the refresh token from the request header
  let refreshToken = req.header('x-refresh-token');

  // grab the _id from the request header
  let _id = req.header('_id');

  User.findByIdAndToken(_id, refreshToken).then((user) => {
    if (!user) {
      // user couldn't be found
      return Promise.reject({
        'error': 'User not found. Make sure that the refresh token and user id are correct'
      });
    }


    // if the code reaches here - the user was found
    // therefore the refresh token exists in the database - but we still have to check if it has expired or not

    req.user_id = user._id;
    req.userObject = user;
    req.refreshToken = refreshToken;

    let isSessionValid = false;

    user.sessions.forEach((session) => {
      if (session.token === refreshToken) {
        // check if the session has expired
        if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
          // refresh token has not expired
          isSessionValid = true;
        }
      }
    });

    if (isSessionValid) {
      // the session is VALID - call next() to continue with processing this web request
      next();
    } else {
      // the session is not valid
      return Promise.reject({
        'error': 'Refresh token has expired or the session is invalid'
      })
    }

  }).catch((e) => {
    res.status(401).send(e);
  })
}


// const changePassword = async (req, rex, next) => {
//   const userID = req.params.id;
//   const salt = await bcrypt.genSalt(10);
//   const password = await bcrypt.hash(req.body.password, salt);
//
// }
//



app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.get('/questions/list', (req, res) => {
  const {search, filter, page, size, userID} = req.query;
  let searchObj = {};
  if (search) {
    searchObj.title = {$regex : `.*${search}.*`};
  }
  if (filter) {
    searchObj.type = filter
  }

  if (userID) {
    searchObj.user_id = userID;
  }

  List.find(searchObj).sort( { created_at: -1 } ).skip((+page - 1) * size).limit(+size).then((list) => {
    res.send(list);
  })
});

app.get('/questions/:id', async (req, res) => {
  const question = await List.findOne({_id: req.params.id});
  const answers = await Answer.find({question_id: req.params.id}).sort( { created_at: -1 } );
  const answersIDs = answers.map(answer => answer._id);
  const stars = await Star.find({answer_id: { $in: answersIDs}})
  const user = await User.findOne({_id: question.user_id});

  const preparedAnswers = answers.map(answer => {
    return {
      ...answer._doc,
      stars: stars.filter(star => _.isEqual(star.answer_id, answer._id))
    }
  });

  res.send({question: {...question._doc, user_name: user.name}, answers: preparedAnswers});
})


app.post('/questions/add', authenticate, (req, res) => {
  const {title, desc, type} = req.body;

  console.log('TITLE', req.body);

  User.findOne({_id: req.user_id}).then((user) => {
    console.log('user', user);
    const newList = new List({
      title: title, desc: desc, created_at: moment().unix(), type: type, user_id: req.user_id,
    })

    newList.save().then((listDoc) => {
      res.send(listDoc);
    })
  })
})

app.patch('/questions/:id', authenticate, (req, res) => {
  List.findOneAndUpdate(
    {_id: req.params.id, user_id: req.user_id},
    {$set: req.body},
    {new: true}
    ).then((question) => {
    res.send(question);
  })
})

app.delete('/questions/:id', authenticate, (req, res) => {
  // We want to delete the specified list (document with id in the URL)
  List.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user_id
  }).then((removedQuestion) => {
    res.send(removedQuestion);

    // delete all the tasks that are in the deleted list
    const removedQuestionID = removedQuestion['_id'];

    Answer.deleteMany({
      question_id: removedQuestionID
    }).then(() => {
      console.log("Answers from " + removedQuestionID + " were deleted!");
    })
  })
});


app.post('/answers/add', authenticate, (req, res) => {
  const {qID, text} = req.body;

  User.findOne({_id: req.user_id}).then((user) => {
    const newAnswer = new Answer({
      text, created_at: moment().unix(), question_id: qID, user_id: req.user_id, user_name: user.name
    });

    newAnswer.save().then((listDoc) => {
      res.send(listDoc);
    })
  })
})

app.delete('/answers/:id', authenticate, (req, res) => {

  Answer.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user_id
  }).then((removedAnswer) => {
    // res.send(removedAnswer);

    const removedAnswerID = removedAnswer['_id'];

    Star.deleteMany({
      answer_id: removedAnswerID
    }).then(() => {
      console.log("Answers from " + removedAnswerID + " were deleted!");
    })

    res.status(200).json(removedAnswer);
  })
})

app.post('/stars/add', authenticate, (req, res) => {
  const {answerID} = req.body;

  User.findOne({_id: req.user_id}).then((user) => {
    const newStar = new Star({
      answer_id: answerID, user_id: req.user_id
    });

    newStar.save().then((listDoc) => {
      res.send(listDoc);
    })
  })
})

app.delete('/stars/:id', authenticate, (req, res) => {

  Star.findOneAndRemove({
    answer_id: req.params.id,
    user_id: req.user_id
  }).then((removedStar) => {
    res.send(removedStar);
  })
})

app.get('/users', authenticate, (req, res) => {
  const {search} = req.query;
  let searchObj = {};
  if (search) {
    searchObj.name = {$regex : `.*${search}.*`};
  }

  User.find(searchObj).then((list) => {
    res.status(200).send(list);
  }).catch((e) => {
    res.status(400).send(e);
  })
})



app.post('/users/register', (req, res) => {
  // User sign up

  let body = {...req.body, type: 'default'};
  let newUser = new User(body);

  newUser.save().then(() => {
    return newUser.createSession();
  }).then((refreshToken) => {
    // Session created successfully - refreshToken returned.
    // now we geneate an access auth token for the user

    return newUser.generateAccessAuthToken().then((accessToken) => {
      // access auth token generated successfully, now we return an object containing the auth tokens
      return { accessToken, refreshToken }
    });
  }).then((authTokens) => {
    // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
    res
      .header('x-refresh-token', authTokens.refreshToken)
      .header('x-access-token', authTokens.accessToken)
      .send(newUser);
  }).catch((e) => {
    console.log(e);
    res.status(400).send(e);
  })
})

app.patch('/users/update', authenticate, async (req, res) => {
  const {name, email} = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate({_id: req.user_id}, {name, email}, {new: true});
    return res.status(200).json(updatedUser)
  } catch (e) {
    return res.status(400).send(e);
  }
})

app.patch('/users/update/password', authenticate, async (req, res) => {
  console.log('password', req.body.password);

  try {
    const foundUser = await User.findOne({ _id: req.user_id});
    const correctPass = bcrypt.compareSync(req.body.password, foundUser.password);

    if (!correctPass) {
      throw 'Nesanaca atajuninat';
    }
    const equalPasswords = bcrypt.compareSync(req.body.newPassword, foundUser.password);

    if (equalPasswords) {
      throw 'Jauna parole sakrit ar veco';
    }
    console.log(equalPasswords);
    // if (_.isEqual(newPassword, foundUser.password)) {
    //   return res.status(400).send('passwords are the same');
    // }
    // console.log('password', newPassword);
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.newPassword, salt);
    const userPassword = await User.findByIdAndUpdate({_id: req.user_id}, {password: hashedPass}, {new: true});
    // console.log(userPassword);
    return res.status(200).json()
  } catch (e) {
    return res.status(400).send(e);
  }
})

app.delete('/users/:id', authenticate, async (req, res) => {
  const userID = req.params.id;
  try {
    await User.findOneAndRemove({_id: userID});
    await List.findOneAndRemove({user_id: userID});
    await Answer.findOneAndRemove({user_id: userID});
    await Star.findOneAndRemove({user_id: userID});
    return res.status(200).json();
  } catch (e) {
    return res.status(400).send(e);
  };
})


/**
 * POST /users/login
 * Purpose: Login
 */
app.post('/users/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password).then((user) => {
    return user.createSession().then((refreshToken) => {
      // Session created successfully - refreshToken returned.
      // now we geneate an access auth token for the user

      return user.generateAccessAuthToken().then((accessToken) => {
        // access auth token generated successfully, now we return an object containing the auth tokens
        return { accessToken, refreshToken }
      });
    }).then((authTokens) => {
      // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
      res
        .header('x-refresh-token', authTokens.refreshToken)
        .header('x-access-token', authTokens.accessToken)
        .send(user);
    })
  }).catch((e) => {
    res.status(400).send(e);
  });
})

app.get('/users/me', authenticate, async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.user_id});
    return res.status(200).json(foundUser);
  } catch (e) {
    res.status(400).send(e);
  }
})


/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
  // we know that the user/caller is authenticated and we have the user_id and user object available to us
  req.userObject.generateAccessAuthToken().then((accessToken) => {
    res.header('x-access-token', accessToken).send({ accessToken });
  }).catch((e) => {
    res.status(400).send(e);
  });
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
