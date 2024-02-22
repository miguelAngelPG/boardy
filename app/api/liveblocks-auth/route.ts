import { use } from 'react';
import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const liveblocks = new Liveblocks({
  secret: "sk_dev_5vA_4IthDEyjKsuHgYs64FnPpHDtVq8IfqCyavGVyHqXnB10Ukf4aIN6EUrFzIoK",
});

export async function POST(request: Request) {

    const authorization = await auth()
    // Get the current user from your database
    const user = await currentUser()

    // console.log('AUTH_INFO', {
    //     authorization,
    //     user
    // })

    if (!user || !authorization) {
      return new Response("Unauthorized", { status: 401 });
    }


  // Implement your own security, and give the user access to the room/organization.
  // Note: Even if room is defined, we recommend to always use wildcards.
    const { room } = await request.json();

    const board = await convex.query(api.board.get, { id: room });
    
    // console.log('AUTH_INFO', {
    //     room,
    //     board,
    //     boardOrgId: board?.orgId,
    //     userOrgId: authorization.orgId
    // })

    // if (board?.orgId !== authorization.orgId) {
    //     return new Response("Unauthorized", { status: 401 });
    // }

    const userInfo = {
        name: user.firstName || 'Teammeate',
        picture: user.imageUrl,
    };
    
    // console.log({ userInfo })
    const session = liveblocks.prepareSession(
        user.id,
        { userInfo },
    )

    if (room) {
        session.allow(room, session.FULL_ACCESS)
    }

    
    const { status, body } = await session.authorize()
    // console.log({ status, body }, 'ALLOWED')

    return new Response(body, { status })
}
