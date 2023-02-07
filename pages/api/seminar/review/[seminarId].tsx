import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

// return the review written by current user.
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const {
      query: {seminarId},
      session: { user }
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const currentSeminar = await client.seminar.findUnique({
      where: { 
        id: +seminarId,
      }
    });

    const review = await client.review.findFirst({
      where: {
        writtenBy:{
          id: currentUser.id,
        },
        reviewFor: {
          id: currentSeminar.id,
        },
      },      
    })

    // console.log(review)

    res.json({
      ok: true,
      review,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);