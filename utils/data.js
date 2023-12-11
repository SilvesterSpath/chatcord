const moment = require('moment');
const { ObjectId } = require('mongodb');

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

// Deleting an entry
const deleteMessage = async (client, id) => {
  const objectId = new ObjectId(id);
  const result = await (await client)
    .collection('messages')
    .findOne({ _id: objectId });

  if (result) {
    try {
      // Delete message from MongoDB
      await (await client).collection('messages').deleteOne({ _id: objectId });
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error('Message not found');
  }
};

module.exports = {
  fetchMessages,
  insertMessage,
  deleteMessage,
};
