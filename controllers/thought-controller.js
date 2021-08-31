const { Thought, User } = require('../models');

// Controller for thoughts/ posts
const thoughtsController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 })
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: "comments",
            select: "-__v",
        })
        .select("-__v")
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "No thought with this ID exists. "});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createThought({ params, body }, res) {
        console.log(params);
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then((dbUserData) => {
            console.log(dbUserData);
            if(!dbUserData) {
                res.status(404).json({ message: "No user with this ID exists. "});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body }},
            { new: true, runValidators: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "No thought with this ID exists." });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },

    updateThought({ params, body }, res) {
        thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "No thought with this ID exists." });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "No thought with this ID exists." });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },

    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId }}},
            { new: true, runValidators: true }
        )
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({ message: "No reaction with this ID exists." });
                return;
            }
            res.json({ message: "Reaction has been deleted." });
        })
        .catch((err) => res.json(err));
    },
};

module.exports = thoughtsController;