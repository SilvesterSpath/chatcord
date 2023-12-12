const moment = require('moment');
const { ObjectId } = require('mongodb');

// Function to validate ObjectId format
const isValidObjectId = (id) => {
  // Validate id here based on the expected format
  // For example, you can check if it's a valid 24-character hex string
  return /^[0-9a-fA-F]{24}$/.test(id);
};

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
    const result = await (await client).collection('messages').insertOne({
      username,
      room,
      text,
      time: moment().format('YYYY-MM-DD h:mm a'),
    });
    // Retrieve the ObjectId of the newly inserted document
    const insertedId = result.insertedId;
    console.log('Message inserted with ObjectId:', insertedId);
    return insertedId;
  } catch (error) {
    console.error(error);
  }
};

// Deleting an entry
const deleteMessage = async (client, id) => {
  // Validate id before creating ObjectId
  console.log('data side', await id);
  if (!isValidObjectId(await id)) {
    console.error('Invalid ObjectId format');
    return;
  } else {
    const objectId = new ObjectId(await id);
    const result = await (await client)
      .collection('messages')
      .findOne({ _id: objectId });

    if (result) {
      try {
        // Delete message from MongoDB
        await (await client)
          .collection('messages')
          .deleteOne({ _id: objectId });
        console.log('Message deleted', objectId);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Message not found');
    }
  }
};

module.exports = {
  fetchMessages,
  insertMessage,
  deleteMessage,
};
