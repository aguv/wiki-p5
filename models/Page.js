const Sequelize = require('sequelize');
const db = require('../db');
const User = require('./User');

class Page extends Sequelize.Model {};

Page.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        urlTitle: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('open', 'closed'),
        },
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        route: {
            type: Sequelize.VIRTUAL,
            get() {
                return `/wiki/${this.urlTitle}`;
            }
        },
        tags: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false
        }
    }, 
    { sequelize: db, modelName: 'page' });

Page.addHook("beforeValidate", function(page, options) {
    if (page.title) {
        // Remueve todos los caracteres no-alfanuméricos 
        // y hace a los espacios guiones bajos. 
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
        options.fields.push('urlTitle');
      } else {
        page.urlTitle = Math.random().toString(36).substring(2, 7);
    }
});

Page.findByTag = async function(tags) {
    return await this.findAll({
        where: {
            [Sequelize.Op.or]: [                                 
              {
                tags: { [Sequelize.Op.contains]: tags },                                         
              },
            ],
          },   
    });
};

Page.prototype.findBySimilar = function() {
    return Page.findAll({
        where : {
            id: {
                [Sequelize.Op.not]: this.id
            },
            tags: {
                [Sequelize.Op.overlap]: this.tags 
            }
        }
    })
}

Page.belongsTo(User, { as: 'author' });

module.exports = Page;