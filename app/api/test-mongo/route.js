import connectDb from "../../lib/mongodb"; // Adjust the path if necessary
import User from "../../models/User"; // Adjust the path if necessary

// POST handler
export async function POST(req) {
  await connectDb();

  try {
    const user = new User({
      name: "John Doe",
      email: "johnnn.doe@example.com",
    });
    await user.save();

    return new Response(JSON.stringify({ message: "User created", user }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
