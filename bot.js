const Discord = require('discord.js');
const client = new Discord.Client();
const Api = require('./api');

var api = new Api();
var allItems = [];

function checkMessage() {
    client.on('message', msg => {
        let apiResponse = "";

        switch (msg.content) {
            case '!getStoreItems':
                api.getStoreItems
                    .then(function (response) {
                        // handle success
                        apiResponse = response.data;
                    })
                    .catch(function (error) {
                        // handle error
                        msg.reply('An error occured, try later');
                    })
                    .then(function () {
                        if ('error' in apiResponse) {
                            msg.reply(' An error occured, try later');
                        } else {
                            let reply = ' you can buy all theses items \n\n';
                            for (let i = 0; i < apiResponse.items.length; i++) {
                                reply += ` **${apiResponse.items[i].name}** - ${apiResponse.items[i].cost} vbucks \n`;
                            }
                            msg.reply(reply);
                        }
                    });
                break;

            case '!getUpcomingItems':
                api.getUpcomingItems
                    .then(function (response) {
                        // handle success
                        apiResponse = response.data;
                    })
                    .catch(function (error) {
                        // handle error
                        msg.reply(' An error occured, try later');
                    })
                    .then(function () {
                        if ('error' in apiResponse) {
                            msg.reply(' An error occured, try later');
                        } else {                        
                            let reply = ' this is the next availables items \n\n';
                            for (let i = 0; i < apiResponse.items.length; i++) {
                                reply += ` **${apiResponse.items[i].name}** - ${apiResponse.items[i].cost} vbucks \n`;
                            }
                            msg.reply(reply);
                        }
                    });
                break;

            default:
                break;
        }

        if (msg.content.indexOf('!getItemInfo') > -1) {
            let item = msg.content.substring(msg.content.indexOf(' ') + 1);
            let i = 0;
            while (allItems[i].name !== item && i < allItems.length - 1) {
                i++;
            }
            idItem = allItems[i].identifier;

            api.getItemInfos(idItem)
                .then(function (response) {
                    // handle success
                    apiResponse = response.data;
                })
                .catch(function (error) {
                    // handle error
                    msg.reply(' An error occured, try later');
                })
                .then(function () {
                    if ('error' in apiResponse) {
                        msg.reply(` This item doesn't exist`);
                    } else {
                        let reply = `\n**${item} : ** ${apiResponse.description}\n`;
                        reply += `**cost :** ${apiResponse.cost}\n**type :** ${apiResponse.type}\n**rarity :** ${apiResponse.rarity}\n`;
                        const attachment = new Discord.Attachment(apiResponse.images.background);
                        msg.reply(reply, {
                            file: attachment
                        });
                    }
                });
        }

        if(msg.content.indexOf('!getUserInfo') > -1) {
            let user = msg.content.substring(msg.content.indexOf(' ') + 1); 
            api.getUserId(user)
                .then(function (response) {
                    // handle success
                    apiResponse = response.data;
                })
                .catch(function (error) {
                    // handle error
                    msg.reply('An error occured, try later');
                })
                .then(function () {
                    if('error' in apiResponse) {
                        msg.reply(` This user doesn't exist`);
                    } else {
                        idUser = apiResponse.uid;
                        platforms = apiResponse.platforms;
                        results = [];

                        for (let i = 0; i < platforms.length; i++) {
                            api.getUserStats(idUser, platforms[i])
                                .then(function (response) {
                                    // handle success
                                    apiResponse = response.data;
                                })
                                .catch(function (error) {
                                    // handle error
                                    msg.reply(' An error occured, try later');
                                })
                                .then(function () {
                                    results.push[apiResponse];
                                    reply = ` This is the stats for ${apiResponse.username} on ${apiResponse.platform}\n`;
                                    Object.keys(apiResponse.stats).forEach(function (key) {
                                        if (key.indexOf('lastmodified') === -1 && key.indexOf('lastupdate') === -1) {
                                            reply += `**${key.replace('_', ' ')} :** ${apiResponse.stats[key]}\n`;
                                        }
                                    });
                                    reply += `\n Stats resume :\n`;
                                    Object.keys(apiResponse.totals).forEach(function (key) {
                                        if (key.indexOf('lastmodified') === -1 && key.indexOf('lastupdate') === -1) {
                                            reply += `**${key.replace('_', ' ')} :** ${apiResponse.totals[key]}\n`;
                                        }
                                    });
                                    msg.reply(reply);
                                });
                        }
                    }
                });
        }
    });
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    api.getAllItems
        .then(function (response) {
            // handle success
            allItems = response.data;
        })
        .catch(function (error) {
            // handle error
            console.error('An error occured, try later');
        })
        .then(function () {
            checkMessage(); 
            console.log('ready!'); 
        })
});

client.login(process.env.BOT_TOKEN);