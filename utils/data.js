const moment = require('moment');

// Retrieving data from database
const fetchMessages = async (client, socket, room) => {
  try {
    // Retrieve messages from MongoDB for a specific room
    const messages = await (await client)
      .collection('messages')
      .find({ room: room })
      .toArray();

    // Do something with the retrieved messages
    socket.emit('messages', messages);
  } catch (error) {
    console.error(error);
  }
};

// Writing data into database
const insertMessage = async (client, username, room, text) => {
  try {
    // Insert message to MongoDB
    await (await client).collection('messages').insertOne({
      username,
      room,
      text,
      time: moment().format('YYYY-MM-DD h:mm a'),
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  fetchMessages,
  insertMessage,
};
