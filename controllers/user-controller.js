const User = require('../models');

const userControllers = {
  //Get all Users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path:'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(userData => res.json(userData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //Get User by ID
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(userData => res.json(userData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //Create a User
  createUser({ body }, res) {
    User.create(body)
      .then(userData => res.json(userData))
      .catch(err => res.json(err));
  },

  //Update User by ID
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(userData => {
        if (!userData) {
          res.status(404).json({ message: 'No User exists with this ID!' });
          return;
        }
        res.json(userData);
      })
      .catch(err => res.status(400).json(err));
  },

  //Delete a User
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(userData => res.json(userData))
      .catch(err => res.json(err));
  },

  //Add a new friend
  addNewFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.id }, {$push: { friends: params.friendId }}, { new: true })
    .populate({
      path: 'friends',
      select: '-__v'
    })
    .select('-__v')
    .then(userData => {
        if (!userData) {
            res.status(404).json({ message: 'No User exists with this ID!' });
            return;
        }
        res.json(userData);
    })
    .catch(err => res.json(err));
  },

  //Delete a friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.id }, {$pull: { friends: params.friendId }}, { new: true })
    .populate({
      path: 'friends',
      select: '-__v'
    })
    .select('-__v')
    .then(userData => {
        if (!userData) {
            res.status(404).json({ message: 'No User exists with this ID!' });
            return;
        }
        res.json(userData);
    })
    .catch(err => res.status(400).json(err));
  }
};

module.exports = userControllers;