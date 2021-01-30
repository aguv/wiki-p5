const Sequelize = require('sequelize');
const db = require('../db');

class User extends Sequelize.Model {};

User.init({
        author: {
            type: Sequelize.STRING,
            allowNull: false
        }, 
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            /* validate: {
                isEmail: true
            } */
        }
    },
    { sequelize: db, modelName: 'user' });


module.exports = User;