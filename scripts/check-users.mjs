import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI;

async function main() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  await mongoose.connect(mongoUri);

  try {
    const users = mongoose.connection.collection('users');

    const total = await users.countDocuments({});
    const verified = await users.countDocuments({
      emailVerified: { $exists: true, $ne: null },
    });
    const waitingForLink = await users.countDocuments({
      $or: [{ emailVerified: null }, { emailVerified: { $exists: false } }],
      emailVerificationToken: { $exists: true, $ne: null },
    });
    const legacy = await users.countDocuments({
      emailVerified: { $exists: false },
      emailVerificationToken: { $exists: false },
    });

    console.log('--- User verification status ---');
    console.log(`Total users:            ${total}`);
    console.log(`Verified (has date):    ${verified}`);
    console.log(`Waiting for link:       ${waitingForLink}`);
    console.log(`Legacy (no fields):     ${legacy}`);
    console.log('--------------------------------');
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error('Check failed:', error);
  process.exitCode = 1;
});
