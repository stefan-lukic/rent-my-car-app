import mongoose from 'mongoose';

const shouldApply = process.argv.includes('--apply');
const mongoUri = process.env.MONGODB_URI;

async function main() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  await mongoose.connect(mongoUri);

  try {
    const users = mongoose.connection.collection('users');

    const filter = {
      emailVerified: { $exists: false },
      emailVerificationToken: { $exists: false },
    };

    const count = await users.countDocuments(filter);

    console.log(
      `Found ${count} existing users without the emailVerified field.`
    );

    if (!shouldApply) {
      console.log(
        'Dry run only. Run again with --apply to perform the migration.'
      );
      return;
    }

    const result = await users.updateMany(filter, {
      $set: {
        emailVerified: new Date(),
      },
    });

    console.log(
      `Migration complete. Matched: ${result.matchedCount}, updated: ${result.modifiedCount}.`
    );
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
